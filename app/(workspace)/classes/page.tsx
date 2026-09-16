"use client";

import Link from "next/link";
import { DEMO_CLASSES, DEMO_SCHOOL, DEMO_STUDENTS } from "@/lib/mock-data";
import { CLASSES } from "@/lib/messages";

export default function MyClassesPage() {
  return (
    <div className="mx-auto max-w-5xl fade-in">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {CLASSES.title}
        </h1>
        <p className="mt-1 text-[var(--ink-muted)]">{CLASSES.subtitle}</p>
        <p className="mt-2 text-xs text-[var(--ink-faint)]">
          {DEMO_SCHOOL.name} → My Classes → Assessments → Enter Results → Method
          Impact
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {DEMO_CLASSES.map((c, i) => {
          const n = DEMO_STUDENTS.filter((s) => s.class_id === c.id).length;
          return (
            <Link
              key={c.id}
              href={`/classes/${c.id}`}
              className="surface slide-up block p-5 transition-transform hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                {c.academic_year}
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-[var(--brand-deep)]">
                {c.name}
              </h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                {n} students · open Assessments / Quizzes to enter scores
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-[var(--brand)]">
                {CLASSES.openClass} →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
