# Changelog

All notable changes to this project will be documented in this file.

## pandoc-wasm (development version)

### Organisation

This repository has been migrated to the pandoc-wasm package at https://github.com/pandoc/pandoc-wasm.

### Major Changes

This is a complete rewrite of the package to use the **official Pandoc WASM binary** distributed by the Pandoc project, instead of compiling WASM independently.

### Added

- **Simplified API**: `convert(options, stdin, files)` function that uses Pandoc's default file format for options
- **Query API**: `query(options)` function to query pandoc information (version, formats, extensions, etc.)
- Support for warnings output from pandoc
- Better file handling with explicit files object
- ES modules support throughout the package
- **Media extraction**: The `convert()` API now returns extracted media files in a `mediaFiles` object (dictionary), similar to the legacy `pandoc()` API but it uses a plain JavaScript object instead of a Map.

### Changed

- **Breaking**: Updated to Pandoc 3.9 (from 3.7.0.1) - package version is 1.0.0
- **Breaking**: Package now uses ES modules (`type: "module"`)
- **Breaking**: Main API changed from command-line string arguments to options object
- **Breaking**: Files are now passed as an object (not array) with filename keys
- **Breaking**: Return format changed to include `stdout`, `stderr`, `warnings`, and `files`
- Package no longer requires building/compiling WASM - uses official binary instead
- Improved error handling and logging

### Deprecated

- Legacy `pandoc(args_str, inData, resources)` API is maintained for backward compatibility but not recommended for new code

### Removed

- Custom Haskell compilation process
- Patches that were needed for earlier WASM compilation

### Migration Guide

#### Old API (still supported for backward compatibility):

```javascript
import { pandoc } from "pandoc-wasm";

const output = await pandoc("-f markdown -t html -s", markdownContent, [
  { filename: "image.png", contents: imageBlob },
]);
console.log(output.out);
```

#### New API (recommended):

```javascript
import { convert } from "pandoc-wasm";

const options = {
  from: "markdown",
  to: "html",
  standalone: true,
};

const files = {
  "image.png": imageBlob,
};

const result = await convert(options, markdownContent, files);
console.log(result.stdout);
console.log(result.warnings); // Access structured warnings
```

#### Querying Pandoc:

```javascript
import { query } from "pandoc-wasm";

const version = await query({ query: "version" });
const formats = await query({ query: "input-formats" });
const extensions = await query({
  query: "extensions-for-format",
  format: "markdown",
});
```
