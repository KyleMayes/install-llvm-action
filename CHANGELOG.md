## [2.0.0] - 2024-03-31

### Migrating from v1

- Support for LLVM and Clang 3.5 through 7.0 has been removed (use 7.1 or later)
- The `download-url` input has been renamed to `mirror-url`
- The `force-version` and `ubuntu-version` inputs have been replaced with the `force-url` input

### Other Changes

- Added `arch` input
- Added support for various missing LLVM and Clang versions up to 18.1.2
