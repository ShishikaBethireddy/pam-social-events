import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUp, Menu, Plus, Sparkles, User as UserIcon, X } from "lucide-react";
import nobuLogo from "@/assets/logo-nobu-white.png";
import {
  ADD_CLIENT_HREF,
  AGENT_HUB_HREF,
  ASK_ALLIE_HREF,
  CLIENTS_HREF,
  REQUESTS_HREF,
} from "@/lib/agentNav";

const ALLIE_PLACEHOLDER =
  "What are we looking for?\n( Tell me the dates, guest count, and the feeling — I'll find your client's match. )";

export type PortalNavItem = "Dashboard" | "Clients" | "Check Availability" | "Requests";

type NavConfig = { label: PortalNavItem; href: string; badge?: string };

const NAV: NavConfig[] = [
  { label: "Dashboard", href: AGENT_HUB_HREF },
  { label: "Clients", href: CLIENTS_HREF },
  { label: "Requests", href: REQUESTS_HREF, badge: "3" },
];

const MOBILE_MENU: { label: string; href?: string; allie?: boolean; activeWhen?: PortalNavItem }[] = [
  { label: "Dashboard", href: AGENT_HUB_HREF, activeWhen: "Dashboard" },
  { label: "Clients", href: CLIENTS_HREF, activeWhen: "Clients" },
  { label: "Requests", href: REQUESTS_HREF, activeWhen: "Requests" },
  { label: "Add New Client", href: ADD_CLIENT_HREF },
  { label: "Ask Allie", allie: true, activeWhen: "Check Availability" },
  { label: "Sign out", href: "/" },
];

/**
 * Partner Portal top navigation.
 *
 * Mirrors the guest-facing marketing header exactly — the Cabo sunset ribbon
 * (SOCIAL EVENTS · NOBU HOTELS) above the ink brand bar with the white Nobu
 * wordmark — so the advisor and guest experiences feel like one product. The
 * agent sections (Dashboard / Clients / Requests / Add New Client / Ask Allie)
 * live as tabs and controls inside that same bar.
 */
export default function PortalTopNav({ active }: { active?: PortalNavItem }) {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [allieOpen, setAllieOpen] = useState(false);
  const [allieQuery, setAllieQuery] = useState("");

  function submitAllie() {
    const q = allieQuery.trim();
    if (!q) return;
    setAllieOpen(false);
    setAllieQuery("");
    navigate(`${ASK_ALLIE_HREF}?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-ink">
        {/* Sunset ribbon — identical to the guest marketing header */}
        <div className="w-full bg-sunset-gradient py-1.5 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.4em] text-paper">
          Social Events · Nobu Hotels
        </div>

        <div className="container flex items-center justify-between gap-6 py-4">
          {/* Left — logo + desktop tabs */}
          <div className="flex min-w-0 items-center gap-8">
            <Link to={AGENT_HUB_HREF} className="flex h-[34px] shrink-0 items-center" aria-label="Nobu Hotel Los Cabos">
              <img src={nobuLogo} alt="Nobu Hotel Los Cabos" className="h-[26px] w-auto object-contain md:h-[30px]" />
            </Link>

            <nav className="hidden items-center gap-7 lg:flex">
              {NAV.map((item) => {
                const isActive = item.label === active;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative inline-flex items-center gap-2 font-sans text-sm transition-colors ${
                      isActive ? "text-paper" : "text-paper/55 hover:text-paper"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span className="flex size-[18px] items-center justify-center rounded-full bg-copper-soft text-[11px] font-medium leading-none text-ink">
                        {item.badge}
                      </span>
                    ) : null}
                    {isActive ? (
                      <span className="absolute -bottom-[18px] left-0 right-0 h-0.5 rounded-full bg-copper-soft" />
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right — Add client + Ask Allie + account + menu */}
          <div className="flex items-center gap-1 md:gap-2">
            <Link
              to={ADD_CLIENT_HREF}
              className="hidden items-center gap-1.5 px-2.5 py-2 font-sans text-sm text-paper/80 transition-colors hover:text-copper-soft lg:flex"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              Add Client
            </Link>

            <button
              type="button"
              aria-expanded={allieOpen}
              onClick={() => setAllieOpen((o) => !o)}
              className={`hidden h-9 items-center gap-2 rounded-pill border px-4 font-sans text-[11px] uppercase tracking-[0.22em] transition-colors sm:inline-flex ${
                allieOpen || active === "Check Availability"
                  ? "border-copper-soft bg-paper/10 text-paper"
                  : "border-paper/40 text-paper hover:bg-paper/10"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.6} />
              Ask Allie
            </button>

            <Link
              to="/account"
              className="hidden items-center gap-1.5 px-2.5 py-2 font-sans text-sm text-paper transition-colors hover:text-copper-soft md:flex"
              aria-label="Account"
            >
              <UserIcon className="h-5 w-5" strokeWidth={1.5} />
              <span>Sofia</span>
            </Link>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-paper transition-colors hover:text-copper-soft lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-7 w-7" strokeWidth={1.25} />
            </button>
          </div>
        </div>

        {/* ── Ask Allie dropdown ── */}
        {allieOpen ? (
          <div className="absolute inset-x-0 top-full z-50 animate-[bubble-in_0.18s_ease-out] border-b border-border-default bg-white shadow-[0_16px_32px_rgba(0,0,0,0.1)]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitAllie();
              }}
              className="mx-auto w-full max-w-[1024px] px-6 py-5 md:px-10"
            >
              <div className="flex items-center gap-2 rounded-2xl border border-border-default bg-white px-3 py-3 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full text-text-primary">
                  <Plus size={26} strokeWidth={1.2} />
                </span>
                <textarea
                  value={allieQuery}
                  onChange={(e) => setAllieQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submitAllie();
                    }
                  }}
                  rows={2}
                  autoFocus
                  placeholder={ALLIE_PLACEHOLDER}
                  className="min-w-0 flex-1 resize-none bg-transparent py-1 font-sans text-base leading-6 text-text-primary outline-none placeholder:text-text-tertiary"
                />
                <button
                  type="submit"
                  aria-label="Ask Allie"
                  disabled={!allieQuery.trim()}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-action-primary text-action-primary-text transition-opacity disabled:opacity-40"
                >
                  <ArrowUp size={20} strokeWidth={1.6} />
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </header>

      {/* Click-away backdrop for Ask Allie */}
      {allieOpen ? (
        <button
          type="button"
          aria-label="Close Ask Allie"
          onClick={() => setAllieOpen(false)}
          className="fixed inset-0 z-30 cursor-default"
        />
      ) : null}

      {/* ── Mobile drawer ── */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-full flex-col bg-ink">
            <div className="w-full bg-sunset-gradient py-1.5 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.4em] text-paper">
              Social Events · Nobu Hotels
            </div>
            <div className="container flex items-center justify-between py-4">
              <Link to={AGENT_HUB_HREF} onClick={() => setDrawerOpen(false)} className="flex h-[30px] items-center">
                <img src={nobuLogo} alt="Nobu Hotel Los Cabos" className="h-[26px] w-auto object-contain" />
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="flex h-10 w-10 items-center justify-center text-paper"
              >
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="container flex min-h-0 flex-1 flex-col overflow-y-auto pt-6">
              {MOBILE_MENU.map((item) => {
                const isActive = item.activeWhen != null && item.activeWhen === active;
                const cls = `flex items-center justify-between border-b border-paper/15 py-3 text-left font-display text-[26px] leading-9 ${
                  isActive ? "text-copper-soft" : "text-paper"
                }`;
                if (item.allie) {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setDrawerOpen(false);
                        setAllieOpen(true);
                      }}
                      className={cls}
                    >
                      <span>{item.label}</span>
                    </button>
                  );
                }
                return item.href ? (
                  <Link key={item.label} to={item.href} onClick={() => setDrawerOpen(false)} className={cls}>
                    <span>{item.label}</span>
                  </Link>
                ) : null;
              })}
            </nav>
            <div className="container pb-9 pt-4">
              <Link
                to="/account"
                onClick={() => setDrawerOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-pill border border-paper/40 py-3.5 font-sans text-[12px] uppercase tracking-[0.22em] text-paper transition-colors hover:bg-paper/10"
              >
                <UserIcon className="h-4 w-4" strokeWidth={1.5} />
                Sofia · Account
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
