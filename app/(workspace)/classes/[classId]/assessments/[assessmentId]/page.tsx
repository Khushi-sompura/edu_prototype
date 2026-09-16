"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CsvUploadPanel } from "@/components/CsvUploadPanel";
import { avgForAssessment, pct } from "@/lib/analytics-utils";
import {
  loadAssessments,
  loadResults,
  saveAssessments,
  saveResults,
  syncExperimentsAfterScoring,
  loadExperiments,
  saveExperiments,
} from "@/lib/class-store";
import { CLASSES } from "@/lib/messages";
import {
  DEMO_CLASSES,
  DEMO_STUDENTS,
  type Assessment,
  type Performance,
} from "@/lib/mock-data";

export default function EnterResultsPage() {
  const params = useParams();
  const classId = String(params.classId ?? "");
  const assessmentId = String(params.assessmentId ?? "");

  const classroom = DEMO_CLASSES.find((c) => c.id === classId);
  const students = useMemo(
    () => DEMO_STUDENTS.filter((s) => s.class_id === classId),
    [classId],
  );

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<Performance[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<"manual" | "csv">("manual");
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [note, setNote] = useState<string | null>(null);

  const assessment = assessments.find((a) => a.id === assessmentId);

  useEffect(() => {
    const a = loadAssessments();
    const r = loadResults();
    setAssessments(a);
    setResults(r);
    const current = a.find((x) => x.id === assessmentId);
    const nextDraft: Record<string, string> = {};
    for (const s of DEMO_STUDENTS.filter((st) => st.class_id === classId)) {
      const existing = r.find(
        (row) =>
          row.assessment_id === assessmentId && row.student_id === s.id,
      );
      nextDraft[s.id] = existing ? String(existing.score) : "";
    }
    setDraft(nextDraft);
    setHydrated(true);
  }, [assessmentId, classId]);

  const classResults = useMemo(
    () => results.filter((r) => r.assessment_id === assessmentId),
    [results, assessmentId],
  );
  const avg = avgForAssessment(results, assessmentId);

  if (!classroom || !hydrated) {
    return (
      <div className="w-full py-12 text-sm text-[var(--ink-muted)]">
        Loading…
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="w-full py-12 text-sm text-[var(--ink-muted)]">
        Assessment not found.{" "}
        <Link href={`/classes/${classId}`} className="underline">
          Back
        </Link>
      </div>
    );
  }

  function persistResults(next: Performance[]) {
    setResults(next);
    saveResults(next);
    const updatedAssessments = assessments.map((a) =>
      a.id === assessmentId
        ? {
            ...a,
            status: (next.some((r) => r.assessment_id === assessmentId)
              ? "scored"
              : "open") as Assessment["status"],
          }
        : a,
    );
    setAssessments(updatedAssessments);
    saveAssessments(updatedAssessments);
    const exps = syncExperimentsAfterScoring(
      loadExperiments(),
      next,
      assessmentId,
    );
    saveExperiments(exps);
  }

  function saveManual() {
    const max = assessment!.max_score;
    const kept = results.filter((r) => r.assessment_id !== assessmentId);
    const created: Performance[] = [];
    for (const s of students) {
      const raw = draft[s.id]?.trim();
      if (!raw) continue;
      const score = Number(raw);
      if (Number.isNaN(score)) continue;
      created.push({
        id: `pf${Date.now()}-${s.id}`,
        assessment_id: assessmentId,
        student_id: s.id,
        class_id: classId,
        score,
        max_score: max,
        date: assessment!.date,
        source: "manual",
      });
    }
    persistResults([...created, ...kept]);
    setNote(`Saved ${created.length} scores (student codes only).`);
  }

  function onCsvImport(payload: {
    fileName: string;
    mapping: Record<string, string>;
    rows: Record<string, string>[];
  }) {
    const codeCol = payload.mapping.code;
    const scoreCol = payload.mapping.score;
    const dateCol = payload.mapping.date;
    const max = assessment!.max_score;
    const byCode = Object.fromEntries(
      students.map((s) => [s.student_code.toLowerCase(), s]),
    );
    const kept = results.filter((r) => r.assessment_id !== assessmentId);
    const created: Performance[] = [];
    let matched = 0;
    let skipped = 0;
    for (const row of payload.rows) {
      const code = (row[codeCol] ?? "").trim().toLowerCase();
      const score = Number(row[scoreCol]);
      const date =
        (dateCol ? row[dateCol] : "")?.trim() || assessment!.date;
      const student = byCode[code];
      if (!student || Number.isNaN(score)) {
        skipped += 1;
        continue;
      }
      matched += 1;
      created.push({
        id: `pf${Date.now()}-${matched}`,
        assessment_id: assessmentId,
        student_id: student.id,
        class_id: classId,
        score,
        max_score: max,
        date,
        source: "csv",
      });
    }
    const nextDraft = { ...draft };
    for (const row of created) {
      nextDraft[row.student_id] = String(row.score);
    }
    setDraft(nextDraft);
    persistResults([...created, ...kept]);
    setNote(
      `Imported ${matched} scores from ${payload.fileName}` +
        (skipped ? ` · skipped ${skipped}` : "") +
        `. Stored under this assessment — available to Method Impact.`,
    );
    setMode("manual");
  }

  return (
    <div className="w-full fade-in">
      <header className="mb-6">
        <p className="text-xs text-[var(--ink-faint)]">
          <Link href="/classes" className="hover:underline">
            {CLASSES.title}
          </Link>{" "}
          /{" "}
          <Link href={`/classes/${classId}`} className="hover:underline">
            {classroom.name}
          </Link>{" "}
          / {assessment.title}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          {CLASSES.enterResults}
        </h1>
        <p className="mt-1 text-[var(--ink-muted)]">
          {assessment.title} · {assessment.topic} · max {assessment.max_score} ·{" "}
          {assessment.date}
        </p>
        <p className="mt-2 text-xs text-[var(--ink-faint)]">
          {CLASSES.privacyCodesOnly}
          {avg != null ? ` · Current average ${avg}%` : ""} ·{" "}
          {classResults.length} scores saved
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          className={`btn ${mode === "manual" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setMode("manual")}
        >
          {CLASSES.manualEntry}
        </button>
        <button
          type="button"
          className={`btn ${mode === "csv" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setMode("csv")}
        >
          {CLASSES.csvUpload}
        </button>
        <Link href="/analytics" className="btn btn-ghost">
          View Method Impact →
        </Link>
      </div>

      {mode === "manual" ? (
        <section className="surface p-5">
          <h2 className="font-semibold">{CLASSES.manualEntry}</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            Enter points out of {assessment.max_score}. Names are not shown here
            for privacy.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-xs text-[var(--ink-muted)]">
                  <th className="py-2 pr-3 font-medium">Student code</th>
                  <th className="py-2 pr-3 font-medium">
                    Score / {assessment.max_score}
                  </th>
                  <th className="py-2 font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const scoreNum = Number(draft[s.id]);
                  const showPct =
                    draft[s.id]?.trim() && !Number.isNaN(scoreNum)
                      ? pct(scoreNum, assessment.max_score)
                      : null;
                  return (
                    <tr key={s.id} className="border-b border-[var(--line)]">
                      <td className="py-2 pr-3 font-mono font-semibold">
                        {s.student_code}
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          className="w-28 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-elevated)] px-2 py-1.5 font-mono text-sm outline-none focus:border-[var(--brand)]"
                          value={draft[s.id] ?? ""}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              [s.id]: e.target.value,
                            }))
                          }
                          inputMode="decimal"
                          placeholder="e.g. 18"
                        />
                      </td>
                      <td className="py-2 font-mono text-[var(--ink-muted)]">
                        {showPct != null ? `${showPct}%` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="btn btn-primary mt-4"
            onClick={saveManual}
          >
            Save results
          </button>
        </section>
      ) : (
        <CsvUploadPanel
          title={CLASSES.csvUpload}
          hint={CLASSES.csvHint}
          sampleHint={CLASSES.csvSample}
          fields={[
            {
              key: "code",
              label: "Student code column",
              defaultValue: "StudentCode",
            },
            { key: "score", label: "Score column", defaultValue: "Score" },
            {
              key: "date",
              label: "Date column",
              defaultValue: "Date",
              optional: true,
            },
          ]}
          onImport={onCsvImport}
        />
      )}

      {note && (
        <p className="mt-4 text-sm text-[var(--ok)]" role="status">
          {note}
        </p>
      )}
    </div>
  );
}
