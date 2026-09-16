"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  avgForAssessment,
  scoreCount,
} from "@/lib/analytics-utils";
import {
  loadAssessments,
  loadResults,
  saveAssessments,
} from "@/lib/class-store";
import { CLASSES } from "@/lib/messages";
import {
  DEMO_CLASSES,
  DEMO_STUDENTS,
  type Assessment,
} from "@/lib/mock-data";

export default function ClassDetailPage() {
  const params = useParams();
  const classId = String(params.classId ?? "");
  const classroom = DEMO_CLASSES.find((c) => c.id === classId);
  const students = DEMO_STUDENTS.filter((s) => s.class_id === classId);

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState(loadResults);
  const [hydrated, setHydrated] = useState(false);
  const [title, setTitle] = useState("Quiz 3");
  const [topic, setTopic] = useState("Photosynthesis");
  const [maxScore, setMaxScore] = useState("25");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    setAssessments(loadAssessments());
    setResults(loadResults());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveAssessments(assessments);
  }, [assessments, hydrated]);

  const classAssessments = useMemo(
    () =>
      assessments
        .filter((a) => a.class_id === classId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [assessments, classId],
  );

  if (!classroom) {
    return (
      <div className="mx-auto max-w-5xl py-12 text-sm text-[var(--ink-muted)]">
        Class not found.{" "}
        <Link href="/classes" className="text-[var(--brand)] underline">
          Back to My Classes
        </Link>
      </div>
    );
  }

  function createAssessment() {
    const max = Number(maxScore) || 25;
    const next: Assessment = {
      id: `a${Date.now()}`,
      class_id: classId,
      title: title.trim() || "Untitled quiz",
      topic: topic.trim() || "General",
      max_score: max,
      date,
      status: "open",
    };
    setAssessments((prev) => [next, ...prev]);
  }

  return (
    <div className="mx-auto max-w-5xl fade-in">
      <header className="mb-6">
        <p className="text-xs text-[var(--ink-faint)]">
          <Link href="/classes" className="hover:underline">
            {CLASSES.title}
          </Link>{" "}
          / {classroom.name}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          {classroom.name}
        </h1>
        <p className="mt-1 text-[var(--ink-muted)]">
          {students.length} students (codes only in score entry) ·{" "}
          {classroom.academic_year}
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="surface p-5">
          <h2 className="font-semibold">{CLASSES.assessmentsTitle}</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            {CLASSES.assessmentsHint}
          </p>
          <ul className="mt-4 space-y-3">
            {classAssessments.map((a) => {
              const n = scoreCount(results, a.id);
              const avg = avgForAssessment(results, a.id);
              return (
                <li key={a.id}>
                  <Link
                    href={`/classes/${classId}/assessments/${a.id}`}
                    className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--line)] px-4 py-3 transition-colors hover:border-[var(--brand)]"
                  >
                    <div>
                      <p className="font-semibold">{a.title}</p>
                      <p className="text-xs text-[var(--ink-muted)]">
                        {a.topic} · {a.date} · max {a.max_score}
                      </p>
                    </div>
                    <div className="text-right text-xs">
                      <span
                        className={`pill ${
                          n > 0
                            ? "bg-[var(--ok-soft)] text-[var(--ok)]"
                            : "bg-[var(--warn-soft)] text-[var(--warn)]"
                        }`}
                      >
                        {n > 0 ? `${n} scores` : "No scores"}
                      </span>
                      {avg != null && (
                        <p className="mt-1 font-mono text-[var(--ink-muted)]">
                          avg {avg}%
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
            {classAssessments.length === 0 && (
              <li className="text-sm text-[var(--ink-muted)]">
                No assessments yet — create one to enter results.
              </li>
            )}
          </ul>
        </section>

        <section className="surface p-5">
          <h2 className="font-semibold">{CLASSES.createAssessment}</h2>
          <div className="mt-4 grid gap-3">
            <div className="field">
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="field">
              <label>Topic</label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
            <div className="field">
              <label>Max score</label>
              <input
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                inputMode="numeric"
              />
            </div>
            <div className="field">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={createAssessment}
            >
              Create assessment
            </button>
          </div>
          <p className="mt-4 text-xs text-[var(--ink-faint)]">
            After scoring Quiz 1 and Quiz 2, open{" "}
            <Link href="/analytics" className="underline">
              Teaching Method Impact
            </Link>{" "}
            and link them — no re-upload needed.
          </p>
        </section>
      </div>
    </div>
  );
}
