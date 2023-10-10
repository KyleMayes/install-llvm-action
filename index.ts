import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import * as path from "path";

export interface Options {
  version: string,
  directory: string,
  forceVersion: boolean,
  ubuntuVersion?: string,
  cached: boolean,
  downloadUrl?: string,
  auth?: string,
  env: boolean,
}

function getOptions(): Options {
  return {
    version: core.getInput("version"),
    forceVersion: (core.getInput("force-version") || "").toLowerCase() === "true",
    ubuntuVersion: core.getInput("ubuntu-version"),
    directory: core.getInput("directory"),
    cached: (core.getInput("cached") || "").toLowerCase() === "true",
    downloadUrl: core.getInput("download-url"),
    auth: core.getInput("auth"),
    env: (core.getInput("env") ?? "").toLowerCase() === "true",
  };
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
  "12.0.0", "12.0.1",
  "13.0.0", "13.0.1",
  "14.0.0", "14.0.1", "14.0.2", "14.0.3", "14.0.4", "14.0.5", "14.0.6",
  "15.0.0", "15.0.1", "15.0.2", "15.0.3", "15.0.4", "15.0.5", "15.0.6", "15.0.7",
  "16.0.0", "16.0.1", "16.0.2", "16.0.3", "16.0.4", "16.0.5", "16.0.6",
  "17.0.1", "17.0.2",
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

/** Gets a LLVM download URL for GitHub release mirror like artifactory. */
function getDownloadUrl(baseUrl: string, version: string, prefix: string, suffix: string): string {
  const file = `${prefix}${version}${suffix}`;
  return `${baseUrl}/${file}`;
}

/** Gets a LLVM download URL for GitHub. */
function getGitHubUrl(version: string, prefix: string, suffix: string): string {
  return getDownloadUrl(`https://github.com/llvm/llvm-project/releases/download/llvmorg-${version}`, version, prefix, suffix);
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
  "12.0.1",
  "15.0.3",
  "15.0.4",
  "15.0.5",
  "15.0.6",
  "16.0.0",
  "16.0.1",
  "16.0.2",
  "16.0.3",
  "16.0.4",
  "16.0.5",
  "16.0.6",
  "17.0.1",
  "17.0.2",
]);

/** The Darwin version suffixes which are applied for some releases. */
const DARWIN_VERSIONS: { [key: string]: string } = {
  "15.0.7": "21.0",
};

/** Gets an LLVM download URL for the Darwin platform. */
function getDarwinUrl(version: string, options: Options): string | null {
  if (!options.forceVersion && DARWIN_MISSING.has(version)) {
    return null;
  }

  const darwin = version === "9.0.0" ? "-darwin-apple" : "-apple-darwin";
  const prefix = "clang+llvm-";
  const suffix = `-x86_64${darwin}${DARWIN_VERSIONS[version] ?? ""}.tar.xz`;
  if (options.downloadUrl) {
    return getDownloadUrl(options.downloadUrl, version, prefix, suffix);
  } else if (compareVersions(version, "9.0.1") >= 0) {
    return getGitHubUrl(version, prefix, suffix);
  } else {
    return getReleaseUrl(version, prefix, suffix);
  }
}

/** The LLVM versions that were never released for the Linux platform. */
const LINUX_MISSING: Set<string> = new Set([
  "14.0.1",
  "14.0.2",
  "14.0.3",
  "14.0.4",
  "14.0.5",
  "14.0.6",
  "15.0.0",
  "15.0.1",
  "15.0.2",
  "15.0.3",
  "15.0.4",
  "15.0.7",
  "16.0.1",
  "16.0.5",
  "16.0.6",
]);

/**
 * The LLVM versions that should use the last RC version instead of the release
 * version for the Linux (Ubuntu) platform. This is useful when there were
 * binaries released for the Linux (Ubuntu) platform for the last RC version but
 * not for the actual release version.
 */
const UBUNTU_RC: Map<string, string> = new Map([]);

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
  "12.0.0": "-ubuntu-20.04",
  "12.0.1": "-ubuntu-16.04",
  "13.0.0": "-ubuntu-20.04",
  "13.0.1": "-ubuntu-18.04",
  "14.0.0": "-ubuntu-18.04",
  "15.0.5": "-ubuntu-18.04",
  "15.0.6": "-ubuntu-18.04",
  "16.0.0": "-ubuntu-18.04",
  "16.0.2": "-ubuntu-22.04",
  "16.0.3": "-ubuntu-22.04",
  "16.0.4": "-ubuntu-22.04",
  "17.0.2": "-ubuntu-22.04",
};

/** The latest supported LLVM version for the Linux (Ubuntu) platform. */
const MAX_UBUNTU: string = "16.0.0";

/** Gets an LLVM download URL for the Linux (Ubuntu) platform. */
function getLinuxUrl(version: string, options: Options): string | null {
  if (!options.forceVersion && LINUX_MISSING.has(version)) {
    return null;
  }

  const rc = UBUNTU_RC.get(version);
  if (rc) {
    version = rc;
  }

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
export function getSpecificVersionAndUrl(platform: string, options: Options): [string, string] {
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

const DEFAULT_NIX_DIRECTORY = "./llvm";
const DEFAULT_WIN32_DIRECTORY = "C:/Program Files/LLVM";

async function install(options: Options): Promise<void> {
  const platform = process.platform;
  const [specificVersion, url] = getSpecificVersionAndUrl(platform, options);
  core.setOutput("version", specificVersion);

  console.log(`Installing LLVM and Clang ${options.version} (${specificVersion})...`);
  console.log(`Downloading and extracting '${url}'...`);
  const archive = await tc.downloadTool(url, '', options.auth);

  let exit;
  if (platform === "win32") {
    exit = await exec.exec("7z", ["x", archive, `-o${options.directory}`, "-y"]);
  } else {
    await io.mkdirP(options.directory);
    exit = await exec.exec("tar", ["xf", archive, "-C", options.directory, "--strip-components=1"]);
  }

  if (exit !== 0) {
    throw new Error("Could not extract LLVM and Clang binaries.");
  }

  core.info(`Installed LLVM and Clang ${options.version} (${specificVersion})!`);
  core.info(`Install location: ${options.directory}`);
}

async function run(options: Options): Promise<void> {
  if (!options.directory) {
    options.directory =  process.platform === "win32"
      ? DEFAULT_WIN32_DIRECTORY
      : DEFAULT_NIX_DIRECTORY;
  }

  options.directory = path.resolve(options.directory);

  if (options.cached) {
    console.log(`Using cached LLVM and Clang ${options.version}...`);
  } else {
    await install(options);
  }

  const bin = path.join(options.directory, "bin");
  const lib = path.join(options.directory, "lib");

  core.addPath(bin);

  const ld = process.env.LD_LIBRARY_PATH ?? "";
  const dyld = process.env.DYLD_LIBRARY_PATH ?? "";

  core.exportVariable("LLVM_PATH", options.directory);
  core.exportVariable("LD_LIBRARY_PATH", `${lib}${path.delimiter}${ld}`);
  core.exportVariable("DYLD_LIBRARY_PATH", `${lib}${path.delimiter}${dyld}`);

  if (options.env) {
    core.exportVariable("CC", path.join(options.directory, "bin", "clang"));
    core.exportVariable("CXX", path.join(options.directory, "bin", "clang++"));
  }
}

async function main() {
  try {
    await run(getOptions());
  } catch (error: any) {
    console.error(error.stack);
    core.setFailed(error.message);
  }
}

if (!module.parent) {
  main();
}
