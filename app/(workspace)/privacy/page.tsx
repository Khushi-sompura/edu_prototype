"use client";

import { useEffect, useState } from "react";
import { PRIVACY_TABLE } from "@/lib/mock-data";
import { PRIVACY } from "@/lib/messages";

type Student = { code: string };

const STORAGE_KEY = "edtech.roster.v1";

function makeCode() {
  return `STU-${Math.floor(1000 + Math.random() * 9000)}`;
}

function normalizeRoster(raw: unknown): Student[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const code = (item as { code?: unknown }).code;
      if (typeof code !== "string" || !code.trim()) return null;
      return { code: code.trim() };
    })
    .filter((s): s is Student => s !== null);
}

export default function PrivacyPage() {
  const [roster, setRoster] = useState<Student[]>([
    { code: "STU-8841" },
    { code: "STU-2207" },
    { code: "STU-5510" },
  ]);
  const [code, setCode] = useState("");
  const [backupSet, setBackupSet] = useState(false);
  const [backupPw, setBackupPw] = useState("");
  const [restorePw, setRestorePw] = useState("");
  const [purgeDate] = useState("2026-12-15");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = normalizeRoster(JSON.parse(raw));
        if (parsed.length) setRoster(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(roster));
    } catch {
      /* ignore */
    }
  }, [roster]);

  function addStudent() {
    const next = code.trim() || makeCode();
    if (roster.some((s) => s.code === next)) return;
    setRoster((r) => [...r, { code: next }]);
    setCode("");
  }

  function removeStudent(studentCode: string) {
    setRoster((r) => r.filter((s) => s.code !== studentCode));
  }

  return (
    <div className="mx-auto max-w-5xl fade-in">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {PRIVACY.title}
        </h1>
        <p className="mt-1 text-[var(--ink-muted)]">{PRIVACY.subtitle}</p>
      </header>

      <div className="mb-4 rounded-[var(--radius)] border border-[var(--warn)] bg-[var(--warn-soft)] px-4 py-3 text-sm text-[var(--warn)]">
        {PRIVACY.warning}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface p-5">
          <h2 className="font-semibold">{PRIVACY.rosterTitle}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--ink-faint)]">
                  <th className="pb-2 font-medium">{PRIVACY.studentId}</th>
                  <th className="pb-2 text-right font-medium">
                    {PRIVACY.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {roster.map((s) => (
                  <tr key={s.code} className="border-b border-[var(--line)]">
                    <td className="py-2 font-mono text-[var(--ink)]">
                      {s.code}
                    </td>
                    <td className="py-2 text-right">
                      <button
                        type="button"
                        className="text-xs font-semibold text-[var(--ink-muted)] hover:text-[var(--danger)] hover:underline"
                        onClick={() => removeStudent(s.code)}
                      >
                        {PRIVACY.remove}
                      </button>
                    </td>
                  </tr>
                ))}
                {roster.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="py-3 text-[var(--ink-faint)]"
                    >
                      {PRIVACY.emptyRoster}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-2">
            <input
              className="flex-1 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
              placeholder={PRIVACY.studentIdPlaceholder}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addStudent()}
            />
            <button type="button" className="btn btn-primary" onClick={addStudent}>
              {PRIVACY.addStudent}
            </button>
          </div>
          <p className="mt-2 text-xs text-[var(--ink-faint)]">
            {PRIVACY.autoCodeHint}
          </p>
        </section>

        <section className="surface p-5">
          <h2 className="font-semibold">{PRIVACY.storageTitle}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--ink-faint)]">
                  <th className="pb-2 font-medium">Data</th>
                  <th className="pb-2 font-medium">Where</th>
                  <th className="pb-2 font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {PRIVACY_TABLE.map((row) => (
                  <tr key={row.data} className="border-b border-[var(--line)]">
                    <td className="py-2">{row.data}</td>
                    <td className="py-2">{row.where}</td>
                    <td className="py-2 text-[var(--ink-muted)]">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-[var(--ink-muted)]">
            Auto-purge date: <strong>{purgeDate}</strong>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary">
              Export before purge
            </button>
            <button type="button" className="btn btn-secondary">
              Purge now
            </button>
          </div>
        </section>

        <section className="surface p-5 lg:col-span-2">
          <h2 className="font-semibold">{PRIVACY.backupTitle}</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            {PRIVACY.backupDesc}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[var(--radius-sm)] border border-[var(--line)] p-4">
              <p className="text-sm font-semibold">{PRIVACY.setupBackup}</p>
              <div className="field mt-3">
                <label>{PRIVACY.backupPassword}</label>
                <input
                  type="password"
                  value={backupPw}
                  onChange={(e) => setBackupPw(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={() => setBackupSet(Boolean(backupPw))}
              >
                {PRIVACY.createBackup}
              </button>
              {backupSet && (
                <p className="mt-3 text-sm text-[var(--ok)]">
                  {PRIVACY.backupSuccess
                    .replace("{count}", String(roster.length))}
                </p>
              )}
            </div>
            <div className="rounded-[var(--radius-sm)] border border-[var(--line)] p-4">
              <p className="text-sm font-semibold">{PRIVACY.restoreTitle}</p>
              <div className="field mt-3">
                <label>{PRIVACY.backupPassword}</label>
                <input
                  type="password"
                  value={restorePw}
                  onChange={(e) => setRestorePw(e.target.value)}
                />
              </div>
              <button type="button" className="btn btn-secondary mt-3">
                {PRIVACY.decryptLocally}
              </button>
              <p className="mt-3 text-xs text-[var(--ink-faint)]">
                {PRIVACY.restoreHint}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
