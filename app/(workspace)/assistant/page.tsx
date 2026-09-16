"use client";

import { useState } from "react";
import { CHAT } from "@/lib/messages";

type Msg = {
  role: "user" | "assistant";
  text: string;
  citations?: { label: string; kind: "web" | "kb"; layer?: string }[];
};

const KB_STARTER: Msg[] = [
  {
    role: "assistant",
    text: "Ask using Platform, School, and Teacher knowledge bases. Citations show which layer answered.",
    citations: [],
  },
];

const WEB_STARTER: Msg[] = [
  {
    role: "assistant",
    text: "This box searches the public web only. School-confidential material will not leave the platform.",
    citations: [],
  },
];

export default function AssistantPage() {
  const [tab, setTab] = useState<"kb" | "web">("kb");
  const [kbMsgs, setKbMsgs] = useState<Msg[]>(KB_STARTER);
  const [webMsgs, setWebMsgs] = useState<Msg[]>(WEB_STARTER);
  const [input, setInput] = useState("");

  const msgs = tab === "kb" ? kbMsgs : webMsgs;
  const setMsgs = tab === "kb" ? setKbMsgs : setWebMsgs;

  function send() {
    if (!input.trim()) return;
    const q = input.trim();
    setInput("");

    if (tab === "kb") {
      setMsgs((m) => [
        ...m,
        { role: "user", text: q },
        {
          role: "assistant",
          text: "Based on your school scope sequence and platform pedagogy pack, open with a concrete model, then move students from Understand → Apply → Analyze using paired organism cards.",
          citations: [
            {
              label: "Year 7 Science scope & sequence",
              kind: "kb",
              layer: "School KB",
            },
            {
              label: "Bloom progression for middle school science",
              kind: "kb",
              layer: "Platform KB",
            },
          ],
        },
      ]);
    } else {
      setMsgs((m) => [
        ...m,
        { role: "user", text: q },
        {
          role: "assistant",
          text: "Public sources describe food chains as linear energy pathways. A useful classroom hook is a local ecosystem diagram paired with a disruption scenario.",
          citations: [
            { label: "ourworldindata.org", kind: "web" },
            { label: "nationalgeographic.org", kind: "web" },
          ],
        },
      ]);
    }
  }

  return (
    <div className="flex w-full flex-col fade-in" style={{ minHeight: "70vh" }}>
      <header className="mb-5">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          AI Assistant
        </h1>
        <p className="mt-1 text-[var(--ink-muted)]">
          Two fixed scopes — switch tabs deliberately so confidential queries
          never slip to the web.
        </p>
      </header>

      <div className="surface flex flex-1 flex-col overflow-hidden">
        <div className="flex border-b border-[var(--line)]">
          <button
            type="button"
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === "kb"
                ? "border-b-2 border-[var(--brand)] text-[var(--brand-deep)]"
                : "text-[var(--ink-faint)]"
            }`}
            onClick={() => setTab("kb")}
          >
            {CHAT.kbTab}
          </button>
          <button
            type="button"
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === "web"
                ? "border-b-2 border-[var(--web)] text-[var(--web)]"
                : "text-[var(--ink-faint)]"
            }`}
            onClick={() => setTab("web")}
          >
            {CHAT.webTab}
          </button>
        </div>

        {tab === "kb" ? (
          <div className="flex flex-wrap gap-2 border-b border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-2">
            {["Platform KB", "School KB", "Teacher KB"].map((layer) => (
              <span
                key={layer}
                className="pill border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-muted)]"
              >
                {layer}
              </span>
            ))}
          </div>
        ) : (
          <div className="border-b border-[var(--line)] bg-[var(--web-soft)] px-4 py-2 text-xs font-semibold text-[var(--web)]">
            {CHAT.webDisclaimer}
          </div>
        )}

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`max-w-[90%] rounded-[var(--radius-sm)] px-3 py-2 text-sm ${
                m.role === "user"
                  ? "ml-auto bg-[var(--brand)] text-white"
                  : "bg-[var(--bg)]"
              }`}
            >
              <p>{m.text}</p>
              {m.citations && m.citations.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.citations.map((c) => (
                    <span
                      key={c.label}
                      className={`pill ${
                        c.kind === "web"
                          ? "bg-[var(--web-soft)] text-[var(--web)]"
                          : "bg-[var(--brand-soft)] text-[var(--brand-deep)]"
                      }`}
                    >
                      {c.layer ? `${c.layer}: ` : ""}
                      {c.label}
                    </span>
                  ))}
                </div>
              )}
              {m.role === "assistant" &&
                tab === "kb" &&
                i === msgs.length - 1 &&
                msgs.length > 1 && (
                  <p className="mt-2 text-[11px] text-[var(--warn)]">
                    {CHAT.noTeacherMatch}
                  </p>
                )}
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--line)] p-3">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={
                tab === "kb" ? CHAT.placeholderKb : CHAT.placeholderWeb
              }
              className="flex-1 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
            />
            <button type="button" className="btn btn-primary" onClick={send}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
