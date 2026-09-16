"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ROLE_META, type Role } from "@/lib/auth";
import { APP, NAV } from "@/lib/messages";

type NavLink = { href: string; label: string };

const LINKS_BY_ROLE: Record<Role, NavLink[]> = {
  teacher: [
    { href: "/dashboard", label: NAV.dashboard },
    { href: "/classes", label: NAV.classes },
    { href: "/analytics", label: NAV.analytics },
    { href: "/planner", label: NAV.planner },
    { href: "/knowledge-base", label: NAV.knowledgeBase },
    { href: "/assistant", label: NAV.assistant },
    { href: "/behavior", label: NAV.behavior },
    { href: "/engagement", label: NAV.engagement },
    { href: "/privacy", label: NAV.privacy },
  ],
  school: [
    { href: "/dashboard", label: NAV.dashboard },
    { href: "/knowledge-base", label: NAV.knowledgeBase },
    { href: "/school-settings", label: NAV.schoolSettings },
    { href: "/analytics", label: NAV.analytics },
  ],
  platform: [
    { href: "/dashboard", label: NAV.dashboard },
    { href: "/platform", label: NAV.platform },
    { href: "/knowledge-base", label: NAV.knowledgeBase },
  ],
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, ready, logout } = useAuth();

  useEffect(() => {
    if (ready && !session) router.replace("/login");
  }, [ready, session, router]);

  if (!ready || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[var(--ink-muted)]">
        Checking session…
      </div>
    );
  }

  const links = LINKS_BY_ROLE[session.role];
  const roleMeta = ROLE_META[session.role];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-[var(--line)] bg-[var(--surface)] lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col px-4 py-5">
          <Link href="/dashboard" className="mb-4 px-2">
            <div className="font-display text-2xl font-semibold tracking-tight text-[var(--brand-deep)]">
              {APP.name}
            </div>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              {roleMeta.label} · {session.org}
            </p>
          </Link>

          <div className="mb-4 rounded-[var(--radius-sm)] bg-[var(--brand-soft)] px-3 py-2 text-xs">
            <p className="font-semibold text-[var(--brand-deep)]">
              {session.name}
            </p>
            <p className="text-[var(--ink-muted)]">{session.email}</p>
          </div>

          <nav className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[var(--brand-soft)] text-[var(--brand-deep)]"
                      : "text-[var(--ink-muted)] hover:bg-[var(--bg)] hover:text-[var(--ink)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3 pt-4">
            <button
              type="button"
              className="btn btn-ghost w-full justify-start"
              onClick={() => {
                logout();
                router.replace("/login");
              }}
            >
              {NAV.signOut}
            </button>
            <div className="hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg-elevated)] p-3 text-xs text-[var(--ink-muted)] lg:block">
              <p className="font-semibold text-[var(--ink)]">Prototype mode</p>
              <p className="mt-1 leading-relaxed">
                Frontend only — role gates are simulated in the browser.
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
