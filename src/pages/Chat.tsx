import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Plus,
  Send,
  CalendarHeart,
  Menu,
  User as UserIcon,
} from "lucide-react";
import nobuLogo from "@/assets/logo-nobu-white.png";
import { DepositModal } from "@/components/nobu/DepositModal";
import { EstimateModal } from "@/components/nobu/EstimateModal";
import { DateCalendar } from "@/components/nobu/DateCalendar";
import { SpaceGallery } from "@/components/nobu/SpaceGallery";
import { FnbGallery } from "@/components/nobu/FnbGallery";
import { PersonalizingLoader } from "@/components/nobu/PersonalizingLoader";
import { Slider } from "@/components/ui/slider";
import { PlanningChatShell } from "@/components/nobu/PlanningChatShell";
import {
  NOTEBOOK_STEPS,
  type NotebookStepNum,
} from "@/components/nobu/EventPlanningNotebook";
import { SaveProgressSheet } from "@/components/nobu/SaveProgressSheet";
import { useChatPinScroll } from "@/hooks/useChatPinScroll";
import { useAuth } from "@/lib/auth";

// ── Chat step model ─────────────────────────────────────────────
// Mirrors pam-brides V1.1 chat steps but spun off for social events.
type Msg = { role: "allie" | "user"; text: string; chips?: string[] };

type Step =
  | "intro"
  | "eventType"
  | "guests"
  | "dates"
  | "personalizing"
  | "venue"
  | "fnb"
  | "name"
  | "email"
  | "summary"
  | "done";

const STEP_ORDER: Step[] = [
  "eventType",
  "guests",
  "dates",
  "venue",
  "fnb",
  "name",
  "email",
  "summary",
];

// Chat step → 1–5 notebook step (Celebration / Logistics / Style /
// Recommendations / Hold the Date) — direct counterpart to the
// pam-brides V1.1 notebook step mapping.
const NOTEBOOK_FOR_STEP: Record<Step, NotebookStepNum> = {
  intro: 1,
  eventType: 1,
  guests: 2,
  dates: 2,
  personalizing: 2,
  venue: 2,
  fnb: 3,
  name: 4,
  email: 4,
  summary: 4,
  done: 5,
};

const eventOptions = [
  "Family Reunion",
  "Holiday Gathering",
  "Milestone Birthday",
  "Anniversary",
  "Baby Shower",
  "Birthday Weekend",
  "Engagement",
  "Bachelor Party",
  "Bachelorette Party",
  "Private Dinner",
  "Other",
];

type Booking = {
  eventType?: string;
  guests?: string;
  dates?: string;
  venue?: string;
  fnb?: string;
  name?: string;
  email?: string;
};

// First chat step routed to from a given notebook step number — used
// when the planner clicks back to an earlier notebook entry.
const FIRST_STEP_FOR_NOTEBOOK: Record<NotebookStepNum, Step> = {
  1: "eventType",
  2: "guests",
  3: "fnb",
  4: "name",
  5: "summary",
};

const STORAGE_KEY = "nobu_plan_progress";

type SavedProgress = {
  step: Step;
  booking: Booking;
  maxReachable: NotebookStepNum;
};

const Chat = () => {
  const navigate = useNavigate();
  const user = useAuth();

  const [messages, setMessages] = useState<Msg[]>([]);
  const [step, setStep] = useState<Step>("intro");
  const [booking, setBooking] = useState<Booking>({});
  const [maxReachable, setMaxReachable] = useState<NotebookStepNum>(1);
  const [input, setInput] = useState("");
  const [freeText, setFreeText] = useState("");
  const [depositOpen, setDepositOpen] = useState(false);
  const [estimateOpen, setEstimateOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Persist + restore so the notebook "Save" / "Start over" works.
  useEffect(() => {
    if (confirmed) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step, booking, maxReachable }),
      );
    } catch {
      /* ignore quota errors */
    }
  }, [step, booking, maxReachable, confirmed]);

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      const raw = sessionStorage.getItem("nobu_booking");
      if (raw) setBooking(JSON.parse(raw));
      setConfirmed(true);
      setStep("done");
      setMaxReachable(5);
      setMessages([]);
      setSearchParams({}, { replace: true });
    }
  }, []);

  useEffect(() => {
    if (confirmed) return;

    // Consume pre-seeded selections from the /plan landing if present.
    const seededType = sessionStorage.getItem("nobu_event_type");
    const seededDate = sessionStorage.getItem("nobu_event_date");
    sessionStorage.removeItem("nobu_event_type");
    sessionStorage.removeItem("nobu_event_date");

    const t = setTimeout(() => {
      if (seededType && seededDate) {
        // Skip the celebration + date prompts — go straight to guests.
        setBooking((b) => ({
          ...b,
          eventType: seededType,
          dates: seededDate,
        }));
        setMessages([
          {
            role: "allie",
            text: `Hello, I'm Allie — your Nobu event concierge. A ${seededType.toLowerCase()} around ${seededDate} sounds lovely. Let's bring the whole family together.`,
          },
          {
            role: "allie",
            text: "About how many family members and loved ones do you expect to join?",
          },
        ]);
        setStep("guests");
        setMaxReachable(2);
        return;
      }
      if (seededType) {
        setBooking((b) => ({ ...b, eventType: seededType }));
        setMessages([
          {
            role: "allie",
            text: `Hello, I'm Allie — your Nobu event concierge. A ${seededType.toLowerCase()} at Nobu — what a lovely reason to gather the family. About how many loved ones will be with you?`,
          },
        ]);
        setStep("guests");
        setMaxReachable(2);
        return;
      }
      setMessages([
        {
          role: "allie",
          text:
            "Hello, I'm Allie — your Nobu event concierge. I'll help you bring the family together for something unforgettable — about 4 minutes to map it out.",
        },
        { role: "allie", text: "What's bringing the family together?", chips: eventOptions },
      ]);
      setStep("eventType");
      setMaxReachable((m) => Math.max(m, 1) as NotebookStepNum);
    }, 250);
    return () => clearTimeout(t);
  }, [confirmed]);

  // Manual scroll-back behavior — V1.1 chat pin scroll
  useChatPinScroll(scrollRef, [messages, step, confirmed]);

  const pamSay = (text: string, chips?: string[]) => {
    setMessages((m) => [...m, { role: "allie", text, chips }]);
  };

  const bumpReachable = (n: NotebookStepNum) =>
    setMaxReachable((m) => (n > m ? n : m));

  const handleAnswer = (value: string) => {
    setMessages((m) => [...m, { role: "user", text: value }]);
    setInput("");

    setTimeout(() => {
      if (step === "eventType") {
        setBooking((b) => ({ ...b, eventType: value }));
        pamSay(
          `Lovely — a ${value.toLowerCase()} at Nobu. About how many family members and loved ones will be joining?`,
        );
        setStep("guests");
        bumpReachable(2);
      } else if (step === "guests") {
        setBooking((b) => ({ ...b, guests: value }));
        pamSay(
          "Wonderful. Pick a stretch of dates the family can travel to — softer mid-week dates carry a best-price discount, while prime weekends fill up fast.",
        );
        setStep("dates");
      } else if (step === "dates") {
        setBooking((b) => ({ ...b, dates: value }));
        // Show the personalizing loader for ~1.6s before the spaces panel
        // appears, so it reads as Allie actively curating against the
        // logistics the planner just captured (guests · dates · style).
        setStep("personalizing");
        setTimeout(() => {
          pamSay(
            "Noted. Here are the spaces I'd recommend at Nobu Hotel Los Cabos — each one designed to keep multi-generational groups together while giving every side room to breathe.",
          );
          setStep("venue");
        }, 1700);
      } else if (step === "venue") {
        setBooking((b) => ({ ...b, venue: value }));
        pamSay(
          "A beautiful choice for the family. Now for the food — here are the dining styles that work best for multi-generational gatherings across Nobu Hotel Los Cabos.",
        );
        setStep("fnb");
        bumpReachable(3);
      } else if (step === "fnb") {
        setBooking((b) => ({ ...b, fnb: value }));
        pamSay("Perfect. Who's coordinating the family side — whose name should I put on the proposal?");
        setStep("name");
        bumpReachable(4);
      } else if (step === "name") {
        setBooking((b) => ({ ...b, name: value }));
        pamSay(
          `Thank you, ${value.split(" ")[0]}. Your family-gathering estimate is ready — drop your email to see the full breakdown and hold the dates.`,
        );
        setEstimateOpen(true);
      } else if (step === "email") {
        const finalBooking = { ...booking, email: value };
        setBooking(finalBooking);
        pamSay(
          `Wonderful, ${finalBooking.name?.split(" ")[0] || "thank you"} — here's your shortlist. Place a fully-refundable date hold to lock in the weekend while we coordinate with the family.`,
        );
        setStep("summary");
      }
    }, 400);
  };

  const submitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleAnswer(input.trim());
  };

  const activeStepNum = NOTEBOOK_FOR_STEP[step];

  const progressSteps = STEP_ORDER;
  const currentIdx = Math.max(0, progressSteps.indexOf(step));
  const progress = Math.round(
    (currentIdx / (progressSteps.length - 1)) * 100,
  );

  const sendFreeText = () => {
    const v = freeText.trim();
    if (!v) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: v },
      {
        role: "allie",
        text:
          "Noted — I'll add that to the family brief. Keep using the options below, or keep typing.",
      },
    ]);
    setFreeText("");
  };

  const inlineInputPlaceholder =
    step === "dates"
      ? "e.g. June 14 or late September"
      : step === "email"
        ? "you@email.com"
        : "Family lead's name";

  // ── Notebook actions ───────────────────────────────────────────
  const navigateToStep = (n: NotebookStepNum) => {
    if (confirmed) return;
    const target = FIRST_STEP_FOR_NOTEBOOK[n];
    setStep(target);
    setMessages((m) => [
      ...m,
      {
        role: "allie",
        text: `Jumping to ${NOTEBOOK_STEPS[n - 1].title.toLowerCase()} — pick up exactly where you left off.`,
      },
    ]);
  };

  const handleSave = () => {
    setSaveOpen(true);
  };

  const handleStartOver = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setBooking({});
    setStep("eventType");
    setMaxReachable(1);
    setConfirmed(false);
    setMessages([
      {
        role: "allie",
        text: "Starting fresh — what's bringing the family together?",
        chips: eventOptions,
      },
    ]);
  };

  // ── Header ─────────────────────────────────────────────────────
  // Matches pam-brides /chat: copper "SOCIAL EVENTS · NOBU HOTELS" band
  // above an ink brand bar with the official Nobu wordmark on the left.
  const header = (
    <header className="sticky top-0 z-40 shrink-0 bg-ink text-paper">
      <div className="w-full bg-sunset-gradient text-paper text-center text-[10px] md:text-[11px] tracking-[0.4em] py-1.5 font-sans font-semibold uppercase">
        Social Events · Nobu Hotels
      </div>
      <div className="flex h-14 items-center justify-between px-4 md:h-[60px] md:px-6 border-b border-border-subtle/20">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            aria-label="Back to home"
            className="flex h-9 w-9 items-center justify-center rounded-pill border border-paper/25 text-paper hover:bg-paper/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="flex h-[32px] items-center"
            aria-label="Nobu Hotel Los Cabos"
          >
            <img
              src={nobuLogo}
              alt="Nobu Hotel Los Cabos"
              className="h-[26px] md:h-[30px] w-auto object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-paper/70 font-sans">
            <span>{progress}%</span>
            <div className="h-1 w-32 overflow-hidden rounded-full bg-paper/15">
              <div
                className="h-full bg-copper transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <Link
            to={user ? "/account" : "/auth"}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 text-paper text-sm font-sans hover:text-copper-soft transition-colors"
            aria-label={user ? "Account" : "Sign in"}
          >
            <UserIcon className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center text-paper hover:text-copper-soft transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  );

  // ── Chat body ──────────────────────────────────────────────────
  // The active composer flows inline at the foot of the thread, aligned
  // beneath Allie's bubble — mirroring the V1.1 Plan-with-Allie layout so
  // the conversation reads as one continuous scroll.
  const composer = (() => {
    if (confirmed) return null;
    switch (step) {
      case "eventType":
        return (
          <div className="flex flex-wrap gap-2">
            {eventOptions.map((c) => (
              <button
                key={c}
                onClick={() => handleAnswer(c)}
                className="inline-flex items-center rounded-pill border border-border-default bg-paper px-4 py-2 font-sans text-sm text-ink transition-colors hover:border-copper hover:bg-copper hover:text-paper"
              >
                {c}
              </button>
            ))}
          </div>
        );
      case "guests":
        return (
          <GuestsPicker
            eventType={booking.eventType}
            onConfirm={(label) => handleAnswer(label)}
          />
        );
      case "dates":
        return <DateCalendar onSelect={(label) => handleAnswer(label)} />;
      case "personalizing":
        return (
          <PersonalizingLoader
            guests={booking.guests}
            dates={booking.dates}
            eventType={booking.eventType}
          />
        );
      case "venue":
        return <SpaceGallery onSelect={(name) => handleAnswer(name)} />;
      case "fnb":
        return <FnbGallery onSelect={(name) => handleAnswer(name)} />;
      case "name":
      case "email":
        return (
          <form onSubmit={submitText} className="flex items-center gap-2">
            <div className="flex flex-1 items-center rounded-pill border border-border-default bg-paper px-4 py-2.5 focus-within:border-ink">
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inlineInputPlaceholder}
                type={step === "email" ? "email" : "text"}
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-11 w-11 flex-none items-center justify-center rounded-pill bg-ink text-paper transition-colors hover:bg-ink-soft disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        );
      default:
        return null;
    }
  })();

  const conversation = (
    <div className="flex h-full min-h-0 flex-col bg-canvas">
      {/* Allie pill — sticky meta strip above the thread */}
      <div className="shrink-0 border-b border-border-subtle bg-paper/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3 md:px-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-pill bg-ink text-copper-soft">
            <CalendarHeart className="h-4 w-4" strokeWidth={1.6} />
          </div>
          <div className="leading-tight">
            <div className="font-sans text-sm font-semibold text-ink">Allie</div>
            <div className="text-[10px] font-sans uppercase tracking-[0.25em] text-copper">
              Nobu · Events Concierge
            </div>
          </div>
          <div className="ml-auto inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-ink-muted font-sans md:hidden">
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 md:px-8 md:py-10">
          {!confirmed &&
            messages.map((m, i) => (
              <Bubble key={i} role={m.role}>
                <p>{m.text}</p>
              </Bubble>
            ))}

          {step === "summary" && !confirmed && (
            <div className="md:pl-[52px]">
              <ProposalSummary
                booking={booking}
                onHold={() => setDepositOpen(true)}
              />
            </div>
          )}

          {confirmed && <Confirmed booking={booking} />}

          {/* Active composer flows inline beneath Allie's latest message. */}
          {composer && <div className="md:pl-[52px]">{composer}</div>}

          {/* Trail keeps room below the latest bubble so the pin works. */}
          <div data-chat-scroll-trail />
        </div>
      </div>

      {/* Always-on free-text composer pinned to the foot of the thread */}
      {!confirmed && (
        <div className="z-10 shrink-0 border-t border-border-subtle bg-canvas/95 px-4 py-4 backdrop-blur md:px-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendFreeText();
            }}
            className="mx-auto flex w-full max-w-3xl items-center gap-2.5 rounded-pill border border-border-default bg-paper px-1.5 py-1 shadow-rcd-sm focus-within:border-ink"
          >
            <button
              type="button"
              className="flex h-11 w-11 flex-none items-center justify-center rounded-pill text-ink-muted transition-colors hover:text-ink"
              aria-label="Attach"
            >
              <Plus className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <input
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="Type a message to Allie…"
              className="min-w-0 flex-1 bg-transparent px-1 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            />
            <button
              type="submit"
              disabled={!freeText.trim()}
              className="flex h-9 w-9 flex-none items-center justify-center rounded-pill bg-ink text-paper transition-colors hover:bg-ink-soft disabled:opacity-30"
              aria-label="Send"
            >
              <ArrowUp className="h-4 w-4" strokeWidth={1.6} />
            </button>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <>
      <PlanningChatShell
        header={header}
        activeStep={confirmed ? undefined : activeStepNum}
        maxReachable={maxReachable}
        onNavigate={navigateToStep}
        onSave={handleSave}
        onStartOver={handleStartOver}
      >
        {conversation}
      </PlanningChatShell>

      <SaveProgressSheet open={saveOpen} onClose={() => setSaveOpen(false)} />
      <DepositModal
        open={depositOpen}
        onOpenChange={setDepositOpen}
        booking={booking}
      />
      <EstimateModal
        open={estimateOpen}
        onOpenChange={setEstimateOpen}
        booking={booking}
        onSubmit={(d) => setBooking((b) => ({ ...b, ...d }))}
      />
    </>
  );
};

export default Chat;

/* ─────────────────────── pieces ─────────────────────── */

function Bubble({
  role,
  children,
}: {
  role: "allie" | "user";
  children: React.ReactNode;
}) {
  if (role === "allie") {
    return (
      <div
        data-chat-role="allie"
        className="flex w-full items-start gap-3 animate-bubble-in"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-ink text-copper-soft shadow-rcd-sm">
          <CalendarHeart className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="inline-block max-w-[88%] rounded-tr-xl rounded-br-xl rounded-bl-xl bg-paper px-5 py-4 font-sans text-[16px] leading-6 text-ink shadow-rcd-sm">
            {children}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div data-chat-role="user" className="flex justify-end animate-bubble-in">
      <div className="max-w-[80%] rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-ink px-5 py-4 font-sans text-[16px] leading-6 text-paper">
        {children}
      </div>
    </div>
  );
}

function ProposalSummary({
  booking,
  onHold,
}: {
  booking: Booking;
  onHold: () => void;
}) {
  return (
    <div
      data-chat-role="allie"
      className="rounded-xl border border-border-default bg-paper p-6 shadow-rcd-sm"
    >
      <p className="eyebrow mb-4">Your Proposal</p>
      <dl className="space-y-2.5 font-sans text-sm">
        {[
          ["Celebration", booking.eventType],
          ["Guests", booking.guests],
          ["Dates", booking.dates],
          ["Venue", booking.venue],
          ["F&B", booking.fnb],
          ["Name", booking.name],
          ["Email", booking.email],
        ].map(([k, v]) => (
          <div
            key={k}
            className="flex justify-between gap-4 border-b border-border-subtle pb-2.5"
          >
            <dt className="text-ink-muted">{k}</dt>
            <dd className="text-right text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <button
        onClick={onHold}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-pill bg-copper px-5 py-3 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-colors hover:bg-copper-hover"
      >
        Hold the Date · Refundable Deposit
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
      <p className="mt-3 text-center font-sans text-[11px] text-ink-muted">
        $250 refundable hold · 72 hours to confirm · no commitment
      </p>
    </div>
  );
}

function Confirmed({ booking }: { booking: Booking }) {
  return (
    <div
      data-chat-role="allie"
      className="rounded-xl border border-border-default bg-paper p-8 text-center shadow-rcd-sm"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-pill bg-copper">
        <Check className="h-7 w-7 text-paper" strokeWidth={2.5} />
      </div>
      <p className="eyebrow mt-6">Payment Confirmed</p>
      <h2 className="mt-2 font-title text-3xl text-ink">Your date is held.</h2>
      <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-ink-soft">
        Thank you{booking.name ? `, ${booking.name.split(" ")[0]}` : ""}. Your
        refundable $250 deposit was processed by Worldpay. A receipt and
        confirmation have been sent to{" "}
        <span className="text-ink">{booking.email}</span>. Your Nobu event
        specialist will reach out within 24 hours.
      </p>
      <div className="mx-auto mt-6 max-w-md border border-border-subtle bg-cream-soft p-5 text-left rounded-xl">
        <p className="eyebrow mb-3">Reservation</p>
        <dl className="space-y-2 font-sans text-sm">
          {[
            [
              "Confirmation",
              `NOBU-${Math.floor(100000 + Math.random() * 900000)}`,
            ],
            ["Celebration", booking.eventType],
            ["Dates", booking.dates],
            ["Venue", booking.venue],
            ["Deposit", "USD $250.00"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between gap-4 border-b border-border-subtle pb-1.5"
            >
              <dt className="text-ink-muted">{k}</dt>
              <dd className="text-right text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-pill bg-ink px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-colors hover:bg-ink-soft"
      >
        Back to Nobu
      </Link>
    </div>
  );
}

// Guest-count personalization — each event type Nobu books has a
// distinct typical headcount and a tailored set of brackets. Tapping a
// bracket confirms the range label as the answer; planners who know an
// exact count can expand the custom counter below.
type GuestProfileTier = {
  id: string;
  title: string;
  range: string;
  blurb: string;
  isTypical?: boolean;
};

type GuestProfile = {
  /** The event-type word used in the personalization hint copy. */
  label: string;
  /** Typical headcount Nobu books for this kind of event. */
  typical: number;
  /** Brackets shown in the picker, tailored to the event size. */
  tiers: GuestProfileTier[];
};

const DEFAULT_GUEST_PROFILE: GuestProfile = {
  label: "celebration",
  typical: 90,
  tiers: [
    {
      id: "intimate",
      title: "Intimate gathering",
      range: "Up to 24 guests",
      blurb: "Private dinners, milestone toasts, family-only moments.",
    },
    {
      id: "small",
      title: "Small celebration",
      range: "25 – 60 guests",
      blurb: "Bachelorettes, birthday weekends, baby showers.",
    },
    {
      id: "mid",
      title: "Mid-size celebration",
      range: "60 – 120 guests",
      blurb: "Holiday gatherings, milestone birthdays, family reunions.",
      isTypical: true,
    },
    {
      id: "big",
      title: "Big celebration",
      range: "120 – 400+ guests",
      blurb: "Multi-day weekends, anniversaries, full-resort takeovers.",
    },
  ],
};

const EVENT_GUEST_PROFILES: Record<string, GuestProfile> = {
  "bachelor party": {
    label: "bachelor party",
    typical: 12,
    tiers: [
      {
        id: "inner",
        title: "Inner circle",
        range: "6 – 12 guests",
        blurb: "Best men, brothers, ride-or-dies.",
        isTypical: true,
      },
      {
        id: "crew",
        title: "Full crew",
        range: "12 – 24 guests",
        blurb: "Wider friend group, cousins, college roommates.",
      },
      {
        id: "blowout",
        title: "Blowout weekend",
        range: "24 – 50 guests",
        blurb: "Multi-day, multi-activity send-off.",
      },
    ],
  },
  "bachelorette party": {
    label: "bachelorette party",
    typical: 14,
    tiers: [
      {
        id: "core",
        title: "Closest friends",
        range: "8 – 14 guests",
        blurb: "Bridesmaids, sisters, the inner circle.",
        isTypical: true,
      },
      {
        id: "crew",
        title: "Full bridal party",
        range: "14 – 28 guests",
        blurb: "Wider friend group, cousins, in-laws-to-be.",
      },
      {
        id: "blowout",
        title: "Long weekend",
        range: "28 – 60 guests",
        blurb: "Multi-night with extended friends and family.",
      },
    ],
  },
  "family reunion": {
    label: "family reunion",
    typical: 30,
    tiers: [
      {
        id: "immediate",
        title: "Immediate family",
        range: "10 – 20 guests",
        blurb: "Parents, siblings, kids only.",
      },
      {
        id: "extended",
        title: "Extended family",
        range: "20 – 40 guests",
        blurb: "Cousins, aunts, uncles — the usual table.",
        isTypical: true,
      },
      {
        id: "full",
        title: "Full family tree",
        range: "40 – 80 guests",
        blurb: "Multi-generational, multi-branch.",
      },
      {
        id: "epic",
        title: "Multi-generational takeover",
        range: "80+ guests",
        blurb: "Full-resort buyout for the whole tree.",
      },
    ],
  },
  "holiday gathering": {
    label: "holiday gathering",
    typical: 22,
    tiers: [
      {
        id: "immediate",
        title: "Immediate family",
        range: "8 – 16 guests",
        blurb: "Parents, kids, partners — the inner circle around one table.",
      },
      {
        id: "extended",
        title: "Extended family",
        range: "16 – 40 guests",
        blurb: "Grandparents, cousins, in-laws — the full holiday table.",
        isTypical: true,
      },
      {
        id: "branches",
        title: "All the branches",
        range: "40 – 80 guests",
        blurb: "Multi-generational, multi-household holiday weekend.",
      },
    ],
  },
  "birthday weekend": {
    label: "birthday weekend",
    typical: 60,
    tiers: [
      {
        id: "intimate",
        title: "Closest friends",
        range: "10 – 30 guests",
        blurb: "Inner circle, immediate family, a weekend at the resort.",
      },
      {
        id: "standard",
        title: "Standard birthday weekend",
        range: "30 – 80 guests",
        blurb: "Friends, family, plus-ones — three days, one venue.",
        isTypical: true,
      },
      {
        id: "big",
        title: "Big bash",
        range: "80 – 200 guests",
        blurb: "Black-tie milestone with the full friend circle.",
      },
    ],
  },
  birthday: {
    label: "birthday",
    typical: 30,
    tiers: [
      {
        id: "dinner",
        title: "Birthday dinner",
        range: "8 – 20 guests",
        blurb: "Private dining room or chef's table — just the inner circle.",
      },
      {
        id: "party",
        title: "Birthday party",
        range: "20 – 60 guests",
        blurb: "Friends, family, plus-ones at a single venue.",
        isTypical: true,
      },
      {
        id: "weekend",
        title: "Birthday weekend",
        range: "60 – 200 guests",
        blurb: "Multi-day flow with the full circle.",
      },
    ],
  },
  anniversary: {
    label: "anniversary",
    typical: 24,
    tiers: [
      {
        id: "couple",
        title: "Just us",
        range: "2 – 8 guests",
        blurb: "Romantic dinner, milestone toast.",
      },
      {
        id: "intimate",
        title: "Intimate anniversary",
        range: "10 – 40 guests",
        blurb: "Closest friends and family in a garden setting.",
        isTypical: true,
      },
      {
        id: "big",
        title: "Big anniversary",
        range: "40 – 120 guests",
        blurb: "Full-scale, multi-course dinner with dancing.",
      },
    ],
  },
  engagement: {
    label: "engagement party",
    typical: 40,
    tiers: [
      {
        id: "intimate",
        title: "Close family",
        range: "10 – 25 guests",
        blurb: "Both families' inner circles meeting.",
      },
      {
        id: "party",
        title: "Engagement party",
        range: "25 – 75 guests",
        blurb: "Friends and family — dinner-and-cocktails format.",
        isTypical: true,
      },
      {
        id: "big",
        title: "Engagement celebration",
        range: "75 – 200 guests",
        blurb: "Black-tie celebration with everyone you know.",
      },
    ],
  },
  "baby shower": {
    label: "baby shower",
    typical: 25,
    tiers: [
      {
        id: "intimate",
        title: "Closest friends",
        range: "8 – 20 guests",
        blurb: "Family, godparents, inner-circle moms.",
      },
      {
        id: "standard",
        title: "Standard shower",
        range: "20 – 50 guests",
        blurb: "Friends, family, the wider circle.",
        isTypical: true,
      },
      {
        id: "couples",
        title: "Couples shower",
        range: "50 – 100 guests",
        blurb: "Both partners' friend groups and extended family.",
      },
    ],
  },
  "private dinner": {
    label: "private dinner",
    typical: 14,
    tiers: [
      {
        id: "chef",
        title: "Chef's table",
        range: "6 – 14 guests",
        blurb: "Counter-style tasting with the head chef.",
        isTypical: true,
      },
      {
        id: "room",
        title: "Private dining room",
        range: "14 – 30 guests",
        blurb: "Tasting menu in a private room.",
      },
      {
        id: "buyout",
        title: "Restaurant buyout",
        range: "30 – 80 guests",
        blurb: "Exclusive use of a Nobu restaurant.",
      },
    ],
  },
};

function getGuestProfile(eventType?: string): GuestProfile {
  if (!eventType) return DEFAULT_GUEST_PROFILE;
  const norm = eventType.toLowerCase().trim();
  if (EVENT_GUEST_PROFILES[norm]) return EVENT_GUEST_PROFILES[norm];
  // Substring match — handles variants like "Bachelor/Bachelorette Parties",
  // "Holiday Party 2026", etc.
  for (const [key, profile] of Object.entries(EVENT_GUEST_PROFILES)) {
    if (norm.includes(key) || key.includes(norm)) return profile;
  }
  return DEFAULT_GUEST_PROFILE;
}

function GuestsPicker({
  eventType,
  onConfirm,
}: {
  eventType?: string;
  onConfirm: (label: string) => void;
}) {
  const [customOpen, setCustomOpen] = useState(false);
  const [count, setCount] = useState(60);
  const profile = useMemo(() => getGuestProfile(eventType), [eventType]);
  const isPersonalized = profile !== DEFAULT_GUEST_PROFILE;
  return (
    <div className="flex flex-col gap-2">
      {isPersonalized && (
        <div className="rounded-xl border border-copper/30 bg-copper/[0.06] px-4 py-3">
          <p className="font-sans text-xs leading-5 text-ink-soft">
            A typical {profile.label} at Nobu runs around{" "}
            <span className="font-semibold text-ink">
              {profile.typical} guests
            </span>
            . Tap the bracket that matches yours.
          </p>
        </div>
      )}
      {profile.tiers.map((tier) => (
        <button
          key={tier.id}
          type="button"
          onClick={() => onConfirm(tier.range)}
          className={`group flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
            tier.isTypical
              ? "border-copper bg-cream-soft hover:bg-cream"
              : "border-border-default bg-paper hover:border-copper hover:bg-cream-soft"
          }`}
        >
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-sans text-sm font-semibold text-ink">
                {tier.title}
              </p>
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-copper">
                {tier.range}
              </span>
              {tier.isTypical && (
                <span className="rounded-pill bg-copper px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-paper">
                  {isPersonalized ? "Typical" : "Most booked"}
                </span>
              )}
            </div>
            <p className="font-sans text-xs leading-4 text-ink-muted">
              {tier.blurb}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 flex-none text-ink-muted transition-colors group-hover:text-copper" />
        </button>
      ))}

      {!customOpen ? (
        <button
          type="button"
          onClick={() => setCustomOpen(true)}
          className="self-start pt-1 font-sans text-xs font-medium uppercase tracking-[0.18em] text-ink-muted underline underline-offset-4 hover:text-ink"
        >
          Or enter a specific number
        </button>
      ) : (
        <div className="mt-1 flex flex-col gap-4 rounded-xl border border-border-default bg-paper px-5 py-4">
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={500}
              value={count}
              onChange={(e) =>
                setCount(
                  Math.max(1, Math.min(500, Number(e.target.value) || 0)),
                )
              }
              className="w-20 rounded-md border border-border-default bg-paper px-2 py-1.5 text-center text-base font-medium text-ink focus:border-ink focus:outline-none"
            />
            <div className="font-sans text-sm text-ink-muted">attendees</div>
          </div>
          <Slider
            value={[count]}
            min={1}
            max={500}
            step={1}
            onValueChange={(v) => setCount(v[0])}
          />
          <div className="flex justify-end">
            <button
              onClick={() => onConfirm(`${count} guests`)}
              className="inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-colors hover:bg-ink-soft"
            >
              Confirm <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
