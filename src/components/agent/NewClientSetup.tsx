import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Sparkles, X } from "lucide-react";
import { AGENT_HUB_HREF, setAgentToast } from "@/lib/agentNav";

const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Bachelor / Bachelorette",
  "Family Reunion",
  "Engagement Party",
  "Corporate Retreat",
  "Other celebration",
];

const PROPERTIES = ["Nobu Los Cabos", "Nobu Malibu", "Nobu Miami Beach", "No preference yet"];

const field =
  "w-full rounded-lg border border-border-default bg-white px-3.5 py-2.5 text-[14px] text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-border-brand";
const labelCls = "text-[12px] font-semibold uppercase tracking-[0.6px] text-text-tertiary";

export default function NewClientSetup() {
  const navigate = useNavigate();
  const [host, setHost] = useState("");
  const [occasion, setOccasion] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [property, setProperty] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const ready = host.trim().length > 1 && occasion;

  const summary = useMemo(
    () =>
      [occasion || "Occasion", property || "Property TBD", date || "Date TBD", guests ? `${guests} guests` : "Guests TBD"]
        .filter(Boolean)
        .join(" · "),
    [occasion, property, date, guests],
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    setAgentToast(`${host.trim()} added — ${occasion} draft created.`);
    navigate(AGENT_HUB_HREF);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-surface-page font-sans">
      {/* Micro-strip + takeover header */}
      <div className="sticky top-0 z-40 flex flex-col bg-surface-inverse">
        <div className="flex h-5 items-center justify-center bg-surface-tinted">
          <p className="text-[10px] leading-4 tracking-[1px] text-text-primary">PARTNER PORTAL</p>
        </div>
        <div className="flex h-14 items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-2 text-white">
            <Sparkles size={16} strokeWidth={1.6} />
            <p className="text-[14px] font-medium tracking-[0.5px]">New Client Setup</p>
          </div>
          <button
            type="button"
            aria-label="Exit setup"
            onClick={() => navigate(AGENT_HUB_HREF)}
            className="flex size-9 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white"
          >
            <X size={22} strokeWidth={1.6} />
          </button>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1080px] flex-1 px-6 py-10 md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-text-tertiary">Add a celebration</p>
        <h1 className="mt-1 font-display text-[32px] leading-10 text-text-primary md:text-[38px]">
          Who are we planning for?
        </h1>
        <p className="mt-1.5 max-w-[520px] text-[14px] leading-6 text-text-secondary">
          Capture the basics and Allie will spin up a draft proposal, suggested spaces and a starter checklist.
        </p>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Form */}
          <div className="flex min-w-0 flex-1 flex-col gap-6 rounded-2xl border border-border-default bg-white p-6 md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className={labelCls}>Host / group name</span>
                <input
                  className={field}
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="e.g. The Okafor Family"
                  autoFocus
                />
              </label>

              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className={labelCls}>Occasion</span>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((o) => {
                    const active = occasion === o;
                    return (
                      <button
                        type="button"
                        key={o}
                        onClick={() => setOccasion(o)}
                        className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                          active
                            ? "bg-action-primary text-action-primary-text"
                            : "border border-border-default bg-white text-text-secondary hover:border-border-brand"
                        }`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Target date</span>
                <input className={field} value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. April 2027" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Guest count</span>
                <input
                  className={field}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value.replace(/[^\d]/g, ""))}
                  placeholder="e.g. 120"
                  inputMode="numeric"
                />
              </label>

              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className={labelCls}>Property preference</span>
                <div className="flex flex-wrap gap-2">
                  {PROPERTIES.map((p) => {
                    const active = property === p;
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setProperty(p)}
                        className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                          active
                            ? "bg-action-primary text-action-primary-text"
                            : "border border-border-default bg-white text-text-secondary hover:border-border-brand"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </label>

              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className={labelCls}>Host email</span>
                <input
                  className={field}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  type="email"
                />
              </label>

              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className={labelCls}>Notes for Allie</span>
                <textarea
                  className={`${field} resize-y`}
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Vibe, must-haves, dietary needs, who's flying in…"
                />
              </label>
            </div>
          </div>

          {/* Recap rail */}
          <div className="w-full lg:w-[340px] lg:shrink-0">
            <div className="flex flex-col gap-4 rounded-2xl border border-border-default bg-white p-6 lg:sticky lg:top-24">
              <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-text-tertiary">New client</p>
              <p className="font-display text-[24px] leading-7 text-text-primary">{host.trim() || "Untitled host"}</p>
              <p className="text-[13px] text-text-secondary">{summary}</p>

              <div className="flex flex-col gap-2.5 border-t border-border-muted pt-4">
                {[
                  "Draft proposal created",
                  "Suggested spaces queued",
                  "Starter checklist + room block",
                ].map((line) => (
                  <div key={line} className="flex items-center gap-2.5 text-[13px] text-text-secondary">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-brand text-[#7b4b94]">
                      <Check size={12} strokeWidth={2.4} />
                    </span>
                    {line}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={!ready}
                className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-action-primary px-5 py-3 text-[14px] font-medium text-action-primary-text transition-opacity disabled:opacity-40"
              >
                Create client
                <ArrowRight size={16} strokeWidth={1.8} />
              </button>
              <p className="text-center text-[11px] text-text-tertiary">You can refine everything after Allie drafts it.</p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
