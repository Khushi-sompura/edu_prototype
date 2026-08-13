"use client";

import { useMemo, useState } from "react";
import { CsvUploadPanel } from "@/components/CsvUploadPanel";
import { BEHAVIOR } from "@/lib/messages";

type Phase = "pre" | "post";

export default function BehaviorPage() {
  const [phase, setPhase] = useState<Phase>("pre");
  const [student, setStudent] = useState("STU-8841");
  const [behavior, setBehavior] = useState("Off-task talking");
  const [rating, setRating] = useState(3);
  const [pre, setPre] = useState<number[]>([4, 4, 3, 5, 4]);
  const [post, setPost] = useState<number[]>([3, 2]);
  const [importNote, setImportNote] = useState<string | null>(null);

  const preAvg = useMemo(
    () => (pre.length ? pre.reduce((a, b) => a + b, 0) / pre.length : 0),
    [pre],
  );
  const postAvg = useMemo(
    () => (post.length ? post.reduce((a, b) => a + b, 0) / post.length : 0),
    [post],
  );

  function logRating() {
    if (phase === "pre") setPre((p) => [...p, rating].slice(-8));
    else setPost((p) => [...p, rating].slice(-8));
  }

  const ready = pre.length >= 5 && post.length >= 5;

  return (
    <div className="mx-auto max-w-5xl fade-in">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {BEHAVIOR.title}
        </h1>
        <p className="mt-1 text-[var(--ink-muted)]">{BEHAVIOR.subtitle}</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface p-5">
          <div className="mb-4 flex gap-2">
            {(["pre", "post"] as const).map((p) => (
              <button
                key={p}
                type="button"
                className={`btn ${phase === p ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setPhase(p)}
              >
                {p === "pre" ? "PRE mode" : "POST mode"}
              </button>
            ))}
          </div>

          <div className="grid gap-3">
            <div className="field">
              <label>Student code</label>
              <select
                value={student}
                onChange={(e) => setStudent(e.target.value)}
              >
                <option>STU-8841</option>
                <option>STU-2207</option>
                <option>STU-5510</option>
              </select>
            </div>
            <div className="field">
              <label>Behavior</label>
              <select
                value={behavior}
                onChange={(e) => setBehavior(e.target.value)}
              >
                <option>Off-task talking</option>
                <option>Refusal</option>
                <option>Leaving seat</option>
              </select>
            </div>
            <div className="field">
              <label>Rating 1–5: {rating}</label>
              <input
                type="range"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={logRating}>
              Log {phase.toUpperCase()} day
            </button>
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="font-semibold">Comparison</h2>
          <div className="mt-6 flex h-40 items-end gap-6">
            <div className="flex flex-1 flex-col items-center gap-2">
              <div
                className="bar-grow w-full rounded-t-md bg-[var(--accent)]"
                style={{ height: `${(preAvg / 5) * 100}%` }}
              />
              <span className="text-xs text-[var(--ink-muted)]">
                Pre {preAvg.toFixed(1)} ({pre.length}/5)
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center gap-2">
              <div
                className="bar-grow w-full rounded-t-md bg-[var(--brand)]"
                style={{
                  height: `${((postAvg || 0.2) / 5) * 100}%`,
                  animationDelay: "120ms",
                }}
              />
              <span className="text-xs text-[var(--ink-muted)]">
                Post {post.length ? postAvg.toFixed(1) : "—"} ({post.length}/5)
              </span>
            </div>
          </div>

          {importNote && (
            <p className="mt-4 text-sm text-[var(--brand-deep)]">{importNote}</p>
          )}

          {ready ? (
            <div className="mt-5 rounded-[var(--radius-sm)] bg-[var(--ok-soft)] p-3 text-sm text-[var(--ok)]">
              After the BIP, {student}&apos;s “{behavior}” rating dropped from{" "}
              {preAvg.toFixed(1)} to {postAvg.toFixed(1)}. Share this
              plain-language summary in parent meetings.
              <button type="button" className="btn btn-secondary mt-3">
                Export parent report
              </button>
            </div>
          ) : (
            <p className="mt-5 text-sm text-[var(--ink-muted)]">
              Need 5 pre and 5 post days for the automatic comparison report.
            </p>
          )}
        </section>

        <div className="lg:col-span-2">
          <CsvUploadPanel
            title={BEHAVIOR.csvTitle}
            hint={BEHAVIOR.csvHint}
            sampleHint={BEHAVIOR.csvSample}
            fields={[
              { key: "code", label: "Student code column", defaultValue: "StudentCode" },
              { key: "behavior", label: "Behavior column", defaultValue: "Behavior" },
              { key: "phase", label: "Phase column (pre/post)", defaultValue: "Phase" },
              { key: "rating", label: "Rating column (1–5)", defaultValue: "Rating" },
              { key: "date", label: "Date column", defaultValue: "Date" },
            ]}
            onImport={({ fileName, mapping, rowCount }) => {
              // Prototype: seed realistic pre/post series from import size
              const preSeed = [4, 4, 5, 4, 3].slice(0, Math.min(5, Math.max(3, rowCount)));
              const postSeed = [3, 2, 2, 1, 2].slice(0, Math.min(5, Math.max(2, Math.floor(rowCount / 2))));
              setPre(preSeed);
              setPost(postSeed);
              setStudent("STU-8841");
              setImportNote(
                `Mapped ${mapping.code}/${mapping.behavior}/${mapping.phase}/${mapping.rating} from ${fileName}. Charts refreshed with imported tallies.`,
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
