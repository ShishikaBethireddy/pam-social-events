import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CalendarHeart } from "lucide-react";

type Msg = { role: "allie" | "user"; text: string; chips?: string[] };

type Step =
  | "intro"
  | "eventType"
  | "guests"
  | "dates"
  | "venue"
  | "fnb"
  | "name"
  | "email"
  | "summary"
  | "done";

const eventOptions = ["Birthday", "Anniversary", "Engagement", "Baby Shower", "Family Reunion", "Private Dinner", "Other"];
const guestOptions = ["10–25", "25–50", "50–100", "100+"];
const venueOptions = ["Private Dining Room", "Rooftop Terrace", "Poolside", "Grand Ballroom", "Not sure — surprise me"];
const fnbOptions = ["Omakase tasting", "Family-style", "Cocktail reception", "Brunch", "Chef recommends"];

type Booking = {
  eventType?: string;
  guests?: string;
  dates?: string;
  venue?: string;
  fnb?: string;
  name?: string;
  email?: string;
};

export const ChatConcierge = ({
  open,
  onOpenChange,
  onReserve,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onReserve: (b: Booking) => void;
}) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [step, setStep] = useState<Step>("intro");
  const [booking, setBooking] = useState<Booking>({});
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          { role: "allie", text: "Hello, I'm Allie — your Nobu event concierge. I'll help you shape the perfect celebration in about 4 minutes." },
          { role: "allie", text: "What are we celebrating?", chips: eventOptions },
        ]);
        setStep("eventType");
      }, 250);
    }
  }, [open, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const pamSay = (text: string, chips?: string[]) => {
    setMessages((m) => [...m, { role: "allie", text, chips }]);
  };

  const handleAnswer = (value: string) => {
    setMessages((m) => [...m, { role: "user", text: value }]);
    setInput("");

    setTimeout(() => {
      if (step === "eventType") {
        setBooking((b) => ({ ...b, eventType: value }));
        pamSay(`Beautiful — a ${value.toLowerCase()} at Nobu. How many guests are you expecting?`, guestOptions);
        setStep("guests");
      } else if (step === "guests") {
        setBooking((b) => ({ ...b, guests: value }));
        pamSay("Lovely. Do you have a date in mind, or a flexible window? (e.g. 'June 14' or 'late September')");
        setStep("dates");
      } else if (step === "dates") {
        setBooking((b) => ({ ...b, dates: value }));
        pamSay("Noted. Which kind of space feels right?", venueOptions);
        setStep("venue");
      } else if (step === "venue") {
        setBooking((b) => ({ ...b, venue: value }));
        pamSay("And the food & beverage style?", fnbOptions);
        setStep("fnb");
      } else if (step === "fnb") {
        setBooking((b) => ({ ...b, fnb: value }));
        pamSay("Perfect. What name should I put on the proposal?");
        setStep("name");
      } else if (step === "name") {
        setBooking((b) => ({ ...b, name: value }));
        pamSay("Thank you. And the best email for your specialist to follow up?");
        setStep("email");
      } else if (step === "email") {
        const finalBooking = { ...booking, email: value };
        setBooking(finalBooking);
        pamSay(
          `Wonderful, ${finalBooking.name?.split(" ")[0] || "thank you"} — here's your shortlist. Place a fully-refundable date hold to secure availability while we finalize.`,
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col bg-background">
        <SheetHeader className="px-6 py-5 border-b border-border bg-primary text-primary-foreground">
          <SheetTitle className="flex items-center gap-3 text-primary-foreground">
            <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center">
              <CalendarHeart className="h-4 w-4 text-accent-foreground" />
            </div>
            <div className="text-left">
              <div className="font-serif text-lg">Allie</div>
              <div className="text-[10px] tracking-[0.3em] uppercase opacity-70 font-sans font-normal">Nobu Event Concierge</div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[80%] bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-br-sm text-sm"
                    : "max-w-[85%] bg-secondary text-foreground px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed"
                }
              >
                <p>{m.text}</p>
                {m.chips && i === messages.length - 1 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.chips.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleAnswer(c)}
                        className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {step === "summary" && (
            <div className="bg-secondary/60 border border-border p-5 mt-2">
              <p className="eyebrow mb-3">Your Proposal</p>
              <dl className="space-y-2 text-sm">
                {[
                  ["Celebration", booking.eventType],
                  ["Guests", booking.guests],
                  ["Dates", booking.dates],
                  ["Venue", booking.venue],
                  ["F&B", booking.fnb],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <Button
                onClick={() => onReserve(booking)}
                className="mt-5 w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 h-11"
              >
                Hold the Date · Refundable Deposit
              </Button>
              <p className="text-[11px] text-muted-foreground mt-3 text-center">
                $250 refundable hold · 72 hours to confirm · no commitment
              </p>
            </div>
          )}
        </div>

        {(step === "dates" || step === "name" || step === "email") && (
          <form onSubmit={submitText} className="border-t border-border p-4 flex gap-2 bg-background">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                step === "dates" ? "e.g. June 14 or late September" : step === "email" ? "you@email.com" : "Your name"
              }
              type={step === "email" ? "email" : "text"}
              className="rounded-full"
              autoFocus
            />
            <Button type="submit" size="icon" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};