import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type SaveProgressSheetProps = {
  open: boolean;
  onClose: () => void;
  venueLabel?: string;
};

/**
 * Save Progress sheet — direct port of pam-brides `SaveProgressSheet`,
 * dropped on top of shadcn `Dialog`. Triggered from the Event Planning
 * Notebook footer ("Save") so guests can drop their email and resume the
 * planning thread later.
 */
export function SaveProgressSheet({
  open,
  onClose,
  venueLabel = "NOBU HOTEL LOS CABOS",
}: SaveProgressSheetProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <DialogContent className="bg-canvas border border-border-default sm:max-w-md p-0">
        <div className="flex flex-col">
          <div className="border-b border-border-subtle bg-cream-soft px-7 py-5">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.32em] text-copper">
              {venueLabel}
            </p>
          </div>

          <DialogHeader className="px-7 pt-6 pb-2 text-left">
            <DialogTitle className="font-title text-3xl text-ink leading-tight">
              Save your progress
            </DialogTitle>
            <DialogDescription className="font-sans text-sm text-ink-soft">
              We&rsquo;ll send you a link so you can pick up exactly where you
              left off — no account needed.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={submit}
            className="flex flex-col gap-4 px-7 pt-4 pb-7"
          >
            <Field
              label="Name"
              placeholder="First name is fine"
              value={name}
              onChange={setName}
            />
            <Field
              label="Email"
              type="email"
              placeholder="name@email.com"
              value={email}
              onChange={setEmail}
            />
            <Field
              label="Phone (optional)"
              type="tel"
              placeholder="+1 (555) 555-0100"
              value={phone}
              onChange={setPhone}
            />

            <div className="mt-2 flex flex-col gap-3">
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center rounded-pill bg-copper px-6 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-paper hover:bg-copper-hover transition-colors"
              >
                Save my progress
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full text-center font-sans text-sm text-ink-soft underline underline-offset-4 hover:text-ink transition-colors"
              >
                I&rsquo;ll continue without saving
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block h-11 w-full rounded-pill border border-border-default bg-paper px-4 font-sans text-base text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
      />
    </label>
  );
}
