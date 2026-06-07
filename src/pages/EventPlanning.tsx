import { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Coffee,
  CreditCard,
  Download,
  GripVertical,
  LayoutDashboard,
  Lock,
  MapPin,
  Minus,
  Pencil,
  Phone,
  Plus,
  Search,
  Send,
  ShieldCheck,
  ShowerHead,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Star,
  Store,
  Trash2,
  Tv,
  UserRound,
  Users,
  Wallet,
  Wifi,
  X,
} from "lucide-react";
import { Nav } from "@/components/nobu/Nav";
import { MenuOverlay } from "@/components/nobu/MenuOverlay";
import { SpecialistSheet } from "@/components/nobu/SpecialistSheet";
import { auth, estimates, useAuth, type SavedEstimate } from "@/lib/auth";
import { resolveTheme as resolveEventTheme } from "@/pages/EventPortal";

/* ============================================================
   Event Planning — host-facing planning workspace
   ------------------------------------------------------------
   Direct Booking only. After a host completes the booking flow
   (submits the deposit on Worldpay or taps "Plan My Event"), they
   land here to organise the celebration. A left tracker rail with
   routed step panels on the right:
     Overview · Guest list · Room allocation · Vendors ·
     Itinerary · Payments
   Content is re-themed for private social events and seeded from
   the saved estimate the guest built with Allie.
   ============================================================ */

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/* ---------- Event theme (drives nouns + scale per event type) ---------- */

type PlanTheme = {
  titleSuffix: string;
  occasion: string;
  noun: { singular: string; plural: string };
  headcount: number;
  days: number;
};

const DEFAULT_THEME: PlanTheme = {
  titleSuffix: "celebration",
  occasion: "celebration",
  noun: { singular: "guest", plural: "guests" },
  headcount: 24,
  days: 2,
};

const THEMES: { match: RegExp; theme: PlanTheme }[] = [
  { match: /bachelorette/, theme: { titleSuffix: "bachelorette weekend", occasion: "weekend", noun: { singular: "guest", plural: "guests" }, headcount: 12, days: 3 } },
  { match: /bachelor/, theme: { titleSuffix: "bachelor weekend", occasion: "weekend", noun: { singular: "guest", plural: "guests" }, headcount: 12, days: 3 } },
  { match: /engagement/, theme: { titleSuffix: "engagement party", occasion: "celebration", noun: { singular: "guest", plural: "guests" }, headcount: 40, days: 1 } },
  { match: /baby|shower/, theme: { titleSuffix: "baby shower", occasion: "shower", noun: { singular: "guest", plural: "guests" }, headcount: 25, days: 1 } },
  { match: /anniversary/, theme: { titleSuffix: "anniversary", occasion: "celebration", noun: { singular: "guest", plural: "guests" }, headcount: 24, days: 1 } },
  { match: /family|reunion/, theme: { titleSuffix: "family reunion", occasion: "reunion", noun: { singular: "family member", plural: "family" }, headcount: 30, days: 3 } },
  { match: /holiday/, theme: { titleSuffix: "holiday gathering", occasion: "gathering", noun: { singular: "guest", plural: "guests" }, headcount: 22, days: 1 } },
  { match: /dinner/, theme: { titleSuffix: "private dinner", occasion: "dinner", noun: { singular: "guest", plural: "guests" }, headcount: 14, days: 1 } },
  { match: /birthday/, theme: { titleSuffix: "birthday", occasion: "celebration", noun: { singular: "guest", plural: "guests" }, headcount: 30, days: 1 } },
];

function resolveTheme(eventType?: string): PlanTheme {
  if (!eventType) return DEFAULT_THEME;
  const t = eventType.toLowerCase();
  return THEMES.find((x) => x.match.test(t))?.theme ?? DEFAULT_THEME;
}

/* ---------- Planning context (seeded from the saved estimate) ---------- */

type PlanContext = {
  id: string;
  hostName: string;
  firstName: string;
  email?: string;
  eventName: string;
  eventType?: string;
  theme: PlanTheme;
  dates: string;
  arrival: string;
  nights: number;
  venue: string;
  headcount: number;
  subtotal: number;
  deposit: number;
  paid: boolean;
  paidAt?: number;
};

function usePlanningContext(id: string | undefined): PlanContext {
  const user = useAuth();
  return useMemo(() => {
    const current = user ?? auth.current();
    const est = current && id ? estimates.get(current.email, id) : undefined;
    let booking: Record<string, string> = {};
    try {
      booking = JSON.parse(sessionStorage.getItem("nobu_booking") || "{}");
    } catch {
      booking = {};
    }

    const eventType = est?.eventType || booking.eventType;
    const theme = resolveTheme(eventType);
    const hostName = current?.name || booking.name || "Sofia Ramirez";
    const firstName = hostName.split(" ")[0] || "Sofia";
    const dates = est?.dates || booking.dates || "Dates to confirm";
    const venue = est?.venue || booking.venue || "Nobu Hotel Los Cabos";

    const guestsRaw = est?.guests || booking.guests || "";
    const parsed = guestsRaw.match(/\d+/);
    const headcount = parsed ? Math.max(2, parseInt(parsed[0], 10)) : theme.headcount;

    // Best-effort arrival date for the day-by-day itinerary grid.
    let arrivalDate = new Date();
    arrivalDate.setDate(arrivalDate.getDate() + 45);
    const tryParsed = dates ? new Date(dates) : null;
    if (tryParsed && !isNaN(tryParsed.getTime())) arrivalDate = tryParsed;

    const eventTypeLabel = eventType
      ? eventType.charAt(0).toUpperCase() + eventType.slice(1)
      : theme.titleSuffix;

    return {
      id: id ?? "new",
      hostName,
      firstName,
      email: current?.email,
      eventName: `${firstName}'s ${theme.titleSuffix}`,
      eventType,
      theme,
      dates: dates || eventTypeLabel,
      arrival: arrivalDate.toISOString().slice(0, 10),
      nights: theme.days,
      venue,
      headcount,
      subtotal: est?.subtotal ?? 12800,
      deposit: est?.deposit ?? 500,
      paid: !!est?.paidAt,
      paidAt: est?.paidAt,
    };
  }, [user, id]);
}

/* ---------- Sidebar step definitions ---------- */

type StepKey = "overview" | "guests" | "rooms" | "vendors" | "itinerary" | "payments";

const STEPS: {
  key: StepKey;
  label: string;
  blurb: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "done" | "active" | "todo";
}[] = [
  { key: "overview", label: "Overview", blurb: "Your celebration at a glance.", icon: LayoutDashboard, status: "active" },
  { key: "guests", label: "Guest list", blurb: "RSVPs, plus-ones, dietary & access needs.", icon: Users, status: "done" },
  { key: "rooms", label: "Room allocation", blurb: "Suites held for guests, arrivals & nights.", icon: BedDouble, status: "todo" },
  { key: "vendors", label: "Vendors", blurb: "Photography, florals, music & more.", icon: Store, status: "todo" },
  { key: "itinerary", label: "Itinerary", blurb: "Day-by-day run-of-show.", icon: CalendarDays, status: "todo" },
  { key: "payments", label: "Payments", blurb: "Estimate, milestones & balance.", icon: Wallet, status: "todo" },
];

/* ============================================================
   Shell
   ============================================================ */

export default function EventPlanning() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const ctx = usePlanningContext(id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [specialistOpen, setSpecialistOpen] = useState(false);

  // The Overview renders full-bleed (hero image + floating content), so it
  // skips the standard grey header + max-width container the other steps use.
  const isOverview = location.pathname === `/planning/${ctx.id}` || location.pathname.endsWith("/overview");

  const routes = (
    <Routes>
      <Route index element={<Navigate to="overview" replace />} />
      <Route path="overview" element={<OverviewView ctx={ctx} />} />
      <Route path="guests" element={<GuestsView ctx={ctx} />} />
      <Route path="rooms" element={<RoomsView ctx={ctx} />} />
      <Route path="vendors" element={<VendorsView ctx={ctx} />} />
      <Route path="itinerary" element={<ItineraryView ctx={ctx} />} />
      <Route path="payments" element={<PaymentsView ctx={ctx} />} />
      <Route path="*" element={<Navigate to="overview" replace />} />
    </Routes>
  );

  return (
    <div className="flex min-h-screen flex-col bg-grey-50 text-grey-900">
      <Nav
        variant="solid"
        onMenu={() => setMenuOpen(true)}
        onSpecialist={() => setSpecialistOpen(true)}
        onPlan={() => navigate("/chat")}
      />

      <div className="flex min-h-0 flex-1">
        {/* Left rail — planning tracker */}
        <aside className="hidden w-[340px] flex-none flex-col border-r border-grey-200 bg-white md:flex">
          <div className="flex flex-col justify-center border-b border-grey-200 bg-grey-50 px-7 py-5">
            <div className="text-[10px] uppercase tracking-[0.3em] text-grey-500">
              Planning · {ctx.theme.occasion}
            </div>
            <div className="mt-1 font-serif text-2xl text-grey-900">{ctx.eventName}</div>
            <div className="mt-1 text-xs text-grey-600">{ctx.venue}</div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
            <div className="space-y-1">
              {STEPS.map((s) => {
                const Icon = s.icon;
                const to = s.key === "overview" ? `/planning/${ctx.id}/overview` : `/planning/${ctx.id}/${s.key}`;
                return (
                  <NavLink
                    key={s.key}
                    to={to}
                    className={({ isActive }) =>
                      `block rounded-sm px-3 py-3 transition-colors ${
                        isActive ? "bg-brand-100" : "hover:bg-grey-50"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full ${
                            isActive
                              ? "bg-brand-500 text-white"
                              : "border border-grey-300 text-grey-500"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm text-grey-900">
                            <span className="font-medium">{s.label}</span>
                            <ChevronRight className={`h-3.5 w-3.5 ${isActive ? "text-brand-500" : "text-grey-400"}`} />
                          </div>
                          <div className="mt-1 text-xs leading-relaxed text-grey-600">{s.blurb}</div>
                        </div>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div className="border-t border-grey-200 px-7 py-4">
            <Link
              to="/account"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-grey-500 hover:text-grey-900"
            >
              <ArrowLeft className="h-3 w-3" /> Back to account
            </Link>
          </div>
        </aside>

        {/* Right pane */}
        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          {/* Mobile: tracker collapses to a top dropdown (left rail is lg+ only) */}
          <MobileStepNav ctx={ctx} />

          {isOverview ? (
            <div className="w-full">{routes}</div>
          ) : (
            <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-10 sm:py-10">
              <Link
                to="/account"
                className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-grey-600 hover:text-grey-900 md:hidden"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to account
              </Link>

              {/* Header */}
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-grey-500">
                    Your celebration · Nobu Los Cabos
                  </div>
                  <h1 className="mt-1 font-serif text-4xl text-grey-900">{ctx.eventName}</h1>
                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-grey-600">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> {ctx.dates}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Users className="h-4 w-4" /> {ctx.headcount} {ctx.theme.noun.plural}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {ctx.venue}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Wallet className="h-4 w-4" /> {currency(ctx.subtotal)} est.
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] ${
                    ctx.paid ? "bg-emerald-50 text-emerald-700" : "bg-brand-500/10 text-brand-500"
                  }`}
                >
                  {ctx.paid ? "Date secured" : "Hold pending"}
                </span>
              </div>

              <div className="mt-8">{routes}</div>
            </div>
          )}
        </main>
      </div>

      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onPlan={() => {
          setMenuOpen(false);
          navigate("/chat");
        }}
        onSpecialist={() => {
          setMenuOpen(false);
          setSpecialistOpen(true);
        }}
      />
      <SpecialistSheet
        open={specialistOpen}
        onClose={() => setSpecialistOpen(false)}
        onChat={() => {
          setSpecialistOpen(false);
          navigate("/chat");
        }}
      />
    </div>
  );
}

/* ============================================================
   Mobile step nav — left rail collapses into a top dropdown
   ------------------------------------------------------------
   Below `lg` the tracker aside is hidden; this renders a sticky
   header showing the current step plus a chevron that expands
   the full step list (matching the responsive reference).
   ============================================================ */

function MobileStepNav({ ctx }: { ctx: PlanContext }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const activeKey: StepKey =
    STEPS.find((s) =>
      s.key === "overview"
        ? location.pathname.endsWith("/overview") || location.pathname === `/planning/${ctx.id}`
        : location.pathname.endsWith(`/${s.key}`),
    )?.key ?? "overview";
  const active = STEPS.find((s) => s.key === activeKey) ?? STEPS[0];

  const go = (key: StepKey) => {
    navigate(`/planning/${ctx.id}/${key}`);
    setOpen(false);
  };

  return (
    <div className="sticky top-0 z-20 border-b border-grey-200 bg-white md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left"
        aria-expanded={open}
      >
        <div className="border-l-2 border-accent pl-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-grey-500">
            Social Event Portal
          </div>
          <div className="mt-1 font-serif text-2xl text-grey-900">{active.label}</div>
        </div>
        <ChevronDown className={`h-5 w-5 flex-none text-grey-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul className="border-t border-grey-200">
          {STEPS.map((s) => {
            const isActive = s.key === activeKey;
            return (
              <li key={s.key} className="border-b border-grey-100 last:border-0">
                <button
                  type="button"
                  onClick={() => go(s.key)}
                  className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors ${
                    isActive ? "border-l-2 border-accent bg-brand-100/50" : "border-l-2 border-transparent hover:bg-grey-50"
                  }`}
                >
                  <span className={`text-base ${isActive ? "font-medium text-grey-900" : "text-grey-700"}`}>
                    {s.label}
                  </span>
                  <ChevronRight className={`h-4 w-4 ${isActive ? "text-accent" : "text-grey-400"}`} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ============================================================
   Shared primitives
   ============================================================ */

function SectionHeader({
  kicker,
  title,
  blurb,
  action,
}: {
  kicker?: string;
  title: string;
  blurb: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border border-grey-200 bg-white p-6">
      <div>
        {kicker ? <div className="text-[10px] uppercase tracking-[0.3em] text-grey-500">{kicker}</div> : null}
        <h2 className="mt-1 font-serif text-2xl text-grey-900">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-grey-700">{blurb}</p>
      </div>
      {action}
    </div>
  );
}

/* ============================================================
   Step · Overview
   ============================================================ */

function OverviewView({ ctx }: { ctx: PlanContext }) {
  const user = useAuth();
  const [est, setEst] = useState<SavedEstimate | null>(null);

  useEffect(() => {
    const current = user ?? auth.current();
    if (current && ctx.id && ctx.id !== "new") {
      setEst(estimates.get(current.email, ctx.id) ?? null);
    }
  }, [user, ctx.id]);

  // The portal theme carries the per-event-type plan inclusions.
  const theme = useMemo(() => resolveEventTheme(est?.eventType ?? ctx.eventType), [est?.eventType, ctx.eventType]);

  const paid = ctx.paid || !!est?.paidAt;
  const deposit = est?.deposit ?? ctx.deposit;

  // Quick summary stats, derived from each step's seed state.
  const guestTotal = SEED_PARTIES.reduce((s, p) => s + p.partySize, 0);
  const guestAttending = SEED_PARTIES.filter((p) => p.rsvp === "yes").reduce((s, p) => s + p.partySize, 0);
  const guestPending = guestTotal - guestAttending;
  const seedRooms = 5;
  const seedRoom = roomById("garden-suite");
  const roomSleeps = seedRoom.sleeps * seedRooms;
  const itinDays = Math.max(1, ...SEED_ITINERARY.map((i) => i.day));

  const summary: {
    key: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    stat: string;
    sub: string;
  }[] = [
    { key: "guests", icon: Users, label: "Guest list", stat: `${guestTotal} guests`, sub: `${guestAttending} attending · ${guestPending} pending` },
    { key: "rooms", icon: BedDouble, label: "Room allocation", stat: `${seedRooms} rooms held`, sub: `${seedRoom.name} · sleeps ${roomSleeps}` },
    { key: "vendors", icon: Store, label: "Vendors", stat: `1 of ${VENDORS.length} booked`, sub: "Frame & Field" },
    { key: "itinerary", icon: CalendarDays, label: "Itinerary", stat: `${itinDays} days · ${SEED_ITINERARY.length} items`, sub: "Day-by-day run-of-show" },
    { key: "payments", icon: Wallet, label: "Payments", stat: paid ? `${currency(deposit)} deposit paid` : `${currency(deposit)} deposit due`, sub: est?.subtotal ? `Estimate ${currency(est.subtotal)}` : "Estimate & balance" },
  ];

  const eyebrow = `${ctx.eventType ?? ctx.theme.titleSuffix} · Event Portal`;
  const metaVenue = est?.fnb || ctx.venue;

  return (
    <div className="w-full">
      {/* Hero — booked space over the event photo, info floating on top */}
      <header className="relative h-[300px] w-full overflow-hidden sm:h-[360px]">
        <img src={theme.hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/55 to-white/5" />
        <Link
          to="/account"
          className="absolute left-6 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur md:hidden"
        >
          <ArrowLeft className="h-3 w-3" /> Account
        </Link>
        <div className="absolute inset-x-0 bottom-0 px-6 pb-7 sm:px-10 sm:pb-9">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
          <h1 className="mt-1 font-serif text-5xl leading-[1.02] text-foreground sm:text-6xl">{ctx.venue}</h1>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-foreground/80">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" /> {ctx.dates}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" /> {ctx.headcount} {ctx.theme.noun.plural}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" /> {metaVenue}
            </span>
          </div>
        </div>
      </header>

      {/* Floating content — no boxes, just type on the page */}
      <div className="mx-auto w-full max-w-5xl space-y-10 px-6 py-9 sm:px-10 sm:py-11">
        {/* Payment / hold confirmation */}
        {paid ? (
          <section className="flex items-start gap-4">
            <CheckCircle2 className="mt-0.5 h-7 w-7 flex-none text-accent" strokeWidth={1.6} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">Payment confirmed</p>
              <h2 className="mt-2 font-serif text-3xl text-foreground">Your date is locked in.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {currency(deposit)} deposit received{ctx.paidAt ? ` ${fmtDateTime(ctx.paidAt)}` : ""}.
                {ctx.email ? ` Receipt sent to ${ctx.email}.` : " A receipt is on its way."}
              </p>
            </div>
          </section>
        ) : (
          <section className="flex items-start gap-4">
            <Sparkles className="mt-0.5 h-6 w-6 flex-none text-accent" strokeWidth={1.6} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">Estimate ready</p>
              <h2 className="mt-2 font-serif text-3xl text-foreground">Hold your date with a {currency(deposit)} deposit.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Refundable up to 14 days before your {ctx.theme.occasion}.
              </p>
            </div>
          </section>
        )}

        {/* Core plan — what's included */}
        <section className="bg-texture-soft -mx-6 px-6 py-8 sm:-mx-10 sm:px-10 sm:py-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">Core plan</p>
          <h3 className="mt-1 font-serif text-2xl text-foreground">{theme.planTitle}</h3>
          <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {theme.plan.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-foreground/90">
                <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full border border-accent/40">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" strokeWidth={2.2} />
                </span>
                <span className="leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Planning summary — a quick look at every step */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">Planning summary</p>
          <h3 className="mt-1 font-serif text-2xl text-foreground">Where things stand</h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            A quick look at each part of {ctx.firstName}&rsquo;s {ctx.theme.occasion}. Jump into any step to make changes.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {summary.map((it) => {
              const Icon = it.icon;
              return (
                <Link
                  key={it.key}
                  to={`/planning/${ctx.id}/${it.key}`}
                  className="group flex items-center gap-4 border border-border bg-white p-5 transition-colors hover:border-accent/50"
                >
                  <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-brand-100 text-brand-500">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{it.label}</div>
                    <div className="mt-0.5 font-serif text-lg text-foreground">{it.stat}</div>
                    <div className="text-xs text-muted-foreground">{it.sub}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-none text-muted-foreground transition-colors group-hover:text-accent" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

const fmtDateTime = (ts: number) =>
  new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

/* ============================================================
   Step · Guest list
   ============================================================ */

type Rsvp = "yes" | "no" | "pending";

type Party = {
  id: string;
  name: string;
  email: string;
  partySize: number;
  inRoomBlock: boolean;
  invited: boolean;
  rsvp: Rsvp;
};

const SEED_PARTIES: Party[] = [
  { id: "g1", name: "Avery & Jordan Chen", email: "avery.chen@example.com", partySize: 2, inRoomBlock: true, invited: true, rsvp: "yes" },
  { id: "g2", name: "Marcus Hill", email: "marcus.hill@example.com", partySize: 1, inRoomBlock: false, invited: true, rsvp: "yes" },
  { id: "g3", name: "Priya Shah +1", email: "priya.shah@example.com", partySize: 2, inRoomBlock: true, invited: true, rsvp: "pending" },
  { id: "g4", name: "The Okafor family", email: "okafor@example.com", partySize: 4, inRoomBlock: true, invited: false, rsvp: "pending" },
];

const fmtShort = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

type PartyForm = { name: string; email: string; partySize: number; inRoomBlock: boolean };
const EMPTY_FORM: PartyForm = { name: "", email: "", partySize: 1, inRoomBlock: false };

function GuestsView({ ctx }: { ctx: PlanContext }) {
  const [parties, setParties] = useState<Party[]>(SEED_PARTIES);
  const [filter, setFilter] = useState<"all" | "yes" | "pending">("all");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PartyForm>(EMPTY_FORM);

  const arrival = new Date(ctx.arrival);
  const depart = new Date(arrival);
  depart.setDate(depart.getDate() + Math.max(1, ctx.nights));

  // Guest-weighted stats (denominators mirror the reference).
  const sum = (pred: (p: Party) => boolean) => parties.filter(pred).reduce((s, p) => s + p.partySize, 0);
  const totalGuests = sum(() => true);
  const invitedGuests = sum((p) => p.invited);
  const attendingGuests = sum((p) => p.rsvp === "yes");
  const pendingGuests = sum((p) => p.invited && p.rsvp === "pending");
  const notInvitedGuests = sum((p) => !p.invited);

  const filtered = parties.filter((p) => {
    const matchesFilter =
      filter === "all" ? true : filter === "yes" ? p.rsvp === "yes" : p.invited && p.rsvp === "pending";
    const matchesQuery =
      !query.trim() ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.email.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };
  const openEdit = (p: Party) => {
    setEditId(p.id);
    setForm({ name: p.name, email: p.email, partySize: p.partySize, inRoomBlock: p.inRoomBlock });
    setModalOpen(true);
  };
  const save = () => {
    if (!form.name.trim()) return;
    if (editId) {
      setParties((prev) => prev.map((p) => (p.id === editId ? { ...p, ...form } : p)));
    } else {
      setParties((prev) => [
        ...prev,
        { id: crypto.randomUUID(), ...form, invited: false, rsvp: "pending" },
      ]);
    }
    setModalOpen(false);
  };
  const remove = (id: string) => setParties((prev) => prev.filter((p) => p.id !== id));
  const sendInvite = (id: string) => setParties((prev) => prev.map((p) => (p.id === id ? { ...p, invited: true } : p)));
  const setRsvp = (id: string, rsvp: Rsvp) => setParties((prev) => prev.map((p) => (p.id === id ? { ...p, rsvp } : p)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-grey-500">Guest list</p>
          <h2 className="mt-1 font-serif text-3xl text-grey-900">Who's coming</h2>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-full bg-grey-900 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-white transition hover:bg-grey-700"
        >
          <Plus className="h-4 w-4" /> Add party
        </button>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 divide-x divide-grey-200 border border-grey-200 bg-white">
        {[
          { label: "Attending", num: attendingGuests, den: invitedGuests },
          { label: "Pending", num: pendingGuests, den: invitedGuests },
          { label: "Not invited", num: notInvitedGuests, den: totalGuests },
        ].map((t) => (
          <div key={t.label} className="px-4 py-6 text-center">
            <div className="font-serif text-4xl text-grey-900">
              {t.num} <span className="text-2xl text-grey-400">/ {t.den}</span>
            </div>
            <div className="mt-2 text-xs text-grey-500">{t.label}</div>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {([
            ["all", "All"],
            ["yes", "Attending"],
            ["pending", "Pending"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                filter === key ? "bg-grey-900 text-white" : "border border-grey-300 text-grey-600 hover:bg-grey-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-grey-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-56 max-w-full rounded-full border border-grey-300 bg-white py-2 pl-9 pr-3 text-sm text-grey-900 placeholder:text-grey-400 focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Party cards */}
      {filtered.length === 0 ? (
        <p className="border border-dashed border-grey-300 px-6 py-10 text-center text-sm text-grey-500">
          No guests in this view yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((p) => (
            <div key={p.id} className="border border-grey-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <span className="font-medium text-grey-900">{p.name}</span>
                <StatusTag party={p} />
              </div>
              <div className="mt-1 text-sm text-grey-500">{p.email}</div>

              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-grey-600">
                {p.inRoomBlock ? (
                  <span className="inline-flex items-center gap-1.5">
                    <BedDouble className="h-3.5 w-3.5 text-grey-400" />
                    Staying · {p.partySize} {p.partySize === 1 ? "guest" : "guests"} · {fmtShort(arrival)} → {fmtShort(depart)}
                  </span>
                ) : (
                  <span>{p.partySize} {p.partySize === 1 ? "guest" : "guests"}</span>
                )}
                {p.inRoomBlock && (
                  <span className="inline-block bg-brand-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-brand-700">
                    Room block pending
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-grey-100 pt-3">
                {p.invited ? (
                  <select
                    value={p.rsvp}
                    onChange={(e) => setRsvp(p.id, e.target.value as Rsvp)}
                    className="rounded-md border border-grey-200 bg-white px-2 py-1.5 text-xs text-grey-800 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="yes">Attending</option>
                    <option value="no">Declined</option>
                  </select>
                ) : (
                  <button
                    onClick={() => sendInvite(p.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-grey-900 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-white transition hover:bg-grey-700"
                  >
                    <Send className="h-3 w-3" /> Send invite
                  </button>
                )}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(p)}
                    className="grid h-8 w-8 place-items-center rounded-full text-grey-500 hover:bg-grey-100 hover:text-grey-900"
                    aria-label="Edit party"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="grid h-8 w-8 place-items-center rounded-full text-grey-500 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Remove party"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <PartyModal
          isEdit={!!editId}
          form={form}
          setForm={setForm}
          onClose={() => setModalOpen(false)}
          onSave={save}
        />
      )}
    </div>
  );
}

function StatusTag({ party }: { party: Party }) {
  const { invited, rsvp } = party;
  let label = "Not sent";
  let cls = "bg-rose-50 text-rose-600";
  if (rsvp === "yes") {
    label = "Attending";
    cls = "bg-emerald-50 text-emerald-700";
  } else if (rsvp === "no") {
    label = "Declined";
    cls = "bg-grey-100 text-grey-600";
  } else if (invited) {
    label = "Invited";
    cls = "bg-brand-100 text-brand-700";
  }
  return <span className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${cls}`}>{label}</span>;
}

function PartyModal({
  isEdit,
  form,
  setForm,
  onClose,
  onSave,
}: {
  isEdit: boolean;
  form: PartyForm;
  setForm: React.Dispatch<React.SetStateAction<PartyForm>>;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-grey-900/50" onClick={onClose} />
      <div className="relative z-10 flex max-h-[calc(100dvh-3rem)] w-full max-w-lg flex-col bg-white shadow-xl">
        <div className="flex flex-none items-start justify-between border-b border-grey-200 px-7 py-5">
          <h3 className="font-serif text-2xl text-grey-900">{isEdit ? "Edit party" : "Add party"}</h3>
          <button onClick={onClose} className="text-grey-400 hover:text-grey-900" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-7 py-6">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-500">Guest name</label>
            <div className="relative mt-1.5">
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Full name"
                className="w-full border border-grey-300 bg-white px-3 py-2.5 pr-10 text-sm text-grey-900 placeholder:text-grey-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-0.5 text-grey-400">
                <UserRound className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-500">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="name@example.com"
              className="mt-1.5 w-full border border-grey-300 bg-white px-3 py-2.5 text-sm text-grey-900 placeholder:text-grey-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex items-end justify-between gap-6">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-500">Party size</label>
              <input
                type="number"
                min={1}
                value={form.partySize}
                onChange={(e) => setForm((f) => ({ ...f, partySize: Math.max(1, +e.target.value || 1) }))}
                className="mt-1.5 w-28 border border-grey-300 bg-white px-3 py-2.5 text-sm text-grey-900 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <label className="flex items-center gap-2 pb-2.5 text-sm text-grey-800">
              <input
                type="checkbox"
                checked={form.inRoomBlock}
                onChange={(e) => setForm((f) => ({ ...f, inRoomBlock: e.target.checked }))}
                className="h-4 w-4 accent-[hsl(var(--brand-500))]"
              />
              Staying in room block
            </label>
          </div>
        </div>

        <div className="flex flex-none items-center justify-end gap-3 border-t border-grey-200 px-7 py-5">
          <button
            onClick={onClose}
            className="rounded-full border border-grey-300 px-5 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!form.name.trim()}
            className="rounded-full bg-grey-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-grey-700 disabled:opacity-40"
          >
            Save party
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Step · Room allocation
   ============================================================ */

type RoomType = {
  id: string;
  name: string;
  price: number;
  sqm: number;
  bed: string;
  sleeps: number;
  feature: string;
  desc: string;
  amenities: string[];
  image: string;
};

const ROOM_TYPES: RoomType[] = [
  {
    id: "deluxe-king",
    name: "Deluxe King",
    price: 420,
    sqm: 42,
    bed: "1 King",
    sleeps: 2,
    feature: "Skyline views",
    desc: "Our signature room with a king bed, sitting area, and skyline views.",
    amenities: ["WiFi", "Rainfall shower", "Espresso bar", "Climate control", '55" Smart TV'],
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: "garden-suite",
    name: "Garden Suite",
    price: 620,
    sqm: 68,
    bed: "1 King + sofa",
    sleeps: 2,
    feature: "Garden terrace",
    desc: "Spacious suite opening to a private garden terrace — perfect for VIPs.",
    amenities: ["WiFi", "Rainfall shower", "Espresso bar", "Private terrace", '55" Smart TV'],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: "double-queen",
    name: "Double Queen",
    price: 380,
    sqm: 46,
    bed: "2 Queens",
    sleeps: 4,
    feature: "Family friendly",
    desc: "Two queen beds — great for families and friends sharing a room.",
    amenities: ["WiFi", "Rainfall shower", "Mini bar", "Climate control", '55" Smart TV'],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: "ocean-suite",
    name: "Ocean Suite",
    price: 880,
    sqm: 92,
    bed: "1 King + daybed",
    sleeps: 3,
    feature: "Ocean views",
    desc: "Top-floor suite with floor-to-ceiling windows and panoramic ocean views.",
    amenities: ["WiFi", "Rainfall shower", "Espresso bar", "Climate control", "Ocean-view soaking tub"],
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=60",
  },
];

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  WiFi: Wifi,
  "Rainfall shower": ShowerHead,
  "Espresso bar": Coffee,
  "Climate control": Snowflake,
  '55" Smart TV': Tv,
};

type Allocation = { id: string; roomTypeId: string; rooms: number; nights: number };

const roomById = (id: string) => ROOM_TYPES.find((r) => r.id === id) ?? ROOM_TYPES[0];

function RoomsView({ ctx }: { ctx: PlanContext }) {
  const [allocations, setAllocations] = useState<Allocation[]>([
    { id: "al1", roomTypeId: "garden-suite", rooms: 5, nights: Math.max(2, ctx.nights) },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const subtotalOf = (a: Allocation) => roomById(a.roomTypeId).price * a.rooms * a.nights;
  const sleepsOf = (a: Allocation) => roomById(a.roomTypeId).sleeps * a.rooms;
  const totalRooms = allocations.reduce((s, a) => s + a.rooms, 0);
  const totalSleeps = allocations.reduce((s, a) => s + sleepsOf(a), 0);
  const estimated = allocations.reduce((s, a) => s + subtotalOf(a), 0);
  const capacity = ctx.headcount;
  const pct = capacity ? Math.min(100, Math.round((totalSleeps / capacity) * 100)) : 0;

  const editing = editId ? allocations.find((a) => a.id === editId) ?? null : null;

  const openAdd = () => {
    setEditId(null);
    setModalOpen(true);
  };
  const openEdit = (id: string) => {
    setEditId(id);
    setModalOpen(true);
  };
  const remove = (id: string) => setAllocations((prev) => prev.filter((a) => a.id !== id));
  const upsert = (data: { roomTypeId: string; rooms: number; nights: number }) => {
    if (editId) {
      setAllocations((prev) => prev.map((a) => (a.id === editId ? { ...a, ...data } : a)));
    } else {
      setAllocations((prev) => [...prev, { id: crypto.randomUUID(), ...data }]);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-grey-500">Room allocation</p>
          <h2 className="mt-1 font-serif text-3xl text-grey-900">Room allocations</h2>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-full bg-grey-900 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-white transition hover:bg-grey-700"
        >
          <Plus className="h-4 w-4" /> Add allocation
        </button>
      </div>

      {/* Summary */}
      <div className="border border-grey-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-grey-500">Allocated</p>
            <div className="mt-1 font-serif text-3xl text-grey-900">
              {totalRooms} {totalRooms === 1 ? "room" : "rooms"}{" "}
              <span className="text-lg text-grey-500">· sleeps {totalSleeps} of {capacity}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-grey-500">Estimated</p>
            <div className="mt-1 font-serif text-3xl text-grey-900">{currency(estimated)}</div>
          </div>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-grey-100">
          <div className="h-full bg-brand-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Allocation cards */}
      {allocations.length === 0 ? (
        <p className="border border-dashed border-grey-300 px-6 py-10 text-center text-sm text-grey-500">
          No rooms allocated yet — add your first allocation.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {allocations.map((a) => {
            const rt = roomById(a.roomTypeId);
            return (
              <div key={a.id} className="overflow-hidden border border-grey-200 bg-white">
                <div className="aspect-[16/10] w-full overflow-hidden bg-grey-100">
                  <img src={rt.image} alt={rt.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-xl text-grey-900">{rt.name}</h3>
                      <div className="mt-1 text-xs text-grey-500">
                        {rt.bed} · sleeps {rt.sleeps} · {rt.feature}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-xl text-grey-900">{currency(subtotalOf(a))}</div>
                      <div className="text-xs text-grey-500">{currency(rt.price)}/night</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-grey-100 pt-3">
                    <div className="flex flex-wrap gap-2">
                      {[`${a.rooms} rooms`, `${a.nights} nights`, `sleeps ${sleepsOf(a)}`].map((chip) => (
                        <span key={chip} className="rounded-full border border-grey-300 px-3 py-1 text-[11px] text-grey-600">
                          {chip}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(a.id)}
                        className="grid h-8 w-8 place-items-center rounded-full text-grey-500 hover:bg-grey-100 hover:text-grey-900"
                        aria-label="Edit allocation"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(a.id)}
                        className="grid h-8 w-8 place-items-center rounded-full text-grey-500 hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Remove allocation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <RoomAllocationModal
          editing={editing}
          onClose={() => setModalOpen(false)}
          onSave={upsert}
        />
      )}
    </div>
  );
}

function Stepper({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (v: number) => void }) {
  const set = (v: number) => onChange(Math.max(min, v));
  return (
    <div className="border border-grey-200 bg-white p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-500">{label}</div>
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => set(value - 1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-grey-300 text-grey-600 hover:bg-grey-50"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-serif text-3xl text-grey-900 tabular-nums">{value}</span>
          <span className="flex flex-col">
            <button onClick={() => set(value + 1)} className="text-grey-400 hover:text-grey-900" aria-label={`Increase ${label}`}>
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => set(value - 1)} className="text-grey-400 hover:text-grey-900" aria-label={`Decrease ${label}`}>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </span>
        </div>
        <button
          onClick={() => set(value + 1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-grey-300 text-grey-600 hover:bg-grey-50"
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function RoomAllocationModal({
  editing,
  onClose,
  onSave,
}: {
  editing: Allocation | null;
  onClose: () => void;
  onSave: (data: { roomTypeId: string; rooms: number; nights: number }) => void;
}) {
  const [roomTypeId, setRoomTypeId] = useState(editing?.roomTypeId ?? ROOM_TYPES[0].id);
  const [rooms, setRooms] = useState(editing?.rooms ?? 5);
  const [nights, setNights] = useState(editing?.nights ?? 2);
  const selected = roomById(roomTypeId);
  const subtotal = selected.price * rooms * nights;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-grey-900/50" onClick={onClose} />
      <div className="relative z-10 flex max-h-[calc(100dvh-3rem)] w-full max-w-3xl flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex flex-none items-start justify-between border-b border-grey-200 px-7 py-5">
          <div>
            <h3 className="font-serif text-2xl text-grey-900">{editing ? "Edit room allocation" : "Add room allocation"}</h3>
            <p className="mt-1 text-sm text-grey-600">Pick a room type, then choose how many rooms and nights you need.</p>
          </div>
          <button onClick={onClose} className="text-grey-400 hover:text-grey-900" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-7 py-6">
          {/* Room type grid */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-grey-500">Room type</div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {ROOM_TYPES.map((rt) => {
                const isSel = rt.id === roomTypeId;
                return (
                  <button
                    key={rt.id}
                    onClick={() => setRoomTypeId(rt.id)}
                    className={`overflow-hidden border text-left transition-colors ${
                      isSel ? "border-accent ring-1 ring-accent" : "border-grey-200 hover:border-grey-300"
                    }`}
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-grey-100">
                      <img src={rt.image} alt={rt.name} className="h-full w-full object-cover" loading="lazy" />
                      {isSel && (
                        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-grey-900/90 px-2.5 py-1 text-[10px] font-medium text-white">
                          <CheckCircle2 className="h-3 w-3" /> Selected
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-serif text-lg text-grey-900">{rt.name}</div>
                        <div className="text-right">
                          <div className="font-serif text-lg text-grey-900">{currency(rt.price)}</div>
                          <div className="text-[10px] text-grey-500">/ night</div>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-grey-500">{rt.sqm} sqm · {rt.bed} · sleeps {rt.sleeps}</div>
                      <p className="mt-2 text-xs leading-relaxed text-grey-600">{rt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* What's included */}
          <div className="border border-grey-200 bg-grey-50 p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-grey-500">What's included</div>
            <div className="mt-1 font-serif text-lg text-grey-900">{selected.name}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.amenities.map((am) => {
                const Icon = AMENITY_ICONS[am] ?? CheckCircle2;
                return (
                  <span key={am} className="inline-flex items-center gap-1.5 rounded-full border border-grey-300 bg-white px-3 py-1.5 text-xs text-grey-700">
                    <Icon className="h-3.5 w-3.5 text-grey-500" /> {am}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Steppers */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Stepper label="Rooms" value={rooms} min={1} onChange={setRooms} />
            <Stepper label="Nights" value={nights} min={1} onChange={setNights} />
          </div>

          {/* This allocation */}
          <div className="flex flex-wrap items-center justify-between gap-3 border border-grey-200 bg-white p-5">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-grey-500">This allocation</div>
              <div className="mt-1 text-sm text-grey-800">{rooms} × {selected.name} · {nights} {nights === 1 ? "night" : "nights"}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-grey-500">Subtotal</div>
              <div className="mt-1 font-serif text-2xl text-grey-900">{currency(subtotal)}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-none items-center justify-end gap-3 border-t border-grey-200 px-7 py-5">
          <button onClick={onClose} className="rounded-full border border-grey-300 px-5 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50">
            Cancel
          </button>
          <button
            onClick={() => onSave({ roomTypeId, rooms, nights })}
            className="rounded-full bg-grey-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-grey-700"
          >
            {editing ? "Save allocation" : "Add to block"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Step · Vendors
   ============================================================ */

type Vendor = { id: string; category: string; name: string; low: number; high: number; image: string };

const VENDORS: Vendor[] = [
  { id: "marigold", category: "Event organizer", name: "Marigold Events Co.", low: 4500, high: 18500, image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=240&q=60" },
  { id: "hudson", category: "Event organizer", name: "Hudson & Co Planners", low: 4500, high: 18500, image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=240&q=60" },
  { id: "studio-lumen", category: "Décor", name: "Studio Lumen", low: 3200, high: 16500, image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=240&q=60" },
  { id: "atelier-bloom", category: "Décor", name: "Atelier Bloom", low: 3200, high: 16500, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=240&q=60" },
  { id: "dj-kavi", category: "Entertainment", name: "DJ Kavi", low: 2400, high: 7500, image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?auto=format&fit=crop&w=240&q=60" },
  { id: "velvet-trio", category: "Entertainment", name: "The Velvet Trio", low: 2400, high: 7500, image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=240&q=60" },
  { id: "frame-field", category: "Photo & video", name: "Frame & Field", low: 3500, high: 12500, image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=240&q=60" },
  { id: "forty-acre", category: "Catering add-ons", name: "Forty Acre Kitchen", low: 1400, high: 4200, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=240&q=60" },
  { id: "highball", category: "Bar service", name: "Highball Hospitality", low: 2400, high: 7800, image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=240&q=60" },
];

const VENDOR_CATEGORIES = Array.from(new Set(VENDORS.map((v) => v.category)));

type VendorPackage = { tier: string; sub: string; desc: string; features: string[]; price: number };
type VendorDetail = {
  rating: number;
  reviews: number;
  recommended: boolean;
  tagline: string;
  packages: VendorPackage[];
};

const CATEGORY_PACKAGES: Record<
  string,
  { tier: string; sub: string; desc: string; features: string[] }[]
> = {
  "Event organizer": [
    { tier: "Essential", sub: "Day-of coordination", desc: "On-site lead coordinator from setup through send-off.", features: ["10 hrs day-of coverage", "Vendor timeline + run-sheet", "1 planning call", "On-site coordinator + assistant"] },
    { tier: "Signature", sub: "Partial planning", desc: "Hands-on support starting 90 days out.", features: ["Up to 6 planning calls", "Vendor sourcing for 3 categories", "Full design moodboard", "Day-of lead + 2 assistants"] },
    { tier: "Full Service", sub: "Full production", desc: "End-to-end design, logistics, and on-site command.", features: ["Unlimited planning calls", "Full vendor sourcing & management", "Custom design & production plan", "Lead planner + 4 on-site staff"] },
  ],
  "Décor": [
    { tier: "Essential", sub: "Accent styling", desc: "Statement florals and table styling for the key moments.", features: ["Ceremony or head-table florals", "Candles + table accents", "1 design consult", "Setup & strike"] },
    { tier: "Signature", sub: "Full room design", desc: "A cohesive look across the whole celebration.", features: ["Full floral program", "Linens, lounge + lighting", "Custom moodboard", "On-site styling team"] },
    { tier: "Full Service", sub: "Bespoke production", desc: "Custom builds and large-format installations.", features: ["Custom installations & builds", "Premium florals throughout", "Lighting & draping design", "Dedicated design lead"] },
  ],
  Entertainment: [
    { tier: "Essential", sub: "Reception set", desc: "Keep the energy up through the main reception hours.", features: ["4 hrs performance", "Pro sound system", "1 prep call", "MC announcements"] },
    { tier: "Signature", sub: "Full evening", desc: "Ceremony, cocktail, and dancing covered end-to-end.", features: ["6 hrs performance", "Ceremony + cocktail audio", "Custom playlist", "Lighting package"] },
    { tier: "Full Service", sub: "Headline production", desc: "An immersive show with full production support.", features: ["Extended live set", "Full stage & lighting rig", "Multiple performers", "Production manager"] },
  ],
  "Photo & video": [
    { tier: "Essential", sub: "Highlights", desc: "Coverage of the moments that matter most.", features: ["6 hrs coverage", "1 photographer", "Online gallery", "150+ edited images"] },
    { tier: "Signature", sub: "Full story", desc: "Photo and a short film of the full celebration.", features: ["10 hrs coverage", "Photo + video team", "Highlight film", "400+ edited images"] },
    { tier: "Full Service", sub: "Cinematic", desc: "Documentary-style photo and film production.", features: ["Full-day coverage", "Two-camera film crew", "Feature + teaser films", "Album + prints"] },
  ],
  "Catering add-ons": [
    { tier: "Essential", sub: "Late-night bites", desc: "A crowd-pleasing add-on to round out the night.", features: ["1 station for the evening", "Staffing included", "Disposables + setup", "Menu consult"] },
    { tier: "Signature", sub: "Grazing & stations", desc: "Multiple interactive stations and grazing tables.", features: ["3 chef stations", "Grazing table", "Dietary options", "On-site chefs"] },
    { tier: "Full Service", sub: "Custom culinary", desc: "A fully bespoke supplemental food program.", features: ["Custom menu design", "Premium ingredients", "Full service staff", "Tastings included"] },
  ],
  "Bar service": [
    { tier: "Essential", sub: "Beer & wine", desc: "Friendly, fully-staffed beer and wine service.", features: ["4 hrs service", "1 bartender", "Glassware + ice", "Standard bar setup"] },
    { tier: "Signature", sub: "Full bar", desc: "A full cocktail bar with signature serves.", features: ["6 hrs service", "2 bartenders", "2 signature cocktails", "Premium glassware"] },
    { tier: "Full Service", sub: "Craft program", desc: "A bespoke craft cocktail and hospitality experience.", features: ["Extended service", "Mobile bar build", "Custom cocktail menu", "Full bar team"] },
  ],
};

const DEFAULT_PACKAGES = CATEGORY_PACKAGES["Event organizer"];

const CATEGORY_TAGLINES: Record<string, string> = {
  "Event organizer": "Award-winning planners known for warm, detail-obsessed celebrations.",
  "Décor": "Floral and design studio crafting immersive, on-theme spaces.",
  Entertainment: "Crowd-reading performers who keep the dance floor full.",
  "Photo & video": "Storytellers capturing the candid, in-between moments.",
  "Catering add-ons": "Inventive culinary add-ons that surprise and delight.",
  "Bar service": "Polished hospitality and craft cocktails, beautifully served.",
};

function getVendorDetail(v: Vendor): VendorDetail {
  const tpl = CATEGORY_PACKAGES[v.category] ?? DEFAULT_PACKAGES;
  const mid = Math.round((v.low + v.high) / 2 / 100) * 100;
  const prices = [v.low, mid, v.high];
  const hash = v.name.length + v.id.length;
  return {
    rating: Math.round((4.6 + (hash % 4) * 0.1) * 10) / 10,
    reviews: 90 + (hash * 17) % 160,
    recommended: v.id === "marigold" || v.id === "frame-field",
    tagline: CATEGORY_TAGLINES[v.category] ?? "Trusted specialists for memorable celebrations.",
    packages: tpl.map((p, i) => ({ ...p, price: prices[i] ?? v.high })),
  };
}

function VendorsView({ ctx }: { ctx: PlanContext }) {
  void ctx;
  const [tab, setTab] = useState<"market" | "team">("market");
  const [showFilters, setShowFilters] = useState(false);
  const [cat, setCat] = useState<string>("All");
  const [added, setAdded] = useState<Set<string>>(new Set(["frame-field"]));
  const [detailVendor, setDetailVendor] = useState<Vendor | null>(null);
  const [packageVendor, setPackageVendor] = useState<Vendor | null>(null);

  const toggleAdd = (id: string) =>
    setAdded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const marketList = cat === "All" ? VENDORS : VENDORS.filter((v) => v.category === cat);
  const teamList = VENDORS.filter((v) => added.has(v.id));

  const VendorRow = ({ v }: { v: Vendor }) => {
    const isAdded = added.has(v.id);
    return (
      <div className="border border-grey-200 bg-white">
        <div className="flex items-start gap-4 p-4">
          <div className="h-20 w-20 flex-none overflow-hidden bg-grey-100">
            <img src={v.image} alt={v.name} className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-grey-500">{v.category}</div>
            <div className="mt-0.5 font-serif text-xl text-grey-900">{v.name}</div>
            <div className="mt-1 text-sm text-grey-600">
              {currency(v.low)}–{currency(v.high)} · choose your package
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-grey-100 px-4 py-3">
          <div className="flex items-center gap-5 text-xs font-medium text-grey-700">
            <button onClick={() => setDetailVendor(v)} className="hover:text-grey-900">Learn more</button>
            <button onClick={() => setPackageVendor(v)} className="hover:text-grey-900">View packages</button>
          </div>
          <button
            onClick={() => (isAdded ? toggleAdd(v.id) : setPackageVendor(v))}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              isAdded
                ? "border border-grey-300 text-grey-700 hover:bg-grey-50"
                : "bg-grey-900 text-white hover:bg-grey-700"
            }`}
          >
            {isAdded ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {isAdded ? "Added" : "Add"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Tabs + filters */}
      <div className="flex items-center justify-between border-b border-grey-200">
        <div className="flex gap-6">
          {([
            ["market", "Marketplace"],
            ["team", "Your team"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`-mb-px border-b-2 pb-3 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
                tab === key ? "border-grey-900 text-grey-900" : "border-transparent text-grey-500 hover:text-grey-800"
              }`}
            >
              {label}
              {key === "team" && teamList.length > 0 ? ` (${teamList.length})` : ""}
            </button>
          ))}
        </div>
        {tab === "market" && (
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`mb-2 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              showFilters ? "border-grey-900 bg-grey-900 text-white" : "border-grey-300 text-grey-700 hover:bg-grey-50"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </button>
        )}
      </div>

      {/* Category filter chips */}
      {tab === "market" && showFilters && (
        <div className="flex flex-wrap gap-2">
          {["All", ...VENDOR_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                cat === c ? "border-grey-900 bg-grey-900 text-white" : "border-grey-300 text-grey-600 hover:bg-grey-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {tab === "market" ? (
        <div className="space-y-4">
          {marketList.map((v) => (
            <VendorRow key={v.id} v={v} />
          ))}
        </div>
      ) : teamList.length === 0 ? (
        <p className="border border-dashed border-grey-300 px-6 py-10 text-center text-sm text-grey-500">
          No vendors added yet — add a few from the marketplace.
        </p>
      ) : (
        <div className="space-y-4">
          {teamList.map((v) => (
            <VendorRow key={v.id} v={v} />
          ))}
        </div>
      )}

      {detailVendor && (
        <VendorDetailModal
          vendor={detailVendor}
          onClose={() => setDetailVendor(null)}
          onViewPackages={() => {
            const v = detailVendor;
            setDetailVendor(null);
            setPackageVendor(v);
          }}
        />
      )}

      {packageVendor && (
        <VendorPackageModal
          vendor={packageVendor}
          added={added.has(packageVendor.id)}
          onClose={() => setPackageVendor(null)}
          onSelect={() => {
            if (!added.has(packageVendor.id)) toggleAdd(packageVendor.id);
            setPackageVendor(null);
            setTab("team");
          }}
        />
      )}
    </div>
  );
}

function VendorDetailModal({
  vendor,
  onClose,
  onViewPackages,
}: {
  vendor: Vendor;
  onClose: () => void;
  onViewPackages: () => void;
}) {
  const d = getVendorDetail(vendor);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-grey-900/50" onClick={onClose} />
      <div className="relative z-10 flex max-h-[calc(100dvh-3rem)] w-full max-w-2xl flex-col overflow-hidden bg-white shadow-xl">
        <div className="relative h-44 w-full flex-none overflow-hidden">
          <img src={vendor.image} alt={vendor.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-grey-900/80 via-grey-900/20 to-grey-900/10" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/85 text-grey-700 hover:bg-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">{vendor.category}</p>
            <h3 className="mt-1 font-serif text-3xl text-white">{vendor.name}</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-grey-700">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold text-grey-900">{d.rating}</span>
              <span className="text-grey-500">({d.reviews} reviews)</span>
            </span>
            <span className="text-grey-300">·</span>
            <span className="text-grey-700">{currency(vendor.low)}–{currency(vendor.high)}</span>
            {d.recommended && (
              <>
                <span className="text-grey-300">·</span>
                <span className="rounded-full bg-grey-100 px-3 py-1 text-xs font-medium text-grey-700">Recommended</span>
              </>
            )}
          </div>

          <p className="mt-4 text-grey-700">{d.tagline}</p>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-grey-500">Packages at a glance</p>
          <div className="mt-3 space-y-3">
            {d.packages.map((p) => (
              <div key={p.tier} className="flex items-center justify-between gap-4 border border-grey-200 px-4 py-3">
                <div className="min-w-0">
                  <div className="font-medium text-grey-900">{p.tier} · {p.sub}</div>
                  <div className="mt-0.5 text-sm text-grey-500">{p.desc}</div>
                </div>
                <div className="flex-none font-serif text-xl text-grey-900">{currency(p.price)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-none items-center justify-end gap-3 border-t border-grey-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-full border border-grey-300 px-5 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50"
          >
            Read reviews
          </button>
          <button
            onClick={onViewPackages}
            className="rounded-full bg-grey-900 px-5 py-2 text-sm font-medium text-white hover:bg-grey-700"
          >
            View packages
          </button>
        </div>
      </div>
    </div>
  );
}

function VendorPackageModal({
  vendor,
  added,
  onClose,
  onSelect,
}: {
  vendor: Vendor;
  added: boolean;
  onClose: () => void;
  onSelect: () => void;
}) {
  const d = getVendorDetail(vendor);
  const recommendedIdx = Math.min(1, d.packages.length - 1);
  const [chosen, setChosen] = useState<string>(d.packages[recommendedIdx]?.tier ?? d.packages[0].tier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-grey-900/50" onClick={onClose} />
      <div className="relative z-10 flex max-h-[calc(100dvh-3rem)] w-full max-w-2xl flex-col overflow-hidden bg-white shadow-xl">
        <div className="flex flex-none items-start justify-between px-6 pt-6 sm:px-8 sm:pt-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
              {vendor.category} · {vendor.name}
            </p>
            <h3 className="mt-2 font-serif text-3xl text-grey-900">Choose your package</h3>
          </div>
          <button onClick={onClose} className="text-grey-400 hover:text-grey-900" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6 sm:px-8">
          {d.packages.map((p) => {
            const active = chosen === p.tier;
            return (
              <button
                key={p.tier}
                type="button"
                onClick={() => setChosen(p.tier)}
                className={`block w-full border p-5 text-left transition-colors ${
                  active ? "border-grey-900 ring-1 ring-grey-900" : "border-grey-200 hover:border-grey-400"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">{p.tier}</p>
                    <div className="mt-1 font-serif text-2xl text-grey-900">{currency(p.price)}</div>
                    <p className="mt-1 text-sm text-grey-600">{p.desc}</p>
                  </div>
                  <span
                    className={`mt-1 grid h-6 w-6 flex-none place-items-center rounded-full border ${
                      active ? "border-grey-900 bg-grey-900" : "border-grey-300"
                    }`}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                </div>
                <ul className="mt-4 space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-grey-700">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="flex flex-none items-center justify-between gap-3 border-t border-grey-100 px-6 py-4 sm:px-8">
          <button
            onClick={onClose}
            className="text-sm font-medium text-grey-600 hover:text-grey-900"
          >
            Cancel
          </button>
          <button
            onClick={onSelect}
            className="inline-flex items-center gap-2 rounded-full bg-grey-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-grey-700"
          >
            {added ? <CheckCircle2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {added ? `${chosen} selected` : `Add ${chosen} to team`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Step · Itinerary (run-of-show)
   ============================================================ */

type ItinType = "session" | "social" | "meal" | "ceremony" | "activity" | "break" | "transfer";

type ItinItem = {
  id: string;
  day: number;
  start: string;
  end: string;
  title: string;
  type: ItinType;
  location: string;
  people?: number;
  notes?: string;
};

const TYPE_META: Record<ItinType, { label: string; bar: string; chip: string }> = {
  session: { label: "Session", bar: "bg-brand-300", chip: "bg-brand-100 text-brand-700" },
  social: { label: "Social", bar: "bg-brand-500", chip: "bg-brand-100 text-brand-700" },
  meal: { label: "Meal", bar: "bg-brand-700", chip: "bg-brand-100 text-brand-700" },
  ceremony: { label: "Ceremony", bar: "bg-brand-300", chip: "bg-brand-100 text-brand-700" },
  activity: { label: "Activity", bar: "bg-brand-500", chip: "bg-brand-100 text-brand-700" },
  break: { label: "Break", bar: "bg-brand-300", chip: "bg-brand-100 text-brand-700" },
  transfer: { label: "Transfer", bar: "bg-brand-700", chip: "bg-brand-100 text-brand-700" },
};

const ITIN_TYPES: ItinType[] = ["session", "social", "meal", "ceremony", "activity", "break", "transfer"];

const SEED_ITINERARY: ItinItem[] = [
  { id: "i1", day: 1, start: "18:00", end: "19:00", title: "Welcome cocktails", type: "social", location: "Garden terrace", people: 24 },
  { id: "i2", day: 1, start: "19:30", end: "21:00", title: "Dinner service", type: "meal", location: "Main ballroom", people: 24 },
  { id: "i3", day: 1, start: "21:00", end: "21:30", title: "Cake + toasts", type: "ceremony", location: "Main ballroom", people: 24 },
  { id: "i4", day: 2, start: "10:00", end: "12:00", title: "Farewell brunch", type: "meal", location: "Terrace", people: 24 },
];

type ItinForm = {
  title: string;
  type: ItinType;
  day: number;
  start: string;
  end: string;
  location: string;
  people: string;
  notes: string;
};

function ItineraryView({ ctx }: { ctx: PlanContext }) {
  void ctx;
  const [items, setItems] = useState<ItinItem[]>(SEED_ITINERARY);
  const [activeDay, setActiveDay] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [defaultDay, setDefaultDay] = useState(1);
  const [dragId, setDragId] = useState<string | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const maxDay = Math.max(1, ...items.map((i) => i.day));
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);
  const dayItems = items.filter((i) => i.day === activeDay);

  const editing = editId ? items.find((i) => i.id === editId) ?? null : null;

  const openAdd = (day: number) => {
    setEditId(null);
    setDefaultDay(day);
    setModalOpen(true);
  };
  const openEdit = (item: ItinItem) => {
    setEditId(item.id);
    setModalOpen(true);
  };
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const save = (data: Omit<ItinItem, "id">) => {
    if (editId) {
      setItems((prev) => prev.map((i) => (i.id === editId ? { ...i, ...data } : i)));
    } else {
      setItems((prev) => [...prev, { id: crypto.randomUUID(), ...data }]);
    }
    setActiveDay(data.day);
    setModalOpen(false);
  };

  const reorder = (fromId: string, toIndex: number) => {
    setItems((prev) => {
      const dayArr = prev.filter((i) => i.day === activeDay);
      const others = prev.filter((i) => i.day !== activeDay);
      const fromIdx = dayArr.findIndex((i) => i.id === fromId);
      if (fromIdx === -1) return prev;
      const [moved] = dayArr.splice(fromIdx, 1);
      let insert = toIndex;
      if (fromIdx < toIndex) insert -= 1;
      dayArr.splice(insert, 0, moved);
      return [...others, ...dayArr];
    });
    setDragId(null);
    setHoverIdx(null);
  };

  return (
    <div className="space-y-5">
      {/* Day tabs */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-grey-200">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`-mb-px whitespace-nowrap border-b-2 pb-3 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
              activeDay === d ? "border-grey-900 text-grey-900" : "border-transparent text-grey-500 hover:text-grey-800"
            }`}
          >
            Day {d}
          </button>
        ))}
      </div>

      {/* Day header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-grey-900">Day {activeDay}</h2>
        <div className="flex items-center gap-4">
          <span className="text-xs text-grey-500">{dayItems.length} {dayItems.length === 1 ? "item" : "items"}</span>
          <button
            onClick={() => openAdd(activeDay)}
            className="inline-flex items-center gap-1.5 rounded-full border border-grey-300 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-grey-800 hover:bg-grey-50"
          >
            <Plus className="h-3.5 w-3.5" /> Add item
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {dayItems.length === 0 ? (
          <p className="border border-dashed border-grey-300 px-6 py-10 text-center text-sm text-grey-500">
            Nothing scheduled for this day — add an item.
          </p>
        ) : (
          dayItems.map((it, i) => {
            const meta = TYPE_META[it.type];
            return (
              <div key={it.id}>
                {hoverIdx === i && dragId && <div className="my-1 h-0.5 rounded bg-grey-900" />}
                <div
                  draggable
                  onDragStart={() => setDragId(it.id)}
                  onDragEnd={() => {
                    setDragId(null);
                    setHoverIdx(null);
                  }}
                  onDragOver={(e) => {
                    if (!dragId) return;
                    e.preventDefault();
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    setHoverIdx(e.clientY < rect.top + rect.height / 2 ? i : i + 1);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (!dragId) return;
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    reorder(dragId, e.clientY < rect.top + rect.height / 2 ? i : i + 1);
                  }}
                  className={`group relative flex items-stretch border border-grey-200 bg-white transition-all hover:border-grey-400 ${
                    dragId === it.id ? "opacity-40" : ""
                  }`}
                >
                  <div className={`w-1.5 shrink-0 ${meta.bar}`} />
                  <span className="flex cursor-grab items-center px-2 text-grey-300 hover:text-grey-600 active:cursor-grabbing">
                    <GripVertical className="h-4 w-4" />
                  </span>
                  <div className="flex min-w-0 flex-1 items-center gap-4 py-4 pr-4">
                    <div className="w-28 shrink-0 text-sm tabular-nums">
                      <span className="font-medium text-grey-900">{fmtTime(it.start)}</span>{" "}
                      <span className="text-grey-500">to {fmtTime(it.end)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium text-grey-900">{it.title}</h4>
                        <span className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] ${meta.chip}`}>{meta.label}</span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-grey-500">
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {it.location}</span>
                        {it.people != null && <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {it.people}</span>}
                      </div>
                      {it.notes && <p className="mt-1.5 text-xs leading-relaxed text-grey-600">{it.notes}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(it)}
                        className="grid h-8 w-8 place-items-center rounded-full text-grey-500 hover:bg-grey-100 hover:text-grey-900"
                        aria-label="Edit item"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(it.id)}
                        className="grid h-8 w-8 place-items-center rounded-full text-grey-500 hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Delete item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {hoverIdx === dayItems.length && dragId && dayItems.length > 0 && <div className="my-1 h-0.5 rounded bg-grey-900" />}
      </div>

      {/* Add a new day */}
      <button
        onClick={() => openAdd(maxDay + 1)}
        className="flex w-full items-center justify-center gap-2 border border-dashed border-grey-300 py-5 text-sm font-medium text-grey-600 transition-colors hover:border-grey-400 hover:bg-grey-50"
      >
        <Plus className="h-4 w-4" /> Add a new day
      </button>

      {modalOpen && (
        <ItineraryModal
          editing={editing}
          defaultDay={defaultDay}
          onClose={() => setModalOpen(false)}
          onSave={save}
        />
      )}
    </div>
  );
}

function ItineraryModal({
  editing,
  defaultDay,
  onClose,
  onSave,
}: {
  editing: ItinItem | null;
  defaultDay: number;
  onClose: () => void;
  onSave: (data: Omit<ItinItem, "id">) => void;
}) {
  const [form, setForm] = useState<ItinForm>({
    title: editing?.title ?? "",
    type: editing?.type ?? "session",
    day: editing?.day ?? defaultDay,
    start: editing?.start ?? "09:00",
    end: editing?.end ?? "10:00",
    location: editing?.location ?? "",
    people: editing?.people != null ? String(editing.people) : "",
    notes: editing?.notes ?? "",
  });

  const set = <K extends keyof ItinForm>(k: K, v: ItinForm[K]) => setForm((f) => ({ ...f, [k]: v }));
  const fieldCls =
    "w-full border border-grey-300 bg-white px-3 py-2.5 text-sm text-grey-900 placeholder:text-grey-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  const labelCls = "text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-500";

  const submit = () => {
    if (!form.title.trim()) return;
    onSave({
      title: form.title.trim(),
      type: form.type,
      day: Math.max(1, form.day),
      start: form.start,
      end: form.end,
      location: form.location.trim(),
      people: form.people.trim() ? Math.max(0, +form.people) : undefined,
      notes: form.notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-grey-900/50" onClick={onClose} />
      <div className="relative z-10 flex max-h-[calc(100dvh-3rem)] w-full max-w-xl flex-col bg-white shadow-xl">
        <div className="flex flex-none items-start justify-between border-b border-grey-200 px-7 py-5">
          <div>
            <h3 className="font-serif text-2xl text-grey-900">{editing ? "Edit itinerary item" : "Add itinerary item"}</h3>
            <p className="mt-1 text-sm text-grey-600">Set the time, type, location, and any notes for this item.</p>
          </div>
          <button onClick={onClose} className="text-grey-400 hover:text-grey-900" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-7 py-6">
          <div>
            <label className={labelCls}>Title</label>
            <input
              autoFocus
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Welcome reception"
              className={`mt-1.5 ${fieldCls}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value as ItinType)} className={`mt-1.5 ${fieldCls}`}>
                {ITIN_TYPES.map((t) => (
                  <option key={t} value={t}>{TYPE_META[t].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Day</label>
              <input
                type="number"
                min={1}
                value={form.day}
                onChange={(e) => set("day", Math.max(1, +e.target.value || 1))}
                className={`mt-1.5 ${fieldCls}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Start time</label>
              <input type="time" value={form.start} onChange={(e) => set("start", e.target.value)} className={`mt-1.5 ${fieldCls}`} />
            </div>
            <div>
              <label className={labelCls}>End time</label>
              <input type="time" value={form.end} onChange={(e) => set("end", e.target.value)} className={`mt-1.5 ${fieldCls}`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Location</label>
              <input
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Garden terrace"
                className={`mt-1.5 ${fieldCls}`}
              />
            </div>
            <div>
              <label className={labelCls}>People</label>
              <input
                type="number"
                min={0}
                value={form.people}
                onChange={(e) => set("people", e.target.value)}
                placeholder="optional"
                className={`mt-1.5 ${fieldCls}`}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Anything the team should know"
              rows={3}
              className={`mt-1.5 resize-y ${fieldCls}`}
            />
          </div>
        </div>

        <div className="flex flex-none items-center justify-end gap-3 border-t border-grey-200 px-7 py-5">
          <button onClick={onClose} className="rounded-full border border-grey-300 px-5 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!form.title.trim()}
            className="rounded-full bg-grey-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-grey-700 disabled:opacity-40"
          >
            {editing ? "Save changes" : "Add to itinerary"}
          </button>
        </div>
      </div>
    </div>
  );
}

function fmtTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hr = ((h + 11) % 12) + 1;
  return `${hr}:${String(m).padStart(2, "0")} ${period}`;
}

/* ============================================================
   Step · Payments
   ============================================================ */

function PaymentsView({ ctx }: { ctx: PlanContext }) {
  const user = useAuth();
  const navigate = useNavigate();
  const [est, setEst] = useState<SavedEstimate | null>(null);

  useEffect(() => {
    const current = user ?? auth.current();
    if (current && ctx.id && ctx.id !== "new") {
      const saved = estimates.get(current.email, ctx.id) ?? null;
      setEst(saved);
    }
  }, [user, ctx.id]);

  const theme = useMemo(() => resolveEventTheme(est?.eventType ?? ctx.eventType), [est?.eventType, ctx.eventType]);

  const core = ctx.subtotal;
  const addOnTotal = useMemo(
    () => (est?.addOns ?? []).reduce((sum, id) => sum + (theme.addons.find((a) => a.id === id)?.price ?? 0), 0),
    [est?.addOns, theme.addons],
  );
  const paid = ctx.paid || !!est?.paidAt;
  const deposit = est?.deposit ?? ctx.deposit;
  const depositPaid = paid ? deposit : 0;
  const remaining = Math.max(0, core + addOnTotal - depositPaid);
  const cardLast4 = est?.cardLast4 ?? "••••";
  const paymentRef = est?.paymentRef ?? "—";
  const paidAtTs = ctx.paidAt ?? est?.paidAt;

  return (
    <div className="space-y-8">
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-grey-500">PAYMENT & TERMS</p>
        <h2 className="mt-1 font-serif text-2xl text-grey-900">Your receipt</h2>

        <ul className="mt-5">
          <li className="flex items-center justify-between border-b border-grey-100 py-3">
            <span className="text-grey-800">Core estimate</span>
            <span className="font-medium text-grey-900">{currency(core)}</span>
          </li>
          <li className="flex items-center justify-between border-b border-grey-100 py-3">
            <span className="text-grey-800">Add-ons</span>
            <span className="font-medium text-grey-900">{currency(addOnTotal)}</span>
          </li>
          <li className="flex items-center justify-between border-b border-grey-100 py-3">
            <span className="text-grey-800">Deposit paid</span>
            <span className="font-medium text-grey-900">{currency(depositPaid)}</span>
          </li>
          <li className="flex items-center justify-between border-b border-grey-100 py-3">
            <span className="font-medium text-grey-900">Remaining balance</span>
            <span className="font-serif text-lg text-grey-900">{currency(remaining)}</span>
          </li>
        </ul>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/worldpay")}
            className="inline-flex items-center gap-2 rounded-full bg-grey-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-grey-700"
          >
            <CreditCard className="h-4 w-4" /> Make payment now
          </button>
          <a
            href="tel:+15555550199"
            className="inline-flex items-center gap-2 rounded-full border border-grey-300 px-5 py-2.5 text-sm font-medium text-grey-700 hover:bg-grey-50"
          >
            <Phone className="h-4 w-4" /> Call concierge
          </a>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-grey-500">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> PCI-DSS secured
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" /> 256-bit TLS
          </span>
        </div>

        <ul className="mt-5 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-grey-600">
          <li>The {currency(deposit)} deposit secures your event date for 72 hours pending final contract.</li>
          <li>Refundable up to 14 days prior; applied to your final invoice at settlement.</li>
          <li>Final guest count confirmed 7 days before the event.</li>
        </ul>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-grey-500">PAYMENT HISTORY</p>
            <h2 className="mt-1 font-serif text-2xl text-grey-900">Previous payments</h2>
          </div>
          {paid ? (
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-grey-300 px-4 py-2 text-xs font-medium text-grey-700 hover:bg-grey-50"
            >
              <Download className="h-3.5 w-3.5" /> Download receipt
            </button>
          ) : null}
        </div>

        {paid ? (
          <div className="mt-5 border border-grey-200 bg-grey-50 p-6">
            <div className="flex items-center justify-between">
              <span className="font-medium text-grey-900">Deposit payment</span>
              <span className="font-serif text-xl text-grey-900">{currency(deposit)}</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-500">Method</div>
                <div className="mt-1 text-sm text-grey-900">Card ending in {cardLast4}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-500">Confirmation</div>
                <div className="mt-1 text-sm text-grey-900">{paymentRef}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-500">Paid on</div>
                <div className="mt-1 text-sm text-grey-900">{paidAtTs ? fmtDateTime(paidAtTs) : "—"}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-grey-500">Processor</div>
                <div className="mt-1 text-sm text-grey-900">Worldpay from FIS</div>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-5 border border-dashed border-grey-300 px-6 py-10 text-center text-sm text-grey-500">
            No payments yet.
          </p>
        )}
      </section>
    </div>
  );
}
