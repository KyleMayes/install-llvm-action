import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import * as path from "path";

//================================================
// Version
//================================================

function getVersions(full: string[]): Set<string> {
  const versions = new Set(full);

  for (const version of full) {
    versions.add(/^\d+/.exec(version)![0]);
    versions.add(/^\d+\.\d+/.exec(version)![0]);
  }

  return versions;
}

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
  "11.0.0",
]);

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

function getFullVersions(version: string): string[] {
  return Array.from(VERSIONS)
    .filter(v => /^\d+\.\d+\.\d+$/.test(v) && v.startsWith(version))
    .sort()
    .reverse();
}

//================================================
// URL
//================================================

function getGithubUrl(version: string, prefix: string, suffix: string): string {
  const file = `${prefix}${version}${suffix}`;
  return `https://github.com/llvm/llvm-project/releases/download/llvmorg-${version}/${file}`;
}

function getReleaseUrl(version: string, prefix: string, suffix: string): string {
  const file = `${prefix}${version}${suffix}`;
  return `https://releases.llvm.org/${version}/${file}`;
}

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
]);

function getDarwinUrl(version: string): string | null {
  if (DARWIN_MISSING.has(version)) {
    return null;
  }

  const darwin = version === "9.0.0" ? "-darwin-apple" : "-apple-darwin";
  const prefix = "clang+llvm-";
  const suffix = `-x86_64${darwin}.tar.xz`;
  if (compareVersions(version, "9.0.1") >= 0) {
    return getGithubUrl(version, prefix, suffix);
  } else {
    return getReleaseUrl(version, prefix, suffix);
  }
}

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
  "10.0.1": "-ubuntu-18.04",
  "11.0.0": "-ubuntu-20.04",
};

function getLinuxUrl(version: string): string | null {
  const ubuntu = UBUNTU[version];
  if (!ubuntu) {
    return null;
  }

  const prefix = "clang+llvm-";
  const suffix = `-x86_64-linux-gnu${ubuntu}.tar.xz`;
  if (compareVersions(version, "9.0.1") >= 0) {
    return getGithubUrl(version, prefix, suffix);
  } else {
    return getReleaseUrl(version, prefix, suffix);
  }
}

function getWin32Url(version: string): string | null {
  const prefix = "LLVM-";
  const suffix = compareVersions(version, "3.7.0") >= 0 ? "-win64.exe" : "-win32.exe";
  if (compareVersions(version, "9.0.1") >= 0) {
    return getGithubUrl(version, prefix, suffix);
  } else {
    return getReleaseUrl(version, prefix, suffix);
  }
}

function getUrl(platform: string, version: string): string | null {
  switch (platform) {
    case "darwin":
      return getDarwinUrl(version);
    case "linux":
      return getLinuxUrl(version);
    case "win32":
      return getWin32Url(version);
    default:
      return null;
  }
}

//================================================
// Action
//================================================

async function install(version: string, directory: string): Promise<void> {
  const platform = process.platform;
  if (!VERSIONS.has(version)) {
    throw new Error(`Unsupported target! (platform='${platform}', version='${version}')`);
  }

  let url;
  let fullVersion;
  for (const v of getFullVersions(version)) {
    url = getUrl(platform, v);
    if (url) {
      fullVersion = v;
      core.setOutput("version", fullVersion);
      break;
    }
  }

  if (!url) {
    throw new Error(`Unsupported target! (platform='${platform}', version='${version}')`);
  }

  console.log(`Installing LLVM and Clang ${version} (${fullVersion})...`);
  console.log(`Downloading and extracting '${url}'...`);
  const archive = await tc.downloadTool(url);

  let exit;
  if (platform === "win32") {
    exit = await exec.exec("7z", ["x", archive, `-o${directory}`]);
  } else {
    await io.mkdirP(directory);
    exit = await exec.exec("tar", ["xf", archive, "-C", directory, "--strip-components=1"]);
  }

  if (exit !== 0) {
    throw new Error("Could not extract LLVM and Clang binaries.");
  }

  console.log(`Installed LLVM and Clang ${version} (${fullVersion})!`);
}

async function run(version: string, directory: string, cached: string): Promise<void> {
  if (cached === "true") {
    console.log(`Using cached LLVM and Clang ${version}...`);
  } else {
    await install(version, directory);
  }

  const bin = path.resolve(path.join(directory, "bin"));
  const lib = path.resolve(path.join(directory, "lib"));
  core.addPath(bin);
  core.exportVariable("LD_LIBRARY_PATH", `${lib}:${process.env.LD_LIBRARY_PATH || ""}`);
  core.exportVariable("DYLD_LIBRARY_PATH", `${lib}:${process.env.DYLD_LIBRARY_PATH || ""}`);
}

try {
  const version = core.getInput("version");
  const directory = core.getInput("directory");
  const cached = core.getInput("cached") || "false";
  run(version, directory, cached);
} catch (error) {
  console.error(error.stack);
  core.setFailed(error.message);
}
