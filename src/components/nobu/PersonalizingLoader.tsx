import { useEffect, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";

type Row = {
  prefix: string;
  label: string;
};

// Inline loader shown between the date step and the space-recommendations
// step. Plays out for ~1.6s while Allie "curates" the spaces against the
// captured logistics — visually distinct from the regular chat bubbles
// so it reads as a system action rather than a message.

export function PersonalizingLoader({
  guests,
  dates,
  eventType,
}: {
  guests?: string;
  dates?: string;
  eventType?: string;
}) {
  const rows: Row[] = [
    {
      prefix: "Group size",
      label: guests ?? "Guest count",
    },
    {
      prefix: "Dates",
      label: dates ?? "Selected dates",
    },
    {
      prefix: "Style",
      label: eventType
        ? `Matching layouts for a ${eventType.toLowerCase()}`
        : "Matching layouts & sightlines",
    },
  ];

  // Reveal each row one-by-one with a check mark.
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(1), 350);
    const t2 = setTimeout(() => setRevealed(2), 750);
    const t3 = setTimeout(() => setRevealed(3), 1150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-[bubble-in_0.4s_ease-out] px-1 py-2"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
          <Loader2
            className="absolute inset-0 h-10 w-10 animate-spin text-copper/40"
            strokeWidth={1.4}
            style={{ animationDuration: "1.6s" }}
          />
          <Sparkles
            className="relative h-4 w-4 text-copper"
            strokeWidth={1.6}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-serif text-base italic leading-snug text-foreground md:text-lg">
            Personalizing the spaces based on your logistics
            <span className="ml-1.5 inline-flex items-center gap-0.5 align-baseline">
              <span className="inline-block h-1 w-1 rounded-full bg-copper animate-dot-pulse" />
              <span
                className="inline-block h-1 w-1 rounded-full bg-copper animate-dot-pulse"
                style={{ animationDelay: "0.18s" }}
              />
              <span
                className="inline-block h-1 w-1 rounded-full bg-copper animate-dot-pulse"
                style={{ animationDelay: "0.36s" }}
              />
            </span>
          </p>
          <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-copper">
            Allie is curating
          </p>
        </div>
      </div>

      {/* Checklist rows */}
      <ul className="mt-5 space-y-2 pl-[52px]">
        {rows.map((r, i) => {
          const isRevealed = i < revealed;
          return (
            <li
              key={r.prefix}
              className={`flex items-center gap-3 transition-all duration-500 ${
                isRevealed
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-0"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  isRevealed
                    ? "border-copper bg-copper text-paper"
                    : "border-border-default bg-paper"
                }`}
              >
                <Check
                  className={`h-3 w-3 transition-opacity ${
                    isRevealed ? "opacity-100" : "opacity-0"
                  }`}
                  strokeWidth={2.4}
                />
              </span>
              <span className="flex min-w-0 flex-1 items-baseline gap-2">
                <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {r.prefix}
                </span>
                <span
                  className="hidden flex-1 translate-y-[-2px] border-b border-dotted border-border-default md:block"
                  aria-hidden="true"
                />
                <span className="truncate font-serif text-sm italic text-foreground">
                  {r.label}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
