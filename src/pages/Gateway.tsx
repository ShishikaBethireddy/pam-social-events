import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import nobuLogo from "@/assets/logo-nobu-white.png";
import heroBg from "@/assets/hero-celebration.jpg";

/**
 * Gateway — the very first page of the Social Events experience. A dark
 * portal-style entry that asks how the visitor would like to book before
 * handing off to the right flow:
 *   • Direct Booking  → `/direct` (the guest-facing marketing prototype)
 *   • Travel Agent    → `/travel-agent` (the advisor RFP portal)
 */

type BookingRoute = {
  Icon: LucideIcon;
  label: string;
  title: string;
  desc: string;
  cta: string;
  to: string;
};

const ROUTES: BookingRoute[] = [
  {
    Icon: Sparkles,
    label: "For guests & hosts",
    title: "Direct Booking",
    desc: "Plan your celebration directly with Nobu's events concierge — choose your venue, dining, and stays, and get a tailored proposal in minutes.",
    cta: "Start planning your event",
    to: "/direct",
  },
  {
    Icon: Briefcase,
    label: "For travel advisors & partners",
    title: "Travel Agent Booking",
    desc: "Plan and manage client celebrations on their behalf — build proposals, track every booking, and coordinate directly with the Nobu events team.",
    cta: "Go to the agent portal",
    to: "/travel-agent",
  },
];

const Gateway = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-ink text-paper">
      {/* Sunset ribbon — identical to the guest + portal headers */}
      <div className="w-full bg-sunset-gradient py-1.5 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.4em] text-paper">
        Social Events · Nobu Hotels
      </div>

      {/* ── Top bar ── */}
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <img
              src={nobuLogo}
              alt="Nobu Hotels"
              className="h-7 w-auto object-contain"
            />
            <span className="hidden h-5 w-px bg-paper/20 sm:block" />
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-paper">
                Social Events
              </span>
              <span className="font-sans text-[9px] uppercase tracking-[0.24em] text-paper/45">
                by Nobu Hotels
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt=""
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/85 to-ink" />
        </div>

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-2 rounded-pill border border-paper/20 bg-white/5 px-4 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-paper/80 backdrop-blur">
            <Sparkles className="h-3 w-3 text-copper-soft" strokeWidth={1.8} />
            Social Events Booking
          </span>
          <h1 className="mt-7 font-title text-5xl leading-[1.05] text-paper md:text-7xl">
            Celebrations,{" "}
            <span className="italic text-copper-soft">refined.</span>
          </h1>
          <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-paper/70 md:text-lg">
            The booking workspace for Nobu Hotels social events — milestone
            birthdays, anniversaries, engagements, showers, and private
            celebrations.
          </p>
        </div>
      </section>

      {/* ── Booking routes ── */}
      <section className="relative pb-24 pt-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            {ROUTES.map(({ Icon, label, title, desc, cta, to }) => (
              <button
                key={title}
                type="button"
                onClick={() => navigate(to)}
                className="group relative flex flex-col gap-5 rounded-xl bg-white/[0.04] p-7 text-left transition-all hover:-translate-y-1 hover:bg-white/[0.07] md:p-9"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white/[0.06] text-paper">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 text-paper/35 transition-colors group-hover:text-paper"
                    strokeWidth={1.6}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/45">
                    {label}
                  </p>
                  <h2 className="font-title text-2xl text-paper md:text-[28px]">
                    {title}
                  </h2>
                  <p className="font-sans text-sm leading-6 text-paper/65">
                    {desc}
                  </p>
                </div>

                <span className="mt-1 inline-flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-copper-soft transition-colors group-hover:text-paper">
                  {cta}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gateway;
