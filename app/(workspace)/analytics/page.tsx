"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  avgForAssessment,
  buildMethodImpact,
  studentBreakdown,
  topicAverages,
} from "@/lib/analytics-utils";
import {
  loadAssessments,
  loadExperiments,
  loadResults,
  saveExperiments,
} from "@/lib/class-store";
import { ANALYTICS } from "@/lib/messages";
import {
  DEMO_CLASSES,
  DEMO_SCHOOL,
  DEMO_STUDENTS,
  DEMO_TEACHER,
  PEDAGOGY_MODES,
  type Assessment,
  type Performance,
  type TeachingMethodExperiment,
} from "@/lib/mock-data";

export default function AnalyticsPage() {
  const [classId, setClassId] = useState(DEMO_CLASSES[0].id);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<Performance[]>([]);
  const [experiments, setExperiments] = useState<TeachingMethodExperiment[]>(
    [],
  );
  const [hydrated, setHydrated] = useState(false);
  const [selectedExpId, setSelectedExpId] = useState<string | null>("exp1");
  const [method, setMethod] = useState("Cooperative Learning");
  const [beforeId, setBeforeId] = useState("");
  const [afterId, setAfterId] = useState("");
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    setAssessments(loadAssessments());
    setResults(loadResults());
    const exps = loadExperiments();
    setExperiments(exps);
    setHydrated(true);
  }, []);

  // Refresh when returning from score entry
  useEffect(() => {
    if (!hydrated) return;
    const onFocus = () => {
      setAssessments(loadAssessments());
      setResults(loadResults());
      setExperiments(loadExperiments());
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveExperiments(experiments);
  }, [experiments, hydrated]);

  const classNameById = useMemo(
    () => Object.fromEntries(DEMO_CLASSES.map((c) => [c.id, c.name])),
    [],
  );

  const classAssessments = useMemo(
    () =>
      assessments
        .filter((a) => a.class_id === classId)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [assessments, classId],
  );

  const scoredAssessments = useMemo(
    () =>
      classAssessments.filter((a) =>
        results.some((r) => r.assessment_id === a.id),
      ),
    [classAssessments, results],
  );

  useEffect(() => {
    if (scoredAssessments.length >= 1 && !beforeId) {
      setBeforeId(scoredAssessments[0].id);
    }
    if (scoredAssessments.length >= 2 && !afterId) {
      setAfterId(scoredAssessments[1].id);
    }
  }, [scoredAssessments, beforeId, afterId]);

  const impactRows = useMemo(
    () =>
      buildMethodImpact(experiments, results, assessments, classNameById),
    [experiments, results, assessments, classNameById],
  );

  const topics = useMemo(
    () => topicAverages(results, assessments, classId),
    [results, assessments, classId],
  );
  const maxAvg = Math.max(1, ...topics.map((t) => t.avg));

  const selectedExp = experiments.find((e) => e.id === selectedExpId) ?? null;
  const selectedImpact = impactRows.find(
    (r) => r.experiment.id === selectedExpId,
  );
  const drillStudents = selectedExp
    ? studentBreakdown(results, DEMO_STUDENTS, selectedExp)
    : [];

  function createExperiment() {
    if (!beforeId) {
      setNote("Select a before assessment that already has scores.");
      return;
    }
    const before = assessments.find((a) => a.id === beforeId);
    const after = afterId ? assessments.find((a) => a.id === afterId) : null;
    if (afterId && afterId === beforeId) {
      setNote("Before and after assessments must be different.");
      return;
    }
    const hasAfterScores =
      afterId && results.some((r) => r.assessment_id === afterId);
    const id = `exp${Date.now()}`;
    const next: TeachingMethodExperiment = {
      id,
      class_id: classId,
      topic: before?.topic ?? "Topic",
      method,
      before_assessment_id: beforeId,
      after_assessment_id: afterId || null,
      status: hasAfterScores ? "complete" : "waiting_for_next_quiz",
    };
    setExperiments((prev) => [next, ...prev]);
    setSelectedExpId(id);
    setNote(
      hasAfterScores
        ? `Complete: compared ${before?.title} → ${after?.title} using existing scores (no re-upload).`
        : `Waiting for next quiz: ${before?.title} linked. Enter the next quiz under My Classes, then link it here.`,
    );
  }

  function linkAfter(expId: string, assessmentId: string) {
    const hasScores = results.some((r) => r.assessment_id === assessmentId);
    setExperiments((prev) =>
      prev.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              after_assessment_id: assessmentId,
              status: hasScores
                ? ("complete" as const)
                : ("waiting_for_next_quiz" as const),
            }
          : exp,
      ),
    );
    setNote(
      hasScores
        ? "After assessment linked — improvement calculated from existing results."
        : "After assessment linked but has no scores yet. Enter results under My Classes.",
    );
  }

  return (
    <div className="w-full fade-in">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {ANALYTICS.title}
        </h1>
        <p className="mt-1 text-[var(--ink-muted)]">{ANALYTICS.subtitle}</p>
        <p className="mt-3 text-xs text-[var(--ink-faint)]">
          {DEMO_SCHOOL.name} → {DEMO_TEACHER.name} · Scores come from{" "}
          <Link href="/classes" className="underline">
            My Classes → Assessments
          </Link>
          , not from re-uploading here.
        </p>
      </header>

      <div className="mb-5 rounded-[var(--radius)] border border-[var(--brand)] bg-[var(--brand-soft)] px-4 py-3 text-sm text-[var(--brand-deep)]">
        {ANALYTICS.workflowBanner}{" "}
        <Link href="/classes" className="font-semibold underline">
          Enter scores in My Classes →
        </Link>
      </div>

      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="field min-w-[200px]">
          <label>{ANALYTICS.classLabel}</label>
          <select value={classId} onChange={(e) => setClassId(e.target.value)}>
            {DEMO_CLASSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface p-5 lg:col-span-2">
          <h2 className="font-semibold">{ANALYTICS.impactTitle}</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            {ANALYTICS.impactHint}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-xs text-[var(--ink-muted)]">
                  <th className="py-2 pr-3 font-medium">Teaching Method</th>
                  <th className="py-2 pr-3 font-medium">Class</th>
                  <th className="py-2 pr-3 font-medium">Topic</th>
                  <th className="py-2 pr-3 font-medium">Before</th>
                  <th className="py-2 pr-3 font-medium">After</th>
                  <th className="py-2 font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                {impactRows.map((row) => {
                  const active = row.experiment.id === selectedExpId;
                  return (
                    <tr
                      key={row.experiment.id}
                      className={`cursor-pointer border-b border-[var(--line)] hover:bg-[var(--bg-elevated)] ${
                        active ? "bg-[var(--brand-soft)]" : ""
                      }`}
                      onClick={() => setSelectedExpId(row.experiment.id)}
                    >
                      <td className="py-2.5 pr-3 font-semibold">
                        {row.experiment.method}
                      </td>
                      <td className="py-2.5 pr-3 text-[var(--ink-muted)]">
                        {row.className}
                      </td>
                      <td className="py-2.5 pr-3">{row.experiment.topic}</td>
                      <td className="py-2.5 pr-3 font-mono">
                        {row.beforeLabel}
                        {row.before != null ? ` ${row.before}%` : ""}
                      </td>
                      <td className="py-2.5 pr-3 font-mono">
                        {row.after == null ? (
                          <span className="text-[var(--warn)]">Waiting</span>
                        ) : (
                          `${row.afterLabel} ${row.after}%`
                        )}
                      </td>
                      <td className="py-2.5">
                        {row.change != null ? (
                          <span className="pill bg-[var(--ok-soft)] text-[var(--ok)]">
                            {row.change >= 0 ? "+" : ""}
                            {row.change}
                          </span>
                        ) : (
                          <span className="pill bg-[var(--warn-soft)] text-[var(--warn)]">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="font-semibold">{ANALYTICS.drillTitle}</h2>
          <p className="mt-1 text-xs text-[var(--ink-faint)]">
            Class → Topic → Method → Students (codes only)
          </p>
          {selectedExp && selectedImpact ? (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm font-semibold">{selectedExp.topic}</p>
                <p className="text-xs text-[var(--ink-muted)]">
                  {selectedImpact.beforeLabel} → {selectedImpact.afterLabel} ·{" "}
                  {selectedExp.method}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-14 text-[var(--ink-muted)]">Before</span>
                  <div className="h-3 flex-1 rounded-sm bg-[var(--bg-elevated)]">
                    <div
                      className="h-3 rounded-sm bg-[var(--ink-faint)]"
                      style={{
                        width: `${selectedImpact.before ?? 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono">
                    {selectedImpact.before != null
                      ? `${selectedImpact.before}%`
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-14 text-[var(--ink-muted)]">After</span>
                  <div className="h-3 flex-1 rounded-sm bg-[var(--bg-elevated)]">
                    <div
                      className="bar-grow h-3 rounded-sm bg-[var(--brand)]"
                      style={{
                        width: `${selectedImpact.after ?? 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono font-semibold text-[var(--ok)]">
                    {selectedImpact.after != null
                      ? `${selectedImpact.after}%`
                      : "—"}
                  </span>
                </div>
              </div>
              {selectedImpact.change != null && (
                <p className="text-sm">
                  Improvement:{" "}
                  <span className="font-semibold text-[var(--ok)]">
                    {selectedImpact.change >= 0 ? "+" : ""}
                    {selectedImpact.change} pts
                  </span>
                </p>
              )}
              {selectedExp.status === "waiting_for_next_quiz" && (
                <div className="rounded-[var(--radius-sm)] bg-[var(--warn-soft)] px-3 py-2 text-sm text-[var(--warn)]">
                  <p className="mb-2">
                    Waiting for after assessment. Link a scored quiz or enter
                    results first.
                  </p>
                  <select
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg)] px-2 py-1.5 text-[var(--ink)]"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        linkAfter(selectedExp.id, e.target.value);
                      }
                    }}
                  >
                    <option value="">Link after assessment…</option>
                    {scoredAssessments
                      .filter((a) => a.id !== selectedExp.before_assessment_id)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.title} · {a.topic} ·{" "}
                          {avgForAssessment(results, a.id)}%
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--line)] text-[var(--ink-muted)]">
                      <th className="py-1.5 pr-2 font-medium">Student code</th>
                      <th className="py-1.5 pr-2 font-medium">Before</th>
                      <th className="py-1.5 pr-2 font-medium">After</th>
                      <th className="py-1.5 font-medium">Δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drillStudents.map((s) => (
                      <tr
                        key={s.student_code}
                        className="border-b border-[var(--line)]"
                      >
                        <td className="py-1.5 pr-2 font-mono">
                          {s.student_code}
                        </td>
                        <td className="py-1.5 pr-2 font-mono">
                          {s.before != null ? `${s.before}%` : "—"}
                        </td>
                        <td className="py-1.5 pr-2 font-mono">
                          {s.after != null ? `${s.after}%` : "—"}
                        </td>
                        <td className="py-1.5 font-mono">
                          {s.change != null
                            ? `${s.change >= 0 ? "+" : ""}${s.change}`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[var(--ink-muted)]">
              Select a row to drill down.
            </p>
          )}
        </section>

        <section className="surface p-5">
          <h2 className="font-semibold">{ANALYTICS.topicTitle}</h2>
          <div className="mt-6 flex h-44 items-end gap-3">
            {topics.length === 0 ? (
              <p className="text-sm text-[var(--ink-muted)]">
                No scored assessments for this class yet.
              </p>
            ) : (
              topics.map((g, i) => (
                <div
                  key={g.topic}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="bar-grow w-full rounded-t-md bg-[var(--brand)]"
                    style={{
                      height: `${(g.avg / maxAvg) * 100}%`,
                      animationDelay: `${i * 80}ms`,
                    }}
                  />
                  <span className="text-center text-[11px] text-[var(--ink-muted)]">
                    {g.topic}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="surface p-5 lg:col-span-2">
          <h2 className="font-semibold">{ANALYTICS.linkExperiment}</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            {ANALYTICS.linkExperimentHint}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="field">
              <label>Teaching method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                {PEDAGOGY_MODES.map((p) => (
                  <option key={p.id} value={p.label}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Before assessment</label>
              <select
                value={beforeId}
                onChange={(e) => setBeforeId(e.target.value)}
              >
                <option value="">Select…</option>
                {scoredAssessments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} · {a.topic} · {avgForAssessment(results, a.id)}%
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>After assessment (optional)</label>
              <select
                value={afterId}
                onChange={(e) => setAfterId(e.target.value)}
              >
                <option value="">Waiting / choose later</option>
                {scoredAssessments
                  .filter((a) => a.id !== beforeId)
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} · {a.topic} · {avgForAssessment(results, a.id)}%
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={createExperiment}
              >
                Create method comparison
              </button>
            </div>
          </div>
          {scoredAssessments.length < 1 && (
            <p className="mt-3 text-sm text-[var(--warn)]">
              No scored quizzes for this class.{" "}
              <Link href={`/classes/${classId}`} className="underline">
                Create an assessment and enter results
              </Link>{" "}
              first.
            </p>
          )}
          {note && (
            <p className="mt-3 text-sm text-[var(--ok)]" role="status">
              {note}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
