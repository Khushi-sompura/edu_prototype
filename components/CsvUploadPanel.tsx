"use client";

import { useId, useState } from "react";

export type CsvColumnField = {
  key: string;
  label: string;
  defaultValue: string;
  optional?: boolean;
};

type Props = {
  title: string;
  hint: string;
  fields: CsvColumnField[];
  sampleHint: string;
  onImport: (payload: {
    fileName: string;
    mapping: Record<string, string>;
    rowCount: number;
    rows: Record<string, string>[];
  }) => void;
};

function parseCsv(text: string): string[][] {
  return text
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.split(",").map((cell) => cell.trim()));
}

export function CsvUploadPanel({
  title,
  hint,
  fields,
  sampleHint,
  onImport,
}: Props) {
  const inputId = useId();
  const [mapping, setMapping] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.key, f.defaultValue])),
  );
  const [fileName, setFileName] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [dataRows, setDataRows] = useState<string[][]>([]);
  const [status, setStatus] = useState<string | null>(null);

  async function onFileChange(file: File | null) {
    if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
    const nextHeaders = rows[0] ?? [];
    const body = rows.slice(1);
    setFileName(file.name);
    setHeaders(nextHeaders);
    setDataRows(body);
    setStatus(null);

    setMapping((prev) => {
      const next = { ...prev };
      for (const field of fields) {
        const match = nextHeaders.find(
          (h) =>
            h.toLowerCase() === field.defaultValue.toLowerCase() ||
            h.toLowerCase() === field.key.toLowerCase() ||
            h.toLowerCase().includes(field.key.toLowerCase()),
        );
        if (match) next[field.key] = match;
      }
      return next;
    });
  }

  function applyImport() {
    if (!fileName || dataRows.length === 0) {
      setStatus("Choose a CSV file with at least one data row.");
      return;
    }
    const missing = fields.filter(
      (f) => !f.optional && !mapping[f.key],
    );
    if (missing.length) {
      setStatus("Map every required column before importing.");
      return;
    }

    const mappedRows = dataRows.map((cells) => {
      const obj: Record<string, string> = {};
      for (const h of headers) {
        const idx = headers.indexOf(h);
        obj[h] = cells[idx] ?? "";
      }
      return obj;
    });

    onImport({
      fileName,
      mapping,
      rowCount: dataRows.length,
      rows: mappedRows,
    });
    setStatus(`Imported ${dataRows.length} rows from ${fileName}.`);
  }

  return (
    <section className="surface p-5">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-[var(--ink-muted)]">{hint}</p>
      <p className="mt-2 text-xs text-[var(--ink-faint)]">{sampleHint}</p>

      <div className="mt-4 grid gap-3">
        <label
          htmlFor={inputId}
          className="flex cursor-pointer flex-col items-start gap-2 rounded-[var(--radius-sm)] border border-dashed border-[var(--line-strong)] bg-[var(--bg-elevated)] px-4 py-4 text-sm transition-colors hover:border-[var(--brand)]"
        >
          <span className="font-semibold text-[var(--brand-deep)]">
            {fileName ? "Replace CSV" : "Choose CSV file"}
          </span>
          <span className="text-[var(--ink-muted)]">
            {fileName
              ? `${fileName} · ${dataRows.length} data rows`
              : "UTF-8 CSV · map columns · store as Performance records"}
          </span>
          <input
            id={inputId}
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />
        </label>

        {fields.map((field) => (
          <div className="field" key={field.key}>
            <label>
              {field.label}
              {field.optional ? " (optional)" : ""}
            </label>
            {headers.length > 0 ? (
              <select
                value={mapping[field.key]}
                onChange={(e) =>
                  setMapping((m) => ({ ...m, [field.key]: e.target.value }))
                }
              >
                <option value="">
                  {field.optional ? "Not in file…" : "Select column…"}
                </option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={mapping[field.key]}
                onChange={(e) =>
                  setMapping((m) => ({ ...m, [field.key]: e.target.value }))
                }
                placeholder={field.defaultValue}
              />
            )}
          </div>
        ))}

        <button type="button" className="btn btn-primary" onClick={applyImport}>
          Import CSV
        </button>
        {status && (
          <p className="text-sm text-[var(--ok)]" role="status">
            {status}
          </p>
        )}
      </div>
    </section>
  );
}
