import privateDining from "@/assets/venue-private-dining.jpg";
import rooftop from "@/assets/venue-rooftop.jpg";
import poolside from "@/assets/venue-poolside.jpg";
import ballroom from "@/assets/venue-ballroom.jpg";
import { Users } from "lucide-react";

const venues = [
  {
    name: "The Omakase Room",
    type: "Private Dining",
    img: privateDining,
    capacity: "Up to 24 seated",
    desc: "An intimate timber-lined room with a dedicated chef plating omakase courses tableside.",
    amenities: ["Dedicated chef", "Custom omakase", "Sake pairings"],
  },
  {
    name: "Sky Terrace",
    type: "Rooftop Reception",
    img: rooftop,
    capacity: "Up to 120 standing",
    desc: "Sunset views, fire pits, and a signature cocktail bar — the most photographed terrace in town.",
    amenities: ["Open-air bar", "Fire pits", "Premium sound system"],
  },
  {
    name: "Pool Garden",
    type: "Poolside Soirée",
    img: poolside,
    capacity: "Up to 180 standing",
    desc: "An infinity edge framed by palms and lanterns — built for tropical evenings and golden brunches.",
    amenities: ["Cabana lounges", "Tiki bar", "Lantern lighting"],
  },
  {
    name: "The Grand Ballroom",
    type: "Seated Celebration",
    img: ballroom,
    capacity: "Up to 300 seated",
    desc: "A column-free ballroom with crystal chandeliers, custom florals, and a dedicated catering kitchen.",
    amenities: ["Custom florals", "Dance floor", "VIP suite"],
  },
];

/**
 * Venues showcase — pulls in the brief's "venue showcase highlighting
 * available event spaces" requirement. Each card surfaces imagery,
 * capacity, description, and key amenities.
 */
export const Venues = () => (
  <section id="venues" className="py-24 md:py-32 bg-ink text-paper">
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
        <div className="max-w-2xl">
          <p className="eyebrow text-copper-soft">Signature Venues</p>
          <h2 className="font-title text-4xl md:text-5xl mt-5 leading-tight text-paper">
            Spaces that make the moment.
          </h2>
        </div>
        <p className="font-sans text-paper/75 max-w-md leading-relaxed">
          From intimate omakase counters to oceanview ballrooms, every Nobu
          venue is designed to feel both grand and personal.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {venues.map((v) => (
          <article
            key={v.name}
            className="group flex flex-col overflow-hidden rounded-xl border border-paper/15 bg-white/5 transition hover:border-paper/30"
          >
            <div className="aspect-[4/3] overflow-hidden bg-ink">
              <img
                src={v.img}
                alt={`${v.name} — ${v.type}`}
                width={640}
                height={480}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="eyebrow text-[10px] text-copper-soft">{v.type}</p>
              <h3 className="font-title text-xl mt-1.5 text-paper leading-tight">{v.name}</h3>
              <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-pill border border-paper/20 bg-white/5 px-2.5 py-1 text-[11px] font-sans text-paper">
                <Users className="h-3 w-3 text-copper-soft" />
                {v.capacity}
              </div>
              <p className="mt-2.5 line-clamp-3 font-sans text-[13px] text-paper/70 leading-relaxed">
                {v.desc}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
