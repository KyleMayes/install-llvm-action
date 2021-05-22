# install-llvm-action

A GitHub Action for downloading and installing LLVM and Clang binaries.

The binaries will be added to the relevant environment variables for the platform after installation (e.g., `PATH`, `LD_LIBRARY_PATH`, and/or `DYLD_LIBRARY_PATH`). Caching is supported using the `actions/cache@v2` action as shown in an example below.

Released under the Apache License 2.0.

## Inputs

### `version`

**Required** The version of LLVM and Clang binaries to install.

This can be a specific LLVM and Clang version such as `3.6.2` or a minimum version like `3.6` or just `3`. When specifying a minimum version, the highest compatible version supported by the platform will be installed (e.g., `3.6.2` for `3.6` or `3.9.1` for `3`).

### `directory`

The directory to install LLVM and Clang binaries to. If not provided it uses `"C:/Program Files/LLVM"` on Windows, and `~/llvm` on other operating systems.

### `force-version`

Whether to accept unsupported LLVM and Clang versions.

This action will by default reject unsupported LLVM and Clang versions. For example, if you want to download LLVM and Clang `69.0.0` but that version is not yet supported by this action, you can set this option to `true` to allow usage of this action.

**Important:** You may need to set `ubuntu-version` as well for this to work, this action will use the Ubuntu version for the most recent supported version which may not work for the version you are requesting. Also, there are no guarantees that this will work at all.

### `ubuntu-version`

The version override of Ubuntu to use for the Linux platform.

For a given LLVM and Clang version, there are sometimes multiple binaries available targeting different versions of Ubuntu (e.g., `16.04` and `18.04`). By default this action will download the binaries for the most recent [LTS version](https://ubuntu.com/blog/what-is-an-ubuntu-lts-release) binaries are available for. This option can be used to override this default and pick a different version.

### `cached`

Whether the LLVM and Clang binaries were cached.

## Outputs

### `version`

The full version of LLVM and Clang binaries installed.

This will only differ from the value of the `version` input when specifying a minimum version like `3.6` or `3`.

## Example Usage

```yml
- name: Install LLVM and Clang
  uses: KyleMayes/install-llvm-action@v1
  with:
    version: "10.0"
```

## Example with providing an installation directory:

```yml
- name: Install LLVM and Clang
  uses: KyleMayes/install-llvm-action@v1
  with:
    version: "10.0"
    directory: ${{ runner.temp }}/llvm
```

## Example Usage (with caching)

**Note:** Since version 9.0.1, LLVM and Clang binaries are [hosted on GitHub](https://github.com/llvm/llvm-project/releases). If you are targeting this or a later version, caching the binaries will almost certainly be slower than just downloading them directly each time since in either case they are coming from GitHub's servers and by not caching them your pipeline will have fewer steps.

```yml
- name: Cache LLVM and Clang
  id: cache-llvm
  uses: actions/cache@v2
  with:
    path: ${{ runner.temp }}/llvm
    key: llvm-3.5
- name: Install LLVM and Clang
  uses: KyleMayes/install-llvm-action@v1
  with:
    version: "3.5"
    directory: ${{ runner.temp }}/llvm
    cached: ${{ steps.cache-llvm.outputs.cache-hit }}
```
