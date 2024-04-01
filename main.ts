import * as core from "@actions/core";

import { getOptions, run } from "./index";

async function main() {
  try {
    await run(getOptions());
  } catch (error: any) {
    console.error(error.stack);
    core.setFailed(error.message);
  }
}

console.log("hello");
main();
