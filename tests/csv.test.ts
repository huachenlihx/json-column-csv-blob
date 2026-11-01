import { describe, expect, it } from 'vitest';
import { getCSVBlob } from '../index';

async function textOf(blob: Blob): Promise<string> {
  return await blob.text();
}

describe('getCSVBlob', () => {
  it('returns a CSV Blob with the expected content type', () => {
    const blob = getCSVBlob([{ id: 1 }]);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('text/csv;charset=utf-8');
  });

  it('serializes records with headers and CRLF line endings', async () => {
    const csv = await textOf(getCSVBlob([{ name: 'Alice', age: 27 }, { name: 'Bob', age: 31 }]));
    expect(csv).toBe('name,age\r\nAlice,27\r\nBob,31');
  });

  it('correctly quotes commas, double quotes, and line breaks', async () => {
    const csv = await textOf(getCSVBlob([{ label: 'Hello, "world"', note: 'line1\nline2' }]));
    expect(csv).toBe('label,note\r\n"Hello, ""world""","line1\nline2"');
  });

  it('handles empty arrays without throwing', async () => {
    expect(await textOf(getCSVBlob([]))).toBe('');
  });

  it('can prepend a UTF-8 BOM', async () => {
    const blob = getCSVBlob([{ name: 'Málaga' }], { includeBOM: true });
    const bytes = new Uint8Array(await blob.arrayBuffer());

    // UTF-8 BOM is EF BB BF; Blob.text() removes it when decoding.
    expect(Array.from(bytes.slice(0, 3))).toEqual([0xef, 0xbb, 0xbf]);
    expect(await blob.text()).toContain('Málaga');
  });

  it('escapes formula-like strings when requested', async () => {
    const csv = await textOf(getCSVBlob([{ value: '=1+1' }], { escapeFormulae: true }));
    expect(csv).toContain("'=1+1");
  });

  it('does not mutate input records', async () => {
    const row = Object.freeze({ name: 'Alice' });
    await textOf(getCSVBlob([row]));
    expect(row).toEqual({ name: 'Alice' });
  });
});
