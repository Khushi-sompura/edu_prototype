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
  },
];

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

export const GRADE_TRENDS = [
  { topic: "Cells", avg: 72 },
  { topic: "Food chains", avg: 61 },
  { topic: "Photosynthesis", avg: 68 },
  { topic: "Ecosystems", avg: 79 },
];

export const METHOD_COMPARISONS = [
  {
    id: "m1",
    pedagogy: "Cooperative Learning",
    className: "7B Science",
    topic: "Food chains",
    before: 68,
    after: 81,
    status: "complete" as const,
  },
  {
    id: "m2",
    pedagogy: "Inquiry-Based",
    className: "7B Science",
    topic: "Photosynthesis",
    before: 64,
    after: null,
    status: "waiting" as const,
  },
];

export const ENGAGEMENT_STRATEGIES = [
  { id: "chorus", label: "Chorus responding", avg: 8.2 },
  { id: "tps", label: "Think-pair-share", avg: 7.4 },
  { id: "stations", label: "Learning stations", avg: 6.8 },
  { id: "lecture", label: "Lecture", avg: 3.1 },
];

export const PRIVACY_TABLE = [
  {
    data: "Student ID roster",
    where: "This device only",
    note: "IDs only — no names stored",
  },
  {
    data: "Grades & CSV uploads",
    where: "Server (by student ID)",
    note: "No names attached",
  },
  {
    data: "Behavior ratings",
    where: "Server (by student ID)",
    note: "Pre/post tallies",
  },
  {
    data: "Lesson & KB content",
    where: "Server",
    note: "Scoped by school/teacher",
  },
];
