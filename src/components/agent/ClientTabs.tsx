import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const TABS = ["Overview", "Proposal", "Room Block", "Travel", "Activity"] as const;
export type Tab = (typeof TABS)[number];

const TAB_ACTIVE = "#7b4b94"; // purple — active underline + indicator

/**
 * Client detail section nav. On desktop it's the horizontal tab row; on mobile it
 * collapses into a row showing the active section with a caret that expands into a
 * tappable section list.
 */
export default function ClientTabs({
  variant = "both",
  active: activeProp,
  onChange,
}: {
  variant?: "mobile" | "desktop" | "both";
  active?: Tab;
  onChange?: (tab: Tab) => void;
}) {
  const [internalActive, setInternalActive] = useState<Tab>("Overview");
  const [open, setOpen] = useState(false);

  const active = activeProp ?? internalActive;
  const setActive = (tab: Tab) => {
    setInternalActive(tab);
    onChange?.(tab);
  };

  const showMobile = variant !== "desktop";
  const showDesktop = variant !== "mobile";

  return (
    <>
      {/* ── Mobile — collapsible section dropdown ── */}
      {showMobile ? (
        <div className="sticky top-[88px] z-30 border-b border-[#e0e0e0] bg-white md:hidden">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex w-full items-center justify-between px-6 py-2"
          >
            <span className="flex items-center gap-2">
              <span className="h-4 w-0.5 shrink-0 rounded-full bg-[#1a1721]" />
              <span className="font-sans text-[16px] font-medium leading-6 text-[#1a1721]">{active}</span>
            </span>
            <span
              className="flex size-11 items-center justify-center transition-transform duration-200"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <ChevronDown size={16} strokeWidth={2.4} className="text-[#1a1721]" />
            </span>
          </button>

          {open ? (
            <div className="overflow-hidden border-t border-[#e0e0e0]">
              {TABS.map((tab, i) => {
                const isActive = tab === active;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActive(tab);
                      setOpen(false);
                    }}
                    className="flex h-11 w-full items-center px-6"
                    style={{ borderBottom: i < TABS.length - 1 ? "1px solid #f0ecf4" : "none" }}
                  >
                    <span
                      className="mr-3 h-5 w-[3px] shrink-0 rounded-full"
                      style={{ background: isActive ? TAB_ACTIVE : "transparent" }}
                    />
                    <span
                      className="font-sans text-[13px] leading-5"
                      style={{ color: isActive ? "#1a1721" : "#757180", fontWeight: isActive ? 500 : 400 }}
                    >
                      {tab}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ── Desktop — horizontal tab row ── */}
      {showDesktop ? (
        <div className="scroll-x relative z-10 -mb-px hidden items-start overflow-x-auto md:flex">
          {TABS.map((tab) => {
            const isActive = tab === active;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActive(tab)}
                className={`shrink-0 whitespace-nowrap px-5 pb-3 pt-3.5 text-[14px] leading-5 ${
                  isActive ? "font-medium text-text-primary" : "text-text-tertiary"
                }`}
                style={isActive ? { borderBottom: `2px solid ${TAB_ACTIVE}` } : undefined}
              >
                {tab}
              </button>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
