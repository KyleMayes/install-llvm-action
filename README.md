# install-llvm-action

[![Test](https://github.com/KyleMayes/install-llvm-action/actions/workflows/test.yml/badge.svg)](https://github.com/KyleMayes/install-llvm-action/actions/workflows/test.yml)

A GitHub Action for downloading and installing LLVM and Clang binaries.

Supports LLVM and Clang 7.1.0 and later. The binaries will be added to the relevant environment variables for the platform after installation (e.g., `PATH`, `LD_LIBRARY_PATH`, and/or `DYLD_LIBRARY_PATH`).

Released under the Apache License 2.0.

## Example Usage

```yml
- name: Install LLVM and Clang
  uses: KyleMayes/install-llvm-action@v1
  with:
    version: "10.0"
```

## Example Usage (with non-default installation directory):

```yml
- name: Install LLVM and Clang
  uses: KyleMayes/install-llvm-action@v1
  with:
    version: "10.0"
    directory: ${{ runner.temp }}/llvm
```

## Linking to Installed Libraries (Linux)

If your build system requires a library from the installed LLVM and Clang binaries such as `libclang.so`, and it fails to find it, then it may help to create a symlink for the versioned `.so` using the following step which utilizes the `LLVM_PATH` environment variable set by this action:

```yaml
- name: Symlink libclang.so (Linux)
  if: contains(matrix.os, 'ubuntu')
  run: sudo ln -s libclang-11.so.1 /lib/x86_64-linux-gnu/libclang.so
  working-directory: ${{ env.LLVM_PATH }}/lib
```

## Inputs

### `version`

**Required** The version of LLVM and Clang binaries to install.

This can be a specific LLVM and Clang version such as `10.1.2` or a minimum version like `10.1` or just `10`. When specifying a minimum version, the highest compatible version supported by the platform will be installed (e.g., `10.1.2` for `10.1` or `10.2.0` for `10`).

Note that when using minimum versions like `10` the specific version installed by this action may not be the same on every operating system and architecture (e.g., x86-86 vs ARM64). This is because some versions of the LLVM and Clang binaries do not exist for some operating systems. You can view [this file](assets.json) to see the currently supported LLVM and Clang versions for each operating system and architecture pairing.

### `arch`

The archtecture (either `x64` or `arm64`) to install LLVM and Clang binaries for.

By default, the architecture of the machine this action is running on will be used.

### `force-url`

The full download URL to use for LLVM and Clang binaries.

If this input is used, the `version`, `arch`, and `mirror-url` inputs will be ignored (except in that the value of the `version` input will be used verbatim as the value for the `version` output). Instead, the URL supplied for this input is assumed to be a full URL to download LLVM and Clang binaries. This input can be used if this action lacks support for a recent LLVM and Clang version or if you have LLVM and Clang binaries mirror in a way that can't be handled by the `mirror-url` input.

### `directory`

The directory to install LLVM and Clang binaries to. If not provided, `C:\Program Files\LLVM` is used as the default value on Windows and `./llvm` is used on other operating systems.

This action puts the value of this input into the `LLVM_PATH` environment variable which allows for easy use of the directory containing the LLVM and Clang binaries in subsequent jobs (e.g., `${{ env.LLVM_PATH }}`).

### `cached`

Whether the LLVM and Clang binaries were cached.

**Note:** Caching is not currently recommended, it is usually slower than just directly downloading the LLVM and Clang binaries.

### `mirror-url`

The base URL to download LLVM and Clang binaries from instead of using GitHub.

This can be used if you want to download the LLVM and Clang binaries from a mirror of the GitHub releases for the `llvm/llvm-project` repository provided by a service like Artifactory.

### `auth`

The `Authorization` header to use when downloading LLVM and Clang binaries.

This is unnecessary unless you are providing the `mirror-url` input and you need to provide an `Authorization` header when downloading the LLVM and Clang binaries from the service targeted by that custom download URL.

### `env`

Whether to set `CC` and `CXX` environment variables to Clang paths.

## Outputs

### `version`

The full version of LLVM and Clang binaries installed.

This will only differ from the value of the `version` input when specifying a minimum version like `10.1` or `10`.
