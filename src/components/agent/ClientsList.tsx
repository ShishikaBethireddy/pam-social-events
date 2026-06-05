import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronDown, Mail, Eye, Search, Plus } from "lucide-react";
import { AGENT_CLIENTS, type Cell } from "@/lib/agentClients";
import { ADD_CLIENT_HREF, clientHref } from "@/lib/agentNav";
import PortalTopNav from "@/components/agent/PortalTopNav";

const FILTERS = [
  { label: "All", count: "12", active: true },
  { label: "Pre-booking", count: "4" },
  { label: "Confirmed", count: "6" },
  { label: "Post-booking", count: "2" },
  { label: "Drafts", count: "2" },
];

const ROWS = AGENT_CLIENTS.map((c) => ({
  slug: c.slug,
  host: c.host,
  space: c.space,
  rowDate: c.rowDate,
  countdown: c.countdown,
  property: c.property,
  guests: c.guests,
  contract: c.contract,
  roomBlock: c.roomBlock,
  windowDate: c.windowDate,
  windowOpens: c.windowOpens,
  lastActivity: c.lastActivity,
}));

function chipStyle(cell: Cell): { bg: string; fg: string } {
  if (cell.tone === "danger") return { bg: "#f9eae8", fg: "#b83d30" };
  if (cell.tone === "warning") return { bg: "#faf2e3", fg: "#9c7826" };
  if (cell.tone === "muted") return { bg: "#f2f2f2", fg: "#585563" };
  if (/confirmed/i.test(cell.text) || /\d+\s*\/\s*\d+/.test(cell.text)) {
    return { bg: "#e7f0ea", fg: "#2f7d57" };
  }
  return { bg: "#f2f2f2", fg: "#585563" };
}

function StatusChip({ cell }: { cell: Cell }) {
  const s = chipStyle(cell);
  return (
    <span
      className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium leading-4"
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: s.fg }} />
      {cell.text}
    </span>
  );
}

function roomBlockPct(text: string): number | null {
  const m = text.match(/(\d+)\s*\/\s*(\d+)/);
  if (!m) return null;
  const num = Number(m[1]);
  const den = Number(m[2]);
  if (!den) return null;
  return Math.min(100, Math.round((num / den) * 100));
}

function RowAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span
      aria-label={label}
      className="flex size-7 items-center justify-center rounded-md bg-[#f3f1f7] text-[#585563]"
    >
      {icon}
    </span>
  );
}

export default function ClientsList() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-page font-sans">
      <PortalTopNav active="Clients" />

      <main className="flex flex-1 flex-col gap-7 px-6 py-8 md:px-10">
        {/* Topbar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-[28px] leading-9 text-text-primary md:text-[32px] md:leading-10">Clients</h1>
            <p className="text-[13px] leading-5 text-text-tertiary">12 active · 2 drafts</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex h-10 flex-1 items-center gap-2.5 rounded-lg border border-border-default bg-white px-3.5 md:w-[320px] md:flex-none">
              <Search size={16} strokeWidth={1.8} className="shrink-0 text-text-tertiary" />
              <input
                type="search"
                placeholder="Search clients, venues, dates…"
                className="min-w-0 flex-1 bg-transparent text-[13px] leading-5 text-text-primary outline-none placeholder:text-text-tertiary"
              />
            </label>
            <Link
              to={ADD_CLIENT_HREF}
              className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-action-primary px-[18px] text-[13px] font-medium leading-5 text-action-primary-text"
            >
              <Plus size={15} strokeWidth={2.4} />
              <span className="hidden sm:inline">New Client</span>
            </Link>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="scroll-x flex gap-2 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f.label}
                type="button"
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] leading-4 ${
                  f.active ? "bg-action-primary text-white" : "border border-border-default bg-white text-text-secondary"
                }`}
              >
                <span className="font-medium">{f.label}</span>
                <span className={f.active ? "text-white/60" : "text-text-tertiary"}>{f.count}</span>
              </button>
            ))}
          </div>
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <span className="text-[12px] font-semibold uppercase leading-4 tracking-[0.8px] text-text-tertiary">Sort</span>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-border-default bg-white px-3.5 py-2 text-[12px] font-medium leading-4 text-text-primary"
            >
              Event date (soonest)
              <ChevronDown size={12} strokeWidth={2.4} className="text-text-tertiary" />
            </button>
          </div>
        </div>

        {/* Table (desktop) */}
        <div className="hidden overflow-hidden rounded-xl border border-border-default bg-white md:block">
          <div className="scroll-x overflow-x-auto">
            <div className="min-w-[1040px]">
              <div className="flex items-start gap-4 border-b border-[#ece8f3] bg-[#fbfaff] px-6 py-3.5">
                {[
                  ["CLIENT", "w-[180px]"],
                  ["EVENT DATE", "w-[100px]"],
                  ["PROPERTY", "w-[160px]"],
                  ["CONTRACT", "w-[110px]"],
                  ["ROOM BLOCK", "w-[140px]"],
                  ["CONF. WINDOW", "w-[110px]"],
                  ["ACTIVITY", "w-[90px]"],
                  ["", "w-[100px]"],
                ].map(([label, w]) => (
                  <p
                    key={label || "actions"}
                    className={`text-[12px] font-semibold uppercase leading-4 tracking-[0.8px] text-text-tertiary ${w}`}
                  >
                    {label}
                  </p>
                ))}
              </div>
              {ROWS.map((c) => {
                const pct = roomBlockPct(c.roomBlock.text);
                return (
                  <Link
                    key={c.slug}
                    to={clientHref(c.slug)}
                    className="flex items-center gap-4 border-b border-[#ece8f3] px-6 py-4 transition-colors last:border-b-0 hover:bg-surface-subtle"
                  >
                    <div className="flex w-[180px] flex-col gap-0.5">
                      <p className="text-[13px] font-medium leading-5 text-text-primary">{c.host}</p>
                      <p className="text-[11px] leading-4 text-text-tertiary">{c.space}</p>
                    </div>
                    <div className="flex w-[100px] flex-col gap-0.5">
                      <p className="text-[13px] font-medium leading-5 text-text-primary">{c.rowDate}</p>
                      <p className="text-[11px] leading-4 text-text-tertiary">{c.countdown}</p>
                    </div>
                    <div className="flex w-[160px] flex-col gap-0.5">
                      <p className="text-[13px] font-medium leading-5 text-text-primary">{c.property}</p>
                      <p className="text-[11px] leading-4 text-text-tertiary">{c.guests}</p>
                    </div>
                    <div className="w-[110px]">
                      <StatusChip cell={c.contract} />
                    </div>
                    <div className="flex w-[140px] flex-col gap-1.5">
                      <StatusChip cell={c.roomBlock} />
                      {pct != null ? (
                        <span className="h-1 w-20 overflow-hidden rounded-full bg-[#ece8f3]">
                          <span className="block h-full rounded-full bg-action-primary" style={{ width: `${pct}%` }} />
                        </span>
                      ) : null}
                    </div>
                    <div className="flex w-[110px] flex-col gap-0.5">
                      <p className="text-[13px] font-medium leading-5 text-text-primary">{c.windowDate}</p>
                      <p className="text-[11px] leading-4 text-text-tertiary">{c.windowOpens}</p>
                    </div>
                    <p className="w-[90px] text-[12px] leading-4 text-text-tertiary">{c.lastActivity}</p>
                    <div className="flex w-[100px] items-center gap-1.5">
                      <RowAction icon={<ArrowUpRight size={14} strokeWidth={1.8} />} label="Open" />
                      <RowAction icon={<Mail size={14} strokeWidth={1.8} />} label="Message" />
                      <RowAction icon={<Eye size={14} strokeWidth={1.8} />} label="Preview" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cards (mobile) */}
        <div className="flex flex-col gap-3 md:hidden">
          {ROWS.map((c) => (
            <Link
              key={c.slug}
              to={clientHref(c.slug)}
              className="flex flex-col gap-4 rounded-xl border border-border-default bg-white p-4 transition-colors active:bg-surface-subtle"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[18px] leading-6 text-text-primary">{c.host}</p>
                  <p className="text-[11px] leading-4 text-text-tertiary">
                    {c.property} · {c.space}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[12px] font-medium leading-4 text-text-primary">{c.rowDate}</p>
                  <p className="text-[11px] leading-4 text-text-tertiary">{c.countdown}</p>
                </div>
              </div>
              <span className="h-px w-full bg-[#f0ecf4]" />
              <div className="flex gap-8">
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] leading-4 text-text-tertiary">Contract</p>
                  <StatusChip cell={c.contract} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] leading-4 text-text-tertiary">Room Block</p>
                  <StatusChip cell={c.roomBlock} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
