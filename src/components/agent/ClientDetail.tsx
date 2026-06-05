import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, AtSign, Pencil } from "lucide-react";
import { CLIENTS_HREF } from "@/lib/agentNav";
import PortalTopNav from "@/components/agent/PortalTopNav";
import ClientNotes from "@/components/agent/ClientNotes";
import ClientTabs, { type Tab } from "@/components/agent/ClientTabs";
import ActionItems from "@/components/agent/ActionItems";
import { RoomBlockTab, TravelTab, ActivityTab, ProposalTab } from "@/components/agent/ClientTabPanels";
import {
  clientMetaLine,
  hostInitials,
  type AgentClient,
  type AmountTone,
  type InfoRow,
  type PillTone,
  type StatusItem,
} from "@/lib/agentClients";

/* Palette — re-themed to the Social Events purple/ink scheme. */
const FEATURE = "#7b4b94"; // brand purple — accent links + BDM card
const INK = "#1a1721";
const MUTED = "#969199";

const ERROR_SURFACE = "#fdecea";
const ERROR_TEXT = "#c0392b";
const WARNING_SURFACE = "#fef3ec";
const WARNING_TEXT = "#d4652a";
const SUCCESS_SURFACE = "#e7f0ea";
const SUCCESS_TEXT = "#2f7d57";
const BRAND_SURFACE = "#ede7f6"; // lavender
const BRAND_TEXT = "#6a3f82";
const BRAND_DOT = "#a98bc2";
const SUBTLE_SURFACE = "#f3f1f7";
const SECONDARY_TEXT = "#585563";
const TINT_TERTIARY = "#969199";

type Tones = { bg: string; color: string; dot: string };
const PILL_TONES: Record<PillTone, Tones> = {
  gold: { bg: BRAND_SURFACE, color: BRAND_TEXT, dot: BRAND_DOT },
  orange: { bg: WARNING_SURFACE, color: WARNING_TEXT, dot: WARNING_TEXT },
  red: { bg: ERROR_SURFACE, color: ERROR_TEXT, dot: ERROR_TEXT },
  neutral: { bg: SUBTLE_SURFACE, color: SECONDARY_TEXT, dot: TINT_TERTIARY },
};

const TAG_TONES: Record<PillTone | "green", { bg: string; color: string }> = {
  gold: { bg: BRAND_SURFACE, color: BRAND_TEXT },
  green: { bg: SUCCESS_SURFACE, color: SUCCESS_TEXT },
  red: { bg: ERROR_SURFACE, color: ERROR_TEXT },
  orange: { bg: WARNING_SURFACE, color: WARNING_TEXT },
  neutral: { bg: SUBTLE_SURFACE, color: SECONDARY_TEXT },
};

const AMOUNT_COLOR: Record<AmountTone, string> = {
  ink: INK,
  muted: MUTED,
  red: ERROR_TEXT,
};

const BTN_DARK =
  "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-[#1a1721] px-4 font-sans text-[15px] font-medium leading-6 text-white transition-opacity hover:opacity-90 md:h-12 md:px-6 md:text-base";

const RING = "ring-1 ring-[rgba(123,75,148,0.3)]";

function Monogram({ initials, size, className = "" }: { initials: string; size: number; className?: string }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-brand ${RING} ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="font-display text-text-brand" style={{ fontSize: Math.round(size * 0.36) }}>
        {initials}
      </span>
    </div>
  );
}

function HostAvatar({ client }: { client: AgentClient }) {
  if (client.photo) {
    return (
      <div className={`relative size-[72px] shrink-0 overflow-hidden rounded-full ${RING} md:size-[120px]`}>
        <img src={client.photo} alt={client.host} className="h-full w-full object-cover object-center" />
      </div>
    );
  }
  return (
    <div
      className={`flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-brand ${RING} md:size-[120px]`}
    >
      <span className="font-display text-[26px] text-text-brand md:text-[42px]">{hostInitials(client.host)}</span>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-semibold uppercase leading-4 tracking-[0.067em] text-[#969199]">{children}</p>
  );
}

function AccentLink({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 text-[13px] font-medium leading-5 transition-opacity hover:opacity-70"
      style={{ color: FEATURE }}
    >
      {children}
      <ArrowRight size={15} strokeWidth={1.8} />
    </button>
  );
}

function StatusPill({ text, tone = "gold" }: { text: string; tone?: PillTone }) {
  const c = PILL_TONES[tone];
  return (
    <span
      className="flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none"
      style={{ backgroundColor: c.bg, color: c.color, borderColor: "rgba(123,75,148,0.25)" }}
    >
      <span className="size-[5px] rounded-full" style={{ backgroundColor: c.dot }} />
      {text}
    </span>
  );
}

function StatusTag({ text, tone }: { text: string; tone: PillTone | "green" }) {
  const c = TAG_TONES[tone];
  return (
    <span
      className="flex h-fit shrink-0 items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.1em]"
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      {text}
    </span>
  );
}

function CardHeading({ title, action }: { title: string; action?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="font-display text-[18px] font-medium leading-normal text-[#1a1721]">{title}</h2>
      {action ? <AccentLink>{action}</AccentLink> : null}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`flex w-full flex-col rounded-[14px] border border-[#e7e2f0] bg-white px-[26px] py-6 ${className}`}>
      {children}
    </section>
  );
}

function StatusGroup({ s }: { s: StatusItem }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <p className="text-[10px] leading-4 text-[#969199]">{s.label}</p>
      {s.kind === "pill" ? (
        <StatusPill text={s.text} tone={s.tone} />
      ) : (
        <div className="flex items-baseline gap-1.5">
          <p className="font-sans text-[16px] font-medium leading-6" style={{ color: INK }}>
            {s.text}
          </p>
          {s.suffix ? <p className="text-[12px] text-[#969199]">{s.suffix}</p> : null}
        </div>
      )}
    </div>
  );
}

function InfoRowView({ row }: { row: InfoRow }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[#f3f1f7] py-2.5 text-[12px] last:border-b-0">
      <span className="text-[#969199]">{row.label}</span>
      <span className="font-medium" style={{ color: row.danger ? WARNING_TEXT : INK }}>
        {row.value}
      </span>
    </div>
  );
}

export default function ClientDetail({ client }: { client: AgentClient }) {
  const bdmBrand = client.bdm.label.split("·").pop()?.trim().toUpperCase() ?? "PAM";
  const clientEmail = client.info.find((r) => r.label.toLowerCase() === "email")?.value;
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <div className="flex min-h-dvh flex-col bg-surface-page font-sans">
      <PortalTopNav active="Clients" />

      <ClientTabs variant="mobile" active={tab} onChange={setTab} />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Client top strip */}
        <div className="relative flex flex-col overflow-hidden border-b border-[#e7e2f0] bg-white px-6 pt-[18px] md:px-10">
          {/* Lavender ribbon wash, faded into white on the left so the avatar + name stay legible. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{ background: "linear-gradient(to right, #ffffff 35%, rgba(237,231,246,0.85) 75%, rgba(200,174,218,0.55) 100%)" }}
          />

          <Link
            to={CLIENTS_HREF}
            className="relative z-10 inline-flex w-fit items-center gap-1.5 text-[11px] text-[#969199] transition-colors hover:text-text-primary"
          >
            <ArrowRight size={12} strokeWidth={1.4} className="rotate-180" />
            Back to Clients
          </Link>

          <div className="relative z-10 flex flex-col gap-4 pb-4 pt-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <HostAvatar client={client} />
              <div className="flex flex-col gap-1.5 md:gap-2">
                <h1 className="font-display text-[24px] leading-8 text-[#1a1721] md:text-[30px] md:leading-[40px]">
                  {client.host}
                </h1>
                <p className="text-[13px] font-medium leading-5 text-[#585563] md:text-[14px]">
                  {clientMetaLine(client)}
                </p>
              </div>
            </div>
            <div className="flex w-full gap-3 md:w-auto md:shrink-0 md:gap-4">
              <a
                href={
                  clientEmail
                    ? `mailto:${clientEmail}?subject=${encodeURIComponent(`${client.host} — ${client.property}`)}`
                    : undefined
                }
                className={`${BTN_DARK} flex-1 md:flex-none`}
              >
                Message client
              </a>
            </div>
          </div>

          <ClientTabs variant="desktop" active={tab} onChange={setTab} />
        </div>

        {tab === "Room Block" ? <RoomBlockTab client={client} /> : null}
        {tab === "Travel" ? <TravelTab client={client} /> : null}
        {tab === "Activity" ? <ActivityTab client={client} /> : null}
        {tab === "Proposal" ? <ProposalTab client={client} /> : null}

        {tab === "Overview" ? (
          <>
            {/* Status bar */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-[#e7e2f0] bg-white px-6 py-5 md:flex md:gap-8 md:overflow-x-auto md:px-10 md:py-[22px]">
              {client.status.map((s, i) => (
                <div key={s.label} className="flex items-stretch gap-6 md:shrink-0 md:gap-8">
                  {i > 0 ? <span className="hidden h-9 w-px self-center bg-[#e7e2f0] md:block" /> : null}
                  <StatusGroup s={s} />
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-7 px-6 py-8 md:flex-row md:px-10">
              {/* Left column */}
              <div className="flex min-w-0 flex-1 flex-col gap-5">
                <ActionItems items={client.actionItems} count={client.actionCount} />

                {client.money || client.roomBlockDetail ? (
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
                    {client.money ? (
                      <Card className="lg:min-w-0 lg:flex-1">
                        <div className="pb-3">
                          <CardHeading title="Payments" action="See details" />
                        </div>
                        {client.money.rows
                          .filter((row) => !row.proposalOnly)
                          .map((row) => (
                            <div
                              key={row.title}
                              className="flex items-center gap-3 border-b border-[#f3f1f7] py-3.5 md:gap-4"
                            >
                              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                <p className="text-[13px] font-medium text-[#1a1721]">{row.title}</p>
                                <p className="text-[11px] leading-normal text-[#969199]">{row.sub}</p>
                              </div>
                              <StatusTag text={row.tag} tone={row.tagTone} />
                              <p
                                className="shrink-0 text-right font-sans text-[16px] leading-6"
                                style={{ color: AMOUNT_COLOR[row.amountTone] }}
                              >
                                {row.amount}
                              </p>
                            </div>
                          ))}
                        <div className="flex items-center gap-3 border-t border-[#e7e2f0] pb-1 pt-4 md:gap-4">
                          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <p className="text-[13px] font-semibold text-[#1a1721]">{client.money.outstandingLabel}</p>
                            <p className="text-[11px] leading-normal text-[#969199]">{client.money.outstandingSub}</p>
                          </div>
                          <p className="shrink-0 font-sans text-[16px] leading-6 text-[#1a1721]">
                            {client.money.outstandingAmount}
                          </p>
                        </div>
                      </Card>
                    ) : null}

                    {client.roomBlockDetail ? (
                      <Card className="gap-[18px] lg:min-w-0 lg:flex-1">
                        <CardHeading title="Room Block" action="Manage block" />
                        <div className="flex gap-8">
                          {[
                            { n: client.roomBlockDetail.allocated, l: "ALLOCATED" },
                            { n: client.roomBlockDetail.confirmed, l: "CONFIRMED" },
                            { n: client.roomBlockDetail.unclaimed, l: "UNCLAIMED" },
                          ].map((s) => (
                            <div key={s.l} className="flex flex-col gap-[3px]">
                              <p className="font-display text-[24px] font-medium leading-normal text-[#1a1721]">{s.n}</p>
                              <p className="text-[10px] font-semibold leading-normal tracking-[0.08em] text-[#969199]">
                                {s.l}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[11px] text-[#969199]">
                            <span>Block utilization</span>
                            <span>{client.roomBlockDetail.utilizationPct}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f3f1f7]">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${client.roomBlockDetail.utilizationPct}%`, backgroundColor: BRAND_DOT }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[#969199]">Edit window closes</span>
                            <span className="font-semibold" style={{ color: WARNING_TEXT }}>
                              {client.roomBlockDetail.editCloses}
                            </span>
                          </div>
                        </div>
                        {client.roomBlockDetail.warning ? (
                          <div className="rounded-[4px] bg-[#f9eae8] px-3.5 py-3">
                            <p className="text-[12px] leading-[1.45] text-[#2b2b27]">
                              {client.roomBlockDetail.warning}{" "}
                              <button
                                type="button"
                                className="font-medium text-[#2b2b27] underline underline-offset-2"
                              >
                                View guest list
                              </button>
                            </p>
                          </div>
                        ) : null}
                      </Card>
                    ) : null}
                  </div>
                ) : null}

                <Card>
                  <div className="pb-3.5">
                    <CardHeading title="Recent Activity" action="View full log" />
                  </div>
                  {client.activity.map((a) => (
                    <div
                      key={a.text}
                      className="flex items-start gap-3 border-b border-[#f3f1f7] py-[11px] last:border-b-0"
                    >
                      <span
                        className="mt-[5px] size-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: a.dotTone === "green" ? SUCCESS_TEXT : BRAND_DOT }}
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <p className="text-[12px] leading-[1.4] text-[#1a1721]">{a.text}</p>
                        <p className="text-[11px] text-[#969199]">{a.meta}</p>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>

              {/* Right rail */}
              <div className="flex w-full flex-col gap-7 md:w-[360px] md:shrink-0">
                <div className="flex flex-col rounded-2xl bg-surface-brand">
                  {client.coordinator ? (
                    <div className="flex flex-col gap-2.5 px-6 pb-4 pt-[18px]">
                      <Eyebrow>On-property coordinator</Eyebrow>
                      <div className="flex items-center gap-3.5">
                        {client.coordinator.photo ? (
                          <img
                            src={client.coordinator.photo}
                            alt={client.coordinator.name}
                            className="size-[52px] shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <Monogram initials={client.coordinator.initials} size={52} />
                        )}
                        <div className="flex min-w-0 flex-col gap-[3px]">
                          <p className="text-[16px] font-medium leading-6 text-text-primary">
                            {client.coordinator.name}
                          </p>
                          <p className="text-[12px] leading-4 text-text-primary">{client.coordinator.role}</p>
                          {client.coordinator.contactHref ? (
                            <a
                              href={client.coordinator.contactHref}
                              className="mt-1 inline-flex w-fit items-center gap-1 text-[12px] font-medium text-text-brand transition-opacity hover:opacity-80"
                            >
                              <AtSign size={13} strokeWidth={2.2} />
                              Contact {client.coordinator.name.split(" ")[0]}
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <span className="mx-3 h-px bg-border-muted" />

                  <div className="flex flex-col px-6 py-4">
                    <div className="flex items-center justify-between gap-2.5">
                      <Eyebrow>Client info</Eyebrow>
                      <button
                        type="button"
                        aria-label="Edit client info"
                        className="flex size-8 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-surface-subtle hover:text-text-primary"
                      >
                        <Pencil size={16} strokeWidth={1.8} />
                      </button>
                    </div>
                    <div className="flex flex-col">
                      {client.info.map((row) => (
                        <InfoRowView key={row.label} row={row} />
                      ))}
                    </div>
                  </div>

                  <span className="mx-3 h-px bg-border-muted" />

                  <div className="px-6 pb-6 pt-4">
                    <ClientNotes slug={client.slug} initialNotes={client.notes} bare />
                  </div>
                </div>

                {/* Your BDM */}
                <div className="flex flex-col gap-4 rounded-lg bg-surface-feature px-6 py-5">
                  <div className="border-b border-white/[0.08] pb-4">
                    <p className="text-[20px] leading-7 text-text-inverse">Your BDM</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[rgba(169,139,194,0.5)] bg-white/15">
                      <span className="font-display text-[13px] text-text-inverse">{client.bdm.initials}</span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-[12px] leading-4">
                      <p className="text-white/70">{bdmBrand}</p>
                      <p className="font-medium text-text-inverse">{client.bdm.name}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Message ${client.bdm.name.split(" ")[0]}`}
                      className="flex size-9 shrink-0 items-center justify-center rounded-full border-[0.73px] border-border-brand text-white/60 transition-colors hover:border-white/60 hover:text-text-inverse"
                    >
                      <AtSign size={18} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
