"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { DASHBOARD, NAV } from "@/lib/messages";

const TEACHER_TILES = [
  {
    href: "/classes",
    title: DASHBOARD.classesTitle,
    desc: DASHBOARD.classesDesc,
    meta: "Scores",
  },
  {
    href: "/analytics",
    title: DASHBOARD.app1Title,
    desc: DASHBOARD.app1Desc,
    meta: "Insights",
  },
  {
    href: "/planner",
    title: NAV.planner,
    desc: "Guided Bloom pathway with Socratic prompts and learner supports.",
    meta: "App 2",
  },
  {
    href: "/assistant",
    title: NAV.assistant,
    desc: "Separate KB and web chat tabs — confidentiality stays visible.",
    meta: "App 2",
  },
  {
    href: "/knowledge-base",
    title: NAV.knowledgeBase,
    desc: "Platform · School · Teacher layers with upload tags and promotion.",
    meta: "Shared",
  },
  {
    href: "/behavior",
    title: NAV.behavior,
    desc: "Pre/post intervention ratings and plain-language reports.",
    meta: "Loop",
  },
  {
    href: "/engagement",
    title: NAV.engagement,
    desc: "Strategy energy ratings that surface what works over time.",
    meta: "Loop",
  },
  {
    href: "/privacy",
    title: NAV.privacy,
    desc: DASHBOARD.privacyTileDesc,
    meta: "Privacy",
  },
];

const SCHOOL_TILES = [
  {
    href: "/knowledge-base",
    title: "School Knowledge Base",
    desc: "Review School KB content and teacher promotion requests into school scope.",
    meta: "KB",
  },
  {
    href: "/school-settings",
    title: NAV.schoolSettings,
    desc: "Logo/branding, promotion approval policy, and roster key-share escrow.",
    meta: "Admin",
  },
  {
    href: "/analytics",
    title: "School analytics overview",
    desc: DASHBOARD.schoolAnalyticsDesc,
    meta: "Insights",
  },
];

const PLATFORM_TILES = [
  {
    href: "/platform",
    title: NAV.platform,
    desc: "Schools list, Platform KB ownership, and platform promotion queue.",
    meta: "Ops",
  },
  {
    href: "/knowledge-base",
    title: "Platform Knowledge Base",
    desc: "Publish pedagogy frameworks, BIPs, and curriculum packs to all schools.",
    meta: "KB",
  },
];

export default function DashboardPage() {
  const { session } = useAuth();
  const role = session?.role ?? "teacher";

  const copy =
    role === "school"
      ? { title: DASHBOARD.schoolTitle, subtitle: DASHBOARD.schoolSubtitle }
      : role === "platform"
        ? {
            title: DASHBOARD.platformTitle,
            subtitle: DASHBOARD.platformSubtitle,
          }
        : { title: DASHBOARD.title, subtitle: DASHBOARD.subtitle };

  const tiles =
    role === "school"
      ? SCHOOL_TILES
      : role === "platform"
        ? PLATFORM_TILES
        : TEACHER_TILES;

  return (
    <div className="w-full fade-in">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--ink-muted)]">{copy.subtitle}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {tiles.map((tile, i) => (
          <Link
            key={tile.href + tile.title}
            href={tile.href}
            className="surface slide-up group block p-5 transition-transform hover:-translate-y-0.5"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
              {tile.meta}
            </p>
            <h2 className="mt-2 text-lg font-semibold group-hover:text-[var(--brand-deep)]">
              {tile.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
              {tile.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
