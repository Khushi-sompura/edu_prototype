export type BloomLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";

export const BLOOM_LEVELS: {
  id: BloomLevel;
  label: string;
  description: string;
}[] = [
  {
    id: "remember",
    label: "Remember",
    description: "Recall facts, labels, definitions",
  },
  {
    id: "understand",
    label: "Understand",
    description: "Explain meaning or concept",
  },
  {
    id: "apply",
    label: "Apply",
    description: "Use learning in a new example",
  },
  {
    id: "analyze",
    label: "Analyze",
    description: "Compare, detect patterns, relationships",
  },
  {
    id: "evaluate",
    label: "Evaluate",
    description: "Judge quality using criteria",
  },
  {
    id: "create",
    label: "Create",
    description: "Produce a new idea, model, or solution",
  },
];

export const PEDAGOGY_MODES = [
  {
    id: "blooms",
    label: "Bloom's Taxonomy",
    detail: "Progress learning through cognitive levels from remember to create.",
  },
  {
    id: "differentiated",
    label: "Differentiated Instruction",
    detail: "Adapt content, process, product, or environment to student need.",
  },
  {
    id: "inquiry",
    label: "Inquiry-Based Learning",
    detail: "Students investigate driven by questions and evidence.",
  },
  {
    id: "experiential",
    label: "Experiential & Fieldwork",
    detail: "Learn through real-world experience, observation, and practice.",
  },
  {
    id: "explicit",
    label: "Explicit Instruction",
    detail: "I do → We do → You do with clear modeling and practice.",
  },
  {
    id: "cooperative",
    label: "Cooperative Learning",
    detail: "Structured group roles and shared responsibility for learning.",
  },
  {
    id: "gamification",
    label: "Gamification",
    detail: "Points, levels, challenges, and rewards to drive engagement.",
  },
] as const;

export type KbDoc = {
  id: string;
  layer: "platform" | "school" | "teacher";
  title: string;
  tags: string[];
  folder: string;
  fileName: string;
  status: "draft" | "published";
  uploadedAt: string;
  /** BCP-47 tag; Build 1 defaults to en. Unicode content allowed. */
  language: string;
};

export const KB_DOCS: KbDoc[] = [
  {
    id: "p1",
    layer: "platform",
    title: "Bloom progression for middle school science",
    tags: ["science", "bloom", "socratic"],
    folder: "Pedagogy frameworks",
    fileName: "bloom-science-ms.pdf",
    status: "published",
    uploadedAt: "2026-03-12",
    language: "en",
  },
  {
    id: "p2",
    layer: "platform",
    title: "Behavior intervention glossary",
    tags: ["behavior", "intervention"],
    folder: "Behavior intervention plans",
    fileName: "behavior-glossary.docx",
    status: "published",
    uploadedAt: "2026-02-28",
    language: "en",
  },
  {
    id: "s1",
    layer: "school",
    title: "Year 7 Science scope & sequence",
    tags: ["science", "6-8"],
    folder: "Teaching scope",
    fileName: "y7-science-scope.xlsx",
    status: "published",
    uploadedAt: "2026-04-01",
    language: "en",
  },
  {
    id: "s2",
    layer: "school",
    title: "Classroom behavior policy",
    tags: ["behavior", "policy"],
    folder: "School policy",
    fileName: "classroom-behavior-policy.pdf",
    status: "published",
    uploadedAt: "2026-01-15",
    language: "en",
  },
  {
    id: "t1",
    layer: "teacher",
    title: "Food chains — my draft lesson",
    tags: ["science", "food chains", "understand"],
    folder: "My lesson plans",
    fileName: "food-chains-draft.docx",
    status: "draft",
    uploadedAt: "2026-05-08",
    language: "en",
  },
  {
    id: "t2",
    layer: "teacher",
    title: "Sentence frames for language support",
    tags: ["supports", "language"],
    folder: "My class resources",
    fileName: "sentence-frames.pdf",
    status: "published",
    uploadedAt: "2026-05-02",
    language: "en",
  },
];

/** Hierarchy: School → Teacher → Class → Student → Performance */
export type School = { id: string; name: string };
export type AppUser = {
  id: string;
  school_id: string;
  name: string;
  email: string;
  role: "admin" | "teacher";
};
export type ClassRoom = {
  id: string;
  school_id: string;
  teacher_id: string;
  name: string;
  academic_year: string;
};
export type Student = {
  id: string;
  class_id: string;
  student_code: string;
};

/** First-class quiz/assessment — scores attach here, not via analytics re-upload. */
export type Assessment = {
  id: string;
  class_id: string;
  title: string;
  topic: string;
  max_score: number;
  date: string;
  status: "open" | "scored";
};

export type Performance = {
  id: string;
  assessment_id: string;
  student_id: string;
  class_id: string;
  score: number;
  max_score: number;
  date: string;
  source?: "csv" | "manual";
};

export type TeachingMethodExperiment = {
  id: string;
  class_id: string;
  topic: string;
  method: string;
  before_assessment_id: string;
  after_assessment_id: string | null;
  status: "waiting_for_next_quiz" | "complete";
};

export const DEMO_SCHOOL: School = {
  id: "sch1",
  name: "Riverside Middle",
};

export const DEMO_TEACHER: AppUser = {
  id: "u1",
  school_id: "sch1",
  name: "A. Chen",
  email: "teacher@edtech.demo",
  role: "teacher",
};

export const DEMO_CLASSES: ClassRoom[] = [
  {
    id: "c1",
    school_id: "sch1",
    teacher_id: "u1",
    name: "Grade 6A Science",
    academic_year: "2025-26",
  },
  {
    id: "c2",
    school_id: "sch1",
    teacher_id: "u1",
    name: "Grade 7B Science",
    academic_year: "2025-26",
  },
];

export const DEMO_STUDENTS: Student[] = [
  { id: "st1", class_id: "c1", student_code: "STU-001" },
  { id: "st2", class_id: "c1", student_code: "STU-002" },
  { id: "st3", class_id: "c1", student_code: "STU-003" },
  { id: "st4", class_id: "c1", student_code: "STU-004" },
  { id: "st5", class_id: "c2", student_code: "STU-101" },
  { id: "st6", class_id: "c2", student_code: "STU-102" },
  { id: "st7", class_id: "c2", student_code: "STU-103" },
];

export const DEMO_ASSESSMENTS: Assessment[] = [
  {
    id: "a1",
    class_id: "c1",
    title: "Quiz 1",
    topic: "Photosynthesis",
    max_score: 25,
    date: "2026-08-01",
    status: "scored",
  },
  {
    id: "a2",
    class_id: "c1",
    title: "Quiz 2",
    topic: "Photosynthesis",
    max_score: 25,
    date: "2026-09-05",
    status: "scored",
  },
  {
    id: "a3",
    class_id: "c2",
    title: "Exit ticket A",
    topic: "Food chains",
    max_score: 10,
    date: "2026-07-10",
    status: "scored",
  },
  {
    id: "a4",
    class_id: "c2",
    title: "Exit ticket B",
    topic: "Food chains",
    max_score: 10,
    date: "2026-08-20",
    status: "scored",
  },
  {
    id: "a5",
    class_id: "c2",
    title: "Quiz 1",
    topic: "Cells",
    max_score: 20,
    date: "2026-06-01",
    status: "scored",
  },
  {
    id: "a6",
    class_id: "c2",
    title: "Quiz 2",
    topic: "Cells",
    max_score: 20,
    date: "2026-09-16",
    status: "open",
  },
];

/** Scores use student_id internally; UI shows student_code only (privacy). */
export const DEMO_PERFORMANCE: Performance[] = [
  // Quiz 1 Photosynthesis — before
  { id: "pf1", assessment_id: "a1", student_id: "st1", class_id: "c1", score: 14, max_score: 25, date: "2026-08-01", source: "csv" },
  { id: "pf2", assessment_id: "a1", student_id: "st2", class_id: "c1", score: 16, max_score: 25, date: "2026-08-01", source: "csv" },
  { id: "pf3", assessment_id: "a1", student_id: "st3", class_id: "c1", score: 12, max_score: 25, date: "2026-08-01", source: "csv" },
  { id: "pf4", assessment_id: "a1", student_id: "st4", class_id: "c1", score: 18, max_score: 25, date: "2026-08-01", source: "csv" },
  // Quiz 2 Photosynthesis — after Cooperative Learning
  { id: "pf5", assessment_id: "a2", student_id: "st1", class_id: "c1", score: 20, max_score: 25, date: "2026-09-05", source: "manual" },
  { id: "pf6", assessment_id: "a2", student_id: "st2", class_id: "c1", score: 21, max_score: 25, date: "2026-09-05", source: "manual" },
  { id: "pf7", assessment_id: "a2", student_id: "st3", class_id: "c1", score: 19, max_score: 25, date: "2026-09-05", source: "manual" },
  { id: "pf8", assessment_id: "a2", student_id: "st4", class_id: "c1", score: 22, max_score: 25, date: "2026-09-05", source: "manual" },
  // Food chains exit tickets
  { id: "pf9", assessment_id: "a3", student_id: "st5", class_id: "c2", score: 6, max_score: 10, date: "2026-07-10", source: "csv" },
  { id: "pf10", assessment_id: "a3", student_id: "st6", class_id: "c2", score: 7, max_score: 10, date: "2026-07-10", source: "csv" },
  { id: "pf11", assessment_id: "a3", student_id: "st7", class_id: "c2", score: 7, max_score: 10, date: "2026-07-10", source: "csv" },
  { id: "pf12", assessment_id: "a4", student_id: "st5", class_id: "c2", score: 8, max_score: 10, date: "2026-08-20", source: "csv" },
  { id: "pf13", assessment_id: "a4", student_id: "st6", class_id: "c2", score: 8, max_score: 10, date: "2026-08-20", source: "csv" },
  { id: "pf14", assessment_id: "a4", student_id: "st7", class_id: "c2", score: 8, max_score: 10, date: "2026-08-20", source: "csv" },
  // Cells Quiz 1 — waiting for Quiz 2
  { id: "pf15", assessment_id: "a5", student_id: "st5", class_id: "c2", score: 12, max_score: 20, date: "2026-06-01", source: "manual" },
  { id: "pf16", assessment_id: "a5", student_id: "st6", class_id: "c2", score: 13, max_score: 20, date: "2026-06-01", source: "manual" },
  { id: "pf17", assessment_id: "a5", student_id: "st7", class_id: "c2", score: 11, max_score: 20, date: "2026-06-01", source: "manual" },
];

export const DEMO_EXPERIMENTS: TeachingMethodExperiment[] = [
  {
    id: "exp1",
    class_id: "c1",
    topic: "Photosynthesis",
    method: "Cooperative Learning",
    before_assessment_id: "a1",
    after_assessment_id: "a2",
    status: "complete",
  },
  {
    id: "exp2",
    class_id: "c2",
    topic: "Food chains",
    method: "Inquiry-Based",
    before_assessment_id: "a3",
    after_assessment_id: "a4",
    status: "complete",
  },
  {
    id: "exp3",
    class_id: "c2",
    topic: "Cells",
    method: "Explicit Instruction",
    before_assessment_id: "a5",
    after_assessment_id: null,
    status: "waiting_for_next_quiz",
  },
];

/** Claude returns structured slide JSON; app converts via pptx library. */
export const SAMPLE_SLIDE_JSON = {
  title: "Photosynthesis",
  slides: [
    {
      title: "What is Photosynthesis?",
      bullets: [
        "Plants convert light energy into chemical energy",
        "Chlorophyll captures sunlight",
      ],
      speaker_notes: "Explain energy conversion in plain language.",
    },
    {
      title: "Key ingredients",
      bullets: ["Sunlight", "Water", "Carbon dioxide", "Chlorophyll"],
      speaker_notes: "Invite students to recall each input.",
    },
    {
      title: "Check for understanding",
      bullets: [
        "What energy enters the plant?",
        "What product stores that energy?",
      ],
      speaker_notes: "Use as exit discussion prompts.",
    },
  ],
};

export const SAMPLE_LESSON = {
  title: "Food Chains: From Understanding to Analysis",
  objective:
    "Students will explain food chains and analyze how changes to one organism affect the system.",
  bloom_sequence: [
    {
      level: "understand",
      goal: "Explain what a food chain is.",
      teacher_moves: [
        "Show a simple example.",
        "Ask students to describe it in their own words.",
      ],
      socratic_questions: [
        "What is happening in this chain?",
        "Why do you think this organism comes next?",
      ],
      supports: ["visual diagram", "sentence frames", "paired discussion"],
    },
    {
      level: "apply",
      goal: "Use a new example to build a food chain.",
      teacher_moves: [
        "Provide organism cards.",
        "Guide students to place them in sequence.",
      ],
      socratic_questions: [
        "How would you use what we learned here?",
        "Where would this organism belong and why?",
      ],
      supports: ["model example", "choice bank", "prompt hierarchy"],
    },
    {
      level: "analyze",
      goal: "Analyze the effect of removing one organism.",
      teacher_moves: [
        "Present a disruption scenario.",
        "Have students explain ripple effects.",
      ],
      socratic_questions: [
        "What changes first?",
        "What evidence supports that conclusion?",
        "What pattern do you notice?",
      ],
      supports: [
        "cause-effect organizer",
        "guided options",
        "small-group processing",
      ],
    },
  ],
  assessment: {
    check_for_understanding: [
      "Explain a food chain in one sentence.",
      "Place these organisms in correct order.",
      "Describe what happens if one organism disappears.",
    ],
    exit_ticket:
      "What is one change in a food chain that could affect all the other organisms?",
  },
};

export const ENGAGEMENT_STRATEGIES = [
  { id: "chorus", label: "Chorus responding", avg: 8.2 },
  { id: "tps", label: "Think-pair-share", avg: 7.4 },
  { id: "stations", label: "Learning stations", avg: 6.8 },
  { id: "lecture", label: "Lecture", avg: 3.1 },
];

export const PRIVACY_TABLE = [
  {
    data: "School → Class → Student roster",
    where: "Server (school-scoped)",
    note: "student_code only — no names stored",
  },
  {
    data: "Assessments + Results",
    where: "Server (assessment_id + student_id)",
    note: "Entered under My Classes — CSV/manual import only",
  },
  {
    data: "Teaching method experiments",
    where: "Server",
    note: "Links before/after assessment IDs — no score re-upload",
  },
  {
    data: "KB docs & chunks",
    where: "Server + vector store",
    note: "UTF-8 · language metadata · multilingual embeddings",
  },
];
