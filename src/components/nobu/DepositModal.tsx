import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";

type Booking = {
  eventType?: string;
  guests?: string;
  dates?: string;
  venue?: string;
  fnb?: string;
  name?: string;
  email?: string;
};

export const DepositModal = ({
  open,
  onOpenChange,
  booking,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  booking: Booking;
}) => {
  const navigate = useNavigate();

  const proceed = () => {
    sessionStorage.setItem("nobu_booking", JSON.stringify(booking));
    onOpenChange(false);
    navigate("/worldpay");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 bg-background border-border">
        <DialogHeader className="px-8 pt-8 pb-2">
          <p className="eyebrow">Refundable Date Hold</p>
          <DialogTitle className="font-serif text-3xl font-light leading-tight mt-2">
            Confirm your deposit.
          </DialogTitle>
        </DialogHeader>

        <div className="px-8 py-4 space-y-5">
          <div className="bg-secondary/60 p-4 text-sm space-y-1.5 border border-border">
            <div className="flex justify-between"><span className="text-muted-foreground">Celebration</span><span>{booking.eventType}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span>{booking.guests}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Dates</span><span>{booking.dates}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Venue</span><span className="text-right">{booking.venue}</span></div>
            <div className="flex justify-between border-t border-border pt-2 mt-2 font-medium">
              <span>Refundable Deposit</span><span>USD $250.00</span>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-2">Payment Terms</p>
            <ul className="text-xs text-muted-foreground space-y-1.5 leading-relaxed list-disc list-inside">
              <li>A $250 deposit secures your event date for 72 hours pending final confirmation.</li>
              <li>Fully refundable up to 14 days prior to the event date.</li>
              <li>Deposit is applied against your final event invoice at settlement.</li>
              <li>Cancellations within 14 days forfeit the deposit per Nobu Events policy.</li>
              <li>Payment processed securely by Worldpay. Nobu does not store card details.</li>
            </ul>
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-3">
            <div className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> PCI-DSS secured</div>
            <div className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Powered by Worldpay</div>
          </div>
        </div>

        <div className="px-8 pb-8">
          <Button
            onClick={proceed}
            className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 h-12"
          >
            Proceed to Make Payment
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-[11px] text-muted-foreground mt-3 text-center">
            By proceeding you agree to the Nobu Events terms and the Worldpay payment terms.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};