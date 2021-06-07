# install-llvm-action

A GitHub Action for downloading and installing LLVM and Clang binaries.

The binaries will be added to the relevant environment variables for the platform after installation (e.g., `PATH`, `LD_LIBRARY_PATH`, and/or `DYLD_LIBRARY_PATH`). Caching is supported using the `actions/cache@v2` action as shown in an example below. The directory the binaries are installed to will be put in the `LLVM_PATH` environment variable.

Released under the Apache License 2.0.

## Inputs

### `version`

**Required** The version of LLVM and Clang binaries to install.

This can be a specific LLVM and Clang version such as `3.6.2` or a minimum version like `3.6` or just `3`. When specifying a minimum version, the highest compatible version supported by the platform will be installed (e.g., `3.6.2` for `3.6` or `3.9.1` for `3`).

Note that when using minimum versions like `3` the specific version installed by this action may not be the same on every operating system. This is because some versions of the LLVM and Clang binaries do not exist for some operating systems.

### `directory`

The directory to install LLVM and Clang binaries to. If not provided, `C:\Program Files\LLVM` is used as the default value on Windows and `./llvm` is used on other operating systems.

This action puts the value of this option into the `LLVM_PATH` environment variable which allows for easy use of the directory containing the LLVM and Clang binaries in subsequent jobs (e.g., `${{ env.LLVM_PATH }}`).

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

This will only differ from the value of the `version` option when specifying a minimum version like `3.6` or `3`.

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

## Example Usage (with caching)

```yml
- name: Cache LLVM and Clang
  id: cache-llvm
  uses: actions/cache@v2
  with:
    path: |
      C:/Program Files/LLVM
      ./llvm
    key: llvm-3.5
- name: Install LLVM and Clang
  uses: KyleMayes/install-llvm-action@v1
  with:
    version: "3.5"
    cached: ${{ steps.cache-llvm.outputs.cache-hit }}
```

**Note:** Based on some benchmarks on a GitHub Actions Ubuntu runner, an uncached install of the LLVM and Clang binaries using this action takes about 60 seconds but a cached install takes only about 20 seconds.

## Linking to Installed Libraries (Linux)

If your build system requires a library from the installed LLVM and Clang binaries such as `libclang.so`, and it fails to find it, then it may help to create a symlink for the versioned `.so` using the following step which utilizes the `LLVM_PATH` environment variable set by this action:

```yaml
- name: Symlink libclang.so (Linux)
  if: contains(matrix.os, 'ubuntu')
  run: sudo ln -s libclang-11.so.1 /lib/x86_64-linux-gnu/libclang.so
  working-directory: ${{ env.LLVM_PATH }}/lib
```
