import Papa from 'papaparse';

/** An individual CSV record. Keys become CSV column headers. */
export type CSVRow = Record<string, unknown>;

export interface CSVBlobOptions {
  /** Escape formula-like text when the CSV is opened in spreadsheet software. */
  escapeFormulae?: boolean;
  /** Add a UTF-8 byte-order mark for spreadsheet compatibility. */
  includeBOM?: boolean;
}

/**
 * Convert an array of objects into a CSV Blob.
 *
 * Preserves the original public API and Papa Parse cell serialization.
 * Nested arrays and objects are NOT JSON-normalized automatically.
 * To avoid spreadsheet formula injection when exporting untrusted values,
 * enable `escapeFormulae` (opt-in to preserve existing behavior).
 */
export function getCSVBlob(
  data: readonly CSVRow[],
  options: CSVBlobOptions = {},
): Blob {
  const csv = Papa.unparse([...data], {
    quotes: false,
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ',',
    header: true,
    newline: '\r\n',
    skipEmptyLines: false,
    escapeFormulae: options.escapeFormulae ?? false,
  });

  return new Blob([...(options.includeBOM ? ['\uFEFF'] : []), csv], {
    type: 'text/csv;charset=utf-8',
  });
}
