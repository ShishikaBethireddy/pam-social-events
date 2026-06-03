import { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Gem, CalendarCheck, MessageCircle, Phone, ArrowRight } from "lucide-react";

type SpecialistSheetProps = {
  open: boolean;
  onClose: () => void;
  onChat: () => void;
};

type Option = {
  key: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  sub: string;
  action?: () => void;
};

/**
 * Drop-in counterpart to pam-brides' SpecialistSheet — a "how would you
 * like to connect?" sidesheet that gives guests four ways to start a
 * conversation with the Nobu Social Events team:
 *
 *   1. Chat with Allie (instant, AI)
 *   2. Book a 30-min consultation with a human specialist
 *   3. WhatsApp the events desk
 *   4. Call the toll-free events line
 *
 * Triggered from the Nav, Hero secondary CTA, and ClosingCTA.
 */
export const SpecialistSheet = ({ open, onClose, onChat }: SpecialistSheetProps) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const options: Option[] = [
    {
      key: "chat",
      Icon: Gem,
      title: "Chat with Allie",
      sub: "Always on · instant answers from your AI concierge",
      action: () => {
        onClose();
        onChat();
      },
    },
    {
      key: "schedule",
      Icon: CalendarCheck,
      title: "Book a consultation",
      sub: "Schedule a 30-minute call with a Nobu events specialist",
    },
    {
      key: "whatsapp",
      Icon: MessageCircle,
      title: "WhatsApp the events desk",
      sub: "Message us anytime · response in under an hour",
    },
    {
      key: "phone",
      Icon: Phone,
      title: "Call the events line",
      sub: "+1 (800) NOBU-EVT · Mon–Sun, 8am – 10pm CST",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-canvas border-l border-border-default p-0"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="px-7 pt-9 pb-6 border-b border-border-subtle text-left">
            <p className="eyebrow">Connect with Nobu</p>
            <SheetTitle className="mt-3 font-title text-3xl text-ink leading-tight">
              How would you like to start?
            </SheetTitle>
            <SheetDescription className="font-sans text-sm text-ink-soft">
              Allie is always on. Or skip ahead to a human — our event specialists
              respond within the hour during operating times.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
            {options.map(({ key, Icon, title, sub, action }) => {
              const interactive = !!action;
              const Comp = interactive ? "button" : "div";
              return (
                <Comp
                  key={key}
                  onClick={action}
                  className={`group flex w-full items-start gap-4 rounded-lg border border-border-subtle bg-paper p-5 text-left transition-colors ${
                    interactive ? "hover:border-copper hover:shadow-rcd-sm cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-pill ${
                      key === "chat" ? "bg-ink text-copper-soft" : "bg-cream text-ink"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div className="flex-1">
                    <p className="font-sans font-semibold text-base text-ink leading-snug">{title}</p>
                    <p className="mt-1 font-sans text-sm text-ink-soft leading-relaxed">{sub}</p>
                  </div>
                  {interactive ? (
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-copper" />
                  ) : null}
                </Comp>
              );
            })}
          </div>

          <div className="border-t border-border-subtle bg-cream-soft px-7 py-5 text-[11px] uppercase tracking-[0.3em] text-ink-muted font-sans text-center">
            Nobu Hotel · Los Cabos · Events Desk
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
