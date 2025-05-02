import * as _ from "lodash";
import stringify, { Comparator } from "json-stable-stringify";
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

function extractVersionNumber(release: Release): Version | undefined {
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
  ["darwin", "arm64", /^clang\+llvm-.+-arm64-apple-(darwin|macos).*\.tar\.xz$/],
  ["darwin", "x64", /^clang\+llvm-.+-x86_64-apple-(darwin|macos).*\.tar\.xz$/],
  ["linux", "arm64", /^clang\+llvm-.+-aarch64-linux-gnu.*\.tar\.xz$/],
  ["linux", "x64", /^(clang\+llvm-.+-x86_64-linux-gnu-?ubuntu.*)|(LLVM-.+-Linux-X64)\.tar\.xz$/],
  ["win32", "arm64", /^LLVM-.+-woa64\.exe$/],
  ["win32", "x64", /^LLVM-.+-win64\.exe$/],
];

function extractAssets(release: Release): Asset[] {
  const version = extractVersionNumber(release);
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

function parseVersionNumber(string: string): number | null {
  const match = /(\d+)\.(\d+)\.(\d+)/.exec(string);
  if (match) {
    const parts = match.slice(1, 4).map(p => Number.parseInt(p));
    return parts[0] * 100_000_000 + parts[1] * 100_000 + parts[2];
  } else {
    return null;
  }
}

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

  const comparator: Comparator = (a, b) => {
    const versionA = parseVersionNumber(a.key);
    const versionB = parseVersionNumber(b.key);
    if (versionA && versionB) {
      return versionA - versionB;
    } else {
      return a.key.localeCompare(b.key);
    }
  };

  const json = stringify(output, { space: "  ", cmp: comparator });
  writeFileSync(resolve(__dirname, "assets.json"), json);
}

generate();
