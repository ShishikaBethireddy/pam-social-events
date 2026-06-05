import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Status = "best" | "event" | "unavailable" | "open";

const SEASONS = ["Spring", "Summer", "Fall", "Winter"] as const;
type Season = (typeof SEASONS)[number];

const seasonMonths: Record<Season, number[]> = {
  Spring: [2, 3, 4],
  Summer: [5, 6, 7],
  Fall: [8, 9, 10],
  Winter: [11, 0, 1],
};

// Deterministic pseudo-random based on date so the calendar feels stable.
function dayStatus(d: Date): { status: Status; discount?: number } {
  const seed = d.getDate() * 31 + d.getMonth() * 7 + d.getFullYear();
  const dow = d.getDay();
  // Weekends are premium / "event" days
  if (dow === 5 || dow === 6) {
    if (seed % 9 === 0) return { status: "unavailable" };
    return { status: "event" };
  }
  // Tue / Wed get best-price discounts
  if (dow === 2 || dow === 3) {
    if (seed % 11 === 0) return { status: "unavailable" };
    const discount = [15, 20, 25][seed % 3];
    return { status: "best", discount };
  }
  if (seed % 7 === 0) return { status: "unavailable" };
  return { status: "open" };
}

function monthLabel(d: Date) {
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

export const DateCalendar = ({
  onSelect,
}: {
  onSelect: (label: string) => void;
}) => {
  const start = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth() + 2, 1);
  }, []);
  const [cursor, setCursor] = useState<Date>(start);
  const [season, setSeason] = useState<Season>(() => {
    const m = start.getMonth();
    return (Object.entries(seasonMonths).find(([, ms]) => ms.includes(m))?.[0] as Season) ?? "Spring";
  });
  const [selected, setSelected] = useState<Date | null>(null);

  const jumpMonth = (delta: number) => {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1);
    setCursor(next);
    const s = Object.entries(seasonMonths).find(([, ms]) => ms.includes(next.getMonth()))?.[0] as Season;
    if (s) setSeason(s);
  };

  const pickSeason = (s: Season) => {
    setSeason(s);
    const months = seasonMonths[s];
    const today = new Date();
    // first month in season >= today
    const year =
      s === "Winter" && cursor.getMonth() < 2 ? cursor.getFullYear() : cursor.getFullYear();
    const firstMonth = months[0];
    let target = new Date(year, firstMonth, 1);
    if (target < new Date(today.getFullYear(), today.getMonth(), 1)) {
      target = new Date(today.getFullYear() + 1, firstMonth, 1);
    }
    setCursor(target);
  };

  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const firstDow = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();
  const cells: Array<{ date: Date; status: Status; discount?: number } | null> = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    cells.push({ date: d, ...dayStatus(d) });
  }

  const formatLabel = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const confirm = () => {
    if (!selected) return;
    const s = dayStatus(selected);
    const tag =
      s.status === "best" && s.discount ? ` · Best price (-${s.discount}%)` : s.status === "event" ? " · Prime weekend" : "";
    onSelect(`${formatLabel(selected)}${tag}`);
  };

  return (
    <div className="rounded-sm border border-border bg-white p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-serif text-lg md:text-xl">When would you like to celebrate?</p>
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-accent/25" /> Best price
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-primary" /> Prime
          </span>
          <span className="flex items-center gap-1.5">
            <span className="relative inline-block h-3 w-3 rounded-sm bg-secondary">
              <span className="absolute inset-0 m-auto h-px w-4 -rotate-45 bg-muted-foreground/60" />
            </span>
            Unavailable
          </span>
        </div>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Tap a day to see availability for your social gathering.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {SEASONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => pickSeason(s)}
            className={`rounded-full border px-4 py-1.5 text-xs transition ${
              season === s
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-white text-foreground hover:border-accent"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="font-serif text-xl">{monthLabel(cursor)}</div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => jumpMonth(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-accent hover:text-foreground"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => jumpMonth(1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-accent hover:text-foreground"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1.5 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="py-1">{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1.5">
        {cells.map((c, i) => {
          if (!c) return <div key={i} className="h-14" />;
          const isSelected = selected && c.date.toDateString() === selected.toDateString();
          const base =
            "relative flex h-14 flex-col items-center justify-center rounded-sm text-sm transition";
          let cls = "border border-transparent text-foreground hover:bg-secondary/60";
          if (c.status === "best") cls = "bg-accent/15 text-foreground hover:bg-accent/25";
          else if (c.status === "event") cls = "bg-primary text-primary-foreground hover:bg-primary/90";
          else if (c.status === "unavailable")
            cls = "bg-secondary/40 text-muted-foreground/50 cursor-not-allowed";
          const selectedCls = isSelected ? " ring-2 ring-accent ring-offset-1" : "";
          return (
            <button
              key={i}
              type="button"
              disabled={c.status === "unavailable"}
              onClick={() => setSelected(c.date)}
              className={`${base} ${cls}${selectedCls}`}
            >
              {c.status === "unavailable" && (
                <span className="absolute left-2 right-2 top-1/2 h-px -rotate-12 bg-muted-foreground/50" />
              )}
              <span className="leading-none">{c.date.getDate()}</span>
              {c.status === "best" && c.discount && (
                <span className="mt-1 text-[10px] font-medium text-accent">-{c.discount}%</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-accent">Event Date</span>
          <span className="text-sm text-foreground">
            {selected ? formatLabel(selected) : <span className="text-muted-foreground">Select a date</span>}
          </span>
        </div>
        <button
          type="button"
          disabled={!selected}
          onClick={confirm}
          className="rounded-full bg-primary px-5 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
        >
          Confirm Date
        </button>
      </div>
    </div>
  );
};