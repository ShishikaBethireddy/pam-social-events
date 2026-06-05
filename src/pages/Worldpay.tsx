import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Lock,
  ShieldCheck,
  CreditCard,
  Building2,
  ArrowRight,
} from "lucide-react";
import { auth, estimates } from "@/lib/auth";

type Method = "applepay" | "paypal" | "venmo" | "worldpay" | "card" | "wire";

const Worldpay = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<Record<string, string>>({});
  const [cardNumber, setCardNumber] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<Method>("card");
  const [agreed, setAgreed] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("nobu_booking");
    if (raw) {
      const b = JSON.parse(raw);
      setBooking(b);
      setEmail(b.email || "");
    }
  }, []);

  // ── Balance — derived from the saved estimate when available ──
  const { subtotal, taxes, total, deposit } = useMemo(() => {
    const user = auth.current();
    const latest = user ? estimates.list(user.email)[0] : undefined;
    const sub = latest?.subtotal ?? 5000;
    const tax = Math.round(sub * 0.105);
    return {
      subtotal: sub,
      taxes: tax,
      total: sub + tax,
      deposit: latest?.deposit ?? 500,
    };
  }, []);

  const usd = (n: number) => `$${n.toLocaleString()}`;

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!agreed || submitting) return;
    setSubmitting(true);
    const ref = `WP-${Date.now().toString(36).toUpperCase()}`;
    const last4 = cardNumber.replace(/\s/g, "").slice(-4) || "4242";
    const user = auth.current();
    let paidId: string | undefined;
    if (user) {
      const paid = estimates.markLatestPaid(user.email, {
        paymentRef: ref,
        cardLast4: last4,
      });
      paidId = paid?.id;
    }
    sessionStorage.setItem(
      "nobu_last_payment",
      JSON.stringify({
        ref,
        last4,
        paidAt: Date.now(),
        amount: deposit,
        method,
        estimateId: paidId,
      }),
    );
    setTimeout(() => {
      navigate(paidId ? `/portal/${paidId}` : "/saved");
    }, 1600);
  };

  const inputCls =
    "h-11 w-full rounded-md border border-border bg-white px-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none";
  const eyebrowCls =
    "text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted";

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <main className="mx-auto w-full max-w-5xl px-6 py-10 md:py-12">
        <h1 className="font-title text-3xl italic leading-tight md:text-4xl">
          Payment Details
        </h1>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_340px]">
          {/* ── Left: form ── */}
          <form
            onSubmit={submit}
            className="rounded-xl border border-border bg-white p-6 md:p-8"
          >
            {/* Contact */}
            <div className="flex items-center justify-between gap-3">
              <p className={eyebrowCls}>Your contact information</p>
              <Link
                to="/auth"
                className="text-xs font-medium text-accent underline-offset-4 hover:underline"
              >
                Already have an account? Log in
              </Link>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className={`mt-3 ${inputCls}`}
            />

            {/* Payment method */}
            <p className={`mt-8 ${eyebrowCls}`}>Payment method</p>

            <button
              type="button"
              onClick={() => setMethod("applepay")}
              className={`mt-3 flex h-12 w-full items-center justify-center rounded-md bg-ink font-sans text-sm font-semibold text-paper transition-colors hover:bg-ink-soft ${
                method === "applepay" ? "ring-2 ring-accent ring-offset-2" : ""
              }`}
            >
              Apple Pay
            </button>

            {/* Wallet options — PayPal · Venmo · Worldpay */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(
                [
                  { id: "paypal", label: "PayPal" },
                  { id: "venmo", label: "Venmo" },
                  { id: "worldpay", label: "Worldpay" },
                ] as const
              ).map((w) => {
                const active = method === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setMethod(w.id)}
                    className={`flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors ${
                      active
                        ? "border-accent bg-accent/5 text-ink"
                        : "border-border bg-white text-ink-soft hover:border-accent/60"
                    }`}
                  >
                    {w.id === "worldpay" ? (
                      <span className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-[hsl(216,98%,42%)] text-[10px] font-bold text-white">
                          W
                        </span>
                        {w.label}
                      </span>
                    ) : (
                      w.label
                    )}
                  </button>
                );
              })}
            </div>

            {/* or divider */}
            <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-ink-muted">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>

            {/* Card / Wire tabs */}
            <div className="grid grid-cols-2 overflow-hidden rounded-md border border-border">
              <button
                type="button"
                onClick={() => setMethod("card")}
                className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                  method === "card"
                    ? "bg-ink text-paper"
                    : "bg-white text-ink-soft hover:bg-canvas"
                }`}
              >
                <CreditCard className="h-4 w-4" /> Credit Card
              </button>
              <button
                type="button"
                onClick={() => setMethod("wire")}
                className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                  method === "wire"
                    ? "bg-ink text-paper"
                    : "bg-white text-ink-soft hover:bg-canvas"
                }`}
              >
                <Building2 className="h-4 w-4" /> Wire Transfer
              </button>
            </div>

            {method === "wire" ? (
              <div className="mt-4 rounded-md border border-border bg-canvas px-4 py-4 text-sm leading-relaxed text-ink-soft">
                Wire transfer instructions and the Nobu Hotels beneficiary
                details will be emailed to you after you submit. Your date is held
                for 48 hours while the transfer settles.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="relative">
                  <input
                    placeholder="Card number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className={`${inputCls} pr-10`}
                  />
                  <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={eyebrowCls}>Expiration date</label>
                    <input placeholder="MM / YY" className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className={eyebrowCls}>Security code</label>
                    <input placeholder="CVV" className={inputCls} />
                  </div>
                </div>
              </div>
            )}

            {/* Billing */}
            <p className={`mt-8 ${eyebrowCls}`}>Billing details</p>
            <div className="mt-3 space-y-4">
              <input
                defaultValue={booking.name || ""}
                placeholder="Full name"
                className={inputCls}
              />
              <input
                type="email"
                defaultValue={booking.email || ""}
                placeholder="Billing email"
                className={inputCls}
              />
              <select className={`${inputCls} appearance-none`} defaultValue="US">
                <option value="US">United States</option>
                <option value="MX">Mexico</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <select
                  className={`${inputCls} appearance-none`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    State
                  </option>
                  {[
                    "CA",
                    "NY",
                    "TX",
                    "FL",
                    "PA",
                    "IL",
                    "WA",
                    "MA",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input placeholder="Postcode" className={inputCls} />
              </div>
            </div>
          </form>

          {/* ── Right: balance + agreement ── */}
          <aside className="space-y-4">
            {/* Balance card */}
            <div className="rounded-xl bg-ink p-6 text-paper">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/50">
                Current balance
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-paper/75">Package &amp; venue</dt>
                  <dd className="font-medium">{usd(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-paper/75">Taxes &amp; service</dt>
                  <dd className="font-medium">{usd(taxes)}</dd>
                </div>
                <div className="flex justify-between border-t border-paper/15 pt-3">
                  <dt className="text-paper/75">Estimated total</dt>
                  <dd className="font-medium">{usd(total)}</dd>
                </div>
              </dl>
              <div className="mt-4 flex items-end justify-between border-t border-paper/15 pt-4">
                <div>
                  <p className="font-sans text-base font-semibold">
                    Deposit due today
                  </p>
                  <p className="text-[11px] text-paper/60">
                    Refundable within the next 48 hrs
                  </p>
                </div>
                <p className="font-title text-2xl italic">{usd(deposit)}</p>
              </div>
            </div>

            {/* Agreement card */}
            <div className="rounded-xl border border-border bg-white p-6">
              <button
                type="button"
                onClick={() => setTermsOpen(true)}
                className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-accent underline-offset-4 hover:underline"
              >
                Social Events Service Agreement
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-md bg-accent/5 px-3.5 py-3">
                <Checkbox
                  checked={agreed}
                  onCheckedChange={(v) => setAgreed(v === true)}
                  className="mt-0.5 border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
                />
                <span className="text-[13px] leading-snug text-ink-soft">
                  I&apos;ve reviewed and agree to the Social Events Service
                  Agreement.
                </span>
              </label>

              <button
                type="button"
                onClick={() => submit()}
                disabled={!agreed || submitting}
                className="mt-4 w-full rounded-full bg-accent py-3.5 font-sans text-sm font-semibold text-accent-foreground transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-ink-muted disabled:ring-1 disabled:ring-inset disabled:ring-border"
              >
                {submitting ? "Processing payment…" : `Submit Payment · ${usd(deposit)}`}
              </button>

              <button
                type="button"
                onClick={() => navigate("/plan")}
                className="mt-3 block w-full text-center text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Cancel and return to Nobu
              </button>
            </div>

            {/* Trust */}
            <div className="space-y-2 px-1 text-[11px] text-ink-muted">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> PCI-DSS Level 1 Certified
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> 256-bit TLS encryption · processed
                by Worldpay
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Terms & Conditions ── */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto bg-white sm:max-w-lg">
          <DialogTitle className="font-title text-2xl italic">
            Social Events Service Agreement
          </DialogTitle>
          <div className="mt-2 space-y-4 text-[13px] leading-relaxed text-ink-soft">
            <p>
              This Social Events Service Agreement (&ldquo;Agreement&rdquo;) is
              entered into between Nobu Hotels (&ldquo;Nobu&rdquo;) and the person
              booking the event (&ldquo;Host&rdquo;) for the private celebration
              described in your estimate.
            </p>
            {[
              {
                h: "1. Refundable date hold",
                b: "The deposit due today secures your selected date(s) and venue. It is fully refundable if cancelled within 48 hours of payment. After 48 hours, the deposit is applied toward your final balance and becomes non-refundable.",
              },
              {
                h: "2. Final guest count",
                b: "A final, guaranteed guest count is due 7 days before the event. Charges are based on the guaranteed count or the actual attendance, whichever is greater. Increases after this date are accommodated on a best-effort basis.",
              },
              {
                h: "3. Balance & payment",
                b: "The remaining balance is due 14 days prior to the event date. Accepted methods include Apple Pay, PayPal, Venmo, Worldpay (credit card), and wire transfer. All amounts are in USD and exclusive of applicable taxes and service charges unless stated.",
              },
              {
                h: "4. Cancellation & rescheduling",
                b: "Cancellations made more than 30 days out forfeit the deposit only. Cancellations within 30 days may incur charges up to the full estimated total. One complimentary reschedule is permitted subject to availability if requested at least 14 days in advance.",
              },
              {
                h: "5. Food, beverage & service",
                b: "Menus, dietary accommodations, and beverage programs are confirmed during planning. Outside food and beverage is not permitted. A service charge and local taxes apply to all food and beverage.",
              },
              {
                h: "6. Conduct & liability",
                b: "The Host is responsible for the conduct of all guests and for any damage to the venue. Nobu reserves the right to end an event for unsafe or unlawful behavior. Nobu is not liable for items left on the premises.",
              },
              {
                h: "7. Force majeure",
                b: "Neither party is liable for failure to perform due to events beyond reasonable control (acts of nature, government action, etc.). In such cases Nobu will work in good faith to reschedule the event.",
              },
            ].map((s) => (
              <div key={s.h}>
                <p className="font-sans text-[13px] font-semibold text-ink">
                  {s.h}
                </p>
                <p className="mt-1">{s.b}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setAgreed(true);
              setTermsOpen(false);
            }}
            className="mt-2 w-full rounded-full bg-accent py-3 font-sans text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
          >
            I agree to these terms
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Worldpay;
