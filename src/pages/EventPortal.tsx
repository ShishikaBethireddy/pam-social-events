import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Calendar, CheckCircle2, Download,
  Hotel, Lock, MapPin, Phone, Plus, Search, ShieldCheck, Sparkles, Star,
  Trash2, Users,
} from "lucide-react";
import { estimates, SavedEstimate, useAuth } from "@/lib/auth";
import bacheloretteHero from "@/assets/bachelorette-beach.jpg";
import birthdayHero from "@/assets/event-birthday.jpg";
import engagementHero from "@/assets/event-engagement.jpg";
import showerHero from "@/assets/event-shower.jpg";
import celebrationHero from "@/assets/hero-celebration.jpg";
import rooftopHero from "@/assets/venue-rooftop.jpg";
import diningHero from "@/assets/venue-private-dining.jpg";
import ballroomHero from "@/assets/venue-ballroom.jpg";
import poolsideHero from "@/assets/venue-poolside.jpg";
import { Nav } from "@/components/nobu/Nav";
import { MenuOverlay } from "@/components/nobu/MenuOverlay";
import { SpecialistSheet } from "@/components/nobu/SpecialistSheet";

const fmtDateTime = (ts: number) =>
  new Date(ts).toLocaleString(undefined, {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });

type TabKey = "proposal" | "stay" | "vendors" | "itinerary" | "guests";

type AddOn = { id: string; title: string; desc: string; price: number };

// ── Event-type theme ────────────────────────────────────────────
// The whole portal (hero image, copy, plan inclusions, add-ons, tab
// labels and the group noun) is driven by the event type the planner
// chose in the chat flow (stored on the estimate as `eventType`).
type EventTheme = {
  hero: string;
  badge: string;
  portalLabel: string;
  /** Lead-in over the title, e.g. "Family Reunion · Nobu Los Cabos". */
  eyebrow: string;
  /** Rendered after "{firstName}'s", e.g. "family reunion". */
  titleSuffix: string;
  blurb: string;
  /** Word used in running copy, e.g. "weekend" / "celebration". */
  occasion: string;
  /** Group-member noun, e.g. guest / bridesmaid / family member. */
  noun: { singular: string; plural: string };
  headcount: number;
  /** Optional override for the hero head-count summary. */
  groupSummary?: string;
  tabs: Record<TabKey, string>;
  planTitle: string;
  plan: string[];
  addonsTitle: string;
  addons: AddOn[];
  concierge: string;
};

const DEFAULT_THEME: EventTheme = {
  hero: celebrationHero,
  badge: "Celebration portal",
  portalLabel: "Celebration portal",
  eyebrow: "Private celebration · Nobu Los Cabos",
  titleSuffix: "celebration",
  blurb:
    "Your live planning portal — every space booked, every reservation held, every guest in the loop.",
  occasion: "celebration",
  noun: { singular: "guest", plural: "guests" },
  headcount: 20,
  tabs: {
    proposal: "The Plan",
    stay: "The Stay",
    vendors: "Vendors",
    itinerary: "The Itinerary",
    guests: "Guests",
  },
  planTitle: "What the celebration includes",
  plan: [
    "Private venue at Nobu Hotel Los Cabos",
    "Welcome cocktail reception on arrival",
    "Signature multi-course Nobu dinner",
    "Curated playlist & ambient lighting",
    "Custom florals & table styling",
    "Dedicated event concierge, on-site",
    "Group room block at the preferred rate",
    "Photography moment with the celebration backdrop",
  ],
  addonsTitle: "Make it yours",
  addons: [
    { id: "a-photo", title: "Event photographer", desc: "3-hour shoot + 100 edited shots", price: 2400 },
    { id: "a-florals", title: "Statement florals", desc: "Premium centerpieces & install", price: 1850 },
    { id: "a-band", title: "Live music set", desc: "Acoustic duo or DJ, 3 hours", price: 2200 },
    { id: "a-bar", title: "Premium open bar", desc: "Top-shelf spirits & signature cocktail", price: 3200 },
    { id: "a-cake", title: "Custom celebration cake", desc: "Designed with the pastry chef", price: 650 },
    { id: "a-transport", title: "Guest transfers", desc: "Airport & venue shuttle service", price: 1450 },
  ],
  concierge: "Event concierge",
};

const EVENT_THEMES: Record<string, EventTheme> = {
  bachelorette: {
    hero: bacheloretteHero,
    badge: "Bachelorette portal",
    portalLabel: "Bachelorette weekend portal",
    eyebrow: "Bachelorette weekend · Nobu Los Cabos",
    titleSuffix: "last hurrah",
    blurb:
      "Your live planning portal — every space booked, every reservation held, every bridesmaid in the loop.",
    occasion: "weekend",
    noun: { singular: "bridesmaid", plural: "bridesmaids" },
    headcount: 11,
    groupSummary: "1 bride + 11 bridesmaids",
    tabs: { proposal: "The Plan", stay: "The Suites", vendors: "Bride Squad", itinerary: "The Weekend", guests: "Bridesmaids" },
    planTitle: "What the weekend includes",
    plan: [
      "3-night private weekend at Nobu Hotel Los Cabos",
      "Bride's deluxe suite + 5 shared bridesmaid suites",
      "Welcome cabana & cocktail flight on arrival",
      "Omakase tasting dinner at Nobu Restaurant",
      "Group spa morning at Esencia (12 treatments)",
      "Beach photoshoot with bride-tribe styling kit",
      "Signature chef's table dinner at Yakusoku Garden",
      "Farewell brunch with bottomless mimosas",
      "Dedicated bachelorette concierge, 24/7",
    ],
    addonsTitle: "Bachelorette add-ons",
    addons: [
      { id: "a-glam", title: "Glam squad", desc: "On-suite hair + makeup for 12", price: 3200 },
      { id: "a-sash", title: "Sash & robe set", desc: "Matching satin robes + custom sashes", price: 980 },
      { id: "a-catamaran", title: "Sunset catamaran", desc: "Private 3-hr sail with bar service", price: 4500 },
      { id: "a-neon", title: "Custom neon sign", desc: "'Bride to be' or hashtag, 24×18 in", price: 650 },
      { id: "a-balloon", title: "Balloon arch + photo wall", desc: "Blush + champagne palette", price: 1450 },
      { id: "a-mixology", title: "In-suite mixology class", desc: "Signature bride cocktail", price: 1100 },
    ],
    concierge: "Bridal concierge",
  },
  bachelor: {
    hero: rooftopHero,
    badge: "Bachelor portal",
    portalLabel: "Bachelor weekend portal",
    eyebrow: "Bachelor weekend · Nobu Los Cabos",
    titleSuffix: "last ride",
    blurb:
      "Your live planning portal — every space booked, every reservation held, every groomsman in the loop.",
    occasion: "weekend",
    noun: { singular: "groomsman", plural: "groomsmen" },
    headcount: 11,
    groupSummary: "1 groom + 11 groomsmen",
    tabs: { proposal: "The Plan", stay: "The Suites", vendors: "The Crew", itinerary: "The Weekend", guests: "Groomsmen" },
    planTitle: "What the weekend includes",
    plan: [
      "3-night private weekend at Nobu Hotel Los Cabos",
      "Six suites held at the group rate",
      "Rooftop welcome with craft cocktails",
      "Omakase + wagyu tasting dinner",
      "Deep-sea fishing charter morning",
      "Poolside cabana day with bottle service",
      "Cigar & whisky lounge evening",
      "Recovery brunch before departure",
      "Dedicated weekend concierge, 24/7",
    ],
    addonsTitle: "Bachelor add-ons",
    addons: [
      { id: "a-yacht", title: "Private yacht day", desc: "Top-deck bar, 4-hr charter", price: 5200 },
      { id: "a-cigar", title: "Cigar & whisky tasting", desc: "Sommelier-led, rare pours", price: 1600 },
      { id: "a-golf", title: "Championship golf round", desc: "Foursome + caddies, ocean course", price: 2400 },
      { id: "a-cabana", title: "Poolside cabana + bottles", desc: "Reserved cabana, bottle service", price: 1850 },
      { id: "a-fishing", title: "Deep-sea fishing charter", desc: "Half-day, crew & gear", price: 2100 },
      { id: "a-chef", title: "In-suite private chef", desc: "Late-night sushi & wagyu", price: 1900 },
    ],
    concierge: "Weekend concierge",
  },
  engagement: {
    hero: engagementHero,
    badge: "Engagement portal",
    portalLabel: "Engagement celebration portal",
    eyebrow: "Engagement celebration · Nobu Los Cabos",
    titleSuffix: "engagement",
    blurb:
      "Your live planning portal — every space booked, every reservation held, every guest in the loop.",
    occasion: "celebration",
    noun: { singular: "guest", plural: "guests" },
    headcount: 40,
    tabs: { proposal: "The Plan", stay: "The Stay", vendors: "Vendors", itinerary: "The Evening", guests: "Guests" },
    planTitle: "What the celebration includes",
    plan: [
      "Private oceanfront terrace for the evening",
      "Champagne welcome reception",
      "Signature Nobu cocktail-and-canapé service",
      "Multi-course celebration dinner",
      "Statement floral install & candlelight",
      "Live acoustic set during cocktails",
      "Engagement photo moment at golden hour",
      "Group room block at the preferred rate",
      "Dedicated event concierge, on-site",
    ],
    addonsTitle: "Engagement add-ons",
    addons: [
      { id: "a-photo", title: "Engagement photographer", desc: "Golden-hour shoot + 120 shots", price: 2600 },
      { id: "a-florals", title: "Statement florals", desc: "Arch + tablescape install", price: 2400 },
      { id: "a-champagne", title: "Champagne tower", desc: "Coupe tower + premium pour", price: 1500 },
      { id: "a-band", title: "Live jazz trio", desc: "3-hour set during dinner", price: 2800 },
      { id: "a-neon", title: "Custom neon sign", desc: "Couple's names or initials", price: 650 },
      { id: "a-fireworks", title: "Sparkler send-off", desc: "Coordinated finale moment", price: 1200 },
    ],
    concierge: "Event concierge",
  },
  babyShower: {
    hero: showerHero,
    badge: "Baby shower portal",
    portalLabel: "Baby shower portal",
    eyebrow: "Baby shower · Nobu Los Cabos",
    titleSuffix: "baby shower",
    blurb:
      "Your live planning portal — every space booked, every reservation held, every guest in the loop.",
    occasion: "shower",
    noun: { singular: "guest", plural: "guests" },
    headcount: 25,
    tabs: { proposal: "The Plan", stay: "The Stay", vendors: "Vendors", itinerary: "The Afternoon", guests: "Guests" },
    planTitle: "What the shower includes",
    plan: [
      "Garden terrace reserved for the afternoon",
      "Welcome mocktail & juice bar",
      "Light Nobu lunch & dessert spread",
      "Soft pastel floral styling",
      "Gift & display table setup",
      "Keepsake photo corner",
      "Games & activities station",
      "Dedicated event host, on-site",
    ],
    addonsTitle: "Baby shower add-ons",
    addons: [
      { id: "a-florals", title: "Pastel floral install", desc: "Arch + centerpieces", price: 1450 },
      { id: "a-dessert", title: "Dessert & cake table", desc: "Custom cake + treats", price: 980 },
      { id: "a-photo", title: "Shower photographer", desc: "2-hour candid coverage", price: 1600 },
      { id: "a-favors", title: "Custom guest favors", desc: "Personalized keepsakes", price: 750 },
      { id: "a-balloon", title: "Balloon & photo wall", desc: "Themed backdrop + Polaroids", price: 1100 },
      { id: "a-grazing", title: "Grazing & mocktail bar", desc: "Artisan spread + drinks", price: 1300 },
    ],
    concierge: "Event concierge",
  },
  birthday: {
    hero: birthdayHero,
    badge: "Birthday portal",
    portalLabel: "Birthday celebration portal",
    eyebrow: "Birthday celebration · Nobu Los Cabos",
    titleSuffix: "birthday",
    blurb:
      "Your live planning portal — every space booked, every reservation held, every guest in the loop.",
    occasion: "celebration",
    noun: { singular: "guest", plural: "guests" },
    headcount: 30,
    tabs: { proposal: "The Plan", stay: "The Stay", vendors: "Vendors", itinerary: "The Night", guests: "Guests" },
    planTitle: "What the celebration includes",
    plan: [
      "Private venue at Nobu Hotel Los Cabos",
      "Welcome cocktail reception",
      "Signature multi-course Nobu dinner",
      "Custom birthday cake moment",
      "DJ & dance floor with lighting",
      "Florals & table styling",
      "Photo backdrop & party setup",
      "Group room block at the preferred rate",
      "Dedicated event concierge, on-site",
    ],
    addonsTitle: "Birthday add-ons",
    addons: [
      { id: "a-dj", title: "DJ & dance floor", desc: "4-hour set, lighting rig", price: 2600 },
      { id: "a-cake", title: "Designer birthday cake", desc: "Custom tiered cake", price: 750 },
      { id: "a-photo", title: "Party photographer", desc: "3-hour coverage + edits", price: 2200 },
      { id: "a-bar", title: "Premium open bar", desc: "Top-shelf + signature cocktail", price: 3200 },
      { id: "a-neon", title: "Custom neon sign", desc: "Name or age, photo-ready", price: 650 },
      { id: "a-fireworks", title: "Sparkler & fireworks finale", desc: "Coordinated send-off", price: 1900 },
    ],
    concierge: "Event concierge",
  },
  anniversary: {
    hero: diningHero,
    badge: "Anniversary portal",
    portalLabel: "Anniversary celebration portal",
    eyebrow: "Anniversary celebration · Nobu Los Cabos",
    titleSuffix: "anniversary",
    blurb:
      "Your live planning portal — every space booked, every reservation held, every guest in the loop.",
    occasion: "celebration",
    noun: { singular: "guest", plural: "guests" },
    headcount: 24,
    tabs: { proposal: "The Plan", stay: "The Stay", vendors: "Vendors", itinerary: "The Evening", guests: "Guests" },
    planTitle: "What the celebration includes",
    plan: [
      "Private dining room or terrace for the evening",
      "Champagne welcome toast",
      "Chef's tasting menu with wine pairing",
      "Romantic candlelight & floral styling",
      "Live acoustic music during dinner",
      "Anniversary photo moment",
      "Group room block at the preferred rate",
      "Dedicated event concierge, on-site",
    ],
    addonsTitle: "Anniversary add-ons",
    addons: [
      { id: "a-wine", title: "Sommelier wine pairing", desc: "Reserve pours per course", price: 1600 },
      { id: "a-florals", title: "Romantic floral install", desc: "Tablescape + candles", price: 1850 },
      { id: "a-photo", title: "Anniversary photographer", desc: "2-hour coverage + edits", price: 1900 },
      { id: "a-music", title: "Live jazz duo", desc: "3-hour set during dinner", price: 2400 },
      { id: "a-cake", title: "Celebration cake", desc: "Custom with the pastry chef", price: 650 },
      { id: "a-spa", title: "Couples spa morning", desc: "Side-by-side treatments", price: 1100 },
    ],
    concierge: "Event concierge",
  },
  familyReunion: {
    hero: poolsideHero,
    badge: "Family reunion portal",
    portalLabel: "Family reunion portal",
    eyebrow: "Family reunion · Nobu Los Cabos",
    titleSuffix: "family reunion",
    blurb:
      "Your live planning portal — every space booked, every reservation held, every family member in the loop.",
    occasion: "reunion",
    noun: { singular: "family member", plural: "family members" },
    headcount: 30,
    tabs: { proposal: "The Plan", stay: "The Suites", vendors: "Vendors", itinerary: "The Weekend", guests: "Family" },
    planTitle: "What the reunion includes",
    plan: [
      "Multi-day private weekend at Nobu Hotel Los Cabos",
      "Family room block across connecting suites",
      "Poolside welcome with kids' menu",
      "Family-style Nobu feast dinner",
      "Group beach & pool day setup",
      "Multi-generational photo session",
      "Farewell brunch for the whole family",
      "Group room block at the preferred rate",
      "Dedicated family concierge, on-site",
    ],
    addonsTitle: "Family add-ons",
    addons: [
      { id: "a-photo", title: "Family photographer", desc: "Group + candid, 100 shots", price: 2400 },
      { id: "a-kids", title: "Kids' club & sitters", desc: "Supervised activities", price: 1200 },
      { id: "a-catamaran", title: "Family catamaran sail", desc: "Private 3-hr sail", price: 4500 },
      { id: "a-bbq", title: "Beach BBQ & bonfire", desc: "Grill stations + s'mores", price: 1850 },
      { id: "a-spa", title: "Group spa afternoon", desc: "Treatments for the adults", price: 1600 },
      { id: "a-transport", title: "Group transfers", desc: "Airport & venue shuttle", price: 1450 },
    ],
    concierge: "Family concierge",
  },
  holiday: {
    hero: ballroomHero,
    badge: "Holiday portal",
    portalLabel: "Holiday gathering portal",
    eyebrow: "Holiday gathering · Nobu Los Cabos",
    titleSuffix: "holiday gathering",
    blurb:
      "Your live planning portal — every space booked, every reservation held, every guest in the loop.",
    occasion: "gathering",
    noun: { singular: "guest", plural: "guests" },
    headcount: 22,
    tabs: { proposal: "The Plan", stay: "The Stay", vendors: "Vendors", itinerary: "The Evening", guests: "Guests" },
    planTitle: "What the gathering includes",
    plan: [
      "Private ballroom or terrace for the evening",
      "Festive welcome cocktail reception",
      "Seasonal Nobu tasting dinner",
      "Holiday florals & warm lighting",
      "Live music or curated playlist",
      "Group photo moment by the décor",
      "Group room block at the preferred rate",
      "Dedicated event concierge, on-site",
    ],
    addonsTitle: "Holiday add-ons",
    addons: [
      { id: "a-decor", title: "Seasonal décor package", desc: "Themed install + lighting", price: 2200 },
      { id: "a-band", title: "Live music set", desc: "Trio or DJ, 3 hours", price: 2400 },
      { id: "a-photo", title: "Event photographer", desc: "3-hour coverage + edits", price: 2200 },
      { id: "a-bar", title: "Premium open bar", desc: "Seasonal signature cocktails", price: 3200 },
      { id: "a-gifts", title: "Guest gift favors", desc: "Custom seasonal keepsakes", price: 950 },
      { id: "a-cake", title: "Dessert & cake table", desc: "Pastry chef spread", price: 850 },
    ],
    concierge: "Event concierge",
  },
  privateDinner: {
    hero: diningHero,
    badge: "Private dinner portal",
    portalLabel: "Private dinner portal",
    eyebrow: "Private dinner · Nobu Los Cabos",
    titleSuffix: "private dinner",
    blurb:
      "Your live planning portal — every space booked, every reservation held, every guest in the loop.",
    occasion: "dinner",
    noun: { singular: "guest", plural: "guests" },
    headcount: 14,
    tabs: { proposal: "The Plan", stay: "The Stay", vendors: "Vendors", itinerary: "The Evening", guests: "Guests" },
    planTitle: "What the dinner includes",
    plan: [
      "Private dining room or chef's table",
      "Champagne welcome on arrival",
      "Multi-course omakase tasting menu",
      "Sommelier wine pairing option",
      "Candlelight & intimate floral styling",
      "Personalized printed menus",
      "Dedicated maître d', on-site",
    ],
    addonsTitle: "Private dinner add-ons",
    addons: [
      { id: "a-wine", title: "Sommelier wine pairing", desc: "Reserve pours per course", price: 1600 },
      { id: "a-sake", title: "Premium sake flight", desc: "Curated by the bar team", price: 900 },
      { id: "a-florals", title: "Tablescape florals", desc: "Low centerpieces + candles", price: 850 },
      { id: "a-photo", title: "Dinner photographer", desc: "90-min candid coverage", price: 1200 },
      { id: "a-cake", title: "Celebration dessert", desc: "Custom plated finale", price: 550 },
      { id: "a-music", title: "Acoustic soloist", desc: "2-hour ambient set", price: 1400 },
    ],
    concierge: "Dining concierge",
  },
};

function resolveTheme(eventType?: string): EventTheme {
  if (!eventType) return DEFAULT_THEME;
  const t = eventType.toLowerCase();
  if (t.includes("bachelorette")) return EVENT_THEMES.bachelorette;
  if (t.includes("bachelor")) return EVENT_THEMES.bachelor;
  if (t.includes("engagement")) return EVENT_THEMES.engagement;
  if (t.includes("baby") || t.includes("shower")) return EVENT_THEMES.babyShower;
  if (t.includes("anniversary")) return EVENT_THEMES.anniversary;
  if (t.includes("family") || t.includes("reunion")) return EVENT_THEMES.familyReunion;
  if (t.includes("holiday")) return EVENT_THEMES.holiday;
  if (t.includes("dinner")) return EVENT_THEMES.privateDinner;
  if (t.includes("birthday")) return EVENT_THEMES.birthday;
  return DEFAULT_THEME;
}

// ── Shared (event-neutral) social-event catalogs ────────────────
const VENDOR_CATEGORIES = [
  "Event planning", "Hair & Makeup", "Photography", "Florals & Décor",
  "Entertainment & DJ", "Mixology & Bar", "Spa & Wellness", "Transportation",
];

const VENDOR_DIRECTORY = [
  { category: "Event planning", name: "Cabo Celebrations Co.", tag: "Full-event coordination", rating: 4.9 },
  { category: "Event planning", name: "Baja Soirée Concierge", tag: "On-site coordinator", rating: 4.8 },
  { category: "Hair & Makeup", name: "Maven Glam Studio", tag: "On-site styling team", rating: 4.9 },
  { category: "Hair & Makeup", name: "Sunset Studio Stylists", tag: "Event-ready looks", rating: 4.8 },
  { category: "Photography", name: "Frame & Field", tag: "Documentary candid", rating: 4.9 },
  { category: "Photography", name: "Golden Hour Co.", tag: "Editorial portrait", rating: 4.8 },
  { category: "Florals & Décor", name: "Wildflower Studio", tag: "Statement installs", rating: 4.8 },
  { category: "Florals & Décor", name: "Atelier Bloom", tag: "Tablescapes & arches", rating: 4.7 },
  { category: "Entertainment & DJ", name: "Hightide DJs", tag: "Dance floor energy", rating: 4.8 },
  { category: "Entertainment & DJ", name: "Baja Live Music", tag: "Bands & ensembles", rating: 4.8 },
  { category: "Mixology & Bar", name: "Highball Hospitality", tag: "Signature cocktails", rating: 4.8 },
  { category: "Spa & Wellness", name: "Esencia Spa", tag: "Group treatments", rating: 4.9 },
  { category: "Transportation", name: "Cabo Luxe Transfers", tag: "Airport & venue shuttle", rating: 4.7 },
];

// Default social-event run-sheet — neutral so it reads well for any
// event type (the planner can add type-specific moments themselves).
const DEFAULT_ITINERARY = [
  { id: "i1", day: 1, time: "4:00 PM", title: "Welcome reception & cocktails", location: "Beach Pool · Friday" },
  { id: "i2", day: 1, time: "7:30 PM", title: "Welcome dinner — omakase tasting", location: "Nobu Restaurant · Friday" },
  { id: "i3", day: 2, time: "10:00 AM", title: "Group spa & leisure morning", location: "Esencia Spa · Saturday" },
  { id: "i4", day: 2, time: "1:30 PM", title: "Lunch on the terrace", location: "Malibu Farm · Saturday" },
  { id: "i5", day: 2, time: "8:00 PM", title: "Signature chef's table dinner", location: "Yakusoku Garden · Saturday" },
  { id: "i6", day: 3, time: "11:00 AM", title: "Farewell brunch", location: "Shiawase Terrace · Sunday" },
];

// Activities the host can drop into the schedule.
const ACTIVITY_CATALOG = [
  { title: "Wine pairing tasting", note: "Sommelier-led, 5 pours with light bites" },
  { title: "Group dance lesson", note: "Latin / salsa basics with a local instructor" },
  { title: "Sunset catamaran sail", note: "Private 3-hour sail with bar service" },
  { title: "In-suite mixology class", note: "Master mixologist, signature cocktail" },
  { title: "Beach bonfire & s'mores", note: "Sunset bonfire, blanket setup, late-night sweets" },
  { title: "Karaoke after-party", note: "Curated songbook, pro mic + screen" },
  { title: "Live music set", note: "Acoustic duo or local ensemble" },
  { title: "Group spa hour", note: "Reserved treatments for the party" },
  { title: "Photo scavenger hunt", note: "Teams of 3, prompts around the resort" },
];

const EventPortal = () => {
  const { id } = useParams<{ id: string }>();
  const user = useAuth();
  const navigate = useNavigate();
  const [est, setEst] = useState<SavedEstimate | null>(null);
  const initialTab: TabKey = (() => {
    const hash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
    const allowed: TabKey[] = ["proposal", "stay", "vendors", "itinerary", "guests"];
    return (allowed as string[]).includes(hash) ? (hash as TabKey) : "proposal";
  })();
  const [tab, setTab] = useState<TabKey>(initialTab);
  const [menuOpen, setMenuOpen] = useState(false);
  const [specialistOpen, setSpecialistOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate(`/auth?redirect=/portal/${id}`, { replace: true });
      return;
    }
    if (!id) return;
    setEst(estimates.get(user.email, id) ?? null);
  }, [user, id, navigate]);

  const theme = useMemo(() => resolveTheme(est?.eventType), [est?.eventType]);

  const persist = (patch: Partial<SavedEstimate>) => {
    if (!user || !id || !est) return;
    const next = { ...est, ...patch };
    estimates.update(user.email, id, patch);
    setEst(next);
  };

  if (!user) return null;
  if (!est) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <p className="text-muted-foreground">We couldn't find that celebration.</p>
          <Link to="/account" className="mt-4 inline-block text-sm underline underline-offset-4">
            Back to your account
          </Link>
        </div>
      </div>
    );
  }

  const paid = !!est.paidAt;
  const subtotal = est.subtotal ?? 7800;
  const deposit = est.deposit ?? 500;
  const addOnTotal = (est.addOns ?? []).reduce(
    (s, addonId) => s + (theme.addons.find((a) => a.id === addonId)?.price ?? 0), 0,
  );
  const totalEstimate = subtotal + addOnTotal;

  // Group economics — driven by the event theme head-count.
  const headcount = theme.headcount;
  const perPerson = Math.round(totalEstimate / Math.max(headcount, 1));
  const firstName = user.name?.split(" ")[0] || "Sofia";
  const groupSummary = theme.groupSummary ?? `${headcount} ${theme.noun.plural}`;

  return (
    <div className="min-h-screen bg-[#FBF6EE] pb-24 text-foreground">
      {/* Shared Social Events marketing header — sunset ribbon + Nobu logo */}
      <Nav
        variant="solid"
        onMenu={() => setMenuOpen(true)}
        onSpecialist={() => setSpecialistOpen(true)}
        onPlan={() => navigate("/chat")}
      />

      {/* Portal breadcrumb — keeps the back-to-account exit visible */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/account" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Account
          </Link>
          <p className="font-serif text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {theme.portalLabel}
          </p>
          <div className="hidden text-xs text-muted-foreground sm:block">{user.email}</div>
        </div>
      </div>

      {/* Event hero — postcard split */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-[1fr_1.1fr]">
          <div className="relative h-[220px] overflow-hidden md:h-auto">
            <img
              src={theme.hero}
              alt={theme.eyebrow}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1.5 font-serif text-[10px] uppercase tracking-[0.3em] text-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-accent" strokeWidth={1.8} />
              {theme.badge}
            </div>
          </div>
          <div className="relative flex flex-col justify-center gap-4 bg-white px-6 py-8 md:px-10 md:py-12">
            <p className="font-serif text-[10px] uppercase tracking-[0.4em] text-accent">
              {theme.eyebrow}
            </p>
            <h1 className="font-serif text-4xl leading-[1.05] sm:text-5xl">
              <span className="italic">{firstName}&rsquo;s</span> {theme.titleSuffix}
            </h1>
            <p className="max-w-md font-serif text-[14px] italic leading-relaxed text-muted-foreground">
              {theme.blurb}
            </p>
            <div className="mt-1 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {est.dates && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-accent" />
                  {est.dates}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-accent" />
                {groupSummary}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-accent" />
                Cabo San Lucas, MX
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-5xl overflow-x-auto px-6">
          <nav className="flex gap-1 border-b-0">
            {(Object.keys(theme.tabs) as TabKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`whitespace-nowrap border-b-2 px-4 py-3 font-serif text-sm transition-colors ${
                  tab === key
                    ? "border-foreground italic text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {theme.tabs[key]}
              </button>
            ))}
          </nav>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-8 sm:py-10">
        {tab === "proposal" && (
          <ProposalTab
            est={est}
            theme={theme}
            paid={paid}
            subtotal={subtotal}
            deposit={deposit}
            addOnTotal={addOnTotal}
            totalEstimate={totalEstimate}
            perPerson={perPerson}
            headcount={headcount}
            user={user}
            firstName={firstName}
            onToggleAddOn={(addonId) => {
              const cur = new Set(est.addOns ?? []);
              if (cur.has(addonId)) cur.delete(addonId);
              else cur.add(addonId);
              persist({ addOns: Array.from(cur) });
            }}
          />
        )}
        {tab === "stay" && <StayTab est={est} persist={persist} theme={theme} />}
        {tab === "vendors" && <VendorsTab est={est} persist={persist} theme={theme} />}
        {tab === "itinerary" && <ItineraryTab est={est} persist={persist} theme={theme} />}
        {tab === "guests" && <GuestsTab est={est} persist={persist} theme={theme} headcount={headcount} />}
      </main>

      {/* Sticky footer */}
      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3 text-sm">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <span className="font-serif text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Estimated total
            </span>
            <span className="font-serif text-lg">${totalEstimate.toLocaleString()}</span>
            <span className="hidden font-serif text-xs italic text-muted-foreground sm:inline">
              · ~${perPerson.toLocaleString()} / {theme.noun.singular}
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              · ${deposit} deposit {paid ? "paid" : "due"}
            </span>
          </div>
          <a
            href="tel:+15555550199"
            className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 font-serif text-[11px] uppercase tracking-[0.22em] text-background hover:bg-foreground/90"
          >
            <Phone className="h-3.5 w-3.5" /> {theme.concierge}
          </a>
        </div>
      </footer>

      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onPlan={() => {
          setMenuOpen(false);
          navigate("/chat");
        }}
        onSpecialist={() => {
          setMenuOpen(false);
          setSpecialistOpen(true);
        }}
      />

      <SpecialistSheet
        open={specialistOpen}
        onClose={() => setSpecialistOpen(false)}
        onChat={() => {
          setSpecialistOpen(false);
          navigate("/chat");
        }}
      />
    </div>
  );
};

/* ----------------- Tabs ----------------- */

const ProposalTab = ({
  est, theme, paid, subtotal, deposit, addOnTotal, totalEstimate, perPerson,
  headcount, user, firstName, onToggleAddOn,
}: {
  est: SavedEstimate; theme: EventTheme; paid: boolean; subtotal: number; deposit: number;
  addOnTotal: number; totalEstimate: number; perPerson: number;
  headcount: number; user: { email: string }; firstName: string;
  onToggleAddOn: (id: string) => void;
}) => {
  const selected = new Set(est.addOns ?? []);
  const remaining = Math.max(totalEstimate - deposit, 0);
  return (
    <div className="space-y-6">
      {paid ? (
        <Banner accent>
          <CheckCircle2 className="mt-0.5 h-7 w-7 flex-none text-accent" />
          <div>
            <p className="font-serif text-[10px] uppercase tracking-[0.3em] text-accent">
              {theme.occasion} locked in
            </p>
            <h2 className="mt-2 font-serif text-2xl italic">
              {firstName}&rsquo;s {theme.occasion} is officially on the books.
            </h2>
            <p className="mt-2 font-serif text-sm italic text-muted-foreground">
              ${deposit} deposit received {fmtDateTime(est.paidAt!)}. Receipt sent to {user.email}.
            </p>
          </div>
        </Banner>
      ) : (
        <Banner>
          <Sparkles className="mt-0.5 h-6 w-6 flex-none text-accent" />
          <div>
            <p className="font-serif text-[10px] uppercase tracking-[0.3em] text-accent">
              Estimate ready
            </p>
            <h2 className="mt-2 font-serif text-2xl italic">
              Hold the {theme.occasion} with a ${deposit} deposit.
            </h2>
            <p className="mt-2 font-serif text-sm italic text-muted-foreground">
              Refundable up to 14 days before the {theme.occasion}.
            </p>
          </div>
        </Banner>
      )}

      {/* Core plan */}
      <Card>
        <CardHeader eyebrow="The Plan" title={theme.planTitle} />
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {theme.plan.map((b) => (
            <li key={b} className="flex items-start gap-3 font-serif text-sm">
              <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full border border-accent/40">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />
              </span>
              <span className="leading-snug">{b}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Add-ons */}
      <Card>
        <CardHeader eyebrow="Make it yours" title={theme.addonsTitle} />
        <p className="mt-2 max-w-xl font-serif text-sm italic text-muted-foreground">
          Pick what makes the {theme.occasion} feel like {firstName}. Pricing splits across
          {" "}{headcount} {theme.noun.plural} — final tally updates as you toggle.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {theme.addons.map((a) => {
            const on = selected.has(a.id);
            return (
              <button
                key={a.id}
                onClick={() => onToggleAddOn(a.id)}
                className={`rounded-md border p-4 text-left transition-colors ${
                  on ? "border-foreground bg-[#FBF6EE]" : "border-border hover:border-foreground/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-serif text-base">{a.title}</div>
                    <div className="mt-0.5 font-serif text-xs italic text-muted-foreground">{a.desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-sm">${a.price.toLocaleString()}</div>
                    <div className={`mt-1 font-serif text-[10px] uppercase tracking-[0.2em] ${on ? "text-accent" : "text-muted-foreground"}`}>
                      {on ? "Added" : "+ Add"}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {addOnTotal > 0 && (
          <div className="mt-5 flex items-baseline justify-between border-t border-dashed border-foreground/20 pt-3">
            <span className="font-serif text-sm italic text-muted-foreground">Add-ons subtotal</span>
            <span className="font-serif text-sm">${addOnTotal.toLocaleString()}</span>
          </div>
        )}
      </Card>

      {/* Per-person pull */}
      <Card accent>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <p className="font-serif text-[10px] uppercase tracking-[0.3em] text-accent">
              For the group chat
            </p>
            <h3 className="mt-1 font-serif text-2xl italic">What each {theme.noun.singular} pays</h3>
          </div>
          <span className="font-serif text-4xl">${perPerson.toLocaleString()}</span>
        </div>
        <p className="mt-2 font-serif text-sm italic text-muted-foreground">
          ${totalEstimate.toLocaleString()} split across {headcount} {theme.noun.plural}.
        </p>
      </Card>

      {/* Payment & terms */}
      <Card>
        <CardHeader eyebrow="Payment & terms" title="The receipt" />
        <dl className="mt-4 divide-y divide-dashed divide-foreground/15 font-serif text-sm">
          <Row label={`${cap(theme.occasion)} package`} value={`$${subtotal.toLocaleString()}`} />
          <Row label={theme.addonsTitle} value={`$${addOnTotal.toLocaleString()}`} />
          <Row label={`Deposit ${paid ? "paid" : "due"}`} value={`$${deposit.toLocaleString()}`} />
          <Row label="Remaining balance" value={`$${remaining.toLocaleString()}`} bold />
        </dl>

        {paid && (
          <div className="mt-5 grid gap-2 rounded-md bg-[#FBF6EE] p-4 text-sm sm:grid-cols-2">
            <Meta label="Method" value={`Card ending in ${est.cardLast4 ?? "••••"}`} />
            <Meta label="Confirmation" value={est.paymentRef ?? "—"} mono />
            <Meta label="Paid on" value={fmtDateTime(est.paidAt!)} />
            <Meta label="Processor" value="Worldpay from FIS" />
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-serif text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> PCI-DSS secured</span>
          <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> 256-bit TLS</span>
        </div>

        <ul className="mt-5 list-disc space-y-1.5 pl-5 font-serif text-xs italic leading-relaxed text-muted-foreground">
          <li>The ${deposit} deposit holds the {theme.occasion} for 72 hours pending final contract.</li>
          <li>Refundable up to 14 days prior; applied to your final invoice at settlement.</li>
          <li>Final {theme.noun.singular} headcount confirmed 7 days before the {theme.occasion}.</li>
        </ul>

        {paid && (
          <button onClick={() => window.print()} className="mt-5 flex items-center gap-2 rounded-full border border-border px-4 py-2 font-serif text-xs italic hover:bg-[#FBF6EE]">
            <Download className="h-4 w-4" /> Download receipt
          </button>
        )}
      </Card>
    </div>
  );
};

const StayTab = ({ est, persist, theme }: { est: SavedEstimate; persist: (p: Partial<SavedEstimate>) => void; theme: EventTheme }) => {
  const sb = est.stayBlock ?? { enabled: true, rooms: 6, nights: 3, confirmed: 4 };
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardHeader eyebrow={theme.tabs.stay} title="Where everyone sleeps" />
            <p className="mt-2 max-w-md font-serif text-sm italic text-muted-foreground">
              A block of suites held for your {theme.occasion} at the group rate — adjust the
              count as RSVPs from your {theme.noun.plural} come in.
            </p>
          </div>
          <label className="flex items-center gap-2 font-serif text-xs italic">
            <input
              type="checkbox" checked={sb.enabled}
              onChange={(e) => persist({ stayBlock: { ...sb, enabled: e.target.checked } })}
            />
            Block held
          </label>
        </div>
      </Card>

      {sb.enabled && (
        <>
          <Card>
            <CardHeader eyebrow="Allocation" title="Your room block" />
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Stat label="Suites held" value={String(sb.rooms ?? 0)} />
              <Stat label="Nights" value={String(sb.nights ?? 0)} />
              <Stat label="Guests RSVP'd" value={`${sb.confirmed ?? 0} / ${(sb.rooms ?? 0) * 2}`} />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <NumField label="Suites" value={sb.rooms ?? 0} onChange={(v) => persist({ stayBlock: { ...sb, rooms: v } })} />
              <NumField label="Nights" value={sb.nights ?? 0} onChange={(v) => persist({ stayBlock: { ...sb, nights: v } })} />
              <NumField label="Confirmed" value={sb.confirmed ?? 0} onChange={(v) => persist({ stayBlock: { ...sb, confirmed: v } })} />
            </div>
            <p className="mt-4 font-serif text-xs italic text-muted-foreground">
              Edits to the block accepted up to 30 days before arrival.
            </p>
          </Card>

          <Card>
            <CardHeader eyebrow="Suite types" title="Held at the group rate" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                { name: "Deluxe King Suite", rate: 580, allocated: 1, note: "Single occupancy — host suite" },
                { name: "Garden Double Suite", rate: 450, allocated: Math.max((sb.rooms ?? 0) - 1, 0), note: "Double occupancy — two guests per suite" },
              ].map((r) => (
                <div key={r.name} className="rounded-md border border-border bg-white p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-full bg-[#FBF6EE]">
                      <Hotel className="h-4 w-4 text-accent" />
                    </span>
                    <div className="flex-1">
                      <div className="font-serif text-base">{r.name}</div>
                      <div className="mt-0.5 font-serif text-xs italic text-muted-foreground">
                        ${r.rate} / night · {r.allocated} held
                      </div>
                      <div className="mt-1 font-serif text-[11px] italic text-muted-foreground">{r.note}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

const VendorsTab = ({ est, persist, theme }: { est: SavedEstimate; persist: (p: Partial<SavedEstimate>) => void; theme: EventTheme }) => {
  const [mode, setMode] = useState<"market" | "manage">("market");
  const [cat, setCat] = useState<string>("All");
  const vendors = est.vendors ?? [];

  const filtered = useMemo(() => {
    return cat === "All" ? VENDOR_DIRECTORY : VENDOR_DIRECTORY.filter((v) => v.category === cat);
  }, [cat]);

  const add = (v: typeof VENDOR_DIRECTORY[number]) => {
    if (vendors.some((x) => x.name === v.name)) return;
    persist({ vendors: [...vendors, { id: crypto.randomUUID(), category: v.category, name: v.name, status: "added" }] });
  };
  const setStatus = (id: string, status: "added" | "proposal" | "contracted") => {
    persist({ vendors: vendors.map((v) => (v.id === id ? { ...v, status } : v)) });
  };
  const remove = (id: string) => persist({ vendors: vendors.filter((v) => v.id !== id) });

  const contracted = vendors.filter((v) => v.status === "contracted").length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader eyebrow={theme.tabs.vendors} title="Vendors for your event" />
        <p className="mt-2 max-w-xl font-serif text-sm italic text-muted-foreground">
          Hand-picked specialists who deliver social events at Nobu. Add a vendor
          to start the booking, then mark contracted once signed.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={() => setMode("market")} className={tabPill(mode === "market")}>Vendor market</button>
          <button onClick={() => setMode("manage")} className={tabPill(mode === "manage")}>
            Booked ({vendors.length})
          </button>
        </div>
      </Card>

      {mode === "market" ? (
        <>
          <div className="flex flex-wrap gap-2">
            {["All", ...VENDOR_CATEGORIES].map((c) => (
              <button key={c} onClick={() => setCat(c)} className={chip(cat === c)}>{c}</button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((v) => {
              const added = vendors.some((x) => x.name === v.name);
              return (
                <div key={v.name} className="rounded-md border border-border bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-serif text-[10px] uppercase tracking-[0.22em] text-accent">{v.category}</div>
                      <div className="mt-1 font-serif text-lg">{v.name}</div>
                      <div className="mt-1 flex items-center gap-2 font-serif text-xs italic text-muted-foreground">
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-current text-accent" />{v.rating}</span>
                        <span>· {v.tag}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => add(v)} disabled={added}
                      className={`rounded-full px-3 py-1.5 font-serif text-[11px] uppercase tracking-[0.22em] ${
                        added ? "bg-secondary text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      {added ? "Added" : "Book"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <Card>
          <CardHeader eyebrow="Vendor status" title={`${contracted} of ${vendors.length || 1} contracted`} />
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-accent" style={{ width: `${vendors.length ? (contracted / vendors.length) * 100 : 0}%` }} />
          </div>
          {vendors.length === 0 ? (
            <p className="mt-6 font-serif text-sm italic text-muted-foreground">
              No vendors booked yet — head to the vendor market.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-dashed divide-foreground/15">
              {vendors.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <div className="font-serif">{v.name}</div>
                    <div className="font-serif text-xs italic text-muted-foreground">{v.category}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={v.status} onChange={(e) => setStatus(v.id, e.target.value as "added" | "proposal" | "contracted")}
                      className="rounded-md border border-border bg-background px-2 py-1 font-serif text-xs"
                    >
                      <option value="added">Added</option>
                      <option value="proposal">Proposal sent</option>
                      <option value="contracted">Contracted</option>
                    </select>
                    <button onClick={() => remove(v.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
};

const ItineraryTab = ({ est, persist, theme }: { est: SavedEstimate; persist: (p: Partial<SavedEstimate>) => void; theme: EventTheme }) => {
  const items = est.itinerary && est.itinerary.length > 0 ? est.itinerary : DEFAULT_ITINERARY;
  const [showActivities, setShowActivities] = useState(false);
  const [draftDay, setDraftDay] = useState<1 | 2 | 3>(2);
  const [draft, setDraft] = useState({ time: "8:00 PM", title: "", location: "" });

  const save = (next: SavedEstimate["itinerary"]) => persist({ itinerary: next });

  const addItem = () => {
    if (!draft.title.trim()) return;
    save([
      ...items,
      { id: crypto.randomUUID(), day: draftDay, time: draft.time, title: draft.title, location: draft.location },
    ]);
    setDraft({ time: "8:00 PM", title: "", location: "" });
  };
  const remove = (id: string) => save(items.filter((i) => i.id !== id));
  const addActivity = (a: typeof ACTIVITY_CATALOG[number]) => {
    save([
      ...items,
      { id: crypto.randomUUID(), day: 2, time: "TBD", title: a.title, note: a.note },
    ]);
    setShowActivities(false);
  };

  // Group itinerary items by day (1 = Friday, 2 = Saturday, 3 = Sunday)
  const DAY_META: Record<1 | 2 | 3, { name: string; label: string }> = {
    1: { name: "Friday", label: "Arrivals & welcome" },
    2: { name: "Saturday", label: "The main event" },
    3: { name: "Sunday", label: "Farewell brunch" },
  };
  const byDay = ([1, 2, 3] as const).map((d) => ({
    day: d,
    meta: DAY_META[d],
    items: items.filter((it) => (it.day ?? 1) === d),
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader eyebrow={theme.tabs.itinerary} title="Every detail dialed" />
        <p className="mt-2 max-w-xl font-serif text-sm italic text-muted-foreground">
          Arrivals through farewell. Drop in activities from the catalog to keep
          your {theme.noun.plural} busy between the headline moments.
        </p>
        <button onClick={() => setShowActivities((s) => !s)} className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-serif text-xs italic hover:bg-[#FBF6EE]">
          <Sparkles className="h-3.5 w-3.5 text-accent" /> Browse activities
        </button>
        {showActivities && (
          <div className="mt-4 grid gap-2 rounded-md border border-dashed border-foreground/15 bg-[#FBF6EE]/60 p-3 sm:grid-cols-2">
            {ACTIVITY_CATALOG.map((a) => (
              <button key={a.title} onClick={() => addActivity(a)} className="rounded-md border border-border bg-white p-3 text-left text-sm hover:border-foreground/40">
                <div className="font-serif">{a.title}</div>
                <div className="mt-0.5 font-serif text-xs italic text-muted-foreground">{a.note}</div>
              </button>
            ))}
          </div>
        )}
      </Card>

      {byDay.map(({ day, meta, items: dayItems }) => (
        <Card key={day}>
          <div className="flex items-baseline justify-between border-b border-dashed border-foreground/15 pb-4">
            <div>
              <p className="font-serif text-[10px] uppercase tracking-[0.3em] text-accent">
                {meta.name}
              </p>
              <h3 className="mt-1 font-serif text-2xl italic">{meta.label}</h3>
            </div>
            <span className="font-serif text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Day {day} · {dayItems.length} moments
            </span>
          </div>
          {dayItems.length === 0 ? (
            <p className="mt-5 font-serif text-sm italic text-muted-foreground">
              Nothing planned yet — add a moment below.
            </p>
          ) : (
            <ol className="relative mt-6 space-y-5 border-l border-dashed border-foreground/20 pl-6">
              {dayItems.map((it) => (
                <li key={it.id} className="relative">
                  <span className="absolute -left-[27px] top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full border border-accent bg-background">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-serif text-[10px] uppercase tracking-[0.3em] text-accent">
                        {it.time}
                      </div>
                      <div className="mt-0.5 font-serif text-base">{it.title}</div>
                      {(it.location || it.note) && (
                        <div className="mt-0.5 font-serif text-xs italic text-muted-foreground">
                          {it.location || it.note}
                        </div>
                      )}
                    </div>
                    <button onClick={() => remove(it.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      ))}

      {/* Composer */}
      <Card>
        <CardHeader eyebrow="Add a moment" title="Drop in a new beat" />
        <div className="mt-4 grid gap-2 rounded-md border border-dashed border-foreground/20 p-3 sm:grid-cols-[110px_90px_1fr_140px_auto]">
          <select
            value={draftDay} onChange={(e) => setDraftDay(Number(e.target.value) as 1 | 2 | 3)}
            className="rounded-md border border-border bg-background px-2 py-2 font-serif text-sm"
          >
            <option value={1}>Friday</option>
            <option value={2}>Saturday</option>
            <option value={3}>Sunday</option>
          </select>
          <input
            value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })}
            placeholder="Time" className="rounded-md border border-border bg-background px-2 py-2 font-serif text-sm"
          />
          <input
            value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="What's happening?" className="rounded-md border border-border bg-background px-2 py-2 font-serif text-sm"
          />
          <input
            value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            placeholder="Location" className="rounded-md border border-border bg-background px-2 py-2 font-serif text-sm"
          />
          <button onClick={addItem} className="flex items-center justify-center gap-1.5 rounded-md bg-foreground px-3 py-2 font-serif text-[11px] uppercase tracking-[0.22em] text-background hover:bg-foreground/90">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </Card>
    </div>
  );
};

const GuestsTab = ({
  est, persist, theme, headcount,
}: {
  est: SavedEstimate;
  persist: (p: Partial<SavedEstimate>) => void;
  theme: EventTheme;
  headcount: number;
}) => {
  const guests = est.guestList ?? [];
  const [filter, setFilter] = useState<"all" | "yes" | "pending">("all");
  const [draftName, setDraftName] = useState("");
  const noun = theme.noun;

  const save = (next: SavedEstimate["guestList"]) => persist({ guestList: next });

  const add = () => {
    if (!draftName.trim()) return;
    save([
      ...guests,
      { id: crypto.randomUUID(), name: draftName, party: 1, invited: false, rsvp: "pending" },
    ]);
    setDraftName("");
  };
  const toggleInvited = (id: string) =>
    save(guests.map((g) => (g.id === id ? { ...g, invited: !g.invited } : g)));
  const setRsvp = (id: string, rsvp: "yes" | "no" | "pending") =>
    save(guests.map((g) => (g.id === id ? { ...g, rsvp } : g)));
  const remove = (id: string) => save(guests.filter((g) => g.id !== id));

  const totals = {
    in: guests.filter((g) => g.rsvp === "yes").length,
    waiting: guests.filter((g) => g.rsvp === "pending" && g.invited).length,
    notSent: guests.filter((g) => !g.invited).length,
  };

  const filtered = guests.filter((g) =>
    filter === "all" ? true : filter === "yes" ? g.rsvp === "yes" : g.rsvp === "pending",
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader eyebrow={theme.tabs.guests} title="The guest list" />
        <p className="mt-2 max-w-xl font-serif text-sm italic text-muted-foreground">
          Track who&rsquo;s in, who&rsquo;s still deciding, and who needs the link.
          Up to {headcount} {noun.plural} for the {theme.occasion}.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label={`In for the ${theme.occasion}`} value={String(totals.in)} />
        <Stat label="Waiting on RSVP" value={String(totals.waiting)} />
        <Stat label="Invite not sent" value={String(totals.notSent)} />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {(["all", "yes", "pending"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={chip(filter === f)}>
                {f === "all" ? "All" : f === "yes" ? "In" : "Waiting"}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input placeholder={`Find a ${noun.singular}…`} className="rounded-md border border-border bg-background py-1.5 pl-7 pr-2 font-serif text-xs italic" />
          </div>
        </div>

        <div className="mt-4 grid gap-2 rounded-md border border-dashed border-foreground/20 p-3 sm:grid-cols-[1fr_auto]">
          <input
            value={draftName} onChange={(e) => setDraftName(e.target.value)}
            placeholder={`${cap(noun.singular)} name (or '+1 plus partner')`}
            className="rounded-md border border-border bg-background px-2 py-2 font-serif text-sm"
          />
          <button onClick={add} className="flex items-center justify-center gap-1.5 rounded-md bg-foreground px-4 py-2 font-serif text-[11px] uppercase tracking-[0.22em] text-background hover:bg-foreground/90">
            <Plus className="h-3.5 w-3.5" /> Add {noun.singular}
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-6 text-center font-serif text-sm italic text-muted-foreground">
            No {noun.plural} in this filter yet.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-dashed divide-foreground/15">
            {filtered.map((g) => (
              <li key={g.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 py-3 font-serif text-sm">
                <div>
                  <div>{g.name}</div>
                  <div className="font-serif text-xs italic text-muted-foreground">
                    {g.rsvp === "yes" ? `Locked in for the ${theme.occasion}` : g.invited ? "Invite sent" : "Not invited yet"}
                  </div>
                </div>
                <button
                  onClick={() => toggleInvited(g.id)}
                  className={`rounded-full border px-3 py-1 font-serif text-[11px] uppercase tracking-[0.18em] ${
                    g.invited ? "border-accent text-accent" : "border-border text-muted-foreground"
                  }`}
                >
                  {g.invited ? "Invited" : "Send invite"}
                </button>
                <select
                  value={g.rsvp ?? "pending"} onChange={(e) => setRsvp(g.id, e.target.value as "yes" | "no" | "pending")}
                  className="rounded-md border border-border bg-background px-2 py-1 font-serif text-xs"
                >
                  <option value="pending">Pending</option>
                  <option value="yes">In</option>
                  <option value="no">Can&rsquo;t make it</option>
                </select>
                <button onClick={() => remove(g.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

/* ----------------- Primitives ----------------- */

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Card = ({
  children, accent,
}: { children: React.ReactNode; accent?: boolean }) => (
  <section
    className={`rounded-md border bg-white p-6 sm:p-7 ${
      accent ? "border-2 border-dashed border-accent/40 bg-[#FBF6EE]" : "border-border"
    }`}
  >
    {children}
  </section>
);
const CardHeader = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <>
    <p className="font-serif text-[10px] uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
    <h3 className="mt-1 font-serif text-xl italic">{title}</h3>
  </>
);
const Banner = ({ children, accent }: { children: React.ReactNode; accent?: boolean }) => (
  <div className={`flex items-start gap-4 rounded-md border p-5 sm:p-6 ${accent ? "border-accent/40 bg-accent/5" : "border-border bg-white"}`}>
    {children}
  </div>
);
const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className="flex items-baseline justify-between gap-3 py-3">
    <dt className={`flex-1 italic text-muted-foreground ${bold ? "not-italic font-semibold text-foreground" : ""}`}>{label}</dt>
    <dd className={bold ? "font-semibold" : ""}>{value}</dd>
  </div>
);
const Meta = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div>
    <div className="font-serif text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
    <div className={`font-serif ${mono ? "font-mono" : ""}`}>{value}</div>
  </div>
);
const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md border border-border bg-white p-5">
    <div className="font-serif text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
    <div className="mt-1 font-serif text-3xl">{value}</div>
  </div>
);
const NumField = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <label className="block">
    <span className="font-serif text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
    <input
      type="number" min={0} value={value} onChange={(e) => onChange(Math.max(0, +e.target.value))}
      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-serif text-sm"
    />
  </label>
);
const chip = (active: boolean) =>
  `rounded-full border px-3 py-1.5 font-serif text-[11px] uppercase tracking-[0.18em] transition-colors ${
    active ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"
  }`;
const tabPill = (active: boolean) =>
  `rounded-full border px-4 py-1.5 font-serif text-xs italic transition-colors ${
    active ? "border-foreground bg-foreground text-background not-italic" : "border-border text-muted-foreground hover:text-foreground"
  }`;

export default EventPortal;
