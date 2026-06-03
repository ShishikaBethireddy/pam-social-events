import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Cake,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Flower2,
  Gem,
  Heart,
  MessageCircle,
  PartyPopper,
  Receipt,
  Sparkles,
  TreePine,
  UtensilsCrossed,
  Users,
  Wine,
} from "lucide-react";
import { Nav } from "@/components/nobu/Nav";
import { Footer } from "@/components/nobu/ClosingCTA";
import { MenuOverlay } from "@/components/nobu/MenuOverlay";
import { SpecialistSheet } from "@/components/nobu/SpecialistSheet";
import heroPoster from "@/assets/hero-celebration.jpg";
import storyEngagement from "@/assets/event-engagement.jpg";
import storyBirthday from "@/assets/event-birthday.jpg";
import storyShower from "@/assets/event-shower.jpg";
import rightNowBg from "@/assets/venue-rooftop.jpg";

// ── Pre-chat Plan landing — direct counterpart to pam-brides /plan ──
// Editorial hero with looping video, staggered headline, and a
// glass card that primes the chatbot with the kind of social
// gathering you're hosting and roughly when. Hitting "Plan my event"
// stores the selections in sessionStorage and routes to `/chat`.

const EVENT_TYPES = [
  "Family Reunion",
  "Holiday Gathering",
  "Milestone Birthday",
  "Birthday Weekend",
  "Anniversary",
  "Engagement",
  "Bachelor Party",
  "Bachelorette Party",
  "Baby Shower",
  "Private Dinner",
  "Custom Event",
] as const;
type EventType = (typeof EVENT_TYPES)[number];

const SEASONS = ["Spring", "Summer", "Fall", "Winter"] as const;
const YEARS = ["2026", "2027", "2028"] as const;
type Season = (typeof SEASONS)[number];
type Year = (typeof YEARS)[number];

// ── Event-types carousel — every friends-and-family gathering Nobu
// hosts, surfaced as a swipeable strip of icons just below the hero
// so visitors can browse breadth before they commit.
const EVENT_CAROUSEL_ITEMS = [
  { name: "Family Reunions", Icon: Users },
  { name: "Holiday Gatherings", Icon: TreePine },
  { name: "Milestone Birthdays", Icon: Cake },
  { name: "Birthday Weekends", Icon: PartyPopper },
  { name: "Anniversaries", Icon: Heart },
  { name: "Engagement Parties", Icon: Gem },
  { name: "Bachelor Parties", Icon: Wine },
  { name: "Bachelorette Parties", Icon: Sparkles },
  { name: "Baby Showers", Icon: Flower2 },
  { name: "Private Dinners", Icon: UtensilsCrossed },
] as const;

function EventTypesCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateAffordances = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    updateAffordances();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateAffordances, { passive: true });
    window.addEventListener("resize", updateAffordances);
    return () => {
      el.removeEventListener("scroll", updateAffordances);
      window.removeEventListener("resize", updateAffordances);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  };

  return (
    <section className="bg-cream-soft py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-8 flex flex-col items-start gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="eyebrow">Every occasion</p>
            <h2 className="font-title text-3xl leading-tight text-ink md:text-4xl">
              <span>Events</span> <span className="italic">we host here.</span>
            </h2>
            <p className="mt-1 max-w-md font-sans text-sm leading-5 text-ink-soft">
              From intimate dinners to full-resort takeovers — a glimpse of
              what gathers under the Nobu roof.
            </p>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              disabled={!canLeft}
              className="flex h-10 w-10 items-center justify-center rounded-pill border border-border-default bg-paper text-ink transition-colors hover:border-copper hover:bg-cream hover:text-copper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-default disabled:hover:bg-paper disabled:hover:text-ink"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              disabled={!canRight}
              className="flex h-10 w-10 items-center justify-center rounded-pill border border-border-default bg-paper text-ink transition-colors hover:border-copper hover:bg-cream hover:text-copper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-default disabled:hover:bg-paper disabled:hover:text-ink"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.6} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-3 md:gap-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {EVENT_CAROUSEL_ITEMS.map(({ name, Icon }) => (
              <div
                key={name}
                className="flex w-[140px] shrink-0 snap-start flex-col items-center gap-3 rounded-md border border-border-subtle bg-paper p-5 transition-all hover:-translate-y-1 hover:border-copper hover:shadow-rcd md:w-[160px]"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-pill bg-cream text-copper">
                  <Icon className="h-6 w-6" strokeWidth={1.4} />
                </span>
                <p className="text-center font-sans text-[13px] font-medium leading-tight text-ink">
                  {name}
                </p>
              </div>
            ))}
          </div>
          {/* Fade affordance on right edge so users know there's more */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-cream-soft to-transparent md:w-16" />
        </div>
      </div>
    </section>
  );
}

// ── How it works — 1, 2, 3 ──────────────────────────────────────
// Three plain-English steps that bridge the marketing landing to
// the chat-based intake. Sits between the events-we-host carousel
// and the Real Moments social proof so visitors see *how* before
// they read *who* it's worked for.
const HOW_IT_WORKS_STEPS = [
  {
    Icon: ClipboardList,
    title: "Submit your event logistics",
    body: "Tell us the headcount, dates, and the kind of gathering you're dreaming up. Allie takes it from there in about four minutes.",
  },
  {
    Icon: Receipt,
    title: "Get a pricing proposal against your itinerary",
    body: "We send back a full weekend estimate — venues, dining, stays, and add-ons — mapped to a draft itinerary you can edit.",
  },
  {
    Icon: MessageCircle,
    title: "Talk to an Events Concierge",
    body: "A Nobu Events Concierge follows up to walk you through every line item, answer questions, and lock in the date.",
  },
] as const;

function HowItWorks({ onSpecialist }: { onSpecialist: () => void }) {
  return (
    <section className="bg-paper py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-8 flex flex-col items-start gap-2 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="eyebrow">How it works</p>
            <h2 className="font-title text-3xl leading-tight text-ink md:text-4xl">
              <span>Easy as</span> <span className="italic">1, 2, 3.</span>
            </h2>
            <p className="mt-1 max-w-md font-sans text-sm leading-5 text-ink-soft">
              From first inquiry to confirmed weekend — three steps,
              no spreadsheets.
            </p>
          </div>
          <button
            type="button"
            onClick={onSpecialist}
            className="hidden items-center gap-1.5 font-sans text-sm font-medium text-copper transition-colors hover:text-copper-hover md:inline-flex"
          >
            Speak to an Events Concierge
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
          {HOW_IT_WORKS_STEPS.map(({ Icon, title, body }, i) => (
            <li
              key={title}
              className="relative flex flex-col gap-4 rounded-md border border-border-subtle bg-cream-soft p-6 md:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="font-title text-5xl italic leading-none text-copper md:text-6xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-paper text-copper shadow-sm">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-title text-xl leading-snug text-ink md:text-[22px]">
                  {title}
                </h3>
                <p className="font-sans text-sm leading-6 text-ink-soft">
                  {body}
                </p>
              </div>
              {i < HOW_IT_WORKS_STEPS.length - 1 && (
                <ChevronRight
                  className="pointer-events-none absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-copper md:block"
                  strokeWidth={1.6}
                  aria-hidden
                />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-6 flex md:hidden">
          <button
            type="button"
            onClick={onSpecialist}
            className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-copper transition-colors hover:text-copper-hover"
          >
            Speak to an Events Concierge
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Group-size guide — three tiers of Nobu social-event spaces ─
const GROUP_SIZES = [
  {
    name: "Up to 24 guests",
    sub: "Private dining rooms and the chef's table — intimate dinners and milestone toasts.",
    badge: "Most intimate",
  },
  {
    name: "25 – 80 guests",
    sub: "Garden terraces, ballroom corners, and pool-deck setups with full A/V.",
    badge: "Most flexible",
  },
  {
    name: "80 – 400 guests",
    sub: "Multi-day flows across the full resort — beach, ballroom, restaurants, and stays.",
    badge: "Full takeover",
  },
];

const EVENT_STORIES = [
  {
    name: "The Reyes Family",
    date: "Jul 2024 · 60 across 4 generations · Family Reunion",
    quote:
      "Twelve years between us and they still built a weekend that felt like home — space for the chaos of four generations and quiet corners for the small reunions.",
    img: storyEngagement,
  },
  {
    name: "Maya + 24",
    date: "May 2024 · 3 nights · Bachelorette",
    quote:
      "We came for the bachelorette and stayed for everything else. The concierge ran point on dinner, the spa, the late-night beach setup — we just showed up.",
    img: storyBirthday,
  },
  {
    name: "Daniel's 40th",
    date: "Sep 2024 · 80 guests · Birthday Weekend",
    quote:
      "Three days, one venue, every detail dialed. Friday welcome dinner, Saturday black-tie, Sunday recovery brunch — nobody had to think about a thing.",
    img: storyShower,
  },
];

// ── Glass-card "I want to plan a ___ around ___" picker ────────
function EventTypePicker({
  value,
  onChange,
}: {
  value: EventType | null;
  onChange: (v: EventType) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="flex w-full flex-col">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between border-b border-paper pb-2 pt-2 text-left"
      >
        <span className="font-title font-normal text-[26px] md:text-[28px] leading-8 text-paper">
          {value ?? "Choose an event"}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-paper transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <div className="overflow-hidden animate-notebook-expand">
          <div className="flex flex-wrap gap-2 pt-3">
            {EVENT_TYPES.map((t) => {
              const selected = value === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    onChange(t);
                    setOpen(false);
                  }}
                  className={`rounded-pill border px-3 py-1 font-sans text-sm font-medium transition-colors ${
                    selected
                      ? "border-paper bg-paper text-ink"
                      : "border-paper/40 bg-paper/[0.08] text-paper hover:bg-paper/20"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DatePicker({
  season,
  year,
  onSeason,
  onYear,
}: {
  season: Season;
  year: Year;
  onSeason: (s: Season) => void;
  onYear: (y: Year) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="flex w-full flex-col">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between border-b border-paper pb-2 pt-2 text-left"
      >
        <span className="font-title font-normal text-[26px] md:text-[28px] leading-8 text-paper">
          {season} {year}
        </span>
        <CalendarDays
          className="h-5 w-5 shrink-0 text-paper"
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <div className="overflow-hidden animate-notebook-expand">
          <div className="flex flex-col gap-2 pt-3">
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => {
                const selected = season === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onSeason(s)}
                    className={`rounded-pill border px-3 py-1 font-sans text-sm font-medium transition-colors ${
                      selected
                        ? "border-paper bg-paper text-ink"
                        : "border-paper/40 bg-paper/[0.08] text-paper hover:bg-paper/20"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              {YEARS.map((y) => {
                const selected = year === y;
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      onYear(y);
                      setOpen(false);
                    }}
                    className={`rounded-pill border px-3 py-1 font-sans text-sm font-medium transition-colors ${
                      selected
                        ? "border-paper bg-paper text-ink"
                        : "border-paper/40 bg-paper/[0.08] text-paper hover:bg-paper/20"
                    }`}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Plan = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [specialistOpen, setSpecialistOpen] = useState(false);
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [season, setSeason] = useState<Season>("Spring");
  const [year, setYear] = useState<Year>("2027");
  const [trustVisible, setTrustVisible] = useState(false);

  // Trust signal appears once the planner has committed to a kind of event.
  useEffect(() => {
    if (eventType) setTrustVisible(true);
  }, [eventType]);

  const handlePlan = () => {
    if (eventType) sessionStorage.setItem("nobu_event_type", eventType);
    sessionStorage.setItem("nobu_event_date", `${season} ${year}`);
    navigate("/chat");
  };

  return (
    <div className="min-h-dvh bg-canvas">
      <Nav
        variant="solid"
        onMenu={() => setMenuOpen(true)}
        onSpecialist={() => setSpecialistOpen(true)}
        onPlan={() => navigate("/chat")}
      />

      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-center justify-end overflow-hidden py-6 md:justify-center md:py-24"
        style={{ minHeight: 580 }}
      >
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={heroPoster}
            className="absolute inset-0 h-full w-full object-cover object-center"
          >
            <source src="/videobg-gathering.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>

        <div className="relative flex w-full flex-col items-center gap-10 px-4 md:max-w-3xl">
          {/* Headline — staggered words */}
          <div className="font-title text-center text-paper text-5xl leading-[52px] md:text-7xl md:leading-[80px]">
            <p className="animate-bubble-in" style={{ animationDelay: "0.05s" }}>
              A gathering
            </p>
            <p
              className="animate-bubble-in italic"
              style={{ animationDelay: "0.2s" }}
            >
              your loved ones
            </p>
            <p className="animate-bubble-in" style={{ animationDelay: "0.35s" }}>
              won&apos;t forget
            </p>
          </div>

          {/* Glass card */}
          <div
            className="flex w-full max-w-[342px] flex-col items-start justify-end gap-6 rounded-xl border p-6 md:max-w-lg md:p-8 animate-bubble-in"
            style={{
              animationDelay: "0.5s",
              borderColor: "rgba(218, 214, 206, 0.5)",
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex w-full flex-col gap-1">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-paper">
                We&apos;re hosting a…
              </p>
              <EventTypePicker value={eventType} onChange={setEventType} />
            </div>

            <div className="flex w-full flex-col gap-1">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-paper">
                …around
              </p>
              <DatePicker
                season={season}
                year={year}
                onSeason={setSeason}
                onYear={setYear}
              />
            </div>

            {trustVisible && (
              <div className="flex w-full items-center gap-2 rounded-pill bg-paper/15 px-3 py-2 animate-bubble-in">
                <Sparkles
                  className="h-3.5 w-3.5 shrink-0 text-paper"
                  strokeWidth={1.6}
                />
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-paper">
                  38 friends-and-family gatherings booked this month
                </p>
              </div>
            )}

            <div className="flex w-full flex-col gap-3">
              <button
                type="button"
                onClick={handlePlan}
                disabled={!eventType}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-pill bg-copper px-6 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-colors hover:bg-copper-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Plan my event <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setSpecialistOpen(true)}
                className="font-sans text-xs uppercase tracking-[0.2em] text-paper underline underline-offset-4 hover:text-paper/85 transition-colors"
              >
                Speak to an event specialist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Events we host — icon carousel ── */}
      <EventTypesCarousel />

      {/* ── How it works — easy as 1, 2, 3 ── */}
      <HowItWorks onSpecialist={() => setSpecialistOpen(true)} />

      {/* ── Real moments — diverse social events ── */}
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-12 md:py-16">
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="eyebrow">Real Moments</p>
            <h2 className="font-title text-3xl leading-tight text-ink md:text-4xl">
              <span>Real groups,</span>{" "}
              <span className="italic">really gathered.</span>
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-copper hover:text-copper-hover transition-colors"
          >
            See all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Lead testimonial */}
        <div className="flex flex-col overflow-hidden bg-paper md:flex-row md:rounded-md md:border md:border-border-default">
          <div className="relative h-[320px] shrink-0 md:h-auto md:min-h-[440px] md:w-1/2">
            <img
              src={storyEngagement}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-3 px-6 py-8 md:w-1/2 md:px-12 md:py-16">
            <p className="eyebrow">Featured</p>
            <p className="font-title text-2xl italic text-ink md:text-3xl leading-[1.3]">
              &ldquo;Twelve years between us and they still built a weekend
              that felt like home — space for the chaos of four generations
              and quiet corners for the small reunions.&rdquo;
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-px w-8 bg-copper" />
              <p className="font-sans text-sm text-ink-soft">
                Adaeze Reyes · Reyes Family Reunion · Jul 2024
              </p>
            </div>
          </div>
        </div>

        {/* Story cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {EVENT_STORIES.map((s) => (
            <button
              key={s.name}
              type="button"
              className="flex flex-col overflow-hidden rounded-md border border-border-subtle bg-paper text-left transition-transform hover:-translate-y-1 hover:shadow-rcd"
            >
              <div className="relative h-[220px] w-full overflow-hidden md:h-[260px]">
                <img
                  src={s.img}
                  alt={s.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-3 p-5">
                <div className="flex flex-col gap-0.5">
                  <p className="font-title text-base text-ink">{s.name}</p>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                    {s.date}
                  </p>
                </div>
                <p className="font-sans text-[13px] leading-5 text-ink-soft">
                  {s.quote}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Right Now — what's having a moment ── */}
      <section
        className="relative overflow-hidden px-6 py-12 md:py-16"
        style={{
          backgroundImage: `linear-gradient(rgba(245, 239, 230, 0.92), rgba(245, 239, 230, 0.94)), url(${rightNowBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="flex flex-col gap-2 md:max-w-md">
            <p className="eyebrow">Any guest list</p>
            <h2 className="font-title text-3xl leading-tight text-ink md:text-4xl">
              <span>Sized for </span>
              <span className="italic">every gathering.</span>
            </h2>
            <p className="font-sans text-sm leading-5 text-ink-soft">
              From 10-person private dinners to full-resort takeovers of 400,
              every Nobu space scales to the group you&apos;re bringing.
            </p>
          </div>

          <div className="flex w-full flex-col gap-0.5 rounded-md bg-paper/85 px-4 py-2 backdrop-blur md:max-w-md">
            {GROUP_SIZES.map((item, i) => (
              <div key={item.name}>
                <div className="flex items-center justify-between py-4">
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="font-sans text-base font-medium text-ink">
                      {item.name}
                    </p>
                    <p className="font-title text-[13px] italic text-ink-soft">
                      {item.sub}
                    </p>
                  </div>
                  <div className="ml-2 shrink-0 rounded-sm bg-cream-soft px-2 py-1">
                    <p className="font-sans text-[10px] font-semibold uppercase leading-4 tracking-[0.18em] text-copper">
                      {item.badge}
                    </p>
                  </div>
                </div>
                {i < GROUP_SIZES.length - 1 ? (
                  <div className="h-px w-10 bg-border-default" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA band ── */}
      <section className="border-t border-border-default bg-paper">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-6 py-12 md:flex-row md:items-center md:justify-between md:py-14">
          <div className="flex flex-col gap-2 md:max-w-xl">
            <p className="eyebrow">From first toast to last dance</p>
            <h3 className="font-title text-2xl text-ink md:text-3xl">
              Let&apos;s start. Tell Allie the dates, the people, the moment.
            </h3>
            <p className="font-sans text-sm text-ink-soft">
              One conversation, one estimate, one refundable hold — and you can
              loop in a real event specialist any time.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
            <button
              type="button"
              onClick={handlePlan}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-pill bg-ink px-6 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-colors hover:bg-ink-soft"
            >
              Plan my event <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <Link
              to="/"
              className="inline-flex h-11 items-center justify-center rounded-pill border border-ink/30 bg-transparent px-6 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-ink hover:bg-cream transition-colors"
            >
              Back to Nobu
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSpecialist={() => {
          setMenuOpen(false);
          setSpecialistOpen(true);
        }}
        onPlan={() => {
          setMenuOpen(false);
          handlePlan();
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
};

export default Plan;
