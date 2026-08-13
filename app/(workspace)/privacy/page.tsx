"use client";

import { useEffect, useState } from "react";
import { PRIVACY_TABLE } from "@/lib/mock-data";
import { PRIVACY } from "@/lib/messages";

type Student = { code: string; name: string };

const STORAGE_KEY = "edubridge.roster.v1";

function makeCode() {
  return `STU-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function PrivacyPage() {
  const [roster, setRoster] = useState<Student[]>([
    { code: "STU-8841", name: "Maya Chen" },
    { code: "STU-2207", name: "Jordan Lee" },
    { code: "STU-5510", name: "Sam Ortiz" },
  ]);
  const [name, setName] = useState("");
  const [backupSet, setBackupSet] = useState(false);
  const [backupPw, setBackupPw] = useState("");
  const [restorePw, setRestorePw] = useState("");
  const [purgeDate] = useState("2026-12-15");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRoster(JSON.parse(raw) as Student[]);
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
    if (!name.trim()) return;
    setRoster((r) => [...r, { code: makeCode(), name: name.trim() }]);
    setName("");
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
          <h2 className="font-semibold">Student roster (device-only)</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--ink-faint)]">
                  <th className="pb-2 font-medium">Code</th>
                  <th className="pb-2 font-medium">Name</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((s) => (
                  <tr key={s.code} className="border-b border-[var(--line)]">
                    <td className="py-2 font-mono text-[var(--ink)]">{s.code}</td>
                    <td className="py-2">{s.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-2">
            <input
              className="flex-1 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
              placeholder="Student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addStudent()}
            />
            <button type="button" className="btn btn-primary" onClick={addStudent}>
              {PRIVACY.addStudent}
            </button>
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="font-semibold">What is stored where</h2>
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
          <h2 className="font-semibold">Roster backup (split-trust demo)</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            Prototype shows teacher password + school-admin share messaging.
            Password cannot be reset by the platform.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[var(--radius-sm)] border border-[var(--line)] p-4">
              <p className="text-sm font-semibold">Set up backup</p>
              <div className="field mt-3">
                <label>Backup password (separate from login)</label>
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
                Create encrypted backup
              </button>
              {backupSet && (
                <p className="mt-3 text-sm text-[var(--ok)]">
                  Last backup: just now · {roster.length} students · admin key
                  share pending school escrow.
                </p>
              )}
            </div>
            <div className="rounded-[var(--radius-sm)] border border-[var(--line)] p-4">
              <p className="text-sm font-semibold">Restore on new device</p>
              <div className="field mt-3">
                <label>Backup password</label>
                <input
                  type="password"
                  value={restorePw}
                  onChange={(e) => setRestorePw(e.target.value)}
                />
              </div>
              <button type="button" className="btn btn-secondary mt-3">
                Decrypt locally
              </button>
              <p className="mt-3 text-xs text-[var(--ink-faint)]">
                Grades stay under codes either way — only the name map needs
                restore.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
