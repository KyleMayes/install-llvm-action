import * as https from "https";

import { Options, getAsset } from "./index";

async function test(os: string, options: Options): Promise<void> {
  const { specificVersion, url } = getAsset(os, options);

  console.log(`Version: ${options.version} => ${specificVersion}`);
  console.log(`URL: ${url}`);

  return new Promise((resolve, reject) => {
    https.get(url, res => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Content-Length: ${res.headers["content-length"]}`);
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
  1. <os>
  2. <version>
  3. --arch=<arch> (optional)
  4. --force-url=<force-url> (optional)`);
    process.exit(1);
  }

  try {
    const os = process.argv[start + 1];

    const options: Options = {
      version: process.argv[start + 2],
      arch: null,
      forceUrl: null,
      directory: "",
      cached: false,
      mirrorUrl: null,
      auth: null,
      env: false,
    };

    for (const argument of process.argv.slice(start + 3)) {
      const [name, value] = argument.split("=");
      switch (name) {
        case "--arch":
          options.arch = value;
          break;
        case "--force-url":
          options.forceUrl = value;
          break;
        default:
          console.error(`Invalid argument: ${argument}`);
          process.exit(1);
          break;
      }
    }

    console.log(`Options: ${JSON.stringify(options, null, "  ")}`);

    await test(os, options);
    process.exit(0);
  } catch (error: any) {
    console.error(error.stack);
    process.exit(1);
  }
}

if (!module.parent) {
  main();
}
