import { useState } from "react";
import { ChevronDown, MapPin, Plus } from "lucide-react";

type Style = {
  id: string;
  name: string;
  venue: string;
  cuisine: string;
  description: string;
  highlights: string[];
  image: string;
  /** Pricing tier, displayed à la a printed menu (e.g. "$$$$"). */
  tier: string;
  /** Hero accent quote — chef's note shown when expanded. */
  note: string;
};

const styles: Style[] = [
  {
    id: "omakase",
    name: "Omakase Tasting",
    venue: "Nobu Restaurant",
    cuisine: "Japanese-Peruvian",
    description:
      "A chef-led tasting of Nobu signatures — black cod miso, yellowtail jalapeño, new-style sashimi — paired with sake flights and Pacific Ocean views.",
    highlights: ["7–9 courses", "Sake pairings", "Chef interaction"],
    image:
      "https://www.nobuhotels.com/los-cabos/content/uploads/2024/06/Nobu-Restaurant-9-NobuLC-scaled.jpg",
    tier: "$$$$",
    note: "Chef de cuisine selects the night's progression based on the catch.",
  },
  {
    id: "family",
    name: "Family-Style",
    venue: "Pacific Restaurant",
    cuisine: "Contemporary Mexican",
    description:
      "Vibrant shareable plates, hand-pressed tortillas, ceviches and tacos served open-air over the bay — designed for warm, communal celebrations.",
    highlights: ["Shared platters", "Curated mezcals", "Open-air bay views"],
    image:
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/04/pacific-restaurant-mexican-cuisine-nobu-los-cabos.jpg",
    tier: "$$$",
    note: "Built for the table — passed plates and second helpings encouraged.",
  },
  {
    id: "cocktail",
    name: "Cocktail Reception",
    venue: "M Bar",
    cuisine: "Cocktails & Tapas",
    description:
      "A contemporary cocktail program inspired by Mediterranean street food — Moroccan, Turkish and Greek bites paired with signature serves as sunset turns to nightlife.",
    highlights: ["Signature cocktails", "Roaming canapés", "Lounge atmosphere"],
    image:
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/05/Nobu-Hotel-Los-Cabos-MBar-scaled.jpg",
    tier: "$$$",
    note: "Bartenders craft custom serves around your group's palette.",
  },
  {
    id: "brunch",
    name: "Brunch",
    venue: "The Restaurant",
    cuisine: "All-day Brunch",
    description:
      "Rise Nobu-style — made-to-order omelets, fresh-pressed juices, pastries and savory plates in a light-filled indoor setting, perfect for late-morning gatherings.",
    highlights: [
      "Made-to-order stations",
      "Cold-pressed juices",
      "Sweet & savory spread",
    ],
    image:
      "https://www.nobuhotels.com/los-cabos/content/uploads/2024/10/The-Restaurant-2-NobuLC-1-scaled.jpg",
    tier: "$$",
    note: "A leisurely send-off after the late-night celebration.",
  },
  {
    id: "chef",
    name: "Chef Recommends",
    venue: "Ardea Steakhouse",
    cuisine: "Wood-Fire Steakhouse",
    description:
      "A steakhouse defined by fire — house-aged cuts cooked over wood, paired with local ingredients, refined cocktails and a distinguished wine list curated by our chefs.",
    highlights: ["House-aged cuts", "Wood-fire grill", "Sommelier-led wines"],
    image:
      "https://www.nobuhotels.com/los-cabos/content/uploads/2024/10/Ardea-Steakhouse-22-NobuLC-scaled.jpg",
    tier: "$$$$",
    note: "Sommelier walks the table through each pour.",
  },
  {
    id: "champagne",
    name: "Champagne & Nikkei",
    venue: "Nami Champagne Bar",
    cuisine: "Nikkei Seafood",
    description:
      "Japanese Nikkei cuisine meets Latin American flavors on the beachfront — seafood-forward plates, champagne service and a sophisticated, sun-soaked setting.",
    highlights: ["Champagne service", "Seafood tasting", "Beachfront setting"],
    image:
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/04/nami-champagne-bar-nobu-los-cabos-scaled.jpg",
    tier: "$$$$",
    note: "Reserve for golden hour — the light is unmatched.",
  },
];

// ── A printed-menu treatment that intentionally looks NOTHING like
// the photo-card grid used for spaces. Single-column layout, italic
// serif headers, dotted price-leaders between cuisine + venue, small
// circular dish thumbnails, and dashed dividers between courses.

export function FnbGallery({ onSelect }: { onSelect: (label: string) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#FBF8F2] p-0 shadow-rcd-sm">
      {/* ── Menu header — printed-card feel ── */}
      <div className="relative border-b border-double border-border px-6 pt-6 pb-5 text-center md:px-10 md:pt-8 md:pb-6">
        <p className="font-serif text-[11px] uppercase tracking-[0.45em] text-muted-foreground">
          Allie&rsquo;s Tasting Menu
        </p>
        <h3 className="mt-2 font-serif text-2xl italic leading-tight text-foreground md:text-3xl">
          Dining &amp; Beverage
        </h3>
        <p className="mx-auto mt-2 max-w-md font-serif text-[13px] italic leading-snug text-muted-foreground">
          Six culinary directions, each anchored to a Nobu Los Cabos
          restaurant. Tap a course for the chef&rsquo;s note.
        </p>
        <p className="mt-3 font-serif text-[10px] uppercase tracking-[0.4em] text-accent">
          {styles.length} courses · select one
        </p>
      </div>

      {/* ── Courses list ── */}
      <ol className="divide-y divide-dashed divide-border px-2 md:px-4">
        {styles.map((s, i) => {
          const open = expanded === s.id;
          return (
            <li key={s.id} className="px-2 py-4 md:px-4 md:py-5">
              {/* Row 1 — index, thumb, name, dotted leader, tier */}
              <button
                type="button"
                onClick={() => setExpanded(open ? null : s.id)}
                aria-expanded={open}
                className="group flex w-full items-start gap-3 text-left"
              >
                <span className="mt-2 font-serif text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:mt-3">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border bg-secondary md:h-16 md:w-16">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </span>

                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-baseline gap-2">
                    <span className="font-serif text-lg leading-tight text-foreground md:text-xl">
                      {s.name}
                    </span>
                    <span
                      className="hidden flex-1 translate-y-[-3px] border-b border-dotted border-border md:block"
                      aria-hidden="true"
                    />
                    <span className="hidden font-serif text-sm tracking-[0.2em] text-accent md:inline">
                      {s.tier}
                    </span>
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-serif text-[11px] italic uppercase tracking-[0.22em] text-accent">
                      {s.cuisine}
                    </span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="inline-flex items-center gap-1 font-serif text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      <MapPin className="h-3 w-3" strokeWidth={1.4} />
                      {s.venue}
                    </span>
                    <span className="md:hidden font-serif text-[11px] tracking-[0.2em] text-accent">
                      · {s.tier}
                    </span>
                  </span>
                  <span className="mt-1.5 line-clamp-2 font-serif text-[13px] leading-snug text-muted-foreground">
                    {s.description}
                  </span>
                </span>

                <ChevronDown
                  className={`mt-3 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    open ? "rotate-180 text-accent" : "group-hover:text-foreground"
                  }`}
                  strokeWidth={1.5}
                />
              </button>

              {/* Row 2 — expanded note + highlights + Select */}
              {open && (
                <div className="ml-[68px] mt-4 flex flex-col gap-3 border-l-2 border-double border-accent/60 pl-4 md:ml-[88px] md:pl-5">
                  <p className="font-serif text-[13px] italic leading-relaxed text-foreground">
                    &ldquo;{s.note}&rdquo;
                    <span className="ml-1 font-serif text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      — chef
                    </span>
                  </p>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {s.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-1.5 font-serif text-[12px] text-muted-foreground"
                      >
                        <Plus className="h-3 w-3 text-accent" strokeWidth={1.6} />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(`${s.name} · ${s.venue}`);
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 font-serif text-[11px] uppercase tracking-[0.3em] text-background transition hover:bg-foreground/85"
                    >
                      Add to menu
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* ── Footer — printed-menu flourish ── */}
      <div className="flex flex-col items-center gap-1 border-t border-double border-border px-6 py-4">
        <span className="font-serif text-[9px] uppercase tracking-[0.45em] text-muted-foreground">
          · à votre santé ·
        </span>
        <p className="font-serif text-[11px] italic text-muted-foreground">
          Pairings &amp; dietary adjustments made on request.
        </p>
      </div>
    </div>
  );
}
