"use client";

import { useMemo, useState } from "react";
import {
  BLOOM_LEVELS,
  PEDAGOGY_MODES,
  SAMPLE_LESSON,
  SAMPLE_SLIDE_JSON,
  type BloomLevel,
} from "@/lib/mock-data";
import { CHAT, PLANNER } from "@/lib/messages";

type Setup = {
  subject: string;
  gradeBand: string;
  topic: string;
  duration: string;
  classType: string;
  standards: string;
  sourceMode: string;
};

const DEFAULT_SETUP: Setup = {
  subject: "Science",
  gradeBand: "6-8",
  topic: "Food chains",
  duration: "45",
  classType: "general_education",
  standards: "",
  sourceMode: "internal_and_web",
};

type ChatMsg =
  | { kind: "user"; text: string; scope: string }
  | { kind: "assistant"; text: string; scope: string; layers: string[] }
  | { kind: "divider"; text: string };

export default function PlannerPage() {
  const [step, setStep] = useState(0);
  const [setup, setSetup] = useState<Setup>(DEFAULT_SETUP);
  const [mode, setMode] = useState<"progression" | "single">("progression");
  const [startLevel, setStartLevel] = useState<BloomLevel>("understand");
  const [endLevel, setEndLevel] = useState<BloomLevel>("analyze");
  const [pedagogy, setPedagogy] = useState("blooms");
  const [supports, setSupports] = useState({
    communication: "short_phrase",
    attention: true,
    sensory: false,
    intensity: "moderate",
    interests: "animals, drawing",
  });
  const [generated, setGenerated] = useState(false);
  const [outputTab, setOutputTab] = useState("overview");
  const [showSlideJson, setShowSlideJson] = useState(false);
  const [pptDemoNote, setPptDemoNote] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      kind: "assistant",
      text: "I can pull snippets from your KB for this lesson. I never trigger generation — only the Output Studio does.",
      scope: "Science · 6-8 · Food chains",
      layers: ["Platform KB", "School KB"],
    },
  ]);
  const [lastScope, setLastScope] = useState("Science · 6-8 · Food chains");

  const selectedLevels = useMemo(() => {
    const startIdx = BLOOM_LEVELS.findIndex((l) => l.id === startLevel);
    const endIdx = BLOOM_LEVELS.findIndex((l) => l.id === endLevel);
    if (mode === "single") return [startLevel];
    const [a, b] = startIdx <= endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
    return BLOOM_LEVELS.slice(a, b + 1).map((l) => l.id);
  }, [mode, startLevel, endLevel]);

  const liveScope = `${setup.subject} · ${setup.gradeBand} · ${setup.topic || "Untitled"}`;

  function updateSetup<K extends keyof Setup>(key: K, value: Setup[K]) {
    setSetup((prev) => {
      const next = { ...prev, [key]: value };
      const nextScope = `${next.subject} · ${next.gradeBand} · ${next.topic || "Untitled"}`;
      if (nextScope !== lastScope) {
        setMessages((msgs) => [
          ...msgs,
          { kind: "divider", text: `${CHAT.scopeChanged}: ${nextScope}` },
        ]);
        setLastScope(nextScope);
      }
      return next;
    });
  }

  function sendChat() {
    if (!chatInput.trim()) return;
    const scope = liveScope;
    const q = chatInput.trim();
    setChatInput("");
    setMessages((m) => [
      ...m,
      { kind: "user", text: q, scope },
      {
        kind: "assistant",
        text: `For “${setup.topic}” at grades ${setup.gradeBand}, try opening with a concrete organism example, then move into Socratic stems at the ${selectedLevels.join(" → ")} levels.`,
        scope,
        layers: ["Platform KB", "School KB"],
      },
    ]);
  }

  function generate() {
    setGenerated(true);
    setStep(4);
  }

  return (
    <div className="w-full fade-in">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {PLANNER.title}
          </h1>
          <p className="mt-1 text-[var(--ink-muted)]">{PLANNER.subtitle}</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setChatOpen((v) => !v)}
        >
          {chatOpen ? "Hide" : "Show"} {PLANNER.scopeBadge}
        </button>
      </header>

      <ol className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {PLANNER.steps.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                i === step
                  ? "bg-[var(--brand)] text-white"
                  : i < step
                    ? "bg-[var(--brand-soft)] text-[var(--brand-deep)]"
                    : "bg-[var(--surface)] text-[var(--ink-faint)] border border-[var(--line)]"
              }`}
            >
              {i + 1}. {label}
            </button>
          </li>
        ))}
      </ol>

      <div className={`grid gap-5 ${chatOpen ? "xl:grid-cols-[1fr_320px]" : ""}`}>
        <section className="surface p-5 sm:p-6">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field">
                <label>Subject</label>
                <select
                  value={setup.subject}
                  onChange={(e) => updateSetup("subject", e.target.value)}
                >
                  {["Science", "Math", "ELA", "Social Studies"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Grade band</label>
                <select
                  value={setup.gradeBand}
                  onChange={(e) => updateSetup("gradeBand", e.target.value)}
                >
                  {["K-2", "3-5", "6-8", "9-12"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="field sm:col-span-2">
                <label>Topic</label>
                <input
                  value={setup.topic}
                  onChange={(e) => updateSetup("topic", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Duration (minutes)</label>
                <input
                  value={setup.duration}
                  onChange={(e) => updateSetup("duration", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Class type</label>
                <select
                  value={setup.classType}
                  onChange={(e) => updateSetup("classType", e.target.value)}
                >
                  <option value="general_education">General education</option>
                  <option value="mixed">Mixed / inclusion</option>
                  <option value="special_needs">Special-needs focused</option>
                </select>
              </div>
              <div className="field sm:col-span-2 rounded-[var(--radius-sm)] border border-[var(--web)] bg-[var(--web-soft)] p-3">
                <label>Standards / objectives (optional)</label>
                <input
                  placeholder="e.g. NGSS MS-LS2-3"
                  value={setup.standards}
                  onChange={(e) => updateSetup("standards", e.target.value)}
                />
                <p className="mt-2 text-xs text-[var(--ink-muted)]">
                  {PLANNER.standardsHint}
                </p>
              </div>
              <div className="field sm:col-span-2">
                <label>Source mode</label>
                <select
                  value={setup.sourceMode}
                  onChange={(e) => updateSetup("sourceMode", e.target.value)}
                >
                  <option value="internal_only">Uploaded materials only</option>
                  <option value="internal_and_web">Uploaded + web</option>
                  <option value="web_only">Web only</option>
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["progression", "Multi-level progression"],
                    ["single", "Single-level lesson"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={`btn ${mode === id ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setMode(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {BLOOM_LEVELS.map((level) => {
                  const active = selectedLevels.includes(level.id);
                  return (
                    <div
                      key={level.id}
                      className={`min-w-[110px] flex-1 rounded-[var(--radius-sm)] border px-3 py-3 ${
                        active
                          ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                          : "border-[var(--line)] bg-[var(--bg)] opacity-55"
                      }`}
                    >
                      <p className="text-sm font-semibold">{level.label}</p>
                      <p className="mt-1 text-[11px] text-[var(--ink-muted)]">
                        {level.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="field">
                  <label>Start level</label>
                  <select
                    value={startLevel}
                    onChange={(e) =>
                      setStartLevel(e.target.value as BloomLevel)
                    }
                  >
                    {BLOOM_LEVELS.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
                {mode === "progression" && (
                  <div className="field">
                    <label>End level</label>
                    <select
                      value={endLevel}
                      onChange={(e) =>
                        setEndLevel(e.target.value as BloomLevel)
                      }
                    >
                      {BLOOM_LEVELS.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <p className="text-sm text-[var(--ink-muted)]">
                Selected pathway:{" "}
                <span className="font-semibold text-[var(--ink)]">
                  {selectedLevels
                    .map(
                      (id) => BLOOM_LEVELS.find((l) => l.id === id)?.label,
                    )
                    .join(" → ")}
                </span>
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-3">
              {PEDAGOGY_MODES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPedagogy(p.id)}
                  className={`rounded-[var(--radius)] border p-4 text-left transition-colors ${
                    pedagogy === p.id
                      ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                      : "border-[var(--line)] hover:border-[var(--line-strong)]"
                  }`}
                >
                  <p className="font-semibold">{p.label}</p>
                  <p className="mt-1 text-sm text-[var(--ink-muted)]">
                    {p.detail}
                  </p>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="rounded-[var(--radius-sm)] bg-[var(--ok-soft)] px-3 py-2 text-sm text-[var(--ok)]">
                Supports adjust delivery complexity. Cognitive targets stay
                fixed unless you change them.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="field">
                  <label>Communication level</label>
                  <select
                    value={supports.communication}
                    onChange={(e) =>
                      setSupports({
                        ...supports,
                        communication: e.target.value,
                      })
                    }
                  >
                    <option value="single_word">Single word / pointing</option>
                    <option value="short_phrase">Short phrase</option>
                    <option value="sentence_level">Sentence level</option>
                  </select>
                </div>
                <div className="field">
                  <label>Support intensity</label>
                  <select
                    value={supports.intensity}
                    onChange={(e) =>
                      setSupports({ ...supports, intensity: e.target.value })
                    }
                  >
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={supports.attention}
                    onChange={(e) =>
                      setSupports({
                        ...supports,
                        attention: e.target.checked,
                      })
                    }
                  />
                  Attention / chunking supports
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={supports.sensory}
                    onChange={(e) =>
                      setSupports({ ...supports, sensory: e.target.checked })
                    }
                  />
                  Sensory / movement breaks
                </label>
                <div className="field sm:col-span-2">
                  <label>PRT strengths / interest hooks</label>
                  <input
                    value={supports.interests}
                    onChange={(e) =>
                      setSupports({ ...supports, interests: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              {!generated ? (
                <div className="rounded-[var(--radius)] border border-dashed border-[var(--brand)] bg-[var(--brand-soft)] p-6 text-center">
                  <p className="font-display text-xl font-semibold">
                    Ready to generate
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-[var(--ink-muted)]">
                    Wizard fields are free. The engine fires once here and
                    persists the lesson for later review, regenerate, or
                    duplicate.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary mt-5"
                    onClick={generate}
                  >
                    {PLANNER.generate}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ["overview", "Overview"],
                      ["bloom", "Bloom map"],
                      ["questions", "Socratic"],
                      ["supports", "Supports"],
                      ["assessment", "Assessment"],
                    ].map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        className={`btn ${outputTab === id ? "btn-primary" : "btn-secondary"}`}
                        onClick={() => setOutputTab(id)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {outputTab === "overview" && (
                    <div>
                      <h2 className="font-display text-2xl font-semibold">
                        {SAMPLE_LESSON.title}
                      </h2>
                      <p className="mt-2 text-[var(--ink-muted)]">
                        {SAMPLE_LESSON.objective}
                      </p>
                      <p className="mt-3 text-sm">
                        Pedagogy:{" "}
                        <strong>
                          {
                            PEDAGOGY_MODES.find((p) => p.id === pedagogy)
                              ?.label
                          }
                        </strong>
                      </p>
                    </div>
                  )}

                  {outputTab === "bloom" && (
                    <div className="space-y-3">
                      {SAMPLE_LESSON.bloom_sequence.map((seg) => (
                        <div
                          key={seg.level}
                          className="rounded-[var(--radius-sm)] border border-[var(--line)] p-4"
                        >
                          <p className="pill bg-[var(--brand-soft)] text-[var(--brand-deep)]">
                            {seg.level}
                          </p>
                          <p className="mt-2 font-semibold">{seg.goal}</p>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--ink-muted)]">
                            {seg.teacher_moves.map((m) => (
                              <li key={m}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {outputTab === "questions" && (
                    <div className="space-y-3">
                      {SAMPLE_LESSON.bloom_sequence.map((seg) => (
                        <div key={seg.level}>
                          <p className="font-semibold capitalize">{seg.level}</p>
                          <ul className="mt-1 list-disc pl-5 text-sm text-[var(--ink-muted)]">
                            {seg.socratic_questions.map((q) => (
                              <li key={q}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {outputTab === "supports" && (
                    <div className="space-y-3">
                      {SAMPLE_LESSON.bloom_sequence.map((seg) => (
                        <div key={seg.level}>
                          <p className="font-semibold capitalize">{seg.level}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {seg.supports.map((s) => (
                              <span
                                key={s}
                                className="pill bg-[var(--accent-soft)] text-[var(--accent)]"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {outputTab === "assessment" && (
                    <div>
                      <p className="font-semibold">Checks for understanding</p>
                      <ul className="mt-2 list-disc pl-5 text-sm text-[var(--ink-muted)]">
                        {SAMPLE_LESSON.assessment.check_for_understanding.map(
                          (c) => (
                            <li key={c}>{c}</li>
                          ),
                        )}
                      </ul>
                      <p className="mt-4 font-semibold">Exit ticket</p>
                      <p className="mt-1 text-sm text-[var(--ink-muted)]">
                        {SAMPLE_LESSON.assessment.exit_ticket}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              {!generated && (
                <p className="text-sm text-[var(--warn)]">
                  Generate a lesson in Output Studio first.
                </p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Simplify language",
                  "Deepen higher-order thinking",
                  "Add more supports",
                  "Make more Socratic",
                  "Regenerate assessment",
                  "Generate quiz",
                ].map((action) => (
                  <button
                    key={action}
                    type="button"
                    className="btn btn-secondary justify-start"
                    disabled={!generated}
                  >
                    {action}
                  </button>
                ))}
              </div>

              <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg-elevated)] p-4">
                <h3 className="font-semibold">{PLANNER.exportPptTitle}</h3>
                <p className="mt-1 text-sm text-[var(--ink-muted)]">
                  {PLANNER.exportPptHint}
                </p>
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-xs text-[var(--ink-muted)]">
                  <li>Teacher selects lesson / teaching strategy</li>
                  <li>AI (Claude) returns structured slide JSON</li>
                  <li>App converts JSON → .pptx via PptxGenJS / python-pptx</li>
                  <li>Teacher downloads the file</li>
                </ol>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={!generated}
                    onClick={() => setShowSlideJson((v) => !v)}
                  >
                    {PLANNER.exportPptPreview}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!generated}
                    onClick={() => {
                      const blob = new Blob(
                        [JSON.stringify(SAMPLE_SLIDE_JSON, null, 2)],
                        { type: "application/json" },
                      );
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${setup.topic.replace(/\s+/g, "-").toLowerCase() || "lesson"}-slides.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      setPptDemoNote(PLANNER.exportPptDone);
                    }}
                  >
                    {PLANNER.exportPptDownload}
                  </button>
                </div>
                {showSlideJson && (
                  <pre className="mt-3 max-h-56 overflow-auto rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg)] p-3 text-[11px] leading-relaxed text-[var(--ink-muted)]">
                    {JSON.stringify(SAMPLE_SLIDE_JSON, null, 2)}
                  </pre>
                )}
                {pptDemoNote && (
                  <p className="mt-2 text-sm text-[var(--ok)]">{pptDemoNote}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
                {["DOCX", "PDF", "Google Drive"].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    className="btn btn-secondary"
                    disabled={!generated}
                  >
                    Export {fmt}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[var(--ink-faint)]">
                Drive export is one-way in this prototype — no sync back from
                Docs edits.
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-between border-t border-[var(--line)] pt-4">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              {PLANNER.back}
            </button>
            {step < 5 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep((s) => Math.min(5, s + 1))}
              >
                {PLANNER.next}
              </button>
            )}
          </div>
        </section>

        {chatOpen && (
          <aside className="surface flex h-[560px] flex-col overflow-hidden">
            <div className="border-b border-[var(--line)] px-4 py-3">
              <p className="text-sm font-semibold">{PLANNER.scopeBadge}</p>
              <p className="pill mt-2 bg-[var(--brand-soft)] text-[var(--brand-deep)]">
                Scoped to: {liveScope}
              </p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => {
                if (m.kind === "divider") {
                  return (
                    <p
                      key={i}
                      className="rounded-md bg-[var(--warn-soft)] px-2 py-1 text-center text-[11px] font-semibold text-[var(--warn)]"
                    >
                      {m.text}
                    </p>
                  );
                }
                if (m.kind === "user") {
                  return (
                    <div key={i} className="ml-6 rounded-[var(--radius-sm)] bg-[var(--brand)] px-3 py-2 text-sm text-white">
                      {m.text}
                    </div>
                  );
                }
                return (
                  <div
                    key={i}
                    className="mr-4 rounded-[var(--radius-sm)] bg-[var(--bg)] px-3 py-2 text-sm"
                  >
                    <p>{m.text}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {m.layers.map((layer) => (
                        <span
                          key={layer}
                          className="pill bg-[var(--surface)] text-[var(--ink-muted)] border border-[var(--line)]"
                        >
                          {layer}
                        </span>
                      ))}
                    </div>
                    <p className="mt-1 text-[10px] text-[var(--ink-faint)]">
                      Scope at reply: {m.scope}
                    </p>
                    <p className="mt-1 text-[10px] text-[var(--warn)]">
                      {CHAT.noTeacherMatch}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-[var(--line)] p-3">
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
                  placeholder={CHAT.placeholderKb}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                />
                <button type="button" className="btn btn-primary" onClick={sendChat}>
                  Ask
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
