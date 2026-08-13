"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { PLATFORM } from "@/lib/messages";

const SCHOOLS = [
  { id: "s1", name: "Riverside Middle", teachers: 28, country: "AU" },
  { id: "s2", name: "Harbor Elementary", teachers: 19, country: "US" },
  { id: "s3", name: "Northvale Secondary", teachers: 41, country: "CA" },
];

type Promo = {
  id: string;
  school: string;
  title: string;
  from: string;
  status: "pending" | "approved" | "rejected";
};

export default function PlatformPage() {
  const { session, ready } = useAuth();
  const router = useRouter();
  const [promos, setPromos] = useState<Promo[]>([
    {
      id: "pp1",
      school: "Riverside Middle",
      title: "Trauma-informed discussion stems",
      from: "A. Chen",
      status: "pending",
    },
    {
      id: "pp2",
      school: "Harbor Elementary",
      title: "Year 4 fraction Bloom quiz pack",
      from: "M. Patel",
      status: "pending",
    },
  ]);

  useEffect(() => {
    if (ready && session && session.role !== "platform") {
      router.replace("/dashboard");
    }
  }, [ready, session, router]);

  if (!session || session.role !== "platform") return null;

  return (
    <div className="mx-auto max-w-5xl fade-in">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {PLATFORM.title}
        </h1>
        <p className="mt-1 text-[var(--ink-muted)]">{PLATFORM.subtitle}</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface p-5">
          <h2 className="font-semibold">Schools</h2>
          <ul className="mt-4 space-y-3">
            {SCHOOLS.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--line)] px-3 py-3"
              >
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    {s.teachers} teachers · {s.country}
                  </p>
                </div>
                <span className="pill bg-[var(--brand-soft)] text-[var(--brand-deep)]">
                  Active
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface p-5">
          <h2 className="font-semibold">Platform promotion queue</h2>
          <p className="mt-1 text-xs text-[var(--ink-faint)]">
            Visible submitter during review · anonymized after approval.
          </p>
          <ul className="mt-4 space-y-3">
            {promos.map((p) => (
              <li
                key={p.id}
                className="rounded-[var(--radius-sm)] border border-[var(--line)] p-3"
              >
                <p className="font-semibold">{p.title}</p>
                <p className="mt-1 text-xs text-[var(--ink-muted)]">
                  {p.school} · requested by {p.from}
                </p>
                {p.status === "pending" ? (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        setPromos((all) =>
                          all.map((x) =>
                            x.id === p.id ? { ...x, status: "approved" } : x,
                          ),
                        )
                      }
                    >
                      Approve to Platform KB
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        setPromos((all) =>
                          all.map((x) =>
                            x.id === p.id ? { ...x, status: "rejected" } : x,
                          ),
                        )
                      }
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span
                    className={`pill mt-2 ${
                      p.status === "approved"
                        ? "bg-[var(--ok-soft)] text-[var(--ok)]"
                        : "bg-[var(--danger-soft)] text-[var(--danger)]"
                    }`}
                  >
                    {p.status}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="surface p-5 lg:col-span-2">
          <h2 className="font-semibold">Platform KB publishing</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            Content published here is available to every school. Content flows
            down — schools and teachers cannot push upward without approval.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Pedagogy frameworks",
              "Behavior intervention packs",
              "Curriculum standards",
              "Remediation + test prep",
            ].map((folder) => (
              <span
                key={folder}
                className="pill border border-[var(--line)] bg-[var(--bg)] text-[var(--ink-muted)]"
              >
                {folder}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
