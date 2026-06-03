import omakase from "@/assets/fb-omakase.jpg";

const offerings = [
  {
    title: "Signature Omakase",
    desc: "A multi-course tasting plated by your chef — black cod miso, yellowtail jalapeño, and seasonal sushi.",
  },
  {
    title: "Cocktail Packages",
    desc: "From a classic Nobu Martini to bespoke pours built around your celebration and palate.",
  },
  {
    title: "Wine &amp; Sake Pairings",
    desc: "Sommelier-curated flights, including rare Junmai Daiginjo and grower-producer wines.",
  },
  {
    title: "Custom Catering",
    desc: "Family-style, passed canapés, or stationed — built for your headcount and tempo.",
  },
  {
    title: "Chef’s Table Experiences",
    desc: "An intimate seat at the pass with a dedicated chef walking you through every course.",
  },
  {
    title: "Late-night Bites",
    desc: "Crispy rice, mini wagyu sliders, and matcha desserts to keep the night going.",
  },
];

/**
 * Food & beverage band — black ink section to introduce contrast in the
 * scroll, surfaces signature menus, cocktail packages, wine pairings,
 * custom catering and chef-curated experiences (per the brief).
 */
export const Dining = () => (
  <section id="dining" className="py-24 md:py-32 bg-ink text-paper">
    <div className="container grid lg:grid-cols-12 gap-12 lg:gap-16">
      <div className="lg:col-span-5">
        <div className="aspect-[4/5] overflow-hidden rounded-md">
          <img
            src={omakase}
            alt="Plated Nobu omakase courses on dark ceramic"
            width={1280}
            height={960}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="lg:col-span-7 flex flex-col justify-center">
        <p className="eyebrow text-copper-soft">The Nobu Kitchen</p>
        <h2 className="font-title text-4xl md:text-5xl mt-5 leading-tight">
          Food &amp; beverage,<br />
          <em className="italic text-copper-soft">the Nobu way.</em>
        </h2>
        <p className="mt-5 font-sans text-paper/75 max-w-lg leading-relaxed">
          Our chefs design menus that honor the occasion — bold, precise, and
          unmistakably Nobu. Every package can be tailored to dietary needs,
          religious preferences, and the cadence of your evening.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-8">
          {offerings.map((o) => (
            <div key={o.title}>
              <div className="hairline mb-4" />
              <h3 className="font-title text-xl" dangerouslySetInnerHTML={{ __html: o.title }} />
              <p className="mt-2 font-sans text-sm text-paper/70 leading-relaxed">{o.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
