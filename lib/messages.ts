export const APP = {
  name: "EdTech AI Platform",
  tagline: "Smarter teaching. Better outcomes.",
  subtitle: "Curriculum, pedagogy, and proof — in one teacher workflow.",
} as const;

export const NAV = {
  dashboard: "Dashboard",
  classes: "My Classes",
  analytics: "Method Impact",
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
  teacherDesc:
    "My Classes → Assessments → score entry (manual/CSV) → Method Impact. Plus planner, chat, tallies, and Teacher KB.",
} as const;

export const LOGIN = {
  title: "Sign in",
  subtitle: "Choose your role. Demo passwords are all “demo”.",
  submit: "Continue",
  rolesHint: "Teacher · School Admin · Platform Admin",
} as const;

export const DASHBOARD = {
  title: "Teacher workspace",
  subtitle: "Start with classes and assessments — then see teaching-method impact.",
  app1Title: "Method Impact",
  app1Desc:
    "Compare Quiz 1 vs Quiz 2 after a teaching method. Uses scores already entered under My Classes — no re-upload.",
  classesTitle: "My Classes",
  classesDesc:
    "Select a class → Assessments / Quizzes → Enter Results (manual or CSV by student code).",
  app2Title: "AI Teaching Assistant",
  app2Desc:
    "Bloom lesson planning, multilingual-ready KB, and structured slide content for PowerPoint export.",
  schoolTitle: "School admin workspace",
  schoolSubtitle:
    "School KB, branding, promotion policy, and roster key-share escrow.",
  platformTitle: "Platform admin workspace",
  platformSubtitle:
    "Platform KB ownership, school oversight, and cross-school promotion approvals.",
  privacyTileDesc:
    "Student codes only — no names. Scores and analytics use codes.",
  schoolAnalyticsDesc:
    "Method impact tallies from class assessment results.",
} as const;

export const SCHOOL = {
  settingsTitle: "School settings",
  settingsSubtitle: "Branding, promotion policy, and admin key share.",
  branding: "School branding",
  policy: "KB promotion policy",
  escrow: "Roster key-share escrow",
  escrowDesc:
    "Split-trust recovery: teacher holds one share, school admin holds the other. EdTech AI Platform cannot decrypt the student ID roster.",
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
  exportPptTitle: "PowerPoint export",
  exportPptHint:
    "Claude generates structured slide JSON. This app converts it to a .pptx via a PPT library (not Claude binary output).",
  exportPptPreview: "Preview Claude JSON",
  exportPptDownload: "Convert JSON → Download .pptx (demo)",
  exportPptDone: "Demo: slide JSON ready for PptxGenJS / python-pptx conversion.",
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
  subtitle:
    "Content flows down, never up — unless you request promotion. Build 1 is English UI; storage is UTF-8 with language tags for Build 2.",
  layers: {
    platform: "Platform Knowledge Base",
    school: "School Knowledge Base",
    teacher: "Teacher Knowledge Base",
  },
  uploaded: "Uploaded",
  uploadedDocs: "Uploaded documents",
  uploadedDocsEmpty: "No documents uploaded for this layer yet.",
  promote: "Request promotion",
  promoteShort: "Promote",
  upload: "Upload Knowledge",
  multilingualNote:
    "Documents accept Unicode titles/content. Language metadata defaults to English; multilingual embeddings will power Build 2 retrieval.",
  docCols: {
    title: "Title",
    type: "Type",
    file: "File",
    status: "Status",
    language: "Lang",
    uploadedAt: "Uploaded",
    actions: "Actions",
  },
  docActions: {
    view: "View",
    download: "Download",
    delete: "Delete",
    promote: "Promote",
    close: "Close",
  },
  viewModal: {
    type: "Type",
    file: "File",
    status: "Status",
    language: "Language",
    uploaded: "Uploaded",
    tags: "Tags",
  },
  fields: {
    knowledgeBase: "Knowledge Base",
    contentType: "Content Type",
    pedagogy: "Pedagogy",
    title: "Title",
    language: "Document language",
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
    studentIdPlaceholder: "Student ID (e.g. STU-8841)",
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
    student: "Student ID",
    observation: "Observation",
    recommendedAction: "Recommended Action",
  },
} as const;

export const PRIVACY = {
  title: "Roster & Privacy",
  subtitle:
    "Student codes only — no names stored. Scores and analytics use codes.",
  warning:
    "This prototype never stores student names. Roster = student codes per class.",
  addStudent: "Add student code",
  rosterTitle: "Class roster (codes only)",
  storageTitle: "What is stored where",
  studentId: "Student code",
  classLabel: "Class",
  actions: "Actions",
  remove: "Remove",
  emptyRoster: "No student codes in this class yet.",
  studentIdPlaceholder: "Student code (e.g. STU-001)",
  autoCodeHint: "Leave blank to auto-generate STU-###.",
  backupTitle: "Roster backup (split-trust demo)",
  backupDesc:
    "Encrypted backup of student codes only. Password cannot be reset by the platform.",
  setupBackup: "Set up backup",
  backupPassword: "Backup password (separate from login)",
  createBackup: "Create encrypted backup",
  backupSuccess:
    "Last backup: just now · {count} student codes · admin key share pending school escrow.",
  restoreTitle: "Restore on new device",
  decryptLocally: "Decrypt locally",
  restoreHint:
    "Scores stay under student_id either way — restore only the code roster on a new device.",
} as const;

export const ANALYTICS = {
  title: "Teaching Method Impact",
  subtitle:
    "Link existing assessments (Quiz 1 → Quiz 2) to a teaching method. Scores are entered under My Classes — not here.",
  workflowBanner:
    "Score entry lives in the class workflow. This page only compares assessments you already scored.",
  weakAreas: "Weak area flags",
  methodTally: "Teaching method tally",
  impactTitle: "Teaching Method Impact",
  impactHint:
    "Before vs after from linked assessments. Click a row to drill into student codes.",
  drillTitle: "Improvement detail",
  topicTitle: "Topic averages (selected class)",
  classLabel: "Class",
  linkExperiment: "Create method comparison",
  linkExperimentHint:
    "Example: Quiz 1 (before) + Cooperative Learning + Quiz 2 (after). System compares existing results automatically.",
} as const;

export const CLASSES = {
  title: "My Classes",
  subtitle:
    "Class → Assessments / Quizzes → Enter Results. Then Method Impact reuses those scores.",
  openClass: "Open class",
  assessmentsTitle: "Assessments / Quizzes",
  assessmentsHint:
    "Create a quiz, then enter results by student code (manual or CSV).",
  createAssessment: "New assessment",
  enterResults: "Enter Results",
  manualEntry: "Manual entry",
  csvUpload: "CSV upload",
  csvHint:
    "Upload scores for this assessment only. Student codes — no names in the file.",
  csvSample: "Example: StudentCode,Score,Date — STU-001,18,2026-09-16",
  privacyCodesOnly:
    "Privacy: results store and display student codes, not names.",
} as const;

export const BEHAVIOR = {
  title: "Behavior Tally",
  subtitle: "Pre/post intervention ratings with a plain-language report.",
  dateLabel: "Date",
  csvTitle: "Upload behavior CSV",
  csvHint:
    "Bulk-import daily ratings by student code. Map columns from any source format.",
  csvSample:
    "Expected columns example: StudentCode, Behavior, Phase (pre/post), Rating, Date",
} as const;

export const ENGAGEMENT = {
  title: "Engagement Tally",
  subtitle: "Rate class energy by strategy — see what actually works.",
  dateLabel: "Date",
  csvTitle: "Upload engagement CSV",
  csvHint:
    "Import class energy check-ins by teaching strategy. Flexible column mapping included.",
  csvSample:
    "Expected columns example: Date, Strategy, Energy (0–10), ClassCode",
} as const;
