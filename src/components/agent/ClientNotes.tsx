import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";

const BRAND_SURFACE = "#ede7f6"; // lavender
const SECONDARY_TEXT = "#585563";

function storageKey(slug: string) {
  return `pam:agent:notes:${slug}`;
}

export default function ClientNotes({
  slug,
  initialNotes,
  bare = false,
}: {
  slug: string;
  initialNotes: string;
  /** Render without the outer card chrome — used inside the consolidated right rail card. */
  bare?: boolean;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialNotes);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey(slug));
      if (saved !== null) {
        setNotes(saved);
        setDraft(saved);
      }
    } catch {
      /* sessionStorage unavailable — fall back to the seeded note */
    }
  }, [slug]);

  useEffect(() => {
    if (editing) {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }
  }, [editing]);

  function startEditing() {
    setDraft(notes);
    setEditing(true);
  }

  function cancel() {
    setDraft(notes);
    setEditing(false);
  }

  function save() {
    const next = draft.trim();
    setNotes(next);
    setEditing(false);
    try {
      sessionStorage.setItem(storageKey(slug), next);
    } catch {
      /* ignore persistence failure in prototype */
    }
  }

  return (
    <div
      className={
        bare
          ? "flex flex-col gap-3"
          : "flex flex-col gap-3 rounded-2xl border border-border-default bg-surface-default px-6 py-5"
      }
    >
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          {bare ? (
            <p className="text-[12px] font-semibold uppercase leading-4 tracking-[0.067em] text-text-tertiary">
              Your notes
            </p>
          ) : (
            <>
              <p className="font-display text-[18px] leading-none text-text-primary">Your Notes</p>
              <span
                className="rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase leading-none tracking-[0.12em]"
                style={{ backgroundColor: BRAND_SURFACE, color: SECONDARY_TEXT }}
              >
                Private
              </span>
            </>
          )}
        </div>
        {editing ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={cancel}
              aria-label="Cancel"
              className="flex size-7 items-center justify-center rounded-full border border-border-default text-text-tertiary transition-colors hover:bg-surface-subtle hover:text-text-primary"
            >
              <X size={13} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={save}
              aria-label="Save note"
              className="flex size-7 items-center justify-center rounded-full bg-action-primary text-action-primary-text transition-opacity hover:opacity-90"
            >
              <Check size={13} strokeWidth={1.8} />
            </button>
          </div>
        ) : null}
      </div>

      {editing ? (
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") cancel();
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
          }}
          rows={6}
          placeholder="Add a private note for this client…"
          className={
            bare
              ? "w-full resize-y rounded-lg bg-white px-3 py-2.5 text-[12px] leading-[1.55] text-[#1a1721] outline-none transition-colors"
              : "w-full resize-y rounded-xl border border-border-default/70 bg-surface-brand/60 px-4 py-3.5 text-[13px] leading-[1.65] text-text-secondary outline-none transition-colors focus:border-border-brand"
          }
        />
      ) : (
        <button
          type="button"
          onClick={startEditing}
          className={
            bare
              ? "rounded-lg bg-white px-3 py-2.5 text-left"
              : "rounded-xl border border-border-default/70 bg-surface-brand/60 px-4 py-3.5 text-left"
          }
        >
          {notes ? (
            <p
              className={
                bare ? "text-[12px] leading-[1.55] text-[#1a1721]" : "text-[13px] leading-[1.65] text-text-secondary"
              }
            >
              {notes}
            </p>
          ) : (
            <p
              className={
                bare ? "text-[12px] leading-[1.55] text-text-tertiary" : "text-[13px] leading-[1.65] text-text-tertiary"
              }
            >
              Add a private note for this client…
            </p>
          )}
        </button>
      )}
    </div>
  );
}
