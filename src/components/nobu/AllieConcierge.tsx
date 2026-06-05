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
  <section className="bg-white text-ink py-16 md:py-20">
    <div className="container">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-pill bg-copper">
            <Gem className="h-3 w-3 text-paper" />
          </span>
          <p className="text-[11px] uppercase font-semibold tracking-[0.28em] text-copper font-sans">
            Powered by Allie · AI Event Concierge
          </p>
        </div>

        <h2 className="mt-4 font-title text-3xl md:text-4xl leading-tight text-ink">
          The all-in-one planning suite for your next{" "}
          <em className="italic text-copper">private celebration</em> at Nobu.
        </h2>

        <p className="mt-3 max-w-2xl font-sans text-sm md:text-base text-ink/70 leading-relaxed">
          You know the feeling you want — not which space, weekend, or price tag.
          Allie shapes the brief with you and your party in about four minutes, then
          hands a fully-briefed specialist the keys.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {benefits.map(({ Icon, title, body }) => (
          <div
            key={title}
            className="flex items-start gap-3 rounded-lg border border-border-subtle bg-cream-soft p-4 transition-colors hover:border-copper/40"
          >
            <span
              className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-pill bg-copper/15 text-copper"
              style={{ border: "1px solid rgba(123,75,148,0.4)" }}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <h3 className="font-title italic text-lg leading-snug text-ink">{title}</h3>
              <p className="mt-0.5 font-sans text-[13px] text-ink/65 leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border-subtle flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
        <div className="flex-1">
          <p className="font-title italic text-lg leading-snug text-ink">Ready when you are.</p>
          <p className="mt-0.5 font-sans text-[13px] text-ink/65 leading-relaxed">
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
