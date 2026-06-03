import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Sparkles,
  Wallet,
  Gem,
  ConciergeBell,
  ArrowRight,
} from "lucide-react";

type AllieConciergeProps = {
  onPlan: () => void;
};

const benefits = [
  {
    Icon: Sparkles,
    title: "A celebration that fits",
    body: "Your guest count, vibe, and dates in. Nobu venues that fit and what is actually open.",
  },
  {
    Icon: Wallet,
    title: "Live estimate calculator",
    body: "Move guests, menu, or dates and your all-in number updates right away.",
  },
  {
    Icon: Calendar,
    title: "Refundable date hold",
    body: "Lock your shortlist with a fully-refundable deposit while we finalize details.",
  },
  {
    Icon: ConciergeBell,
    title: "Your specialist, already briefed",
    body: "When Nobu calls, they already know your celebration, headcount, and preferences.",
  },
  {
    Icon: Users,
    title: "Room blocks in one tap",
    body: "Travelling guests? Allie queues group rates and a curated welcome amenity per room.",
  },
  {
    Icon: Gem,
    title: "The Nobu kitchen, on the menu",
    body: "Black cod, omakase, signature cocktails — built into every proposal Allie ships.",
  },
];

/**
 * "Powered by Allie · AI Event Concierge" — dark ink band with copper
 * accents. Direct counterpart to pam-brides "All-in-one planning
 * suite". Anchors the page emotionally on the digital concierge
 * product and gives a third primary CTA above the fold.
 */
export const AllieConcierge = ({ onPlan }: AllieConciergeProps) => (
  <section className="bg-ink text-paper py-24 md:py-32">
    <div className="container">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-pill bg-copper">
            <Gem className="h-3 w-3 text-paper" />
          </span>
          <p className="text-[11px] uppercase font-semibold tracking-[0.28em] text-copper-soft font-sans">
            Powered by Allie · AI Event Concierge
          </p>
        </div>

        <h2 className="mt-5 font-title text-4xl md:text-5xl leading-tight">
          The all-in-one planning suite for your next<br />
          <em className="italic text-copper-soft">private celebration</em> at Nobu.
        </h2>

        <p className="mt-5 max-w-2xl font-sans text-base md:text-lg text-paper/75 leading-relaxed">
          You know the feeling you want — not which space, weekend, or price tag.
          Allie shapes the brief with you and your party in about four minutes, then
          hands a fully-briefed specialist the keys.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {benefits.map(({ Icon, title, body }) => (
          <div
            key={title}
            className="flex flex-col gap-4 rounded-lg border border-paper/10 bg-paper/[0.04] p-6 md:p-7 transition-colors hover:border-copper/40"
          >
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-pill bg-copper/15 text-copper-soft"
              style={{ border: "1px solid rgba(180,129,77,0.4)" }}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <h3 className="font-title italic text-[22px] leading-snug text-paper">{title}</h3>
            <p className="font-sans text-sm text-paper/70 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-paper/10 flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8">
        <div className="flex-1">
          <p className="font-title italic text-[22px] leading-snug">Ready when you are.</p>
          <p className="mt-1 font-sans text-sm text-paper/70 leading-relaxed">
            About 4 minutes. Refundable date hold at the end. No commitment.
          </p>
        </div>
        <Button
          onClick={onPlan}
          variant="copper"
          size="lg"
          className="text-xs uppercase tracking-[0.2em] w-full md:w-auto"
        >
          Start Planning My Event
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </section>
);
