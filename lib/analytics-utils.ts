import type {
  Assessment,
  Performance,
  Student,
  TeachingMethodExperiment,
} from "@/lib/mock-data";

export function pct(score: number, max: number) {
  if (max <= 0) return 0;
  return Math.round((score / max) * 1000) / 10;
}

export function avgForAssessment(
  results: Performance[],
  assessmentId: string | null | undefined,
): number | null {
  if (!assessmentId) return null;
  const rows = results.filter((r) => r.assessment_id === assessmentId);
  if (!rows.length) return null;
  const sum = rows.reduce((acc, r) => acc + pct(r.score, r.max_score), 0);
  return Math.round((sum / rows.length) * 10) / 10;
}

export type MethodImpactRow = {
  experiment: TeachingMethodExperiment;
  className: string;
  beforeLabel: string;
  afterLabel: string;
  before: number | null;
  after: number | null;
  change: number | null;
};

export function buildMethodImpact(
  experiments: TeachingMethodExperiment[],
  results: Performance[],
  assessments: Assessment[],
  classNameById: Record<string, string>,
): MethodImpactRow[] {
  const byId = Object.fromEntries(assessments.map((a) => [a.id, a]));
  return experiments.map((exp) => {
    const isWaiting =
      exp.status === "waiting_for_next_quiz" || !exp.after_assessment_id;
    const before = avgForAssessment(results, exp.before_assessment_id);
    const after = isWaiting
      ? null
      : avgForAssessment(results, exp.after_assessment_id);
    const change =
      !isWaiting && before != null && after != null
        ? Math.round((after - before) * 10) / 10
        : null;
    return {
      experiment: exp,
      className: classNameById[exp.class_id] ?? exp.class_id,
      beforeLabel: byId[exp.before_assessment_id]?.title ?? "Before",
      afterLabel: isWaiting
        ? "Waiting"
        : (byId[exp.after_assessment_id!]?.title ?? "After"),
      before,
      after,
      change,
    };
  });
}

export function topicAverages(
  results: Performance[],
  assessments: Assessment[],
  classId?: string,
): { topic: string; avg: number; n: number }[] {
  const assessById = Object.fromEntries(assessments.map((a) => [a.id, a]));
  const map = new Map<string, { sum: number; n: number }>();
  for (const r of results) {
    if (classId && r.class_id !== classId) continue;
    const topic = assessById[r.assessment_id]?.topic ?? "Unknown";
    const p = pct(r.score, r.max_score);
    const cur = map.get(topic) ?? { sum: 0, n: 0 };
    cur.sum += p;
    cur.n += 1;
    map.set(topic, cur);
  }
  return [...map.entries()]
    .map(([topic, { sum, n }]) => ({
      topic,
      avg: Math.round((sum / n) * 10) / 10,
      n,
    }))
    .sort((a, b) => a.avg - b.avg);
}

export function studentBreakdown(
  results: Performance[],
  students: Student[],
  exp: TeachingMethodExperiment,
) {
  const beforeRows = results.filter(
    (r) => r.assessment_id === exp.before_assessment_id,
  );
  const afterRows = exp.after_assessment_id
    ? results.filter((r) => r.assessment_id === exp.after_assessment_id)
    : [];
  const byStudent = new Map<string, { before?: number; after?: number }>();
  for (const r of beforeRows) {
    byStudent.set(r.student_id, {
      ...byStudent.get(r.student_id),
      before: pct(r.score, r.max_score),
    });
  }
  for (const r of afterRows) {
    byStudent.set(r.student_id, {
      ...byStudent.get(r.student_id),
      after: pct(r.score, r.max_score),
    });
  }
  return students
    .filter((s) => s.class_id === exp.class_id && byStudent.has(s.id))
    .map((s) => {
      const scores = byStudent.get(s.id)!;
      const change =
        scores.before != null && scores.after != null
          ? Math.round((scores.after - scores.before) * 10) / 10
          : null;
      return {
        student_code: s.student_code,
        before: scores.before ?? null,
        after: scores.after ?? null,
        change,
      };
    });
}

export function scoreCount(results: Performance[], assessmentId: string) {
  return results.filter((r) => r.assessment_id === assessmentId).length;
}
