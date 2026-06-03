import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ShieldCheck, CreditCard } from "lucide-react";
import { auth, estimates } from "@/lib/auth";

const Worldpay = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<Record<string, string>>({});
  const [cardNumber, setCardNumber] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("nobu_booking");
    if (raw) setBooking(JSON.parse(raw));
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ref = `WP-${Date.now().toString(36).toUpperCase()}`;
    const last4 = cardNumber.replace(/\s/g, "").slice(-4) || "4242";
    const user = auth.current();
    let paidId: string | undefined;
    if (user) {
      const paid = estimates.markLatestPaid(user.email, { paymentRef: ref, cardLast4: last4 });
      paidId = paid?.id;
    }
    sessionStorage.setItem(
      "nobu_last_payment",
      JSON.stringify({ ref, last4, paidAt: Date.now(), amount: 500, estimateId: paidId }),
    );
    setTimeout(() => {
      navigate(paidId ? `/portal/${paidId}` : "/saved");
    }, 1600);
  };

  return (
    <div className="min-h-screen bg-[hsl(220,15%,96%)] text-[hsl(220,20%,15%)] flex flex-col">
      {/* Worldpay header */}
      <header className="bg-white border-b border-[hsl(220,15%,88%)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-[hsl(216,98%,42%)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <div>
              <div className="font-semibold text-[15px] tracking-tight text-[hsl(216,98%,32%)]">worldpay</div>
              <div className="text-[9px] uppercase tracking-wider text-[hsl(220,10%,45%)]">from FIS</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[hsl(220,10%,45%)]">
            <Lock className="h-3.5 w-3.5" />
            Secure checkout
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 grid md:grid-cols-[1fr_360px] gap-8">
        {/* Payment form */}
        <div className="bg-white border border-[hsl(220,15%,88%)] rounded p-8">
          <h1 className="text-xl font-semibold mb-1">Payment details</h1>
          <p className="text-sm text-[hsl(220,10%,45%)] mb-6">
            Enter your card information to complete the transaction with Nobu Hotels.
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[hsl(220,20%,25%)]">Cardholder name</Label>
              <Input required defaultValue={booking.name || ""} className="h-11 bg-white border-[hsl(220,15%,82%)] rounded" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[hsl(220,20%,25%)]">Card number</Label>
              <div className="relative">
              <Input
                required
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="h-11 bg-white border-[hsl(220,15%,82%)] rounded pr-10"
              />
                <CreditCard className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,55%)]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[hsl(220,20%,25%)]">Expiry date</Label>
                <Input required placeholder="MM / YY" className="h-11 bg-white border-[hsl(220,15%,82%)] rounded" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[hsl(220,20%,25%)]">Security code</Label>
                <Input required placeholder="CVV" className="h-11 bg-white border-[hsl(220,15%,82%)] rounded" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[hsl(220,20%,25%)]">Billing postcode</Label>
              <Input required placeholder="e.g. 10013" className="h-11 bg-white border-[hsl(220,15%,82%)] rounded" />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded bg-[hsl(216,98%,42%)] hover:bg-[hsl(216,98%,36%)] text-white font-medium"
            >
              {submitting ? "Processing payment…" : "Pay USD $250.00"}
            </Button>

            <button
              type="button"
              onClick={() => navigate("/plan")}
              className="w-full text-xs text-[hsl(220,10%,45%)] hover:text-[hsl(216,98%,42%)] underline-offset-4 hover:underline"
            >
              Cancel and return to Nobu
            </button>
          </form>
        </div>

        {/* Order summary */}
        <aside className="space-y-4">
          <div className="bg-white border border-[hsl(220,15%,88%)] rounded p-6">
            <div className="text-[10px] uppercase tracking-wider text-[hsl(220,10%,45%)] mb-2">Merchant</div>
            <div className="font-serif text-lg tracking-[0.2em]">NOBU HOTELS</div>
            <div className="text-xs text-[hsl(220,10%,45%)] mt-0.5">Social Events · Date Hold</div>

            <div className="mt-5 pt-5 border-t border-[hsl(220,15%,88%)] space-y-2 text-sm">
              {booking.eventType && <div className="flex justify-between"><span className="text-[hsl(220,10%,45%)]">Event</span><span>{booking.eventType}</span></div>}
              {booking.dates && <div className="flex justify-between"><span className="text-[hsl(220,10%,45%)]">Date</span><span>{booking.dates}</span></div>}
              {booking.guests && <div className="flex justify-between"><span className="text-[hsl(220,10%,45%)]">Guests</span><span>{booking.guests}</span></div>}
              {booking.venue && <div className="flex justify-between gap-3"><span className="text-[hsl(220,10%,45%)]">Venue</span><span className="text-right">{booking.venue}</span></div>}
            </div>

            <div className="mt-5 pt-5 border-t border-[hsl(220,15%,88%)] flex justify-between font-semibold">
              <span>Total</span>
              <span>USD $250.00</span>
            </div>
          </div>

          <div className="text-[11px] text-[hsl(220,10%,45%)] space-y-2 px-1">
            <div className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> PCI-DSS Level 1 Certified</div>
            <div className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> 256-bit TLS encryption</div>
            <p className="pt-2">Your payment is processed securely by Worldpay. Card details are never shared with the merchant.</p>
          </div>
        </aside>
      </main>

      <footer className="border-t border-[hsl(220,15%,88%)] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between text-[11px] text-[hsl(220,10%,45%)]">
          <div>© Worldpay {new Date().getFullYear()}</div>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Help</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Worldpay;