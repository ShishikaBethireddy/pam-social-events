/**
 * Shared agent client dataset for the Partner Portal (Travel-Agent prototype).
 *
 * Ported from the pam-brides agent flow and re-themed for Nobu Social Events:
 * one record per client (a host / group celebrating a milestone) drives BOTH the
 * dashboard "Your Clients" table row and the full client detail page
 * (`/travel-agent/clients/:slug`). A single source of truth means clicking a row
 * always lands on that client's own information.
 */

import photoReunion from "@/assets/hero-celebration.jpg";
import photoBachelorette from "@/assets/bachelorette-beach.jpg";
import photoBirthday from "@/assets/event-birthday.jpg";
import photoAnniversary from "@/assets/event-engagement.jpg";

export type ChipTone = "plain" | "danger" | "warning" | "muted";
export type Cell = { text: string; tone?: ChipTone };

export type PillTone = "gold" | "orange" | "red" | "neutral";

export type StatusItem =
  | { label: string; kind: "pill"; text: string; tone?: PillTone }
  | { label: string; kind: "serif"; text: string; suffix?: string; danger?: boolean };

export type ActionTone = "red" | "orange" | "neutral";
export type ActionItem = {
  tone: ActionTone;
  badge: string;
  amount?: string;
  title: string;
  desc: string;
  cta: string;
};

export type AmountTone = "ink" | "muted" | "red";
export type MoneyRow = {
  title: string;
  sub: string;
  tag: string;
  tagTone: PillTone | "green";
  amount: string;
  amountTone: AmountTone;
  /** Pricing/folio line that belongs on the Proposal tab — hidden from the Overview Payments summary. */
  proposalOnly?: boolean;
};
export type MoneySection = {
  rows: MoneyRow[];
  outstandingLabel: string;
  outstandingSub: string;
  outstandingAmount: string;
};

export type RoomBlockSection = {
  allocated: string;
  confirmed: string;
  unclaimed: string;
  utilizationPct: number;
  editCloses: string;
  warning?: string;
};

export type ActivityItem = { text: string; meta: string; dotTone: "gold" | "green" };
export type InfoRow = { label: string; value: string; danger?: boolean };

export type AgentClient = {
  slug: string;
  /** Host name or group label, e.g. "The Reyes Family" or "Maya Chen + 24". */
  host: string;
  /** What they are celebrating — Family Reunion, Bachelorette, 40th Birthday, … */
  occasion: string;
  /** Optional host portrait for the detail-page avatar; falls back to an initials monogram. */
  photo?: string;
  property: string;
  space: string;
  dateLabel: string;
  countdown: string;
  guests: string;
  // Dashboard row summary
  rowDate: string;
  contract: Cell;
  roomBlock: Cell;
  windowDate: string;
  windowOpens: string;
  lastActivity: string;
  // Detail sections
  status: StatusItem[];
  actionCount: number;
  actionItems: ActionItem[];
  money?: MoneySection;
  roomBlockDetail?: RoomBlockSection;
  activity: ActivityItem[];
  bdm: { initials: string; label: string; name: string };
  coordinator?: {
    initials: string;
    name: string;
    role: string;
    blurb: string;
    photo?: string;
    contactHref?: string;
  };
  info: InfoRow[];
  notes: string;
};

export function clientMetaLine(c: AgentClient): string {
  return `${c.occasion} · ${c.property} · ${c.dateLabel} · ${c.guests}`;
}

/** Initials from a host/group name ("The Reyes Family" → "TR", "Maya Chen + 24" → "MC"). */
export function hostInitials(host: string): string {
  return host
    .replace(/\+.*$/, "")
    .split(/\s+/)
    .filter((w) => /[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export const AGENT_CLIENTS: AgentClient[] = [
  {
    slug: "reyes-family",
    host: "The Reyes Family",
    occasion: "Family Reunion",
    photo: photoReunion,
    property: "Nobu Los Cabos",
    space: "Stone Garden",
    dateLabel: "April 28, 2027",
    countdown: "199 days",
    guests: "150 guests",
    rowDate: "Apr 28, 2027",
    contract: { text: "Confirmed", tone: "plain" },
    roomBlock: { text: "22/30", tone: "plain" },
    windowDate: "Oct 14, 2026",
    windowOpens: "Opens in 138 days",
    lastActivity: "2 days ago",
    status: [
      { label: "EVENT CONTRACT", kind: "pill", text: "Confirmed" },
      { label: "ROOM BLOCK CONTRACT", kind: "pill", text: "22 / 30 rooms confirmed" },
      { label: "VENUE CONFIRMATION WINDOW", kind: "serif", text: "Opens Oct 14, 2026", suffix: "· in 138 days" },
      { label: "NEXT DEADLINE", kind: "serif", text: "Luna & Co. deposit · May 30", danger: true },
    ],
    actionCount: 8,
    actionItems: [
      {
        tone: "red",
        badge: "1 DAY · URGENT",
        amount: "$2,400",
        title: "Vendor deposit due — Luna & Co. Photography",
        desc: "The Reyes Family have not signed the contract yet. Photography deposit is due May 30.",
        cta: "Remind client →",
      },
      {
        tone: "orange",
        badge: "4 DAYS",
        title: "Co-host invitation pending",
        desc: "Marco has not been added to the portal. Room block edit window closes May 31 — co-host needs to confirm.",
        cta: "Nudge Elena →",
      },
      {
        tone: "orange",
        badge: "7 DAYS",
        amount: "8 unclaimed",
        title: "Room block RSVP gap",
        desc: "127 of 150 guests still haven't RSVP'd. Unclaimed rooms may be released after May 31.",
        cta: "View guest list →",
      },
      {
        tone: "neutral",
        badge: "138 DAYS",
        title: "Prepare venue confirmation package",
        desc: "Confirmation window opens Oct 14, 2026 — ready to convert booking. Pre-stage F&B brief and final guest count.",
        cta: "Add to plan →",
      },
      {
        tone: "orange",
        badge: "10 DAYS",
        title: "Schedule menu tasting",
        desc: "Grandpa Joaquín has a shellfish allergy — flag it for the tasting and lock the menu.",
        cta: "Schedule tasting →",
      },
      {
        tone: "neutral",
        badge: "21 DAYS",
        title: "Final guest count needed",
        desc: "Catering needs the confirmed headcount to finalize the F&B order for 150 guests.",
        cta: "Request count →",
      },
      {
        tone: "orange",
        badge: "14 DAYS",
        title: "Welcome dinner venue",
        desc: "Elena asked about a welcome dinner the night before — propose on-property options.",
        cta: "Propose options →",
      },
      {
        tone: "neutral",
        badge: "30 DAYS",
        title: "Transport for CDMX guests",
        desc: "Family from CDMX is arriving via the room block — coordinate airport transfers.",
        cta: "Add to plan →",
      },
    ],
    money: {
      rows: [
        {
          title: "Signature package — All-In Celebration",
          sub: "Includes private venue, reception, F&B for 150 · saved $14,000 vs. à la carte",
          tag: "ESTIMATE",
          tagTone: "neutral",
          amount: "$47,920",
          amountTone: "ink",
          proposalOnly: true,
        },
        {
          title: "Date hold deposit",
          sub: "Paid Apr 18, 2026 · refundable until contract",
          tag: "PAID",
          tagTone: "green",
          amount: "$500",
          amountTone: "muted",
        },
        {
          title: "Luna & Co. Photography — vendor deposit",
          sub: "Contract pending signature · 1 day away",
          tag: "DUE MAY 30",
          tagTone: "red",
          amount: "$2,400",
          amountTone: "red",
        },
        {
          title: "Room block — 30 rooms × 3 nights",
          sub: "Charged to guests directly · group rate $700/night",
          tag: "GUEST-PAID",
          tagTone: "gold",
          amount: "$63,000",
          amountTone: "muted",
          proposalOnly: true,
        },
      ],
      outstandingLabel: "Outstanding to PAM",
      outstandingSub: "1 deposit due in 1 day",
      outstandingAmount: "$2,400",
    },
    roomBlockDetail: {
      allocated: "30",
      confirmed: "22",
      unclaimed: "8",
      utilizationPct: 73,
      editCloses: "in 3 days",
      warning:
        "RSVP gap risk — 127 guests pending. If RSVPs don't come in by May 31, 8 unclaimed rooms may be released.",
    },
    activity: [
      { text: "Proposal v3 sent to client", meta: "2 days ago · You", dotTone: "gold" },
      { text: "Room block confirmed — 30 rooms at $700/night", meta: "4 days ago · Lisa Chen (Nobu BDM)", dotTone: "green" },
      { text: "Estimate revision approved by client", meta: "5 days ago · Elena Reyes", dotTone: "gold" },
      { text: "Elena invited to portal · onboarded successfully", meta: "2 weeks ago · System", dotTone: "gold" },
    ],
    bdm: { initials: "LC", label: "Your BDM · Nobu", name: "Lisa Chen" },
    coordinator: {
      initials: "VR",
      name: "Valentina Reyes",
      role: "Nobu Los Cabos · Events Specialist",
      contactHref: "mailto:valentina.reyes@nobuloscabos.com",
      blurb:
        "Valentina works directly with the Reyes Family on-site. Reach her through Lisa for anything operational.",
    },
    info: [
      { label: "Email", value: "elena.r@email.com" },
      { label: "Phone", value: "+1 (555) 123-4567" },
      { label: "Co-host", value: "Marco — not added yet", danger: true },
      { label: "Last logged in", value: "3 days ago" },
    ],
    notes:
      "Elena prefers email contact. Mentioned a sunset welcome toast — confirmed Stone Garden faces west so timing works. Grandpa Joaquín has a shellfish allergy — flag for menu. Family travelling in from CDMX via the guest block.",
  },
  {
    slug: "maya-bachelorette",
    host: "Maya Chen + 24",
    occasion: "Bachelorette Weekend",
    photo: photoBachelorette,
    property: "Nobu Los Cabos",
    space: "Sky Terrace",
    dateLabel: "August 9, 2027",
    countdown: "437 days",
    guests: "25 guests",
    rowDate: "Aug 9, 2027",
    contract: { text: "Confirmed", tone: "plain" },
    roomBlock: { text: "Lock in 3 days", tone: "danger" },
    windowDate: "Feb 3, 2027",
    windowOpens: "Opens in 249 days",
    lastActivity: "Today",
    status: [
      { label: "EVENT CONTRACT", kind: "pill", text: "Confirmed" },
      { label: "ROOM BLOCK CONTRACT", kind: "pill", text: "Locks in 3 days", tone: "red" },
      { label: "VENUE CONFIRMATION WINDOW", kind: "serif", text: "Opens Feb 3, 2027", suffix: "· in 249 days" },
      { label: "NEXT DEADLINE", kind: "serif", text: "Room block lock-in · June 5", danger: true },
    ],
    actionCount: 5,
    actionItems: [
      {
        tone: "red",
        badge: "3 DAYS · URGENT",
        title: "Room block lock-in deadline",
        desc: "Group rate of $640/night expires June 5. Confirm the 12-room block to hold pricing.",
        cta: "Confirm block →",
      },
      {
        tone: "orange",
        badge: "6 DAYS",
        amount: "$3,200",
        title: "Vendor deposit due — Glow Beauty Co.",
        desc: "Contract signed. Glam-suite deposit is due June 8.",
        cta: "Send reminder →",
      },
      {
        tone: "orange",
        badge: "12 DAYS",
        title: "Final guest count needed",
        desc: "Catering needs the confirmed headcount by June 14 to finalize the dinner + cabana order.",
        cta: "Request count →",
      },
      {
        tone: "neutral",
        badge: "249 DAYS",
        title: "Prepare venue confirmation package",
        desc: "Confirmation window opens Feb 3, 2027. Pre-stage the F&B brief and cabana plan.",
        cta: "Add to plan →",
      },
    ],
    money: {
      rows: [
        {
          title: "Signature package — Weekend Takeover",
          sub: "Includes Sky Terrace dinner, day club + F&B for 25 · saved $6,500 vs. à la carte",
          tag: "ESTIMATE",
          tagTone: "neutral",
          amount: "$28,400",
          amountTone: "ink",
          proposalOnly: true,
        },
        {
          title: "Date hold deposit",
          sub: "Paid Feb 2, 2026 · refundable until contract",
          tag: "PAID",
          tagTone: "green",
          amount: "$750",
          amountTone: "muted",
        },
        {
          title: "Glow Beauty Co. — vendor deposit",
          sub: "Contract signed · due June 8",
          tag: "DUE JUN 8",
          tagTone: "red",
          amount: "$3,200",
          amountTone: "red",
        },
        {
          title: "Room block — 12 rooms × 3 nights",
          sub: "Charged to guests directly · group rate $640/night",
          tag: "GUEST-PAID",
          tagTone: "gold",
          amount: "$23,040",
          amountTone: "muted",
          proposalOnly: true,
        },
      ],
      outstandingLabel: "Outstanding to PAM",
      outstandingSub: "1 deposit due in 6 days",
      outstandingAmount: "$3,200",
    },
    roomBlockDetail: {
      allocated: "12",
      confirmed: "4",
      unclaimed: "8",
      utilizationPct: 33,
      editCloses: "in 3 days",
      warning:
        "Lock-in deadline June 5 — confirm the block to secure the $640/night group rate before it expires.",
    },
    activity: [
      { text: "Estimate v2 sent to client", meta: "Today · You", dotTone: "gold" },
      { text: "Sky Terrace hold extended to June 5", meta: "2 days ago · Lisa Chen (Nobu BDM)", dotTone: "green" },
      { text: "Proposal approved by client", meta: "1 week ago · Maya Chen", dotTone: "gold" },
      { text: "Maya invited to portal · onboarded successfully", meta: "3 weeks ago · System", dotTone: "gold" },
    ],
    bdm: { initials: "LC", label: "Your BDM · Nobu", name: "Lisa Chen" },
    coordinator: {
      initials: "DV",
      name: "Daniela Vega",
      role: "Nobu Los Cabos · Events Specialist",
      blurb:
        "Daniela coordinates on-site logistics for Maya's group. Reach her through Lisa for anything operational.",
    },
    info: [
      { label: "Email", value: "maya.c@email.com" },
      { label: "Phone", value: "+1 (555) 284-9911" },
      { label: "Co-host", value: "Priya (maid of honor) — added" },
      { label: "Last logged in", value: "Today" },
    ],
    notes:
      "Maya wants a fireworks send-off — Nobu approved, adds $4k. Priya handles the group chat + RSVPs. Day-club cabana for 25, late checkout requested. Vegetarian menu for ~8 guests.",
  },
  {
    slug: "daniel-40th",
    host: "Daniel Okafor",
    occasion: "40th Birthday Weekend",
    photo: photoBirthday,
    property: "Nobu Los Cabos",
    space: "Pool Garden",
    dateLabel: "July 26, 2027",
    countdown: "423 days",
    guests: "120 guests",
    rowDate: "Jul 26, 2027",
    contract: { text: "Deposit Pending", tone: "warning" },
    roomBlock: { text: "Not started", tone: "muted" },
    windowDate: "Jan 28, 2027",
    windowOpens: "Opens in 243 days",
    lastActivity: "5 days ago",
    status: [
      { label: "EVENT CONTRACT", kind: "pill", text: "Deposit pending", tone: "orange" },
      { label: "ROOM BLOCK CONTRACT", kind: "pill", text: "Not started", tone: "neutral" },
      { label: "VENUE CONFIRMATION WINDOW", kind: "serif", text: "Opens Jan 28, 2027", suffix: "· in 243 days" },
      { label: "NEXT DEADLINE", kind: "serif", text: "Date hold deposit · June 2", danger: true },
    ],
    actionCount: 4,
    actionItems: [
      {
        tone: "red",
        badge: "2 DAYS · URGENT",
        amount: "$1,000",
        title: "Date hold deposit due",
        desc: "Nobu holds the July 26 date until June 2. Collect the deposit to secure it.",
        cta: "Collect deposit →",
      },
      {
        tone: "orange",
        badge: "5 DAYS",
        title: "Confirm party space",
        desc: "Space still TBD — Daniel is deciding between Pool Garden and the Rooftop Lounge. Needs a site visit.",
        cta: "Schedule visit →",
      },
      {
        tone: "orange",
        badge: "9 DAYS",
        title: "Send package estimate",
        desc: "Daniel requested all-in pricing for 120 guests. Estimate not yet sent.",
        cta: "Build estimate →",
      },
      {
        tone: "neutral",
        badge: "243 DAYS",
        title: "Prepare venue confirmation package",
        desc: "Confirmation window opens Jan 28, 2027 — pre-stage once the space is locked.",
        cta: "Add to plan →",
      },
    ],
    money: {
      rows: [
        {
          title: "Signature package — All-In Celebration",
          sub: "Draft estimate for 120 · pending client review",
          tag: "DRAFT",
          tagTone: "neutral",
          amount: "$39,800",
          amountTone: "ink",
          proposalOnly: true,
        },
        {
          title: "Date hold deposit",
          sub: "Due June 2 to secure the July 26 date",
          tag: "DUE JUN 2",
          tagTone: "red",
          amount: "$1,000",
          amountTone: "red",
        },
      ],
      outstandingLabel: "Outstanding to PAM",
      outstandingSub: "1 deposit due in 2 days",
      outstandingAmount: "$1,000",
    },
    activity: [
      { text: "Site visit proposed for June 10", meta: "5 days ago · You", dotTone: "gold" },
      { text: "Nobu sent venue options", meta: "1 week ago · Lisa Chen (Nobu BDM)", dotTone: "green" },
      { text: "Initial inquiry received", meta: "2 weeks ago · System", dotTone: "gold" },
    ],
    bdm: { initials: "LC", label: "Your BDM · Nobu", name: "Lisa Chen" },
    info: [
      { label: "Email", value: "daniel.o@email.com" },
      { label: "Phone", value: "+1 (555) 661-2048" },
      { label: "Co-host", value: "Amara (partner) — not added yet", danger: true },
      { label: "Last logged in", value: "5 days ago" },
    ],
    notes:
      "Daniel loves a poolside setting; leaning Pool Garden. Budget-conscious — flag à la carte savings. Travelling until June 4, slow to respond. Wants a Saturday night dinner + after-party.",
  },
  {
    slug: "vega-anniversary",
    host: "The Vega–Russo Anniversary",
    occasion: "25th Anniversary",
    photo: photoAnniversary,
    property: "Nobu Los Cabos",
    space: "The Omakase Room",
    dateLabel: "March 15, 2028",
    countdown: "655 days",
    guests: "Guest count TBD",
    rowDate: "Mar 15, 2028",
    contract: { text: "Exploring", tone: "muted" },
    roomBlock: { text: "—", tone: "plain" },
    windowDate: "Sep 15, 2027",
    windowOpens: "Opens in 474 days",
    lastActivity: "1 week ago",
    status: [
      { label: "EVENT CONTRACT", kind: "pill", text: "Exploring", tone: "neutral" },
      { label: "ROOM BLOCK CONTRACT", kind: "pill", text: "Not started", tone: "neutral" },
      { label: "VENUE CONFIRMATION WINDOW", kind: "serif", text: "Opens Sep 15, 2027", suffix: "· in 474 days" },
      { label: "NEXT DEADLINE", kind: "serif", text: "No deadline yet" },
    ],
    actionCount: 2,
    actionItems: [
      {
        tone: "orange",
        badge: "7 DAYS",
        title: "Follow up on venue tour",
        desc: "The Vegas toured Nobu virtually. Send the recap and propose a few dates.",
        cta: "Send recap →",
      },
      {
        tone: "neutral",
        badge: "474 DAYS",
        title: "Share package options",
        desc: "Early-stage lead — share starter packages to gauge budget and guest count.",
        cta: "Share packages →",
      },
    ],
    activity: [
      { text: "Virtual venue tour completed", meta: "1 week ago · You", dotTone: "gold" },
      { text: "Inquiry received from website", meta: "3 weeks ago · System", dotTone: "gold" },
    ],
    bdm: { initials: "LC", label: "Your BDM · Nobu", name: "Lisa Chen" },
    info: [
      { label: "Email", value: "carmen.v@email.com" },
      { label: "Phone", value: "— not provided" },
      { label: "Co-host", value: "Luca — not added yet", danger: true },
      { label: "Last logged in", value: "1 week ago" },
    ],
    notes:
      "Early lead from the spring campaign. Carmen mentioned a March 2028 anniversary dinner for ~40 guests. Luca is based in CDMX. Budget unconfirmed — send starter packages and gauge interest.",
  },
];

export function getAgentClient(slug: string): AgentClient | undefined {
  return AGENT_CLIENTS.find((c) => c.slug === slug);
}
