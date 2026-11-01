# JSON Column CSV Blob

[![npm version](https://img.shields.io/npm/v/json-column-csv-blob.svg)](https://www.npmjs.com/package/json-column-csv-blob)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

A small, UI-independent **TypeScript** utility for generating downloadable CSV `Blob` values from JavaScript object arrays. Uses [Papa Parse](https://www.papaparse.com/) to quote and escape CSV cell contents.

## Features

- A simple `getCSVBlob(data)` function compatible with the original package API
- CSV headers inferred from object keys and CRLF line endings
- Handles commas, quotes, and newlines via Papa Parse
- Optional spreadsheet formula escaping and UTF-8 BOM
- CommonJS, ES modules, and TypeScript declaration builds
- No React or Next.js dependency

## Requirements

A JavaScript runtime with the standard `Blob` API. Browsers support Blob; modern Node.js versions also provide it.

## Installation

```bash
npm install json-column-csv-blob
```

## Usage

```ts
import { getCSVBlob } from 'json-column-csv-blob';

const blob = getCSVBlob([
  { name: 'Alice', department: 'Finance', score: 12 },
  { name: 'Bob', department: 'Operations', score: 15 },
]);

// `blob` can be uploaded, read, or downloaded by a browser UI.
const csvText = await blob.text();
console.log(csvText);
```

### Download the CSV in a browser

Use this function **inside a user-initiated event handler** (for example, a native HTML button click):

```ts
import { getCSVBlob } from 'json-column-csv-blob';

function downloadCsv(): void {
  const blob = getCSVBlob([{ id: 1, name: 'Alice' }]);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'report.csv';
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
```

### Optional CSV safety settings

```ts
const blob = getCSVBlob(
  [{ name: 'Alice', formulaLikeValue: '=1+1' }],
  { escapeFormulae: true, includeBOM: true },
);
```

`escapeFormulae: true` escapes cell values that spreadsheet applications could interpret as formulas; enable it when exporting **untrusted data**. It is opt-in to preserve the behavior of the previous public API. `includeBOM: true` adds a UTF-8 BOM for spreadsheet compatibility.

### Complex or nested values

This package passes values to Papa Parse as in the original implementation. To export arrays or nested objects predictably, first convert those fields to strings:

```ts
const records = [
  { id: 1, tags: JSON.stringify(['red', 'blue']), metadata: JSON.stringify({ active: true }) },
];
const blob = getCSVBlob(records, { escapeFormulae: true });
```

## API

| Export | Description |
| --- | --- |
| `getCSVBlob(data, options?)` | Returns a CSV `Blob` |
| `CSVRow` | `Record<string, unknown>` |
| `CSVBlobOptions` | Optional `escapeFormulae` and `includeBOM` flags |

`getCSVBlob` does not create a button or automatically initiate a download.

## Local development

```bash
git clone https://github.com/huachenlihx/json-column-csv-blob.git
cd json-column-csv-blob
npm install
npm run typecheck
npm test
npm run test:coverage
npm run build
npm pack --dry-run
```

`npm install` generates an up-to-date lockfile. Commit the generated `package-lock.json` for reproducible local builds.

## Unit tests

Vitest tests cover CSV headers, row values, quoted commas/newlines/double quotes, empty inputs, `Blob` type, BOM, formula escaping, and input immutability.

## Accessibility (WCAG)

**This package has no rendered user interface.** Therefore, WCAG-specific focus, ARIA, contrast, and keyboard rules do not directly apply to its CSV-generation function. The *application that triggers the download* should provide an accessible native button or link, a clear accessible name, visible focus, keyboard operability, and user feedback where appropriate. CSV output should also use descriptive column headings. The library itself does not claim WCAG conformance.

## Repository and issues

- [Source code](https://github.com/huachenlihx/json-column-csv-blob)
- [Report an issue](https://github.com/huachenlihx/json-column-csv-blob/issues)

## License

MIT © 2026 Hua Chen
