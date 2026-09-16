export type Role = "teacher" | "school" | "platform";

export const ROLE_STORAGE_KEY = "edtech.role.v1";
export const SESSION_STORAGE_KEY = "edtech.session.v1";

export type Session = {
  role: Role;
  name: string;
  email: string;
  org: string;
};

export const ROLE_META: Record<
  Role,
  { label: string; short: string; blurb: string; home: string }
> = {
  teacher: {
    label: "Teacher",
    short: "Teacher",
    blurb:
      "My Classes (assessments & scores), Method Impact, planner, tallies, and Teacher KB.",
    home: "/dashboard",
  },
  school: {
    label: "School Admin",
    short: "School",
    blurb:
      "Manage School KB, branding, promotion reviews, and roster key-share escrow.",
    home: "/dashboard",
  },
  platform: {
    label: "Platform Admin",
    short: "Platform",
    blurb:
      "Own Platform KB, approve platform promotions, and oversee schools.",
    home: "/dashboard",
  },
};

export const DEMO_ACCOUNTS: Record<
  Role,
  { email: string; password: string; name: string; org: string }
> = {
  teacher: {
    email: "teacher@edtech.demo",
    password: "demo",
    name: "A. Chen",
    org: "Riverside Middle",
  },
  school: {
    email: "admin@riverside.demo",
    password: "demo",
    name: "Jordan Blake",
    org: "Riverside Middle",
  },
  platform: {
    email: "owner@edtech.demo",
    password: "demo",
    name: "EdTech Ops",
    org: "EdTech AI Platform",
  },
};
