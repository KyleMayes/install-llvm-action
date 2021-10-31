var $bwvhf$path = require("path");
var $bwvhf$os = require("os");
var $bwvhf$fs = require("fs");
var $bwvhf$http = require("http");
var $bwvhf$https = require("https");
require("net");
var $bwvhf$tls = require("tls");
var $bwvhf$events = require("events");
var $bwvhf$assert = require("assert");
var $bwvhf$util = require("util");
var $bwvhf$string_decoder = require("string_decoder");
var $bwvhf$child_process = require("child_process");
var $bwvhf$timers = require("timers");
var $bwvhf$stream = require("stream");
var $bwvhf$url = require("url");
var $bwvhf$crypto = require("crypto");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequirea88d"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequirea88d"] = parcelRequire;
}
parcelRequire.register("fek0m", function(module, exports) {

$parcel$export(module.exports, "getSpecificVersionAndUrl", () => getSpecificVersionAndUrl, (v) => getSpecificVersionAndUrl = v);

var $3KZaW = parcelRequire("3KZaW");

var $d6Tes = parcelRequire("d6Tes");

var $gQX9t = parcelRequire("gQX9t");

var $ficLE = parcelRequire("ficLE");

//================================================
// Version
//================================================
/**
 * Gets the specific and minimum LLVM versions that can be used to refer to the
 * supplied specific LLVM versions (e.g., `3`, `3.5`, `3.5.2` for `3.5.2`).
 */ function getVersions(specific) {
    const versions = new Set(specific);
    for (const version of specific){
        versions.add(/^\d+/.exec(version)[0]);
        versions.add(/^\d+\.\d+/.exec(version)[0]);
    }
    return versions;
}
/** The specific and minimum LLVM versions supported by this action. */ const VERSIONS = getVersions([
    "3.5.0",
    "3.5.1",
    "3.5.2",
    "3.6.0",
    "3.6.1",
    "3.6.2",
    "3.7.0",
    "3.7.1",
    "3.8.0",
    "3.8.1",
    "3.9.0",
    "3.9.1",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "6.0.0",
    "6.0.1",
    "7.0.0",
    "7.0.1",
    "7.1.0",
    "8.0.0",
    "8.0.1",
    "9.0.0",
    "9.0.1",
    "10.0.0",
    "10.0.1",
    "11.0.0",
    "11.0.1",
    "11.1.0",
    "12.0.0",
    "12.0.1",
    "13.0.0", 
]);
/** Gets the ordering of two (specific or minimum) LLVM versions. */ function compareVersions(left, right) {
    const leftComponents = left.split(".").map((c)=>parseInt(c, 10)
    );
    const rightComponents = right.split(".").map((c)=>parseInt(c, 10)
    );
    const length = Math.max(leftComponents.length, rightComponents.length);
    for(let i = 0; i < length; ++i){
        const leftComponent = leftComponents[i] || 0;
        const rightComponent = rightComponents[i] || 0;
        if (leftComponent > rightComponent) return 1;
        else if (leftComponent < rightComponent) return -1;
    }
    return 0;
}
/**
 * Gets the specific LLVM versions supported by this action compatible with the
 * supplied (specific or minimum) LLVM version in descending order of release
 * (e.g., `5.0.2`, `5.0.1`, and `5.0.0` for `5`).
 */ function getSpecificVersions(version) {
    return Array.from(VERSIONS).filter((v)=>/^\d+\.\d+\.\d+$/.test(v) && v.startsWith(version)
    ).sort().reverse();
}
//================================================
// URL
//================================================
/** Gets a LLVM download URL for GitHub. */ function getGitHubUrl(version, prefix, suffix) {
    const file = `${prefix}${version}${suffix}`;
    return `https://github.com/llvm/llvm-project/releases/download/llvmorg-${version}/${file}`;
}
/** Gets a LLVM download URL for https://releases.llvm.org. */ function getReleaseUrl(version, prefix, suffix) {
    const file = `${prefix}${version}${suffix}`;
    return `https://releases.llvm.org/${version}/${file}`;
}
/** The LLVM versions that were never released for the Darwin platform. */ const DARWIN_MISSING = new Set([
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
]);
/** Gets an LLVM download URL for the Darwin platform. */ function getDarwinUrl(version, options) {
    if (!options.forceVersion && DARWIN_MISSING.has(version)) return null;
    const darwin = version === "9.0.0" ? "-darwin-apple" : "-apple-darwin";
    const prefix = "clang+llvm-";
    const suffix = `-x86_64${darwin}.tar.xz`;
    if (compareVersions(version, "9.0.1") >= 0) return getGitHubUrl(version, prefix, suffix);
    else return getReleaseUrl(version, prefix, suffix);
}
/**
 * The LLVM versions that should use the last RC version instead of the release
 * version for the Linux (Ubuntu) platform. This is useful when there were
 * binaries released for the Linux (Ubuntu) platform for the last RC version but
 * not for the actual release version.
 */ const UBUNTU_RC = new Map([]);
/** The (latest) Ubuntu versions for each LLVM version. */ const UBUNTU = {
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
    "13.0.0": "-ubuntu-20.04"
};
/** The latest supported LLVM version for the Linux (Ubuntu) platform. */ const MAX_UBUNTU = "13.0.0";
/** Gets an LLVM download URL for the Linux (Ubuntu) platform. */ function getLinuxUrl(version, options) {
    const rc = UBUNTU_RC.get(version);
    if (rc) version = rc;
    let ubuntu;
    if (options.ubuntuVersion) ubuntu = `-ubuntu-${options.ubuntuVersion}`;
    else if (options.forceVersion) ubuntu = UBUNTU[MAX_UBUNTU];
    else ubuntu = UBUNTU[version];
    if (!ubuntu) return null;
    const prefix = "clang+llvm-";
    const suffix = `-x86_64-linux-gnu${ubuntu}.tar.xz`;
    if (compareVersions(version, "9.0.1") >= 0) return getGitHubUrl(version, prefix, suffix);
    else return getReleaseUrl(version, prefix, suffix);
}
/** The LLVM versions that were never released for the Windows platform. */ const WIN32_MISSING = new Set([
    "10.0.1", 
]);
/** Gets an LLVM download URL for the Windows platform. */ function getWin32Url(version, options) {
    if (!options.forceVersion && WIN32_MISSING.has(version)) return null;
    const prefix = "LLVM-";
    const suffix = compareVersions(version, "3.7.0") >= 0 ? "-win64.exe" : "-win32.exe";
    if (compareVersions(version, "9.0.1") >= 0) return getGitHubUrl(version, prefix, suffix);
    else return getReleaseUrl(version, prefix, suffix);
}
/** Gets an LLVM download URL. */ function getUrl(platform, version, options) {
    switch(platform){
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
function getSpecificVersionAndUrl(platform, options) {
    if (options.forceVersion) return [
        options.version,
        getUrl(platform, options.version, options)
    ];
    if (!VERSIONS.has(options.version)) throw new Error(`Unsupported target! (platform='${platform}', version='${options.version}')`);
    for (const specificVersion of getSpecificVersions(options.version)){
        const url = getUrl(platform, specificVersion, options);
        if (url) return [
            specificVersion,
            url
        ];
    }
    throw new Error(`Unsupported target! (platform='${platform}', version='${options.version}')`);
}
//================================================
// Action
//================================================
const DEFAULT_NIX_DIRECTORY = "./llvm";
const DEFAULT_WIN32_DIRECTORY = "C:/Program Files/LLVM";
async function install(options) {
    const platform = process.platform;
    const [specificVersion, url] = getSpecificVersionAndUrl(platform, options);
    $3KZaW.setOutput("version", specificVersion);
    console.log(`Installing LLVM and Clang ${options.version} (${specificVersion})...`);
    console.log(`Downloading and extracting '${url}'...`);
    const archive = await $ficLE.downloadTool(url);
    let exit;
    if (platform === "win32") exit = await $d6Tes.exec("7z", [
        "x",
        archive,
        `-o${options.directory}`
    ]);
    else {
        await $gQX9t.mkdirP(options.directory);
        exit = await $d6Tes.exec("tar", [
            "xf",
            archive,
            "-C",
            options.directory,
            "--strip-components=1"
        ]);
    }
    if (exit !== 0) throw new Error("Could not extract LLVM and Clang binaries.");
    $3KZaW.info(`Installed LLVM and Clang ${options.version} (${specificVersion})!`);
    $3KZaW.info(`Install location: ${options.directory}`);
}
async function run(options) {
    if (!options.directory) options.directory = process.platform === "win32" ? DEFAULT_WIN32_DIRECTORY : DEFAULT_NIX_DIRECTORY;
    options.directory = $bwvhf$path.resolve(options.directory);
    if (options.cached) console.log(`Using cached LLVM and Clang ${options.version}...`);
    else await install(options);
    const bin = $bwvhf$path.join(options.directory, "bin");
    const lib = $bwvhf$path.join(options.directory, "lib");
    $3KZaW.addPath(bin);
    var _LD_LIBRARY_PATH;
    const ld = (_LD_LIBRARY_PATH = process.env.LD_LIBRARY_PATH) !== null && _LD_LIBRARY_PATH !== void 0 ? _LD_LIBRARY_PATH : "";
    var _DYLD_LIBRARY_PATH;
    const dyld = (_DYLD_LIBRARY_PATH = process.env.DYLD_LIBRARY_PATH) !== null && _DYLD_LIBRARY_PATH !== void 0 ? _DYLD_LIBRARY_PATH : "";
    $3KZaW.exportVariable("LLVM_PATH", options.directory);
    $3KZaW.exportVariable("LD_LIBRARY_PATH", `${lib}${$bwvhf$path.delimiter}${ld}`);
    $3KZaW.exportVariable("DYLD_LIBRARY_PATH", `${lib}${$bwvhf$path.delimiter}${dyld}`);
}
async function main() {
    try {
        const version = $3KZaW.getInput("version");
        const forceVersion = ($3KZaW.getInput("force-version") || "").toLowerCase() === "true";
        const ubuntuVersion = $3KZaW.getInput("ubuntu-version");
        const directory = $3KZaW.getInput("directory");
        const cached = ($3KZaW.getInput("cached") || "").toLowerCase() === "true";
        const options = {
            version,
            forceVersion,
            ubuntuVersion,
            directory,
            cached
        };
        await run(options);
    } catch (error) {
        console.error(error.stack);
        $3KZaW.setFailed(error.message);
    }
}
if (!module.parent) main();

});
parcelRequire.register("3KZaW", function(module, exports) {
"use strict";
var $2bc51f2688ea4e93$var$__createBinding = module.exports && module.exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var $2bc51f2688ea4e93$var$__setModuleDefault = module.exports && module.exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var $2bc51f2688ea4e93$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.hasOwnProperty.call(mod, k)) $2bc51f2688ea4e93$var$__createBinding(result, mod, k);
    }
    $2bc51f2688ea4e93$var$__setModuleDefault(result, mod);
    return result;
};
var $2bc51f2688ea4e93$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.getIDToken = module.exports.getState = module.exports.saveState = module.exports.group = module.exports.endGroup = module.exports.startGroup = module.exports.info = module.exports.notice = module.exports.warning = module.exports.error = module.exports.debug = module.exports.isDebug = module.exports.setFailed = module.exports.setCommandEcho = module.exports.setOutput = module.exports.getBooleanInput = module.exports.getMultilineInput = module.exports.getInput = module.exports.addPath = module.exports.setSecret = module.exports.exportVariable = module.exports.ExitCode = void 0;

var $6zK0L = parcelRequire("6zK0L");

var $cImHa = parcelRequire("cImHa");

var $dl9Fk = parcelRequire("dl9Fk");

const $2bc51f2688ea4e93$var$os = $2bc51f2688ea4e93$var$__importStar($bwvhf$os);

const $2bc51f2688ea4e93$var$path = $2bc51f2688ea4e93$var$__importStar($bwvhf$path);

var $2je3E = parcelRequire("2je3E");
/**
 * The code to exit an action
 */ var $2bc51f2688ea4e93$var$ExitCode;
(function(ExitCode) {
    /**
     * A code indicating that the action was successful
     */ ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */ ExitCode[ExitCode["Failure"] = 1] = "Failure";
})($2bc51f2688ea4e93$var$ExitCode = module.exports.ExitCode || (module.exports.ExitCode = {
}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function $2bc51f2688ea4e93$var$exportVariable(name, val) {
    const convertedVal = $dl9Fk.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${$2bc51f2688ea4e93$var$os.EOL}${convertedVal}${$2bc51f2688ea4e93$var$os.EOL}${delimiter}`;
        $cImHa.issueCommand('ENV', commandValue);
    } else $6zK0L.issueCommand('set-env', {
        name: name
    }, convertedVal);
}
module.exports.exportVariable = $2bc51f2688ea4e93$var$exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */ function $2bc51f2688ea4e93$var$setSecret(secret) {
    $6zK0L.issueCommand('add-mask', {
    }, secret);
}
module.exports.setSecret = $2bc51f2688ea4e93$var$setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */ function $2bc51f2688ea4e93$var$addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) $cImHa.issueCommand('PATH', inputPath);
    else $6zK0L.issueCommand('add-path', {
    }, inputPath);
    process.env['PATH'] = `${inputPath}${$2bc51f2688ea4e93$var$path.delimiter}${process.env['PATH']}`;
}
module.exports.addPath = $2bc51f2688ea4e93$var$addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */ function $2bc51f2688ea4e93$var$getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) throw new Error(`Input required and not supplied: ${name}`);
    if (options && options.trimWhitespace === false) return val;
    return val.trim();
}
module.exports.getInput = $2bc51f2688ea4e93$var$getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */ function $2bc51f2688ea4e93$var$getMultilineInput(name, options) {
    const inputs = $2bc51f2688ea4e93$var$getInput(name, options).split('\n').filter((x)=>x !== ''
    );
    return inputs;
}
module.exports.getMultilineInput = $2bc51f2688ea4e93$var$getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */ function $2bc51f2688ea4e93$var$getBooleanInput(name, options) {
    const trueValue = [
        'true',
        'True',
        'TRUE'
    ];
    const falseValue = [
        'false',
        'False',
        'FALSE'
    ];
    const val = $2bc51f2688ea4e93$var$getInput(name, options);
    if (trueValue.includes(val)) return true;
    if (falseValue.includes(val)) return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` + `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
module.exports.getBooleanInput = $2bc51f2688ea4e93$var$getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function $2bc51f2688ea4e93$var$setOutput(name, value) {
    process.stdout.write($2bc51f2688ea4e93$var$os.EOL);
    $6zK0L.issueCommand('set-output', {
        name: name
    }, value);
}
module.exports.setOutput = $2bc51f2688ea4e93$var$setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */ function $2bc51f2688ea4e93$var$setCommandEcho(enabled) {
    $6zK0L.issue('echo', enabled ? 'on' : 'off');
}
module.exports.setCommandEcho = $2bc51f2688ea4e93$var$setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */ function $2bc51f2688ea4e93$var$setFailed(message) {
    process.exitCode = $2bc51f2688ea4e93$var$ExitCode.Failure;
    $2bc51f2688ea4e93$var$error(message);
}
module.exports.setFailed = $2bc51f2688ea4e93$var$setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */ function $2bc51f2688ea4e93$var$isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
module.exports.isDebug = $2bc51f2688ea4e93$var$isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */ function $2bc51f2688ea4e93$var$debug(message) {
    $6zK0L.issueCommand('debug', {
    }, message);
}
module.exports.debug = $2bc51f2688ea4e93$var$debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */ function $2bc51f2688ea4e93$var$error(message, properties = {
}) {
    $6zK0L.issueCommand('error', $dl9Fk.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
module.exports.error = $2bc51f2688ea4e93$var$error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */ function $2bc51f2688ea4e93$var$warning(message, properties = {
}) {
    $6zK0L.issueCommand('warning', $dl9Fk.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
module.exports.warning = $2bc51f2688ea4e93$var$warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */ function $2bc51f2688ea4e93$var$notice(message, properties = {
}) {
    $6zK0L.issueCommand('notice', $dl9Fk.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
module.exports.notice = $2bc51f2688ea4e93$var$notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */ function $2bc51f2688ea4e93$var$info(message) {
    process.stdout.write(message + $2bc51f2688ea4e93$var$os.EOL);
}
module.exports.info = $2bc51f2688ea4e93$var$info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */ function $2bc51f2688ea4e93$var$startGroup(name) {
    $6zK0L.issue('group', name);
}
module.exports.startGroup = $2bc51f2688ea4e93$var$startGroup;
/**
 * End an output group.
 */ function $2bc51f2688ea4e93$var$endGroup() {
    $6zK0L.issue('endgroup');
}
module.exports.endGroup = $2bc51f2688ea4e93$var$endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */ function $2bc51f2688ea4e93$var$group(name, fn) {
    return $2bc51f2688ea4e93$var$__awaiter(this, void 0, void 0, function*() {
        $2bc51f2688ea4e93$var$startGroup(name);
        let result;
        try {
            result = yield fn();
        } finally{
            $2bc51f2688ea4e93$var$endGroup();
        }
        return result;
    });
}
module.exports.group = $2bc51f2688ea4e93$var$group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function $2bc51f2688ea4e93$var$saveState(name, value) {
    $6zK0L.issueCommand('save-state', {
        name: name
    }, value);
}
module.exports.saveState = $2bc51f2688ea4e93$var$saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */ function $2bc51f2688ea4e93$var$getState(name) {
    return process.env[`STATE_${name}`] || '';
}
module.exports.getState = $2bc51f2688ea4e93$var$getState;
function $2bc51f2688ea4e93$var$getIDToken(aud) {
    return $2bc51f2688ea4e93$var$__awaiter(this, void 0, void 0, function*() {
        return yield $2je3E.OidcClient.getIDToken(aud);
    });
}
module.exports.getIDToken = $2bc51f2688ea4e93$var$getIDToken;

});
parcelRequire.register("6zK0L", function(module, exports) {
"use strict";
var $4c99b3dbada411a2$var$__createBinding = module.exports && module.exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var $4c99b3dbada411a2$var$__setModuleDefault = module.exports && module.exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var $4c99b3dbada411a2$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.hasOwnProperty.call(mod, k)) $4c99b3dbada411a2$var$__createBinding(result, mod, k);
    }
    $4c99b3dbada411a2$var$__setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.issue = module.exports.issueCommand = void 0;

const $4c99b3dbada411a2$var$os = $4c99b3dbada411a2$var$__importStar($bwvhf$os);

var $dl9Fk = parcelRequire("dl9Fk");
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */ function $4c99b3dbada411a2$var$issueCommand(command, properties, message) {
    const cmd = new $4c99b3dbada411a2$var$Command(command, properties, message);
    process.stdout.write(cmd.toString() + $4c99b3dbada411a2$var$os.EOL);
}
module.exports.issueCommand = $4c99b3dbada411a2$var$issueCommand;
function $4c99b3dbada411a2$var$issue(name, message = '') {
    $4c99b3dbada411a2$var$issueCommand(name, {
    }, message);
}
module.exports.issue = $4c99b3dbada411a2$var$issue;
const $4c99b3dbada411a2$var$CMD_STRING = '::';
class $4c99b3dbada411a2$var$Command {
    constructor(command, properties, message){
        if (!command) command = 'missing.command';
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = $4c99b3dbada411a2$var$CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for(const key in this.properties)if (this.properties.hasOwnProperty(key)) {
                const val = this.properties[key];
                if (val) {
                    if (first) first = false;
                    else cmdStr += ',';
                    cmdStr += `${key}=${$4c99b3dbada411a2$var$escapeProperty(val)}`;
                }
            }
        }
        cmdStr += `${$4c99b3dbada411a2$var$CMD_STRING}${$4c99b3dbada411a2$var$escapeData(this.message)}`;
        return cmdStr;
    }
}
function $4c99b3dbada411a2$var$escapeData(s) {
    return $dl9Fk.toCommandValue(s).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}
function $4c99b3dbada411a2$var$escapeProperty(s) {
    return $dl9Fk.toCommandValue(s).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A').replace(/:/g, '%3A').replace(/,/g, '%2C');
}

});
parcelRequire.register("dl9Fk", function(module, exports) {
"use strict";
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */ Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.toCommandProperties = module.exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */ function $9b64bbe3a77574c0$var$toCommandValue(input) {
    if (input === null || input === undefined) return '';
    else if (typeof input === 'string' || input instanceof String) return input;
    return JSON.stringify(input);
}
module.exports.toCommandValue = $9b64bbe3a77574c0$var$toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */ function $9b64bbe3a77574c0$var$toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) return {
    };
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
module.exports.toCommandProperties = $9b64bbe3a77574c0$var$toCommandProperties;

});


parcelRequire.register("cImHa", function(module, exports) {
"use strict";
// For internal use, subject to change.
var $941b32e355ec5b4c$var$__createBinding = module.exports && module.exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var $941b32e355ec5b4c$var$__setModuleDefault = module.exports && module.exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var $941b32e355ec5b4c$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.hasOwnProperty.call(mod, k)) $941b32e355ec5b4c$var$__createBinding(result, mod, k);
    }
    $941b32e355ec5b4c$var$__setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.issueCommand = void 0;

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */ const $941b32e355ec5b4c$var$fs = $941b32e355ec5b4c$var$__importStar($bwvhf$fs);

const $941b32e355ec5b4c$var$os = $941b32e355ec5b4c$var$__importStar($bwvhf$os);

var $dl9Fk = parcelRequire("dl9Fk");
function $941b32e355ec5b4c$var$issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) throw new Error(`Unable to find environment variable for file command ${command}`);
    if (!$941b32e355ec5b4c$var$fs.existsSync(filePath)) throw new Error(`Missing file at path: ${filePath}`);
    $941b32e355ec5b4c$var$fs.appendFileSync(filePath, `${$dl9Fk.toCommandValue(message)}${$941b32e355ec5b4c$var$os.EOL}`, {
        encoding: 'utf8'
    });
}
module.exports.issueCommand = $941b32e355ec5b4c$var$issueCommand;

});

parcelRequire.register("2je3E", function(module, exports) {
"use strict";
var $1ae842b9436bdb7c$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.OidcClient = void 0;

var $3t7xs = parcelRequire("3t7xs");

var $exEku = parcelRequire("exEku");

var $3KZaW = parcelRequire("3KZaW");
class $1ae842b9436bdb7c$var$OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new $3t7xs.HttpClient('actions/oidc-client', [
            new $exEku.BearerCredentialHandler($1ae842b9436bdb7c$var$OidcClient.getRequestToken())
        ], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return $1ae842b9436bdb7c$var$__awaiter(this, void 0, void 0, function*() {
            const httpclient = $1ae842b9436bdb7c$var$OidcClient.createHttpClient();
            const res = yield httpclient.getJson(id_token_url).catch((error)=>{
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) throw new Error('Response json body do not have ID Token field');
            return id_token;
        });
    }
    static getIDToken(audience) {
        return $1ae842b9436bdb7c$var$__awaiter(this, void 0, void 0, function*() {
            try {
                // New ID Token is requested from action service
                let id_token_url = $1ae842b9436bdb7c$var$OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                $3KZaW.debug(`ID token url is ${id_token_url}`);
                const id_token = yield $1ae842b9436bdb7c$var$OidcClient.getCall(id_token_url);
                $3KZaW.setSecret(id_token);
                return id_token;
            } catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
module.exports.OidcClient = $1ae842b9436bdb7c$var$OidcClient;

});
parcelRequire.register("3t7xs", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});



var $fD64E = parcelRequire("fD64E");
let $2869ed8591fecd76$var$tunnel;
var $2869ed8591fecd76$var$HttpCodes;
(function(HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})($2869ed8591fecd76$var$HttpCodes = module.exports.HttpCodes || (module.exports.HttpCodes = {
}));
var $2869ed8591fecd76$var$Headers;
(function(Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})($2869ed8591fecd76$var$Headers = module.exports.Headers || (module.exports.Headers = {
}));
var $2869ed8591fecd76$var$MediaTypes;
(function(MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})($2869ed8591fecd76$var$MediaTypes = module.exports.MediaTypes || (module.exports.MediaTypes = {
}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */ function $2869ed8591fecd76$var$getProxyUrl(serverUrl) {
    let proxyUrl = $fD64E.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
module.exports.getProxyUrl = $2869ed8591fecd76$var$getProxyUrl;
const $2869ed8591fecd76$var$HttpRedirectCodes = [
    $2869ed8591fecd76$var$HttpCodes.MovedPermanently,
    $2869ed8591fecd76$var$HttpCodes.ResourceMoved,
    $2869ed8591fecd76$var$HttpCodes.SeeOther,
    $2869ed8591fecd76$var$HttpCodes.TemporaryRedirect,
    $2869ed8591fecd76$var$HttpCodes.PermanentRedirect
];
const $2869ed8591fecd76$var$HttpResponseRetryCodes = [
    $2869ed8591fecd76$var$HttpCodes.BadGateway,
    $2869ed8591fecd76$var$HttpCodes.ServiceUnavailable,
    $2869ed8591fecd76$var$HttpCodes.GatewayTimeout
];
const $2869ed8591fecd76$var$RetryableHttpVerbs = [
    'OPTIONS',
    'GET',
    'DELETE',
    'HEAD'
];
const $2869ed8591fecd76$var$ExponentialBackoffCeiling = 10;
const $2869ed8591fecd76$var$ExponentialBackoffTimeSlice = 5;
class $2869ed8591fecd76$var$HttpClientError extends Error {
    constructor(message, statusCode){
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, $2869ed8591fecd76$var$HttpClientError.prototype);
    }
}
module.exports.HttpClientError = $2869ed8591fecd76$var$HttpClientError;
class $2869ed8591fecd76$var$HttpClientResponse {
    constructor(message){
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject)=>{
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk)=>{
                output = Buffer.concat([
                    output,
                    chunk
                ]);
            });
            this.message.on('end', ()=>{
                resolve(output.toString());
            });
        });
    }
}
module.exports.HttpClientResponse = $2869ed8591fecd76$var$HttpClientResponse;
function $2869ed8591fecd76$var$isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
module.exports.isHttps = $2869ed8591fecd76$var$isHttps;

class $2869ed8591fecd76$var$HttpClient {
    constructor(userAgent, handlers, requestOptions){
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) this._ignoreSslError = requestOptions.ignoreSslError;
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) this._allowRedirects = requestOptions.allowRedirects;
            if (requestOptions.allowRedirectDowngrade != null) this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            if (requestOptions.maxRedirects != null) this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            if (requestOptions.keepAlive != null) this._keepAlive = requestOptions.keepAlive;
            if (requestOptions.allowRetries != null) this._allowRetries = requestOptions.allowRetries;
            if (requestOptions.maxRetries != null) this._maxRetries = requestOptions.maxRetries;
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {
        });
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {
        });
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {
        });
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */ async getJson(requestUrl, additionalHeaders = {
    }) {
        additionalHeaders[$2869ed8591fecd76$var$Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, $2869ed8591fecd76$var$Headers.Accept, $2869ed8591fecd76$var$MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {
    }) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[$2869ed8591fecd76$var$Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, $2869ed8591fecd76$var$Headers.Accept, $2869ed8591fecd76$var$MediaTypes.ApplicationJson);
        additionalHeaders[$2869ed8591fecd76$var$Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, $2869ed8591fecd76$var$Headers.ContentType, $2869ed8591fecd76$var$MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {
    }) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[$2869ed8591fecd76$var$Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, $2869ed8591fecd76$var$Headers.Accept, $2869ed8591fecd76$var$MediaTypes.ApplicationJson);
        additionalHeaders[$2869ed8591fecd76$var$Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, $2869ed8591fecd76$var$Headers.ContentType, $2869ed8591fecd76$var$MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {
    }) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[$2869ed8591fecd76$var$Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, $2869ed8591fecd76$var$Headers.Accept, $2869ed8591fecd76$var$MediaTypes.ApplicationJson);
        additionalHeaders[$2869ed8591fecd76$var$Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, $2869ed8591fecd76$var$Headers.ContentType, $2869ed8591fecd76$var$MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */ async request(verb, requestUrl, data, headers) {
        if (this._disposed) throw new Error('Client has already been disposed.');
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && $2869ed8591fecd76$var$RetryableHttpVerbs.indexOf(verb) != -1 ? this._maxRetries + 1 : 1;
        let numTries = 0;
        let response;
        while(numTries < maxTries){
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response && response.message && response.message.statusCode === $2869ed8591fecd76$var$HttpCodes.Unauthorized) {
                let authenticationHandler;
                for(let i = 0; i < this.handlers.length; i++)if (this.handlers[i].canHandleAuthentication(response)) {
                    authenticationHandler = this.handlers[i];
                    break;
                }
                if (authenticationHandler) return authenticationHandler.handleAuthentication(this, info, data);
                else // We have received an unauthorized response but have no handlers to handle it.
                // Let the response return to the caller.
                return response;
            }
            let redirectsRemaining = this._maxRedirects;
            while($2869ed8591fecd76$var$HttpRedirectCodes.indexOf(response.message.statusCode) != -1 && this._allowRedirects && redirectsRemaining > 0){
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) break;
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' && parsedUrl.protocol != parsedRedirectUrl.protocol && !this._allowRedirectDowngrade) throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for(let header in headers)// header names are case insensitive
                    if (header.toLowerCase() === 'authorization') delete headers[header];
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if ($2869ed8591fecd76$var$HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) // If not a retry code, return immediately instead of retrying
            return response;
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */ dispose() {
        if (this._agent) this._agent.destroy();
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */ requestRaw(info, data) {
        return new Promise((resolve, reject)=>{
            let callbackForResult = function(err, res) {
                if (err) reject(err);
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */ requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        let callbackCalled = false;
        let handleResult = (err, res)=>{
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg)=>{
            let res = new $2869ed8591fecd76$var$HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', (sock)=>{
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 180000, ()=>{
            if (socket) socket.end();
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function(err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') req.write(data, 'utf8');
        if (data && typeof data !== 'string') {
            data.on('close', function() {
                req.end();
            });
            data.pipe(req);
        } else req.end();
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */ getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {
        };
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? $bwvhf$https : $bwvhf$http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {
        };
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port ? parseInt(info.parsedUrl.port) : defaultPort;
        info.options.path = (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) info.options.headers['user-agent'] = this.userAgent;
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) this.handlers.forEach((handler)=>{
            handler.prepareRequest(info.options);
        });
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = (obj)=>Object.keys(obj).reduce((c, k)=>(c[k.toLowerCase()] = obj[k], c)
            , {
            })
        ;
        if (this.requestOptions && this.requestOptions.headers) return Object.assign({
        }, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        return lowercaseKeys(headers || {
        });
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = (obj)=>Object.keys(obj).reduce((c, k)=>(c[k.toLowerCase()] = obj[k], c)
            , {
            })
        ;
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = $fD64E.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) agent = this._proxyAgent;
        if (this._keepAlive && !useProxy) agent = this._agent;
        // if agent is already assigned use that agent.
        if (!!agent) return agent;
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) maxSockets = this.requestOptions.maxSockets || $bwvhf$http.globalAgent.maxSockets;
        if (useProxy) {
            // If using proxy, need tunnel
            if (!$2869ed8591fecd76$var$tunnel) $2869ed8591fecd76$var$tunnel = (parcelRequire("763cj"));
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    ...(proxyUrl.username || proxyUrl.password) && {
                        proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                    },
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) tunnelAgent = overHttps ? $2869ed8591fecd76$var$tunnel.httpsOverHttps : $2869ed8591fecd76$var$tunnel.httpsOverHttp;
            else tunnelAgent = overHttps ? $2869ed8591fecd76$var$tunnel.httpOverHttps : $2869ed8591fecd76$var$tunnel.httpOverHttp;
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = {
                keepAlive: this._keepAlive,
                maxSockets: maxSockets
            };
            agent = usingSsl ? new $bwvhf$https.Agent(options) : new $bwvhf$http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) agent = usingSsl ? $bwvhf$https.globalAgent : $bwvhf$http.globalAgent;
        if (usingSsl && this._ignoreSslError) // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
        // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
        // we have to cast it to any and change it directly
        agent.options = Object.assign(agent.options || {
        }, {
            rejectUnauthorized: false
        });
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min($2869ed8591fecd76$var$ExponentialBackoffCeiling, retryNumber);
        const ms = $2869ed8591fecd76$var$ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise((resolve)=>setTimeout(()=>resolve()
            , ms)
        );
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) return a;
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject)=>{
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {
                }
            };
            // not found leads to null obj returned
            if (statusCode == $2869ed8591fecd76$var$HttpCodes.NotFound) resolve(response);
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) obj = JSON.parse(contents, $2869ed8591fecd76$var$HttpClient.dateTimeDeserializer);
                    else obj = JSON.parse(contents);
                    response.result = obj;
                }
                response.headers = res.message.headers;
            } catch (err) {
            // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) msg = obj.message;
                else if (contents && contents.length > 0) // it may be the case that the exception is in the body message as string
                msg = contents;
                else msg = 'Failed request: (' + statusCode + ')';
                let err = new $2869ed8591fecd76$var$HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            } else resolve(response);
        });
    }
}
module.exports.HttpClient = $2869ed8591fecd76$var$HttpClient;

});
parcelRequire.register("fD64E", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
function $b60f35b5983a17c6$var$getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if ($b60f35b5983a17c6$var$checkBypass(reqUrl)) return proxyUrl;
    let proxyVar;
    if (usingSsl) proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    else proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    if (proxyVar) proxyUrl = new URL(proxyVar);
    return proxyUrl;
}
module.exports.getProxyUrl = $b60f35b5983a17c6$var$getProxyUrl;
function $b60f35b5983a17c6$var$checkBypass(reqUrl) {
    if (!reqUrl.hostname) return false;
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) return false;
    // Determine the request port
    let reqPort;
    if (reqUrl.port) reqPort = Number(reqUrl.port);
    else if (reqUrl.protocol === 'http:') reqPort = 80;
    else if (reqUrl.protocol === 'https:') reqPort = 443;
    // Format the request hostname and hostname with port
    let upperReqHosts = [
        reqUrl.hostname.toUpperCase()
    ];
    if (typeof reqPort === 'number') upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy.split(',').map((x)=>x.trim().toUpperCase()
    ).filter((x)=>x
    )){
        if (upperReqHosts.some((x)=>x === upperNoProxyItem
        )) return true;
    }
    return false;
}
module.exports.checkBypass = $b60f35b5983a17c6$var$checkBypass;

});

parcelRequire.register("763cj", function(module, exports) {

module.exports = (parcelRequire("3HrXF"));

});
parcelRequire.register("3HrXF", function(module, exports) {

$parcel$export(module.exports, "httpOverHttp", () => $2b1b13c80e34d478$export$25cbd437c61a3835, (v) => $2b1b13c80e34d478$export$25cbd437c61a3835 = v);
$parcel$export(module.exports, "httpsOverHttp", () => $2b1b13c80e34d478$export$c06e3df7111bae43, (v) => $2b1b13c80e34d478$export$c06e3df7111bae43 = v);
$parcel$export(module.exports, "httpOverHttps", () => $2b1b13c80e34d478$export$5d50e36ef656139f, (v) => $2b1b13c80e34d478$export$5d50e36ef656139f = v);
$parcel$export(module.exports, "httpsOverHttps", () => $2b1b13c80e34d478$export$212d6605025321cc, (v) => $2b1b13c80e34d478$export$212d6605025321cc = v);
$parcel$export(module.exports, "debug", () => $2b1b13c80e34d478$export$1c9f709888824e05, (v) => $2b1b13c80e34d478$export$1c9f709888824e05 = v);
var $2b1b13c80e34d478$export$25cbd437c61a3835;
var $2b1b13c80e34d478$export$c06e3df7111bae43;
var $2b1b13c80e34d478$export$5d50e36ef656139f;
var $2b1b13c80e34d478$export$212d6605025321cc;
var $2b1b13c80e34d478$export$1c9f709888824e05;
'use strict';







$2b1b13c80e34d478$export$25cbd437c61a3835 = $2b1b13c80e34d478$var$httpOverHttp;
$2b1b13c80e34d478$export$c06e3df7111bae43 = $2b1b13c80e34d478$var$httpsOverHttp;
$2b1b13c80e34d478$export$5d50e36ef656139f = $2b1b13c80e34d478$var$httpOverHttps;
$2b1b13c80e34d478$export$212d6605025321cc = $2b1b13c80e34d478$var$httpsOverHttps;
function $2b1b13c80e34d478$var$httpOverHttp(options) {
    var agent = new $2b1b13c80e34d478$var$TunnelingAgent(options);
    agent.request = $bwvhf$http.request;
    return agent;
}
function $2b1b13c80e34d478$var$httpsOverHttp(options) {
    var agent = new $2b1b13c80e34d478$var$TunnelingAgent(options);
    agent.request = $bwvhf$http.request;
    agent.createSocket = $2b1b13c80e34d478$var$createSecureSocket;
    agent.defaultPort = 443;
    return agent;
}
function $2b1b13c80e34d478$var$httpOverHttps(options) {
    var agent = new $2b1b13c80e34d478$var$TunnelingAgent(options);
    agent.request = $bwvhf$https.request;
    return agent;
}
function $2b1b13c80e34d478$var$httpsOverHttps(options) {
    var agent = new $2b1b13c80e34d478$var$TunnelingAgent(options);
    agent.request = $bwvhf$https.request;
    agent.createSocket = $2b1b13c80e34d478$var$createSecureSocket;
    agent.defaultPort = 443;
    return agent;
}
function $2b1b13c80e34d478$var$TunnelingAgent(options) {
    var self = this;
    self.options = options || {
    };
    self.proxyOptions = self.options.proxy || {
    };
    self.maxSockets = self.options.maxSockets || $bwvhf$http.Agent.defaultMaxSockets;
    self.requests = [];
    self.sockets = [];
    self.on('free', function onFree(socket, host, port, localAddress) {
        var options = $2b1b13c80e34d478$var$toOptions(host, port, localAddress);
        for(var i = 0, len = self.requests.length; i < len; ++i){
            var pending = self.requests[i];
            if (pending.host === options.host && pending.port === options.port) {
                // Detect the request to connect same origin server,
                // reuse the connection.
                self.requests.splice(i, 1);
                pending.request.onSocket(socket);
                return;
            }
        }
        socket.destroy();
        self.removeSocket(socket);
    });
}
$bwvhf$util.inherits($2b1b13c80e34d478$var$TunnelingAgent, $bwvhf$events.EventEmitter);
$2b1b13c80e34d478$var$TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
    var self = this;
    var options = $2b1b13c80e34d478$var$mergeOptions({
        request: req
    }, self.options, $2b1b13c80e34d478$var$toOptions(host, port, localAddress));
    if (self.sockets.length >= this.maxSockets) {
        // We are over limit so we'll add it to the queue.
        self.requests.push(options);
        return;
    }
    // If we are under maxSockets create a new one.
    self.createSocket(options, function(socket) {
        socket.on('free', onFree);
        socket.on('close', onCloseOrRemove);
        socket.on('agentRemove', onCloseOrRemove);
        req.onSocket(socket);
        function onFree() {
            self.emit('free', socket, options);
        }
        function onCloseOrRemove(err) {
            self.removeSocket(socket);
            socket.removeListener('free', onFree);
            socket.removeListener('close', onCloseOrRemove);
            socket.removeListener('agentRemove', onCloseOrRemove);
        }
    });
};
$2b1b13c80e34d478$var$TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
    var self = this;
    var placeholder = {
    };
    self.sockets.push(placeholder);
    var connectOptions = $2b1b13c80e34d478$var$mergeOptions({
    }, self.proxyOptions, {
        method: 'CONNECT',
        path: options.host + ':' + options.port,
        agent: false,
        headers: {
            host: options.host + ':' + options.port
        }
    });
    if (options.localAddress) connectOptions.localAddress = options.localAddress;
    if (connectOptions.proxyAuth) {
        connectOptions.headers = connectOptions.headers || {
        };
        connectOptions.headers['Proxy-Authorization'] = 'Basic ' + new Buffer(connectOptions.proxyAuth).toString('base64');
    }
    $2b1b13c80e34d478$var$debug('making CONNECT request');
    var connectReq = self.request(connectOptions);
    connectReq.useChunkedEncodingByDefault = false; // for v0.6
    connectReq.once('response', onResponse); // for v0.6
    connectReq.once('upgrade', onUpgrade); // for v0.6
    connectReq.once('connect', onConnect); // for v0.7 or later
    connectReq.once('error', onError);
    connectReq.end();
    function onResponse(res) {
        // Very hacky. This is necessary to avoid http-parser leaks.
        res.upgrade = true;
    }
    function onUpgrade(res, socket, head) {
        // Hacky.
        process.nextTick(function() {
            onConnect(res, socket, head);
        });
    }
    function onConnect(res, socket, head) {
        connectReq.removeAllListeners();
        socket.removeAllListeners();
        if (res.statusCode !== 200) {
            $2b1b13c80e34d478$var$debug('tunneling socket could not be established, statusCode=%d', res.statusCode);
            socket.destroy();
            var error = new Error("tunneling socket could not be established, statusCode=" + res.statusCode);
            error.code = 'ECONNRESET';
            options.request.emit('error', error);
            self.removeSocket(placeholder);
            return;
        }
        if (head.length > 0) {
            $2b1b13c80e34d478$var$debug('got illegal response body from proxy');
            socket.destroy();
            var error = new Error('got illegal response body from proxy');
            error.code = 'ECONNRESET';
            options.request.emit('error', error);
            self.removeSocket(placeholder);
            return;
        }
        $2b1b13c80e34d478$var$debug('tunneling connection has established');
        self.sockets[self.sockets.indexOf(placeholder)] = socket;
        return cb(socket);
    }
    function onError(cause) {
        connectReq.removeAllListeners();
        $2b1b13c80e34d478$var$debug('tunneling socket could not be established, cause=%s\n', cause.message, cause.stack);
        var error = new Error("tunneling socket could not be established, cause=" + cause.message);
        error.code = 'ECONNRESET';
        options.request.emit('error', error);
        self.removeSocket(placeholder);
    }
};
$2b1b13c80e34d478$var$TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
    var pos = this.sockets.indexOf(socket);
    if (pos === -1) return;
    this.sockets.splice(pos, 1);
    var pending = this.requests.shift();
    if (pending) // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
        pending.request.onSocket(socket);
    });
};
function $2b1b13c80e34d478$var$createSecureSocket(options, cb) {
    var self = this;
    $2b1b13c80e34d478$var$TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
        var hostHeader = options.request.getHeader('host');
        var tlsOptions = $2b1b13c80e34d478$var$mergeOptions({
        }, self.options, {
            socket: socket,
            servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
        });
        // 0 is dummy port for v0.6
        var secureSocket = $bwvhf$tls.connect(0, tlsOptions);
        self.sockets[self.sockets.indexOf(socket)] = secureSocket;
        cb(secureSocket);
    });
}
function $2b1b13c80e34d478$var$toOptions(host, port, localAddress) {
    if (typeof host === 'string') return {
        host: host,
        port: port,
        localAddress: localAddress
    };
    return host; // for v0.11 or later
}
function $2b1b13c80e34d478$var$mergeOptions(target) {
    for(var i = 1, len = arguments.length; i < len; ++i){
        var overrides = arguments[i];
        if (typeof overrides === 'object') {
            var keys = Object.keys(overrides);
            for(var j = 0, keyLen = keys.length; j < keyLen; ++j){
                var k = keys[j];
                if (overrides[k] !== undefined) target[k] = overrides[k];
            }
        }
    }
    return target;
}
var $2b1b13c80e34d478$var$debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) $2b1b13c80e34d478$var$debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') args[0] = 'TUNNEL: ' + args[0];
    else args.unshift('TUNNEL:');
    console.error.apply(console, args);
};
else $2b1b13c80e34d478$var$debug = function() {
};
$2b1b13c80e34d478$export$1c9f709888824e05 = $2b1b13c80e34d478$var$debug; // for test

});



parcelRequire.register("exEku", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
class $a9636e56f1897c98$var$BasicCredentialHandler {
    constructor(username, password){
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        options.headers['Authorization'] = 'Basic ' + Buffer.from(this.username + ':' + this.password).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
module.exports.BasicCredentialHandler = $a9636e56f1897c98$var$BasicCredentialHandler;
class $a9636e56f1897c98$var$BearerCredentialHandler {
    constructor(token){
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] = 'Bearer ' + this.token;
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
module.exports.BearerCredentialHandler = $a9636e56f1897c98$var$BearerCredentialHandler;
class $a9636e56f1897c98$var$PersonalAccessTokenCredentialHandler {
    constructor(token){
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] = 'Basic ' + Buffer.from('PAT:' + this.token).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
module.exports.PersonalAccessTokenCredentialHandler = $a9636e56f1897c98$var$PersonalAccessTokenCredentialHandler;

});



parcelRequire.register("d6Tes", function(module, exports) {
"use strict";
var $98b6adddafb1cce7$var$__createBinding = module.exports && module.exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var $98b6adddafb1cce7$var$__setModuleDefault = module.exports && module.exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var $98b6adddafb1cce7$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.hasOwnProperty.call(mod, k)) $98b6adddafb1cce7$var$__createBinding(result, mod, k);
    }
    $98b6adddafb1cce7$var$__setModuleDefault(result, mod);
    return result;
};
var $98b6adddafb1cce7$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.getExecOutput = module.exports.exec = void 0;


const $98b6adddafb1cce7$var$tr = $98b6adddafb1cce7$var$__importStar((parcelRequire("hg0kv")));
/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */ function $98b6adddafb1cce7$var$exec(commandLine, args, options) {
    return $98b6adddafb1cce7$var$__awaiter(this, void 0, void 0, function*() {
        const commandArgs = $98b6adddafb1cce7$var$tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new $98b6adddafb1cce7$var$tr.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
module.exports.exec = $98b6adddafb1cce7$var$exec;
/**
 * Exec a command and get the output.
 * Output will be streamed to the live console.
 * Returns promise with the exit code and collected stdout and stderr
 *
 * @param     commandLine           command to execute (can include additional args). Must be correctly escaped.
 * @param     args                  optional arguments for tool. Escaping is handled by the lib.
 * @param     options               optional exec options.  See ExecOptions
 * @returns   Promise<ExecOutput>   exit code, stdout, and stderr
 */ function $98b6adddafb1cce7$var$getExecOutput(commandLine, args, options) {
    var _a, _b;
    return $98b6adddafb1cce7$var$__awaiter(this, void 0, void 0, function*() {
        let stdout = '';
        let stderr = '';
        //Using string decoder covers the case where a mult-byte character is split
        const stdoutDecoder = new $bwvhf$string_decoder.StringDecoder('utf8');
        const stderrDecoder = new $bwvhf$string_decoder.StringDecoder('utf8');
        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
        const stdErrListener = (data)=>{
            stderr += stderrDecoder.write(data);
            if (originalStdErrListener) originalStdErrListener(data);
        };
        const stdOutListener = (data)=>{
            stdout += stdoutDecoder.write(data);
            if (originalStdoutListener) originalStdoutListener(data);
        };
        const listeners = Object.assign(Object.assign({
        }, options === null || options === void 0 ? void 0 : options.listeners), {
            stdout: stdOutListener,
            stderr: stdErrListener
        });
        const exitCode = yield $98b6adddafb1cce7$var$exec(commandLine, args, Object.assign(Object.assign({
        }, options), {
            listeners: listeners
        }));
        //flush any remaining characters
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
            exitCode: exitCode,
            stdout: stdout,
            stderr: stderr
        };
    });
}
module.exports.getExecOutput = $98b6adddafb1cce7$var$getExecOutput;

});
parcelRequire.register("hg0kv", function(module, exports) {
"use strict";
var $c9042fc836c323b9$var$__createBinding = module.exports && module.exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var $c9042fc836c323b9$var$__setModuleDefault = module.exports && module.exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var $c9042fc836c323b9$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.hasOwnProperty.call(mod, k)) $c9042fc836c323b9$var$__createBinding(result, mod, k);
    }
    $c9042fc836c323b9$var$__setModuleDefault(result, mod);
    return result;
};
var $c9042fc836c323b9$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.argStringToArray = module.exports.ToolRunner = void 0;

const $c9042fc836c323b9$var$os = $c9042fc836c323b9$var$__importStar($bwvhf$os);

const $c9042fc836c323b9$var$events = $c9042fc836c323b9$var$__importStar($bwvhf$events);

const $c9042fc836c323b9$var$child = $c9042fc836c323b9$var$__importStar($bwvhf$child_process);

const $c9042fc836c323b9$var$path = $c9042fc836c323b9$var$__importStar($bwvhf$path);

const $c9042fc836c323b9$var$io = $c9042fc836c323b9$var$__importStar((parcelRequire("7Q1Ak")));

const $c9042fc836c323b9$var$ioUtil = $c9042fc836c323b9$var$__importStar((parcelRequire("gRiwe")));

/* eslint-disable @typescript-eslint/unbound-method */ const $c9042fc836c323b9$var$IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */ class $c9042fc836c323b9$var$ToolRunner extends $c9042fc836c323b9$var$events.EventEmitter {
    constructor(toolPath, args, options){
        super();
        if (!toolPath) throw new Error("Parameter 'toolPath' cannot be null or empty.");
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {
        };
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) this.options.listeners.debug(message);
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if ($c9042fc836c323b9$var$IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args)cmd += ` ${a}`;
            } else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args)cmd += ` ${a}`;
            } else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args)cmd += ` ${this._windowsQuoteCmdArg(a)}`;
            }
        } else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args)cmd += ` ${a}`;
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf($c9042fc836c323b9$var$os.EOL);
            while(n > -1){
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + $c9042fc836c323b9$var$os.EOL.length);
                n = s.indexOf($c9042fc836c323b9$var$os.EOL);
            }
            return s;
        } catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
            return '';
        }
    }
    _getSpawnFileName() {
        if ($c9042fc836c323b9$var$IS_WINDOWS) {
            if (this._isCmdFile()) return process.env['COMSPEC'] || 'cmd.exe';
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if ($c9042fc836c323b9$var$IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args){
                    argline += ' ';
                    argline += options.windowsVerbatimArguments ? a : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [
                    argline
                ];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return this._endsWith(upperToolPath, '.CMD') || this._endsWith(upperToolPath, '.BAT');
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) return this._uvQuoteCmdArg(arg);
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) return '""';
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg)if (cmdSpecialChars.some((x)=>x === char
        )) {
            needsQuotes = true;
            break;
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) return arg;
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for(let i = arg.length; i > 0; i--){
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') reverse += '\\'; // double the slash
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            } else quoteHit = false;
        }
        reverse += '"';
        return reverse.split('').reverse().join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) // Need double quotation for empty argument
        return '""';
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) // No quotation needed
        return arg;
        if (!arg.includes('"') && !arg.includes('\\')) // No embedded double quotes or backslashes, so I can just wrap
        // quote marks around the whole thing.
        return `"${arg}"`;
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for(let i = arg.length; i > 0; i--){
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') reverse += '\\';
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            } else quoteHit = false;
        }
        reverse += '"';
        return reverse.split('').reverse().join('');
    }
    _cloneExecOptions(options) {
        options = options || {
        };
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {
        };
        const result = {
        };
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] = options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) result.argv0 = `"${toolPath}"`;
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */ exec() {
        return $c9042fc836c323b9$var$__awaiter(this, void 0, void 0, function*() {
            // root the tool path if it is unrooted and contains relative pathing
            if (!$c9042fc836c323b9$var$ioUtil.isRooted(this.toolPath) && (this.toolPath.includes('/') || $c9042fc836c323b9$var$IS_WINDOWS && this.toolPath.includes('\\'))) // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
            this.toolPath = $c9042fc836c323b9$var$path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield $c9042fc836c323b9$var$io.which(this.toolPath, true);
            return new Promise((resolve, reject)=>$c9042fc836c323b9$var$__awaiter(this, void 0, void 0, function*() {
                    this._debug(`exec tool: ${this.toolPath}`);
                    this._debug('arguments:');
                    for (const arg of this.args)this._debug(`   ${arg}`);
                    const optionsNonNull = this._cloneExecOptions(this.options);
                    if (!optionsNonNull.silent && optionsNonNull.outStream) optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + $c9042fc836c323b9$var$os.EOL);
                    const state = new $c9042fc836c323b9$var$ExecState(optionsNonNull, this.toolPath);
                    state.on('debug', (message)=>{
                        this._debug(message);
                    });
                    if (this.options.cwd && !(yield $c9042fc836c323b9$var$ioUtil.exists(this.options.cwd))) return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
                    const fileName = this._getSpawnFileName();
                    const cp = $c9042fc836c323b9$var$child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                    let stdbuffer = '';
                    if (cp.stdout) cp.stdout.on('data', (data)=>{
                        if (this.options.listeners && this.options.listeners.stdout) this.options.listeners.stdout(data);
                        if (!optionsNonNull.silent && optionsNonNull.outStream) optionsNonNull.outStream.write(data);
                        stdbuffer = this._processLineBuffer(data, stdbuffer, (line)=>{
                            if (this.options.listeners && this.options.listeners.stdline) this.options.listeners.stdline(line);
                        });
                    });
                    let errbuffer = '';
                    if (cp.stderr) cp.stderr.on('data', (data)=>{
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) this.options.listeners.stderr(data);
                        if (!optionsNonNull.silent && optionsNonNull.errStream && optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr ? optionsNonNull.errStream : optionsNonNull.outStream;
                            s.write(data);
                        }
                        errbuffer = this._processLineBuffer(data, errbuffer, (line)=>{
                            if (this.options.listeners && this.options.listeners.errline) this.options.listeners.errline(line);
                        });
                    });
                    cp.on('error', (err)=>{
                        state.processError = err.message;
                        state.processExited = true;
                        state.processClosed = true;
                        state.CheckComplete();
                    });
                    cp.on('exit', (code)=>{
                        state.processExitCode = code;
                        state.processExited = true;
                        this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                        state.CheckComplete();
                    });
                    cp.on('close', (code)=>{
                        state.processExitCode = code;
                        state.processExited = true;
                        state.processClosed = true;
                        this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                        state.CheckComplete();
                    });
                    state.on('done', (error, exitCode)=>{
                        if (stdbuffer.length > 0) this.emit('stdline', stdbuffer);
                        if (errbuffer.length > 0) this.emit('errline', errbuffer);
                        cp.removeAllListeners();
                        if (error) reject(error);
                        else resolve(exitCode);
                    });
                    if (this.options.input) {
                        if (!cp.stdin) throw new Error('child process missing stdin');
                        cp.stdin.end(this.options.input);
                    }
                })
            );
        });
    }
}
module.exports.ToolRunner = $c9042fc836c323b9$var$ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */ function $c9042fc836c323b9$var$argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') arg += '\\';
        arg += c;
        escaped = false;
    }
    for(let i = 0; i < argString.length; i++){
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) inQuotes = !inQuotes;
            else append(c);
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) args.push(arg.trim());
    return args;
}
module.exports.argStringToArray = $c9042fc836c323b9$var$argStringToArray;
class $c9042fc836c323b9$var$ExecState extends $c9042fc836c323b9$var$events.EventEmitter {
    constructor(options, toolPath){
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) throw new Error('toolPath must not be empty');
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) this.delay = options.delay;
    }
    CheckComplete() {
        if (this.done) return;
        if (this.processClosed) this._setResult();
        else if (this.processExited) this.timeout = $bwvhf$timers.setTimeout($c9042fc836c323b9$var$ExecState.HandleTimeout, this.delay, this);
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            else if (this.processStderr && this.options.failOnStdErr) error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) return;
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay / 1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}

});
parcelRequire.register("7Q1Ak", function(module, exports) {
"use strict";
var $5b4e9e7b212fa9bd$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $5b4e9e7b212fa9bd$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

const $5b4e9e7b212fa9bd$var$childProcess = $5b4e9e7b212fa9bd$var$__importStar($bwvhf$child_process);

const $5b4e9e7b212fa9bd$var$path = $5b4e9e7b212fa9bd$var$__importStar($bwvhf$path);


const $5b4e9e7b212fa9bd$var$ioUtil = $5b4e9e7b212fa9bd$var$__importStar((parcelRequire("gRiwe")));
const $5b4e9e7b212fa9bd$var$exec = $bwvhf$util.promisify($5b4e9e7b212fa9bd$var$childProcess.exec);
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */ function $5b4e9e7b212fa9bd$var$cp(source, dest, options = {
}) {
    return $5b4e9e7b212fa9bd$var$__awaiter(this, void 0, void 0, function*() {
        const { force: force , recursive: recursive  } = $5b4e9e7b212fa9bd$var$readCopyOptions(options);
        const destStat = (yield $5b4e9e7b212fa9bd$var$ioUtil.exists(dest)) ? yield $5b4e9e7b212fa9bd$var$ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) return;
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory() ? $5b4e9e7b212fa9bd$var$path.join(dest, $5b4e9e7b212fa9bd$var$path.basename(source)) : dest;
        if (!(yield $5b4e9e7b212fa9bd$var$ioUtil.exists(source))) throw new Error(`no such file or directory: ${source}`);
        const sourceStat = yield $5b4e9e7b212fa9bd$var$ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            else yield $5b4e9e7b212fa9bd$var$cpDirRecursive(source, newDest, 0, force);
        } else {
            if ($5b4e9e7b212fa9bd$var$path.relative(source, newDest) === '') // a file cannot be copied to itself
            throw new Error(`'${newDest}' and '${source}' are the same file`);
            yield $5b4e9e7b212fa9bd$var$copyFile(source, newDest, force);
        }
    });
}
module.exports.cp = $5b4e9e7b212fa9bd$var$cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */ function $5b4e9e7b212fa9bd$var$mv(source, dest, options = {
}) {
    return $5b4e9e7b212fa9bd$var$__awaiter(this, void 0, void 0, function*() {
        if (yield $5b4e9e7b212fa9bd$var$ioUtil.exists(dest)) {
            let destExists = true;
            if (yield $5b4e9e7b212fa9bd$var$ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = $5b4e9e7b212fa9bd$var$path.join(dest, $5b4e9e7b212fa9bd$var$path.basename(source));
                destExists = yield $5b4e9e7b212fa9bd$var$ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) yield $5b4e9e7b212fa9bd$var$rmRF(dest);
                else throw new Error('Destination already exists');
            }
        }
        yield $5b4e9e7b212fa9bd$var$mkdirP($5b4e9e7b212fa9bd$var$path.dirname(dest));
        yield $5b4e9e7b212fa9bd$var$ioUtil.rename(source, dest);
    });
}
module.exports.mv = $5b4e9e7b212fa9bd$var$mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */ function $5b4e9e7b212fa9bd$var$rmRF(inputPath) {
    return $5b4e9e7b212fa9bd$var$__awaiter(this, void 0, void 0, function*() {
        if ($5b4e9e7b212fa9bd$var$ioUtil.IS_WINDOWS) {
            // Node doesn't provide a delete operation, only an unlink function. This means that if the file is being used by another
            // program (e.g. antivirus), it won't be deleted. To address this, we shell out the work to rd/del.
            try {
                if (yield $5b4e9e7b212fa9bd$var$ioUtil.isDirectory(inputPath, true)) yield $5b4e9e7b212fa9bd$var$exec(`rd /s /q "${inputPath}"`);
                else yield $5b4e9e7b212fa9bd$var$exec(`del /f /a "${inputPath}"`);
            } catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT') throw err;
            }
            // Shelling out fails to remove a symlink folder with missing source, this unlink catches that
            try {
                yield $5b4e9e7b212fa9bd$var$ioUtil.unlink(inputPath);
            } catch (err1) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err1.code !== 'ENOENT') throw err1;
            }
        } else {
            let isDir = false;
            try {
                isDir = yield $5b4e9e7b212fa9bd$var$ioUtil.isDirectory(inputPath);
            } catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT') throw err;
                return;
            }
            if (isDir) yield $5b4e9e7b212fa9bd$var$exec(`rm -rf "${inputPath}"`);
            else yield $5b4e9e7b212fa9bd$var$ioUtil.unlink(inputPath);
        }
    });
}
module.exports.rmRF = $5b4e9e7b212fa9bd$var$rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */ function $5b4e9e7b212fa9bd$var$mkdirP(fsPath) {
    return $5b4e9e7b212fa9bd$var$__awaiter(this, void 0, void 0, function*() {
        yield $5b4e9e7b212fa9bd$var$ioUtil.mkdirP(fsPath);
    });
}
module.exports.mkdirP = $5b4e9e7b212fa9bd$var$mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */ function $5b4e9e7b212fa9bd$var$which(tool, check) {
    return $5b4e9e7b212fa9bd$var$__awaiter(this, void 0, void 0, function*() {
        if (!tool) throw new Error("parameter 'tool' is required");
        // recursive when check=true
        if (check) {
            const result = yield $5b4e9e7b212fa9bd$var$which(tool, false);
            if (!result) {
                if ($5b4e9e7b212fa9bd$var$ioUtil.IS_WINDOWS) throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                else throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
            }
            return result;
        }
        const matches = yield $5b4e9e7b212fa9bd$var$findInPath(tool);
        if (matches && matches.length > 0) return matches[0];
        return '';
    });
}
module.exports.which = $5b4e9e7b212fa9bd$var$which;
/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */ function $5b4e9e7b212fa9bd$var$findInPath(tool) {
    return $5b4e9e7b212fa9bd$var$__awaiter(this, void 0, void 0, function*() {
        if (!tool) throw new Error("parameter 'tool' is required");
        // build the list of extensions to try
        const extensions = [];
        if ($5b4e9e7b212fa9bd$var$ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
            for (const extension of process.env['PATHEXT'].split($5b4e9e7b212fa9bd$var$path.delimiter))if (extension) extensions.push(extension);
        }
        // if it's rooted, return it if exists. otherwise return empty.
        if ($5b4e9e7b212fa9bd$var$ioUtil.isRooted(tool)) {
            const filePath = yield $5b4e9e7b212fa9bd$var$ioUtil.tryGetExecutablePath(tool, extensions);
            if (filePath) return [
                filePath
            ];
            return [];
        }
        // if any path separators, return empty
        if (tool.includes($5b4e9e7b212fa9bd$var$path.sep)) return [];
        // build the list of directories
        //
        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
        // it feels like we should not do this. Checking the current directory seems like more of a use
        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
        // across platforms.
        const directories = [];
        if (process.env.PATH) {
            for (const p of process.env.PATH.split($5b4e9e7b212fa9bd$var$path.delimiter))if (p) directories.push(p);
        }
        // find all matches
        const matches = [];
        for (const directory of directories){
            const filePath = yield $5b4e9e7b212fa9bd$var$ioUtil.tryGetExecutablePath($5b4e9e7b212fa9bd$var$path.join(directory, tool), extensions);
            if (filePath) matches.push(filePath);
        }
        return matches;
    });
}
module.exports.findInPath = $5b4e9e7b212fa9bd$var$findInPath;
function $5b4e9e7b212fa9bd$var$readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    return {
        force: force,
        recursive: recursive
    };
}
function $5b4e9e7b212fa9bd$var$cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return $5b4e9e7b212fa9bd$var$__awaiter(this, void 0, void 0, function*() {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255) return;
        currentDepth++;
        yield $5b4e9e7b212fa9bd$var$mkdirP(destDir);
        const files = yield $5b4e9e7b212fa9bd$var$ioUtil.readdir(sourceDir);
        for (const fileName of files){
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield $5b4e9e7b212fa9bd$var$ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) // Recurse
            yield $5b4e9e7b212fa9bd$var$cpDirRecursive(srcFile, destFile, currentDepth, force);
            else yield $5b4e9e7b212fa9bd$var$copyFile(srcFile, destFile, force);
        }
        // Change the mode for the newly created directory
        yield $5b4e9e7b212fa9bd$var$ioUtil.chmod(destDir, (yield $5b4e9e7b212fa9bd$var$ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function $5b4e9e7b212fa9bd$var$copyFile(srcFile, destFile, force) {
    return $5b4e9e7b212fa9bd$var$__awaiter(this, void 0, void 0, function*() {
        if ((yield $5b4e9e7b212fa9bd$var$ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield $5b4e9e7b212fa9bd$var$ioUtil.lstat(destFile);
                yield $5b4e9e7b212fa9bd$var$ioUtil.unlink(destFile);
            } catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield $5b4e9e7b212fa9bd$var$ioUtil.chmod(destFile, '0666');
                    yield $5b4e9e7b212fa9bd$var$ioUtil.unlink(destFile);
                }
            // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield $5b4e9e7b212fa9bd$var$ioUtil.readlink(srcFile);
            yield $5b4e9e7b212fa9bd$var$ioUtil.symlink(symlinkFull, destFile, $5b4e9e7b212fa9bd$var$ioUtil.IS_WINDOWS ? 'junction' : null);
        } else if (!(yield $5b4e9e7b212fa9bd$var$ioUtil.exists(destFile)) || force) yield $5b4e9e7b212fa9bd$var$ioUtil.copyFile(srcFile, destFile);
    });
}

});
parcelRequire.register("gRiwe", function(module, exports) {
"use strict";
var $c45ff605546d9d02$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $c45ff605546d9d02$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
};
var $c45ff605546d9d02$var$_a;
Object.defineProperty(module.exports, "__esModule", {
    value: true
});


const $c45ff605546d9d02$var$fs = $c45ff605546d9d02$var$__importStar($bwvhf$fs);

const $c45ff605546d9d02$var$path = $c45ff605546d9d02$var$__importStar($bwvhf$path);
$c45ff605546d9d02$var$_a = $c45ff605546d9d02$var$fs.promises, module.exports.chmod = $c45ff605546d9d02$var$_a.chmod, module.exports.copyFile = $c45ff605546d9d02$var$_a.copyFile, module.exports.lstat = $c45ff605546d9d02$var$_a.lstat, module.exports.mkdir = $c45ff605546d9d02$var$_a.mkdir, module.exports.readdir = $c45ff605546d9d02$var$_a.readdir, module.exports.readlink = $c45ff605546d9d02$var$_a.readlink, module.exports.rename = $c45ff605546d9d02$var$_a.rename, module.exports.rmdir = $c45ff605546d9d02$var$_a.rmdir, module.exports.stat = $c45ff605546d9d02$var$_a.stat, module.exports.symlink = $c45ff605546d9d02$var$_a.symlink, module.exports.unlink = $c45ff605546d9d02$var$_a.unlink;
module.exports.IS_WINDOWS = process.platform === 'win32';
function $c45ff605546d9d02$var$exists(fsPath) {
    return $c45ff605546d9d02$var$__awaiter(this, void 0, void 0, function*() {
        try {
            yield module.exports.stat(fsPath);
        } catch (err) {
            if (err.code === 'ENOENT') return false;
            throw err;
        }
        return true;
    });
}
module.exports.exists = $c45ff605546d9d02$var$exists;
function $c45ff605546d9d02$var$isDirectory(fsPath, useStat = false) {
    return $c45ff605546d9d02$var$__awaiter(this, void 0, void 0, function*() {
        const stats = useStat ? yield module.exports.stat(fsPath) : yield module.exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
module.exports.isDirectory = $c45ff605546d9d02$var$isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */ function $c45ff605546d9d02$var$isRooted(p) {
    p = $c45ff605546d9d02$var$normalizeSeparators(p);
    if (!p) throw new Error('isRooted() parameter "p" cannot be empty');
    if (module.exports.IS_WINDOWS) return p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
    ; // e.g. C: or C:\hello
    return p.startsWith('/');
}
module.exports.isRooted = $c45ff605546d9d02$var$isRooted;
/**
 * Recursively create a directory at `fsPath`.
 *
 * This implementation is optimistic, meaning it attempts to create the full
 * path first, and backs up the path stack from there.
 *
 * @param fsPath The path to create
 * @param maxDepth The maximum recursion depth
 * @param depth The current recursion depth
 */ function $c45ff605546d9d02$var$mkdirP(fsPath, maxDepth = 1000, depth = 1) {
    return $c45ff605546d9d02$var$__awaiter(this, void 0, void 0, function*() {
        $bwvhf$assert.ok(fsPath, 'a path argument must be provided');
        fsPath = $c45ff605546d9d02$var$path.resolve(fsPath);
        if (depth >= maxDepth) return module.exports.mkdir(fsPath);
        try {
            yield module.exports.mkdir(fsPath);
            return;
        } catch (err) {
            switch(err.code){
                case 'ENOENT':
                    yield $c45ff605546d9d02$var$mkdirP($c45ff605546d9d02$var$path.dirname(fsPath), maxDepth, depth + 1);
                    yield module.exports.mkdir(fsPath);
                    return;
                default:
                    {
                        let stats;
                        try {
                            stats = yield module.exports.stat(fsPath);
                        } catch (err2) {
                            throw err;
                        }
                        if (!stats.isDirectory()) throw err;
                    }
            }
        }
    });
}
module.exports.mkdirP = $c45ff605546d9d02$var$mkdirP;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */ function $c45ff605546d9d02$var$tryGetExecutablePath(filePath, extensions) {
    return $c45ff605546d9d02$var$__awaiter(this, void 0, void 0, function*() {
        let stats = undefined;
        try {
            // test file exists
            stats = yield module.exports.stat(filePath);
        } catch (err) {
            if (err.code !== 'ENOENT') // eslint-disable-next-line no-console
            console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
        }
        if (stats && stats.isFile()) {
            if (module.exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = $c45ff605546d9d02$var$path.extname(filePath).toUpperCase();
                if (extensions.some((validExt)=>validExt.toUpperCase() === upperExt
                )) return filePath;
            } else {
                if ($c45ff605546d9d02$var$isUnixExecutable(stats)) return filePath;
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions){
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield module.exports.stat(filePath);
            } catch (err) {
                if (err.code !== 'ENOENT') // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
            if (stats && stats.isFile()) {
                if (module.exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = $c45ff605546d9d02$var$path.dirname(filePath);
                        const upperName = $c45ff605546d9d02$var$path.basename(filePath).toUpperCase();
                        for (const actualName of yield module.exports.readdir(directory))if (upperName === actualName.toUpperCase()) {
                            filePath = $c45ff605546d9d02$var$path.join(directory, actualName);
                            break;
                        }
                    } catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                } else {
                    if ($c45ff605546d9d02$var$isUnixExecutable(stats)) return filePath;
                }
            }
        }
        return '';
    });
}
module.exports.tryGetExecutablePath = $c45ff605546d9d02$var$tryGetExecutablePath;
function $c45ff605546d9d02$var$normalizeSeparators(p) {
    p = p || '';
    if (module.exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function $c45ff605546d9d02$var$isUnixExecutable(stats) {
    return (stats.mode & 1) > 0 || (stats.mode & 8) > 0 && stats.gid === process.getgid() || (stats.mode & 64) > 0 && stats.uid === process.getuid();
}

});




parcelRequire.register("gQX9t", function(module, exports) {
"use strict";
var $c44f62fc48076adc$var$__createBinding = module.exports && module.exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var $c44f62fc48076adc$var$__setModuleDefault = module.exports && module.exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var $c44f62fc48076adc$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.hasOwnProperty.call(mod, k)) $c44f62fc48076adc$var$__createBinding(result, mod, k);
    }
    $c44f62fc48076adc$var$__setModuleDefault(result, mod);
    return result;
};
var $c44f62fc48076adc$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.findInPath = module.exports.which = module.exports.mkdirP = module.exports.rmRF = module.exports.mv = module.exports.cp = void 0;


const $c44f62fc48076adc$var$childProcess = $c44f62fc48076adc$var$__importStar($bwvhf$child_process);

const $c44f62fc48076adc$var$path = $c44f62fc48076adc$var$__importStar($bwvhf$path);


const $c44f62fc48076adc$var$ioUtil = $c44f62fc48076adc$var$__importStar((parcelRequire("ev02f")));
const $c44f62fc48076adc$var$exec = $bwvhf$util.promisify($c44f62fc48076adc$var$childProcess.exec);
const $c44f62fc48076adc$var$execFile = $bwvhf$util.promisify($c44f62fc48076adc$var$childProcess.execFile);
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */ function $c44f62fc48076adc$var$cp(source, dest, options = {
}) {
    return $c44f62fc48076adc$var$__awaiter(this, void 0, void 0, function*() {
        const { force: force , recursive: recursive , copySourceDirectory: copySourceDirectory  } = $c44f62fc48076adc$var$readCopyOptions(options);
        const destStat = (yield $c44f62fc48076adc$var$ioUtil.exists(dest)) ? yield $c44f62fc48076adc$var$ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) return;
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory ? $c44f62fc48076adc$var$path.join(dest, $c44f62fc48076adc$var$path.basename(source)) : dest;
        if (!(yield $c44f62fc48076adc$var$ioUtil.exists(source))) throw new Error(`no such file or directory: ${source}`);
        const sourceStat = yield $c44f62fc48076adc$var$ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            else yield $c44f62fc48076adc$var$cpDirRecursive(source, newDest, 0, force);
        } else {
            if ($c44f62fc48076adc$var$path.relative(source, newDest) === '') // a file cannot be copied to itself
            throw new Error(`'${newDest}' and '${source}' are the same file`);
            yield $c44f62fc48076adc$var$copyFile(source, newDest, force);
        }
    });
}
module.exports.cp = $c44f62fc48076adc$var$cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */ function $c44f62fc48076adc$var$mv(source, dest, options = {
}) {
    return $c44f62fc48076adc$var$__awaiter(this, void 0, void 0, function*() {
        if (yield $c44f62fc48076adc$var$ioUtil.exists(dest)) {
            let destExists = true;
            if (yield $c44f62fc48076adc$var$ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = $c44f62fc48076adc$var$path.join(dest, $c44f62fc48076adc$var$path.basename(source));
                destExists = yield $c44f62fc48076adc$var$ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) yield $c44f62fc48076adc$var$rmRF(dest);
                else throw new Error('Destination already exists');
            }
        }
        yield $c44f62fc48076adc$var$mkdirP($c44f62fc48076adc$var$path.dirname(dest));
        yield $c44f62fc48076adc$var$ioUtil.rename(source, dest);
    });
}
module.exports.mv = $c44f62fc48076adc$var$mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */ function $c44f62fc48076adc$var$rmRF(inputPath) {
    return $c44f62fc48076adc$var$__awaiter(this, void 0, void 0, function*() {
        if ($c44f62fc48076adc$var$ioUtil.IS_WINDOWS) {
            // Node doesn't provide a delete operation, only an unlink function. This means that if the file is being used by another
            // program (e.g. antivirus), it won't be deleted. To address this, we shell out the work to rd/del.
            // Check for invalid characters
            // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
            if (/[*"<>|]/.test(inputPath)) throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
            try {
                const cmdPath = $c44f62fc48076adc$var$ioUtil.getCmdPath();
                if (yield $c44f62fc48076adc$var$ioUtil.isDirectory(inputPath, true)) yield $c44f62fc48076adc$var$exec(`${cmdPath} /s /c "rd /s /q "%inputPath%""`, {
                    env: {
                        inputPath: inputPath
                    }
                });
                else yield $c44f62fc48076adc$var$exec(`${cmdPath} /s /c "del /f /a "%inputPath%""`, {
                    env: {
                        inputPath: inputPath
                    }
                });
            } catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT') throw err;
            }
            // Shelling out fails to remove a symlink folder with missing source, this unlink catches that
            try {
                yield $c44f62fc48076adc$var$ioUtil.unlink(inputPath);
            } catch (err1) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err1.code !== 'ENOENT') throw err1;
            }
        } else {
            let isDir = false;
            try {
                isDir = yield $c44f62fc48076adc$var$ioUtil.isDirectory(inputPath);
            } catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT') throw err;
                return;
            }
            if (isDir) yield $c44f62fc48076adc$var$execFile(`rm`, [
                `-rf`,
                `${inputPath}`
            ]);
            else yield $c44f62fc48076adc$var$ioUtil.unlink(inputPath);
        }
    });
}
module.exports.rmRF = $c44f62fc48076adc$var$rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */ function $c44f62fc48076adc$var$mkdirP(fsPath) {
    return $c44f62fc48076adc$var$__awaiter(this, void 0, void 0, function*() {
        $bwvhf$assert.ok(fsPath, 'a path argument must be provided');
        yield $c44f62fc48076adc$var$ioUtil.mkdir(fsPath, {
            recursive: true
        });
    });
}
module.exports.mkdirP = $c44f62fc48076adc$var$mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */ function $c44f62fc48076adc$var$which(tool, check) {
    return $c44f62fc48076adc$var$__awaiter(this, void 0, void 0, function*() {
        if (!tool) throw new Error("parameter 'tool' is required");
        // recursive when check=true
        if (check) {
            const result = yield $c44f62fc48076adc$var$which(tool, false);
            if (!result) {
                if ($c44f62fc48076adc$var$ioUtil.IS_WINDOWS) throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                else throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
            }
            return result;
        }
        const matches = yield $c44f62fc48076adc$var$findInPath(tool);
        if (matches && matches.length > 0) return matches[0];
        return '';
    });
}
module.exports.which = $c44f62fc48076adc$var$which;
/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */ function $c44f62fc48076adc$var$findInPath(tool) {
    return $c44f62fc48076adc$var$__awaiter(this, void 0, void 0, function*() {
        if (!tool) throw new Error("parameter 'tool' is required");
        // build the list of extensions to try
        const extensions = [];
        if ($c44f62fc48076adc$var$ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
            for (const extension of process.env['PATHEXT'].split($c44f62fc48076adc$var$path.delimiter))if (extension) extensions.push(extension);
        }
        // if it's rooted, return it if exists. otherwise return empty.
        if ($c44f62fc48076adc$var$ioUtil.isRooted(tool)) {
            const filePath = yield $c44f62fc48076adc$var$ioUtil.tryGetExecutablePath(tool, extensions);
            if (filePath) return [
                filePath
            ];
            return [];
        }
        // if any path separators, return empty
        if (tool.includes($c44f62fc48076adc$var$path.sep)) return [];
        // build the list of directories
        //
        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
        // it feels like we should not do this. Checking the current directory seems like more of a use
        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
        // across platforms.
        const directories = [];
        if (process.env.PATH) {
            for (const p of process.env.PATH.split($c44f62fc48076adc$var$path.delimiter))if (p) directories.push(p);
        }
        // find all matches
        const matches = [];
        for (const directory of directories){
            const filePath = yield $c44f62fc48076adc$var$ioUtil.tryGetExecutablePath($c44f62fc48076adc$var$path.join(directory, tool), extensions);
            if (filePath) matches.push(filePath);
        }
        return matches;
    });
}
module.exports.findInPath = $c44f62fc48076adc$var$findInPath;
function $c44f62fc48076adc$var$readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    const copySourceDirectory = options.copySourceDirectory == null ? true : Boolean(options.copySourceDirectory);
    return {
        force: force,
        recursive: recursive,
        copySourceDirectory: copySourceDirectory
    };
}
function $c44f62fc48076adc$var$cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return $c44f62fc48076adc$var$__awaiter(this, void 0, void 0, function*() {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255) return;
        currentDepth++;
        yield $c44f62fc48076adc$var$mkdirP(destDir);
        const files = yield $c44f62fc48076adc$var$ioUtil.readdir(sourceDir);
        for (const fileName of files){
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield $c44f62fc48076adc$var$ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) // Recurse
            yield $c44f62fc48076adc$var$cpDirRecursive(srcFile, destFile, currentDepth, force);
            else yield $c44f62fc48076adc$var$copyFile(srcFile, destFile, force);
        }
        // Change the mode for the newly created directory
        yield $c44f62fc48076adc$var$ioUtil.chmod(destDir, (yield $c44f62fc48076adc$var$ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function $c44f62fc48076adc$var$copyFile(srcFile, destFile, force) {
    return $c44f62fc48076adc$var$__awaiter(this, void 0, void 0, function*() {
        if ((yield $c44f62fc48076adc$var$ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield $c44f62fc48076adc$var$ioUtil.lstat(destFile);
                yield $c44f62fc48076adc$var$ioUtil.unlink(destFile);
            } catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield $c44f62fc48076adc$var$ioUtil.chmod(destFile, '0666');
                    yield $c44f62fc48076adc$var$ioUtil.unlink(destFile);
                }
            // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield $c44f62fc48076adc$var$ioUtil.readlink(srcFile);
            yield $c44f62fc48076adc$var$ioUtil.symlink(symlinkFull, destFile, $c44f62fc48076adc$var$ioUtil.IS_WINDOWS ? 'junction' : null);
        } else if (!(yield $c44f62fc48076adc$var$ioUtil.exists(destFile)) || force) yield $c44f62fc48076adc$var$ioUtil.copyFile(srcFile, destFile);
    });
}

});
parcelRequire.register("ev02f", function(module, exports) {
"use strict";
var $a8e3fcf54a00f413$var$__createBinding = module.exports && module.exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var $a8e3fcf54a00f413$var$__setModuleDefault = module.exports && module.exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var $a8e3fcf54a00f413$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.hasOwnProperty.call(mod, k)) $a8e3fcf54a00f413$var$__createBinding(result, mod, k);
    }
    $a8e3fcf54a00f413$var$__setModuleDefault(result, mod);
    return result;
};
var $a8e3fcf54a00f413$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $a8e3fcf54a00f413$var$_a;
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.getCmdPath = module.exports.tryGetExecutablePath = module.exports.isRooted = module.exports.isDirectory = module.exports.exists = module.exports.IS_WINDOWS = module.exports.unlink = module.exports.symlink = module.exports.stat = module.exports.rmdir = module.exports.rename = module.exports.readlink = module.exports.readdir = module.exports.mkdir = module.exports.lstat = module.exports.copyFile = module.exports.chmod = void 0;

const $a8e3fcf54a00f413$var$fs = $a8e3fcf54a00f413$var$__importStar($bwvhf$fs);

const $a8e3fcf54a00f413$var$path = $a8e3fcf54a00f413$var$__importStar($bwvhf$path);
$a8e3fcf54a00f413$var$_a = $a8e3fcf54a00f413$var$fs.promises, module.exports.chmod = $a8e3fcf54a00f413$var$_a.chmod, module.exports.copyFile = $a8e3fcf54a00f413$var$_a.copyFile, module.exports.lstat = $a8e3fcf54a00f413$var$_a.lstat, module.exports.mkdir = $a8e3fcf54a00f413$var$_a.mkdir, module.exports.readdir = $a8e3fcf54a00f413$var$_a.readdir, module.exports.readlink = $a8e3fcf54a00f413$var$_a.readlink, module.exports.rename = $a8e3fcf54a00f413$var$_a.rename, module.exports.rmdir = $a8e3fcf54a00f413$var$_a.rmdir, module.exports.stat = $a8e3fcf54a00f413$var$_a.stat, module.exports.symlink = $a8e3fcf54a00f413$var$_a.symlink, module.exports.unlink = $a8e3fcf54a00f413$var$_a.unlink;
module.exports.IS_WINDOWS = process.platform === 'win32';
function $a8e3fcf54a00f413$var$exists(fsPath) {
    return $a8e3fcf54a00f413$var$__awaiter(this, void 0, void 0, function*() {
        try {
            yield module.exports.stat(fsPath);
        } catch (err) {
            if (err.code === 'ENOENT') return false;
            throw err;
        }
        return true;
    });
}
module.exports.exists = $a8e3fcf54a00f413$var$exists;
function $a8e3fcf54a00f413$var$isDirectory(fsPath, useStat = false) {
    return $a8e3fcf54a00f413$var$__awaiter(this, void 0, void 0, function*() {
        const stats = useStat ? yield module.exports.stat(fsPath) : yield module.exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
module.exports.isDirectory = $a8e3fcf54a00f413$var$isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */ function $a8e3fcf54a00f413$var$isRooted(p) {
    p = $a8e3fcf54a00f413$var$normalizeSeparators(p);
    if (!p) throw new Error('isRooted() parameter "p" cannot be empty');
    if (module.exports.IS_WINDOWS) return p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
    ; // e.g. C: or C:\hello
    return p.startsWith('/');
}
module.exports.isRooted = $a8e3fcf54a00f413$var$isRooted;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */ function $a8e3fcf54a00f413$var$tryGetExecutablePath(filePath, extensions) {
    return $a8e3fcf54a00f413$var$__awaiter(this, void 0, void 0, function*() {
        let stats = undefined;
        try {
            // test file exists
            stats = yield module.exports.stat(filePath);
        } catch (err) {
            if (err.code !== 'ENOENT') // eslint-disable-next-line no-console
            console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
        }
        if (stats && stats.isFile()) {
            if (module.exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = $a8e3fcf54a00f413$var$path.extname(filePath).toUpperCase();
                if (extensions.some((validExt)=>validExt.toUpperCase() === upperExt
                )) return filePath;
            } else {
                if ($a8e3fcf54a00f413$var$isUnixExecutable(stats)) return filePath;
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions){
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield module.exports.stat(filePath);
            } catch (err) {
                if (err.code !== 'ENOENT') // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
            if (stats && stats.isFile()) {
                if (module.exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = $a8e3fcf54a00f413$var$path.dirname(filePath);
                        const upperName = $a8e3fcf54a00f413$var$path.basename(filePath).toUpperCase();
                        for (const actualName of yield module.exports.readdir(directory))if (upperName === actualName.toUpperCase()) {
                            filePath = $a8e3fcf54a00f413$var$path.join(directory, actualName);
                            break;
                        }
                    } catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                } else {
                    if ($a8e3fcf54a00f413$var$isUnixExecutable(stats)) return filePath;
                }
            }
        }
        return '';
    });
}
module.exports.tryGetExecutablePath = $a8e3fcf54a00f413$var$tryGetExecutablePath;
function $a8e3fcf54a00f413$var$normalizeSeparators(p) {
    p = p || '';
    if (module.exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function $a8e3fcf54a00f413$var$isUnixExecutable(stats) {
    return (stats.mode & 1) > 0 || (stats.mode & 8) > 0 && stats.gid === process.getgid() || (stats.mode & 64) > 0 && stats.uid === process.getuid();
}
// Get the path of cmd.exe in windows
function $a8e3fcf54a00f413$var$getCmdPath() {
    var _a;
    return (_a = process.env['COMSPEC']) !== null && _a !== void 0 ? _a : `cmd.exe`;
}
module.exports.getCmdPath = $a8e3fcf54a00f413$var$getCmdPath;

});


parcelRequire.register("ficLE", function(module, exports) {
"use strict";
var $b22270d42506803e$var$__createBinding = module.exports && module.exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var $b22270d42506803e$var$__setModuleDefault = module.exports && module.exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var $b22270d42506803e$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.hasOwnProperty.call(mod, k)) $b22270d42506803e$var$__createBinding(result, mod, k);
    }
    $b22270d42506803e$var$__setModuleDefault(result, mod);
    return result;
};
var $b22270d42506803e$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $b22270d42506803e$var$__importDefault = module.exports && module.exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.evaluateVersions = module.exports.isExplicitVersion = module.exports.findFromManifest = module.exports.getManifestFromRepo = module.exports.findAllVersions = module.exports.find = module.exports.cacheFile = module.exports.cacheDir = module.exports.extractZip = module.exports.extractXar = module.exports.extractTar = module.exports.extract7z = module.exports.downloadTool = module.exports.HTTPError = void 0;

const $b22270d42506803e$var$core = $b22270d42506803e$var$__importStar((parcelRequire("1WahJ")));

const $b22270d42506803e$var$io = $b22270d42506803e$var$__importStar((parcelRequire("gQX9t")));

const $b22270d42506803e$var$fs = $b22270d42506803e$var$__importStar($bwvhf$fs);

const $b22270d42506803e$var$mm = $b22270d42506803e$var$__importStar((parcelRequire("9ZxT3")));

const $b22270d42506803e$var$os = $b22270d42506803e$var$__importStar($bwvhf$os);

const $b22270d42506803e$var$path = $b22270d42506803e$var$__importStar($bwvhf$path);

const $b22270d42506803e$var$httpm = $b22270d42506803e$var$__importStar((parcelRequire("lcdeq")));

const $b22270d42506803e$var$semver = $b22270d42506803e$var$__importStar((parcelRequire("4ISl9")));

const $b22270d42506803e$var$stream = $b22270d42506803e$var$__importStar($bwvhf$stream);

const $b22270d42506803e$var$util = $b22270d42506803e$var$__importStar($bwvhf$util);

const $b22270d42506803e$var$v4_1 = $b22270d42506803e$var$__importDefault((parcelRequire("azAOm")));

var $k3Kbe = parcelRequire("k3Kbe");


var $kiZ0G = parcelRequire("kiZ0G");
class $b22270d42506803e$var$HTTPError extends Error {
    constructor(httpStatusCode){
        super(`Unexpected HTTP response: ${httpStatusCode}`);
        this.httpStatusCode = httpStatusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
module.exports.HTTPError = $b22270d42506803e$var$HTTPError;
const $b22270d42506803e$var$IS_WINDOWS = process.platform === 'win32';
const $b22270d42506803e$var$IS_MAC = process.platform === 'darwin';
const $b22270d42506803e$var$userAgent = 'actions/tool-cache';
/**
 * Download a tool from an url and stream it into a file
 *
 * @param url       url of tool to download
 * @param dest      path to download tool
 * @param auth      authorization header
 * @param headers   other headers
 * @returns         path to downloaded tool
 */ function $b22270d42506803e$var$downloadTool(url, dest, auth, headers) {
    return $b22270d42506803e$var$__awaiter(this, void 0, void 0, function*() {
        dest = dest || $b22270d42506803e$var$path.join($b22270d42506803e$var$_getTempDirectory(), $b22270d42506803e$var$v4_1.default());
        yield $b22270d42506803e$var$io.mkdirP($b22270d42506803e$var$path.dirname(dest));
        $b22270d42506803e$var$core.debug(`Downloading ${url}`);
        $b22270d42506803e$var$core.debug(`Destination ${dest}`);
        const maxAttempts = 3;
        const minSeconds = $b22270d42506803e$var$_getGlobal('TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS', 10);
        const maxSeconds = $b22270d42506803e$var$_getGlobal('TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS', 20);
        const retryHelper = new $kiZ0G.RetryHelper(maxAttempts, minSeconds, maxSeconds);
        return yield retryHelper.execute(()=>$b22270d42506803e$var$__awaiter(this, void 0, void 0, function*() {
                return yield $b22270d42506803e$var$downloadToolAttempt(url, dest || '', auth, headers);
            })
        , (err)=>{
            if (err instanceof $b22270d42506803e$var$HTTPError && err.httpStatusCode) {
                // Don't retry anything less than 500, except 408 Request Timeout and 429 Too Many Requests
                if (err.httpStatusCode < 500 && err.httpStatusCode !== 408 && err.httpStatusCode !== 429) return false;
            }
            // Otherwise retry
            return true;
        });
    });
}
module.exports.downloadTool = $b22270d42506803e$var$downloadTool;
function $b22270d42506803e$var$downloadToolAttempt(url, dest, auth, headers) {
    return $b22270d42506803e$var$__awaiter(this, void 0, void 0, function*() {
        if ($b22270d42506803e$var$fs.existsSync(dest)) throw new Error(`Destination file path ${dest} already exists`);
        // Get the response headers
        const http = new $b22270d42506803e$var$httpm.HttpClient($b22270d42506803e$var$userAgent, [], {
            allowRetries: false
        });
        if (auth) {
            $b22270d42506803e$var$core.debug('set auth');
            if (headers === undefined) headers = {
            };
            headers.authorization = auth;
        }
        const response = yield http.get(url, headers);
        if (response.message.statusCode !== 200) {
            const err = new $b22270d42506803e$var$HTTPError(response.message.statusCode);
            $b22270d42506803e$var$core.debug(`Failed to download from "${url}". Code(${response.message.statusCode}) Message(${response.message.statusMessage})`);
            throw err;
        }
        // Download the response body
        const pipeline = $b22270d42506803e$var$util.promisify($b22270d42506803e$var$stream.pipeline);
        const responseMessageFactory = $b22270d42506803e$var$_getGlobal('TEST_DOWNLOAD_TOOL_RESPONSE_MESSAGE_FACTORY', ()=>response.message
        );
        const readStream = responseMessageFactory();
        let succeeded = false;
        try {
            yield pipeline(readStream, $b22270d42506803e$var$fs.createWriteStream(dest));
            $b22270d42506803e$var$core.debug('download complete');
            succeeded = true;
            return dest;
        } finally{
            // Error, delete dest before retry
            if (!succeeded) {
                $b22270d42506803e$var$core.debug('download failed');
                try {
                    yield $b22270d42506803e$var$io.rmRF(dest);
                } catch (err) {
                    $b22270d42506803e$var$core.debug(`Failed to delete '${dest}'. ${err.message}`);
                }
            }
        }
    });
}
/**
 * Extract a .7z file
 *
 * @param file     path to the .7z file
 * @param dest     destination directory. Optional.
 * @param _7zPath  path to 7zr.exe. Optional, for long path support. Most .7z archives do not have this
 * problem. If your .7z archive contains very long paths, you can pass the path to 7zr.exe which will
 * gracefully handle long paths. By default 7zdec.exe is used because it is a very small program and is
 * bundled with the tool lib. However it does not support long paths. 7zr.exe is the reduced command line
 * interface, it is smaller than the full command line interface, and it does support long paths. At the
 * time of this writing, it is freely available from the LZMA SDK that is available on the 7zip website.
 * Be sure to check the current license agreement. If 7zr.exe is bundled with your action, then the path
 * to 7zr.exe can be pass to this function.
 * @returns        path to the destination directory
 */ function $b22270d42506803e$var$extract7z(file, dest, _7zPath) {
    return $b22270d42506803e$var$__awaiter(this, void 0, void 0, function*() {
        $bwvhf$assert.ok($b22270d42506803e$var$IS_WINDOWS, 'extract7z() not supported on current OS');
        $bwvhf$assert.ok(file, 'parameter "file" is required');
        dest = yield $b22270d42506803e$var$_createExtractFolder(dest);
        const originalCwd = process.cwd();
        process.chdir(dest);
        if (_7zPath) try {
            const logLevel = $b22270d42506803e$var$core.isDebug() ? '-bb1' : '-bb0';
            const args = [
                'x',
                logLevel,
                '-bd',
                '-sccUTF-8',
                file
            ];
            const options = {
                silent: true
            };
            yield $k3Kbe.exec(`"${_7zPath}"`, args, options);
        } finally{
            process.chdir(originalCwd);
        }
        else {
            const escapedScript = $b22270d42506803e$var$path.join(__dirname, '..', 'scripts', 'Invoke-7zdec.ps1').replace(/'/g, "''").replace(/"|\n|\r/g, ''); // double-up single quotes, remove double quotes and newlines
            const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, '');
            const escapedTarget = dest.replace(/'/g, "''").replace(/"|\n|\r/g, '');
            const command = `& '${escapedScript}' -Source '${escapedFile}' -Target '${escapedTarget}'`;
            const args = [
                '-NoLogo',
                '-Sta',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                command
            ];
            const options = {
                silent: true
            };
            try {
                const powershellPath = yield $b22270d42506803e$var$io.which('powershell', true);
                yield $k3Kbe.exec(`"${powershellPath}"`, args, options);
            } finally{
                process.chdir(originalCwd);
            }
        }
        return dest;
    });
}
module.exports.extract7z = $b22270d42506803e$var$extract7z;
/**
 * Extract a compressed tar archive
 *
 * @param file     path to the tar
 * @param dest     destination directory. Optional.
 * @param flags    flags for the tar command to use for extraction. Defaults to 'xz' (extracting gzipped tars). Optional.
 * @returns        path to the destination directory
 */ function $b22270d42506803e$var$extractTar(file, dest, flags = 'xz') {
    return $b22270d42506803e$var$__awaiter(this, void 0, void 0, function*() {
        if (!file) throw new Error("parameter 'file' is required");
        // Create dest
        dest = yield $b22270d42506803e$var$_createExtractFolder(dest);
        // Determine whether GNU tar
        $b22270d42506803e$var$core.debug('Checking tar --version');
        let versionOutput = '';
        yield $k3Kbe.exec('tar --version', [], {
            ignoreReturnCode: true,
            silent: true,
            listeners: {
                stdout: (data)=>versionOutput += data.toString()
                ,
                stderr: (data)=>versionOutput += data.toString()
            }
        });
        $b22270d42506803e$var$core.debug(versionOutput.trim());
        const isGnuTar = versionOutput.toUpperCase().includes('GNU TAR');
        // Initialize args
        let args;
        if (flags instanceof Array) args = flags;
        else args = [
            flags
        ];
        if ($b22270d42506803e$var$core.isDebug() && !flags.includes('v')) args.push('-v');
        let destArg = dest;
        let fileArg = file;
        if ($b22270d42506803e$var$IS_WINDOWS && isGnuTar) {
            args.push('--force-local');
            destArg = dest.replace(/\\/g, '/');
            // Technically only the dest needs to have `/` but for aesthetic consistency
            // convert slashes in the file arg too.
            fileArg = file.replace(/\\/g, '/');
        }
        if (isGnuTar) {
            // Suppress warnings when using GNU tar to extract archives created by BSD tar
            args.push('--warning=no-unknown-keyword');
            args.push('--overwrite');
        }
        args.push('-C', destArg, '-f', fileArg);
        yield $k3Kbe.exec(`tar`, args);
        return dest;
    });
}
module.exports.extractTar = $b22270d42506803e$var$extractTar;
/**
 * Extract a xar compatible archive
 *
 * @param file     path to the archive
 * @param dest     destination directory. Optional.
 * @param flags    flags for the xar. Optional.
 * @returns        path to the destination directory
 */ function $b22270d42506803e$var$extractXar(file, dest, flags = []) {
    return $b22270d42506803e$var$__awaiter(this, void 0, void 0, function*() {
        $bwvhf$assert.ok($b22270d42506803e$var$IS_MAC, 'extractXar() not supported on current OS');
        $bwvhf$assert.ok(file, 'parameter "file" is required');
        dest = yield $b22270d42506803e$var$_createExtractFolder(dest);
        let args;
        if (flags instanceof Array) args = flags;
        else args = [
            flags
        ];
        args.push('-x', '-C', dest, '-f', file);
        if ($b22270d42506803e$var$core.isDebug()) args.push('-v');
        const xarPath = yield $b22270d42506803e$var$io.which('xar', true);
        yield $k3Kbe.exec(`"${xarPath}"`, $b22270d42506803e$var$_unique(args));
        return dest;
    });
}
module.exports.extractXar = $b22270d42506803e$var$extractXar;
/**
 * Extract a zip
 *
 * @param file     path to the zip
 * @param dest     destination directory. Optional.
 * @returns        path to the destination directory
 */ function $b22270d42506803e$var$extractZip(file, dest) {
    return $b22270d42506803e$var$__awaiter(this, void 0, void 0, function*() {
        if (!file) throw new Error("parameter 'file' is required");
        dest = yield $b22270d42506803e$var$_createExtractFolder(dest);
        if ($b22270d42506803e$var$IS_WINDOWS) yield $b22270d42506803e$var$extractZipWin(file, dest);
        else yield $b22270d42506803e$var$extractZipNix(file, dest);
        return dest;
    });
}
module.exports.extractZip = $b22270d42506803e$var$extractZip;
function $b22270d42506803e$var$extractZipWin(file, dest) {
    return $b22270d42506803e$var$__awaiter(this, void 0, void 0, function*() {
        // build the powershell command
        const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, ''); // double-up single quotes, remove double quotes and newlines
        const escapedDest = dest.replace(/'/g, "''").replace(/"|\n|\r/g, '');
        const pwshPath = yield $b22270d42506803e$var$io.which('pwsh', false);
        //To match the file overwrite behavior on nix systems, we use the overwrite = true flag for ExtractToDirectory
        //and the -Force flag for Expand-Archive as a fallback
        if (pwshPath) {
            //attempt to use pwsh with ExtractToDirectory, if this fails attempt Expand-Archive
            const pwshCommand = [
                `$ErrorActionPreference = 'Stop' ;`,
                `try { Add-Type -AssemblyName System.IO.Compression.ZipFile } catch { } ;`,
                `try { [System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`,
                `catch { if (($_.Exception.GetType().FullName -eq 'System.Management.Automation.MethodException') -or ($_.Exception.GetType().FullName -eq 'System.Management.Automation.RuntimeException') ){ Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force } else { throw $_ } } ;`
            ].join(' ');
            const args = [
                '-NoLogo',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                pwshCommand
            ];
            $b22270d42506803e$var$core.debug(`Using pwsh at path: ${pwshPath}`);
            yield $k3Kbe.exec(`"${pwshPath}"`, args);
        } else {
            const powershellCommand = [
                `$ErrorActionPreference = 'Stop' ;`,
                `try { Add-Type -AssemblyName System.IO.Compression.FileSystem } catch { } ;`,
                `if ((Get-Command -Name Expand-Archive -Module Microsoft.PowerShell.Archive -ErrorAction Ignore)) { Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force }`,
                `else {[System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`
            ].join(' ');
            const args = [
                '-NoLogo',
                '-Sta',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                powershellCommand
            ];
            const powershellPath = yield $b22270d42506803e$var$io.which('powershell', true);
            $b22270d42506803e$var$core.debug(`Using powershell at path: ${powershellPath}`);
            yield $k3Kbe.exec(`"${powershellPath}"`, args);
        }
    });
}
function $b22270d42506803e$var$extractZipNix(file, dest) {
    return $b22270d42506803e$var$__awaiter(this, void 0, void 0, function*() {
        const unzipPath = yield $b22270d42506803e$var$io.which('unzip', true);
        const args = [
            file
        ];
        if (!$b22270d42506803e$var$core.isDebug()) args.unshift('-q');
        args.unshift('-o'); //overwrite with -o, otherwise a prompt is shown which freezes the run
        yield $k3Kbe.exec(`"${unzipPath}"`, args, {
            cwd: dest
        });
    });
}
/**
 * Caches a directory and installs it into the tool cacheDir
 *
 * @param sourceDir    the directory to cache into tools
 * @param tool          tool name
 * @param version       version of the tool.  semver format
 * @param arch          architecture of the tool.  Optional.  Defaults to machine architecture
 */ function $b22270d42506803e$var$cacheDir(sourceDir, tool, version, arch) {
    return $b22270d42506803e$var$__awaiter(this, void 0, void 0, function*() {
        version = $b22270d42506803e$var$semver.clean(version) || version;
        arch = arch || $b22270d42506803e$var$os.arch();
        $b22270d42506803e$var$core.debug(`Caching tool ${tool} ${version} ${arch}`);
        $b22270d42506803e$var$core.debug(`source dir: ${sourceDir}`);
        if (!$b22270d42506803e$var$fs.statSync(sourceDir).isDirectory()) throw new Error('sourceDir is not a directory');
        // Create the tool dir
        const destPath = yield $b22270d42506803e$var$_createToolPath(tool, version, arch);
        // copy each child item. do not move. move can fail on Windows
        // due to anti-virus software having an open handle on a file.
        for (const itemName of $b22270d42506803e$var$fs.readdirSync(sourceDir)){
            const s = $b22270d42506803e$var$path.join(sourceDir, itemName);
            yield $b22270d42506803e$var$io.cp(s, destPath, {
                recursive: true
            });
        }
        // write .complete
        $b22270d42506803e$var$_completeToolPath(tool, version, arch);
        return destPath;
    });
}
module.exports.cacheDir = $b22270d42506803e$var$cacheDir;
/**
 * Caches a downloaded file (GUID) and installs it
 * into the tool cache with a given targetName
 *
 * @param sourceFile    the file to cache into tools.  Typically a result of downloadTool which is a guid.
 * @param targetFile    the name of the file name in the tools directory
 * @param tool          tool name
 * @param version       version of the tool.  semver format
 * @param arch          architecture of the tool.  Optional.  Defaults to machine architecture
 */ function $b22270d42506803e$var$cacheFile(sourceFile, targetFile, tool, version, arch) {
    return $b22270d42506803e$var$__awaiter(this, void 0, void 0, function*() {
        version = $b22270d42506803e$var$semver.clean(version) || version;
        arch = arch || $b22270d42506803e$var$os.arch();
        $b22270d42506803e$var$core.debug(`Caching tool ${tool} ${version} ${arch}`);
        $b22270d42506803e$var$core.debug(`source file: ${sourceFile}`);
        if (!$b22270d42506803e$var$fs.statSync(sourceFile).isFile()) throw new Error('sourceFile is not a file');
        // create the tool dir
        const destFolder = yield $b22270d42506803e$var$_createToolPath(tool, version, arch);
        // copy instead of move. move can fail on Windows due to
        // anti-virus software having an open handle on a file.
        const destPath = $b22270d42506803e$var$path.join(destFolder, targetFile);
        $b22270d42506803e$var$core.debug(`destination file ${destPath}`);
        yield $b22270d42506803e$var$io.cp(sourceFile, destPath);
        // write .complete
        $b22270d42506803e$var$_completeToolPath(tool, version, arch);
        return destFolder;
    });
}
module.exports.cacheFile = $b22270d42506803e$var$cacheFile;
/**
 * Finds the path to a tool version in the local installed tool cache
 *
 * @param toolName      name of the tool
 * @param versionSpec   version of the tool
 * @param arch          optional arch.  defaults to arch of computer
 */ function $b22270d42506803e$var$find(toolName, versionSpec, arch) {
    if (!toolName) throw new Error('toolName parameter is required');
    if (!versionSpec) throw new Error('versionSpec parameter is required');
    arch = arch || $b22270d42506803e$var$os.arch();
    // attempt to resolve an explicit version
    if (!$b22270d42506803e$var$isExplicitVersion(versionSpec)) {
        const localVersions = $b22270d42506803e$var$findAllVersions(toolName, arch);
        const match = $b22270d42506803e$var$evaluateVersions(localVersions, versionSpec);
        versionSpec = match;
    }
    // check for the explicit version in the cache
    let toolPath = '';
    if (versionSpec) {
        versionSpec = $b22270d42506803e$var$semver.clean(versionSpec) || '';
        const cachePath = $b22270d42506803e$var$path.join($b22270d42506803e$var$_getCacheDirectory(), toolName, versionSpec, arch);
        $b22270d42506803e$var$core.debug(`checking cache: ${cachePath}`);
        if ($b22270d42506803e$var$fs.existsSync(cachePath) && $b22270d42506803e$var$fs.existsSync(`${cachePath}.complete`)) {
            $b22270d42506803e$var$core.debug(`Found tool in cache ${toolName} ${versionSpec} ${arch}`);
            toolPath = cachePath;
        } else $b22270d42506803e$var$core.debug('not found');
    }
    return toolPath;
}
module.exports.find = $b22270d42506803e$var$find;
/**
 * Finds the paths to all versions of a tool that are installed in the local tool cache
 *
 * @param toolName  name of the tool
 * @param arch      optional arch.  defaults to arch of computer
 */ function $b22270d42506803e$var$findAllVersions(toolName, arch) {
    const versions = [];
    arch = arch || $b22270d42506803e$var$os.arch();
    const toolPath = $b22270d42506803e$var$path.join($b22270d42506803e$var$_getCacheDirectory(), toolName);
    if ($b22270d42506803e$var$fs.existsSync(toolPath)) {
        const children = $b22270d42506803e$var$fs.readdirSync(toolPath);
        for (const child of children)if ($b22270d42506803e$var$isExplicitVersion(child)) {
            const fullPath = $b22270d42506803e$var$path.join(toolPath, child, arch || '');
            if ($b22270d42506803e$var$fs.existsSync(fullPath) && $b22270d42506803e$var$fs.existsSync(`${fullPath}.complete`)) versions.push(child);
        }
    }
    return versions;
}
module.exports.findAllVersions = $b22270d42506803e$var$findAllVersions;
function $b22270d42506803e$var$getManifestFromRepo(owner, repo, auth, branch = 'master') {
    return $b22270d42506803e$var$__awaiter(this, void 0, void 0, function*() {
        let releases = [];
        const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}`;
        const http = new $b22270d42506803e$var$httpm.HttpClient('tool-cache');
        const headers = {
        };
        if (auth) {
            $b22270d42506803e$var$core.debug('set auth');
            headers.authorization = auth;
        }
        const response = yield http.getJson(treeUrl, headers);
        if (!response.result) return releases;
        let manifestUrl = '';
        for (const item of response.result.tree)if (item.path === 'versions-manifest.json') {
            manifestUrl = item.url;
            break;
        }
        headers['accept'] = 'application/vnd.github.VERSION.raw';
        let versionsRaw = yield (yield http.get(manifestUrl, headers)).readBody();
        if (versionsRaw) {
            // shouldn't be needed but protects against invalid json saved with BOM
            versionsRaw = versionsRaw.replace(/^\uFEFF/, '');
            try {
                releases = JSON.parse(versionsRaw);
            } catch (_a) {
                $b22270d42506803e$var$core.debug('Invalid json');
            }
        }
        return releases;
    });
}
module.exports.getManifestFromRepo = $b22270d42506803e$var$getManifestFromRepo;
function $b22270d42506803e$var$findFromManifest(versionSpec, stable, manifest, archFilter = $b22270d42506803e$var$os.arch()) {
    return $b22270d42506803e$var$__awaiter(this, void 0, void 0, function*() {
        // wrap the internal impl
        const match = yield $b22270d42506803e$var$mm._findMatch(versionSpec, stable, manifest, archFilter);
        return match;
    });
}
module.exports.findFromManifest = $b22270d42506803e$var$findFromManifest;
function $b22270d42506803e$var$_createExtractFolder(dest) {
    return $b22270d42506803e$var$__awaiter(this, void 0, void 0, function*() {
        if (!dest) // create a temp dir
        dest = $b22270d42506803e$var$path.join($b22270d42506803e$var$_getTempDirectory(), $b22270d42506803e$var$v4_1.default());
        yield $b22270d42506803e$var$io.mkdirP(dest);
        return dest;
    });
}
function $b22270d42506803e$var$_createToolPath(tool, version, arch) {
    return $b22270d42506803e$var$__awaiter(this, void 0, void 0, function*() {
        const folderPath = $b22270d42506803e$var$path.join($b22270d42506803e$var$_getCacheDirectory(), tool, $b22270d42506803e$var$semver.clean(version) || version, arch || '');
        $b22270d42506803e$var$core.debug(`destination ${folderPath}`);
        const markerPath = `${folderPath}.complete`;
        yield $b22270d42506803e$var$io.rmRF(folderPath);
        yield $b22270d42506803e$var$io.rmRF(markerPath);
        yield $b22270d42506803e$var$io.mkdirP(folderPath);
        return folderPath;
    });
}
function $b22270d42506803e$var$_completeToolPath(tool, version, arch) {
    const folderPath = $b22270d42506803e$var$path.join($b22270d42506803e$var$_getCacheDirectory(), tool, $b22270d42506803e$var$semver.clean(version) || version, arch || '');
    const markerPath = `${folderPath}.complete`;
    $b22270d42506803e$var$fs.writeFileSync(markerPath, '');
    $b22270d42506803e$var$core.debug('finished caching tool');
}
/**
 * Check if version string is explicit
 *
 * @param versionSpec      version string to check
 */ function $b22270d42506803e$var$isExplicitVersion(versionSpec) {
    const c = $b22270d42506803e$var$semver.clean(versionSpec) || '';
    $b22270d42506803e$var$core.debug(`isExplicit: ${c}`);
    const valid = $b22270d42506803e$var$semver.valid(c) != null;
    $b22270d42506803e$var$core.debug(`explicit? ${valid}`);
    return valid;
}
module.exports.isExplicitVersion = $b22270d42506803e$var$isExplicitVersion;
/**
 * Get the highest satisfiying semantic version in `versions` which satisfies `versionSpec`
 *
 * @param versions        array of versions to evaluate
 * @param versionSpec     semantic version spec to satisfy
 */ function $b22270d42506803e$var$evaluateVersions(versions, versionSpec) {
    let version = '';
    $b22270d42506803e$var$core.debug(`evaluating ${versions.length} versions`);
    versions = versions.sort((a, b)=>{
        if ($b22270d42506803e$var$semver.gt(a, b)) return 1;
        return -1;
    });
    for(let i = versions.length - 1; i >= 0; i--){
        const potential = versions[i];
        const satisfied = $b22270d42506803e$var$semver.satisfies(potential, versionSpec);
        if (satisfied) {
            version = potential;
            break;
        }
    }
    if (version) $b22270d42506803e$var$core.debug(`matched: ${version}`);
    else $b22270d42506803e$var$core.debug('match not found');
    return version;
}
module.exports.evaluateVersions = $b22270d42506803e$var$evaluateVersions;
/**
 * Gets RUNNER_TOOL_CACHE
 */ function $b22270d42506803e$var$_getCacheDirectory() {
    const cacheDirectory = process.env['RUNNER_TOOL_CACHE'] || '';
    $bwvhf$assert.ok(cacheDirectory, 'Expected RUNNER_TOOL_CACHE to be defined');
    return cacheDirectory;
}
/**
 * Gets RUNNER_TEMP
 */ function $b22270d42506803e$var$_getTempDirectory() {
    const tempDirectory = process.env['RUNNER_TEMP'] || '';
    $bwvhf$assert.ok(tempDirectory, 'Expected RUNNER_TEMP to be defined');
    return tempDirectory;
}
/**
 * Gets a global variable
 */ function $b22270d42506803e$var$_getGlobal(key, defaultValue) {
    /* eslint-disable @typescript-eslint/no-explicit-any */ const value = $parcel$global[key];
    /* eslint-enable @typescript-eslint/no-explicit-any */ return value !== undefined ? value : defaultValue;
}
/**
 * Returns an array of unique values.
 * @param values Values to make unique.
 */ function $b22270d42506803e$var$_unique(values) {
    return Array.from(new Set(values));
}

});
parcelRequire.register("1WahJ", function(module, exports) {
"use strict";
var $16932f9be52b0ea5$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $16932f9be52b0ea5$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $822QG = parcelRequire("822QG");

var $2EbZf = parcelRequire("2EbZf");

var $a4VIe = parcelRequire("a4VIe");

const $16932f9be52b0ea5$var$os = $16932f9be52b0ea5$var$__importStar($bwvhf$os);

const $16932f9be52b0ea5$var$path = $16932f9be52b0ea5$var$__importStar($bwvhf$path);
/**
 * The code to exit an action
 */ var $16932f9be52b0ea5$var$ExitCode;
(function(ExitCode) {
    /**
     * A code indicating that the action was successful
     */ ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */ ExitCode[ExitCode["Failure"] = 1] = "Failure";
})($16932f9be52b0ea5$var$ExitCode = module.exports.ExitCode || (module.exports.ExitCode = {
}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function $16932f9be52b0ea5$var$exportVariable(name, val) {
    const convertedVal = $a4VIe.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${$16932f9be52b0ea5$var$os.EOL}${convertedVal}${$16932f9be52b0ea5$var$os.EOL}${delimiter}`;
        $2EbZf.issueCommand('ENV', commandValue);
    } else $822QG.issueCommand('set-env', {
        name: name
    }, convertedVal);
}
module.exports.exportVariable = $16932f9be52b0ea5$var$exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */ function $16932f9be52b0ea5$var$setSecret(secret) {
    $822QG.issueCommand('add-mask', {
    }, secret);
}
module.exports.setSecret = $16932f9be52b0ea5$var$setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */ function $16932f9be52b0ea5$var$addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) $2EbZf.issueCommand('PATH', inputPath);
    else $822QG.issueCommand('add-path', {
    }, inputPath);
    process.env['PATH'] = `${inputPath}${$16932f9be52b0ea5$var$path.delimiter}${process.env['PATH']}`;
}
module.exports.addPath = $16932f9be52b0ea5$var$addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */ function $16932f9be52b0ea5$var$getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) throw new Error(`Input required and not supplied: ${name}`);
    return val.trim();
}
module.exports.getInput = $16932f9be52b0ea5$var$getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function $16932f9be52b0ea5$var$setOutput(name, value) {
    process.stdout.write($16932f9be52b0ea5$var$os.EOL);
    $822QG.issueCommand('set-output', {
        name: name
    }, value);
}
module.exports.setOutput = $16932f9be52b0ea5$var$setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */ function $16932f9be52b0ea5$var$setCommandEcho(enabled) {
    $822QG.issue('echo', enabled ? 'on' : 'off');
}
module.exports.setCommandEcho = $16932f9be52b0ea5$var$setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */ function $16932f9be52b0ea5$var$setFailed(message) {
    process.exitCode = $16932f9be52b0ea5$var$ExitCode.Failure;
    $16932f9be52b0ea5$var$error(message);
}
module.exports.setFailed = $16932f9be52b0ea5$var$setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */ function $16932f9be52b0ea5$var$isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
module.exports.isDebug = $16932f9be52b0ea5$var$isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */ function $16932f9be52b0ea5$var$debug(message) {
    $822QG.issueCommand('debug', {
    }, message);
}
module.exports.debug = $16932f9be52b0ea5$var$debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */ function $16932f9be52b0ea5$var$error(message) {
    $822QG.issue('error', message instanceof Error ? message.toString() : message);
}
module.exports.error = $16932f9be52b0ea5$var$error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */ function $16932f9be52b0ea5$var$warning(message) {
    $822QG.issue('warning', message instanceof Error ? message.toString() : message);
}
module.exports.warning = $16932f9be52b0ea5$var$warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */ function $16932f9be52b0ea5$var$info(message) {
    process.stdout.write(message + $16932f9be52b0ea5$var$os.EOL);
}
module.exports.info = $16932f9be52b0ea5$var$info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */ function $16932f9be52b0ea5$var$startGroup(name) {
    $822QG.issue('group', name);
}
module.exports.startGroup = $16932f9be52b0ea5$var$startGroup;
/**
 * End an output group.
 */ function $16932f9be52b0ea5$var$endGroup() {
    $822QG.issue('endgroup');
}
module.exports.endGroup = $16932f9be52b0ea5$var$endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */ function $16932f9be52b0ea5$var$group(name, fn) {
    return $16932f9be52b0ea5$var$__awaiter(this, void 0, void 0, function*() {
        $16932f9be52b0ea5$var$startGroup(name);
        let result;
        try {
            result = yield fn();
        } finally{
            $16932f9be52b0ea5$var$endGroup();
        }
        return result;
    });
}
module.exports.group = $16932f9be52b0ea5$var$group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function $16932f9be52b0ea5$var$saveState(name, value) {
    $822QG.issueCommand('save-state', {
        name: name
    }, value);
}
module.exports.saveState = $16932f9be52b0ea5$var$saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */ function $16932f9be52b0ea5$var$getState(name) {
    return process.env[`STATE_${name}`] || '';
}
module.exports.getState = $16932f9be52b0ea5$var$getState;

});
parcelRequire.register("822QG", function(module, exports) {
"use strict";
var $5d90b8566b0d8249$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

const $5d90b8566b0d8249$var$os = $5d90b8566b0d8249$var$__importStar($bwvhf$os);

var $a4VIe = parcelRequire("a4VIe");
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */ function $5d90b8566b0d8249$var$issueCommand(command, properties, message) {
    const cmd = new $5d90b8566b0d8249$var$Command(command, properties, message);
    process.stdout.write(cmd.toString() + $5d90b8566b0d8249$var$os.EOL);
}
module.exports.issueCommand = $5d90b8566b0d8249$var$issueCommand;
function $5d90b8566b0d8249$var$issue(name, message = '') {
    $5d90b8566b0d8249$var$issueCommand(name, {
    }, message);
}
module.exports.issue = $5d90b8566b0d8249$var$issue;
const $5d90b8566b0d8249$var$CMD_STRING = '::';
class $5d90b8566b0d8249$var$Command {
    constructor(command, properties, message){
        if (!command) command = 'missing.command';
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = $5d90b8566b0d8249$var$CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for(const key in this.properties)if (this.properties.hasOwnProperty(key)) {
                const val = this.properties[key];
                if (val) {
                    if (first) first = false;
                    else cmdStr += ',';
                    cmdStr += `${key}=${$5d90b8566b0d8249$var$escapeProperty(val)}`;
                }
            }
        }
        cmdStr += `${$5d90b8566b0d8249$var$CMD_STRING}${$5d90b8566b0d8249$var$escapeData(this.message)}`;
        return cmdStr;
    }
}
function $5d90b8566b0d8249$var$escapeData(s) {
    return $a4VIe.toCommandValue(s).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}
function $5d90b8566b0d8249$var$escapeProperty(s) {
    return $a4VIe.toCommandValue(s).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A').replace(/:/g, '%3A').replace(/,/g, '%2C');
}

});
parcelRequire.register("a4VIe", function(module, exports) {
"use strict";
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */ Object.defineProperty(module.exports, "__esModule", {
    value: true
});
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */ function $75670b93279d614b$var$toCommandValue(input) {
    if (input === null || input === undefined) return '';
    else if (typeof input === 'string' || input instanceof String) return input;
    return JSON.stringify(input);
}
module.exports.toCommandValue = $75670b93279d614b$var$toCommandValue;

});


parcelRequire.register("2EbZf", function(module, exports) {
"use strict";
// For internal use, subject to change.
var $1ed89d86a36601af$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */ const $1ed89d86a36601af$var$fs = $1ed89d86a36601af$var$__importStar($bwvhf$fs);

const $1ed89d86a36601af$var$os = $1ed89d86a36601af$var$__importStar($bwvhf$os);

var $a4VIe = parcelRequire("a4VIe");
function $1ed89d86a36601af$var$issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) throw new Error(`Unable to find environment variable for file command ${command}`);
    if (!$1ed89d86a36601af$var$fs.existsSync(filePath)) throw new Error(`Missing file at path: ${filePath}`);
    $1ed89d86a36601af$var$fs.appendFileSync(filePath, `${$a4VIe.toCommandValue(message)}${$1ed89d86a36601af$var$os.EOL}`, {
        encoding: 'utf8'
    });
}
module.exports.issueCommand = $1ed89d86a36601af$var$issueCommand;

});


parcelRequire.register("9ZxT3", function(module, exports) {
"use strict";
var $746418d0316728e7$var$__createBinding = module.exports && module.exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var $746418d0316728e7$var$__setModuleDefault = module.exports && module.exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var $746418d0316728e7$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.hasOwnProperty.call(mod, k)) $746418d0316728e7$var$__createBinding(result, mod, k);
    }
    $746418d0316728e7$var$__setModuleDefault(result, mod);
    return result;
};
var $746418d0316728e7$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports._readLinuxVersionFile = module.exports._getOsVersion = module.exports._findMatch = void 0;

const $746418d0316728e7$var$semver = $746418d0316728e7$var$__importStar((parcelRequire("4ISl9")));

var $1WahJ = parcelRequire("1WahJ");



function $746418d0316728e7$var$_findMatch(versionSpec, stable, candidates, archFilter) {
    return $746418d0316728e7$var$__awaiter(this, void 0, void 0, function*() {
        const platFilter = $bwvhf$os.platform();
        let result;
        let match;
        let file;
        for (const candidate of candidates){
            const version = candidate.version;
            $1WahJ.debug(`check ${version} satisfies ${versionSpec}`);
            if ($746418d0316728e7$var$semver.satisfies(version, versionSpec) && (!stable || candidate.stable === stable)) {
                file = candidate.files.find((item)=>{
                    $1WahJ.debug(`${item.arch}===${archFilter} && ${item.platform}===${platFilter}`);
                    let chk = item.arch === archFilter && item.platform === platFilter;
                    if (chk && item.platform_version) {
                        const osVersion = module.exports._getOsVersion();
                        if (osVersion === item.platform_version) chk = true;
                        else chk = $746418d0316728e7$var$semver.satisfies(osVersion, item.platform_version);
                    }
                    return chk;
                });
                if (file) {
                    $1WahJ.debug(`matched ${candidate.version}`);
                    match = candidate;
                    break;
                }
            }
        }
        if (match && file) {
            // clone since we're mutating the file list to be only the file that matches
            result = Object.assign({
            }, match);
            result.files = [
                file
            ];
        }
        return result;
    });
}
module.exports._findMatch = $746418d0316728e7$var$_findMatch;
function $746418d0316728e7$var$_getOsVersion() {
    // TODO: add windows and other linux, arm variants
    // right now filtering on version is only an ubuntu and macos scenario for tools we build for hosted (python)
    const plat = $bwvhf$os.platform();
    let version = '';
    if (plat === 'darwin') version = $bwvhf$child_process.execSync('sw_vers -productVersion').toString();
    else if (plat === 'linux') {
        // lsb_release process not in some containers, readfile
        // Run cat /etc/lsb-release
        // DISTRIB_ID=Ubuntu
        // DISTRIB_RELEASE=18.04
        // DISTRIB_CODENAME=bionic
        // DISTRIB_DESCRIPTION="Ubuntu 18.04.4 LTS"
        const lsbContents = module.exports._readLinuxVersionFile();
        if (lsbContents) {
            const lines = lsbContents.split('\n');
            for (const line of lines){
                const parts = line.split('=');
                if (parts.length === 2 && (parts[0].trim() === 'VERSION_ID' || parts[0].trim() === 'DISTRIB_RELEASE')) {
                    version = parts[1].trim().replace(/^"/, '').replace(/"$/, '');
                    break;
                }
            }
        }
    }
    return version;
}
module.exports._getOsVersion = $746418d0316728e7$var$_getOsVersion;
function $746418d0316728e7$var$_readLinuxVersionFile() {
    const lsbReleaseFile = '/etc/lsb-release';
    const osReleaseFile = '/etc/os-release';
    let contents = '';
    if ($bwvhf$fs.existsSync(lsbReleaseFile)) contents = $bwvhf$fs.readFileSync(lsbReleaseFile).toString();
    else if ($bwvhf$fs.existsSync(osReleaseFile)) contents = $bwvhf$fs.readFileSync(osReleaseFile).toString();
    return contents;
}
module.exports._readLinuxVersionFile = $746418d0316728e7$var$_readLinuxVersionFile;

});
parcelRequire.register("4ISl9", function(module, exports) {
exports = module.exports = SemVer;
var debug;
/* istanbul ignore next */ if (typeof process === 'object' && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG)) debug = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift('SEMVER');
    console.log.apply(console, args);
};
else debug = function() {
};
// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0';
var MAX_LENGTH = 256;
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */ 9007199254740991;
// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16;
// The actual regexps go on exports.re
var re = exports.re = [];
var src = exports.src = [];
var t = exports.tokens = {
};
var R = 0;
function tok(n) {
    t[n] = R++;
}
// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.
// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.
tok('NUMERICIDENTIFIER');
src[t.NUMERICIDENTIFIER] = '0|[1-9]\\d*';
tok('NUMERICIDENTIFIERLOOSE');
src[t.NUMERICIDENTIFIERLOOSE] = '[0-9]+';
// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.
tok('NONNUMERICIDENTIFIER');
src[t.NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';
// ## Main Version
// Three dot-separated numeric identifiers.
tok('MAINVERSION');
src[t.MAINVERSION] = '(' + src[t.NUMERICIDENTIFIER] + ')\\.' + '(' + src[t.NUMERICIDENTIFIER] + ')\\.' + '(' + src[t.NUMERICIDENTIFIER] + ')';
tok('MAINVERSIONLOOSE');
src[t.MAINVERSIONLOOSE] = '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' + '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' + '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')';
// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.
tok('PRERELEASEIDENTIFIER');
src[t.PRERELEASEIDENTIFIER] = '(?:' + src[t.NUMERICIDENTIFIER] + '|' + src[t.NONNUMERICIDENTIFIER] + ')';
tok('PRERELEASEIDENTIFIERLOOSE');
src[t.PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[t.NUMERICIDENTIFIERLOOSE] + '|' + src[t.NONNUMERICIDENTIFIER] + ')';
// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.
tok('PRERELEASE');
src[t.PRERELEASE] = '(?:-(' + src[t.PRERELEASEIDENTIFIER] + '(?:\\.' + src[t.PRERELEASEIDENTIFIER] + ')*))';
tok('PRERELEASELOOSE');
src[t.PRERELEASELOOSE] = '(?:-?(' + src[t.PRERELEASEIDENTIFIERLOOSE] + '(?:\\.' + src[t.PRERELEASEIDENTIFIERLOOSE] + ')*))';
// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.
tok('BUILDIDENTIFIER');
src[t.BUILDIDENTIFIER] = '[0-9A-Za-z-]+';
// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.
tok('BUILD');
src[t.BUILD] = '(?:\\+(' + src[t.BUILDIDENTIFIER] + '(?:\\.' + src[t.BUILDIDENTIFIER] + ')*))';
// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.
// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.
tok('FULL');
tok('FULLPLAIN');
src[t.FULLPLAIN] = 'v?' + src[t.MAINVERSION] + src[t.PRERELEASE] + '?' + src[t.BUILD] + '?';
src[t.FULL] = '^' + src[t.FULLPLAIN] + '$';
// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
tok('LOOSEPLAIN');
src[t.LOOSEPLAIN] = '[v=\\s]*' + src[t.MAINVERSIONLOOSE] + src[t.PRERELEASELOOSE] + '?' + src[t.BUILD] + '?';
tok('LOOSE');
src[t.LOOSE] = '^' + src[t.LOOSEPLAIN] + '$';
tok('GTLT');
src[t.GTLT] = '((?:<|>)?=?)';
// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
tok('XRANGEIDENTIFIERLOOSE');
src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
tok('XRANGEIDENTIFIER');
src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + '|x|X|\\*';
tok('XRANGEPLAIN');
src[t.XRANGEPLAIN] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIER] + ')' + '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' + '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' + '(?:' + src[t.PRERELEASE] + ')?' + src[t.BUILD] + '?' + ')?)?';
tok('XRANGEPLAINLOOSE');
src[t.XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' + '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' + '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' + '(?:' + src[t.PRERELEASELOOSE] + ')?' + src[t.BUILD] + '?' + ')?)?';
tok('XRANGE');
src[t.XRANGE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAIN] + '$';
tok('XRANGELOOSE');
src[t.XRANGELOOSE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAINLOOSE] + '$';
// Coercion.
// Extract anything that could conceivably be a part of a valid semver
tok('COERCE');
src[t.COERCE] = "(^|[^\\d])(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + '})' + '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' + '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' + '(?:$|[^\\d])';
tok('COERCERTL');
re[t.COERCERTL] = new RegExp(src[t.COERCE], 'g');
// Tilde ranges.
// Meaning is "reasonably at or greater than"
tok('LONETILDE');
src[t.LONETILDE] = '(?:~>?)';
tok('TILDETRIM');
src[t.TILDETRIM] = '(\\s*)' + src[t.LONETILDE] + '\\s+';
re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], 'g');
var tildeTrimReplace = '$1~';
tok('TILDE');
src[t.TILDE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAIN] + '$';
tok('TILDELOOSE');
src[t.TILDELOOSE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + '$';
// Caret ranges.
// Meaning is "at least and backwards compatible with"
tok('LONECARET');
src[t.LONECARET] = '(?:\\^)';
tok('CARETTRIM');
src[t.CARETTRIM] = '(\\s*)' + src[t.LONECARET] + '\\s+';
re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], 'g');
var caretTrimReplace = '$1^';
tok('CARET');
src[t.CARET] = '^' + src[t.LONECARET] + src[t.XRANGEPLAIN] + '$';
tok('CARETLOOSE');
src[t.CARETLOOSE] = '^' + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + '$';
// A simple gt/lt/eq thing, or just "" to indicate "any version"
tok('COMPARATORLOOSE');
src[t.COMPARATORLOOSE] = '^' + src[t.GTLT] + '\\s*(' + src[t.LOOSEPLAIN] + ')$|^$';
tok('COMPARATOR');
src[t.COMPARATOR] = '^' + src[t.GTLT] + '\\s*(' + src[t.FULLPLAIN] + ')$|^$';
// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
tok('COMPARATORTRIM');
src[t.COMPARATORTRIM] = '(\\s*)' + src[t.GTLT] + '\\s*(' + src[t.LOOSEPLAIN] + '|' + src[t.XRANGEPLAIN] + ')';
// this one has to use the /g flag
re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], 'g');
var comparatorTrimReplace = '$1$2$3';
// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
tok('HYPHENRANGE');
src[t.HYPHENRANGE] = '^\\s*(' + src[t.XRANGEPLAIN] + ')' + '\\s+-\\s+' + '(' + src[t.XRANGEPLAIN] + ')' + '\\s*$';
tok('HYPHENRANGELOOSE');
src[t.HYPHENRANGELOOSE] = '^\\s*(' + src[t.XRANGEPLAINLOOSE] + ')' + '\\s+-\\s+' + '(' + src[t.XRANGEPLAINLOOSE] + ')' + '\\s*$';
// Star ranges basically just allow anything at all.
tok('STAR');
src[t.STAR] = '(<|>)?=?\\s*\\*';
// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for(var i = 0; i < R; i++){
    debug(i, src[i]);
    if (!re[i]) re[i] = new RegExp(src[i]);
}
exports.parse = parse;
function parse(version, options) {
    if (!options || typeof options !== 'object') options = {
        loose: !!options,
        includePrerelease: false
    };
    if (version instanceof SemVer) return version;
    if (typeof version !== 'string') return null;
    if (version.length > MAX_LENGTH) return null;
    var r = options.loose ? re[t.LOOSE] : re[t.FULL];
    if (!r.test(version)) return null;
    try {
        return new SemVer(version, options);
    } catch (er) {
        return null;
    }
}
exports.valid = valid;
function valid(version, options) {
    var v = parse(version, options);
    return v ? v.version : null;
}
exports.clean = clean;
function clean(version, options) {
    var s = parse(version.trim().replace(/^[=v]+/, ''), options);
    return s ? s.version : null;
}
exports.SemVer = SemVer;
function SemVer(version, options) {
    if (!options || typeof options !== 'object') options = {
        loose: !!options,
        includePrerelease: false
    };
    if (version instanceof SemVer) {
        if (version.loose === options.loose) return version;
        else version = version.version;
    } else if (typeof version !== 'string') throw new TypeError('Invalid Version: ' + version);
    if (version.length > MAX_LENGTH) throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters');
    if (!(this instanceof SemVer)) return new SemVer(version, options);
    debug('SemVer', version, options);
    this.options = options;
    this.loose = !!options.loose;
    var m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
    if (!m) throw new TypeError('Invalid Version: ' + version);
    this.raw = version;
    // these are actually numbers
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];
    if (this.major > MAX_SAFE_INTEGER || this.major < 0) throw new TypeError('Invalid major version');
    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) throw new TypeError('Invalid minor version');
    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) throw new TypeError('Invalid patch version');
    // numberify any prerelease numeric ids
    if (!m[4]) this.prerelease = [];
    else this.prerelease = m[4].split('.').map(function(id) {
        if (/^[0-9]+$/.test(id)) {
            var num = +id;
            if (num >= 0 && num < MAX_SAFE_INTEGER) return num;
        }
        return id;
    });
    this.build = m[5] ? m[5].split('.') : [];
    this.format();
}
SemVer.prototype.format = function() {
    this.version = this.major + '.' + this.minor + '.' + this.patch;
    if (this.prerelease.length) this.version += '-' + this.prerelease.join('.');
    return this.version;
};
SemVer.prototype.toString = function() {
    return this.version;
};
SemVer.prototype.compare = function(other) {
    debug('SemVer.compare', this.version, this.options, other);
    if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
    return this.compareMain(other) || this.comparePre(other);
};
SemVer.prototype.compareMain = function(other) {
    if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
    return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
};
SemVer.prototype.comparePre = function(other) {
    if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) return -1;
    else if (!this.prerelease.length && other.prerelease.length) return 1;
    else if (!this.prerelease.length && !other.prerelease.length) return 0;
    var i = 0;
    do {
        var a = this.prerelease[i];
        var b = other.prerelease[i];
        debug('prerelease compare', i, a, b);
        if (a === undefined && b === undefined) return 0;
        else if (b === undefined) return 1;
        else if (a === undefined) return -1;
        else if (a === b) continue;
        else return compareIdentifiers(a, b);
    }while (++i)
};
SemVer.prototype.compareBuild = function(other) {
    if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
    var i = 0;
    do {
        var a = this.build[i];
        var b = other.build[i];
        debug('prerelease compare', i, a, b);
        if (a === undefined && b === undefined) return 0;
        else if (b === undefined) return 1;
        else if (a === undefined) return -1;
        else if (a === b) continue;
        else return compareIdentifiers(a, b);
    }while (++i)
};
// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function(release, identifier) {
    switch(release){
        case 'premajor':
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc('pre', identifier);
            break;
        case 'preminor':
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc('pre', identifier);
            break;
        case 'prepatch':
            // If this is already a prerelease, it will bump to the next version
            // drop any prereleases that might already exist, since they are not
            // relevant at this point.
            this.prerelease.length = 0;
            this.inc('patch', identifier);
            this.inc('pre', identifier);
            break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case 'prerelease':
            if (this.prerelease.length === 0) this.inc('patch', identifier);
            this.inc('pre', identifier);
            break;
        case 'major':
            // If this is a pre-major version, bump up to the same major version.
            // Otherwise increment major.
            // 1.0.0-5 bumps to 1.0.0
            // 1.1.0 bumps to 2.0.0
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
        case 'minor':
            // If this is a pre-minor version, bump up to the same minor version.
            // Otherwise increment minor.
            // 1.2.0-5 bumps to 1.2.0
            // 1.2.1 bumps to 1.3.0
            if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
            this.patch = 0;
            this.prerelease = [];
            break;
        case 'patch':
            // If this is not a pre-release version, it will increment the patch.
            // If it is a pre-release it will bump up to the same patch version.
            // 1.2.0-5 patches to 1.2.0
            // 1.2.0 patches to 1.2.1
            if (this.prerelease.length === 0) this.patch++;
            this.prerelease = [];
            break;
        // This probably shouldn't be used publicly.
        // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
        case 'pre':
            if (this.prerelease.length === 0) this.prerelease = [
                0
            ];
            else {
                var i = this.prerelease.length;
                while(--i >= 0)if (typeof this.prerelease[i] === 'number') {
                    this.prerelease[i]++;
                    i = -2;
                }
                if (i === -1) // didn't increment anything
                this.prerelease.push(0);
            }
            if (identifier) {
                // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
                // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
                if (this.prerelease[0] === identifier) {
                    if (isNaN(this.prerelease[1])) this.prerelease = [
                        identifier,
                        0
                    ];
                } else this.prerelease = [
                    identifier,
                    0
                ];
            }
            break;
        default:
            throw new Error('invalid increment argument: ' + release);
    }
    this.format();
    this.raw = this.version;
    return this;
};
exports.inc = inc;
function inc(version, release, loose, identifier) {
    if (typeof loose === 'string') {
        identifier = loose;
        loose = undefined;
    }
    try {
        return new SemVer(version, loose).inc(release, identifier).version;
    } catch (er) {
        return null;
    }
}
exports.diff = diff;
function diff(version1, version2) {
    if (eq(version1, version2)) return null;
    else {
        var v1 = parse(version1);
        var v2 = parse(version2);
        var prefix = '';
        if (v1.prerelease.length || v2.prerelease.length) {
            prefix = 'pre';
            var defaultResult = 'prerelease';
        }
        for(var key in v1)if (key === 'major' || key === 'minor' || key === 'patch') {
            if (v1[key] !== v2[key]) return prefix + key;
        }
        return defaultResult // may be undefined
        ;
    }
}
exports.compareIdentifiers = compareIdentifiers;
var numeric = /^[0-9]+$/;
function compareIdentifiers(a, b) {
    var anum = numeric.test(a);
    var bnum = numeric.test(b);
    if (anum && bnum) {
        a = +a;
        b = +b;
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
}
exports.rcompareIdentifiers = rcompareIdentifiers;
function rcompareIdentifiers(a, b) {
    return compareIdentifiers(b, a);
}
exports.major = major;
function major(a, loose) {
    return new SemVer(a, loose).major;
}
exports.minor = minor;
function minor(a, loose) {
    return new SemVer(a, loose).minor;
}
exports.patch = patch;
function patch(a, loose) {
    return new SemVer(a, loose).patch;
}
exports.compare = compare;
function compare(a, b, loose) {
    return new SemVer(a, loose).compare(new SemVer(b, loose));
}
exports.compareLoose = compareLoose;
function compareLoose(a, b) {
    return compare(a, b, true);
}
exports.compareBuild = compareBuild;
function compareBuild(a, b, loose) {
    var versionA = new SemVer(a, loose);
    var versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
}
exports.rcompare = rcompare;
function rcompare(a, b, loose) {
    return compare(b, a, loose);
}
exports.sort = sort;
function sort(list, loose) {
    return list.sort(function(a, b) {
        return exports.compareBuild(a, b, loose);
    });
}
exports.rsort = rsort;
function rsort(list, loose) {
    return list.sort(function(a, b) {
        return exports.compareBuild(b, a, loose);
    });
}
exports.gt = gt;
function gt(a, b, loose) {
    return compare(a, b, loose) > 0;
}
exports.lt = lt;
function lt(a, b, loose) {
    return compare(a, b, loose) < 0;
}
exports.eq = eq;
function eq(a, b, loose) {
    return compare(a, b, loose) === 0;
}
exports.neq = neq;
function neq(a, b, loose) {
    return compare(a, b, loose) !== 0;
}
exports.gte = gte;
function gte(a, b, loose) {
    return compare(a, b, loose) >= 0;
}
exports.lte = lte;
function lte(a, b, loose) {
    return compare(a, b, loose) <= 0;
}
exports.cmp = cmp;
function cmp(a, op, b, loose) {
    switch(op){
        case '===':
            if (typeof a === 'object') a = a.version;
            if (typeof b === 'object') b = b.version;
            return a === b;
        case '!==':
            if (typeof a === 'object') a = a.version;
            if (typeof b === 'object') b = b.version;
            return a !== b;
        case '':
        case '=':
        case '==':
            return eq(a, b, loose);
        case '!=':
            return neq(a, b, loose);
        case '>':
            return gt(a, b, loose);
        case '>=':
            return gte(a, b, loose);
        case '<':
            return lt(a, b, loose);
        case '<=':
            return lte(a, b, loose);
        default:
            throw new TypeError('Invalid operator: ' + op);
    }
}
exports.Comparator = Comparator;
function Comparator(comp, options) {
    if (!options || typeof options !== 'object') options = {
        loose: !!options,
        includePrerelease: false
    };
    if (comp instanceof Comparator) {
        if (comp.loose === !!options.loose) return comp;
        else comp = comp.value;
    }
    if (!(this instanceof Comparator)) return new Comparator(comp, options);
    debug('comparator', comp, options);
    this.options = options;
    this.loose = !!options.loose;
    this.parse(comp);
    if (this.semver === ANY) this.value = '';
    else this.value = this.operator + this.semver.version;
    debug('comp', this);
}
var ANY = {
};
Comparator.prototype.parse = function(comp) {
    var r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
    var m = comp.match(r);
    if (!m) throw new TypeError('Invalid comparator: ' + comp);
    this.operator = m[1] !== undefined ? m[1] : '';
    if (this.operator === '=') this.operator = '';
    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) this.semver = ANY;
    else this.semver = new SemVer(m[2], this.options.loose);
};
Comparator.prototype.toString = function() {
    return this.value;
};
Comparator.prototype.test = function(version) {
    debug('Comparator.test', version, this.options.loose);
    if (this.semver === ANY || version === ANY) return true;
    if (typeof version === 'string') try {
        version = new SemVer(version, this.options);
    } catch (er) {
        return false;
    }
    return cmp(version, this.operator, this.semver, this.options);
};
Comparator.prototype.intersects = function(comp, options) {
    if (!(comp instanceof Comparator)) throw new TypeError('a Comparator is required');
    if (!options || typeof options !== 'object') options = {
        loose: !!options,
        includePrerelease: false
    };
    var rangeTmp;
    if (this.operator === '') {
        if (this.value === '') return true;
        rangeTmp = new Range(comp.value, options);
        return satisfies(this.value, rangeTmp, options);
    } else if (comp.operator === '') {
        if (comp.value === '') return true;
        rangeTmp = new Range(this.value, options);
        return satisfies(comp.semver, rangeTmp, options);
    }
    var sameDirectionIncreasing = (this.operator === '>=' || this.operator === '>') && (comp.operator === '>=' || comp.operator === '>');
    var sameDirectionDecreasing = (this.operator === '<=' || this.operator === '<') && (comp.operator === '<=' || comp.operator === '<');
    var sameSemVer = this.semver.version === comp.semver.version;
    var differentDirectionsInclusive = (this.operator === '>=' || this.operator === '<=') && (comp.operator === '>=' || comp.operator === '<=');
    var oppositeDirectionsLessThan = cmp(this.semver, '<', comp.semver, options) && (this.operator === '>=' || this.operator === '>') && (comp.operator === '<=' || comp.operator === '<');
    var oppositeDirectionsGreaterThan = cmp(this.semver, '>', comp.semver, options) && (this.operator === '<=' || this.operator === '<') && (comp.operator === '>=' || comp.operator === '>');
    return sameDirectionIncreasing || sameDirectionDecreasing || sameSemVer && differentDirectionsInclusive || oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
};
exports.Range = Range;
function Range(range, options) {
    if (!options || typeof options !== 'object') options = {
        loose: !!options,
        includePrerelease: false
    };
    if (range instanceof Range) {
        if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) return range;
        else return new Range(range.raw, options);
    }
    if (range instanceof Comparator) return new Range(range.value, options);
    if (!(this instanceof Range)) return new Range(range, options);
    this.options = options;
    this.loose = !!options.loose;
    this.includePrerelease = !!options.includePrerelease;
    // First, split based on boolean or ||
    this.raw = range;
    this.set = range.split(/\s*\|\|\s*/).map(function(range) {
        return this.parseRange(range.trim());
    }, this).filter(function(c) {
        // throw out any that are not relevant for whatever reason
        return c.length;
    });
    if (!this.set.length) throw new TypeError('Invalid SemVer Range: ' + range);
    this.format();
}
Range.prototype.format = function() {
    this.range = this.set.map(function(comps) {
        return comps.join(' ').trim();
    }).join('||').trim();
    return this.range;
};
Range.prototype.toString = function() {
    return this.range;
};
Range.prototype.parseRange = function(range) {
    var loose = this.options.loose;
    range = range.trim();
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    var hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
    range = range.replace(hr, hyphenReplace);
    debug('hyphen replace', range);
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
    debug('comparator trim', range, re[t.COMPARATORTRIM]);
    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace);
    // normalize spaces
    range = range.split(/\s+/).join(' ');
    // At this point, the range is completely trimmed and
    // ready to be split into comparators.
    var compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
    var set = range.split(' ').map(function(comp) {
        return parseComparator(comp, this.options);
    }, this).join(' ').split(/\s+/);
    if (this.options.loose) // in loose mode, throw out any that are not valid comparators
    set = set.filter(function(comp) {
        return !!comp.match(compRe);
    });
    set = set.map(function(comp) {
        return new Comparator(comp, this.options);
    }, this);
    return set;
};
Range.prototype.intersects = function(range, options) {
    if (!(range instanceof Range)) throw new TypeError('a Range is required');
    return this.set.some(function(thisComparators) {
        return isSatisfiable(thisComparators, options) && range.set.some(function(rangeComparators) {
            return isSatisfiable(rangeComparators, options) && thisComparators.every(function(thisComparator) {
                return rangeComparators.every(function(rangeComparator) {
                    return thisComparator.intersects(rangeComparator, options);
                });
            });
        });
    });
};
// take a set of comparators and determine whether there
// exists a version which can satisfy it
function isSatisfiable(comparators, options) {
    var result = true;
    var remainingComparators = comparators.slice();
    var testComparator = remainingComparators.pop();
    while(result && remainingComparators.length){
        result = remainingComparators.every(function(otherComparator) {
            return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
    }
    return result;
}
// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators;
function toComparators(range, options) {
    return new Range(range, options).set.map(function(comp) {
        return comp.map(function(c) {
            return c.value;
        }).join(' ').trim().split(' ');
    });
}
// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator(comp, options) {
    debug('comp', comp, options);
    comp = replaceCarets(comp, options);
    debug('caret', comp);
    comp = replaceTildes(comp, options);
    debug('tildes', comp);
    comp = replaceXRanges(comp, options);
    debug('xrange', comp);
    comp = replaceStars(comp, options);
    debug('stars', comp);
    return comp;
}
function isX(id) {
    return !id || id.toLowerCase() === 'x' || id === '*';
}
// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes(comp, options) {
    return comp.trim().split(/\s+/).map(function(comp) {
        return replaceTilde(comp, options);
    }).join(' ');
}
function replaceTilde(comp, options) {
    var r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
    return comp.replace(r, function(_, M, m, p, pr) {
        debug('tilde', comp, _, M, m, p, pr);
        var ret;
        if (isX(M)) ret = '';
        else if (isX(m)) ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
        else if (isX(p)) // ~1.2 == >=1.2.0 <1.3.0
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
        else if (pr) {
            debug('replaceTilde pr', pr);
            ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + M + '.' + (+m + 1) + '.0';
        } else // ~1.2.3 == >=1.2.3 <1.3.0
        ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + (+m + 1) + '.0';
        debug('tilde return', ret);
        return ret;
    });
}
// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets(comp, options) {
    return comp.trim().split(/\s+/).map(function(comp) {
        return replaceCaret(comp, options);
    }).join(' ');
}
function replaceCaret(comp, options) {
    debug('caret', comp, options);
    var r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
    return comp.replace(r, function(_, M, m, p, pr) {
        debug('caret', comp, _, M, m, p, pr);
        var ret;
        if (isX(M)) ret = '';
        else if (isX(m)) ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
        else if (isX(p)) {
            if (M === '0') ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
            else ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
        } else if (pr) {
            debug('replaceCaret pr', pr);
            if (M === '0') {
                if (m === '0') ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + M + '.' + m + '.' + (+p + 1);
                else ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + M + '.' + (+m + 1) + '.0';
            } else ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + (+M + 1) + '.0.0';
        } else {
            debug('no pr');
            if (M === '0') {
                if (m === '0') ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + m + '.' + (+p + 1);
                else ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + (+m + 1) + '.0';
            } else ret = '>=' + M + '.' + m + '.' + p + ' <' + (+M + 1) + '.0.0';
        }
        debug('caret return', ret);
        return ret;
    });
}
function replaceXRanges(comp, options) {
    debug('replaceXRanges', comp, options);
    return comp.split(/\s+/).map(function(comp) {
        return replaceXRange(comp, options);
    }).join(' ');
}
function replaceXRange(comp, options) {
    comp = comp.trim();
    var r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
    return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
        debug('xRange', comp, ret, gtlt, M, m, p, pr);
        var xM = isX(M);
        var xm = xM || isX(m);
        var xp = xm || isX(p);
        var anyX = xp;
        if (gtlt === '=' && anyX) gtlt = '';
        // if we're including prereleases in the match, then we need
        // to fix this to -0, the lowest possible prerelease value
        pr = options.includePrerelease ? '-0' : '';
        if (xM) {
            if (gtlt === '>' || gtlt === '<') // nothing is allowed
            ret = '<0.0.0-0';
            else // nothing is forbidden
            ret = '*';
        } else if (gtlt && anyX) {
            // we know patch is an x, because we have any x at all.
            // replace X with 0
            if (xm) m = 0;
            p = 0;
            if (gtlt === '>') {
                // >1 => >=2.0.0
                // >1.2 => >=1.3.0
                // >1.2.3 => >= 1.2.4
                gtlt = '>=';
                if (xm) {
                    M = +M + 1;
                    m = 0;
                    p = 0;
                } else {
                    m = +m + 1;
                    p = 0;
                }
            } else if (gtlt === '<=') {
                // <=0.7.x is actually <0.8.0, since any 0.7.x should
                // pass.  Similarly, <=7.x is actually <8.0.0, etc.
                gtlt = '<';
                if (xm) M = +M + 1;
                else m = +m + 1;
            }
            ret = gtlt + M + '.' + m + '.' + p + pr;
        } else if (xm) ret = '>=' + M + '.0.0' + pr + ' <' + (+M + 1) + '.0.0' + pr;
        else if (xp) ret = '>=' + M + '.' + m + '.0' + pr + ' <' + M + '.' + (+m + 1) + '.0' + pr;
        debug('xRange return', ret);
        return ret;
    });
}
// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars(comp, options) {
    debug('replaceStars', comp, options);
    // Looseness is ignored here.  star is always as loose as it gets!
    return comp.trim().replace(re[t.STAR], '');
}
// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) {
    if (isX(fM)) from = '';
    else if (isX(fm)) from = '>=' + fM + '.0.0';
    else if (isX(fp)) from = '>=' + fM + '.' + fm + '.0';
    else from = '>=' + from;
    if (isX(tM)) to = '';
    else if (isX(tm)) to = '<' + (+tM + 1) + '.0.0';
    else if (isX(tp)) to = '<' + tM + '.' + (+tm + 1) + '.0';
    else if (tpr) to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
    else to = '<=' + to;
    return (from + ' ' + to).trim();
}
// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function(version) {
    if (!version) return false;
    if (typeof version === 'string') try {
        version = new SemVer(version, this.options);
    } catch (er) {
        return false;
    }
    for(var i = 0; i < this.set.length; i++){
        if (testSet(this.set[i], version, this.options)) return true;
    }
    return false;
};
function testSet(set, version, options) {
    for(var i = 0; i < set.length; i++){
        if (!set[i].test(version)) return false;
    }
    if (version.prerelease.length && !options.includePrerelease) {
        // Find the set of versions that are allowed to have prereleases
        // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
        // That should allow `1.2.3-pr.2` to pass.
        // However, `1.2.4-alpha.notready` should NOT be allowed,
        // even though it's within the range set by the comparators.
        for(i = 0; i < set.length; i++){
            debug(set[i].semver);
            if (set[i].semver === ANY) continue;
            if (set[i].semver.prerelease.length > 0) {
                var allowed = set[i].semver;
                if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) return true;
            }
        }
        // Version has a -pre, but it's not one of the ones we like.
        return false;
    }
    return true;
}
exports.satisfies = satisfies;
function satisfies(version, range, options) {
    try {
        range = new Range(range, options);
    } catch (er) {
        return false;
    }
    return range.test(version);
}
exports.maxSatisfying = maxSatisfying;
function maxSatisfying(versions, range, options) {
    var max = null;
    var maxSV = null;
    try {
        var rangeObj = new Range(range, options);
    } catch (er) {
        return null;
    }
    versions.forEach(function(v) {
        if (rangeObj.test(v)) // satisfies(v, range, options)
        {
            if (!max || maxSV.compare(v) === -1) {
                // compare(max, v, true)
                max = v;
                maxSV = new SemVer(max, options);
            }
        }
    });
    return max;
}
exports.minSatisfying = minSatisfying;
function minSatisfying(versions, range, options) {
    var min = null;
    var minSV = null;
    try {
        var rangeObj = new Range(range, options);
    } catch (er) {
        return null;
    }
    versions.forEach(function(v) {
        if (rangeObj.test(v)) // satisfies(v, range, options)
        {
            if (!min || minSV.compare(v) === 1) {
                // compare(min, v, true)
                min = v;
                minSV = new SemVer(min, options);
            }
        }
    });
    return min;
}
exports.minVersion = minVersion;
function minVersion(range, loose) {
    range = new Range(range, loose);
    var minver = new SemVer('0.0.0');
    if (range.test(minver)) return minver;
    minver = new SemVer('0.0.0-0');
    if (range.test(minver)) return minver;
    minver = null;
    for(var i = 0; i < range.set.length; ++i){
        var comparators = range.set[i];
        comparators.forEach(function(comparator) {
            // Clone to avoid manipulating the comparator's semver object.
            var compver = new SemVer(comparator.semver.version);
            switch(comparator.operator){
                case '>':
                    if (compver.prerelease.length === 0) compver.patch++;
                    else compver.prerelease.push(0);
                    compver.raw = compver.format();
                /* fallthrough */ case '':
                case '>=':
                    if (!minver || gt(minver, compver)) minver = compver;
                    break;
                case '<':
                case '<=':
                    break;
                /* istanbul ignore next */ default:
                    throw new Error('Unexpected operation: ' + comparator.operator);
            }
        });
    }
    if (minver && range.test(minver)) return minver;
    return null;
}
exports.validRange = validRange;
function validRange(range, options) {
    try {
        // Return '*' instead of '' so that truthiness works.
        // This will throw if it's invalid anyway
        return new Range(range, options).range || '*';
    } catch (er) {
        return null;
    }
}
// Determine if version is less than all the versions possible in the range
exports.ltr = ltr;
function ltr(version, range, options) {
    return outside(version, range, '<', options);
}
// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr;
function gtr(version, range, options) {
    return outside(version, range, '>', options);
}
exports.outside = outside;
function outside(version, range, hilo, options) {
    version = new SemVer(version, options);
    range = new Range(range, options);
    var gtfn, ltefn, ltfn, comp, ecomp;
    switch(hilo){
        case '>':
            gtfn = gt;
            ltefn = lte;
            ltfn = lt;
            comp = '>';
            ecomp = '>=';
            break;
        case '<':
            gtfn = lt;
            ltefn = gte;
            ltfn = gt;
            comp = '<';
            ecomp = '<=';
            break;
        default:
            throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    // If it satisifes the range it is not outside
    if (satisfies(version, range, options)) return false;
    // From now on, variable terms are as if we're in "gtr" mode.
    // but note that everything is flipped for the "ltr" function.
    for(var i = 0; i < range.set.length; ++i){
        var comparators = range.set[i];
        var high = null;
        var low = null;
        comparators.forEach(function(comparator) {
            if (comparator.semver === ANY) comparator = new Comparator('>=0.0.0');
            high = high || comparator;
            low = low || comparator;
            if (gtfn(comparator.semver, high.semver, options)) high = comparator;
            else if (ltfn(comparator.semver, low.semver, options)) low = comparator;
        });
        // If the edge version comparator has a operator then our version
        // isn't outside it
        if (high.operator === comp || high.operator === ecomp) return false;
        // If the lowest version comparator has an operator and our version
        // is less than it then it isn't higher than the range
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) return false;
        else if (low.operator === ecomp && ltfn(version, low.semver)) return false;
    }
    return true;
}
exports.prerelease = prerelease;
function prerelease(version, options) {
    var parsed = parse(version, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
}
exports.intersects = intersects;
function intersects(r1, r2, options) {
    r1 = new Range(r1, options);
    r2 = new Range(r2, options);
    return r1.intersects(r2);
}
exports.coerce = coerce;
function coerce(version, options) {
    if (version instanceof SemVer) return version;
    if (typeof version === 'number') version = String(version);
    if (typeof version !== 'string') return null;
    options = options || {
    };
    var match = null;
    if (!options.rtl) match = version.match(re[t.COERCE]);
    else {
        // Find the right-most coercible string that does not share
        // a terminus with a more left-ward coercible string.
        // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
        //
        // Walk through the string checking with a /g regexp
        // Manually set the index so as to pick up overlapping matches.
        // Stop when we get a match that ends at the string end, since no
        // coercible string can be more right-ward without the same terminus.
        var next;
        while((next = re[t.COERCERTL].exec(version)) && (!match || match.index + match[0].length !== version.length)){
            if (!match || next.index + next[0].length !== match.index + match[0].length) match = next;
            re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
        }
        // leave it in a clean state
        re[t.COERCERTL].lastIndex = -1;
    }
    if (match === null) return null;
    return parse(match[2] + '.' + (match[3] || '0') + '.' + (match[4] || '0'), options);
}

});


parcelRequire.register("lcdeq", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});




var $8WDjg = parcelRequire("8WDjg");
let $f6e4fb802dd31da3$var$tunnel;
var $f6e4fb802dd31da3$var$HttpCodes;
(function(HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})($f6e4fb802dd31da3$var$HttpCodes = module.exports.HttpCodes || (module.exports.HttpCodes = {
}));
var $f6e4fb802dd31da3$var$Headers;
(function(Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})($f6e4fb802dd31da3$var$Headers = module.exports.Headers || (module.exports.Headers = {
}));
var $f6e4fb802dd31da3$var$MediaTypes;
(function(MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})($f6e4fb802dd31da3$var$MediaTypes = module.exports.MediaTypes || (module.exports.MediaTypes = {
}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */ function $f6e4fb802dd31da3$var$getProxyUrl(serverUrl) {
    let proxyUrl = $8WDjg.getProxyUrl($bwvhf$url.parse(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
module.exports.getProxyUrl = $f6e4fb802dd31da3$var$getProxyUrl;
const $f6e4fb802dd31da3$var$HttpRedirectCodes = [
    $f6e4fb802dd31da3$var$HttpCodes.MovedPermanently,
    $f6e4fb802dd31da3$var$HttpCodes.ResourceMoved,
    $f6e4fb802dd31da3$var$HttpCodes.SeeOther,
    $f6e4fb802dd31da3$var$HttpCodes.TemporaryRedirect,
    $f6e4fb802dd31da3$var$HttpCodes.PermanentRedirect
];
const $f6e4fb802dd31da3$var$HttpResponseRetryCodes = [
    $f6e4fb802dd31da3$var$HttpCodes.BadGateway,
    $f6e4fb802dd31da3$var$HttpCodes.ServiceUnavailable,
    $f6e4fb802dd31da3$var$HttpCodes.GatewayTimeout
];
const $f6e4fb802dd31da3$var$RetryableHttpVerbs = [
    'OPTIONS',
    'GET',
    'DELETE',
    'HEAD'
];
const $f6e4fb802dd31da3$var$ExponentialBackoffCeiling = 10;
const $f6e4fb802dd31da3$var$ExponentialBackoffTimeSlice = 5;
class $f6e4fb802dd31da3$var$HttpClientResponse {
    constructor(message){
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject)=>{
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk)=>{
                output = Buffer.concat([
                    output,
                    chunk
                ]);
            });
            this.message.on('end', ()=>{
                resolve(output.toString());
            });
        });
    }
}
module.exports.HttpClientResponse = $f6e4fb802dd31da3$var$HttpClientResponse;
function $f6e4fb802dd31da3$var$isHttps(requestUrl) {
    let parsedUrl = $bwvhf$url.parse(requestUrl);
    return parsedUrl.protocol === 'https:';
}
module.exports.isHttps = $f6e4fb802dd31da3$var$isHttps;

class $f6e4fb802dd31da3$var$HttpClient {
    constructor(userAgent, handlers, requestOptions){
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) this._ignoreSslError = requestOptions.ignoreSslError;
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) this._allowRedirects = requestOptions.allowRedirects;
            if (requestOptions.allowRedirectDowngrade != null) this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            if (requestOptions.maxRedirects != null) this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            if (requestOptions.keepAlive != null) this._keepAlive = requestOptions.keepAlive;
            if (requestOptions.allowRetries != null) this._allowRetries = requestOptions.allowRetries;
            if (requestOptions.maxRetries != null) this._maxRetries = requestOptions.maxRetries;
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {
        });
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {
        });
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {
        });
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */ async getJson(requestUrl, additionalHeaders = {
    }) {
        additionalHeaders[$f6e4fb802dd31da3$var$Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, $f6e4fb802dd31da3$var$Headers.Accept, $f6e4fb802dd31da3$var$MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {
    }) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[$f6e4fb802dd31da3$var$Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, $f6e4fb802dd31da3$var$Headers.Accept, $f6e4fb802dd31da3$var$MediaTypes.ApplicationJson);
        additionalHeaders[$f6e4fb802dd31da3$var$Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, $f6e4fb802dd31da3$var$Headers.ContentType, $f6e4fb802dd31da3$var$MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {
    }) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[$f6e4fb802dd31da3$var$Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, $f6e4fb802dd31da3$var$Headers.Accept, $f6e4fb802dd31da3$var$MediaTypes.ApplicationJson);
        additionalHeaders[$f6e4fb802dd31da3$var$Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, $f6e4fb802dd31da3$var$Headers.ContentType, $f6e4fb802dd31da3$var$MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {
    }) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[$f6e4fb802dd31da3$var$Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, $f6e4fb802dd31da3$var$Headers.Accept, $f6e4fb802dd31da3$var$MediaTypes.ApplicationJson);
        additionalHeaders[$f6e4fb802dd31da3$var$Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, $f6e4fb802dd31da3$var$Headers.ContentType, $f6e4fb802dd31da3$var$MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */ async request(verb, requestUrl, data, headers) {
        if (this._disposed) throw new Error('Client has already been disposed.');
        let parsedUrl = $bwvhf$url.parse(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && $f6e4fb802dd31da3$var$RetryableHttpVerbs.indexOf(verb) != -1 ? this._maxRetries + 1 : 1;
        let numTries = 0;
        let response;
        while(numTries < maxTries){
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response && response.message && response.message.statusCode === $f6e4fb802dd31da3$var$HttpCodes.Unauthorized) {
                let authenticationHandler;
                for(let i = 0; i < this.handlers.length; i++)if (this.handlers[i].canHandleAuthentication(response)) {
                    authenticationHandler = this.handlers[i];
                    break;
                }
                if (authenticationHandler) return authenticationHandler.handleAuthentication(this, info, data);
                else // We have received an unauthorized response but have no handlers to handle it.
                // Let the response return to the caller.
                return response;
            }
            let redirectsRemaining = this._maxRedirects;
            while($f6e4fb802dd31da3$var$HttpRedirectCodes.indexOf(response.message.statusCode) != -1 && this._allowRedirects && redirectsRemaining > 0){
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) break;
                let parsedRedirectUrl = $bwvhf$url.parse(redirectUrl);
                if (parsedUrl.protocol == 'https:' && parsedUrl.protocol != parsedRedirectUrl.protocol && !this._allowRedirectDowngrade) throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for(let header in headers)// header names are case insensitive
                    if (header.toLowerCase() === 'authorization') delete headers[header];
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if ($f6e4fb802dd31da3$var$HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) // If not a retry code, return immediately instead of retrying
            return response;
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */ dispose() {
        if (this._agent) this._agent.destroy();
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */ requestRaw(info, data) {
        return new Promise((resolve, reject)=>{
            let callbackForResult = function(err, res) {
                if (err) reject(err);
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */ requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        let callbackCalled = false;
        let handleResult = (err, res)=>{
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg)=>{
            let res = new $f6e4fb802dd31da3$var$HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', (sock)=>{
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 180000, ()=>{
            if (socket) socket.end();
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function(err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') req.write(data, 'utf8');
        if (data && typeof data !== 'string') {
            data.on('close', function() {
                req.end();
            });
            data.pipe(req);
        } else req.end();
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */ getAgent(serverUrl) {
        let parsedUrl = $bwvhf$url.parse(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {
        };
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? $bwvhf$https : $bwvhf$http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {
        };
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port ? parseInt(info.parsedUrl.port) : defaultPort;
        info.options.path = (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) info.options.headers['user-agent'] = this.userAgent;
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) this.handlers.forEach((handler)=>{
            handler.prepareRequest(info.options);
        });
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = (obj)=>Object.keys(obj).reduce((c, k)=>(c[k.toLowerCase()] = obj[k], c)
            , {
            })
        ;
        if (this.requestOptions && this.requestOptions.headers) return Object.assign({
        }, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        return lowercaseKeys(headers || {
        });
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = (obj)=>Object.keys(obj).reduce((c, k)=>(c[k.toLowerCase()] = obj[k], c)
            , {
            })
        ;
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = $8WDjg.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) agent = this._proxyAgent;
        if (this._keepAlive && !useProxy) agent = this._agent;
        // if agent is already assigned use that agent.
        if (!!agent) return agent;
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) maxSockets = this.requestOptions.maxSockets || $bwvhf$http.globalAgent.maxSockets;
        if (useProxy) {
            // If using proxy, need tunnel
            if (!$f6e4fb802dd31da3$var$tunnel) $f6e4fb802dd31da3$var$tunnel = (parcelRequire("763cj"));
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    proxyAuth: proxyUrl.auth,
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) tunnelAgent = overHttps ? $f6e4fb802dd31da3$var$tunnel.httpsOverHttps : $f6e4fb802dd31da3$var$tunnel.httpsOverHttp;
            else tunnelAgent = overHttps ? $f6e4fb802dd31da3$var$tunnel.httpOverHttps : $f6e4fb802dd31da3$var$tunnel.httpOverHttp;
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = {
                keepAlive: this._keepAlive,
                maxSockets: maxSockets
            };
            agent = usingSsl ? new $bwvhf$https.Agent(options) : new $bwvhf$http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) agent = usingSsl ? $bwvhf$https.globalAgent : $bwvhf$http.globalAgent;
        if (usingSsl && this._ignoreSslError) // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
        // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
        // we have to cast it to any and change it directly
        agent.options = Object.assign(agent.options || {
        }, {
            rejectUnauthorized: false
        });
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min($f6e4fb802dd31da3$var$ExponentialBackoffCeiling, retryNumber);
        const ms = $f6e4fb802dd31da3$var$ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise((resolve)=>setTimeout(()=>resolve()
            , ms)
        );
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) return a;
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject)=>{
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {
                }
            };
            // not found leads to null obj returned
            if (statusCode == $f6e4fb802dd31da3$var$HttpCodes.NotFound) resolve(response);
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) obj = JSON.parse(contents, $f6e4fb802dd31da3$var$HttpClient.dateTimeDeserializer);
                    else obj = JSON.parse(contents);
                    response.result = obj;
                }
                response.headers = res.message.headers;
            } catch (err) {
            // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) msg = obj.message;
                else if (contents && contents.length > 0) // it may be the case that the exception is in the body message as string
                msg = contents;
                else msg = 'Failed request: (' + statusCode + ')';
                let err = new Error(msg);
                // attach statusCode and body obj (if available) to the error object
                err['statusCode'] = statusCode;
                if (response.result) err['result'] = response.result;
                reject(err);
            } else resolve(response);
        });
    }
}
module.exports.HttpClient = $f6e4fb802dd31da3$var$HttpClient;

});
parcelRequire.register("8WDjg", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

function $68323b99bd3101d3$var$getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if ($68323b99bd3101d3$var$checkBypass(reqUrl)) return proxyUrl;
    let proxyVar;
    if (usingSsl) proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    else proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    if (proxyVar) proxyUrl = $bwvhf$url.parse(proxyVar);
    return proxyUrl;
}
module.exports.getProxyUrl = $68323b99bd3101d3$var$getProxyUrl;
function $68323b99bd3101d3$var$checkBypass(reqUrl) {
    if (!reqUrl.hostname) return false;
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) return false;
    // Determine the request port
    let reqPort;
    if (reqUrl.port) reqPort = Number(reqUrl.port);
    else if (reqUrl.protocol === 'http:') reqPort = 80;
    else if (reqUrl.protocol === 'https:') reqPort = 443;
    // Format the request hostname and hostname with port
    let upperReqHosts = [
        reqUrl.hostname.toUpperCase()
    ];
    if (typeof reqPort === 'number') upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy.split(',').map((x)=>x.trim().toUpperCase()
    ).filter((x)=>x
    )){
        if (upperReqHosts.some((x)=>x === upperNoProxyItem
        )) return true;
    }
    return false;
}
module.exports.checkBypass = $68323b99bd3101d3$var$checkBypass;

});


parcelRequire.register("azAOm", function(module, exports) {

var $1ply8 = parcelRequire("1ply8");

var $hGcoW = parcelRequire("hGcoW");
function $7b29ba35f414bcd3$var$v4(options, buf, offset) {
    var i = buf && offset || 0;
    if (typeof options == 'string') {
        buf = options === 'binary' ? new Array(16) : null;
        options = null;
    }
    options = options || {
    };
    var rnds = options.random || (options.rng || $1ply8)();
    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    // Copy bytes to buffer, if provided
    if (buf) for(var ii = 0; ii < 16; ++ii)buf[i + ii] = rnds[ii];
    return buf || $hGcoW(rnds);
}
module.exports = $7b29ba35f414bcd3$var$v4;

});
parcelRequire.register("1ply8", function(module, exports) {

module.exports = function nodeRNG() {
    return $bwvhf$crypto.randomBytes(16);
};

});

parcelRequire.register("hGcoW", function(module, exports) {
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */ var $cdeffa9024ec1a91$var$byteToHex = [];
for(var $cdeffa9024ec1a91$var$i = 0; $cdeffa9024ec1a91$var$i < 256; ++$cdeffa9024ec1a91$var$i)$cdeffa9024ec1a91$var$byteToHex[$cdeffa9024ec1a91$var$i] = ($cdeffa9024ec1a91$var$i + 256).toString(16).substr(1);
function $cdeffa9024ec1a91$var$bytesToUuid(buf, offset) {
    var i = offset || 0;
    var bth = $cdeffa9024ec1a91$var$byteToHex;
    // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
    return [
        bth[buf[i++]],
        bth[buf[i++]],
        bth[buf[i++]],
        bth[buf[i++]],
        '-',
        bth[buf[i++]],
        bth[buf[i++]],
        '-',
        bth[buf[i++]],
        bth[buf[i++]],
        '-',
        bth[buf[i++]],
        bth[buf[i++]],
        '-',
        bth[buf[i++]],
        bth[buf[i++]],
        bth[buf[i++]],
        bth[buf[i++]],
        bth[buf[i++]],
        bth[buf[i++]]
    ].join('');
}
module.exports = $cdeffa9024ec1a91$var$bytesToUuid;

});


parcelRequire.register("k3Kbe", function(module, exports) {
"use strict";
var $e9a7e8e302633502$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $e9a7e8e302633502$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

const $e9a7e8e302633502$var$tr = $e9a7e8e302633502$var$__importStar((parcelRequire("2hbkk")));
/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */ function $e9a7e8e302633502$var$exec(commandLine, args, options) {
    return $e9a7e8e302633502$var$__awaiter(this, void 0, void 0, function*() {
        const commandArgs = $e9a7e8e302633502$var$tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new $e9a7e8e302633502$var$tr.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
module.exports.exec = $e9a7e8e302633502$var$exec;

});
parcelRequire.register("2hbkk", function(module, exports) {
"use strict";
var $1a85f49169fe817b$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $1a85f49169fe817b$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

const $1a85f49169fe817b$var$os = $1a85f49169fe817b$var$__importStar($bwvhf$os);

const $1a85f49169fe817b$var$events = $1a85f49169fe817b$var$__importStar($bwvhf$events);

const $1a85f49169fe817b$var$child = $1a85f49169fe817b$var$__importStar($bwvhf$child_process);

const $1a85f49169fe817b$var$path = $1a85f49169fe817b$var$__importStar($bwvhf$path);

const $1a85f49169fe817b$var$io = $1a85f49169fe817b$var$__importStar((parcelRequire("9A2PP")));

const $1a85f49169fe817b$var$ioUtil = $1a85f49169fe817b$var$__importStar((parcelRequire("9o6lX")));
/* eslint-disable @typescript-eslint/unbound-method */ const $1a85f49169fe817b$var$IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */ class $1a85f49169fe817b$var$ToolRunner extends $1a85f49169fe817b$var$events.EventEmitter {
    constructor(toolPath, args, options){
        super();
        if (!toolPath) throw new Error("Parameter 'toolPath' cannot be null or empty.");
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {
        };
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) this.options.listeners.debug(message);
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if ($1a85f49169fe817b$var$IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args)cmd += ` ${a}`;
            } else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args)cmd += ` ${a}`;
            } else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args)cmd += ` ${this._windowsQuoteCmdArg(a)}`;
            }
        } else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args)cmd += ` ${a}`;
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf($1a85f49169fe817b$var$os.EOL);
            while(n > -1){
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + $1a85f49169fe817b$var$os.EOL.length);
                n = s.indexOf($1a85f49169fe817b$var$os.EOL);
            }
            strBuffer = s;
        } catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
        }
    }
    _getSpawnFileName() {
        if ($1a85f49169fe817b$var$IS_WINDOWS) {
            if (this._isCmdFile()) return process.env['COMSPEC'] || 'cmd.exe';
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if ($1a85f49169fe817b$var$IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args){
                    argline += ' ';
                    argline += options.windowsVerbatimArguments ? a : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [
                    argline
                ];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return this._endsWith(upperToolPath, '.CMD') || this._endsWith(upperToolPath, '.BAT');
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) return this._uvQuoteCmdArg(arg);
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) return '""';
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg)if (cmdSpecialChars.some((x)=>x === char
        )) {
            needsQuotes = true;
            break;
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) return arg;
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for(let i = arg.length; i > 0; i--){
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') reverse += '\\'; // double the slash
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            } else quoteHit = false;
        }
        reverse += '"';
        return reverse.split('').reverse().join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) // Need double quotation for empty argument
        return '""';
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) // No quotation needed
        return arg;
        if (!arg.includes('"') && !arg.includes('\\')) // No embedded double quotes or backslashes, so I can just wrap
        // quote marks around the whole thing.
        return `"${arg}"`;
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for(let i = arg.length; i > 0; i--){
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') reverse += '\\';
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            } else quoteHit = false;
        }
        reverse += '"';
        return reverse.split('').reverse().join('');
    }
    _cloneExecOptions(options) {
        options = options || {
        };
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {
        };
        const result = {
        };
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] = options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) result.argv0 = `"${toolPath}"`;
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */ exec() {
        return $1a85f49169fe817b$var$__awaiter(this, void 0, void 0, function*() {
            // root the tool path if it is unrooted and contains relative pathing
            if (!$1a85f49169fe817b$var$ioUtil.isRooted(this.toolPath) && (this.toolPath.includes('/') || $1a85f49169fe817b$var$IS_WINDOWS && this.toolPath.includes('\\'))) // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
            this.toolPath = $1a85f49169fe817b$var$path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield $1a85f49169fe817b$var$io.which(this.toolPath, true);
            return new Promise((resolve, reject)=>{
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args)this._debug(`   ${arg}`);
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + $1a85f49169fe817b$var$os.EOL);
                const state = new $1a85f49169fe817b$var$ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message)=>{
                    this._debug(message);
                });
                const fileName = this._getSpawnFileName();
                const cp = $1a85f49169fe817b$var$child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                const stdbuffer = '';
                if (cp.stdout) cp.stdout.on('data', (data)=>{
                    if (this.options.listeners && this.options.listeners.stdout) this.options.listeners.stdout(data);
                    if (!optionsNonNull.silent && optionsNonNull.outStream) optionsNonNull.outStream.write(data);
                    this._processLineBuffer(data, stdbuffer, (line)=>{
                        if (this.options.listeners && this.options.listeners.stdline) this.options.listeners.stdline(line);
                    });
                });
                const errbuffer = '';
                if (cp.stderr) cp.stderr.on('data', (data)=>{
                    state.processStderr = true;
                    if (this.options.listeners && this.options.listeners.stderr) this.options.listeners.stderr(data);
                    if (!optionsNonNull.silent && optionsNonNull.errStream && optionsNonNull.outStream) {
                        const s = optionsNonNull.failOnStdErr ? optionsNonNull.errStream : optionsNonNull.outStream;
                        s.write(data);
                    }
                    this._processLineBuffer(data, errbuffer, (line)=>{
                        if (this.options.listeners && this.options.listeners.errline) this.options.listeners.errline(line);
                    });
                });
                cp.on('error', (err)=>{
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code)=>{
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code)=>{
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode)=>{
                    if (stdbuffer.length > 0) this.emit('stdline', stdbuffer);
                    if (errbuffer.length > 0) this.emit('errline', errbuffer);
                    cp.removeAllListeners();
                    if (error) reject(error);
                    else resolve(exitCode);
                });
                if (this.options.input) {
                    if (!cp.stdin) throw new Error('child process missing stdin');
                    cp.stdin.end(this.options.input);
                }
            });
        });
    }
}
module.exports.ToolRunner = $1a85f49169fe817b$var$ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */ function $1a85f49169fe817b$var$argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') arg += '\\';
        arg += c;
        escaped = false;
    }
    for(let i = 0; i < argString.length; i++){
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) inQuotes = !inQuotes;
            else append(c);
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) args.push(arg.trim());
    return args;
}
module.exports.argStringToArray = $1a85f49169fe817b$var$argStringToArray;
class $1a85f49169fe817b$var$ExecState extends $1a85f49169fe817b$var$events.EventEmitter {
    constructor(options, toolPath){
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) throw new Error('toolPath must not be empty');
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) this.delay = options.delay;
    }
    CheckComplete() {
        if (this.done) return;
        if (this.processClosed) this._setResult();
        else if (this.processExited) this.timeout = setTimeout($1a85f49169fe817b$var$ExecState.HandleTimeout, this.delay, this);
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            else if (this.processStderr && this.options.failOnStdErr) error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) return;
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay / 1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}

});
parcelRequire.register("9A2PP", function(module, exports) {
"use strict";
var $6f99acce88e6338b$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $6f99acce88e6338b$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

const $6f99acce88e6338b$var$childProcess = $6f99acce88e6338b$var$__importStar($bwvhf$child_process);

const $6f99acce88e6338b$var$path = $6f99acce88e6338b$var$__importStar($bwvhf$path);


const $6f99acce88e6338b$var$ioUtil = $6f99acce88e6338b$var$__importStar((parcelRequire("9o6lX")));
const $6f99acce88e6338b$var$exec = $bwvhf$util.promisify($6f99acce88e6338b$var$childProcess.exec);
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */ function $6f99acce88e6338b$var$cp(source, dest, options = {
}) {
    return $6f99acce88e6338b$var$__awaiter(this, void 0, void 0, function*() {
        const { force: force , recursive: recursive  } = $6f99acce88e6338b$var$readCopyOptions(options);
        const destStat = (yield $6f99acce88e6338b$var$ioUtil.exists(dest)) ? yield $6f99acce88e6338b$var$ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) return;
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory() ? $6f99acce88e6338b$var$path.join(dest, $6f99acce88e6338b$var$path.basename(source)) : dest;
        if (!(yield $6f99acce88e6338b$var$ioUtil.exists(source))) throw new Error(`no such file or directory: ${source}`);
        const sourceStat = yield $6f99acce88e6338b$var$ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            else yield $6f99acce88e6338b$var$cpDirRecursive(source, newDest, 0, force);
        } else {
            if ($6f99acce88e6338b$var$path.relative(source, newDest) === '') // a file cannot be copied to itself
            throw new Error(`'${newDest}' and '${source}' are the same file`);
            yield $6f99acce88e6338b$var$copyFile(source, newDest, force);
        }
    });
}
module.exports.cp = $6f99acce88e6338b$var$cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */ function $6f99acce88e6338b$var$mv(source, dest, options = {
}) {
    return $6f99acce88e6338b$var$__awaiter(this, void 0, void 0, function*() {
        if (yield $6f99acce88e6338b$var$ioUtil.exists(dest)) {
            let destExists = true;
            if (yield $6f99acce88e6338b$var$ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = $6f99acce88e6338b$var$path.join(dest, $6f99acce88e6338b$var$path.basename(source));
                destExists = yield $6f99acce88e6338b$var$ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) yield $6f99acce88e6338b$var$rmRF(dest);
                else throw new Error('Destination already exists');
            }
        }
        yield $6f99acce88e6338b$var$mkdirP($6f99acce88e6338b$var$path.dirname(dest));
        yield $6f99acce88e6338b$var$ioUtil.rename(source, dest);
    });
}
module.exports.mv = $6f99acce88e6338b$var$mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */ function $6f99acce88e6338b$var$rmRF(inputPath) {
    return $6f99acce88e6338b$var$__awaiter(this, void 0, void 0, function*() {
        if ($6f99acce88e6338b$var$ioUtil.IS_WINDOWS) {
            // Node doesn't provide a delete operation, only an unlink function. This means that if the file is being used by another
            // program (e.g. antivirus), it won't be deleted. To address this, we shell out the work to rd/del.
            try {
                if (yield $6f99acce88e6338b$var$ioUtil.isDirectory(inputPath, true)) yield $6f99acce88e6338b$var$exec(`rd /s /q "${inputPath}"`);
                else yield $6f99acce88e6338b$var$exec(`del /f /a "${inputPath}"`);
            } catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT') throw err;
            }
            // Shelling out fails to remove a symlink folder with missing source, this unlink catches that
            try {
                yield $6f99acce88e6338b$var$ioUtil.unlink(inputPath);
            } catch (err1) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err1.code !== 'ENOENT') throw err1;
            }
        } else {
            let isDir = false;
            try {
                isDir = yield $6f99acce88e6338b$var$ioUtil.isDirectory(inputPath);
            } catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT') throw err;
                return;
            }
            if (isDir) yield $6f99acce88e6338b$var$exec(`rm -rf "${inputPath}"`);
            else yield $6f99acce88e6338b$var$ioUtil.unlink(inputPath);
        }
    });
}
module.exports.rmRF = $6f99acce88e6338b$var$rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */ function $6f99acce88e6338b$var$mkdirP(fsPath) {
    return $6f99acce88e6338b$var$__awaiter(this, void 0, void 0, function*() {
        yield $6f99acce88e6338b$var$ioUtil.mkdirP(fsPath);
    });
}
module.exports.mkdirP = $6f99acce88e6338b$var$mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */ function $6f99acce88e6338b$var$which(tool, check) {
    return $6f99acce88e6338b$var$__awaiter(this, void 0, void 0, function*() {
        if (!tool) throw new Error("parameter 'tool' is required");
        // recursive when check=true
        if (check) {
            const result = yield $6f99acce88e6338b$var$which(tool, false);
            if (!result) {
                if ($6f99acce88e6338b$var$ioUtil.IS_WINDOWS) throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                else throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
            }
            return result;
        }
        const matches = yield $6f99acce88e6338b$var$findInPath(tool);
        if (matches && matches.length > 0) return matches[0];
        return '';
    });
}
module.exports.which = $6f99acce88e6338b$var$which;
/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */ function $6f99acce88e6338b$var$findInPath(tool) {
    return $6f99acce88e6338b$var$__awaiter(this, void 0, void 0, function*() {
        if (!tool) throw new Error("parameter 'tool' is required");
        // build the list of extensions to try
        const extensions = [];
        if ($6f99acce88e6338b$var$ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
            for (const extension of process.env['PATHEXT'].split($6f99acce88e6338b$var$path.delimiter))if (extension) extensions.push(extension);
        }
        // if it's rooted, return it if exists. otherwise return empty.
        if ($6f99acce88e6338b$var$ioUtil.isRooted(tool)) {
            const filePath = yield $6f99acce88e6338b$var$ioUtil.tryGetExecutablePath(tool, extensions);
            if (filePath) return [
                filePath
            ];
            return [];
        }
        // if any path separators, return empty
        if (tool.includes($6f99acce88e6338b$var$path.sep)) return [];
        // build the list of directories
        //
        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
        // it feels like we should not do this. Checking the current directory seems like more of a use
        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
        // across platforms.
        const directories = [];
        if (process.env.PATH) {
            for (const p of process.env.PATH.split($6f99acce88e6338b$var$path.delimiter))if (p) directories.push(p);
        }
        // find all matches
        const matches = [];
        for (const directory of directories){
            const filePath = yield $6f99acce88e6338b$var$ioUtil.tryGetExecutablePath($6f99acce88e6338b$var$path.join(directory, tool), extensions);
            if (filePath) matches.push(filePath);
        }
        return matches;
    });
}
module.exports.findInPath = $6f99acce88e6338b$var$findInPath;
function $6f99acce88e6338b$var$readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    return {
        force: force,
        recursive: recursive
    };
}
function $6f99acce88e6338b$var$cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return $6f99acce88e6338b$var$__awaiter(this, void 0, void 0, function*() {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255) return;
        currentDepth++;
        yield $6f99acce88e6338b$var$mkdirP(destDir);
        const files = yield $6f99acce88e6338b$var$ioUtil.readdir(sourceDir);
        for (const fileName of files){
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield $6f99acce88e6338b$var$ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) // Recurse
            yield $6f99acce88e6338b$var$cpDirRecursive(srcFile, destFile, currentDepth, force);
            else yield $6f99acce88e6338b$var$copyFile(srcFile, destFile, force);
        }
        // Change the mode for the newly created directory
        yield $6f99acce88e6338b$var$ioUtil.chmod(destDir, (yield $6f99acce88e6338b$var$ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function $6f99acce88e6338b$var$copyFile(srcFile, destFile, force) {
    return $6f99acce88e6338b$var$__awaiter(this, void 0, void 0, function*() {
        if ((yield $6f99acce88e6338b$var$ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield $6f99acce88e6338b$var$ioUtil.lstat(destFile);
                yield $6f99acce88e6338b$var$ioUtil.unlink(destFile);
            } catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield $6f99acce88e6338b$var$ioUtil.chmod(destFile, '0666');
                    yield $6f99acce88e6338b$var$ioUtil.unlink(destFile);
                }
            // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield $6f99acce88e6338b$var$ioUtil.readlink(srcFile);
            yield $6f99acce88e6338b$var$ioUtil.symlink(symlinkFull, destFile, $6f99acce88e6338b$var$ioUtil.IS_WINDOWS ? 'junction' : null);
        } else if (!(yield $6f99acce88e6338b$var$ioUtil.exists(destFile)) || force) yield $6f99acce88e6338b$var$ioUtil.copyFile(srcFile, destFile);
    });
}

});
parcelRequire.register("9o6lX", function(module, exports) {
"use strict";
var $6d5b48875297a9d6$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $6d5b48875297a9d6$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
};
var $6d5b48875297a9d6$var$_a;
Object.defineProperty(module.exports, "__esModule", {
    value: true
});


const $6d5b48875297a9d6$var$fs = $6d5b48875297a9d6$var$__importStar($bwvhf$fs);

const $6d5b48875297a9d6$var$path = $6d5b48875297a9d6$var$__importStar($bwvhf$path);
$6d5b48875297a9d6$var$_a = $6d5b48875297a9d6$var$fs.promises, module.exports.chmod = $6d5b48875297a9d6$var$_a.chmod, module.exports.copyFile = $6d5b48875297a9d6$var$_a.copyFile, module.exports.lstat = $6d5b48875297a9d6$var$_a.lstat, module.exports.mkdir = $6d5b48875297a9d6$var$_a.mkdir, module.exports.readdir = $6d5b48875297a9d6$var$_a.readdir, module.exports.readlink = $6d5b48875297a9d6$var$_a.readlink, module.exports.rename = $6d5b48875297a9d6$var$_a.rename, module.exports.rmdir = $6d5b48875297a9d6$var$_a.rmdir, module.exports.stat = $6d5b48875297a9d6$var$_a.stat, module.exports.symlink = $6d5b48875297a9d6$var$_a.symlink, module.exports.unlink = $6d5b48875297a9d6$var$_a.unlink;
module.exports.IS_WINDOWS = process.platform === 'win32';
function $6d5b48875297a9d6$var$exists(fsPath) {
    return $6d5b48875297a9d6$var$__awaiter(this, void 0, void 0, function*() {
        try {
            yield module.exports.stat(fsPath);
        } catch (err) {
            if (err.code === 'ENOENT') return false;
            throw err;
        }
        return true;
    });
}
module.exports.exists = $6d5b48875297a9d6$var$exists;
function $6d5b48875297a9d6$var$isDirectory(fsPath, useStat = false) {
    return $6d5b48875297a9d6$var$__awaiter(this, void 0, void 0, function*() {
        const stats = useStat ? yield module.exports.stat(fsPath) : yield module.exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
module.exports.isDirectory = $6d5b48875297a9d6$var$isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */ function $6d5b48875297a9d6$var$isRooted(p) {
    p = $6d5b48875297a9d6$var$normalizeSeparators(p);
    if (!p) throw new Error('isRooted() parameter "p" cannot be empty');
    if (module.exports.IS_WINDOWS) return p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
    ; // e.g. C: or C:\hello
    return p.startsWith('/');
}
module.exports.isRooted = $6d5b48875297a9d6$var$isRooted;
/**
 * Recursively create a directory at `fsPath`.
 *
 * This implementation is optimistic, meaning it attempts to create the full
 * path first, and backs up the path stack from there.
 *
 * @param fsPath The path to create
 * @param maxDepth The maximum recursion depth
 * @param depth The current recursion depth
 */ function $6d5b48875297a9d6$var$mkdirP(fsPath, maxDepth = 1000, depth = 1) {
    return $6d5b48875297a9d6$var$__awaiter(this, void 0, void 0, function*() {
        $bwvhf$assert.ok(fsPath, 'a path argument must be provided');
        fsPath = $6d5b48875297a9d6$var$path.resolve(fsPath);
        if (depth >= maxDepth) return module.exports.mkdir(fsPath);
        try {
            yield module.exports.mkdir(fsPath);
            return;
        } catch (err) {
            switch(err.code){
                case 'ENOENT':
                    yield $6d5b48875297a9d6$var$mkdirP($6d5b48875297a9d6$var$path.dirname(fsPath), maxDepth, depth + 1);
                    yield module.exports.mkdir(fsPath);
                    return;
                default:
                    {
                        let stats;
                        try {
                            stats = yield module.exports.stat(fsPath);
                        } catch (err2) {
                            throw err;
                        }
                        if (!stats.isDirectory()) throw err;
                    }
            }
        }
    });
}
module.exports.mkdirP = $6d5b48875297a9d6$var$mkdirP;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */ function $6d5b48875297a9d6$var$tryGetExecutablePath(filePath, extensions) {
    return $6d5b48875297a9d6$var$__awaiter(this, void 0, void 0, function*() {
        let stats = undefined;
        try {
            // test file exists
            stats = yield module.exports.stat(filePath);
        } catch (err) {
            if (err.code !== 'ENOENT') // eslint-disable-next-line no-console
            console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
        }
        if (stats && stats.isFile()) {
            if (module.exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = $6d5b48875297a9d6$var$path.extname(filePath).toUpperCase();
                if (extensions.some((validExt)=>validExt.toUpperCase() === upperExt
                )) return filePath;
            } else {
                if ($6d5b48875297a9d6$var$isUnixExecutable(stats)) return filePath;
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions){
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield module.exports.stat(filePath);
            } catch (err) {
                if (err.code !== 'ENOENT') // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
            if (stats && stats.isFile()) {
                if (module.exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = $6d5b48875297a9d6$var$path.dirname(filePath);
                        const upperName = $6d5b48875297a9d6$var$path.basename(filePath).toUpperCase();
                        for (const actualName of yield module.exports.readdir(directory))if (upperName === actualName.toUpperCase()) {
                            filePath = $6d5b48875297a9d6$var$path.join(directory, actualName);
                            break;
                        }
                    } catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                } else {
                    if ($6d5b48875297a9d6$var$isUnixExecutable(stats)) return filePath;
                }
            }
        }
        return '';
    });
}
module.exports.tryGetExecutablePath = $6d5b48875297a9d6$var$tryGetExecutablePath;
function $6d5b48875297a9d6$var$normalizeSeparators(p) {
    p = p || '';
    if (module.exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function $6d5b48875297a9d6$var$isUnixExecutable(stats) {
    return (stats.mode & 1) > 0 || (stats.mode & 8) > 0 && stats.gid === process.getgid() || (stats.mode & 64) > 0 && stats.uid === process.getuid();
}

});




parcelRequire.register("kiZ0G", function(module, exports) {
"use strict";
var $ec84d069aef9bef1$var$__createBinding = module.exports && module.exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var $ec84d069aef9bef1$var$__setModuleDefault = module.exports && module.exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var $ec84d069aef9bef1$var$__importStar = module.exports && module.exports.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {
    };
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.hasOwnProperty.call(mod, k)) $ec84d069aef9bef1$var$__createBinding(result, mod, k);
    }
    $ec84d069aef9bef1$var$__setModuleDefault(result, mod);
    return result;
};
var $ec84d069aef9bef1$var$__awaiter = module.exports && module.exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.RetryHelper = void 0;

const $ec84d069aef9bef1$var$core = $ec84d069aef9bef1$var$__importStar((parcelRequire("1WahJ")));
/**
 * Internal class for retries
 */ class $ec84d069aef9bef1$var$RetryHelper {
    constructor(maxAttempts, minSeconds, maxSeconds){
        if (maxAttempts < 1) throw new Error('max attempts should be greater than or equal to 1');
        this.maxAttempts = maxAttempts;
        this.minSeconds = Math.floor(minSeconds);
        this.maxSeconds = Math.floor(maxSeconds);
        if (this.minSeconds > this.maxSeconds) throw new Error('min seconds should be less than or equal to max seconds');
    }
    execute(action, isRetryable) {
        return $ec84d069aef9bef1$var$__awaiter(this, void 0, void 0, function*() {
            let attempt = 1;
            while(attempt < this.maxAttempts){
                // Try
                try {
                    return yield action();
                } catch (err) {
                    if (isRetryable && !isRetryable(err)) throw err;
                    $ec84d069aef9bef1$var$core.info(err.message);
                }
                // Sleep
                const seconds = this.getSleepAmount();
                $ec84d069aef9bef1$var$core.info(`Waiting ${seconds} seconds before trying again`);
                yield this.sleep(seconds);
                attempt++;
            }
            // Last attempt
            return yield action();
        });
    }
    getSleepAmount() {
        return Math.floor(Math.random() * (this.maxSeconds - this.minSeconds + 1)) + this.minSeconds;
    }
    sleep(seconds) {
        return $ec84d069aef9bef1$var$__awaiter(this, void 0, void 0, function*() {
            return new Promise((resolve)=>setTimeout(resolve, seconds * 1000)
            );
        });
    }
}
module.exports.RetryHelper = $ec84d069aef9bef1$var$RetryHelper;

});




parcelRequire("fek0m");

//# sourceMappingURL=index.js.map
