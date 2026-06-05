import { Link } from "react-router-dom";
import { Check, Plus, X } from "lucide-react";
import type { AgentClient } from "@/lib/agentClients";
import { clientVendorsHref } from "@/lib/agentNav";
import proposalImg from "@/assets/venue-private-dining.jpg";

/*
 * Section-tab panels for the client detail page. Content is modelled on the
 * showcase client (The Reyes Family); the dashboard links here, so the panels
 * read as a finished build rather than empty states.
 */

const CARD = "rounded-[14px] border border-[#e7e2f0] bg-white";
const CONTENT = "flex flex-col gap-6 px-6 py-8 md:px-10";
const PURPLE = "#7b4b94";
const PURPLE_DOT = "#a98bc2";
const GREEN = "#2f7d57";

function SerifHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-[22px] font-medium leading-normal text-[#1a1721]">{children}</h2>;
}

function GhostButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="shrink-0 rounded-[6px] border border-[#e7e2f0] px-3.5 py-2 text-[12px] font-medium text-[#1a1721] transition-colors hover:bg-surface-subtle"
    >
      {children}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────── Room Block ── */

const STAT_CARDS = [
  { label: "ALLOCATED", value: "30", sub: "Rooms in block · 3 nights" },
  { label: "CONFIRMED", value: "22", sub: "By guest RSVPs · 73%" },
  { label: "UNCLAIMED", value: "8", sub: "May be released May 31", alert: true },
  { label: "GROUP RATE", value: "$700", sub: "Per night · all room types", small: true },
];

const ROOM_TYPES = [
  { name: "Deluxe King", sub: "King Bed · Lagoon View", allocated: "14", confirmed: "14 / 14", rate: "$700" },
  { name: "Ocean View", sub: "King or Two Queens · Ocean", allocated: "10", confirmed: "6 / 10", rate: "$850" },
  { name: "Junior Suite", sub: "Suite · Oceanfront balcony", allocated: "6", confirmed: "2 / 6", rate: "$1,100" },
];

const RSVP_ROWS = [
  { label: "Confirmed", value: "23", pct: 16, color: PURPLE_DOT },
  { label: "Pending RSVP", value: "127", pct: 85, color: "#d4652a" },
  { label: "Rooms unclaimed", value: "8 / 30", pct: 27, color: "#c0392b" },
];

export function RoomBlockTab({ client: _client }: { client: AgentClient }) {
  return (
    <div className={CONTENT}>
      <div className="grid grid-cols-2 gap-3 md:flex md:gap-4">
        {STAT_CARDS.map((s) => (
          <div
            key={s.label}
            className={`flex flex-1 flex-col gap-1.5 rounded-[14px] border px-5 py-[18px] md:px-6 md:py-[22px] ${
              s.alert ? "border-[rgba(212,101,42,0.25)] bg-[#fef3ec]" : "border-[#e7e2f0] bg-white"
            }`}
          >
            <p className="text-[10px] font-semibold tracking-[0.12em] text-[#969199]">{s.label}</p>
            <p
              className={`font-display font-medium leading-none text-[#1a1721] ${
                s.small ? "text-[28px]" : "text-[32px] md:text-[36px]"
              }`}
              style={s.alert ? { color: "#d4652a" } : undefined}
            >
              {s.value}
            </p>
            <p className="text-[11px] text-[#969199]">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 rounded-[10px] border border-[#e7e2f0] bg-[#f3f1f7] px-5 py-3.5 md:flex-row md:items-center md:gap-3.5">
        <p className="flex-1 text-[13px] text-[#585563]">
          Room block edit window closes in 3 days (May 31). After that, changes require PAM approval.
        </p>
        <button type="button" className="self-start text-[12px] font-semibold md:self-center" style={{ color: PURPLE }}>
          Request change from PAM →
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        <div className={`${CARD} flex flex-col px-6 py-6 md:px-7 lg:min-w-0 lg:flex-[2]`}>
          <div className="flex items-center justify-between pb-[18px]">
            <SerifHeading>Room Types</SerifHeading>
            <GhostButton>Edit allocation</GhostButton>
          </div>
          <div className="flex gap-4 border-b border-[#e7e2f0] pb-2.5 text-[10px] font-semibold tracking-[0.1em] text-[#969199]">
            <span className="flex-[2] md:w-[280px] md:flex-none">ROOM TYPE</span>
            <span className="flex-1">ALLOCATED</span>
            <span className="flex-1">CONFIRMED</span>
            <span className="flex-1 text-right md:text-left">RATE / NIGHT</span>
          </div>
          {ROOM_TYPES.map((r) => (
            <div key={r.name} className="flex items-center gap-4 border-b border-[#f3f1f7] py-4 last:border-b-0">
              <div className="flex flex-[2] flex-col gap-0.5 md:w-[280px] md:flex-none">
                <p className="font-display text-[15px] font-medium text-[#1a1721]">{r.name}</p>
                <p className="text-[11px] text-[#969199]">{r.sub}</p>
              </div>
              <p className="flex-1 text-[14px] font-medium text-[#1a1721]">{r.allocated}</p>
              <p className="flex-1 text-[14px] font-medium text-[#1a1721]">{r.confirmed}</p>
              <p className="flex-1 text-right font-display text-[14px] font-medium text-[#1a1721] md:text-left">
                {r.rate}
              </p>
            </div>
          ))}
        </div>

        <div className={`${CARD} flex flex-col gap-[18px] px-6 py-6 md:px-7 lg:min-w-0 lg:flex-1`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <SerifHeading>RSVP-to-room gap</SerifHeading>
            <p className="text-[11px] font-semibold tracking-[0.09em] text-[#969199]">150 GUESTS INVITED</p>
          </div>
          <div className="flex flex-col gap-3.5">
            {RSVP_ROWS.map((row) => (
              <div key={row.label} className="flex items-center gap-3.5">
                <span className="w-[110px] shrink-0 text-[12px] font-medium text-[#585563] md:w-[140px]">
                  {row.label}
                </span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#f3f1f7]">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${row.pct}%`, backgroundColor: row.color }}
                  />
                </span>
                <span className="w-12 shrink-0 text-right text-[13px] font-semibold text-[#1a1721]">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="rounded-[4px] bg-[#f9eae8] px-3.5 py-3">
            <p className="text-[12px] leading-[1.45] text-[#2b2b27]">
              RSVP gap risk — 127 guests pending. If RSVPs don&apos;t come in by May 31, 8 unclaimed rooms may be
              released.{" "}
              <button type="button" className="font-medium text-[#2b2b27] underline underline-offset-2">
                View guest list
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── Travel ── */

const HOST_FLIGHTS = [
  { code: "JFK", detail: "Apr 26 · 6:15am → SJD 11:42am" },
  { code: "SJD", detail: "May 3 · 1:30pm → JFK 9:05pm" },
];

const GROUND_TRANSFERS = [
  { title: "SJD Airport → Nobu Los Cabos · Host arrival", meta: "Apr 26, 11:42am · Private SUV · driver Hector", status: "CONFIRMED" },
  { title: "Resort → SJD Airport · Host departure", meta: "May 3, 10:30am · Private SUV", status: "PENDING" },
  { title: "SJD Group transfer · 12 guests arriving Apr 27", meta: "Apr 27, 2:00pm · Group shuttle (15 pax)", status: "CONFIRMED" },
  { title: "SJD Group transfer · 22 guests arriving Apr 28", meta: "Apr 28, schedule TBD", status: "PENDING" },
];

const CONSIDERATIONS = [
  "A guest requires a wheelchair-accessible airport transfer. Confirmed with Hector.",
  "CDMX group (8 guests) arriving on a single domestic flight Apr 27. Single shuttle preferred.",
  "Shellfish allergy — flagged for the menu and welcome reception.",
];

const ARRIVALS = [
  { l: "Arriving Apr 26", v: "2" },
  { l: "Apr 27", v: "12" },
  { l: "Apr 28", v: "20" },
  { l: "Travel pending", v: "116", alert: true },
];

const TRAVEL_DEADLINES = [
  { l: "Best group fare cutoff", v: "Sep 26" },
  { l: "Final manifest due", v: "Mar 28" },
  { l: "Insurance window closes", v: "Aug 28", alert: true },
];

function TransferStatus({ status }: { status: string }) {
  const confirmed = status === "CONFIRMED";
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.04em]"
      style={confirmed ? { backgroundColor: "#e7f0ea", color: GREEN } : { backgroundColor: "#f0f0f0", color: "#969199" }}
    >
      {status}
    </span>
  );
}

function RailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={`${CARD} flex flex-col gap-3 px-6 py-5`}>
      <p className="text-[10px] font-semibold tracking-[0.11em] text-[#969199]">{title}</p>
      {children}
    </div>
  );
}

export function TravelTab({ client }: { client: AgentClient }) {
  const firstName = client.host.replace(/^The\s+/i, "").split(/\s+/)[0] ?? "the host";
  return (
    <div className="flex flex-col gap-7 px-6 py-8 md:flex-row md:px-10">
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className={`${CARD} flex flex-col gap-4 px-6 py-6`}>
          <div className="flex items-center justify-between">
            <SerifHeading>Host &amp; VIP travel</SerifHeading>
            <GhostButton>Edit travel</GhostButton>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2.5">
              <p className="text-[15px] font-medium text-[#1a1721]">{firstName} — primary host</p>
              <div className="flex flex-col gap-2 rounded-[10px] bg-surface-subtle px-4 py-3.5">
                {HOST_FLIGHTS.map((f) => (
                  <div key={f.detail} className="flex items-baseline gap-3 text-[12px]">
                    <span className="w-9 shrink-0 font-semibold text-[#1a1721]">{f.code}</span>
                    <span className="text-[#585563]">{f.detail}</span>
                  </div>
                ))}
                <p className="pt-1 text-[11px] text-[#969199]">AeroMéxico 437 · confirmation #XQ7M2P · seat 4A/B</p>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <p className="text-[15px] font-medium text-[#1a1721]">Co-host</p>
              <div className="flex flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[#e7e2f0] px-4 py-5">
                <p className="text-[12px] text-[#969199]">No flight booked yet</p>
                <button type="button" className="text-[12px] font-medium" style={{ color: PURPLE }}>
                  + Add co-host&apos;s flight
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`${CARD} flex flex-col gap-1 px-6 py-6`}>
          <div className="flex items-center justify-between pb-2">
            <SerifHeading>Ground transfers</SerifHeading>
            <GhostButton>+ New transfer</GhostButton>
          </div>
          {GROUND_TRANSFERS.map((t) => (
            <div key={t.title} className="flex items-center gap-3 border-b border-[#f3f1f7] py-3.5 last:border-b-0">
              <span
                className="mt-1 size-1.5 shrink-0 self-start rounded-full"
                style={{ backgroundColor: t.status === "CONFIRMED" ? GREEN : PURPLE_DOT }}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-[13px] font-medium text-[#1a1721]">{t.title}</p>
                <p className="text-[11px] text-[#969199]">{t.meta}</p>
              </div>
              <TransferStatus status={t.status} />
            </div>
          ))}
        </div>

        <div className={`${CARD} flex flex-col gap-3 px-6 py-6`}>
          <div className="flex items-center justify-between pb-1">
            <SerifHeading>Special considerations</SerifHeading>
            <GhostButton>+ Add note</GhostButton>
          </div>
          {CONSIDERATIONS.map((c) => (
            <p key={c} className="rounded-[10px] bg-surface-subtle px-4 py-3 text-[13px] leading-[1.5] text-[#585563]">
              {c}
            </p>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col gap-5 md:w-[300px] md:shrink-0">
        <RailCard title="ARRIVAL SUMMARY">
          <p className="font-display text-[28px] font-medium leading-none text-[#1a1721]">
            34 <span className="text-[#bdbdbd]">/ 150</span>
          </p>
          <p className="-mt-1 text-[12px] text-[#969199]">Guests with confirmed travel</p>
          <div className="flex flex-col gap-2 pt-1">
            {ARRIVALS.map((a) => (
              <div key={a.l} className="flex items-center justify-between text-[13px]">
                <span className={a.alert ? "text-[#d4652a]" : "text-[#585563]"}>{a.l}</span>
                <span className={`font-medium ${a.alert ? "text-[#d4652a]" : "text-[#1a1721]"}`}>{a.v}</span>
              </div>
            ))}
          </div>
        </RailCard>

        <RailCard title="TRAVEL DEADLINES">
          <div className="flex flex-col gap-2.5">
            {TRAVEL_DEADLINES.map((d) => (
              <div key={d.l} className="flex items-center justify-between text-[13px]">
                <span className="text-[#585563]">{d.l}</span>
                <span className={`font-medium ${d.alert ? "text-[#d4652a]" : "text-[#1a1721]"}`}>{d.v}</span>
              </div>
            ))}
          </div>
        </RailCard>

        <RailCard title="QUICK ACTIONS">
          <button
            type="button"
            className="rounded-full bg-action-primary py-3 text-[13px] font-medium text-action-primary-text"
          >
            Send travel reminder to guests
          </button>
          <button
            type="button"
            className="rounded-full border border-[#e7e2f0] py-3 text-[13px] font-medium text-[#1a1721] transition-colors hover:bg-surface-subtle"
          >
            Export manifest (CSV)
          </button>
          <button
            type="button"
            className="rounded-full border border-[#e7e2f0] py-3 text-[13px] font-medium text-[#1a1721] transition-colors hover:bg-surface-subtle"
          >
            Request group rate quote
          </button>
        </RailCard>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── Activity ── */

type ActorTone = "gold" | "green" | "client";
type LogEntry = { text: string; tag: string; tone: ActorTone; time: string };
type LogGroup = { date: string; entries: LogEntry[] };

const ACTIVITY_LOG: LogGroup[] = [
  {
    date: "TODAY · MAY 29",
    entries: [
      { text: "Lisa Chen replied to your message about Pool Garden Aug availability", tag: "BDM · Nobu", tone: "gold", time: "2 hours ago" },
      { text: "Room block updated to 22 / 30 confirmed · 2 new RSVPs (Tom Harlow + Kara Johnson)", tag: "System", tone: "green", time: "5 hours ago" },
    ],
  },
  {
    date: "2 DAYS AGO · MAY 27",
    entries: [
      { text: "Proposal v3 sent to the Reyes Family · added sparkler send-off coordination", tag: "You", tone: "gold", time: "10:42am" },
      { text: "Elena approved proposal v3 · approved by client at portal", tag: "Client", tone: "client", time: "2:18pm" },
    ],
  },
  {
    date: "4 DAYS AGO · MAY 25",
    entries: [
      { text: "Room block confirmed at 30 rooms · $700 / night by Lisa Chen", tag: "BDM · Nobu", tone: "green", time: "3:00pm" },
    ],
  },
  {
    date: "1 WEEK AGO · MAY 22",
    entries: [
      { text: "Estimate revision requested · Elena asked about adding a floral arch", tag: "Client", tone: "client", time: "11:14am" },
      { text: "Tentative hold placed at Stone Garden for April 28, 2027", tag: "You", tone: "gold", time: "9:30am" },
    ],
  },
  {
    date: "2 WEEKS AGO · MAY 15",
    entries: [
      { text: "Welcome package sent to client · onboarding link delivered", tag: "You", tone: "gold", time: "4:00pm" },
      { text: "The Reyes Family added as new client · Elena onboarded successfully", tag: "System", tone: "green", time: "10:00am" },
    ],
  },
];

const ACTOR_FILTERS = [
  { l: "All sources", n: "24" },
  { l: "You", n: "8" },
  { l: "The Reyes Family", n: "6" },
  { l: "Lisa Chen (BDM)", n: "5" },
  { l: "Vendors", n: "2" },
  { l: "System", n: "3" },
];

const EVENT_FILTERS = [
  { l: "All events", n: "24" },
  { l: "Proposal changes", n: "5" },
  { l: "Room block updates", n: "7" },
  { l: "Messages", n: "6" },
  { l: "Payments & deposits", n: "3" },
  { l: "Vendor activity", n: "3" },
];

const TAG_STYLE: Record<ActorTone, { bg: string; color: string }> = {
  gold: { bg: "#ede7f6", color: PURPLE },
  green: { bg: "#e7f0ea", color: GREEN },
  client: { bg: "#e7f0ea", color: GREEN },
};

function FilterRail({ title, rows }: { title: string; rows: { l: string; n: string }[] }) {
  return (
    <div className={`${CARD} flex flex-col gap-1 px-5 py-4`}>
      <p className="px-1 pb-1.5 text-[10px] font-semibold tracking-[0.11em] text-[#969199]">{title}</p>
      {rows.map((r, i) => {
        const active = i === 0;
        return (
          <button
            key={r.l}
            type="button"
            className={`flex items-center justify-between rounded-[8px] px-3 py-2 text-[13px] transition-colors ${
              active ? "bg-surface-subtle font-medium text-[#1a1721]" : "text-[#585563] hover:bg-surface-subtle"
            }`}
          >
            <span>{r.l}</span>
            <span className="text-[12px] text-[#969199]">{r.n}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ActivityTab({ client: _client }: { client: AgentClient }) {
  return (
    <div className="flex flex-col gap-7 px-6 py-8 md:flex-row md:px-10">
      <div className={`${CARD} flex min-w-0 flex-1 flex-col px-6 py-6 md:px-7`}>
        <div className="flex items-center justify-between pb-4">
          <SerifHeading>Activity log</SerifHeading>
          <div className="flex items-center gap-2.5">
            <GhostButton>Export PDF</GhostButton>
            <GhostButton>Mark all read</GhostButton>
          </div>
        </div>
        {ACTIVITY_LOG.map((group) => (
          <div key={group.date} className="flex flex-col">
            <p className="border-b border-[#f0ecf4] py-2.5 text-[10px] font-semibold tracking-[0.1em] text-[#969199]">
              {group.date}
            </p>
            {group.entries.map((e) => (
              <div key={e.text} className="flex items-start gap-3 border-b border-[#f3f1f7] py-3.5 last:border-b-0">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: e.tone === "gold" ? PURPLE_DOT : GREEN }}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <p className="text-[13px] leading-[1.45] text-[#1a1721]">{e.text}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center rounded-[4px] px-2 py-0.5 text-[10px] font-medium"
                      style={{ backgroundColor: TAG_STYLE[e.tone].bg, color: TAG_STYLE[e.tone].color }}
                    >
                      {e.tag}
                    </span>
                    <span className="text-[11px] text-[#969199]">{e.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col gap-5 md:w-[300px] md:shrink-0">
        <FilterRail title="FILTER BY ACTOR" rows={ACTOR_FILTERS} />
        <FilterRail title="FILTER BY EVENT TYPE" rows={EVENT_FILTERS} />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── Proposal ── */

const CORE_PLAN = [
  { label: "Private celebration · 4hr venue", value: "$3,500" },
  { label: "4hr Reception event", value: "INCLUDED" },
  { label: "Dedicated private event space", value: "INCLUDED" },
  { label: "On-site event host & emcee", value: "INCLUDED" },
  { label: "Welcome website & guest RSVP registry", value: "INCLUDED" },
  { label: "F&B for 150 guests · Signature tier menu", value: "INCLUDED" },
];

const ESTIMATE_ROWS = [
  { label: "Nobu Los Cabos · property package", value: "$3,500" },
  { label: "Casa de Flores · 4 options", value: "$4,200" },
  { label: "DJ Marco · 3 options", value: "$1,872" },
  { label: "F&B estimate · 150 guests", value: "$3,850" },
];

function PlanCheck() {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-[8px] bg-surface-brand text-[#7b4b94]">
      <Check size={12} strokeWidth={2.4} />
    </span>
  );
}

export function ProposalTab({ client }: { client: AgentClient }) {
  const firstName = client.host.replace(/^The\s+/i, "").split(/\s+/)[0] ?? "client";
  return (
    <div className={CONTENT}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <div className="flex sm:flex-1">
              <Link
                to={clientVendorsHref(client.slug)}
                className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-action-primary px-[18px] text-[14px] font-light leading-5 text-action-primary-text"
              >
                <Plus size={18} strokeWidth={2.4} />
                Add Vendor
              </Link>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-[#e7e2f0] bg-white px-6 py-[22px] sm:flex-1">
              <p className="text-[11px] font-semibold uppercase leading-none tracking-[0.8px] text-[#969199]">Status</p>
              <p className="text-[11px] leading-[18px] text-[#585563]">V3 · sent May 27 · approved May 28</p>
            </div>
          </div>

          <div className={`${CARD} flex flex-col px-7 py-6`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 pb-[18px]">
              <h2 className="font-display text-[22px] font-medium leading-none text-[#1a1721]">Core Plan</h2>
              <p className="text-[12px] font-medium leading-4 tracking-[1.2px] text-[#969199]">
                SIGNATURE PACKAGE · ALL-IN
              </p>
            </div>
            {CORE_PLAN.map((row) => {
              const isPrice = row.value.startsWith("$");
              return (
                <div
                  key={row.label}
                  className="flex items-center gap-3.5 border-b border-[#e7e2f0] py-3.5 last:border-b-0"
                >
                  <PlanCheck />
                  <p className="min-w-0 flex-1 text-[12px] font-medium leading-4 text-[#1a1721]">{row.label}</p>
                  {isPrice ? (
                    <p className="font-display text-[15px] font-medium text-[#1a1721]">{row.value}</p>
                  ) : (
                    <p className="text-[12px] font-medium leading-4 tracking-[0.96px] text-[#969199]">{row.value}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`${CARD} flex flex-col gap-3.5 px-7 py-6`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline gap-x-2 text-[14px]">
                  <p className="font-semibold tracking-[0.8px] text-[#1a1721]">CASA DE FLORES</p>
                  <p className="text-[#969199]">· Florist</p>
                </div>
                <p className="text-[11px] leading-normal text-[#585563]">Replaces Nobu Floral Studio · Maria Cervantes</p>
                <p className="text-[12px] leading-normal text-[#585563]">+52 624 555 0192 · maria@casadeflores.mx</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#e7f0ea] px-2.5 py-1 text-[11px] font-medium leading-none" style={{ color: GREEN }}>
                <span className="size-1.5 rounded-full" style={{ backgroundColor: GREEN }} />
                Booked
              </span>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-[#f0ecf4] pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#969199]">Reception centerpieces</p>
              <div className="flex overflow-hidden rounded-lg bg-surface-page">
                <div className="relative size-[130px] shrink-0">
                  <img src={proposalImg} alt="Garden romance centerpiece" className="h-full w-full object-cover" />
                  <span className="absolute left-2 top-2 flex size-8 items-center justify-center rounded-full bg-action-secondary text-[#1a1721]">
                    <X size={16} strokeWidth={1.8} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 px-4 py-3.5">
                  <p className="text-[16px] font-medium leading-6 text-[#1a1721]">Garden romance</p>
                  <p className="text-[10px] leading-4 text-[#969199]">Pink peonies, white roses, 15 tables</p>
                  <p className="text-[18px] leading-6 text-[#1a1721]">$1,800</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 rounded-lg bg-[#f3f1f7] px-3.5 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#969199]">Host notes</p>
              <p className="text-[12px] leading-[18px] text-[#585563]">
                Pink peonies, no garden roses. Ribbon match to the welcome signage (plum).
              </p>
            </div>

            <div className="flex items-baseline justify-between border-t border-[#f0ecf4] pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#969199]">
                Subtotal · 1 option selected
              </p>
              <p className="text-[16px] leading-6 text-[#1a1721]">$1,800</p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-[360px] lg:shrink-0">
          <div className={`${CARD} flex flex-col gap-2.5 px-6 py-[22px]`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#969199]">Estimated total</p>
            <p className="font-display text-[36px] leading-[42px] text-[#1a1721]">$13,422</p>
            <p className="text-[11px]" style={{ color: PURPLE }}>+$8,630 vs v3</p>
            <div className="flex flex-col border-t border-[#f0ecf4] pt-2">
              {ESTIMATE_ROWS.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-3 py-2">
                  <p className="min-w-0 flex-1 text-[12px] text-[#585563]">{row.label}</p>
                  <p className="shrink-0 font-display text-[13px] text-[#1a1721]">{row.value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-baseline justify-between border-t border-[#f0ecf4] pb-1 pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#1a1721]">Subtotal</p>
              <p className="font-display text-[20px] text-[#1a1721]">$13,422</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-[5px] shrink-0 rounded-full" style={{ backgroundColor: PURPLE }} />
              <p className="text-[11px] text-[#969199]">3 unsent changes · auto-saved 2 min ago</p>
            </div>
            <button
              type="button"
              className="flex items-center justify-center rounded-full bg-action-primary px-5 py-3 text-[13px] font-medium text-action-primary-text"
            >
              Send v4 to {firstName} →
            </button>
            <button
              type="button"
              className="flex items-center justify-center rounded-full bg-[#f3f1f7] px-5 py-2.5 text-[12px] font-medium text-[#1a1721]"
            >
              Preview v4 as PDF
            </button>
          </div>

          <div className={`${CARD} flex flex-col gap-2.5 px-6 py-[22px]`}>
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#969199]">Earnings</p>
              <span className="rounded-full bg-[#f3f1f7] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.6px] text-[#969199]">
                Private
              </span>
            </div>
            <div className="flex flex-col gap-0.5 rounded-[10px] bg-surface-brand px-4 py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#969199]">Your commission</p>
              <p className="font-display text-[28px] leading-8 text-[#1a1721]">$1,860</p>
              <p className="text-[11px] text-[#585563]">14% of vendor base · paid after event</p>
            </div>
            <div className="flex items-baseline justify-between py-2 text-[12px]">
              <p className="text-[#969199]">Draft total (client pays)</p>
              <p className="font-medium text-[#1a1721]">$13,422</p>
            </div>
            <div className="flex items-baseline justify-between py-2 text-[12px]">
              <p className="text-[#969199]">Vendor payments</p>
              <p className="font-medium text-[#1a1721]">$2,100 paid · $11,322 open</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
