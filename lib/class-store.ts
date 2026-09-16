import {
  DEMO_ASSESSMENTS,
  DEMO_EXPERIMENTS,
  DEMO_PERFORMANCE,
  type Assessment,
  type Performance,
  type TeachingMethodExperiment,
} from "@/lib/mock-data";

export const ASSESSMENTS_KEY = "edtech.assessments.v2";
export const RESULTS_KEY = "edtech.results.v2";
export const EXPERIMENTS_KEY = "edtech.experiments.v4";

export function loadAssessments(): Assessment[] {
  try {
    const raw = localStorage.getItem(ASSESSMENTS_KEY);
    if (!raw) return DEMO_ASSESSMENTS;
    const parsed = JSON.parse(raw) as Assessment[];
    return Array.isArray(parsed) && parsed.length ? parsed : DEMO_ASSESSMENTS;
  } catch {
    return DEMO_ASSESSMENTS;
  }
}

export function saveAssessments(rows: Assessment[]) {
  localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(rows));
}

export function loadResults(): Performance[] {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    if (!raw) return DEMO_PERFORMANCE;
    const parsed = JSON.parse(raw) as Performance[];
    return Array.isArray(parsed) && parsed.length ? parsed : DEMO_PERFORMANCE;
  } catch {
    return DEMO_PERFORMANCE;
  }
}

export function saveResults(rows: Performance[]) {
  localStorage.setItem(RESULTS_KEY, JSON.stringify(rows));
}

export function loadExperiments(): TeachingMethodExperiment[] {
  try {
    const raw = localStorage.getItem(EXPERIMENTS_KEY);
    if (!raw) return DEMO_EXPERIMENTS;
    const parsed = JSON.parse(raw) as TeachingMethodExperiment[];
    return Array.isArray(parsed) && parsed.length ? parsed : DEMO_EXPERIMENTS;
  } catch {
    return DEMO_EXPERIMENTS;
  }
}

export function saveExperiments(rows: TeachingMethodExperiment[]) {
  localStorage.setItem(EXPERIMENTS_KEY, JSON.stringify(rows));
}

/** When after assessment gains scores, auto-complete matching experiments. */
export function syncExperimentsAfterScoring(
  experiments: TeachingMethodExperiment[],
  results: Performance[],
  assessmentId: string,
): TeachingMethodExperiment[] {
  const hasScores = results.some((r) => r.assessment_id === assessmentId);
  if (!hasScores) return experiments;
  return experiments.map((exp) => {
    if (exp.status === "waiting_for_next_quiz" && !exp.after_assessment_id) {
      // Teacher may later link Quiz 2 explicitly; optional auto-link if same topic waiting
      return exp;
    }
    if (
      exp.status === "waiting_for_next_quiz" &&
      exp.after_assessment_id === assessmentId
    ) {
      return { ...exp, status: "complete" as const };
    }
    return exp;
  });
}
