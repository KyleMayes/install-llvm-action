import * as _ from "lodash";
import { Octokit } from "@octokit/rest";
import { Endpoints } from "@octokit/types";
import { writeFileSync } from "fs";
import { resolve } from "path";

//================================================
// GitHub
//================================================

type Release = Endpoints["GET /repos/{owner}/{repo}/releases"]["response"]["data"][number];

const github = new Octokit({ auth: process.env.GH_TOKEN });

//================================================
// Version
//================================================

type Version = string;

const VERSION_PATTERNS: RegExp[] = [/^llvmorg-(?<version>\d+\.\d+\.\d+)$/];

function extractVersion(release: Release): Version | undefined {
  return _.chain(VERSION_PATTERNS)
    .map(pattern => pattern.exec(release.tag_name)?.groups?.version)
    .find(version => !!version)
    .value();
}

//================================================
// Asset
//================================================

interface Asset {
  readonly version: Version;
  readonly os: "darwin" | "linux" | "win32";
  readonly arch: "arm64" | "x64";
  readonly url: string;
}

const ASSET_PATTERNS: [Asset["os"], Asset["arch"], RegExp][] = [
  ["darwin", "arm64", /^clang\+llvm-.+-arm64-apple-darwin.*\.tar\.xz$/],
  ["darwin", "x64", /^clang\+llvm-.+-x86_64-apple-darwin.*\.tar\.xz$/],
  ["linux", "arm64", /^clang\+llvm-.+-aarch64-linux-gnu.*\.tar\.xz$/],
  ["linux", "x64", /^clang\+llvm-.+-x86_64-linux-gnu-?ubuntu.*\.tar\.xz$/],
  ["win32", "arm64", /^LLVM-.+-woa64\.exe$/],
  ["win32", "x64", /^LLVM-.+-win64\.exe$/],
];

function extractAssets(release: Release): Asset[] {
  const version = extractVersion(release);
  if (!version) {
    return [];
  }

  const assets: Asset[] = [];
  for (const asset of release.assets) {
    for (const [os, arch, pattern] of ASSET_PATTERNS) {
      if (!/rc\d+/.test(asset.name) && pattern.test(asset.name)) {
        assets.push({ version, os, arch, url: asset.browser_download_url });
      }
    }
  }

  return assets;
}

//================================================
// Generate
//================================================

async function generate() {
  const assets = (
    await github.paginate("GET /repos/{owner}/{repo}/releases", {
      owner: "llvm",
      repo: "llvm-project",
    })
  ).flatMap(extractAssets);

  const output: Record<string, Record<string, Record<string, string>>> = {};
  for (const asset of assets) {
    let os = output[asset.os] ?? (output[asset.os] = {});
    let arch = os[asset.arch] ?? (os[asset.arch] = {});
    arch[asset.version] = asset.url.replace(
      `https://github.com/llvm/llvm-project/releases/download/llvmorg-${asset.version}`,
      "",
    );
  }

  const json = JSON.stringify(output, null, "  ");
  writeFileSync(resolve(__dirname, "assets.json"), json);
}

generate();
