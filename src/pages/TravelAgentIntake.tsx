import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Plus, Send, CalendarHeart } from "lucide-react";
import nobuLogo from "@/assets/logo-nobu-white.png";
import { DateCalendar } from "@/components/nobu/DateCalendar";
import { SpaceGallery } from "@/components/nobu/SpaceGallery";
import { FnbGallery } from "@/components/nobu/FnbGallery";
import { Slider } from "@/components/ui/slider";
import { getAgentClient } from "@/lib/travelAgentData";

type Msg = { role: "allie" | "user"; text: string; chips?: string[] };

type Step =
  | "intro"
  | "eventType"
  | "guests"
  | "dates"
  | "venue"
  | "fnb"
  | "rooms"
  | "clientName"
  | "clientEmail"
  | "summary"
  | "done";

const eventOptions = [
  "Birthday",
  "Anniversary",
  "Engagement",
  "Baby Shower",
  "Bachelor Party",
  "Bachelorette Party",
  "Family Reunion",
  "Holiday Party",
  "Private Dinner",
  "Other",
];

type Intake = {
  eventType?: string;
  guests?: string;
  dates?: string;
  venue?: string;
  fnb?: string;
  rooms?: string;
  clientName?: string;
  clientEmail?: string;
};

const PHASES = [
  { label: "Celebration", time: "1 MIN", blurb: "The event your client is shaping." },
  { label: "Logistics", time: "2 MIN", blurb: "Guests, dates and preferred venue." },
  { label: "Experience", time: "1 MIN", blurb: "Dining style and signature touches." },
  { label: "Stay", time: "1 MIN", blurb: "Room block for the travelling party." },
  { label: "Client", time: "1 MIN", blurb: "Your client's contact for the proposal." },
  { label: "Submit RFP", time: "1 MIN", blurb: "Send to Nobu events for review." },
];

const PHASE_FOR_STEP: Record<Step, number> = {
  intro: 0,
  eventType: 0,
  guests: 1,
  dates: 1,
  venue: 1,
  fnb: 2,
  rooms: 3,
  clientName: 4,
  clientEmail: 4,
  summary: 5,
  done: 5,
};

const AGENT_NAME = "Steve";

const TravelAgentIntake = () => {
  const { id } = useParams<{ id: string }>();
  const existing = id ? getAgentClient(id) : undefined;

  const [messages, setMessages] = useState<Msg[]>([]);
  const [step, setStep] = useState<Step>("intro");
  const [intake, setIntake] = useState<Intake>({});
  const [input, setInput] = useState("");
  const [freeText, setFreeText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const greet = existing
        ? `Hello, ${AGENT_NAME} — I'm Allie, your Nobu event concierge. I'm here to help you plan the perfect celebration for ${existing.clientName} in under 4 minutes.`
        : `Hello, ${AGENT_NAME} — I'm Allie, your Nobu event concierge. I'm here to help you plan the perfect celebration for your client in under 4 minutes.`;
      setMessages([
        { role: "allie", text: greet },
        { role: "allie", text: "What is your client celebrating?", chips: eventOptions },
      ]);
      setStep("eventType");
    }, 250);
    return () => clearTimeout(t);
  }, [existing]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }), 120);
    });
  }, [messages, step]);

  const pamSay = (text: string, chips?: string[]) =>
    setMessages((m) => [...m, { role: "allie", text, chips }]);

  const handleAnswer = (value: string) => {
    setMessages((m) => [...m, { role: "user", text: value }]);
    setInput("");
    setTimeout(() => {
      if (step === "eventType") {
        setIntake((b) => ({ ...b, eventType: value }));
        pamSay(`Lovely — a ${value.toLowerCase()} at Nobu. How many guests is your client expecting?`);
        setStep("guests");
      } else if (step === "guests") {
        setIntake((b) => ({ ...b, guests: value }));
        pamSay(
          "Got it. Pick a target date for your client's event — mid-week dates carry preferred trade rates, and prime weekends move fast.",
        );
        setStep("dates");
      } else if (step === "dates") {
        setIntake((b) => ({ ...b, dates: value }));
        pamSay("Great. Here are the spaces I'd suggest for your client — sized to the guest count and event style.");
        setStep("venue");
      } else if (step === "venue") {
        setIntake((b) => ({ ...b, venue: value }));
        pamSay("Noted. Now the menu — pick a dining style your client would love across Nobu Los Cabos.");
        setStep("fnb");
      } else if (step === "fnb") {
        setIntake((b) => ({ ...b, fnb: value }));
        pamSay("Got it. Would you like me to hold a room block for your client's travelling party?");
        setStep("rooms");
      } else if (step === "rooms") {
        setIntake((b) => ({ ...b, rooms: value }));
        pamSay("Logged. Which client should I put on the proposal?");
        setStep("clientName");
      } else if (step === "clientName") {
        setIntake((b) => ({ ...b, clientName: value }));
        pamSay(`Perfect — ${value} on the proposal. What's the best email to reach them?`);
        setStep("clientEmail");
      } else if (step === "clientEmail") {
        setIntake((b) => ({ ...b, clientEmail: value }));
        pamSay(`All set, ${AGENT_NAME} — here's the brief I'll route to the Nobu events team on your client's behalf.`);
        setStep("summary");
      }
    }, 400);
  };

  const submitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleAnswer(input.trim());
  };

  const sendFreeText = () => {
    const v = freeText.trim();
    if (!v) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: v },
      { role: "allie", text: "Noted — I'll attach that to the brief. Feel free to keep using the options below." },
    ]);
    setFreeText("");
  };

  const progressSteps: Step[] = [
    "eventType",
    "guests",
    "dates",
    "venue",
    "fnb",
    "rooms",
    "clientName",
    "clientEmail",
    "summary",
  ];
  const currentIdx = Math.max(0, progressSteps.indexOf(step));
  const progress = Math.round((currentIdx / (progressSteps.length - 1)) * 100);
  const phaseIdx = submitted ? PHASES.length - 1 : PHASE_FOR_STEP[step] ?? 0;
  const splitPanelSteps: Step[] = ["dates", "venue", "fnb"];
  const hasSplitPanel = !submitted && splitPanelSteps.includes(step);

  const inlinePlaceholder =
    step === "clientEmail"
      ? "client@email.com"
      : step === "clientName"
        ? "Client full name"
        : "Type a reply";

  return (
    <div className="flex h-screen flex-col bg-canvas text-ink">
      {/* Top ribbon + header */}
      <div className="w-full bg-sunset-gradient text-paper text-center text-[11px] tracking-[0.4em] py-1.5 font-sans font-semibold uppercase">
        Social Events · Travel Agent
      </div>
      <header className="bg-black">
        <div className="container flex items-center justify-between py-6">
          <Link
            to="/travel-agent"
            className="flex h-[32px] items-center"
            aria-label="Nobu Hotel Los Cabos"
          >
            <img
              src={nobuLogo}
              alt="Nobu Hotel Los Cabos"
              className="h-[28px] w-auto object-contain"
            />
          </Link>
          <Link
            to="/travel-agent"
            className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Roster
          </Link>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Left sidebar */}
        <aside className="hidden w-[340px] flex-none flex-col border-r border-border-subtle bg-cream-soft lg:flex">
          <div className="flex h-[88px] flex-col justify-center border-b border-border-subtle bg-cream px-7">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Step {phaseIdx + 1} of {PHASES.length} · {PHASES[phaseIdx].label}
            </div>
            <div className="mt-1 font-serif text-2xl">Client Brief</div>
          </div>
          <div className="px-7 py-5 text-xs leading-relaxed text-muted-foreground">
            Allie captures the brief from your client and assembles a proposal-ready RFP — together, in under 5 minutes.
          </div>
          <ol className="flex-1 overflow-y-auto px-4 pb-6">
            {PHASES.map((p, i) => {
              const state = i < phaseIdx ? "done" : i === phaseIdx ? "active" : "todo";
              return (
                <li
                  key={p.label}
                  className={`rounded-sm px-3 py-3 ${state === "active" ? "bg-accent/20" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-medium ${
                        state === "done" || state === "active"
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-muted-foreground"
                      }`}
                    >
                      {state === "done" ? <Check className="h-3 w-3" /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`flex items-center justify-between text-sm ${
                          state === "todo" ? "text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        <span className="font-medium">{p.label}</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {p.time}
                        </span>
                      </div>
                      <div
                        className={`mt-1 text-xs leading-relaxed ${
                          state === "todo" ? "text-muted-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {p.blurb}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="flex items-center justify-between border-t border-border px-7 py-4">
            <Link
              to="/travel-agent"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
            <button
              onClick={() => {
                setIntake({});
                setStep("eventType");
                setSubmitted(false);
                setMessages([
                  { role: "allie", text: "Starting fresh — what is your client celebrating?", chips: eventOptions },
                ]);
              }}
              className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              Start over
            </button>
          </div>
        </aside>

        {/* Right pane */}
        <main className="flex min-w-0 flex-1 flex-col bg-canvas">
          <header className="sticky top-0 z-20 flex flex-none flex-col border-b border-border bg-white/95 backdrop-blur">
            <div className="flex h-[68px] items-center justify-between px-4 md:h-[88px] md:px-10">
              <div className="flex items-center gap-3">
                <Link
                  to="/travel-agent"
                  aria-label="Back"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground lg:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CalendarHeart className="h-4 w-4 text-accent" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-medium md:text-base">Allie</div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-accent">
                    Nobu · Trade Concierge
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                <div className="h-1 w-20 overflow-hidden rounded-full bg-secondary md:w-32">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="hidden sm:inline">{progress}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border bg-secondary/40 px-4 py-2 text-[10px] uppercase tracking-[0.25em] lg:hidden">
              <span className="text-muted-foreground">
                Step {phaseIdx + 1} / {PHASES.length}
              </span>
              <span className="truncate font-medium text-foreground">
                {PHASES[phaseIdx].label}
              </span>
              <span className="text-accent">{PHASES[phaseIdx].time}</span>
            </div>
          </header>

          {/* Messages */}
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 md:px-10 md:py-12">
              {!submitted &&
                messages.map((m, i) => (
                  <Bubble key={i} role={m.role}>
                    <p>{m.text}</p>
                  </Bubble>
                ))}

              {step === "summary" && !submitted && (
                <div className="rounded-sm border border-border bg-secondary/40 p-6">
                  <p className="eyebrow mb-4">Client RFP brief</p>
                  <dl className="space-y-2.5 text-sm">
                    {[
                      ["Celebration", intake.eventType],
                      ["Guests", intake.guests],
                      ["Dates", intake.dates],
                      ["Venue", intake.venue],
                      ["F&B", intake.fnb],
                      ["Room block", intake.rooms],
                      ["Client", intake.clientName],
                      ["Client email", intake.clientEmail],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between gap-4 border-b border-border/60 pb-2.5"
                      >
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <button
                    onClick={() => setSubmitted(true)}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-accent-foreground transition hover:bg-accent/90"
                  >
                    Submit RFP to Nobu Events
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <p className="mt-3 text-center text-[11px] text-muted-foreground">
                    The events team responds within 4 business hours · IATA commission applied automatically
                  </p>
                </div>
              )}

              {submitted && (
                <div className="rounded-sm border border-border bg-secondary/40 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                    <Check className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <p className="eyebrow mt-6">RFP Submitted</p>
                  <h2 className="mt-2 font-serif text-3xl">Brief sent to Nobu Events.</h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Your brief for <span className="text-foreground">{intake.clientName}</span> is in
                    the events team's queue. You'll see status updates back on the roster.
                  </p>
                  <Link
                    to="/travel-agent"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-primary/90"
                  >
                    Back to roster
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Composer */}
          {!submitted && (
            <div className="z-10 flex flex-none flex-col border-t border-border bg-white/95 backdrop-blur">
              <div
                className={`mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 pt-3 sm:px-6 sm:pt-4 md:px-10 md:pt-6 ${
                  hasSplitPanel
                    ? "max-h-[calc((100dvh-104px)/2)] min-h-0 flex-1 overflow-y-auto overscroll-contain pb-3 sm:pb-4 md:pb-6 lg:max-h-[calc((100dvh-88px)/2)]"
                    : "max-h-[55dvh] overflow-y-auto pb-3 sm:pb-4 md:pb-6"
                }`}
              >
                {(() => {
                  const lastChips = [...messages].reverse().find((m) => m.chips)?.chips;
                  const showChips = lastChips && step === "eventType";
                  if (!showChips) return null;
                  return (
                    <div className="flex flex-wrap gap-2">
                      {lastChips!.map((c) => (
                        <button
                          key={c}
                          onClick={() => handleAnswer(c)}
                          className="inline-flex items-center rounded-full border border-border bg-white px-4 py-2 text-sm text-foreground transition hover:border-accent hover:bg-accent hover:text-accent-foreground"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  );
                })()}

                {step === "guests" && (
                  <GuestsSlider onConfirm={(label) => handleAnswer(label)} />
                )}

                {step === "dates" && (
                  <DateCalendar onSelect={(label) => handleAnswer(label)} />
                )}

                {step === "venue" && (
                  <SpaceGallery onSelect={(name) => handleAnswer(name)} />
                )}

                {step === "fnb" && (
                  <FnbGallery onSelect={(name) => handleAnswer(name)} />
                )}

                {step === "rooms" && (
                  <RoomBlockPicker onConfirm={(label) => handleAnswer(label)} />
                )}

                {(step === "clientName" || step === "clientEmail") && (
                  <form onSubmit={submitText} className="flex items-center gap-2">
                    <div className="flex flex-1 items-center rounded-full border border-border bg-white px-4 py-2 focus-within:border-accent">
                      <input
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={inlinePlaceholder}
                        type={step === "clientEmail" ? "email" : "text"}
                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/80 disabled:opacity-40"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>

              <div className="mx-auto w-full max-w-4xl flex-none px-4 pb-3 sm:px-6 sm:pb-4 md:px-10 md:pb-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendFreeText();
                  }}
                  className="flex items-center gap-3 rounded-full border border-border bg-white px-5 py-3 shadow-sm focus-within:border-accent"
                >
                  <Plus className="h-4 w-4 flex-none text-muted-foreground" />
                  <input
                    value={freeText}
                    onChange={(e) => setFreeText(e.target.value)}
                    placeholder="Type a message to Allie…"
                    className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!freeText.trim()}
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/80 disabled:opacity-30"
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

function Bubble({ role, children }: { role: "allie" | "user"; children: React.ReactNode }) {
  if (role === "allie") {
    return (
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground">
          <CalendarHeart className="h-3.5 w-3.5 text-accent" />
        </div>
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-[15px] leading-relaxed text-foreground shadow-sm">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-[15px] leading-relaxed text-primary-foreground">
        {children}
      </div>
    </div>
  );
}

function GuestsSlider({ onConfirm }: { onConfirm: (label: string) => void }) {
  const [count, setCount] = useState(50);
  const sizeLabel =
    count < 25 ? "Intimate gathering" : count < 75 ? "Small event" : count < 150 ? "Mid-size event" : "Large event";
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background px-5 py-4">
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={1}
          max={500}
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(500, Number(e.target.value) || 0)))}
          className="w-20 rounded-md border border-border bg-background px-2 py-1.5 text-center text-base font-medium text-foreground focus:border-accent focus:outline-none"
        />
        <div className="text-sm text-muted-foreground">
          attendees · <span className="text-foreground">{sizeLabel}</span>
        </div>
      </div>
      <Slider value={[count]} min={1} max={500} step={1} onValueChange={(v) => setCount(v[0])} />
      <div className="flex justify-end">
        <button
          onClick={() => onConfirm(`${count} guests`)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-primary/90"
        >
          Confirm <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function RoomBlockPicker({ onConfirm }: { onConfirm: (label: string) => void }) {
  const [rooms, setRooms] = useState(15);
  const [nights, setNights] = useState(3);
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background px-5 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Rooms</div>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={200}
              value={rooms}
              onChange={(e) => setRooms(Math.max(0, Math.min(200, Number(e.target.value) || 0)))}
              className="w-20 rounded-md border border-border bg-background px-2 py-1.5 text-center text-base font-medium text-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <Slider
            className="mt-3"
            value={[rooms]}
            min={0}
            max={100}
            step={1}
            onValueChange={(v) => setRooms(v[0])}
          />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Nights</div>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={14}
              value={nights}
              onChange={(e) => setNights(Math.max(1, Math.min(14, Number(e.target.value) || 0)))}
              className="w-20 rounded-md border border-border bg-background px-2 py-1.5 text-center text-base font-medium text-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <Slider
            className="mt-3"
            value={[nights]}
            min={1}
            max={14}
            step={1}
            onValueChange={(v) => setNights(v[0])}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => onConfirm("No room block needed")}
          className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
        >
          Skip room block
        </button>
        <button
          onClick={() => onConfirm(`${rooms} rooms · ${nights} nights`)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-primary/90"
        >
          Confirm <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default TravelAgentIntake;