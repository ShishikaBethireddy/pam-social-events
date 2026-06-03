import { Button } from "@/components/ui/button";
import { ArrowDown, Gem } from "lucide-react";
import heroImg from "@/assets/hero-celebration.jpg";

type HeroProps = {
  onPlan: () => void;
  onSpecialist?: () => void;
};

/**
 * Hero — full-bleed, editorial.
 *
 * Mirrors the pam-brides Social Events hero: photographic backdrop with
 * a layered ink wash, eyebrow → italic-serif title → light body copy →
 * dual CTA stack (copper primary, ghost-on-dark secondary).
 *
 * The primary CTA hands off to `/plan` (Allie concierge). The secondary
 * CTA opens the SpecialistSheet for guests who prefer a human first.
 */
export const Hero = ({ onPlan, onSpecialist }: HeroProps) => {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      <img
        src={heroImg}
        alt="Guests toasting at a candlelit Nobu terrace celebration at golden hour"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Layered ink washes — mirrors pam-brides heroGradient + side wash */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/40 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

      <div className="container relative z-10 pt-40 pb-28 text-paper">
        <div className="max-w-2xl">
          <p className="eyebrow text-copper-soft">Social Events &amp; Celebrations</p>

          <h1 className="font-title text-5xl md:text-7xl leading-[1.04] mt-7 tracking-tight">
            Celebrate life&rsquo;s most<br />
            <em className="italic text-copper-soft">memorable moments</em><br />
            at Nobu.
          </h1>

          <p className="mt-8 max-w-lg font-sans text-base md:text-lg text-paper/85 leading-relaxed">
            From milestone birthdays and engagement parties to anniversaries,
            showers, and private dinners — our event specialists curate every
            detail: signature cuisine, breathtaking venues, and the unmistakable
            Nobu lifestyle.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Button
              onClick={onPlan}
              variant="copper"
              size="lg"
              className="text-xs uppercase tracking-[0.2em] w-full sm:w-auto"
            >
              <Gem className="h-4 w-4" />
              Start Planning My Event
            </Button>

            {onSpecialist ? (
              <button
                onClick={onSpecialist}
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-pill border border-paper/45 px-7 text-xs uppercase tracking-[0.22em] text-paper font-sans font-semibold hover:bg-paper/10 transition-colors"
              >
                Speak to an Event Specialist
              </button>
            ) : null}
          </div>

          <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-paper/65 font-sans">
            About 4 minutes · refundable date hold · no commitment
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="container flex items-end justify-between text-paper/70 text-[11px] tracking-[0.3em] uppercase font-sans">
          <span className="inline-flex items-center gap-2">
            <ArrowDown className="h-3.5 w-3.5" /> Scroll to discover
          </span>
          <span className="hidden md:inline">Powered by Allie · AI Event Concierge</span>
        </div>
      </div>
    </section>
  );
};
