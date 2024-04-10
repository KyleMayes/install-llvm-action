## [2.0.2] - 2024-04-09

- Added support for LLVM and Clang 18.1.3 (for platforms with binaries available)

## [2.0.1] - 2024-04-02

### Fixes
- Fixed exact LLVM and Clang versions (e.g., `17.0.6`) causing the action to fail
- Fixed LLVM and Clang executables failing to run on ARM64 macOS runners

## [2.0.0] - 2024-03-31

### Migrating from v1

- Support for LLVM and Clang 3.5 through 7.0 has been removed (use 7.1 or later)
- The `download-url` input has been renamed to `mirror-url`
- The `force-version` and `ubuntu-version` inputs have been replaced with the `force-url` input

### Other Changes

- Added `arch` input
- Added support for various missing LLVM and Clang versions up to 18.1.2
