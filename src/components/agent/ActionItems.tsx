import { useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { ActionItem } from "@/lib/agentClients";

/* Local feedback palette — red/orange stay semantic; neutral re-themed to lavender. */
const ERROR_SURFACE = "#fdecea";
const ERROR_TEXT = "#c0392b";
const WARNING_SURFACE = "#fef3ec";
const WARNING_TEXT = "#d4652a";
const NEUTRAL_SURFACE = "#ede7f6";
const NEUTRAL_TEXT = "#6a3f82";
const BODY = "#585563";
const DOT = "#a98bc2";

const ACTION_TONES: Record<ActionItem["tone"], { bg: string; text: string }> = {
  red: { bg: ERROR_SURFACE, text: ERROR_TEXT },
  orange: { bg: WARNING_SURFACE, text: WARNING_TEXT },
  neutral: { bg: NEUTRAL_SURFACE, text: NEUTRAL_TEXT },
};

const PAGE_SIZE = 4;
const CARD_W = 280;
const CARD_GAP = 14;
const STEP = CARD_W + CARD_GAP;

function ActionCard({ item }: { item: ActionItem }) {
  const tone = ACTION_TONES[item.tone];
  return (
    <div className="flex w-[280px] shrink-0 snap-start flex-col gap-2.5 rounded-lg bg-white px-5 py-[18px] md:w-auto md:shrink">
      <div className="flex items-center justify-between gap-3">
        <span
          className="inline-flex w-fit items-center rounded-[2.4px] px-[9.6px] py-[2.4px] text-[12px] font-semibold uppercase leading-[19px] tracking-[0.04em]"
          style={{ backgroundColor: tone.bg, color: tone.text }}
        >
          {item.badge}
        </span>
        {item.amount ? (
          <p className="font-sans text-[16px] font-medium leading-6 text-[#1a1721]">{item.amount}</p>
        ) : null}
      </div>
      <p className="text-[18px] font-semibold leading-normal text-[#1a1721]">{item.title}</p>
      <span className="block h-px w-6 bg-[#e0e0e0]" />
      <p className="flex-1 text-[14px] leading-[1.5]" style={{ color: BODY }}>
        {item.desc}
      </p>
      <button
        type="button"
        className="flex items-center gap-1.5 text-left text-[14px] font-semibold leading-normal text-[#1a1721]"
      >
        {item.cta.replace(/\s*→\s*$/, "")}
        <ArrowRight size={15} strokeWidth={2.2} />
      </button>
    </div>
  );
}

const arrowBtn =
  "flex size-7 items-center justify-center rounded-full border border-border-muted bg-white text-text-secondary transition-colors enabled:hover:bg-surface-subtle enabled:hover:text-text-primary disabled:opacity-40";

export default function ActionItems({ items, count }: { items: ActionItem[]; count: number }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageItems = items.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const paginated = pageCount > 1;

  const trackRef = useRef<HTMLDivElement>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const multipleCards = items.length > 1;

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setMobileIndex(Math.max(0, Math.min(items.length - 1, Math.round(el.scrollLeft / STEP))));
  };

  const scrollToCard = (i: number) => {
    trackRef.current?.scrollTo({ left: i * STEP, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[18px] font-medium leading-normal text-[#1a1721]">
          Action Items <span className="text-text-tertiary">({count})</span>
        </h2>
        {paginated ? (
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              aria-label="Previous action items"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className={arrowBtn}
            >
              <ChevronLeft size={14} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label="Next action items"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={safePage === pageCount - 1}
              className={arrowBtn}
            >
              <ChevronRight size={14} strokeWidth={1.8} />
            </button>
          </div>
        ) : null}
      </div>

      {/* Mobile — edge-to-edge snap carousel */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="scroll-x -mx-6 flex snap-x snap-mandatory gap-3.5 px-6 md:hidden"
      >
        {items.map((item) => (
          <ActionCard key={item.title} item={item} />
        ))}
      </div>

      {multipleCards ? (
        <div className="flex items-center justify-center gap-1.5 pt-0.5 md:hidden">
          {items.map((item, i) => {
            const isActive = i === mobileIndex;
            return (
              <button
                key={item.title}
                type="button"
                aria-label={`Go to action item ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => scrollToCard(i)}
                className="h-1.5 rounded-full transition-all"
                style={{ width: isActive ? 22 : 6, backgroundColor: isActive ? DOT : "#dcdcdc" }}
              />
            );
          })}
        </div>
      ) : null}

      {/* Desktop — paginated 2×2 grid */}
      <div className="hidden gap-3.5 md:grid md:grid-cols-2">
        {pageItems.map((item) => (
          <ActionCard key={item.title} item={item} />
        ))}
      </div>

      {paginated ? (
        <div className="hidden items-center justify-center gap-1.5 pt-1 md:flex">
          {Array.from({ length: pageCount }).map((_, i) => {
            const isActive = i === safePage;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to page ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => setPage(i)}
                className="h-1.5 rounded-full transition-all"
                style={{ width: isActive ? 22 : 6, backgroundColor: isActive ? DOT : "#dcdcdc" }}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
