import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import * as fs from "fs";
import * as path from "path";

const ASSETS_JSON = fs.readFileSync(path.resolve(__dirname, "assets.json")).toString("utf-8");
const ASSETS: Record<string, Record<string, Record<string, string>>> = JSON.parse(ASSETS_JSON);

export interface Options {
  version: string;
  arch: string | null;
  forceUrl: string | null;
  directory: string | null;
  cached: boolean;
  mirrorUrl: string | null;
  auth: string | null;
  env: boolean;
}

function getRequiredInput(name: string): string {
  const value = core.getInput(name).trim();
  if (value !== "") {
    return value;
  } else {
    throw new Error(`'${name}' input must be provided as a non-empty string`);
  }
}

function getOptionalInput(name: string): string | null {
  const value = core.getInput(name).trim();
  if (value !== "") {
    return value;
  } else {
    return null;
  }
}

export function getOptions(): Options {
  return {
    version: getRequiredInput("version"),
    arch: getOptionalInput("arch"),
    forceUrl: getOptionalInput("force-url"),
    directory: getOptionalInput("directory"),
    cached: getOptionalInput("cached")?.toLowerCase() === "true",
    mirrorUrl: getOptionalInput("mirror-url"),
    auth: getOptionalInput("auth"),
    env: getOptionalInput("env")?.toLowerCase() === "true",
  };
}

//================================================
// Version
//================================================

/**
 * Gets the specific LLVM versions supported by this action compatible with the
 * supplied (specific or minimum) LLVM version in descending order of release
 * (e.g., `5.0.2`, `5.0.1`, and `5.0.0` for `5`).
 */
function getSpecificVersions(specificVersions: string[], version: string): string[] {
  return Array.from(specificVersions)
    .filter(v => /^\d+\.\d+\.\d+$/.test(v) && (v.startsWith(`${version}.`) || v === version))
    .sort()
    .reverse();
}

//================================================
// Asset
//================================================

export interface Asset {
  readonly specificVersion: string;
  readonly url: string;
}

export function getAsset(os: string, options: Options): Asset {
  const info = { os: process.platform, arch: process.arch };
  console.log(`NodeJS process info = ${JSON.stringify(info)}`);

  if (options.forceUrl) {
    console.log("Using asset specified by `force-url` option.");
    return { specificVersion: options.version, url: options.forceUrl };
  }

  const arch = (options.arch ?? process.arch) || "x64";
  console.log(`Checking known assets (os=${os}, arch=${arch}, version=${options.version})...`);

  const assets = ASSETS[os]?.[arch];
  if (!assets) {
    throw new Error(`Unsupported platform (os=${os}, arch=${arch})!`);
  }

  const specificVersions = getSpecificVersions(Object.keys(assets), options.version);
  if (!specificVersions.length) {
    throw new Error(`Unsupported version for platform (os=${os}, arch=${arch}, version=${options.version})!`);
  }

  const specificVersion = specificVersions[0];
  const path = ASSETS[os][arch][specificVersion];

  let url: string;
  if (options.mirrorUrl) {
    url = `${options.mirrorUrl}${path}`;
  } else {
    url = `https://github.com/llvm/llvm-project/releases/download/llvmorg-${specificVersion}${path}`;
  }

  return { specificVersion, url };
}

//================================================
// Action
//================================================

const DEFAULT_NIX_DIRECTORY = "./llvm";
const DEFAULT_WIN32_DIRECTORY = "C:/Program Files/LLVM";

async function install(options: Options): Promise<void> {
  const os = process.platform;
  const { specificVersion, url } = getAsset(os, options);
  core.setOutput("version", specificVersion);

  console.log(`Installing LLVM and Clang ${options.version} (${specificVersion})...`);
  console.log(`Downloading and extracting '${url}'...`);
  const archive = await tc.downloadTool(url, "", options.auth ?? undefined);

  let exit;
  if (os === "win32") {
    exit = await exec.exec("7z", ["x", archive, `-o${options.directory}`, "-y"]);
  } else {
    const directory = options.directory ?? "";
    await io.mkdirP(directory);
    exit = await exec.exec("tar", ["xf", archive, "-C", directory, "--strip-components=1"]);
  }

  if (exit !== 0) {
    throw new Error("Could not extract LLVM and Clang binaries.");
  }

  core.info(`Installed LLVM and Clang ${options.version} (${specificVersion})!`);
  core.info(`Install location: ${options.directory}`);
}

export async function run(options: Options): Promise<void> {
  if (!options.directory) {
    options.directory = process.platform === "win32" ? DEFAULT_WIN32_DIRECTORY : DEFAULT_NIX_DIRECTORY;
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

  core.exportVariable("LLVM_PATH", options.directory);

  const ld = process.env.LD_LIBRARY_PATH ?? "";
  core.exportVariable("LD_LIBRARY_PATH", `${lib}${path.delimiter}${ld}`);

  // Ensure system libraries are first on ARM64 macOS to avoid issues with Apple's libc++ being weird.
  // https://discourse.llvm.org/t/apples-libc-now-provides-std-type-descriptor-t-functionality-not-found-in-upstream-libc/73881/5
  const dyld = process.env.DYLD_LIBRARY_PATH;
  let dyldPrefix = "";
  if (process.platform === "darwin" && process.arch === "arm64") {
    dyldPrefix = `/usr/lib${path.delimiter}`;
  }

  core.exportVariable("DYLD_LIBRARY_PATH", `${dyldPrefix}${lib}${path.delimiter}${dyld}`);

  if (options.env) {
    core.exportVariable("CC", path.join(options.directory, "bin", "clang"));
    core.exportVariable("CXX", path.join(options.directory, "bin", "clang++"));
  }
}
