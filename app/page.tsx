import Link from "next/link";
import { APP, LANDING } from "@/lib/messages";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 20%, #c8e8e6 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 10%, #f0d9c8 0%, transparent 45%), linear-gradient(160deg, #eef2f4 0%, #e4ecec 45%, #f3ebe3 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(21,32,43,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(21,32,43,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <p className="slide-up pill mb-6 w-fit bg-[var(--brand-soft)] text-[var(--brand-deep)]">
          {LANDING.appsLabel}
        </p>

        <h1 className="font-display slide-up text-5xl font-semibold tracking-tight text-[var(--brand-deep)] sm:text-7xl">
          {APP.name}
        </h1>

        <p
          className="slide-up mt-5 max-w-xl text-xl text-[var(--ink)] sm:text-2xl"
          style={{ animationDelay: "80ms" }}
        >
          {APP.tagline}
        </p>

        <p
          className="slide-up mt-3 max-w-lg text-base leading-relaxed text-[var(--ink-muted)]"
          style={{ animationDelay: "140ms" }}
        >
          {APP.subtitle}
        </p>

        <div
          className="slide-up mt-10 flex flex-wrap gap-3"
          style={{ animationDelay: "200ms" }}
        >
          <Link href="/login" className="btn btn-primary">
            {LANDING.ctaPrimary}
          </Link>
          <a href="#map" className="btn btn-secondary">
            {LANDING.ctaSecondary}
          </a>
        </div>

        <section
          id="map"
          className="slide-up mt-20 grid gap-4 sm:grid-cols-3"
          style={{ animationDelay: "280ms" }}
        >
          <div className="surface p-5 sm:col-span-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:p-0 sm:overflow-hidden">
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                Teacher
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold">
                Classroom workflow
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                Planner, dual chat, tallies, and private Teacher KB.
              </p>
            </div>
            <div className="border-t border-[var(--line)] p-5 sm:border-l sm:border-t-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                School Admin
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold">
                School controls
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                School KB, branding, promotion policy, key-share escrow.
              </p>
            </div>
            <div className="border-t border-[var(--line)] p-5 sm:border-l sm:border-t-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                Platform Admin
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold">
                Platform ownership
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                Platform KB, school oversight, cross-school approvals.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
