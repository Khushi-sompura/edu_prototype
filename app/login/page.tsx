"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { DEMO_ACCOUNTS, ROLE_META, type Role } from "@/lib/auth";
import { APP, LOGIN } from "@/lib/messages";

const ROLES: Role[] = ["teacher", "school", "platform"];

export default function LoginPage() {
  const { session, ready, login } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<Role>("teacher");
  const [email, setEmail] = useState(DEMO_ACCOUNTS.teacher.email);
  const [password, setPassword] = useState("demo");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && session) router.replace(ROLE_META[session.role].home);
  }, [ready, session, router]);

  useEffect(() => {
    const demo = DEMO_ACCOUNTS[role];
    setEmail(demo.email);
    setPassword(demo.password);
    setError(null);
  }, [role]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = login(role, email, password);
    if (err) {
      setError(err);
      return;
    }
    router.push(ROLE_META[role].home);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 10% 0%, #c8e8e6 0%, transparent 50%), linear-gradient(165deg, #eef2f4, #e7eeee 55%, #f2ebe4)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-12">
        <p className="pill mb-4 w-fit bg-[var(--brand-soft)] text-[var(--brand-deep)]">
          {LOGIN.rolesHint}
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--brand-deep)] sm:text-5xl">
          {APP.name}
        </h1>
        <p className="mt-2 text-[var(--ink-muted)]">{LOGIN.subtitle}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {ROLES.map((r) => {
            const meta = ROLE_META[r];
            const active = role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-[var(--radius)] border p-4 text-left transition-all ${
                  active
                    ? "border-[var(--brand)] bg-[var(--brand-soft)] shadow-[var(--shadow)]"
                    : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--line-strong)]"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                  {meta.short}
                </p>
                <p className="mt-1 font-semibold">{meta.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">
                  {meta.blurb}
                </p>
              </button>
            );
          })}
        </div>

        <form
          onSubmit={onSubmit}
          className="surface mt-6 grid max-w-lg gap-3 p-5"
        >
          <p className="text-sm font-semibold">
            {LOGIN.title} as {ROLE_META[role].label}
          </p>
          <div className="field">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <p className="rounded-[var(--radius-sm)] bg-[var(--bg)] px-3 py-2 text-xs text-[var(--ink-muted)]">
            Demo: <span className="font-mono">{DEMO_ACCOUNTS[role].email}</span>{" "}
            / <span className="font-mono">demo</span>
          </p>
          {error && (
            <p className="text-sm text-[var(--danger)]" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-primary">
            {LOGIN.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
