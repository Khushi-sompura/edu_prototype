"use client";

import { useState } from "react";
import { CsvUploadPanel } from "@/components/CsvUploadPanel";
import { ENGAGEMENT_STRATEGIES } from "@/lib/mock-data";
import { ENGAGEMENT } from "@/lib/messages";

export default function EngagementPage() {
  const [strategy, setStrategy] = useState(ENGAGEMENT_STRATEGIES[0].id);
  const [energy, setEnergy] = useState(7);
  const [logs, setLogs] = useState(
    ENGAGEMENT_STRATEGIES.map((s) => ({ ...s, samples: 8 })),
  );
  const [importNote, setImportNote] = useState<string | null>(null);

  function logToday() {
    setLogs((prev) =>
      prev.map((s) =>
        s.id === strategy
          ? {
              ...s,
              samples: s.samples + 1,
              avg: Number(
                ((s.avg * s.samples + energy) / (s.samples + 1)).toFixed(1),
              ),
            }
          : s,
      ),
    );
  }

  const max = Math.max(...logs.map((l) => l.avg), 1);

  return (
    <div className="mx-auto max-w-5xl fade-in">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {ENGAGEMENT.title}
        </h1>
        <p className="mt-1 text-[var(--ink-muted)]">{ENGAGEMENT.subtitle}</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface p-5">
          <h2 className="font-semibold">Today&apos;s check-in</h2>
          <div className="mt-4 grid gap-3">
            <div className="field">
              <label>Strategy used</label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
              >
                {ENGAGEMENT_STRATEGIES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Class energy 0–10: {energy}</label>
              <input
                type="range"
                min={0}
                max={10}
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={logToday}>
              Log (≈30 seconds)
            </button>
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="font-semibold">Strategy trends</h2>
          <div className="mt-5 space-y-3">
            {logs
              .slice()
              .sort((a, b) => b.avg - a.avg)
              .map((s, i) => (
                <div key={s.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{s.label}</span>
                    <span className="font-mono font-semibold">{s.avg}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--bg)]">
                    <div
                      className="bar-grow h-full rounded-full bg-[var(--brand)]"
                      style={{
                        width: `${(s.avg / max) * 100}%`,
                        transformOrigin: "left",
                        animationDelay: `${i * 70}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
          {importNote && (
            <p className="mt-4 text-sm text-[var(--brand-deep)]">{importNote}</p>
          )}
          <p className="mt-4 text-sm text-[var(--ink-muted)]">
            Insight: chorus responding leads lecture by a wide margin this month.
          </p>
          <button type="button" className="btn btn-secondary mt-3">
            Export PD report
          </button>
        </section>

        <div className="lg:col-span-2">
          <CsvUploadPanel
            title={ENGAGEMENT.csvTitle}
            hint={ENGAGEMENT.csvHint}
            sampleHint={ENGAGEMENT.csvSample}
            fields={[
              { key: "date", label: "Date column", defaultValue: "Date" },
              {
                key: "strategy",
                label: "Strategy column",
                defaultValue: "Strategy",
              },
              {
                key: "energy",
                label: "Energy column (0–10)",
                defaultValue: "Energy",
              },
              {
                key: "class",
                label: "Class code column",
                defaultValue: "ClassCode",
              },
            ]}
            onImport={({ fileName, mapping, rowCount }) => {
              setLogs((prev) =>
                prev.map((s, i) => ({
                  ...s,
                  samples: s.samples + Math.max(1, Math.floor(rowCount / 4)),
                  avg: Number(
                    Math.min(
                      10,
                      Math.max(2, s.avg + (i % 2 === 0 ? 0.3 : -0.1)),
                    ).toFixed(1),
                  ),
                })),
              );
              setImportNote(
                `Mapped ${mapping.strategy}/${mapping.energy} from ${fileName} (${rowCount} rows). Trends updated.`,
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
