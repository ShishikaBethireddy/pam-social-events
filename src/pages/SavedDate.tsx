import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Check, ChevronUp, Share2 } from "lucide-react";
import heroImg from "@/assets/hero-celebration.jpg";

type Booking = {
  eventType?: string;
  guests?: string;
  dates?: string;
  venue?: string;
  fnb?: string;
  name?: string;
};

const formatCountdown = (total: number) => {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const SavedDate = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking>({});
  const [seconds, setSeconds] = useState(48 * 3600 - 5);

  useEffect(() => {
    const raw = sessionStorage.getItem("nobu_booking");
    if (raw) setBooking(JSON.parse(raw));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const dateLabel = booking.dates || "Your selected date";
  const eventLabel = booking.eventType || "Social Event";
  const venueLabel = booking.venue || "Nobu Hotel Los Cabos";
  const guestsLabel = booking.guests || "Your guest count";

  const benefits = [
    "4-hr dinner reception",
    "4-hr additional event on day two",
    "Standard banquet tables",
    "Chocolate Avant Garde chairs included",
    "Custom celebration cake",
    "Professional audio system",
    "Themed floral arrangements",
    "House sparkling wine toast",
    "Dedicated event host on-site",
    "Nobu hospitality welcome package",
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Top bar */}
      <header className="bg-ink text-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <button aria-label="Menu" className="text-white">
            <span className="block h-0.5 w-6 bg-white" />
            <span className="mt-1.5 block h-0.5 w-6 bg-white" />
            <span className="mt-1.5 block h-0.5 w-6 bg-white" />
          </button>
          <div className="text-center">
            <div className="font-serif text-lg tracking-[0.15em] sm:text-xl">NOBU HOTEL</div>
            <div className="text-[10px] tracking-[0.35em] text-white/80">LOS CABOS</div>
          </div>
          <button aria-label="Concierge" className="text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 18h14M12 6a6 6 0 016 6v2H6v-2a6 6 0 016-6zM12 4v2" />
            </svg>
          </button>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px bg-white/10 px-0 sm:px-8">
          <div className="bg-black px-5 py-4 sm:px-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Free cancellation closes in
            </p>
            <p className="mt-2 font-serif text-4xl font-light tracking-tight text-white sm:text-5xl">
              {formatCountdown(seconds)}
            </p>
          </div>
          <div className="flex items-start justify-between bg-white/10 px-5 py-4 sm:px-6">
            <div>
              <p className="font-serif text-4xl font-light leading-none text-white sm:text-5xl">38</p>
              <p className="mt-2 text-sm leading-snug text-white/85">
                hosts saved this venue this year
              </p>
            </div>
            <Calendar className="h-5 w-5 text-white/85" />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[420px] w-full overflow-hidden sm:h-[520px]">
        <img src={heroImg} alt={venueLabel} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/30" />
        <div className="relative mx-auto flex h-full max-w-5xl items-start justify-between px-6 pt-8 sm:px-10 sm:pt-12">
          <h1 className="font-serif text-6xl font-light leading-[0.95] text-white sm:text-8xl">
            SAVE
            <br />
            MY
            <br />
            DATE
          </h1>
          <div className="text-right font-medium text-white">
            <div className="text-base sm:text-lg">{dateLabel}</div>
            <div className="mt-1 text-sm text-white/85 sm:text-base">5:30pm</div>
          </div>
        </div>
        <button
          aria-label="Share"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: "My Nobu reservation", url: window.location.href }).catch(() => {});
            }
          }}
          className="absolute bottom-6 right-6 grid h-12 w-12 place-items-center rounded-full bg-white/95 text-foreground shadow-md hover:bg-white"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </section>

      {/* Body */}
      <section className="mx-auto -mt-6 max-w-2xl px-5 pb-16 sm:px-8">
        {/* Deposit card */}
        <div className="rounded-md bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-5">
            <div className="font-serif text-5xl font-light leading-none">$500</div>
            <p className="pt-1 text-sm leading-relaxed text-muted-foreground">
              Take 48 hours to settle into your choice with our full reservation guarantee.
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-border pt-5">
            {[
              "Locks today's pricing on venue, vendors, and rooms",
              "Applied to your final invoice — not an extra charge",
              "Lock in your Signature package ($5,000 starting at)",
            ].map((line) => (
              <div key={line} className="flex items-start gap-3 border-b border-border/70 pb-4 last:border-b-0 last:pb-0">
                <Check className="mt-0.5 h-5 w-5 flex-none text-foreground" strokeWidth={2} />
                <p className="text-[15px] leading-relaxed text-foreground">{line}</p>
              </div>
            ))}
          </div>

          <details className="group mt-6 border-t border-border pt-5" open>
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/80">
                Tier 4 Signature Includes:
              </span>
              <span className="flex items-center gap-3">
                <span className="rounded-sm bg-secondary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  10 Benefits
                </span>
                <ChevronUp className="h-4 w-4 text-foreground transition group-open:rotate-0 [details:not([open])>summary>span>&]:rotate-180" />
              </span>
            </summary>
            <ul className="mt-4 divide-y divide-border">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 py-3 text-[15px] text-foreground">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full border border-border text-muted-foreground">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </details>
        </div>

        {/* Confirmation summary */}
        <div className="mt-6 rounded-md border border-border bg-white p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
            Your date is secured
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light leading-tight">
            Thank you{booking.name ? `, ${booking.name.split(" ")[0]}` : ""}.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We've sent your confirmation and 48-hour hold details to your email. Our events team
            will reach out within one business day to finalize your celebration.
          </p>

          <dl className="mt-5 divide-y divide-border text-sm">
            <div className="flex justify-between py-3">
              <dt className="text-muted-foreground">Celebration</dt>
              <dd className="text-foreground">{eventLabel}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-muted-foreground">Date</dt>
              <dd className="text-foreground">{dateLabel}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-muted-foreground">Guests</dt>
              <dd className="text-foreground">{guestsLabel}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted-foreground">Venue</dt>
              <dd className="text-right text-foreground">{venueLabel}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => {
              const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${eventLabel} at ${venueLabel}\nDTSTART:20270331T173000\nDTEND:20270331T223000\nEND:VEVENT\nEND:VCALENDAR`;
              const blob = new Blob([ics], { type: "text/calendar" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "nobu-event.ics";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="w-full rounded-full bg-primary py-4 text-base font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            Add to my calendar
          </button>
          <button
            onClick={() => navigate("/direct")}
            className="w-full rounded-full border border-border bg-white py-4 text-base font-medium text-foreground transition hover:bg-secondary/60"
          >
            Back to Nobu
          </button>
        </div>
      </section>
    </div>
  );
};

export default SavedDate;