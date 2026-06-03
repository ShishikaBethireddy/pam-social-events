import { useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

type Space = {
  name: string;
  type: string;
  image: string;
  capacity: string;
  description: string;
  features: string[];
  longDescription: string;
  amenities: string[];
  activities: string[];
  gallery: string[];
};

const SPACES: Space[] = [
  {
    name: "Tsuki Ballroom",
    type: "Indoor Ballroom",
    image:
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/02/Screenshot-2025-02-25-at-6.15.42%E2%80%AFPM.png",
    capacity: "Up to 300 guests",
    description:
      "Our signature ballroom — column-free, refined, and ready for seated dinners or full-scale productions.",
    features: ["Seated dinner", "Stage-ready", "Custom florals"],
    longDescription:
      "The Tsuki Ballroom is Nobu Hotel Los Cabos' flagship indoor venue — a column-free, double-height space dressed in warm timber, natural stone and ambient lighting. Built for grand-scale social gatherings, it transforms effortlessly from a seated formal dinner into a high-energy reception with a full stage and dance floor.",
    amenities: [
      "5,400 sq ft column-free floorplate",
      "Built-in stage with AV truss",
      "Pre-function lounge access",
      "Dedicated catering kitchen",
      "VIP & green rooms",
      "Custom lighting & florals",
    ],
    activities: [
      "Seated celebration dinners up to 300",
      "Live performances & curated playlists",
      "Milestone toasts & speeches",
      "Themed party takeovers",
    ],
    gallery: [
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/02/Screenshot-2025-02-25-at-6.15.42%E2%80%AFPM.png",
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/02/Screenshot-2025-02-25-at-6.19.52%E2%80%AFPM.png",
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/04/Meetings-Events-Nobu-Hotel-Los-Cabos.jpg",
    ],
  },
  {
    name: "Aozora Ballroom",
    type: "Open-Air Ballroom",
    image:
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/04/Aozora-Ballroom-Meetings-Events-Nobu-Hotel-Los-Cabos.jpg",
    capacity: "Up to 220 guests",
    description:
      "An open-air ballroom under the Baja sky, designed for golden-hour receptions and starlit dinners.",
    features: ["Open-air", "Sunset views", "Reception"],
    longDescription:
      "Aozora — Japanese for 'blue sky' — is our open-air ballroom perched to capture Baja's signature golden hour. Linen-draped tables sit beneath a soft canopy, with sunset spilling across the Pacific as your guests arrive for cocktails.",
    amenities: [
      "Open-air canopy with weather backup",
      "Sunset-facing orientation",
      "Full-service bar build-out",
      "Ambient string & uplighting",
      "Adjacent prep kitchen",
    ],
    activities: [
      "Golden-hour cocktail receptions",
      "Starlit seated dinners",
      "Live acoustic sets",
      "Open-air dance floors",
    ],
    gallery: [
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/04/Aozora-Ballroom-Meetings-Events-Nobu-Hotel-Los-Cabos.jpg",
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/03/Umi-Terrace-Nobu-Hotel-Los-Cabos.jpg",
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/05/Yakusoku-Garden-Nobu-Hotel-Los-Cabos-scaled.jpg",
    ],
  },
  {
    name: "Tsuki Pre-Function",
    type: "Lounge & Reception",
    image:
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/02/Screenshot-2025-02-25-at-6.19.52%E2%80%AFPM.png",
    capacity: "Up to 120 guests",
    description:
      "A flowing pre-function lounge perfect for welcome cocktails and intimate gatherings before the main event.",
    features: ["Welcome bar", "Lounge seating", "Flexible"],
    longDescription:
      "The Tsuki Pre-Function flows directly into the main ballroom — a softly-lit lounge anchored by a sculpted bar and curated seating vignettes. Ideal for welcome cocktails, intermissions and after-parties that feel intimate even with a full guest list.",
    amenities: [
      "Sculpted welcome bar",
      "Curated lounge vignettes",
      "Direct ballroom access",
      "Ambient lighting controls",
      "Coat check & restrooms adjacent",
    ],
    activities: [
      "Welcome cocktails & canapés",
      "After-party lounges",
      "Cigar & whisky tastings",
      "Pre-celebration receptions",
    ],
    gallery: [
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/02/Screenshot-2025-02-25-at-6.19.52%E2%80%AFPM.png",
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/02/Screenshot-2025-02-25-at-6.28.27%E2%80%AFPM.png",
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/02/Screenshot-2025-02-25-at-6.15.42%E2%80%AFPM.png",
    ],
  },
  {
    name: "Umi Terrace",
    type: "Oceanfront Terrace",
    image:
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/03/Umi-Terrace-Nobu-Hotel-Los-Cabos.jpg",
    capacity: "Up to 150 guests",
    description:
      "Pacific views, sea breeze, and a wraparound terrace built for celebrations against the horizon.",
    features: ["Ocean views", "Cocktails", "Live music"],
    longDescription:
      "Umi Terrace wraps the property's ocean-facing edge — a long, low-walled terrace where the Pacific becomes the backdrop. Pair sushi stations with live ambient music and let the sea breeze do the rest.",
    amenities: [
      "Uninterrupted Pacific views",
      "Wraparound terrace layout",
      "Live music stage zone",
      "Sushi & raw bar stations",
      "Sunset-timed lighting program",
    ],
    activities: [
      "Sunset cocktail receptions",
      "Live ensembles & ambient sets",
      "Sushi & sake tastings",
      "Welcome dinners",
    ],
    gallery: [
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/03/Umi-Terrace-Nobu-Hotel-Los-Cabos.jpg",
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/04/Aozora-Ballroom-Meetings-Events-Nobu-Hotel-Los-Cabos.jpg",
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/04/Meetings-Events-Nobu-Hotel-Los-Cabos.jpg",
    ],
  },
  {
    name: "Shiawase Terrace",
    type: "Garden Terrace",
    image:
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/02/Screenshot-2025-02-25-at-6.29.44%E2%80%AFPM.png",
    capacity: "Up to 80 guests",
    description:
      "An intimate terrace framed by tropical greenery — ideal for welcome dinners and milestone toasts.",
    features: ["Intimate", "Garden setting", "Private bar"],
    longDescription:
      "Shiawase — 'happiness' — is our most intimate terrace, framed by palms and tropical greenery. A single long table sits beneath festoon lighting, perfect for milestone birthdays, welcome dinners and family-style celebrations.",
    amenities: [
      "Garden-framed terrace",
      "Long-table seating",
      "Festoon & lantern lighting",
      "Private bar setup",
      "Acoustic-friendly layout",
    ],
    activities: [
      "Milestone birthday dinners",
      "Welcome dinners & long-table feasts",
      "Chef's table experiences",
      "Intimate toasts & speeches",
    ],
    gallery: [
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/02/Screenshot-2025-02-25-at-6.29.44%E2%80%AFPM.png",
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/05/Yakusoku-Garden-Nobu-Hotel-Los-Cabos-scaled.jpg",
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/03/Umi-Terrace-Nobu-Hotel-Los-Cabos.jpg",
    ],
  },
  {
    name: "Yakusoku Garden",
    type: "Private Lawn",
    image:
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/05/Yakusoku-Garden-Nobu-Hotel-Los-Cabos-scaled.jpg",
    capacity: "Up to 200 guests",
    description:
      "A manicured lawn wrapped in palms — our most photographed setting for outdoor dinners and milestone toasts.",
    features: ["Lawn", "String-lit", "Catering-ready"],
    longDescription:
      "Yakusoku — 'promise' — is a manicured lawn ringed by mature palms, with the Pacific glinting just beyond. It's our most-photographed outdoor venue: equally at home hosting a string-lit dinner or a milestone celebration under the stars.",
    amenities: [
      "Manicured private lawn",
      "Palm-framed sightlines",
      "Power & water hookups",
      "Catering tent footprint",
      "Custom lighting rigging",
    ],
    activities: [
      "Outdoor seated dinners",
      "Live bands & dance floors",
      "Themed garden parties",
      "Anniversary celebrations",
    ],
    gallery: [
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/05/Yakusoku-Garden-Nobu-Hotel-Los-Cabos-scaled.jpg",
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/02/Screenshot-2025-02-25-at-6.29.44%E2%80%AFPM.png",
      "https://www.nobuhotels.com/los-cabos/content/uploads/2025/04/Aozora-Ballroom-Meetings-Events-Nobu-Hotel-Los-Cabos.jpg",
    ],
  },
];

// ── Swipeable image carousel used inside each space card + detail hero.
//   * arrow buttons (visible always on mobile, on-hover on desktop)
//   * pagination dots
//   * touch-swipe + keyboard ← → support
//   * crossfade between frames
function SpaceImageGallery({
  images,
  alt,
  aspect = "16/9",
  badge,
  rounded = "rounded-sm",
}: {
  images: string[];
  alt: string;
  aspect?: "16/9" | "21/9";
  badge?: React.ReactNode;
  rounded?: string;
}) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = images.length;
  const aspectClass = aspect === "21/9" ? "aspect-[21/9]" : "aspect-[16/9]";

  const go = (delta: number) => {
    setIndex((i) => (i + delta + count) % count);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <div
      className={`group relative ${aspectClass} overflow-hidden bg-muted ${rounded} select-none`}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${alt} — image gallery`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={`${alt} — view ${i + 1} of ${count}`}
          loading={i === 0 ? "eager" : "lazy"}
          draggable={false}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {badge}

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground opacity-0 backdrop-blur transition-all hover:bg-background group-hover:opacity-100 focus-visible:opacity-100 md:left-3 md:h-9 md:w-9"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.7} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground opacity-0 backdrop-blur transition-all hover:bg-background group-hover:opacity-100 focus-visible:opacity-100 md:right-3 md:h-9 md:w-9"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.7} />
          </button>

          <div className="pointer-events-none absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-background/70 px-2 py-1 backdrop-blur">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === index}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`pointer-events-auto h-1.5 rounded-full transition-all ${
                  i === index ? "w-4 bg-foreground" : "w-1.5 bg-foreground/40"
                }`}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/70 backdrop-blur md:hidden">
            {index + 1} / {count}
          </div>
        </>
      )}
    </div>
  );
}

export const SpaceGallery = ({
  onSelect,
}: {
  onSelect: (name: string) => void;
}) => {
  const [explored, setExplored] = useState<string | null>(null);
  const [detail, setDetail] = useState<Space | null>(null);

  if (detail) {
    return (
      <div className="rounded-xl border border-border bg-background p-5 md:p-7">
        <button
          type="button"
          onClick={() => setDetail(null)}
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to spaces
        </button>

        <div className="mt-5">
          <SpaceImageGallery
            images={detail.gallery}
            alt={`${detail.name} — ${detail.type}`}
            rounded="rounded-lg"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow">{detail.type}</p>
            <h3 className="mt-2 font-serif text-3xl leading-tight">{detail.name}</h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Nobu Hotel Los Cabos
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] text-accent">
            <Users className="h-3.5 w-3.5" /> {detail.capacity}
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {detail.longDescription}
        </p>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div>
            <p className="eyebrow">Amenities</p>
            <ul className="mt-3 space-y-2 text-sm">
              {detail.amenities.map((a) => (
                <li key={a} className="flex items-start gap-2 text-foreground">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-none text-accent" />
                  <span className="text-muted-foreground">{a}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Activities & moments</p>
            <ul className="mt-3 space-y-2 text-sm">
              {detail.activities.map((a) => (
                <li key={a} className="flex items-start gap-2 text-foreground">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-none text-accent" />
                  <span className="text-muted-foreground">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setDetail(null)}
            className="rounded-full border border-border bg-background px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground transition hover:border-accent"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect(detail.name);
              setDetail(null);
            }}
            className="rounded-full bg-primary px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-primary/90"
          >
            Select {detail.name}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background p-5 md:p-7">
      <p className="eyebrow">Allie's picks</p>
      <h3 className="mt-2 font-serif text-2xl md:text-3xl leading-tight">
        Spaces curated for your celebration
      </h3>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Each venue is hand-selected from Nobu Hotel Los Cabos. Tap{" "}
        <span className="text-foreground">Explore</span> for details, or{" "}
        <span className="text-foreground">Select</span> to lock it in.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {SPACES.map((s) => {
          const isOpen = explored === s.name;
          return (
            <article
              key={s.name}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-background transition hover:shadow-rcd"
            >
              <SpaceImageGallery
                images={s.gallery}
                alt={`${s.name} — ${s.type} at Nobu Hotel Los Cabos`}
                badge={
                  <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground backdrop-blur">
                    {s.type}
                  </span>
                }
              />
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-serif text-xl leading-tight">{s.name}</h4>
                  <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.2em] text-accent">
                    {s.capacity}
                  </span>
                </div>
                {isOpen ? (
                  <>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {s.features.map((f) => (
                        <li
                          key={f}
                          className="rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDetail(s)}
                    className="rounded-full border border-border bg-background px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground transition hover:border-accent"
                  >
                    Explore
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelect(s.name)}
                    className="rounded-full bg-primary px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-primary/90"
                  >
                    Select
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onSelect("Not sure — surprise me")}
        className="mt-5 w-full rounded-xl border border-dashed border-border px-4 py-3 text-xs uppercase tracking-[0.25em] text-muted-foreground transition hover:border-accent hover:text-foreground"
      >
        Not sure — let Allie recommend
      </button>
    </div>
  );
};