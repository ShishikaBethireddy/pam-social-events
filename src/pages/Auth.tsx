import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { auth, useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const user = useAuth();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/account";
  const [mode, setMode] = useState<"signin" | "signup" | "magic">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) navigate(redirect, { replace: true });
  }, [user, redirect, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "signin") auth.signIn(email.trim(), password);
      else if (mode === "signup") auth.signUp(email.trim(), password, { name: name.trim() });
      else {
        auth.magicLink(email.trim());
        toast({ title: "Magic link sent", description: "For this demo, you're signed in instantly." });
      }
    } catch (err) {
      toast({ title: "Couldn't sign in", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link to="/direct" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Nobu
          </Link>
          <div className="font-serif text-lg tracking-[0.18em]">NOBU HOTEL</div>
          <div className="w-24" />
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-md place-items-center px-6 py-10">
        <div className="w-full">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">Member access</p>
          <h1 className="mt-3 font-serif text-4xl font-light leading-tight">
            {mode === "signup" ? "Create your account" : mode === "magic" ? "Email me a link" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Save your estimate, hold your date, and pick up where you left off."
              : mode === "magic"
                ? "We'll send a one-tap sign-in link to your inbox."
                : "Sign in to revisit your saved estimates and plan progress."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/80">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3 text-base focus:border-accent focus:outline-none"
                />
              </div>
            )}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/80">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@email.com"
                className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3 text-base focus:border-accent focus:outline-none"
              />
            </div>
            {mode !== "magic" && (
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/80">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3 text-base focus:border-accent focus:outline-none"
                />
              </div>
            )}
            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-primary py-4 text-base font-medium text-primary-foreground hover:bg-primary/90"
            >
              {mode === "signup" ? "Create account" : mode === "magic" ? "Send magic link" : "Sign in"}
            </button>
          </form>

          {mode !== "magic" && (
            <button
              onClick={() => setMode("magic")}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background py-3 text-sm font-medium text-foreground hover:bg-secondary/60"
            >
              <Mail className="h-4 w-4" />
              Email me a magic link
            </button>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" || mode === "magic" ? (
              <>
                New here?{" "}
                <button onClick={() => setMode("signup")} className="text-foreground underline underline-offset-4">
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("signin")} className="text-foreground underline underline-offset-4">
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;