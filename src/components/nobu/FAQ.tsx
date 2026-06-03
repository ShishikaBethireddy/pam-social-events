import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is the typical venue capacity at Nobu?",
    a: "Our spaces range from intimate omakase rooms for 8 guests to grand ballrooms hosting up to 300 seated or 500 standing. Your specialist will match the venue to your guest count and vision.",
  },
  {
    q: "Can Nobu arrange a room block for my guests?",
    a: "Yes. We offer preferential group rates and dedicated room blocks for celebrations of 10 rooms or more, plus VIP upgrades and welcome amenities for honored guests.",
  },
  {
    q: "Are catering and bar packages required?",
    a: "All celebrations include in-house catering by our Nobu chefs. Custom menus, dietary accommodations, signature cocktails, and beverage packages are tailored during planning.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend 4–6 months for larger celebrations and 6–8 weeks for intimate dinners. Peak seasons book earliest — your specialist will confirm live availability.",
  },
  {
    q: "What is your cancellation and deposit policy?",
    a: "A refundable date hold can be placed with a small deposit during planning. Full deposits and cancellation terms are outlined in your event proposal, which is always transparent and flexible.",
  },
  {
    q: "What does an event timeline look like?",
    a: "Most celebrations run 3–5 hours including arrival and dinner service. Your concierge builds a detailed run-of-show with vendor coordination, music cues, and key moments.",
  },
  {
    q: "Can you accommodate dietary or cultural requirements?",
    a: "Absolutely. Our kitchens build full halal, kosher, vegan, gluten-free, and allergy-friendly menus. Cultural touches — from rituals to plate-ware — are coordinated by your specialist.",
  },
];

/**
 * FAQ accordion — covers venue capacities, room blocks, catering,
 * timelines, cancellation, and booking requirements (all topics called
 * out in the brief).
 */
export const FAQ = () => (
  <section id="faq" className="py-24 md:py-32 bg-canvas">
    <div className="container grid lg:grid-cols-12 gap-12">
      <div className="lg:col-span-4">
        <p className="eyebrow">Frequently Asked</p>
        <h2 className="font-title text-4xl md:text-5xl mt-5 leading-tight text-ink">
          The details, answered.
        </h2>
        <p className="mt-5 font-sans text-ink-soft leading-relaxed">
          Everything you need to know before connecting with your event
          specialist. Have something specific? Allie can answer in seconds.
        </p>
      </div>
      <div className="lg:col-span-8">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-border-subtle"
            >
              <AccordionTrigger className="font-title text-xl md:text-2xl text-left py-6 text-ink hover:text-copper hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="font-sans text-base text-ink-soft leading-relaxed pb-6">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);
