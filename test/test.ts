import * as core from "@actions/core";
import * as https from "https";
import { getSpecificVersionAndUrl, Options } from '../index';

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

async function mainMock() {
  const start = process.argv.indexOf("test");
  try {
    const platform = process.argv[start + 1];
    const version = process.argv[start + 2];
    const forceVersion = (process.argv[start + 3] || "").toLowerCase() === "true";
    const ubuntuVersion = process.argv[start + 4];
    const options = { version, forceVersion, ubuntuVersion, directory: "", cached: false };
    await test(platform, options);
  } catch (error) {
    console.error(error.stack);
    core.setFailed(error.message);
  }
}

mainMock()
