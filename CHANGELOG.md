## [2.0.9] - 2026-01-20

- Added support for additional LLVM and Clang 20/21 versions

## [2.0.8] - 2025-10-09

- Added support for LLVM and Clang 21 (for platforms with binaries available)

## [2.0.7] - 2025-05-02

- Added support for LLVM and Clang 20 (and some more 18 and 19 versions)

## [2.0.6] - 2025-02-24

- Added support for LLVM and Clang 19

## [2.0.5] - 2024-09-08

- Added support for LLVM and Clang 18.1.8 on ARM64 macOS

## [2.0.4] - 2024-08-11

- Added support up to LLVM and Clang 18.1.8 (for platforms with binaries available)

## [2.0.3] - 2024-05-26

- Added support up to LLVM and Clang 18.1.6 (for platforms with binaries available)

## [2.0.2] - 2024-04-09

- Added support up to LLVM and Clang 18.1.3 (for platforms with binaries available)

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
