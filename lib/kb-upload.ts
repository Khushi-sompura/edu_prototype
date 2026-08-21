export type KbLayer = "platform" | "school" | "teacher";

export type ContentTypeId =
  | "behavior_plans"
  | "behavior_glossary"
  | "student_support"
  | "pedagogy_frameworks"
  | "curriculum_standards"
  | "remediation"
  | "school_policy"
  | "admin_procedures"
  | "teaching_scope"
  | "classroom_behavior"
  | "school_custom"
  | "lesson_plans"
  | "class_resources"
  | "student_notes"
  | "teacher_custom";

export type PedagogyId =
  | "blooms"
  | "differentiated"
  | "inquiry"
  | "experiential"
  | "explicit"
  | "cooperative"
  | "gamification";

export const SUBJECTS = [
  { id: "science", label: "Science" },
  { id: "math", label: "Math" },
  { id: "ela", label: "ELA" },
  { id: "social_studies", label: "Social Studies" },
  { id: "other", label: "Other" },
] as const;

export const GRADE_LEVELS = [
  { id: "k-2", label: "K–2" },
  { id: "3-5", label: "3–5" },
  { id: "6-8", label: "6–8" },
  { id: "9-12", label: "9–12" },
] as const;

export const UPLOAD_STATUSES = [
  { id: "draft", label: "Draft" },
  { id: "published", label: "Published" },
] as const;

export const CONTENT_TYPES_BY_LAYER: Record<
  KbLayer,
  { id: ContentTypeId; label: string }[]
> = {
  platform: [
    { id: "behavior_plans", label: "Behavior Intervention Plans" },
    { id: "behavior_glossary", label: "Glossary of Common Behaviors" },
    {
      id: "student_support",
      label: "Teaching Students with Autism / Trauma / LD",
    },
    { id: "pedagogy_frameworks", label: "Pedagogy Frameworks" },
    { id: "curriculum_standards", label: "Curriculum Standards" },
    { id: "remediation", label: "Remediation & Test Preparation" },
  ],
  school: [
    { id: "school_policy", label: "School Policy" },
    { id: "admin_procedures", label: "Administrative Procedures" },
    { id: "teaching_scope", label: "Teaching Scope & Content Compliance" },
    { id: "classroom_behavior", label: "Classroom Behavior Information" },
    { id: "school_custom", label: "Custom / Other" },
  ],
  teacher: [
    { id: "lesson_plans", label: "Lesson Plans" },
    { id: "class_resources", label: "Class Resources" },
    { id: "student_notes", label: "Student Notes" },
    { id: "teacher_custom", label: "Custom Folder" },
  ],
};

export const PEDAGOGY_FRAMEWORKS: { id: PedagogyId; label: string }[] = [
  { id: "blooms", label: "Bloom's Taxonomy" },
  { id: "differentiated", label: "Differentiated Instruction" },
  { id: "inquiry", label: "Inquiry-Based Learning" },
  { id: "experiential", label: "Experiential & Fieldwork" },
  { id: "explicit", label: "Explicit Instruction" },
  { id: "cooperative", label: "Cooperative Learning" },
  { id: "gamification", label: "Gamification" },
];

export const SUPPORT_CATEGORIES = [
  { id: "autism", label: "Autism" },
  { id: "trauma", label: "Trauma" },
  { id: "ld", label: "Learning Disability" },
  { id: "other", label: "Other" },
] as const;

export const BLOOM_LEVEL_OPTIONS = [
  { id: "remember", label: "Remember" },
  { id: "understand", label: "Understand" },
  { id: "apply", label: "Apply" },
  { id: "analyze", label: "Analyze" },
  { id: "evaluate", label: "Evaluate" },
  { id: "create", label: "Create" },
] as const;

export const DIFF_DIMENSIONS = [
  { id: "content", label: "Content" },
  { id: "process", label: "Process" },
  { id: "product", label: "Product" },
  { id: "environment", label: "Learning Environment" },
] as const;

export const EXPERIENCE_TYPES = [
  { id: "field_trip", label: "Field Trip" },
  { id: "experiment", label: "Experiment" },
  { id: "observation", label: "Observation" },
  { id: "hands_on", label: "Hands-on Activity" },
  { id: "real_world", label: "Real-world Project" },
] as const;

export const RESOURCE_TYPES = [
  { id: "worksheet", label: "Worksheet" },
  { id: "slides", label: "Slides" },
  { id: "handout", label: "Handout" },
  { id: "video", label: "Video" },
  { id: "other", label: "Other" },
] as const;

export const BEHAVIOR_CATEGORIES = [
  { id: "disruptive", label: "Disruptive Behavior" },
  { id: "withdrawal", label: "Withdrawal" },
  { id: "aggression", label: "Aggression" },
  { id: "attention", label: "Attention Seeking" },
  { id: "other", label: "Other" },
] as const;

export const POLICY_CATEGORIES = [
  { id: "conduct", label: "Conduct" },
  { id: "safety", label: "Safety" },
  { id: "attendance", label: "Attendance" },
  { id: "academic", label: "Academic" },
  { id: "other", label: "Other" },
] as const;

export const DIFFICULTY_LEVELS = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
] as const;

export function defaultContentType(layer: KbLayer): ContentTypeId {
  return CONTENT_TYPES_BY_LAYER[layer][0].id;
}

export function contentTypeLabel(
  layer: KbLayer,
  contentType: ContentTypeId,
): string {
  return (
    CONTENT_TYPES_BY_LAYER[layer].find((c) => c.id === contentType)?.label ??
    contentType
  );
}
