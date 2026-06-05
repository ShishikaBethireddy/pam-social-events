import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowUp, Plus, Sparkles } from "lucide-react";
import PortalTopNav from "@/components/agent/PortalTopNav";

import venueBallroom from "@/assets/venue-ballroom.jpg";
import venuePoolside from "@/assets/venue-poolside.jpg";
import venuePrivateDining from "@/assets/venue-private-dining.jpg";

type Phase = "input" | "matching" | "results";

const PLACEHOLDER =
  "What are we looking for?\n( Tell me the dates, guest count, and the feeling — I'll find your client's match. )";

type Match = {
  id: string;
  name: string;
  property: string;
  image: string;
  fit: string;
  capacity: string;
  rate: string;
  why: string;
};

const MATCHES: Match[] = [
  {
    id: "stone-garden",
    name: "Stone Garden",
    property: "Nobu Los Cabos",
    image: venuePrivateDining,
    fit: "98% match",
    capacity: "Up to 180 seated",
    rate: "From $3,500 · 4hr",
    why: "West-facing for sunset toasts, intimate hardscape, easy F&B flow for a long table.",
  },
  {
    id: "pool-garden",
    name: "Pool Garden",
    property: "Nobu Los Cabos",
    image: venuePoolside,
    fit: "94% match",
    capacity: "Up to 220 standing",
    rate: "From $4,200 · 5hr",
    why: "Best for day-into-night celebrations with a dance floor and cabana lounge.",
  },
  {
    id: "grand-ballroom",
    name: "The Ballroom",
    property: "Nobu Los Cabos",
    image: venueBallroom,
    fit: "89% match",
    capacity: "Up to 300 seated",
    rate: "From $6,800 · 6hr",
    why: "Climate-controlled backup with full AV — ideal for larger reunions and galas.",
  },
];

function MatchingLoader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-surface-page px-6">
      <span className="flex size-16 items-center justify-center rounded-full bg-surface-feature">
        <Sparkles size={26} className="animate-pulse text-white" strokeWidth={1.6} />
      </span>
      <div className="h-1 w-56 overflow-hidden rounded-full bg-surface-subtle">
        <div className="h-full w-1/3 rounded-full bg-action-primary animate-[loader-shimmer_1.8s_ease-in-out_infinite]" />
      </div>
      <p className="font-display text-[22px] text-text-primary">Finding the right spaces…</p>
      <p className="-mt-3 text-[13px] text-text-tertiary">Allie is matching availability, capacity and vibe.</p>
    </div>
  );
}

function MatchCard({
  m,
  onHold,
  onSend,
}: {
  m: Match;
  onHold: () => void;
  onSend: () => void;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[14px] border border-[#e7e2f0] bg-white sm:flex-row">
      <div className="relative h-44 shrink-0 sm:h-auto sm:w-56">
        <img src={m.image} alt={m.name} className="absolute inset-0 h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.6px] text-[#7b4b94]">
          {m.fit}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.8px] text-[#969199]">{m.property}</p>
            <h3 className="font-display text-[22px] leading-7 text-[#1a1721]">{m.name}</h3>
          </div>
          <p className="shrink-0 font-display text-[14px] text-[#1a1721]">{m.rate}</p>
        </div>
        <p className="text-[12px] font-medium text-[#585563]">{m.capacity}</p>
        <p className="text-[13px] leading-5 text-[#585563]">{m.why}</p>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onSend}
            className="rounded-full bg-action-primary px-4 py-2 text-[13px] font-medium text-action-primary-text"
          >
            Send to client
          </button>
          <button
            type="button"
            onClick={onHold}
            className="rounded-full border border-[#e7e2f0] px-4 py-2 text-[13px] font-medium text-[#1a1721] transition-colors hover:bg-surface-subtle"
          >
            Place hold
          </button>
        </div>
      </div>
    </article>
  );
}

export default function CheckAvailability() {
  const [searchParams] = useSearchParams();
  const [phase, setPhase] = useState<Phase>("input");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const ranInitial = useRef(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (ranInitial.current) return;
    ranInitial.current = true;
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      setPhase("matching");
    }
  }, [searchParams]);

  function submit() {
    if (!query.trim()) return;
    setPhase("matching");
  }

  function reset() {
    setPhase("input");
    setQuery("");
  }

  return (
    <div className="min-h-dvh bg-surface-page">
      {phase === "matching" ? (
        <div className="fixed inset-0 z-[60]">
          <MatchingLoader onDone={() => setPhase("results")} />
        </div>
      ) : null}

      {toast ? (
        <div
          className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full px-5 py-3 font-sans text-sm font-medium text-white shadow-lg"
          style={{ background: "rgba(0,0,0,0.92)" }}
        >
          {toast}
        </div>
      ) : null}

      <div className="flex min-h-dvh flex-col">
        <PortalTopNav active="Check Availability" />

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="relative flex flex-1 flex-col px-6 pb-12 md:px-10">
            {phase !== "results" ? (
              <div className="flex w-full items-stretch border-b border-[#e7e2f0] pt-4 md:pt-9">
                <div className="flex items-center gap-1.5 border-b-2 border-[#7b4b94] px-3 pb-3 pt-2.5 md:px-[18px]">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-feature">
                    <Sparkles size={16} className="text-white" strokeWidth={1.6} />
                  </span>
                  <span className="font-sans text-base font-medium leading-6 text-[#1a1721]">Ask Allie</span>
                </div>
                <button
                  type="button"
                  className="flex items-center px-3 pb-3 pt-2.5 font-sans text-base font-medium leading-6 text-[#969199] md:px-[18px]"
                >
                  Filter search
                </button>
              </div>
            ) : null}

            {phase === "results" ? (
              <div className="flex w-full flex-col items-center py-8">
                <div className="w-full max-w-[960px]">
                  <button
                    type="button"
                    onClick={reset}
                    className="mb-6 flex items-center gap-1.5 font-sans text-sm font-medium text-text-brand transition-opacity hover:opacity-80"
                  >
                    <ArrowLeft size={16} strokeWidth={2.2} />
                    New search
                  </button>
                  <div className="mb-5">
                    <h1 className="font-display text-[28px] leading-9 text-[#1a1721]">3 spaces match your brief</h1>
                    <p className="mt-1 text-[13px] text-[#969199]">
                      Ranked by availability, capacity and vibe. Place a hold or send straight to your client.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    {MATCHES.map((m) => (
                      <MatchCard
                        key={m.id}
                        m={m}
                        onHold={() => setToast(`Holding ${m.name} — saved as a new request.`)}
                        onSend={() => setToast(`Sent ${m.name} to your client.`)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center px-0 py-10 md:px-6 md:py-16">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                  className="w-full max-w-[850px] md:px-4"
                >
                  <div className="flex items-center gap-2 rounded-2xl border border-border-default bg-white px-3 py-3 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
                    <button
                      type="button"
                      aria-label="Add attachment"
                      className="flex size-11 shrink-0 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-surface-subtle"
                    >
                      <Plus size={26} strokeWidth={1.2} />
                    </button>
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          submit();
                        }
                      }}
                      rows={2}
                      placeholder={PLACEHOLDER}
                      className="min-w-0 flex-1 resize-none bg-transparent py-1 font-sans text-base leading-6 text-text-primary outline-none placeholder:text-text-tertiary"
                    />
                    <button
                      type="submit"
                      aria-label="Search availability"
                      disabled={!query.trim()}
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-action-primary text-action-primary-text transition-opacity disabled:opacity-40"
                    >
                      <ArrowUp size={20} strokeWidth={1.6} />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
