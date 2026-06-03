import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Calendar, CheckCircle2, Download,
  Hotel, Lock, MapPin, Phone, Plus, Search, ShieldCheck, Sparkles, Star,
  Trash2, Users,
} from "lucide-react";
import { estimates, SavedEstimate, useAuth } from "@/lib/auth";
import bacheloretteHero from "@/assets/bachelorette-beach.jpg";
import { Nav } from "@/components/nobu/Nav";
import { MenuOverlay } from "@/components/nobu/MenuOverlay";
import { SpecialistSheet } from "@/components/nobu/SpecialistSheet";

const fmtDateTime = (ts: number) =>
  new Date(ts).toLocaleString(undefined, {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });

type TabKey = "proposal" | "stay" | "vendors" | "itinerary" | "guests";

// ── Bachelorette-flavored tab labels — the underlying data model
// stays the same (proposal / stay / vendors / itinerary / guests)
// so all persistence keeps working.
const TABS: { key: TabKey; label: string }[] = [
  { key: "proposal", label: "The Plan" },
  { key: "stay", label: "The Suites" },
  { key: "vendors", label: "Bride Squad" },
  { key: "itinerary", label: "The Weekend" },
  { key: "guests", label: "Bridesmaids" },
];

// What's included in the core bachelorette weekend package.
const CORE_PLAN = [
  "3-night private weekend at Nobu Hotel Los Cabos",
  "Bride's deluxe suite + 5 shared bridesmaid suites",
  "Welcome cabana & cocktail flight on arrival",
  "Omakase tasting dinner at Nobu Restaurant",
  "Group spa morning at Esencia (12 treatments)",
  "Beach photoshoot with bride-tribe styling kit",
  "Signature chef's table dinner at Yakusoku Garden",
  "Farewell brunch with bottomless mimosas",
  "Dedicated bachelorette concierge, 24/7",
];

// Bachelorette add-ons — designed for the maid of honor to tap
// while planning, with prices the bridal party can split.
const ADDON_CATALOG = [
  { id: "a-glam", title: "Glam squad", desc: "On-suite hair + makeup for 12 bridesmaids", price: 3200 },
  { id: "a-sash", title: "Sash & robe set", desc: "Matching satin robes + custom sashes, all 12", price: 980 },
  { id: "a-catamaran", title: "Sunset catamaran", desc: "Private 3-hr sail with bar service", price: 4500 },
  { id: "a-neon", title: "Custom neon sign", desc: "'Bride to be' or hashtag, 24×18 in", price: 650 },
  { id: "a-balloon", title: "Balloon arch + photo wall", desc: "Blush + champagne palette, Polaroid station", price: 1450 },
  { id: "a-mixology", title: "In-suite mixology class", desc: "Master mixologist, signature bride cocktail", price: 1100 },
  { id: "a-late", title: "Late-night sushi + champagne", desc: "After-party in the bride's suite", price: 1850 },
  { id: "a-photo", title: "Bride-tribe photographer", desc: "3-hour photoshoot + 100 edited shots", price: 2400 },
];

const VENDOR_CATEGORIES = [
  "Maid of Honor support", "Hair & Makeup", "Bride-tribe Photography",
  "Sashes & Accessories", "Catamaran & Yachts", "Florals & Décor",
  "Mixologists", "Glam wellness",
];

const VENDOR_DIRECTORY = [
  { category: "Maid of Honor support", name: "Cabo Bachelorette Co.", tag: "Full-weekend planning", rating: 4.9 },
  { category: "Maid of Honor support", name: "Hen Party Concierge", tag: "On-site coordinator", rating: 4.8 },
  { category: "Hair & Makeup", name: "Maven Glam Squad", tag: "On-suite for 12", rating: 4.9 },
  { category: "Hair & Makeup", name: "Sunset Studio Stylists", tag: "Beach-ready looks", rating: 4.8 },
  { category: "Bride-tribe Photography", name: "Frame & Field", tag: "Documentary candid", rating: 4.9 },
  { category: "Bride-tribe Photography", name: "Golden Hour Co.", tag: "Editorial portrait", rating: 4.8 },
  { category: "Sashes & Accessories", name: "Pearl & Veil Atelier", tag: "Custom monogrammed", rating: 4.9 },
  { category: "Sashes & Accessories", name: "Hen House Boutique", tag: "Robe + sash sets", rating: 4.7 },
  { category: "Catamaran & Yachts", name: "Pacific Sail Co.", tag: "Private sunset sail", rating: 4.9 },
  { category: "Catamaran & Yachts", name: "Cabo Luxe Yachts", tag: "Top-deck bar", rating: 4.8 },
  { category: "Florals & Décor", name: "Wildflower Studio", tag: "Blush + champagne", rating: 4.8 },
  { category: "Florals & Décor", name: "Atelier Bloom", tag: "Statement installs", rating: 4.7 },
  { category: "Mixologists", name: "Highball Hospitality", tag: "Bride's signature cocktail", rating: 4.8 },
  { category: "Glam wellness", name: "Esencia Spa", tag: "Group treatments", rating: 4.9 },
];

// 3-day bachelorette weekend run-sheet — mirrors the structure shown
// on the estimate page so the bride sees the same agenda end-to-end.
const DEFAULT_ITINERARY = [
  { id: "i1", day: 1, time: "4:00 PM", title: "Welcome cabana & cocktails", location: "Beach Pool · Friday" },
  { id: "i2", day: 1, time: "7:30 PM", title: "Welcome dinner — omakase tasting", location: "Nobu Restaurant · Friday" },
  { id: "i3", day: 2, time: "10:00 AM", title: "Group spa morning", location: "Esencia Spa · Saturday" },
  { id: "i4", day: 2, time: "1:30 PM", title: "Light lunch on the terrace", location: "Malibu Farm · Saturday" },
  { id: "i5", day: 2, time: "4:00 PM", title: "Beach photoshoot & bride-tribe setup", location: "Pedregal Beach · Saturday" },
  { id: "i6", day: 2, time: "8:00 PM", title: "Signature chef's table dinner", location: "Yakusoku Garden · Saturday" },
  { id: "i7", day: 3, time: "11:00 AM", title: "Farewell brunch with bottomless mimosas", location: "Shiawase Terrace · Sunday" },
];

// Activities the maid of honor can drop into the weekend.
const ACTIVITY_CATALOG = [
  { title: "Mr. & Mrs. game", note: "10 min with the bride and her partner on speakerphone" },
  { title: "Bridal trivia & superlatives", note: "Host-led — 'Most likely to cry first', etc." },
  { title: "Lingerie shower hour", note: "Reserved suite, champagne service, gift opening" },
  { title: "Polaroid scavenger hunt", note: "Teams of 3, photo prompts around the resort" },
  { title: "Wine pairing tasting", note: "Sommelier-led, 5 pours with light bites" },
  { title: "Karaoke after-party", note: "Curated bride songbook, pro mic + screen" },
  { title: "Group dance lesson", note: "Latin / salsa basics with a local instructor" },
  { title: "Beach bonfire & s'mores", note: "Sunset bonfire, blanket setup, late-night sweets" },
  { title: "Bride bingo", note: "Cards customized to the bride, prizes for full board" },
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
          <p className="text-muted-foreground">We couldn't find that bachelorette weekend.</p>
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
    (s, addonId) => s + (ADDON_CATALOG.find((a) => a.id === addonId)?.price ?? 0), 0,
  );
  const totalEstimate = subtotal + addOnTotal;

  // Bachelorette-specific derived figures.
  const totalGuests = 12;
  const bridesmaids = totalGuests - 1;
  const perBridesmaid = Math.round(totalEstimate / bridesmaids);
  const firstName = user.name?.split(" ")[0] || "Sofia";

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
            Bachelorette weekend portal
          </p>
          <div className="hidden text-xs text-muted-foreground sm:block">{user.email}</div>
        </div>
      </div>

      {/* Bachelorette hero — postcard split */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-[1fr_1.1fr]">
          <div className="relative h-[220px] overflow-hidden md:h-auto">
            <img
              src={bacheloretteHero}
              alt="Bridesmaids celebrating on the beach"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1.5 font-serif text-[10px] uppercase tracking-[0.3em] text-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-accent" strokeWidth={1.8} />
              Bachelorette portal
            </div>
          </div>
          <div className="relative flex flex-col justify-center gap-4 bg-white px-6 py-8 md:px-10 md:py-12">
            <p className="font-serif text-[10px] uppercase tracking-[0.4em] text-accent">
              Bachelorette weekend · Nobu Los Cabos
            </p>
            <h1 className="font-serif text-4xl leading-[1.05] sm:text-5xl">
              <span className="italic">{firstName}&rsquo;s</span> last hurrah
            </h1>
            <p className="max-w-md font-serif text-[14px] italic leading-relaxed text-muted-foreground">
              Your live planning portal — every space booked, every reservation
              held, every bridesmaid in the loop.
            </p>
            <div className="mt-1 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {est.dates && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-accent" />
                  {est.dates} · 3 nights
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-accent" />
                1 bride + {bridesmaids} bridesmaids
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
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`whitespace-nowrap border-b-2 px-4 py-3 font-serif text-sm transition-colors ${
                  tab === t.key
                    ? "border-foreground italic text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-8 sm:py-10">
        {tab === "proposal" && (
          <ProposalTab
            est={est}
            paid={paid}
            subtotal={subtotal}
            deposit={deposit}
            addOnTotal={addOnTotal}
            totalEstimate={totalEstimate}
            perBridesmaid={perBridesmaid}
            bridesmaids={bridesmaids}
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
        {tab === "stay" && <StayTab est={est} persist={persist} />}
        {tab === "vendors" && <VendorsTab est={est} persist={persist} />}
        {tab === "itinerary" && <ItineraryTab est={est} persist={persist} />}
        {tab === "guests" && <GuestsTab est={est} persist={persist} bridesmaids={bridesmaids} />}
      </main>

      {/* Sticky footer */}
      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3 text-sm">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <span className="font-serif text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Weekend total
            </span>
            <span className="font-serif text-lg">${totalEstimate.toLocaleString()}</span>
            <span className="hidden font-serif text-xs italic text-muted-foreground sm:inline">
              · ~${perBridesmaid.toLocaleString()} / bridesmaid
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              · ${deposit} deposit {paid ? "paid" : "due"}
            </span>
          </div>
          <a
            href="tel:+15555550199"
            className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 font-serif text-[11px] uppercase tracking-[0.22em] text-background hover:bg-foreground/90"
          >
            <Phone className="h-3.5 w-3.5" /> Bridal concierge
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
  est, paid, subtotal, deposit, addOnTotal, totalEstimate, perBridesmaid,
  bridesmaids, user, firstName, onToggleAddOn,
}: {
  est: SavedEstimate; paid: boolean; subtotal: number; deposit: number;
  addOnTotal: number; totalEstimate: number; perBridesmaid: number;
  bridesmaids: number; user: { email: string }; firstName: string;
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
              Weekend locked in
            </p>
            <h2 className="mt-2 font-serif text-2xl italic">
              {firstName}&rsquo;s weekend is officially on the books.
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
              Hold the weekend with a ${deposit} deposit.
            </h2>
            <p className="mt-2 font-serif text-sm italic text-muted-foreground">
              Refundable up to 14 days before the bachelorette weekend.
            </p>
          </div>
        </Banner>
      )}

      {/* Core plan */}
      <Card>
        <CardHeader eyebrow="The Plan" title="What the weekend includes" />
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {CORE_PLAN.map((b) => (
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
        <CardHeader eyebrow="Make it hers" title="Bachelorette add-ons" />
        <p className="mt-2 max-w-xl font-serif text-sm italic text-muted-foreground">
          Pick what makes the weekend feel like {firstName}. Pricing splits across
          {" "}{bridesmaids} bridesmaids — final tally updates as you toggle.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {ADDON_CATALOG.map((a) => {
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

      {/* Per-bridesmaid pull */}
      <Card accent>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <p className="font-serif text-[10px] uppercase tracking-[0.3em] text-accent">
              For the group chat
            </p>
            <h3 className="mt-1 font-serif text-2xl italic">What each bridesmaid pays</h3>
          </div>
          <span className="font-serif text-4xl">${perBridesmaid.toLocaleString()}</span>
        </div>
        <p className="mt-2 font-serif text-sm italic text-muted-foreground">
          ${totalEstimate.toLocaleString()} split across {bridesmaids} bridesmaids — the
          bride&rsquo;s portion covered as a group gift.
        </p>
      </Card>

      {/* Payment & terms */}
      <Card>
        <CardHeader eyebrow="Payment & terms" title="The receipt" />
        <dl className="mt-4 divide-y divide-dashed divide-foreground/15 font-serif text-sm">
          <Row label="Weekend package" value={`$${subtotal.toLocaleString()}`} />
          <Row label="Bachelorette add-ons" value={`$${addOnTotal.toLocaleString()}`} />
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
          <li>The ${deposit} deposit holds the weekend for 72 hours pending final contract.</li>
          <li>Refundable up to 14 days prior; applied to your final invoice at settlement.</li>
          <li>Final bridesmaid headcount confirmed 7 days before the weekend.</li>
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

const StayTab = ({ est, persist }: { est: SavedEstimate; persist: (p: Partial<SavedEstimate>) => void }) => {
  const sb = est.stayBlock ?? { enabled: true, rooms: 6, nights: 3, confirmed: 4 };
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardHeader eyebrow="The Suites" title="Where everyone sleeps" />
            <p className="mt-2 max-w-md font-serif text-sm italic text-muted-foreground">
              Six suites held for the weekend — the bride&rsquo;s own deluxe king
              plus five shared bridesmaid suites at the group rate.
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
            <CardHeader eyebrow="Allocation" title="Your weekend room block" />
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Stat label="Suites held" value={String(sb.rooms ?? 0)} />
              <Stat label="Nights" value={String(sb.nights ?? 0)} />
              <Stat label="Bridesmaids RSVP'd" value={`${sb.confirmed ?? 0} / ${(sb.rooms ?? 0) * 2}`} />
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
            <CardHeader eyebrow="Suite types" title="Held at the bridal-party rate" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                { name: "Bride's Deluxe King", rate: 580, allocated: 1, note: "Single occupancy — bride's suite" },
                { name: "Bridesmaid Garden Suite", rate: 450, allocated: Math.max((sb.rooms ?? 0) - 1, 0), note: "Double occupancy — two bridesmaids per suite" },
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

const VendorsTab = ({ est, persist }: { est: SavedEstimate; persist: (p: Partial<SavedEstimate>) => void }) => {
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
        <CardHeader eyebrow="Build the bride squad" title="Vendors for the weekend" />
        <p className="mt-2 max-w-xl font-serif text-sm italic text-muted-foreground">
          Hand-picked specialists who deliver bachelorette weekends. Add a vendor
          to start the booking, then mark contracted once signed.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={() => setMode("market")} className={tabPill(mode === "market")}>Bride-squad market</button>
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
          <CardHeader eyebrow="Squad status" title={`${contracted} of ${vendors.length || 1} contracted`} />
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-accent" style={{ width: `${vendors.length ? (contracted / vendors.length) * 100 : 0}%` }} />
          </div>
          {vendors.length === 0 ? (
            <p className="mt-6 font-serif text-sm italic text-muted-foreground">
              No squad members booked yet — head to the bride-squad market.
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

const ItineraryTab = ({ est, persist }: { est: SavedEstimate; persist: (p: Partial<SavedEstimate>) => void }) => {
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
    2: { name: "Saturday", label: "Spa, sun & celebration" },
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
        <CardHeader eyebrow="The Weekend" title="Three days, every detail dialed" />
        <p className="mt-2 max-w-xl font-serif text-sm italic text-muted-foreground">
          Friday arrivals through Sunday brunch. Drop in bachelorette activities
          from the catalog to keep the bride-tribe energy up.
        </p>
        <button onClick={() => setShowActivities((s) => !s)} className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-serif text-xs italic hover:bg-[#FBF6EE]">
          <Sparkles className="h-3.5 w-3.5 text-accent" /> Browse bachelorette activities
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
        <CardHeader eyebrow="Add a moment" title="Drop in a new bachelorette beat" />
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
  est, persist, bridesmaids,
}: {
  est: SavedEstimate;
  persist: (p: Partial<SavedEstimate>) => void;
  bridesmaids: number;
}) => {
  const guests = est.guestList ?? [];
  const [filter, setFilter] = useState<"all" | "yes" | "pending">("all");
  const [draftName, setDraftName] = useState("");

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
        <CardHeader eyebrow="Bridesmaids" title="The bride tribe" />
        <p className="mt-2 max-w-xl font-serif text-sm italic text-muted-foreground">
          Track who&rsquo;s in, who&rsquo;s still deciding, and who needs the link.
          Up to {bridesmaids} bridesmaid invites for the weekend.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="In for the weekend" value={String(totals.in)} />
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
            <input placeholder="Find a bridesmaid…" className="rounded-md border border-border bg-background py-1.5 pl-7 pr-2 font-serif text-xs italic" />
          </div>
        </div>

        <div className="mt-4 grid gap-2 rounded-md border border-dashed border-foreground/20 p-3 sm:grid-cols-[1fr_auto]">
          <input
            value={draftName} onChange={(e) => setDraftName(e.target.value)}
            placeholder="Bridesmaid name (or '+1 plus partner')"
            className="rounded-md border border-border bg-background px-2 py-2 font-serif text-sm"
          />
          <button onClick={add} className="flex items-center justify-center gap-1.5 rounded-md bg-foreground px-4 py-2 font-serif text-[11px] uppercase tracking-[0.22em] text-background hover:bg-foreground/90">
            <Plus className="h-3.5 w-3.5" /> Add bridesmaid
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-6 text-center font-serif text-sm italic text-muted-foreground">
            No bridesmaids in this filter yet.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-dashed divide-foreground/15">
            {filtered.map((g) => (
              <li key={g.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 py-3 font-serif text-sm">
                <div>
                  <div>{g.name}</div>
                  <div className="font-serif text-xs italic text-muted-foreground">
                    {g.rsvp === "yes" ? "Locked in for the weekend" : g.invited ? "Invite sent" : "Not invited yet"}
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
