import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import nobuLogo from "@/assets/logo-nobu-white.png";

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
  onPlan: () => void;
  onSpecialist: () => void;
};

const sections = [
  { label: "Celebrations", href: "#events" },
  { label: "Venues", href: "#venues" },
  { label: "Stays", href: "#stays" },
  { label: "Dining", href: "#dining" },
  { label: "Frequently asked", href: "#faq" },
];

/**
 * Full-screen menu overlay — matches the pam-brides marketing menu
 * pattern (cream background, big serif-on-canvas section links, sticky
 * CTA at the bottom). Used by the marketing Nav on both mobile and
 * desktop.
 */
export const MenuOverlay = ({ open, onClose, onPlan, onSpecialist }: MenuOverlayProps) => {
  const user = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex flex-col bg-canvas text-ink animate-in fade-in"
    >
      {/* Copper ribbon + brand bar */}
      <div className="w-full bg-sunset-gradient text-paper text-center text-[11px] tracking-[0.4em] py-1.5 font-sans font-semibold uppercase">
        Social Events · Nobu Hotels
      </div>
      <div className="bg-ink">
        <div className="container flex items-center justify-between py-5">
          <Link
            to="/"
            onClick={onClose}
            className="flex h-[32px] items-center"
            aria-label="Nobu Hotel Los Cabos"
          >
            <img
              src={nobuLogo}
              alt="Nobu Hotel Los Cabos"
              className="h-[26px] md:h-[30px] w-auto object-contain"
            />
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center text-paper hover:text-copper-soft transition-colors"
          >
            <X className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Menu body */}
      <div className="flex-1 overflow-y-auto">
        <div className="container py-12 md:py-16 grid lg:grid-cols-12 gap-10">
          <nav className="lg:col-span-7">
            <p className="eyebrow">Explore the experience</p>
            <ul className="mt-6 divide-y divide-border-subtle">
              {sections.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    onClick={onClose}
                    className="group flex items-center justify-between py-5 md:py-6"
                  >
                    <span className="font-title text-3xl md:text-5xl leading-tight tracking-tight">{s.label}</span>
                    <ArrowRight className="h-5 w-5 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-copper" />
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/travel-agent"
                  onClick={onClose}
                  className="group flex items-center justify-between py-5 md:py-6"
                >
                  <span className="font-title text-3xl md:text-5xl leading-tight tracking-tight">For travel agents</span>
                  <ArrowRight className="h-5 w-5 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-copper" />
                </Link>
              </li>
              <li>
                <Link
                  to={user ? "/account" : "/auth"}
                  onClick={onClose}
                  className="group flex items-center justify-between py-5 md:py-6"
                >
                  <span className="font-title text-3xl md:text-5xl leading-tight tracking-tight">
                    {user ? "Your account" : "Sign in"}
                  </span>
                  <ArrowRight className="h-5 w-5 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-copper" />
                </Link>
              </li>
            </ul>
          </nav>

          <aside className="lg:col-span-5 flex flex-col gap-6 lg:pl-8 lg:border-l lg:border-border-subtle">
            <div className="rounded-lg border border-border-subtle bg-paper p-7 shadow-rcd-sm">
              <p className="eyebrow">Ready to start</p>
              <h3 className="mt-3 font-title text-3xl text-ink leading-tight">
                Shape your celebration with Allie.
              </h3>
              <p className="mt-3 font-sans text-sm text-ink-soft leading-relaxed">
                About 4 minutes. Refundable date hold at the end. No commitment.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onPlan();
                }}
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-pill bg-copper px-6 text-xs uppercase tracking-[0.22em] text-paper font-sans font-semibold hover:bg-copper-hover transition-colors"
              >
                Start Planning My Event
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-lg border border-dashed border-border-default bg-cream-soft p-7">
              <p className="eyebrow">Prefer to speak with us</p>
              <h3 className="mt-3 font-title text-2xl text-ink leading-tight">
                Connect with an event specialist.
              </h3>
              <p className="mt-3 font-sans text-sm text-ink-soft leading-relaxed">
                Chat, schedule a call, or reach the events line — we&rsquo;ll route
                you to a specialist who knows your property.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onSpecialist();
                }}
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-pill border border-ink px-6 text-xs uppercase tracking-[0.22em] text-ink font-sans font-semibold hover:bg-cream transition-colors"
              >
                See ways to connect
              </button>
            </div>
          </aside>
        </div>
      </div>

      <div className="bg-ink text-paper">
        <div className="container py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] uppercase tracking-[0.3em] font-sans">
          <span>Nobu Hotel · Los Cabos</span>
          <span className="opacity-70">© {new Date().getFullYear()} Nobu Hospitality · Prototype</span>
        </div>
      </div>
    </div>
  );
};
