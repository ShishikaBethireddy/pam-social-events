import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import nobuLogo from "@/assets/logo-nobu-white.png";

type ClosingCTAProps = {
  onPlan: () => void;
  onSpecialist?: () => void;
};

/**
 * Closing call-to-action — the editorial sign-off that anchors the
 * conversion. Mirrors pam-brides' "Ready when you are" footer band:
 * italic-serif headline, body copy, copper primary CTA plus a ghost
 * "Speak to an Event Specialist" secondary CTA on dark.
 */
export const ClosingCTA = ({ onPlan, onSpecialist }: ClosingCTAProps) => (
  <section className="py-24 md:py-32 bg-ink text-paper">
    <div className="container text-center max-w-3xl">
      <p className="eyebrow text-copper-soft">Ready when you are</p>
      <h2 className="font-title text-5xl md:text-6xl mt-6 leading-[1.05] tracking-tight">
        Let&rsquo;s plan something<br />
        <em className="italic text-copper-soft">unforgettable</em>.
      </h2>
      <p className="mt-6 font-sans text-paper/75 max-w-xl mx-auto leading-relaxed">
        Tell us about your celebration. About 4 minutes with Allie — refundable
        date hold at the end. No commitment until you say so.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
        <Button
          onClick={onPlan}
          variant="copper"
          size="lg"
          className="text-xs uppercase tracking-[0.2em] w-full sm:w-auto"
        >
          Start Planning My Event
          <ArrowRight className="h-4 w-4" />
        </Button>
        {onSpecialist ? (
          <button
            onClick={onSpecialist}
            className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-pill border border-paper/40 px-7 text-xs uppercase tracking-[0.22em] text-paper font-sans font-semibold hover:bg-paper/10 transition-colors"
          >
            Speak to an Event Specialist
          </button>
        ) : null}
      </div>
    </div>
  </section>
);

/**
 * Marketing footer — mirrors the pam-brides FlowFooter pattern with a
 * four-column lockup: brand block, plan sitemap, contact, and legal /
 * property address. All links scroll to anchor sections on the landing
 * or route into the planning flow.
 */
export const Footer = () => (
  <footer className="bg-ink text-paper border-t border-paper/10">
    <div className="container py-14 grid md:grid-cols-12 gap-10">
      <div className="md:col-span-4">
        <img
          src={nobuLogo}
          alt="Nobu Hotel Los Cabos"
          className="h-[34px] w-auto object-contain"
        />
        <p className="mt-6 font-sans text-sm text-paper/70 leading-relaxed max-w-sm">
          The Social Events Booking Concierge is the digital arm of the Nobu
          events team — designed to capture your brief, build your estimate,
          and hand off to a specialist who already knows your event inside and
          out.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-pill border border-paper/20 px-4 py-1.5 text-[10px] uppercase tracking-[0.32em] text-paper/80 font-sans">
          Prototype · for design review only
        </div>
      </div>

      <div className="md:col-span-2">
        <p className="text-paper font-sans font-semibold text-sm mb-4">Plan</p>
        <ul className="space-y-2.5 font-sans text-sm text-paper/70">
          <li><a href="#events" className="hover:text-copper-soft transition-colors">Celebrations</a></li>
          <li><a href="#venues" className="hover:text-copper-soft transition-colors">Venues</a></li>
          <li><a href="#stays" className="hover:text-copper-soft transition-colors">Stays</a></li>
          <li><a href="#dining" className="hover:text-copper-soft transition-colors">Dining</a></li>
          <li><a href="#faq" className="hover:text-copper-soft transition-colors">FAQ</a></li>
        </ul>
      </div>

      <div className="md:col-span-3">
        <p className="text-paper font-sans font-semibold text-sm mb-4">Connect</p>
        <ul className="space-y-3 font-sans text-sm text-paper/70">
          <li className="flex items-start gap-2.5">
            <Mail className="h-4 w-4 mt-0.5 text-copper-soft shrink-0" />
            <a href="mailto:events.loscabos@nobuhotels.com" className="hover:text-copper-soft transition-colors">
              events.loscabos@nobuhotels.com
            </a>
          </li>
          <li className="flex items-start gap-2.5">
            <Phone className="h-4 w-4 mt-0.5 text-copper-soft shrink-0" />
            <a href="tel:+18006628338" className="hover:text-copper-soft transition-colors">
              +1 (800) NOBU-EVT
            </a>
          </li>
          <li className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 mt-0.5 text-copper-soft shrink-0" />
            <span>
              Carretera Transpeninsular Km 5.5<br />
              Cabo San Lucas, B.C.S.
            </span>
          </li>
        </ul>
      </div>

      <div className="md:col-span-3">
        <p className="text-paper font-sans font-semibold text-sm mb-4">For partners</p>
        <ul className="space-y-2.5 font-sans text-sm text-paper/70">
          <li>
            <Link to="/travel-agent" className="hover:text-copper-soft transition-colors">Travel agent portal</Link>
          </li>
          <li>
            <Link to="/auth" className="hover:text-copper-soft transition-colors">Sign in</Link>
          </li>
          <li>
            <a
              href="https://www.nobuhotels.com/los-cabos/"
              className="hover:text-copper-soft transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              nobuhotels.com →
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-paper/10">
      <div className="container py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] tracking-[0.3em] uppercase text-paper/50 font-sans">
        <span>© {new Date().getFullYear()} Nobu Hospitality. All rights reserved.</span>
        <span>Powered by Allie · AI Event Concierge</span>
      </div>
    </div>
  </footer>
);
