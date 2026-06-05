import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import PortalTopNav from "@/components/agent/PortalTopNav";

/* ── Requests inbox — incoming Nobu Social Events leads ── */

type LeadStatus = "open" | "accepted" | "passed";

type Lead = {
  id: string;
  status: LeadStatus;
  source: string;
  host: string;
  firstName: string;
  expires?: string;
  isNew?: boolean;
  eventDate: string;
  eventSub: string;
  guests: string;
  property: string;
  propertySub?: string;
  budget: string;
  budgetSub?: string;
  occasion: string;
  notes: string;
};

const LEADS: Lead[] = [
  {
    id: "camila-50th",
    status: "open",
    source: "nobusocialevents.com · Contact form · Today · 2:14pm · 4hr ago",
    host: "Camila Ortiz",
    firstName: "Camila",
    expires: "Expires in 20hr",
    isNew: true,
    eventDate: "Sep 18 – 20, 2026",
    eventSub: "108 days",
    guests: "80 guests",
    property: "Nobu Los Cabos",
    propertySub: "Open to other Los Cabos options",
    budget: "$45 – 60k",
    budgetSub: "Venue + F&B · ex room block",
    occasion: "50th Birthday",
    notes:
      "We'd love a beachfront dinner at sunset for my mom's 50th, with a long table and live music. Family is flying in from Mexico City and São Paulo. Open to property recommendations but lean toward Nobu since friends celebrated there last fall.",
  },
  {
    id: "aisha-shower",
    status: "open",
    source: "nobusocialevents.com · Venue request · Today · 9:48am · 9hr ago",
    host: "Aisha Bello",
    firstName: "Aisha",
    isNew: true,
    eventDate: "Feb 13 – 15, 2027",
    eventSub: "256 days",
    guests: "30 guests",
    property: "Nobu Los Cabos",
    propertySub: "Stone Garden specifically",
    budget: "$25 – 35k",
    budgetSub: "All in",
    occasion: "Engagement Party",
    notes:
      "We saw a friend's Instagram tour of Stone Garden and that sealed it for us. Looking for the most intimate version of this — closer to a dinner party than a full reception. Vegan menu options are non-negotiable. Acoustic music only, no DJ.",
  },
  {
    id: "hana-reunion",
    status: "open",
    source: "nobusocialevents.com · Save-the-date inquiry · Yesterday · 6:30pm · 22hr ago",
    host: "The Okeke Family",
    firstName: "Hana",
    expires: "Expires in 2hr",
    isNew: true,
    eventDate: "May 1 – 3, 2027",
    eventSub: "335 days",
    guests: "120 guests",
    property: "No preference",
    propertySub: "Wants a recommendation",
    budget: "Flexible",
    budgetSub: "Targeting $60k venue, more open elsewhere",
    occasion: "Family Reunion",
    notes:
      "Large multi-generational reunion. We need a property comfortable hosting kids and elders, with both a private dinner and a casual day at the pool. Families fly in from Vancouver and Lagos. Looking for someone who can recommend the right venue — we don't know what we don't know.",
  },
];

const TABS = [
  { key: "open" as const, label: "Open", count: 3 },
  { key: "accepted" as const, label: "Accepted", count: 8 },
  { key: "passed" as const, label: "Passed", count: 4 },
  { key: "all" as const, label: "All", count: 15 },
];

type TabKey = (typeof TABS)[number]["key"];

function DetailCell({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#969199]">{label}</p>
      <p className="font-display text-[15px] leading-5 text-[#1a1721]">{value}</p>
      {sub ? <p className="text-[11px] leading-4 text-[#969199]">{sub}</p> : null}
    </div>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <article className="flex flex-col rounded-[14px] bg-white px-6 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:px-7 md:py-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#969199]">{lead.source}</p>
          <h2 className="font-display text-[24px] leading-7 text-[#1a1721]">{lead.host}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {lead.expires ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f9eae8] px-2.5 py-1 text-[11px] font-medium text-[#b83d30]">
              <span className="size-1.5 rounded-full bg-[#b83d30]" />
              {lead.expires}
            </span>
          ) : null}
          {lead.isNew ? (
            <span className="inline-flex items-center rounded-full bg-[#ede7f6] px-2.5 py-1 text-[11px] font-medium text-[#7b4b94]">
              + New
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[#f0ecf4] pt-5 sm:grid-cols-3 lg:grid-cols-5">
        <DetailCell label="Event date" value={lead.eventDate} sub={lead.eventSub} />
        <DetailCell label="Guest count" value={lead.guests} />
        <DetailCell label="Property preference" value={lead.property} sub={lead.propertySub} />
        <DetailCell label="Budget" value={lead.budget} sub={lead.budgetSub} />
        <DetailCell label="Occasion" value={lead.occasion} />
      </div>

      <div className="mt-5 rounded-[10px] bg-[#faf9fc] p-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.8px] text-[#969199]">
          Notes from {lead.firstName}
        </p>
        <p className="text-[13px] leading-5 text-[#585563]">{lead.notes}</p>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-[10px] bg-[#f3f1f7] px-4 py-3">
        <input
          type="text"
          placeholder={`Reply to ${lead.firstName}…`}
          className="min-w-0 flex-1 bg-transparent text-[13px] text-text-primary outline-none placeholder:text-[#969199]"
        />
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-[#7b4b94] transition-colors hover:text-[#5e3873]"
        >
          <Sparkles size={14} strokeWidth={1.8} />
          Draft with Allie
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5 text-[12px] text-[#969199]">
          <button type="button" className="underline underline-offset-2 transition-colors hover:text-text-primary">
            View original inquiry
          </button>
          <button type="button" className="underline underline-offset-2 transition-colors hover:text-text-primary">
            Why was this routed to you?
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-[#d0d0d0] bg-white px-5 py-2 text-[13px] font-medium text-[#1a1721] transition-colors hover:border-[#969199]"
          >
            Pass
          </button>
          <button
            type="button"
            className="rounded-full bg-black px-5 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Accept lead
          </button>
        </div>
      </div>
    </article>
  );
}

export default function RequestsInbox() {
  const [tab, setTab] = useState<TabKey>("open");

  const visible = useMemo(() => {
    if (tab === "all") return LEADS;
    return LEADS.filter((l) => l.status === tab);
  }, [tab]);

  return (
    <div className="flex min-h-dvh flex-col bg-surface-page font-sans">
      <PortalTopNav active="Requests" />

      <main className="mx-auto w-full max-w-[1280px] px-6 pb-16 pt-8 md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#969199]">Inbox</p>
        <h1 className="mt-1 font-display text-[32px] leading-10 text-[#1a1721]">Requests</h1>
        <p className="mt-1 text-[13px] text-[#969199]">
          3 new leads · 12 reviewed in the past 30 days · avg 4hr response time
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  active ? "bg-black text-white" : "border border-[#e7e2f0] bg-white text-[#585563] hover:border-[#969199]"
                }`}
              >
                {t.label}
                <span className={active ? "text-[#b3b3b3]" : "text-[#969199]"}>{t.count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-[10px] bg-[#ede7f6] px-4 py-3">
          <Sparkles size={14} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#7b4b94]" />
          <p className="text-[12px] leading-5 text-[#5e4a70]">
            These are hosts who reached out through Nobu Social Events. Open leads expire if no one responds in 24hr —
            they re-route to another advisor. Pass anything that isn&apos;t a fit and it goes back to PAM&apos;s pool.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {visible.length > 0 ? (
            visible.map((lead) => <LeadCard key={lead.id} lead={lead} />)
          ) : (
            <div className="rounded-[14px] bg-white px-6 py-16 text-center">
              <p className="text-[14px] text-[#969199]">No {tab} requests right now.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
