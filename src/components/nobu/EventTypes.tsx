import birthdayImg from "@/assets/event-birthday.jpg";
import engagementImg from "@/assets/event-engagement.jpg";
import showerImg from "@/assets/event-shower.jpg";
import { Cake, HeartHandshake, Flower2 } from "lucide-react";

const featured = [
  {
    name: "Milestone Birthdays",
    Icon: Cake,
    desc:
      "From sweet sixteens to seventieths — bespoke menus, signature cocktails, and unforgettable cake reveals on the terrace.",
    img: birthdayImg,
  },
  {
    name: "Family Reunions",
    Icon: HeartHandshake,
    desc:
      "Multi-generational weekends with private dinners, beachfront brunches, and curated activities for every guest.",
    img: engagementImg,
  },
  {
    name: "Baby Showers",
    Icon: Flower2,
    desc:
      "Garden-side brunches and afternoon teas styled with seasonal florals and curated, share-plate menus for the parents-to-be.",
    img: showerImg,
  },
];

const more = [
  "Anniversaries",
  "Bachelor & Bachelorette Parties",
  "Birthday Weekends",
  "Graduations",
  "Private Dinners",
  "Retirement Soirées",
  "Holiday Gatherings",
  "Cocktail Receptions",
  "Celebration Brunches",
  "Welcome Parties",
];

/**
 * Event-type showcase — three feature cards + a chip rail of additional
 * celebrations Nobu hosts. Maps to the brief's "showcase the different
 * event types" requirement.
 */
export const EventTypes = () => (
  <section id="events" className="py-24 md:py-32 bg-white">
    <div className="container">
      <div className="max-w-3xl">
        <p className="eyebrow">Every Celebration, Curated</p>
        <h2 className="font-title text-4xl md:text-5xl mt-5 leading-tight text-ink">
          A celebration for every chapter of your life.
        </h2>
        <p className="mt-5 font-sans text-ink-soft max-w-xl leading-relaxed">
          Whatever the occasion, our specialists design experiences that feel
          entirely yours — rooted in Nobu&rsquo;s signature warmth, precision,
          and quiet luxury.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-14">
        {featured.map((t) => (
          <article key={t.name} className="group flex flex-col">
            <div className="aspect-[4/5] overflow-hidden bg-cream rounded-md">
              <img
                src={t.img}
                alt={t.name}
                width={1024}
                height={1280}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mt-6 flex items-start gap-3">
              <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-cream text-copper">
                <t.Icon className="h-4 w-4" strokeWidth={1.6} />
              </span>
              <div>
                <h3 className="font-title text-2xl text-ink leading-tight">{t.name}</h3>
                <p className="mt-2 font-sans text-sm text-ink-soft leading-relaxed">{t.desc}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-20 border-t border-border-subtle pt-10">
        <p className="eyebrow mb-6">Also hosted at Nobu</p>
        <ul className="flex flex-wrap gap-2.5">
          {more.map((m) => (
            <li
              key={m}
              className="rounded-pill border border-border-default bg-paper px-4 py-2 font-sans text-sm text-ink hover:border-copper hover:text-copper transition-colors cursor-default"
            >
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
