"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { KB_DOCS, type KbDoc } from "@/lib/mock-data";
import { KB } from "@/lib/messages";
import {
  BEHAVIOR_CATEGORIES,
  BLOOM_LEVEL_OPTIONS,
  CONTENT_TYPES_BY_LAYER,
  DIFF_DIMENSIONS,
  DIFFICULTY_LEVELS,
  EXPERIENCE_TYPES,
  GRADE_LEVELS,
  PEDAGOGY_FRAMEWORKS,
  POLICY_CATEGORIES,
  RESOURCE_TYPES,
  SUBJECTS,
  SUPPORT_CATEGORIES,
  UPLOAD_STATUSES,
  contentTypeLabel,
  defaultContentType,
  type ContentTypeId,
  type KbLayer,
  type PedagogyId,
} from "@/lib/kb-upload";

function IconView({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconDownload({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function IconPromote({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function IconDelete({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

const actionBtnClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--brand)] transition-colors hover:bg-[var(--brand-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]";

const actionDangerBtnClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--danger)] transition-colors hover:bg-[var(--danger-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--danger)]";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function loadStoredDocs(): KbDoc[] | null {
  try {
    const raw = localStorage.getItem(KB_DOCS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const docs = parsed
      .map((item): KbDoc | null => {
        if (!item || typeof item !== "object") return null;
        const d = item as Partial<KbDoc>;
        if (typeof d.id !== "string" || typeof d.title !== "string") return null;
        if (d.layer !== "platform" && d.layer !== "school" && d.layer !== "teacher") {
          return null;
        }
        return {
          id: d.id,
          layer: d.layer,
          title: d.title,
          tags: Array.isArray(d.tags)
            ? d.tags.filter((t): t is string => typeof t === "string")
            : [],
          folder: typeof d.folder === "string" ? d.folder : "Uploaded",
          fileName:
            typeof d.fileName === "string" && d.fileName
              ? d.fileName
              : "document.txt",
          status: d.status === "draft" ? "draft" : "published",
          uploadedAt:
            typeof d.uploadedAt === "string" && d.uploadedAt
              ? d.uploadedAt
              : todayIso(),
        };
      })
      .filter((d): d is KbDoc => d !== null);
    return docs.length ? docs : null;
  } catch {
    return null;
  }
}

type Promo = {
  id: string;
  title: string;
  target: "school" | "platform";
  reason: string;
  status: "pending" | "approved" | "rejected";
  from?: string;
};

type UploadForm = {
  contentType: ContentTypeId;
  pedagogy: PedagogyId;
  title: string;
  subject: string;
  grades: string[];
  tags: string;
  status: "draft" | "published";
  fileName: string;
  // type-specific (kept flat for a simple demo form)
  behaviorCategory: string;
  targetBehavior: string;
  behaviorTerm: string;
  definition: string;
  recommendedResponse: string;
  supportCategory: string;
  strategyName: string;
  recommendedStrategy: string;
  bloomLevel: string;
  learningObjective: string;
  exampleActivity: string;
  diffDimension: string;
  studentNeed: string;
  drivingQuestion: string;
  activityName: string;
  experienceType: string;
  groupSize: string;
  gameName: string;
  gameType: string;
  standardCode: string;
  standardTitle: string;
  topic: string;
  skillConcept: string;
  remediationStrategy: string;
  difficulty: string;
  policyCategory: string;
  procedureName: string;
  purpose: string;
  steps: string;
  requiredOutcomes: string;
  expectedResponse: string;
  resourceType: string;
  student: string;
  observation: string;
  recommendedAction: string;
};

function initialUpload(layer: KbLayer): UploadForm {
  return {
    contentType: defaultContentType(layer),
    pedagogy: "blooms",
    title: "",
    subject: "science",
    grades: ["6-8"],
    tags: "",
    status: "draft",
    fileName: "",
    behaviorCategory: "disruptive",
    targetBehavior: "",
    behaviorTerm: "",
    definition: "",
    recommendedResponse: "",
    supportCategory: "autism",
    strategyName: "",
    recommendedStrategy: "",
    bloomLevel: "understand",
    learningObjective: "",
    exampleActivity: "",
    diffDimension: "content",
    studentNeed: "",
    drivingQuestion: "",
    activityName: "",
    experienceType: "hands_on",
    groupSize: "4",
    gameName: "",
    gameType: "",
    standardCode: "",
    standardTitle: "",
    topic: "",
    skillConcept: "",
    remediationStrategy: "",
    difficulty: "medium",
    policyCategory: "conduct",
    procedureName: "",
    purpose: "",
    steps: "",
    requiredOutcomes: "",
    expectedResponse: "",
    resourceType: "worksheet",
    student: "",
    observation: "",
    recommendedAction: "",
  };
}

function toggleGrade(grades: string[], id: string): string[] {
  return grades.includes(id)
    ? grades.filter((g) => g !== id)
    : [...grades, id];
}

export default function KnowledgeBasePage() {
  const { session } = useAuth();
  const role = session?.role ?? "teacher";

  const [layer, setLayer] = useState<KbLayer>(
    role === "platform" ? "platform" : role === "school" ? "school" : "teacher",
  );
  const [promos, setPromos] = useState<Promo[]>([
    {
      id: "pr1",
      title: "Food chains — my draft lesson",
      target: "school",
      reason: "Useful for other Year 7 science teachers",
      status: "pending",
      from: "A. Chen",
    },
    {
      id: "pr2",
      title: "Trauma-informed discussion stems",
      target: "platform",
      reason: "Strong cross-school pedagogy pack",
      status: "pending",
      from: "A. Chen",
    },
  ]);
  const [promoOpen, setPromoOpen] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [target, setTarget] = useState<"school" | "platform">("school");
  const [upload, setUpload] = useState<UploadForm>(() =>
    initialUpload(
      role === "platform" ? "platform" : role === "school" ? "school" : "teacher",
    ),
  );
  const [uploadNote, setUploadNote] = useState<string | null>(null);
  const [allDocs, setAllDocs] = useState<KbDoc[]>(KB_DOCS);
  const [viewDocId, setViewDocId] = useState<string | null>(null);
  const [docsHydrated, setDocsHydrated] = useState(false);

  useEffect(() => {
    const stored = loadStoredDocs();
    if (stored?.length) setAllDocs(stored);
    setDocsHydrated(true);
  }, []);

  useEffect(() => {
    if (!docsHydrated) return;
    try {
      localStorage.setItem(KB_DOCS_STORAGE_KEY, JSON.stringify(allDocs));
    } catch {
      /* ignore */
    }
  }, [allDocs, docsHydrated]);

  useEffect(() => {
    const next: KbLayer =
      role === "platform"
        ? "platform"
        : role === "school"
          ? "school"
          : "teacher";
    setLayer(next);
    setUpload(initialUpload(next));
    setUploadNote(null);
    setViewDocId(null);
  }, [role]);

  useEffect(() => {
    if (!viewDocId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setViewDocId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewDocId]);

  const docs = useMemo(
    () => allDocs.filter((d) => d.layer === layer),
    [allDocs, layer],
  );
  const viewDoc = useMemo(
    () => allDocs.find((d) => d.id === viewDocId) ?? null,
    [allDocs, viewDocId],
  );

  const layerOptions = (
    [
      ["platform", KB.layers.platform],
      ["school", KB.layers.school],
      ["teacher", KB.layers.teacher],
    ] as const
  ).filter(([id]) => {
    if (role === "platform") return id === "platform";
    if (role === "school") return id === "platform" || id === "school";
    return true;
  });

  const contentTypes = CONTENT_TYPES_BY_LAYER[layer];
  const showUpload =
    role === "teacher" ||
    (role === "school" && layer === "school") ||
    (role === "platform" && layer === "platform");

  const reviewQueue = promos.filter((p) => {
    if (p.status !== "pending") return false;
    if (role === "school") return p.target === "school";
    if (role === "platform") return p.target === "platform";
    return false;
  });

  function setLayerAndReset(next: KbLayer) {
    setLayer(next);
    setUpload(initialUpload(next));
    setUploadNote(null);
  }

  function patchUpload(patch: Partial<UploadForm>) {
    setUpload((prev) => ({ ...prev, ...patch }));
    setUploadNote(null);
  }

  function requestPromo(title: string) {
    if (!reason.trim()) return;
    setPromos((p) => [
      {
        id: `pr${Date.now()}`,
        title,
        target,
        reason,
        status: "pending",
        from: session?.name ?? "Teacher",
      },
      ...p,
    ]);
    setPromoOpen(null);
    setReason("");
  }

  function handleUpload() {
    if (!upload.title.trim()) return;
    const typeLabel = contentTypeLabel(layer, upload.contentType);
    const pedagogyLabel =
      upload.contentType === "pedagogy_frameworks"
        ? PEDAGOGY_FRAMEWORKS.find((p) => p.id === upload.pedagogy)?.label
        : null;
    const title = upload.title.trim();
    const fileName = upload.fileName || "untitled.txt";
    const nextDoc: KbDoc = {
      id: `u${Date.now()}`,
      layer,
      title,
      tags: upload.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      folder: typeLabel,
      fileName,
      status: upload.status,
      uploadedAt: todayIso(),
    };
    setAllDocs((prev) => [nextDoc, ...prev]);
    setUploadNote(
      [title, typeLabel, pedagogyLabel, fileName, upload.status]
        .filter(Boolean)
        .join(" · "),
    );
    setUpload((prev) => ({
      ...prev,
      title: "",
      tags: "",
      fileName: "",
      student: "",
    }));
  }

  function deleteDoc(id: string) {
    setAllDocs((prev) => prev.filter((d) => d.id !== id));
    if (viewDocId === id) setViewDocId(null);
    if (promoOpen === id) setPromoOpen(null);
  }

  function downloadDoc(doc: KbDoc) {
    const content = [
      `${doc.title}`,
      `Layer: ${doc.layer}`,
      `Type: ${doc.folder}`,
      `File: ${doc.fileName}`,
      `Status: ${doc.status}`,
      `Uploaded: ${doc.uploadedAt}`,
      doc.tags.length ? `Tags: ${doc.tags.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.fileName || `${doc.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function renderTypeFields() {
    const f = KB.typeFields;
    const ct = upload.contentType;

    if (ct === "behavior_plans") {
      return (
        <>
          <div className="field">
            <label>{f.behaviorCategory}</label>
            <select
              value={upload.behaviorCategory}
              onChange={(e) =>
                patchUpload({ behaviorCategory: e.target.value })
              }
            >
              {BEHAVIOR_CATEGORIES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>{f.targetBehavior}</label>
            <input
              value={upload.targetBehavior}
              onChange={(e) => patchUpload({ targetBehavior: e.target.value })}
              placeholder="e.g. Frequent interruptions"
            />
          </div>
        </>
      );
    }

    if (ct === "behavior_glossary") {
      return (
        <>
          <div className="field">
            <label>{f.behaviorTerm}</label>
            <input
              value={upload.behaviorTerm}
              onChange={(e) => patchUpload({ behaviorTerm: e.target.value })}
              placeholder="e.g. Classroom interruption"
            />
          </div>
          <div className="field">
            <label>{f.definition}</label>
            <textarea
              rows={2}
              value={upload.definition}
              onChange={(e) => patchUpload({ definition: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.recommendedResponse}</label>
            <textarea
              rows={2}
              value={upload.recommendedResponse}
              onChange={(e) =>
                patchUpload({ recommendedResponse: e.target.value })
              }
            />
          </div>
        </>
      );
    }

    if (ct === "student_support") {
      return (
        <>
          <div className="field">
            <label>{f.supportCategory}</label>
            <select
              value={upload.supportCategory}
              onChange={(e) =>
                patchUpload({ supportCategory: e.target.value })
              }
            >
              {SUPPORT_CATEGORIES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>{f.strategyName}</label>
            <input
              value={upload.strategyName}
              onChange={(e) => patchUpload({ strategyName: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.recommendedStrategy}</label>
            <textarea
              rows={2}
              value={upload.recommendedStrategy}
              onChange={(e) =>
                patchUpload({ recommendedStrategy: e.target.value })
              }
            />
          </div>
        </>
      );
    }

    if (ct === "pedagogy_frameworks") {
      return renderPedagogyFields();
    }

    if (ct === "curriculum_standards") {
      return (
        <>
          <div className="field">
            <label>{f.standardCode}</label>
            <input
              value={upload.standardCode}
              onChange={(e) => patchUpload({ standardCode: e.target.value })}
              placeholder="e.g. SCI.7.LS.2"
            />
          </div>
          <div className="field">
            <label>{f.standardTitle}</label>
            <input
              value={upload.standardTitle}
              onChange={(e) => patchUpload({ standardTitle: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.learningObjective}</label>
            <textarea
              rows={2}
              value={upload.learningObjective}
              onChange={(e) =>
                patchUpload({ learningObjective: e.target.value })
              }
            />
          </div>
        </>
      );
    }

    if (ct === "remediation") {
      return (
        <>
          <div className="field">
            <label>{f.topic}</label>
            <input
              value={upload.topic}
              onChange={(e) => patchUpload({ topic: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.skillConcept}</label>
            <input
              value={upload.skillConcept}
              onChange={(e) => patchUpload({ skillConcept: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.difficulty}</label>
            <select
              value={upload.difficulty}
              onChange={(e) => patchUpload({ difficulty: e.target.value })}
            >
              {DIFFICULTY_LEVELS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>{f.remediationStrategy}</label>
            <textarea
              rows={2}
              value={upload.remediationStrategy}
              onChange={(e) =>
                patchUpload({ remediationStrategy: e.target.value })
              }
            />
          </div>
        </>
      );
    }

    if (ct === "school_policy") {
      return (
        <div className="field">
          <label>{f.policyCategory}</label>
          <select
            value={upload.policyCategory}
            onChange={(e) => patchUpload({ policyCategory: e.target.value })}
          >
            {POLICY_CATEGORIES.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (ct === "admin_procedures") {
      return (
        <>
          <div className="field">
            <label>{f.procedureName}</label>
            <input
              value={upload.procedureName}
              onChange={(e) => patchUpload({ procedureName: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.purpose}</label>
            <textarea
              rows={2}
              value={upload.purpose}
              onChange={(e) => patchUpload({ purpose: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.steps}</label>
            <textarea
              rows={3}
              value={upload.steps}
              onChange={(e) => patchUpload({ steps: e.target.value })}
            />
          </div>
        </>
      );
    }

    if (ct === "teaching_scope") {
      return (
        <>
          <div className="field">
            <label>{f.topic}</label>
            <input
              value={upload.topic}
              onChange={(e) => patchUpload({ topic: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.requiredOutcomes}</label>
            <textarea
              rows={2}
              value={upload.requiredOutcomes}
              onChange={(e) =>
                patchUpload({ requiredOutcomes: e.target.value })
              }
            />
          </div>
        </>
      );
    }

    if (ct === "classroom_behavior") {
      return (
        <>
          <div className="field">
            <label>{f.behaviorCategory}</label>
            <select
              value={upload.behaviorCategory}
              onChange={(e) =>
                patchUpload({ behaviorCategory: e.target.value })
              }
            >
              {BEHAVIOR_CATEGORIES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>{f.expectedResponse}</label>
            <textarea
              rows={2}
              value={upload.expectedResponse}
              onChange={(e) =>
                patchUpload({ expectedResponse: e.target.value })
              }
            />
          </div>
        </>
      );
    }

    if (ct === "lesson_plans") {
      return (
        <>
          <div className="field">
            <label>{f.topic}</label>
            <input
              value={upload.topic}
              onChange={(e) => patchUpload({ topic: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.learningObjective}</label>
            <textarea
              rows={2}
              value={upload.learningObjective}
              onChange={(e) =>
                patchUpload({ learningObjective: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label>{KB.fields.pedagogy}</label>
            <select
              value={upload.pedagogy}
              onChange={(e) =>
                patchUpload({ pedagogy: e.target.value as PedagogyId })
              }
            >
              {PEDAGOGY_FRAMEWORKS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </>
      );
    }

    if (ct === "class_resources") {
      return (
        <div className="field">
          <label>{f.resourceType}</label>
          <select
            value={upload.resourceType}
            onChange={(e) => patchUpload({ resourceType: e.target.value })}
          >
            {RESOURCE_TYPES.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (ct === "student_notes") {
      return (
        <>
          <div className="field">
            <label>{f.student}</label>
            <input
              value={upload.student}
              onChange={(e) => patchUpload({ student: e.target.value })}
              placeholder={KB.fields.studentIdPlaceholder}
            />
          </div>
          <div className="field">
            <label>{f.topic}</label>
            <input
              value={upload.topic}
              onChange={(e) => patchUpload({ topic: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.observation}</label>
            <textarea
              rows={2}
              value={upload.observation}
              onChange={(e) => patchUpload({ observation: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.recommendedAction}</label>
            <textarea
              rows={2}
              value={upload.recommendedAction}
              onChange={(e) =>
                patchUpload({ recommendedAction: e.target.value })
              }
            />
          </div>
        </>
      );
    }

    return null;
  }

  function renderPedagogyFields() {
    const f = KB.typeFields;
    const p = upload.pedagogy;

    if (p === "blooms") {
      return (
        <>
          <div className="field">
            <label>{f.bloomLevel}</label>
            <select
              value={upload.bloomLevel}
              onChange={(e) => patchUpload({ bloomLevel: e.target.value })}
            >
              {BLOOM_LEVEL_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>{f.learningObjective}</label>
            <textarea
              rows={2}
              value={upload.learningObjective}
              onChange={(e) =>
                patchUpload({ learningObjective: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label>{f.exampleActivity}</label>
            <textarea
              rows={2}
              value={upload.exampleActivity}
              onChange={(e) =>
                patchUpload({ exampleActivity: e.target.value })
              }
            />
          </div>
        </>
      );
    }

    if (p === "differentiated") {
      return (
        <>
          <div className="field">
            <label>{f.strategyName}</label>
            <input
              value={upload.strategyName}
              onChange={(e) => patchUpload({ strategyName: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.diffDimension}</label>
            <select
              value={upload.diffDimension}
              onChange={(e) => patchUpload({ diffDimension: e.target.value })}
            >
              {DIFF_DIMENSIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>{f.studentNeed}</label>
            <input
              value={upload.studentNeed}
              onChange={(e) => patchUpload({ studentNeed: e.target.value })}
            />
          </div>
        </>
      );
    }

    if (p === "inquiry") {
      return (
        <>
          <div className="field">
            <label>{f.drivingQuestion}</label>
            <input
              value={upload.drivingQuestion}
              onChange={(e) =>
                patchUpload({ drivingQuestion: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label>{f.learningObjective}</label>
            <textarea
              rows={2}
              value={upload.learningObjective}
              onChange={(e) =>
                patchUpload({ learningObjective: e.target.value })
              }
            />
          </div>
        </>
      );
    }

    if (p === "experiential") {
      return (
        <>
          <div className="field">
            <label>{f.activityName}</label>
            <input
              value={upload.activityName}
              onChange={(e) => patchUpload({ activityName: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.experienceType}</label>
            <select
              value={upload.experienceType}
              onChange={(e) => patchUpload({ experienceType: e.target.value })}
            >
              {EXPERIENCE_TYPES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>{f.learningObjective}</label>
            <textarea
              rows={2}
              value={upload.learningObjective}
              onChange={(e) =>
                patchUpload({ learningObjective: e.target.value })
              }
            />
          </div>
        </>
      );
    }

    if (p === "explicit") {
      return (
        <>
          <div className="field">
            <label>{f.strategyName}</label>
            <input
              value={upload.strategyName}
              onChange={(e) => patchUpload({ strategyName: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.learningObjective}</label>
            <textarea
              rows={2}
              value={upload.learningObjective}
              onChange={(e) =>
                patchUpload({ learningObjective: e.target.value })
              }
            />
          </div>
        </>
      );
    }

    if (p === "cooperative") {
      return (
        <>
          <div className="field">
            <label>{f.activityName}</label>
            <input
              value={upload.activityName}
              onChange={(e) => patchUpload({ activityName: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.groupSize}</label>
            <input
              value={upload.groupSize}
              onChange={(e) => patchUpload({ groupSize: e.target.value })}
            />
          </div>
          <div className="field">
            <label>{f.learningObjective}</label>
            <textarea
              rows={2}
              value={upload.learningObjective}
              onChange={(e) =>
                patchUpload({ learningObjective: e.target.value })
              }
            />
          </div>
        </>
      );
    }

    // gamification
    return (
      <>
        <div className="field">
          <label>{f.gameName}</label>
          <input
            value={upload.gameName}
            onChange={(e) => patchUpload({ gameName: e.target.value })}
          />
        </div>
        <div className="field">
          <label>{f.gameType}</label>
          <input
            value={upload.gameType}
            onChange={(e) => patchUpload({ gameType: e.target.value })}
          />
        </div>
        <div className="field">
          <label>{f.learningObjective}</label>
          <textarea
            rows={2}
            value={upload.learningObjective}
            onChange={(e) =>
              patchUpload({ learningObjective: e.target.value })
            }
          />
        </div>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-6xl fade-in">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {KB.title}
        </h1>
        <p className="mt-1 text-[var(--ink-muted)]">{KB.subtitle}</p>
      </header>

      <div className="mb-5 flex flex-wrap gap-2">
        {layerOptions.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`btn ${layer === id ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setLayerAndReset(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-5">
          {showUpload && (
            <section className="surface p-6">
              <h2 className="font-display text-xl font-semibold">{KB.upload}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="field">
                  <label>{KB.fields.contentType}</label>
                  <select
                    value={upload.contentType}
                    onChange={(e) =>
                      patchUpload({
                        contentType: e.target.value as ContentTypeId,
                      })
                    }
                  >
                    {contentTypes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {upload.contentType === "pedagogy_frameworks" ? (
                  <div className="field">
                    <label>{KB.fields.pedagogy}</label>
                    <select
                      value={upload.pedagogy}
                      onChange={(e) =>
                        patchUpload({
                          pedagogy: e.target.value as PedagogyId,
                        })
                      }
                    >
                      {PEDAGOGY_FRAMEWORKS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="field">
                    <label>{KB.fields.title}</label>
                    <input
                      value={upload.title}
                      onChange={(e) => patchUpload({ title: e.target.value })}
                      placeholder="e.g. Introduction to Inquiry-Based Learning"
                    />
                  </div>
                )}

                {upload.contentType === "pedagogy_frameworks" && (
                  <div className="field sm:col-span-2">
                    <label>{KB.fields.title}</label>
                    <input
                      value={upload.title}
                      onChange={(e) => patchUpload({ title: e.target.value })}
                      placeholder="e.g. Introduction to Inquiry-Based Learning"
                    />
                  </div>
                )}

                <div className="contents">{renderTypeFields()}</div>

                <div className="field">
                  <label>{KB.fields.subject}</label>
                  <select
                    value={upload.subject}
                    onChange={(e) => patchUpload({ subject: e.target.value })}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>{KB.fields.status}</label>
                  <select
                    value={upload.status}
                    onChange={(e) =>
                      patchUpload({
                        status: e.target.value as "draft" | "published",
                      })
                    }
                  >
                    {UPLOAD_STATUSES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field sm:col-span-2">
                  <label>{KB.fields.gradeLevel}</label>
                  <div className="flex flex-wrap gap-2">
                    {GRADE_LEVELS.map((g) => {
                      const active = upload.grades.includes(g.id);
                      return (
                        <button
                          key={g.id}
                          type="button"
                          className={`pill ${
                            active
                              ? "bg-[var(--brand-soft)] text-[var(--brand-deep)]"
                              : "bg-[var(--bg)] text-[var(--ink-muted)]"
                          }`}
                          onClick={() =>
                            patchUpload({
                              grades: toggleGrade(upload.grades, g.id),
                            })
                          }
                        >
                          {g.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="field">
                  <label>
                    {KB.fields.tags}{" "}
                    <span className="font-normal text-[var(--ink-faint)]">
                      ({KB.fields.optional})
                    </span>
                  </label>
                  <input
                    value={upload.tags}
                    onChange={(e) => patchUpload({ tags: e.target.value })}
                    placeholder={KB.fields.tagsHint}
                  />
                </div>

                <div className="field">
                  <label>{KB.fields.file}</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                    onChange={(e) =>
                      patchUpload({
                        fileName: e.target.files?.[0]?.name ?? "",
                      })
                    }
                  />
                  {upload.fileName ? (
                    <p className="text-xs text-[var(--ink-muted)]">
                      {upload.fileName}
                    </p>
                  ) : null}
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleUpload}
                    disabled={!upload.title.trim()}
                  >
                    {KB.fields.submit}
                  </button>
                  {uploadNote ? (
                    <p className="mt-2 text-xs text-[var(--ok)]">
                      {KB.fields.uploadedDemo}: {uploadNote}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          )}

          <section className="surface p-6">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="font-display text-xl font-semibold">
                  {KB.uploadedDocs}
                </h2>
                <p className="mt-1 text-sm text-[var(--ink-muted)]">
                  {docs.length} document{docs.length === 1 ? "" : "s"} in this
                  layer
                </p>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)] text-[var(--ink-faint)]">
                    <th className="pb-2 pr-3 font-medium">
                      {KB.docCols.title}
                    </th>
                    <th className="pb-2 pr-3 font-medium">{KB.docCols.type}</th>
                    <th className="pb-2 pr-3 font-medium">{KB.docCols.file}</th>
                    <th className="pb-2 pr-3 font-medium">
                      {KB.docCols.status}
                    </th>
                    <th className="pb-2 pr-3 font-medium">
                      {KB.docCols.uploadedAt}
                    </th>
                    <th className="pb-2 text-right font-medium">
                      {KB.docCols.actions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc) => (
                    <tr key={doc.id} className="border-b border-[var(--line)]">
                      <td className="py-2.5 pr-3 font-medium">{doc.title}</td>
                      <td className="py-2.5 pr-3 text-[var(--ink-muted)]">
                        {doc.folder}
                      </td>
                      <td className="py-2.5 pr-3 font-mono text-xs text-[var(--ink-muted)]">
                        {doc.fileName}
                      </td>
                      <td className="py-2.5 pr-3">
                        <span
                          className={`pill ${
                            doc.status === "published"
                              ? "bg-[var(--ok-soft)] text-[var(--ok)]"
                              : "bg-[var(--bg)] text-[var(--ink-muted)]"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 text-[var(--ink-muted)]">
                        {doc.uploadedAt}
                      </td>
                      <td className="py-2.5">
                        <div className="flex flex-nowrap items-center justify-end gap-1">
                          <button
                            type="button"
                            className={actionBtnClass}
                            title={KB.docActions.view}
                            aria-label={KB.docActions.view}
                            onClick={() => setViewDocId(doc.id)}
                          >
                            <IconView />
                          </button>
                          <button
                            type="button"
                            className={actionBtnClass}
                            title={KB.docActions.download}
                            aria-label={KB.docActions.download}
                            onClick={() => downloadDoc(doc)}
                          >
                            <IconDownload />
                          </button>
                          {role === "teacher" && layer === "teacher" && (
                            <button
                              type="button"
                              className={actionBtnClass}
                              title={KB.docActions.promote}
                              aria-label={KB.docActions.promote}
                              onClick={() => setPromoOpen(doc.id)}
                            >
                              <IconPromote />
                            </button>
                          )}
                          <button
                            type="button"
                            className={actionDangerBtnClass}
                            title={KB.docActions.delete}
                            aria-label={KB.docActions.delete}
                            onClick={() => deleteDoc(doc.id)}
                          >
                            <IconDelete />
                          </button>
                        </div>
                        {promoOpen === doc.id &&
                          role === "teacher" &&
                          layer === "teacher" && (
                            <div className="mt-2 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-elevated)] p-2 text-left">
                              <div className="field">
                                <label>Promote to</label>
                                <select
                                  value={target}
                                  onChange={(e) =>
                                    setTarget(
                                      e.target.value as "school" | "platform",
                                    )
                                  }
                                >
                                  <option value="school">School KB</option>
                                  <option value="platform">Platform KB</option>
                                </select>
                              </div>
                              <div className="field mt-2">
                                <label>Reason</label>
                                <textarea
                                  rows={2}
                                  value={reason}
                                  onChange={(e) => setReason(e.target.value)}
                                />
                              </div>
                              <div className="mt-2 flex gap-3">
                                <button
                                  type="button"
                                  className="text-xs font-semibold text-[var(--brand)] hover:underline"
                                  onClick={() => requestPromo(doc.title)}
                                >
                                  Submit
                                </button>
                                <button
                                  type="button"
                                  className="text-xs font-semibold text-[var(--ink-muted)] hover:underline"
                                  onClick={() => setPromoOpen(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                      </td>
                    </tr>
                  ))}
                  {docs.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-4 text-[var(--ink-faint)]"
                      >
                        {KB.uploadedDocsEmpty}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="min-w-0 space-y-3">
          <div className="surface overflow-hidden p-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">
              {KB.uploaded}
            </h2>
            <ul className="mt-2">
              {docs.map((doc) => (
                <li
                  key={doc.id}
                  className="border-t border-[var(--line)] py-2.5 first:border-t-0 first:pt-0"
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => setViewDocId(doc.id)}
                  >
                    <p className="text-sm font-medium leading-snug break-words">
                      {doc.title}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-[var(--ink-faint)]">
                      {doc.folder} · {doc.status}
                    </p>
                  </button>
                </li>
              ))}
              {docs.length === 0 && (
                <li className="text-xs text-[var(--ink-faint)]">
                  {KB.uploadedDocsEmpty}
                </li>
              )}
            </ul>
          </div>

          {role === "teacher" && (
            <div className="surface overflow-hidden p-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">
                Promotions
              </h2>
              <ul className="mt-2">
                {promos.map((p) => (
                  <li
                    key={p.id}
                    className="border-t border-[var(--line)] py-2.5 first:border-t-0 first:pt-0"
                  >
                    <p className="text-sm font-medium leading-snug break-words">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--ink-faint)]">
                      {p.target === "school" ? "School" : "Platform"} ·{" "}
                      {p.status}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(role === "school" || role === "platform") && (
            <div className="surface overflow-hidden p-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">
                {role === "school" ? "School queue" : "Platform queue"}
              </h2>
              <ul className="mt-2">
                {reviewQueue.map((p) => (
                  <li
                    key={p.id}
                    className="border-t border-[var(--line)] py-2.5 first:border-t-0 first:pt-0"
                  >
                    <p className="text-sm font-medium leading-snug break-words">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--ink-faint)]">
                      {p.from}
                    </p>
                    <div className="mt-1.5 flex gap-3">
                      <button
                        type="button"
                        className="text-xs font-semibold text-[var(--brand)] hover:underline"
                        onClick={() =>
                          setPromos((all) =>
                            all.map((x) =>
                              x.id === p.id
                                ? { ...x, status: "approved" }
                                : x,
                            ),
                          )
                        }
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="text-xs font-semibold text-[var(--ink-muted)] hover:underline"
                        onClick={() =>
                          setPromos((all) =>
                            all.map((x) =>
                              x.id === p.id
                                ? { ...x, status: "rejected" }
                                : x,
                            ),
                          )
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
                {reviewQueue.length === 0 && (
                  <li className="text-xs text-[var(--ink-faint)]">Queue clear</li>
                )}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {viewDoc ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kb-doc-view-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[var(--ink)]/40"
            aria-label={KB.docActions.close}
            onClick={() => setViewDocId(null)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-lg fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3
                  id="kb-doc-view-title"
                  className="font-display text-xl font-semibold leading-snug"
                >
                  {viewDoc.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--ink-muted)]">
                  {viewDoc.folder}
                </p>
              </div>
              <button
                type="button"
                className="shrink-0 text-sm font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)]"
                onClick={() => setViewDocId(null)}
              >
                {KB.docActions.close}
              </button>
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[var(--ink-faint)]">{KB.viewModal.file}</dt>
                <dd className="mt-0.5 font-mono text-xs">{viewDoc.fileName}</dd>
              </div>
              <div>
                <dt className="text-[var(--ink-faint)]">{KB.viewModal.type}</dt>
                <dd className="mt-0.5">{viewDoc.folder}</dd>
              </div>
              <div>
                <dt className="text-[var(--ink-faint)]">
                  {KB.viewModal.status}
                </dt>
                <dd className="mt-0.5">
                  <span
                    className={`pill ${
                      viewDoc.status === "published"
                        ? "bg-[var(--ok-soft)] text-[var(--ok)]"
                        : "bg-[var(--bg)] text-[var(--ink-muted)]"
                    }`}
                  >
                    {viewDoc.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-[var(--ink-faint)]">
                  {KB.viewModal.uploaded}
                </dt>
                <dd className="mt-0.5">{viewDoc.uploadedAt}</dd>
              </div>
            </dl>

            {viewDoc.tags.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-[var(--ink-faint)]">
                  {KB.viewModal.tags}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {viewDoc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="pill bg-[var(--brand-soft)] text-[var(--brand-deep)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => downloadDoc(viewDoc)}
              >
                <IconDownload />
                {KB.docActions.download}
              </button>
              <button
                type="button"
                className="btn btn-ghost text-[var(--danger)]"
                onClick={() => deleteDoc(viewDoc.id)}
              >
                <IconDelete />
                {KB.docActions.delete}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
