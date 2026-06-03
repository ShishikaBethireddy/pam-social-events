import { Menu, User as UserIcon, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import nobuLogo from "@/assets/logo-nobu-white.png";

type NavProps = {
  onPlan?: () => void;
  onSpecialist?: () => void;
  onMenu?: () => void;
  variant?: "overlay" | "solid";
};

/**
 * Marketing header for the Social Events landing.
 *
 *  ┌────────── sunset ribbon (SOCIAL EVENTS · NOBU HOTELS) ─┐
 *  ├──── ink brand bar ─────────────────────────────────────┤
 *  │   [Nobu Hotel Los Cabos logo]      ✆  ☰  account    │
 *  └────────────────────────────────────────────────────────┘
 *
 * Mirrors the pam-brides Social Events marketing header — sunset
 * ribbon stripe identifying the property program, the official
 * white Nobu wordmark on the left (at `/assets/logo-nobu-white.png`),
 * and contact + menu controls on the right. `variant="solid"` is
 * used inside the chat flow so the bar doesn't try to float over
 * content.
 */
export const Nav = ({ onPlan, onSpecialist, onMenu, variant = "overlay" }: NavProps) => {
  const user = useAuth();
  const positionClasses =
    variant === "overlay"
      ? "absolute top-0 left-0 right-0 z-30 bg-ink"
      : "relative z-30 bg-ink border-b border-border-subtle";

  return (
    <header className={positionClasses}>
      {/* Sunset ribbon — Cabo dusk gradient identifying the program */}
      <div className="w-full bg-sunset-gradient text-paper text-center text-[11px] tracking-[0.4em] py-1.5 font-sans font-semibold uppercase">
        Social Events · Nobu Hotels
      </div>

      <div className="container flex items-center justify-between py-5 md:py-6">
        <Link
          to="/"
          className="flex h-[38px] shrink-0 items-center"
          aria-label="Nobu Hotel Los Cabos"
        >
          <img
            src={nobuLogo}
            alt="Nobu Hotel Los Cabos"
            className="h-[28px] md:h-[32px] w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          {onSpecialist ? (
            <button
              onClick={onSpecialist}
              className="hidden sm:inline-flex h-9 items-center gap-2 rounded-pill border border-paper/40 px-4 text-[11px] uppercase tracking-[0.22em] text-paper font-sans hover:bg-paper/10 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={1.6} />
              Speak to an Event Specialist
            </button>
          ) : null}

          <Link
            to={user ? "/account" : "/auth"}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-2 text-paper text-sm font-sans hover:text-copper-soft transition-colors"
            aria-label={user ? "Account" : "Sign in"}
          >
            <UserIcon className="h-5 w-5" strokeWidth={1.5} />
            <span>{user ? "Account" : "Sign in"}</span>
          </Link>

          <button
            onClick={onMenu}
            className="flex h-10 w-10 items-center justify-center text-paper hover:text-copper-soft transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-7 w-7" strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </header>
  );
};
