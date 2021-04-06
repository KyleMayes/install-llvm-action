import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import * as https from "https";
import * as path from "path";

interface Options {
  version: string,
  forceVersion: boolean,
  ubuntuVersion?: string,
  directory: string,
  cached: boolean,
}

//================================================
// Version
//================================================

/**
 * Gets the specific and minimum LLVM versions that can be used to refer to the
 * supplied specific LLVM versions (e.g., `3`, `3.5`, `3.5.2` for `3.5.2`).
 */
function getVersions(specific: string[]): Set<string> {
  const versions = new Set(specific);

  for (const version of specific) {
    versions.add(/^\d+/.exec(version)![0]);
    versions.add(/^\d+\.\d+/.exec(version)![0]);
  }

  return versions;
}

/** The specific and minimum LLVM versions supported by this action. */
const VERSIONS: Set<string> = getVersions([
  "3.5.0", "3.5.1", "3.5.2",
  "3.6.0", "3.6.1", "3.6.2",
  "3.7.0", "3.7.1",
  "3.8.0", "3.8.1",
  "3.9.0", "3.9.1",
  "4.0.0", "4.0.1",
  "5.0.0", "5.0.1", "5.0.2",
  "6.0.0", "6.0.1",
  "7.0.0", "7.0.1",
  "7.1.0",
  "8.0.0", "8.0.1",
  "9.0.0", "9.0.1",
  "10.0.0", "10.0.1",
  "11.0.0", "11.0.1", "11.1.0",
]);

/** Gets the ordering of two (specific or minimum) LLVM versions. */
function compareVersions(left: string, right: string): -1 | 0 | 1 {
  const leftComponents = left.split(".").map(c => parseInt(c, 10));
  const rightComponents = right.split(".").map(c => parseInt(c, 10));

  const length = Math.max(leftComponents.length, rightComponents.length);
  for (let i = 0; i < length; ++i) {
    const leftComponent = leftComponents[i] || 0;
    const rightComponent = rightComponents[i] || 0;
    if (leftComponent > rightComponent) {
      return 1;
    } else if (leftComponent < rightComponent) {
      return -1;
    }
  }

  return 0;
}

/**
 * Gets the specific LLVM versions supported by this action compatible with the
 * supplied (specific or minimum) LLVM version in descending order of release
 * (e.g., `5.0.2`, `5.0.1`, and `5.0.0` for `5`).
 */
function getSpecificVersions(version: string): string[] {
  return Array.from(VERSIONS)
    .filter(v => /^\d+\.\d+\.\d+$/.test(v) && v.startsWith(version))
    .sort()
    .reverse();
}

//================================================
// URL
//================================================

/** Gets a LLVM download URL for GitHub. */
function getGitHubUrl(version: string, prefix: string, suffix: string): string {
  const file = `${prefix}${version}${suffix}`;
  return `https://github.com/llvm/llvm-project/releases/download/llvmorg-${version}/${file}`;
}

/** Gets a LLVM download URL for https://releases.llvm.org. */
function getReleaseUrl(version: string, prefix: string, suffix: string): string {
  const file = `${prefix}${version}${suffix}`;
  return `https://releases.llvm.org/${version}/${file}`;
}

/** The LLVM versions that were never released for the Darwin platform. */
const DARWIN_MISSING: Set<string> = new Set([
  "3.5.1",
  "3.6.1",
  "3.6.2",
  "3.7.1",
  "3.8.1",
  "3.9.1",
  "6.0.1",
  "7.0.1",
  "7.1.0",
  "8.0.1",
  "11.0.1",
  "11.1.0",
]);

/** Gets an LLVM download URL for the Darwin platform. */
function getDarwinUrl(version: string, options: Options): string | null {
  if (!options.forceVersion && DARWIN_MISSING.has(version)) {
    return null;
  }

  const darwin = version === "9.0.0" ? "-darwin-apple" : "-apple-darwin";
  const prefix = "clang+llvm-";
  const suffix = `-x86_64${darwin}.tar.xz`;
  if (compareVersions(version, "9.0.1") >= 0) {
    return getGitHubUrl(version, prefix, suffix);
  } else {
    return getReleaseUrl(version, prefix, suffix);
  }
}

/** The (latest) Ubuntu versions for each LLVM version. */
const UBUNTU: { [key: string]: string } = {
  "3.5.0": "-ubuntu-14.04",
  "3.5.1": "",
  "3.5.2": "-ubuntu-14.04",
  "3.6.0": "-ubuntu-14.04",
  "3.6.1": "-ubuntu-14.04",
  "3.6.2": "-ubuntu-14.04",
  "3.7.0": "-ubuntu-14.04",
  "3.7.1": "-ubuntu-14.04",
  "3.8.0": "-ubuntu-16.04",
  "3.8.1": "-ubuntu-16.04",
  "3.9.0": "-ubuntu-16.04",
  "3.9.1": "-ubuntu-16.04",
  "4.0.0": "-ubuntu-16.04",
  "5.0.0": "-ubuntu16.04",
  "5.0.1": "-ubuntu-16.04",
  "5.0.2": "-ubuntu-16.04",
  "6.0.0": "-ubuntu-16.04",
  "6.0.1": "-ubuntu-16.04",
  "7.0.0": "-ubuntu-16.04",
  "7.0.1": "-ubuntu-18.04",
  "7.1.0": "-ubuntu-14.04",
  "8.0.0": "-ubuntu-18.04",
  "9.0.0": "-ubuntu-18.04",
  "9.0.1": "-ubuntu-16.04",
  "10.0.0": "-ubuntu-18.04",
  "10.0.1": "-ubuntu-16.04",
  "11.0.0": "-ubuntu-20.04",
  "11.0.1": "-ubuntu-16.04",
  "11.1.0": "-ubuntu-16.04",
};

/** The latest supported LLVM version for the Linux (Ubuntu) platform. */
const MAX_UBUNTU: string = "11.0.0";

/** Gets an LLVM download URL for the Linux (Ubuntu) platform. */
function getLinuxUrl(version: string, options: Options): string | null {
  let ubuntu;
  if (options.ubuntuVersion) {
    ubuntu = `-ubuntu-${options.ubuntuVersion}`;
  } else if (options.forceVersion) {
    ubuntu = UBUNTU[MAX_UBUNTU];
  } else {
    ubuntu = UBUNTU[version];
  }

  if (!ubuntu) {
    return null;
  }

  const prefix = "clang+llvm-";
  const suffix = `-x86_64-linux-gnu${ubuntu}.tar.xz`;
  if (compareVersions(version, "9.0.1") >= 0) {
    return getGitHubUrl(version, prefix, suffix);
  } else {
    return getReleaseUrl(version, prefix, suffix);
  }
}

/** The LLVM versions that were never released for the Windows platform. */
const WIN32_MISSING: Set<string> = new Set([
  "10.0.1",
]);

/** Gets an LLVM download URL for the Windows platform. */
function getWin32Url(version: string, options: Options): string | null {
  if (!options.forceVersion && WIN32_MISSING.has(version)) {
    return null;
  }

  const prefix = "LLVM-";
  const suffix = compareVersions(version, "3.7.0") >= 0 ? "-win64.exe" : "-win32.exe";
  if (compareVersions(version, "9.0.1") >= 0) {
    return getGitHubUrl(version, prefix, suffix);
  } else {
    return getReleaseUrl(version, prefix, suffix);
  }
}

/** Gets an LLVM download URL. */
function getUrl(platform: string, version: string, options: Options): string | null {
  switch (platform) {
    case "darwin":
      return getDarwinUrl(version, options);
    case "linux":
      return getLinuxUrl(version, options);
    case "win32":
      return getWin32Url(version, options);
    default:
      return null;
  }
}

/** Gets the most recent specific LLVM version for which there is a valid download URL. */
function getSpecificVersionAndUrl(platform: string, options: Options): [string, string] {
  if (options.forceVersion) {
    return [options.version, getUrl(platform, options.version, options)!];
  }

  if (!VERSIONS.has(options.version)) {
    throw new Error(`Unsupported target! (platform='${platform}', version='${options.version}')`);
  }

  for (const specificVersion of getSpecificVersions(options.version)) {
    const url = getUrl(platform, specificVersion, options);
    if (url) {
      return [specificVersion, url];
    }
  }

  throw new Error(`Unsupported target! (platform='${platform}', version='${options.version}')`);
}

//================================================
// Action
//================================================

async function install(options: Options): Promise<void> {
  const platform = process.platform;
  const [specificVersion, url] = getSpecificVersionAndUrl(platform, options);
  core.setOutput("version", specificVersion);

  console.log(`Installing LLVM and Clang ${options.version} (${specificVersion})...`);
  console.log(`Downloading and extracting '${url}'...`);
  const archive = await tc.downloadTool(url);

  let exit;
  if (platform === "win32") {
    exit = await exec.exec("7z", ["x", archive, `-o${options.directory}`]);
  } else {
    await io.mkdirP(options.directory);
    exit = await exec.exec("tar", ["xf", archive, "-C", options.directory, "--strip-components=1"]);
  }

  if (exit !== 0) {
    throw new Error("Could not extract LLVM and Clang binaries.");
  }

  console.log(`Installed LLVM and Clang ${options.version} (${specificVersion})!`);
}

async function run(options: Options): Promise<void> {
  if (options.cached) {
    console.log(`Using cached LLVM and Clang ${options.version}...`);
  } else {
    await install(options);
  }

  const bin = path.resolve(path.join(options.directory, "bin"));
  const lib = path.resolve(path.join(options.directory, "lib"));

  core.addPath(bin);

  const ld = process.env.LD_LIBRARY_PATH;
  const dyld = process.env.DYLD_LIBRARY_PATH;

  core.exportVariable("LD_LIBRARY_PATH", `${lib}${path.delimiter}${ld}`);
  core.exportVariable("DYLD_LIBRARY_PATH", `${lib}${path.delimiter}${dyld}`);
}

async function test(platform: string, options: Options): Promise<void> {
  const [specificVersion, url] = getSpecificVersionAndUrl(platform, options);
  console.log(`Version: ${options.version} => ${specificVersion}`);
  console.log(`Force version: ${options.forceVersion}`);
  console.log(`Ubuntu version: ${options.ubuntuVersion || "<default>"}`);
  console.log(`URL: ${url}`);
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Content-Length: ${res.headers["content-length"]}`)
      if (res.statusCode && res.statusCode >= 200 && res.statusCode <= 399) {
        resolve();
      } else {
        reject("Failed to download LLVM and Clang binaries.");
      }
    });
  });
}

try {
  const start = process.argv.indexOf("test");
  if (start === -1) {
    const version = core.getInput("version");
    const forceVersion = (core.getInput("force-version") || "").toLowerCase() === "true";
    const ubuntuVersion = core.getInput("ubuntu-version");
    const directory = core.getInput("directory");
    const cached = (core.getInput("cached") || "").toLowerCase() === "true";
    const options = { version, forceVersion, ubuntuVersion, directory, cached };
    run(options);
  } else {
    const platform = process.argv[start + 1];
    const version = process.argv[start + 2];
    const forceVersion = (process.argv[start + 3] || "").toLowerCase() === "true";
    const ubuntuVersion = process.argv[start + 4];
    const options = { version, forceVersion, ubuntuVersion, directory: "", cached: false };
    test(platform, options);
  }
} catch (error) {
  console.error(error.stack);
  core.setFailed(error.message);
}
