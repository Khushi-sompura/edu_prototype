export const APP = {
  name: "EdTech AI Platform",
  tagline: "Smarter teaching. Better outcomes.",
  subtitle: "Curriculum, pedagogy, and proof — in one teacher workflow.",
} as const;

export const NAV = {
  dashboard: "Dashboard",
  analytics: "Privacy Analytics",
  planner: "Lesson Planner",
  knowledgeBase: "Knowledge Base",
  assistant: "AI Assistant",
  behavior: "Behavior Tally",
  engagement: "Engagement Tally",
  privacy: "Roster & Privacy",
  schoolSettings: "School settings",
  platform: "Platform oversight",
  signOut: "Sign out",
} as const;

export const LANDING = {
  ctaPrimary: "Sign in by role",
  ctaSecondary: "View product map",
  appsLabel: "Three roles · two apps · one platform",
} as const;

export const LOGIN = {
  title: "Sign in",
  subtitle: "Choose your role. Demo passwords are all “demo”.",
  submit: "Continue",
  rolesHint: "Teacher · School Admin · Platform Admin",
} as const;

export const DASHBOARD = {
  title: "Teacher workspace",
  subtitle: "Jump into analytics or the AI teaching assistant.",
  app1Title: "Privacy Analytics",
  app1Desc: "CSV grades, weak-area flags, and trend views — student names stay on your device.",
  app2Title: "AI Teaching Assistant",
  app2Desc: "Bloom lesson planning, 3-layer KB chat, and pedagogy-aligned outputs.",
  schoolTitle: "School admin workspace",
  schoolSubtitle:
    "School KB, branding, promotion policy, and roster key-share escrow.",
  platformTitle: "Platform admin workspace",
  platformSubtitle:
    "Platform KB ownership, school oversight, and cross-school promotion approvals.",
} as const;

export const SCHOOL = {
  settingsTitle: "School settings",
  settingsSubtitle: "Branding, promotion policy, and admin key share.",
  branding: "School branding",
  policy: "KB promotion policy",
  escrow: "Roster key-share escrow",
  escrowDesc:
    "Split-trust recovery: teacher holds one share, school admin holds the other. EdTech AI Platform cannot decrypt roster names.",
} as const;

export const PLATFORM = {
  title: "Platform oversight",
  subtitle: "Schools, Platform KB, and platform-level promotion routing.",
} as const;

export const PLANNER = {
  title: "Lesson Planner",
  subtitle: "Guided Bloom pathway — generate once, refine by section.",
  steps: [
    "Lesson Setup",
    "Cognitive Pathway",
    "Teaching Method",
    "Learner Supports",
    "Output Studio",
    "Review & Export",
  ],
  standardsHint:
    "Optional. If blank, alignment uses subject, topic, and grade band.",
  generate: "Generate lesson",
  back: "Back",
  next: "Continue",
  scopeBadge: "Ask Knowledge Base",
} as const;

export const CHAT = {
  kbTab: "Knowledge Base",
  webTab: "Web search",
  kbEmpty: "Ask using your Platform, School, and Teacher KB.",
  webEmpty: "Search the public web. No KB content included.",
  webDisclaimer: "No KB content included — external sources only.",
  noTeacherMatch: "No matching content found in Teacher KB",
  scopeChanged: "Scope changed to",
  placeholderKb: "Ask about this lesson…",
  placeholderWeb: "Search the web…",
} as const;

export const KB = {
  title: "Knowledge Base",
  subtitle: "Content flows down, never up — unless you request promotion.",
  layers: {
    platform: "Platform Knowledge Base",
    school: "School Knowledge Base",
    teacher: "Teacher Knowledge Base",
  },
  uploaded: "Uploaded",
  promote: "Request promotion",
  promoteShort: "Promote",
  upload: "Upload Knowledge",
  fields: {
    knowledgeBase: "Knowledge Base",
    contentType: "Content Type",
    pedagogy: "Pedagogy",
    title: "Title",
    subject: "Subject",
    gradeLevel: "Grade Level",
    tags: "Tags",
    file: "File / Document",
    status: "Status",
    selectKb: "Select Knowledge Base",
    selectContentType: "Select content type",
    selectPedagogy: "Select pedagogy",
    tagsHint: "Comma-separated, e.g. inquiry, investigation",
    optional: "Optional",
    submit: "Upload",
    uploadedDemo: "Tagged & ready (demo)",
  },
  typeFields: {
    behaviorCategory: "Behavior Category",
    targetBehavior: "Target Behavior",
    behaviorTerm: "Behavior Term",
    definition: "Definition",
    recommendedResponse: "Recommended Response",
    supportCategory: "Support Category",
    strategyName: "Strategy Name",
    recommendedStrategy: "Recommended Teaching Strategy",
    bloomLevel: "Level",
    learningObjective: "Learning Objective",
    exampleActivity: "Example Activity",
    diffDimension: "Differentiation Dimension",
    studentNeed: "Student Need",
    drivingQuestion: "Driving Question",
    activityName: "Activity Name",
    experienceType: "Experience Type",
    groupSize: "Group Size",
    gameName: "Game / Activity Name",
    gameType: "Game Type",
    standardCode: "Standard Code",
    standardTitle: "Standard Title",
    topic: "Topic",
    skillConcept: "Skill / Concept",
    remediationStrategy: "Remediation Strategy",
    difficulty: "Difficulty",
    policyCategory: "Policy Category",
    procedureName: "Procedure Name",
    purpose: "Purpose",
    steps: "Steps",
    requiredOutcomes: "Required Learning Outcomes",
    expectedResponse: "Expected Teacher Response",
    resourceType: "Resource Type",
    student: "Student",
    observation: "Observation",
    recommendedAction: "Recommended Action",
  },
} as const;

export const PRIVACY = {
  title: "Roster & Privacy",
  subtitle: "Names map to codes on this device only. Server data uses codes.",
  warning:
    "Clearing browser data removes the local name map. Grades under codes remain on the server.",
  addStudent: "Add student",
} as const;

export const ANALYTICS = {
  title: "Privacy Analytics",
  subtitle: "Upload grade CSVs, spot weak areas, compare teaching methods.",
  upload: "Map CSV columns",
  weakAreas: "Weak area flags",
  methodTally: "Teaching method tally",
} as const;

export const BEHAVIOR = {
  title: "Behavior Tally",
  subtitle: "Pre/post intervention ratings with a plain-language report.",
  csvTitle: "Upload behavior CSV",
  csvHint:
    "Bulk-import daily ratings by student code. Map columns from any source format.",
  csvSample:
    "Expected columns example: StudentCode, Behavior, Phase (pre/post), Rating, Date",
} as const;

export const ENGAGEMENT = {
  title: "Engagement Tally",
  subtitle: "Rate class energy by strategy — see what actually works.",
  csvTitle: "Upload engagement CSV",
  csvHint:
    "Import class energy check-ins by teaching strategy. Flexible column mapping included.",
  csvSample:
    "Expected columns example: Date, Strategy, Energy (0–10), ClassCode",
} as const;
