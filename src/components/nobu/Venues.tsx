import privateDining from "@/assets/venue-private-dining.jpg";
import rooftop from "@/assets/venue-rooftop.jpg";
import poolside from "@/assets/venue-poolside.jpg";
import ballroom from "@/assets/venue-ballroom.jpg";
import { Users, Sparkles } from "lucide-react";

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
  <section id="venues" className="py-24 md:py-32 bg-cream-soft">
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
        <div className="max-w-2xl">
          <p className="eyebrow">Signature Venues</p>
          <h2 className="font-title text-4xl md:text-5xl mt-5 leading-tight text-ink">
            Spaces that make the moment.
          </h2>
        </div>
        <p className="font-sans text-ink-soft max-w-md leading-relaxed">
          From intimate omakase counters to oceanview ballrooms, every Nobu
          venue is designed to feel both grand and personal.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-16">
        {venues.map((v) => (
          <article key={v.name} className="group">
            <div className="aspect-[4/3] overflow-hidden bg-cream rounded-md">
              <img
                src={v.img}
                alt={`${v.name} — ${v.type}`}
                width={1280}
                height={960}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{v.type}</p>
                <h3 className="font-title text-3xl mt-2 text-ink leading-tight">{v.name}</h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-pill border border-border-default bg-paper px-3 py-1.5 text-xs font-sans text-ink whitespace-nowrap">
                <Users className="h-3.5 w-3.5 text-copper" />
                {v.capacity}
              </div>
            </div>
            <p className="mt-3 font-sans text-ink-soft leading-relaxed">{v.desc}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {v.amenities.map((a) => (
                <li
                  key={a}
                  className="text-xs px-3 py-1.5 border border-border-default rounded-pill bg-paper text-ink flex items-center gap-1.5"
                >
                  <Sparkles className="h-3 w-3 text-copper" /> {a}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  </section>
);
