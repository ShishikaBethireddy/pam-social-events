import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, LogOut, MapPin, Plus, Trash2, Users } from "lucide-react";
import { auth, estimates, progress, SavedEstimate, useAuth } from "@/lib/auth";

const Account = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [list, setList] = useState<SavedEstimate[]>([]);
  const [resumable, setResumable] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth?redirect=/account", { replace: true });
      return;
    }
    setList(estimates.list(user.email));
    setResumable(!!progress.load(user.email));
  }, [user, navigate]);

  if (!user) return null;

  const remove = (id: string) => {
    estimates.remove(user.email, id);
    setList(estimates.list(user.email));
  };

  const resume = () => {
    const data = progress.load(user.email);
    if (data) sessionStorage.setItem("nobu_plan_progress", JSON.stringify(data));
    navigate("/plan?resume=1");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link to="/" className="font-serif text-lg tracking-[0.18em]">NOBU HOTEL</Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{user.email}</span>
            <button
              onClick={() => {
                auth.signOut();
                navigate("/");
              }}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">Your account</p>
        <h1 className="mt-3 font-serif text-4xl font-light leading-tight sm:text-5xl">
          Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick up where you left off, or revisit any saved estimate.
        </p>

        {resumable && (
          <div className="mt-8 rounded-md border border-accent/40 bg-accent/5 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">In progress</p>
                <p className="mt-1 font-medium">Continue planning with Allie</p>
                <p className="text-sm text-muted-foreground">Your chat is saved — resume any time.</p>
              </div>
              <button
                onClick={resume}
                className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Resume planning
              </button>
            </div>
          </div>
        )}

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-light">Saved estimates</h2>
            <Link
              to="/plan"
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary/60"
            >
              <Plus className="h-4 w-4" /> New estimate
            </Link>
          </div>

          {list.length === 0 ? (
            <div className="mt-6 rounded-md border border-dashed border-border p-10 text-center">
              <p className="text-muted-foreground">No estimates yet.</p>
              <Link to="/plan" className="mt-3 inline-block text-sm text-foreground underline underline-offset-4">
                Start your first estimate
              </Link>
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {list.map((e) => (
                <li key={e.id} className="rounded-md border border-border p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                        {e.eventType || "Celebration"}
                      </p>
                      <h3 className="mt-1 truncate font-serif text-xl">{e.venue || "Venue TBD"}</h3>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                        {e.dates && <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{e.dates}</span>}
                        {e.guests && <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{e.guests}</span>}
                        {e.fnb && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{e.fnb}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      {typeof e.subtotal === "number" && (
                        <div className="font-serif text-2xl">${e.subtotal.toLocaleString()}</div>
                      )}
                      {typeof e.deposit === "number" && (
                        <div className="text-xs text-muted-foreground">${e.deposit} deposit</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
                    <span className="text-xs text-muted-foreground">
                      Saved {new Date(e.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          navigate(`/portal/${e.id}`);
                        }}
                        className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        Open event portal
                      </button>
                      <button
                        onClick={() => remove(e.id)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Delete estimate"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default Account;