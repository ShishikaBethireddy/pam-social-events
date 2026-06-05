import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Search, X } from "lucide-react";
import { clientMetaLine, hostInitials, type AgentClient } from "@/lib/agentClients";
import { CLIENTS_HREF, clientHref } from "@/lib/agentNav";
import PortalTopNav from "@/components/agent/PortalTopNav";

import imgFlorist from "@/assets/venue-private-dining.jpg";
import imgMusic from "@/assets/venue-rooftop.jpg";
import imgPhoto from "@/assets/event-engagement.jpg";
import imgCake from "@/assets/fb-omakase.jpg";
import imgBeauty from "@/assets/event-shower.jpg";
import imgEntertainment from "@/assets/bachelorette-beach.jpg";
import imgCoord from "@/assets/venue-ballroom.jpg";
import imgVideo from "@/assets/venue-poolside.jpg";

const SOURCE_FILTERS = [
  { label: "All sources", count: "38", key: "all" as const },
  { label: "Property team", count: "12", key: "property" as const },
  { label: "Outside specialists", count: "26", key: "outside" as const },
];

const ROLE_FILTERS = ["All", "Florist", "Photography", "Music", "Cake", "Glam", "Entertainment", "Coordinator"];

type SourceKey = "all" | "property" | "outside";

type Option = { id: string; name: string; sub: string; price: number; selected?: boolean };
type OptionGroup = { title: string; rule: string; mode: "single" | "multi"; options: Option[] };

type Vendor = {
  key: string;
  role: string;
  roleLabel: string;
  name: string;
  price: string;
  commission: string;
  notes: number;
  source: "OUTSIDE" | "PROPERTY TEAM";
  added?: string;
  image: string;
  contact: string;
  groups: OptionGroup[];
};

const VENDORS: Vendor[] = [
  {
    key: "florist",
    role: "Florist · Cabo San Lucas",
    roleLabel: "Florist",
    name: "Casa de Flores",
    price: "$1,200 – $4,800 · per event",
    commission: "+ 4% commission",
    notes: 4,
    source: "OUTSIDE",
    added: "$4,200",
    image: imgFlorist,
    contact: "Maria Cervantes · +52 624 555 0192 · maria@casadeflores.mx",
    groups: [
      {
        title: "WELCOME ARCH / BACKDROP",
        rule: "Choose 1",
        mode: "single",
        options: [
          { id: "florist-arch-boho", name: "Boho macramé backdrop", sub: "Natural macramé + greenery", price: 480 },
          { id: "florist-arch-garden", name: "Garden romance arch", sub: "Pink peonies, white roses", price: 650, selected: true },
          { id: "florist-arch-cascade", name: "Floral cascade arch", sub: "Full cascade, premium mix", price: 920 },
        ],
      },
      {
        title: "TABLE CENTERPIECES",
        rule: "Choose 1",
        mode: "single",
        options: [
          { id: "florist-cp-low", name: "Low garden bowls", sub: "15 tables · mixed seasonal", price: 1800, selected: true },
          { id: "florist-cp-tall", name: "Tall taper candelabra", sub: "Brass + peony cluster", price: 2400 },
          { id: "florist-cp-min", name: "Single-stem trios", sub: "Minimal · 3 stems per table", price: 1200 },
        ],
      },
      {
        title: "PERSONAL FLORALS",
        rule: "Add any",
        mode: "multi",
        options: [
          { id: "florist-bq-host", name: "Host florals", sub: "Peony cluster, eucalyptus", price: 350, selected: true },
          { id: "florist-bq-vip", name: "VIP posies ×5", sub: "Smaller peony posies", price: 1400, selected: true },
          { id: "florist-bout", name: "Lapel pins ×6", sub: "For the welcome line", price: 240 },
        ],
      },
    ],
  },
  {
    key: "dj",
    role: "Music · Cabo San Lucas",
    roleLabel: "Music",
    name: "DJ Marco",
    price: "$900 – $2,400 · per event",
    commission: "+ 5% commission",
    notes: 7,
    source: "OUTSIDE",
    added: "$1,872",
    image: imgMusic,
    contact: "Marco Reyes · +52 624 555 0234 · marco@djmarco.mx",
    groups: [
      {
        title: "RECEPTION DJ SET",
        rule: "Choose 1",
        mode: "single",
        options: [
          { id: "dj-3hr", name: "3hr set", sub: "Cocktail + dinner + first toast", price: 950 },
          { id: "dj-4hr", name: "4hr set", sub: "Cocktail through send-off", price: 1200, selected: true },
          { id: "dj-5hr", name: "5hr + late-night", sub: "Extended dance floor to 1am", price: 1600 },
        ],
      },
      {
        title: "ADD-ONS",
        rule: "Optional · choose any",
        mode: "multi",
        options: [
          { id: "dj-sparkler", name: "Sparkler send-off coordination", sub: "Music cue + timing", price: 222, selected: true },
          { id: "dj-guitar", name: "Cocktail-hour guitarist", sub: "1hr acoustic set", price: 450, selected: true },
          { id: "dj-requests", name: "Custom song requests", sub: "Up to 25 + do-not-play", price: 150 },
        ],
      },
    ],
  },
  {
    key: "photo",
    role: "Photography · San José del Cabo",
    roleLabel: "Photography",
    name: "Lens & Light Studio",
    price: "$2,800 – $6,500 · per event",
    commission: "+ 5% commission",
    notes: 12,
    source: "PROPERTY TEAM",
    image: imgPhoto,
    contact: "Carla Reyes · +52 624 555 0461 · hello@lensandlight.mx",
    groups: [
      {
        title: "COVERAGE PACKAGE",
        rule: "Choose 1",
        mode: "single",
        options: [
          { id: "photo-6hr", name: "6hr coverage", sub: "Welcome + reception · 1 shooter", price: 2800 },
          { id: "photo-8hr", name: "8hr coverage", sub: "Getting ready → send-off", price: 4200, selected: true },
          { id: "photo-10hr", name: "10hr + second shooter", sub: "Full day · 2 shooters", price: 6500 },
        ],
      },
      {
        title: "ADD-ONS",
        rule: "Optional · choose any",
        mode: "multi",
        options: [
          { id: "photo-portrait", name: "Pre-event portrait session", sub: "90-min on-property shoot", price: 650 },
          { id: "photo-drone", name: "Drone aerial coverage", sub: "Licensed pilot · overhead", price: 480 },
          { id: "photo-album", name: "Heirloom print album", sub: "40-page leather-bound", price: 920 },
        ],
      },
    ],
  },
  {
    key: "cake",
    role: "Cake & dessert · Cabo San Lucas",
    roleLabel: "Cake",
    name: "Coco Cakes",
    price: "$420 – $1,800 · per event",
    commission: "+ 4% commission",
    notes: 9,
    source: "OUTSIDE",
    image: imgCake,
    contact: "Lucía Domínguez · +52 624 555 0510 · lucia@cococakes.mx",
    groups: [
      {
        title: "CAKE DESIGN",
        rule: "Choose 1",
        mode: "single",
        options: [
          { id: "cake-2t", name: "2-tier semi-naked", sub: "Vanilla + raspberry · 80 svgs", price: 480 },
          { id: "cake-3t", name: "3-tier pressed flower", sub: "Vanilla bean · 120 svgs", price: 920, selected: true },
          { id: "cake-4t", name: "4-tier signature", sub: "Mixed + edible gold · 200 svgs", price: 1450 },
        ],
      },
      {
        title: "DESSERT ADD-ONS",
        rule: "Optional",
        mode: "multi",
        options: [
          { id: "cake-table", name: "Dessert table · 5 mini-treats", sub: "Macarons, tarts, churros", price: 380 },
          { id: "cake-latenight", name: "Late-night sweet bar", sub: "10pm refresh", price: 220 },
        ],
      },
    ],
  },
  {
    key: "beauty",
    role: "Hair & makeup · Cabo San Lucas",
    roleLabel: "Glam",
    name: "Glow Beauty Co.",
    price: "$160 – $480 · per service",
    commission: "+ 3% commission",
    notes: 5,
    source: "OUTSIDE",
    image: imgBeauty,
    contact: "Ana Torres · +52 624 555 0801 · ana@glowbeauty.mx",
    groups: [
      {
        title: "HOST STYLING",
        rule: "Choose 1",
        mode: "single",
        options: [
          { id: "beauty-host", name: "Host only", sub: "Hair + makeup + trial", price: 480, selected: true },
          { id: "beauty-3", name: "Host + 3 guests", sub: "Day-of", price: 980 },
          { id: "beauty-6", name: "Host + full party (6)", sub: "+ onsite touch-up", price: 1640 },
        ],
      },
      {
        title: "ADD-ONS",
        rule: "Optional",
        mode: "multi",
        options: [
          { id: "beauty-family", name: "Family styling", sub: "Day-of", price: 160 },
          { id: "beauty-touchup", name: "Onsite touch-up", sub: "Reception refresh", price: 280 },
        ],
      },
    ],
  },
  {
    key: "entertainment",
    role: "Entertainment · Live acts",
    roleLabel: "Entertainment",
    name: "Cabo Live Collective",
    price: "$600 – $2,200 · per act",
    commission: "+ 6% commission",
    notes: 3,
    source: "PROPERTY TEAM",
    image: imgEntertainment,
    contact: "Sergio Pérez · +52 624 555 0640 · sergio@cabolive.mx",
    groups: [
      {
        title: "HEADLINE ACT",
        rule: "Choose 1",
        mode: "single",
        options: [
          { id: "ent-mariachi", name: "Mariachi trio", sub: "45-min welcome set", price: 600, selected: true },
          { id: "ent-band", name: "5-piece live band", sub: "Dinner + dancing", price: 2200 },
        ],
      },
      {
        title: "ADD-ONS",
        rule: "Optional",
        mode: "multi",
        options: [
          { id: "ent-fire", name: "Fire dancers", sub: "Beachfront · 15-min", price: 150 },
          { id: "ent-mc", name: "Bilingual emcee", sub: "Spanish + English", price: 120 },
        ],
      },
    ],
  },
  {
    key: "coord",
    role: "Day-of coordinator · Cabo region",
    roleLabel: "Coordinator",
    name: "Día de Plata Planning",
    price: "$1,800 – $3,200 · per event",
    commission: "+ 4.5% commission",
    notes: 6,
    source: "PROPERTY TEAM",
    image: imgCoord,
    contact: "Patricia Núñez · +52 624 555 1102 · patricia@diadeplata.mx",
    groups: [
      {
        title: "COORDINATION PACKAGE",
        rule: "Choose 1",
        mode: "single",
        options: [
          { id: "coord-dayof", name: "Day-of only", sub: "12hr on-site", price: 1800 },
          { id: "coord-monthof", name: "Month-of", sub: "4-week ramp + day-of", price: 2400, selected: true },
          { id: "coord-full", name: "Full planning", sub: "3-month engagement", price: 3200 },
        ],
      },
      {
        title: "ADD-ONS",
        rule: "Optional",
        mode: "multi",
        options: [
          { id: "coord-rehearsal", name: "Rehearsal coordination", sub: "Evening before · 2hr", price: 280 },
          { id: "coord-bags", name: "Welcome bag assembly", sub: "Up to 30 bags", price: 180 },
        ],
      },
    ],
  },
  {
    key: "vid",
    role: "Videography · La Paz",
    roleLabel: "Photography",
    name: "Filo Cinema",
    price: "$2,200 – $5,800 · per event",
    commission: "+ 5% commission",
    notes: 8,
    source: "OUTSIDE",
    image: imgVideo,
    contact: "Felipe Ochoa · +52 612 555 0703 · hi@filo.cinema",
    groups: [
      {
        title: "COVERAGE",
        rule: "Choose 1",
        mode: "single",
        options: [
          { id: "vid-reel", name: "Highlight reel · 4 min", sub: "Cinematic 4-min edit", price: 2200, selected: true },
          { id: "vid-doc", name: "Documentary · 12 min", sub: "Full event + speeches", price: 3800 },
          { id: "vid-feature", name: "Full feature · 30 min", sub: "Highlights + raw footage", price: 5800 },
        ],
      },
      {
        title: "ADD-ONS",
        rule: "Optional",
        mode: "multi",
        options: [
          { id: "vid-teaser", name: "Same-day teaser", sub: "30-sec for reception screen", price: 680 },
          { id: "vid-drone", name: "Drone aerial coverage", sub: "Licensed pilot", price: 480 },
        ],
      },
    ],
  },
];

const TABS = ["Overview", "Proposal", "Room Block", "Travel", "Activity"];

const fmtMoney = (n: number) => "$" + n.toLocaleString("en-US");

function defaultSelection(vendor: Vendor): Set<string> {
  const set = new Set<string>();
  vendor.groups.forEach((g) => g.options.forEach((o) => o.selected && set.add(o.id)));
  return set;
}

function VendorCard({ v, selected, onSelect }: { v: Vendor; selected: boolean; onSelect: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`flex cursor-pointer flex-col overflow-hidden rounded-[14px] bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] ${
        selected ? "outline outline-2 -outline-offset-2 outline-black" : ""
      }`}
    >
      <div className="relative flex h-[160px] items-start justify-between p-3">
        <img src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover" />
        <span className="relative z-10 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.6px] text-[#585563]">
          {v.source === "PROPERTY TEAM" ? <span className="text-[#7b4b94]">PROPERTY TEAM</span> : "OUTSIDE"}
        </span>
        {v.added ? (
          <span className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-[#e7f0ea] px-2.5 py-1 text-[10px] font-semibold tracking-[0.4px] text-[#2f7d57]">
            <span className="size-[5px] rounded-full bg-[#2f7d57]" />
            Added · {v.added}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-1 px-5 pb-5 pt-[18px]">
        <p className="text-[11px] text-[#969199]">{v.role}</p>
        <p className="font-display text-[20px] leading-[26px] text-[#1a1721]">{v.name}</p>
        <p className="font-display text-[13px] text-[#1a1721]">{v.price}</p>
        <div className="flex flex-wrap items-baseline gap-2.5 border-t border-[#f0ecf4] pt-3 text-[11px]">
          <span className="font-medium text-[#7b4b94]">{v.commission}</span>
          <span className="text-[#d1c7da]">·</span>
          <span className="text-[#585563]">Tastemaker notes ({v.notes})</span>
          <span className="text-[#d1c7da]">·</span>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="text-[#585563] underline underline-offset-2 transition-colors hover:text-text-primary"
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionRow({ opt, selected, onToggle }: { opt: Option; selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors ${
        selected ? "bg-white shadow-[0_0_0_1.5px_#000_inset]" : "bg-[#faf9fc] hover:bg-[#f3f1f7]"
      }`}
    >
      <span
        className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-black bg-black" : "border-[#cdc6d6] bg-white"
        }`}
      >
        {selected ? <span className="text-[11px] leading-none text-white">✓</span> : null}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <p className="text-[12px] font-medium leading-4 text-[#1a1721]">{opt.name}</p>
        <p className="text-[10px] leading-[14px] text-[#969199]">{opt.sub}</p>
      </div>
      <p className="font-display text-[13px] text-[#1a1721]">{fmtMoney(opt.price)}</p>
    </button>
  );
}

export default function VendorMarketplace({ client }: { client: AgentClient }) {
  const detailHref = clientHref(client.slug);
  const firstName = client.host.replace(/^The\s+/i, "").split(/\s+/)[0];

  const [source, setSource] = useState<SourceKey>("all");
  const [role, setRole] = useState<string>("All");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());

  const visibleVendors = useMemo(
    () =>
      VENDORS.filter((v) => {
        const sourceKey: SourceKey = v.source === "PROPERTY TEAM" ? "property" : "outside";
        const okSource = source === "all" || sourceKey === source;
        const okRole = role === "All" || v.roleLabel === role;
        return okSource && okRole;
      }),
    [source, role],
  );

  const selectedVendor = useMemo(() => VENDORS.find((v) => v.key === selectedKey) ?? null, [selectedKey]);

  const total = useMemo(() => {
    if (!selectedVendor) return 0;
    let sum = 0;
    selectedVendor.groups.forEach((g) =>
      g.options.forEach((o) => {
        if (selectedOptions.has(o.id)) sum += o.price;
      }),
    );
    return sum;
  }, [selectedVendor, selectedOptions]);

  function selectVendor(v: Vendor) {
    setSelectedKey(v.key);
    setSelectedOptions(defaultSelection(v));
  }

  function clearVendor() {
    setSelectedKey(null);
    setSelectedOptions(new Set());
  }

  function toggleOption(group: OptionGroup, opt: Option) {
    setSelectedOptions((prev) => {
      const next = new Set(prev);
      if (group.mode === "single") {
        if (next.has(opt.id)) return prev;
        group.options.forEach((o) => next.delete(o.id));
        next.add(opt.id);
      } else if (next.has(opt.id)) {
        next.delete(opt.id);
      } else {
        next.add(opt.id);
      }
      return next;
    });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-surface-page font-sans">
      <PortalTopNav active="Clients" />

      {/* Client top strip */}
      <div className="relative flex flex-col overflow-hidden border-b border-[#e7e2f0] bg-white px-6 pt-[18px] md:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: "linear-gradient(to right, #ffffff 35%, rgba(237,231,246,0.85) 75%, rgba(200,174,218,0.55) 100%)" }}
        />

        <Link
          to={CLIENTS_HREF}
          className="relative z-10 inline-flex w-fit items-center gap-1.5 text-[11px] text-[#969199] transition-colors hover:text-text-primary"
        >
          <ArrowRight size={12} strokeWidth={1.4} className="rotate-180" />
          Back to Clients
        </Link>

        <div className="relative z-10 flex flex-col gap-4 pb-4 pt-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {client.photo ? (
              <div className="relative size-[72px] shrink-0 overflow-hidden rounded-full ring-1 ring-[rgba(123,75,148,0.3)] md:size-[120px]">
                <img src={client.photo} alt={client.host} className="h-full w-full object-cover object-center" />
              </div>
            ) : (
              <div className="flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-brand ring-1 ring-[rgba(123,75,148,0.3)] md:size-[120px]">
                <span className="font-display text-[26px] text-text-brand md:text-[42px]">{hostInitials(client.host)}</span>
              </div>
            )}
            <div className="flex flex-col gap-1.5 md:gap-2">
              <h1 className="font-display text-[24px] leading-8 text-[#1a1721] md:text-[30px] md:leading-[40px]">
                {client.host}
              </h1>
              <p className="text-[13px] font-medium leading-5 text-[#585563] md:text-[14px]">{clientMetaLine(client)}</p>
            </div>
          </div>
          <div className="flex w-full gap-3 md:w-auto md:shrink-0">
            <Link
              to={detailHref}
              className="flex flex-1 items-center justify-center rounded-full bg-action-primary px-6 py-3 text-[16px] font-medium text-action-primary-text md:flex-none"
            >
              Message client
            </Link>
          </div>
        </div>

        <div className="scroll-x relative z-10 flex items-start overflow-x-auto">
          {TABS.map((t) => {
            const active = t === "Proposal";
            return (
              <Link
                key={t}
                to={detailHref}
                className={`shrink-0 px-5 pb-3 pt-3.5 text-[14px] leading-5 ${
                  active
                    ? "border-b-2 border-[#7b4b94] font-medium text-[#1a1721]"
                    : "text-[#969199] transition-colors hover:text-text-primary"
                }`}
              >
                {t}
              </Link>
            );
          })}
        </div>
      </div>

      <main className="flex flex-col gap-4 px-6 pb-16 pt-6 md:px-12">
        <div className="flex flex-col gap-4 py-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-[28px] leading-tight text-[#1a1721] md:text-[32px] md:leading-10">
              Vendor marketplace
            </h2>
            <p className="text-[13px] text-[#969199]">
              PAM&apos;s curated team — pick from 38 vendors across the Cabo region for {client.host}&apos;s {client.occasion.toLowerCase()}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex h-[38px] flex-1 items-center gap-2 rounded-lg border border-[#d0d0d0] bg-white px-3.5 lg:w-[280px] lg:flex-none">
              <Search size={15} strokeWidth={1.8} className="shrink-0 text-[#969199]" />
              <input
                type="search"
                placeholder="Search vendors, role, location…"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-text-primary outline-none placeholder:text-[#969199]"
              />
            </label>
            <button
              type="button"
              className="flex h-[38px] shrink-0 items-center gap-1.5 rounded-lg border border-[#d0d0d0] bg-white px-3 text-[13px] text-[#1a1721]"
            >
              <span className="hidden sm:inline">Sort · Most added by advisors</span>
              <span className="sm:hidden">Sort</span>
              <ChevronDown size={12} strokeWidth={2.4} className="text-[#969199]" />
            </button>
          </div>
        </div>

        {/* Source filter */}
        <div className="scroll-x flex items-center gap-1.5 overflow-x-auto">
          <span className="w-[60px] shrink-0 text-[10px] font-semibold uppercase tracking-[0.8px] text-[#969199]">Source</span>
          {SOURCE_FILTERS.map((f) => {
            const active = source === f.key;
            return (
              <button
                key={f.label}
                type="button"
                onClick={() => setSource(f.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-colors ${
                  active ? "bg-black text-white" : "border border-[#e7e2f0] bg-white text-[#585563] hover:border-[#969199]"
                }`}
              >
                <span className="text-[12px] font-medium">{f.label}</span>
                <span className={`text-[11px] ${active ? "text-[#b3b3b3]" : "text-[#969199]"}`}>{f.count}</span>
              </button>
            );
          })}
        </div>

        {/* Role filter */}
        <div className="scroll-x flex items-center gap-1.5 overflow-x-auto">
          <span className="w-[60px] shrink-0 text-[10px] font-semibold uppercase tracking-[0.8px] text-[#969199]">Role</span>
          {ROLE_FILTERS.map((r) => {
            const active = role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  active ? "bg-black text-white" : "border border-[#e7e2f0] bg-white text-[#585563] hover:border-[#969199]"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>

        {/* Market layout */}
        <div className="flex flex-col gap-8 pt-6 lg:flex-row lg:items-start">
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            {visibleVendors.map((v) => (
              <VendorCard key={v.key} v={v} selected={v.key === selectedKey} onSelect={() => selectVendor(v)} />
            ))}
            {visibleVendors.length === 0 ? (
              <p className="col-span-full py-12 text-center text-[13px] text-[#969199]">No vendors match these filters.</p>
            ) : null}
          </div>

          {/* Sticky rail */}
          <div className="w-full lg:w-[440px] lg:shrink-0">
            <div className="flex flex-col rounded-[14px] bg-white p-6 lg:sticky lg:top-24">
              {selectedVendor ? (
                <>
                  <div className="flex items-center gap-3 border-b border-[#f0ecf4] pb-4">
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-[10px] bg-[#ece7f1]">
                      <img src={selectedVendor.image} alt={selectedVendor.name} className="h-full w-full object-cover" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="font-display text-[18px] leading-6 text-[#1a1721]">{selectedVendor.name}</p>
                      <p className="text-[11px] text-[#585563]">{selectedVendor.role}</p>
                      <span className="mt-0.5 w-fit rounded-full bg-[#ede7f6] px-1.5 py-px text-[9px] font-semibold uppercase tracking-[0.6px] text-[#7b4b94]">
                        PAM Vetted
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={clearVendor}
                      aria-label="Close"
                      className="shrink-0 text-[#969199] hover:text-text-primary"
                    >
                      <X size={18} strokeWidth={1.8} />
                    </button>
                  </div>

                  <div className="border-b border-[#f0ecf4] py-3">
                    <p className="text-[11px] text-[#969199]">{selectedVendor.contact}</p>
                  </div>

                  {selectedVendor.groups.map((g) => (
                    <div key={g.title} className="flex flex-col gap-2 border-b border-[#f0ecf4] py-4">
                      <div className="flex items-baseline justify-between text-[11px] text-[#969199]">
                        <p className="font-semibold tracking-[0.8px]">{g.title}</p>
                        <p>{g.rule}</p>
                      </div>
                      {g.options.map((opt) => (
                        <OptionRow
                          key={opt.id}
                          opt={opt}
                          selected={selectedOptions.has(opt.id)}
                          onToggle={() => toggleOption(g, opt)}
                        />
                      ))}
                    </div>
                  ))}

                  <div className="sticky bottom-0 mt-2 flex flex-col gap-2 bg-white pt-4">
                    <button type="button" className="flex items-center justify-between rounded-full bg-black px-5 py-3 text-white">
                      <span className="text-[13px] font-medium">Add to {firstName}&apos;s proposal</span>
                      <span className="font-display text-[15px]">{fmtMoney(total)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={clearVendor}
                      className="flex items-center justify-center py-1 text-[12px] text-[#969199] hover:text-text-primary"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#969199]">
                    {client.host} · Proposal v4 (draft)
                  </p>
                  <p className="mt-0.5 font-display text-[22px] leading-7 text-[#1a1721]">In {firstName}&apos;s proposal</p>
                  <p className="text-[12px] text-[#969199]">{clientMetaLine(client)}</p>

                  <div className="mt-4 border-t border-[#f0ecf4] pt-4">
                    <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.8px] text-[#969199]">Currently added</p>
                    {[
                      { name: `${client.property} · property package`, value: "$3,500" },
                      { name: "Casa de Flores · 4 options", value: "$4,200" },
                      { name: "DJ Marco · 3 options", value: "$1,872" },
                      { name: "F&B estimate · 150 guests", value: "$3,850" },
                    ].map((row) => (
                      <div key={row.name} className="flex items-baseline justify-between gap-3 py-2 text-[12px]">
                        <span className="min-w-0 flex-1 text-[#585563]">{row.name}</span>
                        <span className="whitespace-nowrap font-display text-[13px] text-[#1a1721]">{row.value}</span>
                      </div>
                    ))}
                    <div className="mt-2 flex items-baseline justify-between border-t border-[#f0ecf4] pt-3">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#1a1721]">Estimated total</span>
                      <span className="font-display text-[24px] text-[#1a1721]">$13,422</span>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] text-[#969199]">Select a vendor to configure and add options.</p>

                  <Link
                    to={detailHref}
                    className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg bg-[#faf9fc] px-3.5 py-2.5 text-[12px] text-[#585563] hover:text-text-primary"
                  >
                    <ArrowRight size={12} strokeWidth={1.4} className="rotate-180" />
                    Back to {firstName}&apos;s proposal
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
