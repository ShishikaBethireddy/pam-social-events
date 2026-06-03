import { Quote } from "lucide-react";

const quotes = [
  {
    quote:
      "The team turned my mother's 70th into the most extraordinary evening of her life. Every detail — from the black cod to the floral arch — was perfection.",
    name: "Isabella M.",
    event: "Milestone Birthday · Nobu Los Cabos",
  },
  {
    quote:
      "We hosted our family reunion across the property — three generations, four nights — and the team made every single moment feel intentional. We're already planning the next one.",
    name: "The Marín Family",
    event: "Family Reunion · Nobu Los Cabos",
  },
  {
    quote:
      "A flawless 30th birthday weekend. They handled florals, the menu, and even a surprise cake reveal at the rooftop — all I had to do was show up.",
    name: "Catherine W.",
    event: "Birthday Weekend · Nobu Chicago",
  },
];

/**
 * Guest stories — three testimonials with first-name + event metadata.
 * Maps directly to the brief's "testimonials, event photography, guest
 * stories" trust-building requirement.
 */
export const Testimonials = () => (
  <section className="py-24 md:py-32 bg-cream-soft">
    <div className="container">
      <div className="max-w-2xl">
        <p className="eyebrow">Guest Stories</p>
        <h2 className="font-title text-4xl md:text-5xl mt-5 leading-tight text-ink">
          Moments worth remembering.
        </h2>
        <p className="mt-5 font-sans text-ink-soft max-w-xl leading-relaxed">
          A few of the celebrations our specialists shaped this year. Yours is
          next — and Allie already knows where to start.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-14">
        {quotes.map((q) => (
          <figure
            key={q.name}
            className="flex flex-col rounded-md border border-border-subtle bg-paper p-8 shadow-rcd-sm"
          >
            <Quote className="h-7 w-7 text-copper" strokeWidth={1.4} />
            <blockquote className="mt-5 font-title italic text-[22px] leading-snug text-ink flex-1">
              {q.quote}
            </blockquote>
            <figcaption className="mt-6 pt-6 border-t border-border-subtle">
              <div className="font-sans font-semibold text-sm text-ink">{q.name}</div>
              <div className="font-sans text-xs text-ink-muted mt-1 tracking-wide uppercase">{q.event}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
