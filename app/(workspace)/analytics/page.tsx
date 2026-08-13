"use client";

import { useState } from "react";
import { GRADE_TRENDS, METHOD_COMPARISONS } from "@/lib/mock-data";
import { ANALYTICS } from "@/lib/messages";

export default function AnalyticsPage() {
  const [mapped, setMapped] = useState(false);
  const [columns, setColumns] = useState({
    code: "StudentID",
    topic: "Unit",
    score: "Percent",
  });
  const maxAvg = Math.max(...GRADE_TRENDS.map((g) => g.avg));

  return (
    <div className="mx-auto max-w-5xl fade-in">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {ANALYTICS.title}
        </h1>
        <p className="mt-1 text-[var(--ink-muted)]">{ANALYTICS.subtitle}</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface p-5">
          <h2 className="font-semibold">{ANALYTICS.upload}</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            Flexible mapper accepts grades from any CSV source.
          </p>
          <div className="mt-4 grid gap-3">
            {(
              [
                ["code", "Student code column"],
                ["topic", "Topic column"],
                ["score", "Score column"],
              ] as const
            ).map(([key, label]) => (
              <div className="field" key={key}>
                <label>{label}</label>
                <input
                  value={columns[key]}
                  onChange={(e) =>
                    setColumns({ ...columns, [key]: e.target.value })
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setMapped(true)}
            >
              Apply mapping
            </button>
            {mapped && (
              <p className="text-sm text-[var(--ok)]">
                Mapped {columns.code} → code, {columns.topic} → topic,{" "}
                {columns.score} → score.
              </p>
            )}
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="font-semibold">Topic averages</h2>
          <div className="mt-6 flex h-44 items-end gap-3">
            {GRADE_TRENDS.map((g, i) => (
              <div key={g.topic} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="bar-grow w-full rounded-t-md bg-[var(--brand)]"
                  style={{
                    height: `${(g.avg / maxAvg) * 100}%`,
                    animationDelay: `${i * 80}ms`,
                  }}
                  title={`${g.avg}%`}
                />
                <span className="text-center text-[11px] text-[var(--ink-muted)]">
                  {g.topic}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="font-semibold">{ANALYTICS.weakAreas}</h2>
          <ul className="mt-3 space-y-2">
            <li className="rounded-[var(--radius-sm)] bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]">
              Food chains · class avg 61% · below school band
            </li>
            <li className="rounded-[var(--radius-sm)] bg-[var(--warn-soft)] px-3 py-2 text-sm text-[var(--warn)]">
              Photosynthesis · class avg 68% · watch list
            </li>
          </ul>
        </section>

        <section className="surface p-5">
          <h2 className="font-semibold">{ANALYTICS.methodTally}</h2>
          <p className="mt-1 text-xs text-[var(--ink-faint)]">
            Matching rule: same class + same topic.
          </p>
          <div className="mt-4 space-y-3">
            {METHOD_COMPARISONS.map((m) => (
              <div
                key={m.id}
                className="rounded-[var(--radius-sm)] border border-[var(--line)] p-3"
              >
                <p className="font-semibold">{m.pedagogy}</p>
                <p className="text-xs text-[var(--ink-muted)]">
                  {m.className} · {m.topic}
                </p>
                {m.status === "complete" ? (
                  <p className="mt-2 text-sm">
                    <span className="font-mono">{m.before}%</span>
                    {" → "}
                    <span className="font-mono font-semibold text-[var(--ok)]">
                      {m.after}%
                    </span>
                    <span className="ml-2 pill bg-[var(--ok-soft)] text-[var(--ok)]">
                      +{(m.after ?? 0) - m.before} pts
                    </span>
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-[var(--warn)]">
                    Baseline {m.before}% recorded — waiting for next matching
                    CSV.
                  </p>
                )}
                {m.status === "complete" && (
                  <button type="button" className="btn btn-secondary mt-3">
                    Generate plain-language report
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
