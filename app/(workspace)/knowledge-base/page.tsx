"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { KB_DOCS } from "@/lib/mock-data";
import { KB } from "@/lib/messages";

type Promo = {
  id: string;
  title: string;
  target: "school" | "platform";
  reason: string;
  status: "pending" | "approved" | "rejected";
  from?: string;
};

export default function KnowledgeBasePage() {
  const { session } = useAuth();
  const role = session?.role ?? "teacher";

  const [layer, setLayer] = useState<"platform" | "school" | "teacher">(
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
  const [upload, setUpload] = useState({
    title: "",
    subject: "science",
    grade: "6-8",
    pedagogy: "socratic",
    bloom: "understand",
  });

  useEffect(() => {
    if (role === "platform") setLayer("platform");
    else if (role === "school") setLayer("school");
    else setLayer("teacher");
  }, [role]);

  const docs = useMemo(
    () => KB_DOCS.filter((d) => d.layer === layer),
    [layer],
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

  const reviewQueue = promos.filter((p) => {
    if (p.status !== "pending") return false;
    if (role === "school") return p.target === "school";
    if (role === "platform") return p.target === "platform";
    return false;
  });

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

  return (
    <div className="mx-auto max-w-5xl fade-in">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {KB.title}
        </h1>
        <p className="mt-1 text-[var(--ink-muted)]">{KB.subtitle}</p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {layerOptions.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`btn ${layer === id ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setLayer(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="space-y-3">
          {docs.map((doc) => (
            <article key={doc.id} className="surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--ink-faint)]">
                {doc.folder}
              </p>
              <h2 className="mt-1 font-semibold">{doc.title}</h2>
              <div className="mt-2 flex flex-wrap gap-1">
                {doc.tags.map((t) => (
                  <span
                    key={t}
                    className="pill bg-[var(--bg)] text-[var(--ink-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {role === "teacher" && layer === "teacher" && (
                <div className="mt-3">
                  {promoOpen === doc.id ? (
                    <div className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-elevated)] p-3">
                      <div className="field">
                        <label>Promote to</label>
                        <select
                          value={target}
                          onChange={(e) =>
                            setTarget(e.target.value as "school" | "platform")
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
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => requestPromo(doc.title)}
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => setPromoOpen(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setPromoOpen(doc.id)}
                    >
                      {KB.promote}
                    </button>
                  )}
                </div>
              )}
            </article>
          ))}
        </section>

        <aside className="space-y-4">
          {(role === "teacher" ||
            (role === "school" && layer === "school") ||
            (role === "platform" && layer === "platform")) && (
            <div className="surface p-4">
              <h2 className="font-semibold">{KB.upload}</h2>
              <div className="mt-3 grid gap-3">
                <div className="field">
                  <label>Title</label>
                  <input
                    value={upload.title}
                    onChange={(e) =>
                      setUpload({ ...upload, title: e.target.value })
                    }
                    placeholder="Document title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="field">
                    <label>Subject</label>
                    <select
                      value={upload.subject}
                      onChange={(e) =>
                        setUpload({ ...upload, subject: e.target.value })
                      }
                    >
                      <option>science</option>
                      <option>math</option>
                      <option>ela</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Grade</label>
                    <select
                      value={upload.grade}
                      onChange={(e) =>
                        setUpload({ ...upload, grade: e.target.value })
                      }
                    >
                      <option>3-5</option>
                      <option>6-8</option>
                      <option>9-12</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Pedagogy</label>
                    <select
                      value={upload.pedagogy}
                      onChange={(e) =>
                        setUpload({ ...upload, pedagogy: e.target.value })
                      }
                    >
                      <option>socratic</option>
                      <option>inquiry</option>
                      <option>explicit</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Bloom</label>
                    <select
                      value={upload.bloom}
                      onChange={(e) =>
                        setUpload({ ...upload, bloom: e.target.value })
                      }
                    >
                      <option>understand</option>
                      <option>apply</option>
                      <option>analyze</option>
                    </select>
                  </div>
                </div>
                <button type="button" className="btn btn-primary">
                  Tag & upload (demo)
                </button>
              </div>
            </div>
          )}

          {role === "teacher" && (
            <div className="surface p-4">
              <h2 className="font-semibold">My promotion requests</h2>
              <ul className="mt-3 space-y-3">
                {promos.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-[var(--radius-sm)] border border-[var(--line)] p-3"
                  >
                    <p className="text-sm font-semibold">{p.title}</p>
                    <p className="mt-1 text-xs text-[var(--ink-muted)]">
                      → {p.target === "school" ? "School KB" : "Platform KB"}
                    </p>
                    <span
                      className={`pill mt-2 ${
                        p.status === "approved"
                          ? "bg-[var(--ok-soft)] text-[var(--ok)]"
                          : p.status === "rejected"
                            ? "bg-[var(--danger-soft)] text-[var(--danger)]"
                            : "bg-[var(--warn-soft)] text-[var(--warn)]"
                      }`}
                    >
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(role === "school" || role === "platform") && (
            <div className="surface p-4">
              <h2 className="font-semibold">
                {role === "school"
                  ? "School review queue"
                  : "Platform review queue"}
              </h2>
              <p className="mt-1 text-xs text-[var(--ink-faint)]">
                Attribution visible here; anonymized after approval.
              </p>
              <ul className="mt-3 space-y-3">
                {reviewQueue.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-[var(--radius-sm)] border border-[var(--line)] p-3"
                  >
                    <p className="text-sm font-semibold">{p.title}</p>
                    <p className="mt-1 text-xs text-[var(--ink-muted)]">
                      From {p.from} · {p.reason}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        className="btn btn-primary"
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
                        className="btn btn-secondary"
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
                  <li className="text-sm text-[var(--ink-faint)]">Queue clear</li>
                )}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
