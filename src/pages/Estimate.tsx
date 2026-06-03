import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Check,
  MapPin,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";
import { Nav } from "@/components/nobu/Nav";
import heroImg from "@/assets/hero-celebration.jpg";
import bacheloretteHero from "@/assets/bachelorette-beach.jpg";

type Booking = {
  eventType?: string;
  guests?: string;
  dates?: string;
  venue?: string;
  fnb?: string;
  name?: string;
  email?: string;
  phone?: string;
};

const Estimate = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking>({});

  useEffect(() => {
    const raw = sessionStorage.getItem("nobu_booking");
    if (raw) setBooking(JSON.parse(raw));
  }, []);

  const isBachelorette = (booking.eventType ?? "")
    .toLowerCase()
    .includes("bachelorette");

  if (isBachelorette) {
    return <BacheloretteEstimate booking={booking} navigate={navigate} />;
  }

  return <GenericEstimate booking={booking} navigate={navigate} />;
};

export default Estimate;

// ── Bachelorette weekend proposal ────────────────────────────────
// A curated 3-night, 12-guest bachelorette weekend at Nobu Hotel Los
// Cabos — line items for each space + reservation, accommodations,
// and a clear per-bridesmaid split so the maid of honor can hit
// "Share with the bridesmaids" and collect Venmo links.

type ItineraryItem = {
  time: string;
  title: string;
  venue: string;
  note: string;
  price: number;
};

type ItineraryDay = {
  day: string;
  label: string;
  items: ItineraryItem[];
};

const BACHELORETTE_ITINERARY: ItineraryDay[] = [
  {
    day: "Friday",
    label: "Arrivals & welcome",
    items: [
      {
        time: "4:00 PM",
        title: "Welcome cabana & cocktails",
        venue: "Beach Pool",
        note: "Private cabana, signature welcome cocktail flight, light bites.",
        price: 850,
      },
      {
        time: "7:30 PM",
        title: "Welcome dinner",
        venue: "Nobu Restaurant",
        note: "Reserved 14-top, omakase tasting with sake pairing.",
        price: 2400,
      },
    ],
  },
  {
    day: "Saturday",
    label: "Spa, sun & celebration",
    items: [
      {
        time: "10:00 AM",
        title: "Group spa morning",
        venue: "Esencia Spa",
        note: "12 signature treatments + private relaxation lounge buyout.",
        price: 4200,
      },
      {
        time: "1:30 PM",
        title: "Light lunch",
        venue: "Malibu Farm",
        note: "Reserved private terrace, family-style farm-to-table menu.",
        price: 980,
      },
      {
        time: "4:00 PM",
        title: "Beach photoshoot & bride-tribe setup",
        venue: "Pedregal Beach",
        note: "Bride-tribe photographer, sashes, styling, and styling kit.",
        price: 1250,
      },
      {
        time: "8:00 PM",
        title: "Signature dinner",
        venue: "Yakusoku Garden",
        note: "Private chef's table, six-course tasting + sake pairing.",
        price: 3800,
      },
    ],
  },
  {
    day: "Sunday",
    label: "Farewell brunch",
    items: [
      {
        time: "11:00 AM",
        title: "Farewell brunch",
        venue: "Shiawase Terrace",
        note: "Semi-private terrace, family-style brunch + bottomless mimosas.",
        price: 1650,
      },
    ],
  },
];

const BACHELORETTE_ROOMS = {
  type: "Deluxe King Suite",
  rooms: 6,
  nights: 3,
  ratePerNight: 450,
  occupancyNote: "Double occupancy — bridesmaids paired, bride in her own suite",
};

const HONOREE_INCLUSIONS = [
  "Welcome amenity in the bride's suite (champagne + handwritten note)",
  "Complimentary in-room spa add-on (60-min massage)",
  "Reserved guest of honor seating at every dining moment",
  "Personalized bride sash, robe, and brunch hat",
];

function fmt(n: number) {
  return `$${n.toLocaleString()}`;
}

function BacheloretteEstimate({
  booking,
  navigate,
}: {
  booking: Booking;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const dateLabel = booking.dates || "Spring 2027";
  const totalGuests = 12;
  const bridesmaids = totalGuests - 1;

  const itineraryTotal = BACHELORETTE_ITINERARY.reduce(
    (sum, day) => sum + day.items.reduce((s, item) => s + item.price, 0),
    0,
  );
  const roomsTotal =
    BACHELORETTE_ROOMS.rooms *
    BACHELORETTE_ROOMS.nights *
    BACHELORETTE_ROOMS.ratePerNight;
  const grandTotal = itineraryTotal + roomsTotal;

  // Bridesmaids cover the bride's portion as a group gift — split the
  // total across the 11 bridesmaids.
  const perBridesmaid = Math.round(grandTotal / bridesmaids);
  const perPersonIfEven = Math.round(grandTotal / totalGuests);
  const brideGiftPerBridesmaid = perBridesmaid - perPersonIfEven;
  const brideGiftTotal = brideGiftPerBridesmaid * bridesmaids;

  // Room share — 3 nights at $450/night, double occupancy = $675 / bridesmaid.
  const roomSharePer =
    (BACHELORETTE_ROOMS.nights * BACHELORETTE_ROOMS.ratePerNight) / 2;
  const groupSharePer = perBridesmaid - roomSharePer;

  const handleSaveDate = () => navigate("/worldpay");
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Bachelorette Weekend · Nobu Hotel Los Cabos",
          text: `Bachelorette weekend at Nobu Los Cabos — ${fmt(perBridesmaid)} per bridesmaid.`,
          url: window.location.href,
        })
        .catch(() => {});
    }
  };

  const firstName = booking.name?.split(" ")[0] || "Bride-to-be";
  const dayChips = BACHELORETTE_ITINERARY.map((d) => ({
    day: d.day.slice(0, 3).toUpperCase(),
    label: d.label,
  }));

  return (
    <div className="min-h-screen bg-[#FBF6EE] text-foreground">
      <Nav onPlan={() => navigate("/plan")} />

      {/* ── Hero: postcard-style split ─────────────────────────── */}
      <section className="relative w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left — bachelorette photo */}
          <div className="relative h-[320px] w-full overflow-hidden md:h-[560px]">
            <img
              src={bacheloretteHero}
              alt="Bridesmaids celebrating on the beach"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Postage-stamp eyebrow over the image */}
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-background/85 px-3 py-1.5 font-serif text-[10px] uppercase tracking-[0.32em] text-foreground backdrop-blur md:left-6 md:top-6">
              <Sparkles className="h-3 w-3 text-accent" strokeWidth={1.8} />
              The Itinerary
            </div>
          </div>

          {/* Right — title card on paper */}
          <div className="relative flex flex-col justify-center gap-5 bg-[#FBF6EE] px-6 py-10 md:px-12 md:py-14">
            {/* Top tear-line */}
            <div className="absolute inset-x-6 top-6 hidden h-px border-t border-dashed border-foreground/20 md:block" />

            <p className="font-serif text-[11px] uppercase tracking-[0.38em] text-accent">
              Bachelorette weekend · Nobu Los Cabos
            </p>
            <h1 className="font-serif text-5xl leading-[1.05] text-foreground sm:text-6xl">
              <span className="italic">{firstName}&rsquo;s</span>
              <br />
              last hurrah
            </h1>
            <p className="max-w-md font-serif text-[15px] italic leading-relaxed text-foreground/75">
              Three nights, twelve bridesmaids, one bride — every space booked,
              every reservation held, every detail dialed.
            </p>

            {/* Trip facts — luggage-tag pills */}
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-3 py-1.5 font-serif text-[12px] text-foreground">
                <Calendar className="h-3.5 w-3.5 text-accent" strokeWidth={1.6} />
                {dateLabel} · 3 nights
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-3 py-1.5 font-serif text-[12px] text-foreground">
                <Users className="h-3.5 w-3.5 text-accent" strokeWidth={1.6} />
                1 bride + {bridesmaids} bridesmaids
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-3 py-1.5 font-serif text-[12px] text-foreground">
                <MapPin className="h-3.5 w-3.5 text-accent" strokeWidth={1.6} />
                Cabo San Lucas, MX
              </span>
            </div>

            {/* Bottom tear-line */}
            <div className="absolute inset-x-6 bottom-6 hidden h-px border-t border-dashed border-foreground/20 md:block" />
          </div>
        </div>
      </section>

      {/* ── At-a-glance day strip ─────────────────────────────── */}
      <section className="border-y border-dashed border-foreground/15 bg-[#F3EBDC]/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-6 py-4 sm:px-10">
          {dayChips.map((d, i) => (
            <div key={d.day} className="flex flex-1 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full border border-accent/40 bg-background text-center">
                <span className="font-serif text-[9px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {d.day}
                </span>
              </div>
              <div className="hidden flex-1 flex-col leading-tight sm:flex">
                <span className="font-serif text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Day {i + 1}
                </span>
                <span className="font-serif text-sm italic text-foreground">
                  {d.label}
                </span>
              </div>
              {i < dayChips.length - 1 && (
                <span
                  className="hidden h-px flex-1 border-t border-dotted border-foreground/30 sm:block"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Itinerary "tear-sheet" ───────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <p className="font-serif text-[10px] uppercase tracking-[0.4em] text-accent">
            · Weekend itinerary ·
          </p>
          <h2 className="font-serif text-3xl italic leading-tight text-foreground sm:text-4xl">
            Three days, every detail dialed.
          </h2>
          <p className="mt-1 max-w-xl font-serif text-[13px] italic leading-snug text-muted-foreground">
            Each space booked and each reservation held — the bridesmaids show
            up, the rest is taken care of.
          </p>
        </div>

        {/* Days — each as a "page" with vertical timeline */}
        <div className="space-y-10">
          {BACHELORETTE_ITINERARY.map((day, dayIdx) => {
            const daySubtotal = day.items.reduce(
              (s, item) => s + item.price,
              0,
            );
            return (
              <article
                key={day.day}
                className="relative overflow-hidden rounded-md border border-foreground/10 bg-background px-5 pb-6 pt-7 shadow-sm sm:px-8 sm:pt-8 sm:pb-8"
              >
                {/* Day number stamp top-right */}
                <div className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-accent/60 text-center sm:right-7 sm:top-7">
                  <span className="font-serif text-[10px] uppercase tracking-[0.18em] text-accent">
                    Day
                    <br />
                    {String(dayIdx + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Day header */}
                <header className="border-b border-dashed border-foreground/15 pb-5 pr-16">
                  <p className="font-serif text-[10px] uppercase tracking-[0.3em] text-accent">
                    {day.day}
                  </p>
                  <h3 className="mt-1 font-serif text-3xl italic leading-tight text-foreground sm:text-4xl">
                    {day.label}
                  </h3>
                  <p className="mt-2 font-serif text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {day.items.length} moments · {fmt(daySubtotal)} day total
                  </p>
                </header>

                {/* Timeline */}
                <ol className="relative mt-6 space-y-6 pl-7">
                  {/* Vertical line */}
                  <span
                    aria-hidden="true"
                    className="absolute left-[7px] top-2 bottom-2 w-px bg-foreground/15"
                  />
                  {day.items.map((item, i) => (
                    <li key={i} className="relative">
                      {/* Dot */}
                      <span
                        aria-hidden="true"
                        className="absolute -left-[27px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-accent bg-background"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      </span>

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                            <span className="font-serif text-[10px] uppercase tracking-[0.3em] text-accent">
                              {item.time}
                            </span>
                            <span className="font-serif text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                              {item.venue}
                            </span>
                          </div>
                          <p className="font-serif text-lg leading-tight text-foreground sm:text-xl">
                            {item.title}
                          </p>
                          <p className="font-serif text-[13px] italic leading-snug text-muted-foreground">
                            {item.note}
                          </p>
                        </div>
                        <p className="flex-none font-serif text-sm text-muted-foreground">
                          {fmt(item.price)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            );
          })}
        </div>

        {/* ── Stay card ───────────────────────────────────────── */}
        <article className="mt-10 overflow-hidden rounded-md border border-foreground/10 bg-background p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-1">
            <p className="font-serif text-[10px] uppercase tracking-[0.3em] text-accent">
              The Stay
            </p>
            <h3 className="font-serif text-3xl italic leading-tight text-foreground sm:text-4xl">
              Six suites, all yours.
            </h3>
          </div>

          <div className="mt-6 flex items-start justify-between gap-4 border-t border-dashed border-foreground/15 pt-5">
            <div className="min-w-0 flex-1">
              <p className="font-serif text-base text-foreground">
                {BACHELORETTE_ROOMS.type}
              </p>
              <p className="mt-0.5 font-serif text-[13px] italic text-muted-foreground">
                {BACHELORETTE_ROOMS.rooms} rooms ×{" "}
                {BACHELORETTE_ROOMS.nights} nights ×{" "}
                {fmt(BACHELORETTE_ROOMS.ratePerNight)}/night
              </p>
              <p className="mt-1 font-serif text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {BACHELORETTE_ROOMS.occupancyNote}
              </p>
            </div>
            <p className="font-serif text-base text-foreground">
              {fmt(roomsTotal)}
            </p>
          </div>

          <div className="mt-5 rounded-md bg-[#FBF6EE] px-4 py-3">
            <p className="font-serif text-[10px] uppercase tracking-[0.3em] text-accent">
              The bride&rsquo;s suite includes
            </p>
            <ul className="mt-2.5 space-y-1.5">
              {HONOREE_INCLUSIONS.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 font-serif text-[13px] italic text-foreground/85"
                >
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 flex-none text-accent"
                    strokeWidth={2.4}
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* ── Per-bridesmaid receipt ─────────────────────────── */}
        <article className="mt-10 overflow-hidden rounded-md border-2 border-dashed border-accent/40 bg-[#FBF6EE] p-6 shadow-sm sm:p-8">
          <p className="font-serif text-[10px] uppercase tracking-[0.4em] text-accent">
            · For the group chat ·
          </p>
          <h3 className="mt-2 font-serif text-3xl italic leading-tight text-foreground sm:text-4xl">
            What each bridesmaid pays
          </h3>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-serif text-5xl text-foreground sm:text-6xl">
              {fmt(perBridesmaid)}
            </span>
            <span className="font-serif text-sm italic text-muted-foreground">
              / bridesmaid
            </span>
          </div>
          <p className="mt-3 font-serif text-[13px] italic leading-relaxed text-muted-foreground">
            {fmt(grandTotal)} split across {bridesmaids} bridesmaids — the
            bride&rsquo;s portion covered as a group gift from the bridal party.
          </p>

          <dl className="mt-6 divide-y divide-dashed divide-foreground/15 border-y border-dashed border-foreground/15">
            <div className="flex items-baseline justify-between gap-3 py-3">
              <dt className="flex min-w-0 flex-1 items-baseline gap-3">
                <span className="font-serif text-sm text-foreground">
                  Room share
                </span>
                <span
                  className="hidden flex-1 translate-y-[-2px] border-b border-dotted border-foreground/25 sm:block"
                  aria-hidden="true"
                />
                <span className="font-serif text-[11px] italic uppercase tracking-[0.2em] text-muted-foreground">
                  3 nights · double occupancy
                </span>
              </dt>
              <dd className="font-serif text-sm text-foreground">
                {fmt(roomSharePer)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 py-3">
              <dt className="flex min-w-0 flex-1 items-baseline gap-3">
                <span className="font-serif text-sm text-foreground">
                  Group dining, spa &amp; experiences
                </span>
                <span
                  className="hidden flex-1 translate-y-[-2px] border-b border-dotted border-foreground/25 sm:block"
                  aria-hidden="true"
                />
                <span className="font-serif text-[11px] italic uppercase tracking-[0.2em] text-muted-foreground">
                  inc. bride&rsquo;s share
                </span>
              </dt>
              <dd className="font-serif text-sm text-foreground">
                {fmt(groupSharePer)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 py-4">
              <dt className="font-serif text-lg italic text-foreground">
                Per bridesmaid
              </dt>
              <dd className="font-serif text-lg text-foreground">
                {fmt(perBridesmaid)}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex items-start gap-2 rounded-md bg-background/70 px-4 py-3 font-serif text-[12px] italic leading-snug text-muted-foreground">
            <Sparkles
              className="mt-0.5 h-3.5 w-3.5 flex-none text-accent"
              strokeWidth={1.8}
            />
            <span>
              Group gift to the bride:{" "}
              <span className="not-italic font-semibold text-foreground">
                {fmt(brideGiftTotal)}
              </span>{" "}
              total · {fmt(brideGiftPerBridesmaid)} per bridesmaid above an
              even-split contribution of {fmt(perPersonIfEven)}.
            </span>
          </div>
        </article>

        {/* ── CTAs ─────────────────────────────────────────────── */}
        <div className="mt-10 space-y-3">
          <button
            onClick={handleSaveDate}
            className="w-full rounded-full bg-foreground py-4 font-serif text-[12px] uppercase tracking-[0.3em] text-background transition hover:bg-foreground/85"
          >
            Hold the weekend · refundable deposit
          </button>
          <button
            onClick={handleShare}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-foreground/30 bg-background py-4 font-serif text-[12px] uppercase tracking-[0.3em] text-foreground transition hover:bg-[#FBF6EE]"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share with the bridesmaids
          </button>
        </div>

        <p className="mt-10 text-center font-serif text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          · à la prochaine ·
        </p>
        <div className="mt-2 text-center">
          <Link
            to="/direct"
            className="font-serif text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
          >
            Back to Nobu
          </Link>
        </div>
      </section>
    </div>
  );
}

// ── Generic fallback (event-agnostic layout for non-bachelorette bookings) ──
function GenericEstimate({
  booking,
  navigate,
}: {
  booking: Booking;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const dateLabel = booking.dates || "Your date";
  const venueLabel = booking.venue || "Private space";
  const fnbLabel = booking.fnb
    ? `${booking.fnb} dining program`
    : "Chef-curated dining program";
  const addOnsLabel = "Custom florals · Live music · Photography";

  const lines: { label: React.ReactNode; value: string }[] = [
    {
      label: (
        <span>
          <span className="font-medium">{venueLabel}</span>
        </span>
      ),
      value: "$3,500",
    },
    {
      label: (
        <span>
          <span className="font-medium">Package:</span> {fnbLabel}
        </span>
      ),
      value: "Included",
    },
    {
      label: (
        <span>
          <span className="font-medium">Package:</span> 4hr Private Event
        </span>
      ),
      value: "Included",
    },
  ];

  const benefits = [
    "4hr Private event time",
    "Dedicated event host on-site",
    "Food & Beverage included",
    "15% off guest room block",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav onPlan={() => navigate("/plan")} />

      <section className="relative h-[280px] w-full overflow-hidden sm:h-[360px]">
        <img
          src={heroImg}
          alt="Estimate venue"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-center px-6 sm:px-10">
          <h1 className="font-serif text-5xl font-light text-white sm:text-6xl">
            Your estimate
          </h1>
          <p className="mt-3 text-lg text-white/90">{dateLabel}</p>
          <div className="mt-4 h-px w-16 bg-white/60" />
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-10 sm:px-8 sm:py-14">
        <div className="rounded-md border border-border p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            What's included
          </p>
          <dl className="mt-5 divide-y divide-border">
            {lines.map((l, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 py-4 text-base"
              >
                <dt className="text-foreground">{l.label}</dt>
                <dd className="font-medium text-foreground">{l.value}</dd>
              </div>
            ))}
            <div className="flex items-start justify-between gap-4 py-4 text-base">
              <dt>
                <div className="font-medium text-foreground">
                  Wish List Add-ons
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {addOnsLabel}
                </div>
              </dt>
              <dd className="font-medium text-foreground">$4,300</dd>
            </div>
          </dl>
          <div className="mt-6 border-t border-border pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Package benefits earned
            </p>
            <ul className="mt-4 space-y-3">
              {benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-3 text-base text-foreground"
                >
                  <Check
                    className="h-5 w-5 flex-none text-accent"
                    strokeWidth={2.5}
                  />
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Final guest count confirmed 7 days before the event
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-md border border-border p-6 sm:p-8">
          <div className="flex items-center justify-between text-lg">
            <span className="font-medium">Estimated Subtotal</span>
            <span className="font-medium">$7,800</span>
          </div>
          <div className="mt-5 border-t border-border pt-5">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium">Deposit due today</span>
              <span className="font-medium">$500</span>
            </div>
          </div>
          <div className="mt-5 rounded-md border border-border bg-secondary/40 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-medium text-foreground">
                  What your guests pay
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Confirmed 200 rooms available for your dates
                </div>
              </div>
              <div className="text-right text-lg font-medium text-foreground">
                $300 / night
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate("/worldpay")}
            className="w-full rounded-full bg-primary py-4 text-base font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            Save my date
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: "My Nobu Estimate",
                    url: window.location.href,
                  })
                  .catch(() => {});
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background py-4 text-base font-medium text-foreground transition hover:bg-secondary/60"
          >
            <Share2 className="h-4 w-4" />
            Share estimate
          </button>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/direct"
            className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
          >
            Back to Nobu
          </Link>
        </div>
      </section>
    </div>
  );
}
