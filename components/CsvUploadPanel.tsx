"use client";

import { useId, useState } from "react";

export type CsvColumnField = {
  key: string;
  label: string;
  defaultValue: string;
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
  const [rowCount, setRowCount] = useState(0);
  const [status, setStatus] = useState<string | null>(null);

  async function onFileChange(file: File | null) {
    if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
    const nextHeaders = rows[0] ?? [];
    const dataRows = Math.max(0, rows.length - 1);
    setFileName(file.name);
    setHeaders(nextHeaders);
    setRowCount(dataRows);
    setStatus(null);

    // Auto-match columns when header names look similar
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
    if (!fileName || rowCount === 0) {
      setStatus("Choose a CSV file with at least one data row.");
      return;
    }
    const missing = fields.filter((f) => !mapping[f.key]);
    if (missing.length) {
      setStatus("Map every required column before importing.");
      return;
    }
    onImport({ fileName, mapping, rowCount });
    setStatus(`Imported ${rowCount} rows from ${fileName}.`);
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
              ? `${fileName} · ${rowCount} data rows`
              : "Student IDs only — no names in the file"}
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
            <label>{field.label}</label>
            {headers.length > 0 ? (
              <select
                value={mapping[field.key]}
                onChange={(e) =>
                  setMapping((m) => ({ ...m, [field.key]: e.target.value }))
                }
              >
                <option value="">Select column…</option>
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
