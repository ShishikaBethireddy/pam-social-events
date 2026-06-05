import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, ChevronDown, LogIn, Mail } from "lucide-react";
import { auth, estimates, useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

type Booking = {
  eventType?: string;
  guests?: string;
  dates?: string;
  venue?: string;
  fnb?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export const EstimateModal = ({
  open,
  onOpenChange,
  booking,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  booking: Booking;
  onSubmit: (data: { name: string; email: string; phone?: string }) => void;
}) => {
  const navigate = useNavigate();
  const user = useAuth();
  const [view, setView] = useState<"contact" | "signin">("contact");
  const [signInMode, setSignInMode] = useState<"password" | "magic">("password");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState<string | null>(null);
  const [name, setName] = useState(booking.name ?? "");
  const [email, setEmail] = useState(booking.email ?? "");
  const [phone, setPhone] = useState(booking.phone ?? "");

  useEffect(() => {
    if (open) {
      setName(user?.name ?? booking.name ?? "");
      setEmail(user?.email ?? booking.email ?? "");
      setPhone(user?.phone ?? booking.phone ?? "");
      setView("contact");
      setSignInMode("password");
      setSignInEmail("");
      setSignInPassword("");
      setSignInError(null);
    }
  }, [open, user, booking.name, booking.email, booking.phone]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const data = { name: name.trim(), email: email.trim(), phone: phone.trim() || undefined };
    onSubmit(data);
    const merged = { ...booking, ...data };
    sessionStorage.setItem("nobu_booking", JSON.stringify(merged));
    const activeUser = auth.current();
    if (activeUser) {
      auth.updateProfile({ name: data.name, phone: data.phone });
      estimates.save(activeUser.email, {
        eventType: merged.eventType,
        guests: merged.guests,
        dates: merged.dates,
        venue: merged.venue,
        fnb: merged.fnb,
        subtotal: 7800,
        deposit: 500,
      });
    }
    onOpenChange(false);
    navigate("/estimate");
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    try {
      const u =
        signInMode === "magic"
          ? auth.magicLink(signInEmail.trim())
          : auth.signIn(signInEmail.trim(), signInPassword);
      // Persist current booking + redirect to estimate
      const merged = {
        ...booking,
        name: u.name ?? booking.name,
        email: u.email,
        phone: u.phone ?? booking.phone,
      };
      sessionStorage.setItem("nobu_booking", JSON.stringify(merged));
      estimates.save(u.email, {
        eventType: merged.eventType,
        guests: merged.guests,
        dates: merged.dates,
        venue: merged.venue,
        fnb: merged.fnb,
        subtotal: 7800,
        deposit: 500,
      });
      onSubmit({ name: u.name ?? "", email: u.email, phone: u.phone });
      if (signInMode === "magic") {
        toast({ title: "Magic link sent", description: "For this demo, you're signed in instantly." });
      }
      onOpenChange(false);
      navigate("/estimate");
    } catch (err) {
      setSignInError((err as Error).message);
    }
  };

  const venueLabel = booking.venue || "your selected space";
  const guestsLabel = booking.guests || "your party";
  const dateLabel = booking.dates || "your date";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 border-border bg-white sm:max-w-md sm:rounded-t-3xl sm:rounded-b-3xl rounded-t-3xl rounded-b-none data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom"
      >
        {view === "contact" ? (
        <div className="px-6 pt-7 pb-6 sm:px-8 sm:pt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
            {venueLabel}
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
            Your estimate is ready
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Enter your email to see your full breakdown for {venueLabel} · {guestsLabel} · {dateLabel}, and hold your date for 48 hours.
          </p>

          {!user && (
            <div className="mt-5 flex items-center justify-between gap-3 rounded-md border border-border bg-accent/5 px-4 py-3 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <LogIn className="h-4 w-4 text-accent" />
                <span>Already have an account?</span>
              </div>
              <button
                type="button"
                onClick={() => setView("signin")}
                className="font-medium text-accent underline underline-offset-4 hover:text-accent/80"
              >
                Log in
              </button>
            </div>
          )}

          {user && (
            <div className="mt-5 rounded-md border border-accent/40 bg-accent/5 px-4 py-3 text-sm">
              Signed in as <span className="font-medium text-foreground">{user.email}</span>. This estimate will be saved to your account.
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-5">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/80">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name is fine"
                className="mt-2 w-full rounded-md border border-border bg-white px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/80">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Name@email.com"
                className="mt-2 w-full rounded-md border border-border bg-white px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/80">
                Phone number <span className="text-muted-foreground normal-case tracking-normal">*optional</span>
              </label>
              <div className="mt-2 grid grid-cols-[110px_1fr] gap-2">
                <div className="relative flex items-center rounded-md border border-border bg-white px-3 py-3 text-sm text-foreground">
                  USA +1
                  <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full rounded-md border border-border bg-white px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim() || !email.trim()}
              className="mt-2 w-full rounded-full bg-accent py-4 text-base font-medium text-accent-foreground transition hover:bg-accent/90 disabled:opacity-40"
            >
              See my estimate
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="block w-full text-center text-sm text-foreground/80 underline underline-offset-4 hover:text-foreground"
            >
              I'll check the estimate later
            </button>
          </form>
        </div>
        ) : (
        <div className="px-6 pt-5 pb-6 sm:px-8 sm:pt-6">
          <button
            type="button"
            onClick={() => {
              setView("contact");
              setSignInError(null);
            }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
            Member access
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
            Welcome back
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Sign in to pick up your estimate for {venueLabel} and keep your saved plans in one place.
          </p>

          <form onSubmit={handleSignIn} className="mt-6 space-y-5">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/80">
                Email
              </label>
              <input
                type="email"
                required
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                placeholder="Name@email.com"
                className="mt-2 w-full rounded-md border border-border bg-white px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>

            {signInMode === "password" && (
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/80">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="mt-2 w-full rounded-md border border-border bg-white px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>
            )}

            {signInError && (
              <p className="text-sm text-destructive">{signInError}</p>
            )}

            <button
              type="submit"
              disabled={!signInEmail.trim() || (signInMode === "password" && !signInPassword)}
              className="w-full rounded-full bg-accent py-4 text-base font-medium text-accent-foreground transition hover:bg-accent/90 disabled:opacity-40"
            >
              {signInMode === "magic" ? "Send magic link" : "Sign in & see my estimate"}
            </button>

            <button
              type="button"
              onClick={() => {
                setSignInMode(signInMode === "magic" ? "password" : "magic");
                setSignInError(null);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-white py-3 text-sm font-medium text-foreground hover:bg-secondary/60"
            >
              <Mail className="h-4 w-4" />
              {signInMode === "magic" ? "Use password instead" : "Email me a magic link"}
            </button>

            <p className="pt-2 text-center text-xs text-muted-foreground">
              No account yet?{" "}
              <button
                type="button"
                onClick={() => {
                  try {
                    if (!signInEmail.trim() || !signInPassword) {
                      setSignInError("Enter an email and password to create your account.");
                      return;
                    }
                    auth.signUp(signInEmail.trim(), signInPassword);
                    handleSignIn(new Event("submit") as unknown as React.FormEvent);
                  } catch (err) {
                    setSignInError((err as Error).message);
                  }
                }}
                className="text-foreground underline underline-offset-4"
              >
                Create one
              </button>
            </p>
          </form>
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
};