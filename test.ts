import * as https from "https";

import { Options, getSpecificVersionAndUrl } from './index';

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

async function main() {
  const start = process.argv.indexOf("test");

  if (process.argv.length < start + 3) {
    console.error(`\
Expected at least two arguments:
  1. platform
  2. version
  3. forceVersion (optional)
  4. ubuntuVersion (optional)`)
    process.exit(1);
  }

  try {
    const platform = process.argv[start + 1];

    const options = {
      version: process.argv[start + 2],
      forceVersion: (process.argv[start + 3] || "").toLowerCase() === "true",
      ubuntuVersion: process.argv[start + 4],
      directory: "",
      cached: false,
    };

    await test(platform, options);
  } catch (error) {
    console.error(error.stack);
    process.exit(1);
  }
}

if (!module.parent) {
  main();
}
