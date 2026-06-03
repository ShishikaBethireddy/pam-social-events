import { Link } from "react-router-dom";
import nobuLogo from "@/assets/logo-nobu-white.png";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Gauge,
  Inbox,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { TRAVEL_AGENT_CLIENTS, type ClientStatus } from "@/lib/travelAgentData";

const TAB_ORDER: ("All" | ClientStatus)[] = [
  "All",
  "Lead",
  "Proposal",
  "Hold",
  "Confirmed",
  "Closed",
];

const TAB_LABEL: Record<(typeof TAB_ORDER)[number], string> = {
  All: "All",
  Lead: "New",
  Proposal: "In progress",
  Hold: "Awaiting review",
  Confirmed: "Submitted",
  Closed: "Lost",
};

const statusPill: Record<ClientStatus, { label: string; cls: string }> = {
  Lead: { label: "NEW", cls: "bg-cream text-ink" },
  Proposal: {
    label: "IN PROGRESS",
    cls: "bg-copper/15 text-copper-active",
  },
  Hold: {
    label: "AWAITING REVIEW",
    cls: "bg-copper/30 text-copper-active",
  },
  Confirmed: {
    label: "SUBMITTED",
    cls: "bg-[hsl(150,30%,82%)] text-[hsl(150,40%,18%)]",
  },
  Closed: { label: "LOST", cls: "bg-disabled-bg text-disabled-fg" },
};

const initialsOf = (name: string) =>
  name
    .replace(/&/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

const TravelAgent = () => {
  const [tab, setTab] = useState<(typeof TAB_ORDER)[number]>("All");

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: TRAVEL_AGENT_CLIENTS.length };
    TAB_ORDER.slice(1).forEach((s) => {
      c[s] = TRAVEL_AGENT_CLIENTS.filter((x) => x.status === s).length;
    });
    return c;
  }, []);

  const rows = useMemo(() => {
    if (tab === "All") return TRAVEL_AGENT_CLIENTS;
    return TRAVEL_AGENT_CLIENTS.filter((c) => c.status === tab);
  }, [tab]);

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="w-full bg-sunset-gradient text-paper text-center text-[11px] tracking-[0.4em] py-1.5 font-sans font-semibold uppercase">
        Social Events · Travel Agent
      </div>
      <header className="bg-ink">
        <div className="container flex items-center justify-between py-6">
          <Link
            to="/"
            className="flex h-[32px] items-center"
            aria-label="Nobu Hotel Los Cabos"
          >
            <img
              src={nobuLogo}
              alt="Nobu Hotel Los Cabos"
              className="h-[28px] w-auto object-contain"
            />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-paper/80 hover:text-paper font-sans"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="flex-1 container max-w-[1280px] py-10 sm:py-14">
        {/* Greeting */}
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
            Project preview
          </span>
          <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            {today}
          </span>
        </div>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl leading-[1.05] tracking-tight">
          Good morning, Sloane.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Synced with Cvent, direct client portal and Opera PMS at 9:14 AM. Auto-drafted
          proposals are ready for review.
        </p>

        {/* Stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active RFPs" value="14" footer="+3 this week" icon={<Inbox className="h-4 w-4" strokeWidth={1.5} />} />
          <StatCard label="Pipeline value" value="$2.4M" footer="+18% MoM" icon={<TrendingUp className="h-4 w-4" strokeWidth={1.5} />} />
          <StatCard label="Avg. response time" value="4.2h" footer="−61% vs. baseline" icon={<CalendarDays className="h-4 w-4" strokeWidth={1.5} />} />
          <StatCard label="Win rate (90d)" value="42%" footer="+9 pts" icon={<Gauge className="h-4 w-4" strokeWidth={1.5} />} />
        </div>

        {/* Inbox header + tabs */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl">Client tracker</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Every social event you're managing across Nobu Los Cabos
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {TAB_ORDER.map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={
                    active
                      ? "rounded-md bg-foreground px-3 py-1.5 text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  {TAB_LABEL[t]}{" "}
                  <span className={active ? "text-primary-foreground/70" : "text-muted-foreground/70"}>
                    ({counts[t] ?? 0})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-hidden rounded-md border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="px-6 py-4 text-left font-normal">Client / Event</th>
                  <th className="px-4 py-4 text-left font-normal">Dates</th>
                  <th className="px-4 py-4 text-left font-normal">Due</th>
                  <th className="px-4 py-4 text-left font-normal">Status</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => {
                  const pill = statusPill[c.status];
                  return (
                    <tr key={c.id} className="border-b border-border last:border-b-0 hover:bg-secondary/30">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-[11px] font-medium tracking-wide text-foreground">
                            {initialsOf(c.clientName)}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{c.clientName}</div>
                            <div className="text-xs text-muted-foreground">{c.eventType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="text-foreground">{c.eventDate}</div>
                        <div className="text-xs text-muted-foreground">{c.nights} nights</div>
                      </td>
                      <td className="px-4 py-5 text-foreground">{c.eventDate}</td>
                      <td className="px-4 py-5">
                        <span
                          className={`inline-flex rounded px-2 py-0.5 text-[10px] font-medium tracking-[0.15em] ${pill.cls}`}
                        >
                          {pill.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link
                          to={`/travel-agent/${c.id}`}
                          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                        >
                          Open
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      Nothing here yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  footer,
  icon,
}: {
  label: string;
  value: string;
  footer: string;
  icon: React.ReactNode;
}) => (
  <div className="rounded-md border border-border bg-card p-5">
    <div className="flex items-start justify-between">
      <p className="text-[13px] text-muted-foreground">{label}</p>
      <span className="text-muted-foreground">{icon}</span>
    </div>
    <p className="mt-5 font-serif text-5xl leading-none tracking-tight text-foreground">
      {value}
    </p>
    <p className="mt-5 text-[12px] text-copper-active">{footer}</p>
  </div>
);

export default TravelAgent;