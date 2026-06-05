import suite from "@/assets/stay-suite.jpg";
import { Check } from "lucide-react";

const perks = [
  "Room blocks for groups of 10+",
  "Complimentary upgrade for the guest of honor",
  "Late checkout for celebration guests",
  "Curated welcome amenity in every room",
  "Dedicated group concierge contact",
  "VIP arrival & private transfers",
];

const stayTypes = [
  { label: "Signature Suites", desc: "Oceanview suites with private terraces — the standard for guests of honor." },
  { label: "Garden Rooms", desc: "Quiet courtyard rooms ideal for travelling parents and grandparents." },
  { label: "Full-floor Takeovers", desc: "Lock the floor, set the welcome amenities, and host your guests on your terms." },
];

/**
 * Stay & celebrate band — pulls in the brief's "accommodation
 * offerings for guests attending the celebration" requirement: room
 * categories, suite options, group booking, VIP and room block.
 */
export const Stays = () => (
  <section id="stays" className="py-24 md:py-32 bg-white">
    <div className="container grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div className="order-2 lg:order-1">
        <p className="eyebrow">Stay &amp; Celebrate</p>
        <h2 className="font-title text-4xl md:text-5xl mt-5 leading-tight text-ink">
          Make a weekend of it.
        </h2>
        <p className="mt-5 font-sans text-ink-soft max-w-lg leading-relaxed">
          From signature suites to full-floor takeovers, we host your guests
          with the same care we bring to your celebration. Group rates, room
          blocks, and VIP accommodations available for every occasion.
        </p>

        <ul className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-3">
          {perks.map((p) => (
            <li key={p} className="flex items-start gap-3 font-sans text-sm text-ink">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-copper text-paper">
                <Check className="h-3 w-3" strokeWidth={2.5} />
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid sm:grid-cols-3 gap-3">
          {stayTypes.map((s) => (
            <div key={s.label} className="rounded-md border border-border-subtle bg-cream-soft p-4">
              <p className="font-sans font-semibold text-sm text-ink">{s.label}</p>
              <p className="mt-1 font-sans text-xs text-ink-soft leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="order-1 lg:order-2 aspect-[4/5] overflow-hidden bg-cream rounded-md">
        <img
          src={suite}
          alt="Ocean-view Nobu signature suite"
          width={1280}
          height={960}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  </section>
);
