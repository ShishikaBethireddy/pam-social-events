import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, AtSign, Plus } from "lucide-react";
import { consumeAgentToast, ADD_CLIENT_HREF, clientHref } from "@/lib/agentNav";
import { AGENT_CLIENTS } from "@/lib/agentClients";
import PortalTopNav from "@/components/agent/PortalTopNav";

/* ── Feedback tokens ── */
const ERROR_SURFACE = "#f9eae8";
const ERROR_TEXT = "#b83d30";
const WARNING_SURFACE = "#fdf1dc";
const WARNING_TEXT = "#c47f12";
const ACCENT = "#7b4b94";

type AttentionTone = "urgent" | "warning";

type AttentionCard = {
  badge: string;
  tone: AttentionTone;
  title: string;
  lines: string[];
  cta: string;
  ctaAccent?: boolean;
};

const ATTENTION_CARDS: AttentionCard[] = [
  {
    badge: "Urgent",
    tone: "urgent",
    title: "2 venue holds expiring this week",
    lines: ["Maya Chen + 24 — Nobu Los Cabos · Sky Terrace", "Daniel Okafor — Nobu Los Cabos · Pool Garden"],
    cta: "Review holds",
    ctaAccent: true,
  },
  {
    badge: "Room block",
    tone: "warning",
    title: "Booking window opens in 6 days",
    lines: ["The Reyes Family", "Nobu Los Cabos", "April 28, 2027", "150 guests"],
    cta: "Prepare booking",
  },
  {
    badge: "Vendor",
    tone: "warning",
    title: "Vendor deposit due",
    lines: ["Maya Chen + 24", "Glow Beauty Co.", "Contract pending signature"],
    cta: "Remind client",
  },
];

type ChipTone = "plain" | "danger" | "warning" | "muted";
type Cell = { text: string; tone?: ChipTone };

const CLIENTS = AGENT_CLIENTS.map((c) => ({
  name: c.host,
  href: clientHref(c.slug),
  date: c.rowDate,
  countdown: c.countdown,
  property: c.property,
  space: c.space,
  contract: c.contract,
  roomBlock: c.roomBlock,
  windowDate: c.windowDate,
  windowOpens: c.windowOpens,
  lastActivity: c.lastActivity,
}));

type Bdm = { brand: string; name: string; initials: string };

const BDMS: Bdm[] = [
  { brand: "NOBU LOS CABOS", name: "Lisa Chen", initials: "LC" },
  { brand: "NOBU MALIBU", name: "Marissa Webb", initials: "MW" },
  { brand: "NOBU MIAMI", name: "David Smith", initials: "DS" },
];

function StatusCell({ cell }: { cell: Cell }) {
  if (!cell.tone || cell.tone === "plain") {
    return <span className="text-body-base text-text-primary">{cell.text}</span>;
  }
  const styles: Record<Exclude<ChipTone, "plain">, { bg: string; color: string }> = {
    danger: { bg: ERROR_SURFACE, color: ERROR_TEXT },
    warning: { bg: WARNING_SURFACE, color: WARNING_TEXT },
    muted: { bg: "#f0f0f0", color: "#585563" },
  };
  const s = styles[cell.tone];
  return (
    <span
      className="inline-flex items-center rounded-[20px] px-[10px] py-[4px] text-[12px] font-medium leading-4"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {cell.text}
    </span>
  );
}

function AttentionCardView({ card }: { card: AttentionCard }) {
  const badgeStyle =
    card.tone === "urgent"
      ? { backgroundColor: ERROR_SURFACE, color: ERROR_TEXT }
      : { backgroundColor: WARNING_SURFACE, color: WARNING_TEXT };
  return (
    <div className="flex w-[268px] shrink-0 flex-col gap-3 rounded-lg bg-surface-default p-3 md:w-auto md:min-w-0 md:flex-1 md:shrink">
      <span
        className="inline-flex w-fit items-center rounded-[2.4px] px-[9.6px] py-[2.4px] text-[12px] font-semibold uppercase leading-[19px]"
        style={badgeStyle}
      >
        {card.badge}
      </span>
      <p className="text-[18px] leading-6 text-text-primary">{card.title}</p>
      <span className="block h-px w-6 bg-[#e0e0e0]" />
      <div className="flex flex-1 flex-col gap-0.5">
        {card.lines.map((line) => (
          <p key={line} className="text-[14px] font-light leading-5 text-text-secondary">
            {line}
          </p>
        ))}
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 py-2 text-left text-[14px] font-medium leading-5"
        style={{ color: card.ctaAccent ? ACCENT : "#1a1721" }}
      >
        {card.cta}
        <ArrowRight size={16} strokeWidth={1.8} />
      </button>
    </div>
  );
}

function SectionHeading({ title, link = "See all" }: { title: string; link?: string }) {
  return (
    <div className="flex items-baseline gap-6">
      <h2 className="font-display text-[30px] leading-10 text-text-primary">{title}</h2>
      <button type="button" className="text-[14px] font-medium leading-5 text-text-brand transition-opacity hover:opacity-70">
        {link}
      </button>
    </div>
  );
}

function AddClientButton({ className = "" }: { className?: string }) {
  return (
    <Link
      to={ADD_CLIENT_HREF}
      className={`flex items-center justify-center gap-1.5 rounded-full bg-action-primary px-[18px] py-2 text-[14px] font-light leading-5 text-action-primary-text ${className}`}
    >
      <Plus size={18} strokeWidth={2.4} />
      Add new client
    </Link>
  );
}

function PamTeamCard({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-4 rounded-lg bg-surface-feature px-6 py-5 ${className}`}>
      <p className="border-b border-white/[0.08] pb-3 text-[20px] leading-7 text-text-inverse">Your PAM Team</p>
      {BDMS.map((bdm) => (
        <div key={bdm.name} className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[rgba(169,139,194,0.5)] bg-white/15 font-display text-[13px] text-text-inverse">
            {bdm.initials}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-[12px] leading-4">
            <p className="text-white/70">{bdm.brand}</p>
            <p className="font-medium text-text-inverse">{bdm.name}</p>
          </div>
          <button
            type="button"
            aria-label={`Message ${bdm.name.split(" ")[0]}`}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border-[0.73px] border-border-brand text-white/60 transition-colors hover:border-white/60 hover:text-text-inverse"
          >
            <AtSign size={20} strokeWidth={1.8} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AgentDashboard() {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const msg = consumeAgentToast();
    if (!msg) return;
    setToast(msg);
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-surface-page font-sans">
      {toast ? (
        <div
          className="fixed left-1/2 top-6 z-[70] max-w-[calc(100%-32px)] -translate-x-1/2 animate-[toast-in_0.25s_ease-out] rounded-full px-[18px] py-3 font-sans text-sm leading-5 text-white shadow-[0_4px_24px_rgba(0,0,0,0.22)]"
          style={{ background: "rgba(0,0,0,0.92)" }}
        >
          {toast}
        </div>
      ) : null}

      <PortalTopNav active="Dashboard" />

      {/* ───────────────── Desktop ───────────────── */}
      <main className="hidden min-w-0 flex-1 flex-col md:flex">
        <header className="flex items-center justify-between px-10 py-[18px]">
          <p className="text-heading-xl text-text-primary">Dashboard</p>
        </header>

        <div className="flex flex-col gap-8 px-10 pb-12">
          <section className="flex flex-col gap-3.5 py-9">
            <SectionHeading title="Needs Your Attention" />
            <div className="flex gap-4">
              {ATTENTION_CARDS.map((card) => (
                <AttentionCardView key={card.title} card={card} />
              ))}
              <PamTeamCard className="w-[300px] shrink-0" />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <SectionHeading title="Your Clients" />
              <AddClientButton />
            </div>
            <div className="scroll-x overflow-x-auto rounded-xl border border-[#e7e2f0] bg-surface-subtle">
              <div className="flex min-w-[1090px] items-start px-5 py-3">
                {[
                  ["CLIENT", "w-[180px]"],
                  ["EVENT DATE", "w-[130px]"],
                  ["PROPERTY", "w-[180px]"],
                  ["EVENT CONTRACT", "w-[170px]"],
                  ["ROOM BLOCK", "w-[170px]"],
                  ["CONFIRMATION WINDOW", "w-[150px]"],
                  ["LAST ACTIVITY", "w-[110px]"],
                ].map(([label, w]) => (
                  <p key={label} className={`text-eyebrow text-text-tertiary ${w}`}>
                    {label}
                  </p>
                ))}
              </div>
              {CLIENTS.map((c) => (
                <Link
                  key={c.name}
                  to={c.href}
                  className="flex min-w-[1090px] items-center border-b border-[#f3f1f7] bg-surface-default px-5 py-4 transition-colors last:border-b-0 hover:bg-surface-subtle"
                >
                  <div className="flex h-10 w-[180px] items-center">
                    <p className="text-body-sm-medium text-text-primary">{c.name}</p>
                  </div>
                  <div className="flex h-10 w-[130px] flex-col gap-px">
                    <p className="text-[12px] font-medium leading-4 text-text-primary">{c.date}</p>
                    <p className="text-label-xs text-text-tertiary">{c.countdown}</p>
                  </div>
                  <div className="flex h-10 w-[180px] flex-col gap-px">
                    <p className="text-[12px] font-medium leading-4 text-text-primary">{c.property}</p>
                    <p className="text-label-xs text-text-tertiary">{c.space}</p>
                  </div>
                  <div className="flex h-10 w-[170px] items-center">
                    <StatusCell cell={c.contract} />
                  </div>
                  <div className="flex h-10 w-[170px] items-center">
                    <StatusCell cell={c.roomBlock} />
                  </div>
                  <div className="flex h-10 w-[150px] flex-col gap-0.5">
                    <p className="text-[12px] font-medium leading-4 text-text-primary">{c.windowDate}</p>
                    <p className="text-label-xs text-text-tertiary">{c.windowOpens}</p>
                  </div>
                  <div className="flex h-10 w-[110px] items-center">
                    <p className="text-label-xs text-text-tertiary">{c.lastActivity}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* ───────────────── Mobile ───────────────── */}
      <main className="flex flex-1 flex-col gap-8 pb-10 md:hidden">
        <section className="flex flex-col gap-3.5 pt-9">
          <div className="flex items-center justify-between px-6">
            <h2 className="font-display text-[28px] leading-9 text-text-primary">Needs Your Attention</h2>
            <button type="button" className="text-[14px] font-medium text-text-brand">
              See all
            </button>
          </div>
          <div className="scroll-x flex gap-4 px-6 pb-1">
            {ATTENTION_CARDS.map((card) => (
              <AttentionCardView key={card.title} card={card} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 px-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[28px] leading-9 text-text-primary">Your Clients</h2>
            <button type="button" className="text-[14px] font-medium text-text-brand">
              See all
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {CLIENTS.map((c) => (
              <Link
                key={c.name}
                to={c.href}
                className="flex flex-col gap-4 rounded-xl border border-[#e7e2f0] bg-surface-default p-4 transition-colors active:bg-surface-subtle"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[20px] leading-7 text-text-primary">{c.name}</p>
                    <p className="text-label-xs text-text-tertiary">
                      {c.property} · {c.space}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[12px] font-medium leading-4 text-text-primary">{c.date}</p>
                    <p className="text-label-xs text-text-tertiary">{c.countdown}</p>
                  </div>
                </div>
                <span className="h-px w-full bg-[#f0ecf4]" />
                <div className="flex gap-10">
                  <div className="flex flex-col gap-1">
                    <p className="text-label-xs text-text-tertiary">Contract</p>
                    <StatusCell cell={c.contract} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-label-xs text-text-tertiary">Room Block</p>
                    <StatusCell cell={c.roomBlock} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <AddClientButton className="w-fit" />
        </section>

        <section className="px-6">
          <PamTeamCard className="w-full" />
        </section>
      </main>
    </div>
  );
}
