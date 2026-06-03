import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { ChevronDown, Check } from "lucide-react";

// ── 5-step planner ──────────────────────────────────────────────
// Spinoff of the V1.1 Planning Notebook from pam-brides — same
// shell shape, retargeted for Social Events. Each step pairs a chat
// `Step` (set in `Plan.tsx`) to a stable display step number that
// can be navigated to via the sidebar.
//
// Format ──> Celebration         (what we're celebrating + your name)
// Logistics ──> Logistics        (guests + dates + venue)
// Mood Selector ──> Style        (F&B style + ambience touches)
// Your Matches ──> Recommendations (estimate + shortlist)
// Save my Date ──> Hold the Date (refundable deposit)
export type NotebookStepNum = 1 | 2 | 3 | 4 | 5;
export type NotebookStepStatus = "previous" | "current" | "future";

export type NotebookStep = {
  num: NotebookStepNum;
  title: string;
  desc: string;
  time: string;
};

export const NOTEBOOK_STEPS: readonly NotebookStep[] = [
  {
    num: 1,
    title: "Celebration",
    desc: "The kind of event we're shaping together — birthday, engagement, baby shower, private dinner, or something else.",
    time: "1 MIN",
  },
  {
    num: 2,
    title: "Logistics",
    desc: "Guests, dates, and venue so we right-size every detail.",
    time: "2 MIN",
  },
  {
    num: 3,
    title: "Style",
    desc: "Food &amp; beverage tempo, signature touches, and the feeling you want.",
    time: "1 MIN",
  },
  {
    num: 4,
    title: "Recommendations",
    desc: "Your shortlist — matched venues, menus, and an instant estimate.",
    time: "1 MIN",
  },
  {
    num: 5,
    title: "Hold the Date",
    desc: "Fully refundable deposit secures your shortlist while we finalize.",
    time: "1 MIN",
  },
] as const;

export function notebookStepStatus(
  num: NotebookStepNum,
  current: NotebookStepNum,
): NotebookStepStatus {
  if (num < current) return "previous";
  if (num === current) return "current";
  return "future";
}

type NotebookLayout = "bar" | "sidebar";

type EventPlanningNotebookProps = {
  /** 1–5; defaults to 1. */
  activeStep?: NotebookStepNum;
  /** Highest step the planner has reached — gates click-to-navigate. */
  maxReachable?: NotebookStepNum;
  layout?: NotebookLayout;
  onNavigate: (step: NotebookStepNum) => void;
  onSave: () => void;
  onStartOver: () => void;
};

function StepBead({
  num,
  status,
}: {
  num: number;
  status: NotebookStepStatus;
}) {
  const isCurrent = status === "current";
  const isPrev = status === "previous";
  return (
    <div
      className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-[1.5px] text-[13px] font-sans font-semibold transition-colors ${
        isCurrent
          ? "bg-ink border-ink text-paper"
          : isPrev
            ? "bg-paper border-copper text-copper"
            : "bg-paper border-border-default text-ink-muted"
      }`}
    >
      {isPrev ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : num}
    </div>
  );
}

function NotebookHeader({
  stepIndex,
  totalSteps,
  title,
}: {
  stepIndex: number;
  totalSteps: number;
  title: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
          Step {stepIndex} of {totalSteps}
        </p>
        <span className="h-[11px] w-px shrink-0 bg-ink" aria-hidden />
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
          {title}
        </p>
      </div>
      <p className="font-title text-2xl leading-7 text-ink">
        Event Planning Notebook
      </p>
    </div>
  );
}

function StepRow({
  step,
  status,
  layout,
  navigable,
  onClick,
}: {
  step: NotebookStep;
  status: NotebookStepStatus;
  layout: NotebookLayout;
  navigable: boolean;
  onClick?: () => void;
}) {
  const isCurrent = status === "current";
  const isFuture = status === "future";

  const titleClasses = `${
    layout === "sidebar" ? "text-[15px] leading-5" : "text-[18px] leading-6"
  } font-sans font-semibold ${
    isCurrent
      ? "text-ink"
      : isFuture
        ? "text-disabled-fg"
        : "text-ink-soft"
  }`;

  const descClasses = `mt-1 text-[13px] leading-5 font-sans ${
    isCurrent ? "text-ink-soft" : "text-ink-muted"
  } ${layout === "sidebar" ? "line-clamp-2" : ""} ${
    isFuture ? "opacity-70" : ""
  }`;

  const body: ReactNode = (
    <>
      <StepBead num={step.num} status={status} />
      <div className="min-w-0 flex-1 text-left">
        <p className={titleClasses}>{step.title}</p>
        <p
          className={descClasses}
          dangerouslySetInnerHTML={{ __html: step.desc }}
        />
      </div>
      <p
        className={`shrink-0 pt-1 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] ${
          isCurrent ? "text-copper" : "text-ink-muted"
        }`}
        style={{ lineHeight: "16px" }}
      >
        {step.time}
      </p>
    </>
  );

  const baseRowClass = `flex w-full gap-3 rounded-md p-4 ${
    isCurrent ? "bg-cream-soft" : ""
  } ${isFuture ? "opacity-60" : ""}`;

  if (navigable && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseRowClass} text-left transition-colors hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
        aria-current={isCurrent ? "step" : undefined}
        aria-label={`Go to ${step.title}`}
      >
        {body}
      </button>
    );
  }

  return (
    <div className={baseRowClass} aria-current={isCurrent ? "step" : undefined}>
      {body}
    </div>
  );
}

function NotebookActions({
  onSave,
  onStartOver,
}: {
  onSave: () => void;
  onStartOver: () => void;
}) {
  return (
    <div className="flex w-full shrink-0 items-center justify-end gap-3 border-t border-border-default px-5 py-4">
      <button
        type="button"
        onClick={onStartOver}
        className="shrink-0 font-sans text-sm font-semibold leading-5 text-copper underline underline-offset-4 hover:text-copper-hover transition-colors"
      >
        Start over
      </button>
      <button
        type="button"
        onClick={onSave}
        className="flex h-9 shrink-0 items-center justify-center rounded-pill border border-ink px-5 font-sans text-sm font-semibold leading-5 text-ink transition-colors hover:bg-cream"
      >
        Save
      </button>
    </div>
  );
}

/**
 * Event Planning Notebook — V1.1 pattern.
 *
 * Sidebar (desktop, inside `PlanningChatShell`):
 *   ┌──────────────────────────┐
 *   │ Step 2 of 5 · Logistics  │   ← brand header band
 *   │ Event Planning Notebook  │
 *   ├──────────────────────────┤
 *   │ Step rows (1–5)          │
 *   │   ● Celebration   1 MIN  │
 *   │   ● Logistics     2 MIN  │
 *   │   …                      │
 *   ├──────────────────────────┤
 *   │   Start over    [Save]   │
 *   └──────────────────────────┘
 *
 * Bar (mobile, above the chat):
 *   collapsed: ▼ Step 2 of 5 · Logistics
 *   expanded:  same step list + actions
 */
export function EventPlanningNotebook({
  activeStep = 1,
  maxReachable = 1,
  layout = "bar",
  onNavigate,
  onSave,
  onStartOver,
}: EventPlanningNotebookProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stepIndex = Math.min(Math.max(activeStep, 1), NOTEBOOK_STEPS.length);
  const currentStep = NOTEBOOK_STEPS[stepIndex - 1];

  const canNavigate = useCallback(
    (n: NotebookStepNum) => n <= maxReachable,
    [maxReachable],
  );

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, 2600);
  }, []);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const handleSave = useCallback(() => {
    onSave();
    showToast("Saved!");
  }, [onSave, showToast]);

  const handleStartOver = useCallback(() => {
    onStartOver();
    setMenuOpen(false);
    showToast("Starting fresh!");
  }, [onStartOver, showToast]);

  const goToStep = useCallback(
    (n: NotebookStepNum) => {
      onNavigate(n);
      setMenuOpen(false);
    },
    [onNavigate],
  );

  const stepList = NOTEBOOK_STEPS.map((step) => {
    const status = notebookStepStatus(step.num, stepIndex as NotebookStepNum);
    return (
      <StepRow
        key={step.num}
        step={step}
        status={status}
        layout={layout}
        navigable={canNavigate(step.num)}
        onClick={() => goToStep(step.num)}
      />
    );
  });

  const notebookToast = toast ? (
    <div
      key={toast}
      className="pointer-events-none fixed left-1/2 top-[110px] z-[70] max-w-[calc(100%-32px)] -translate-x-1/2 rounded-pill bg-ink px-5 py-2.5 font-sans text-sm leading-5 text-paper shadow-rcd-lg animate-toast-in md:left-[calc(16.666%+50%)]"
    >
      {toast}
    </div>
  ) : null;

  if (layout === "sidebar") {
    return (
      <div className="flex h-full min-h-0 w-full flex-col bg-paper">
        {notebookToast}

        <div className="shrink-0 border-b border-border-default bg-cream-soft px-5 py-4">
          <NotebookHeader
            stepIndex={stepIndex}
            totalSteps={NOTEBOOK_STEPS.length}
            title={currentStep.title}
          />
        </div>

        <nav
          className="flex min-h-0 flex-1 flex-col overflow-y-auto"
          aria-label="Event planning steps"
        >
          <div className="border-b border-border-subtle px-5 py-4">
            <p className="font-sans text-[13px] leading-5 text-ink-soft">
              Here&apos;s how Allie shapes your celebration and reserves your date
              — together, in under 5 minutes.
            </p>
          </div>
          <div className="flex flex-col gap-1 p-2">{stepList}</div>
        </nav>

        <NotebookActions onSave={handleSave} onStartOver={handleStartOver} />
      </div>
    );
  }

  // ── Mobile "bar" layout — collapsible drawer above the chat ──
  return (
    <div className="sticky top-0 z-30 w-full shrink-0 border-b border-border-default bg-paper shadow-rcd-sm">
      {notebookToast}

      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 bg-cream-soft px-4 py-3 text-left"
        aria-expanded={menuOpen}
        aria-controls="event-notebook-menu"
        aria-label={
          menuOpen
            ? "Close Event Planning Notebook"
            : "Open Event Planning Notebook"
        }
      >
        <div className="min-w-0 flex-1">
          <NotebookHeader
            stepIndex={stepIndex}
            totalSteps={NOTEBOOK_STEPS.length}
            title={currentStep.title}
          />
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center text-ink">
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ease-out ${
              menuOpen ? "rotate-180" : ""
            }`}
            strokeWidth={2}
          />
        </span>
      </button>

      {menuOpen && (
        <div
          id="event-notebook-menu"
          className="overflow-hidden border-t border-border-default bg-paper animate-notebook-expand"
          role="region"
          aria-label="Event planning steps"
        >
          <div className="border-b border-border-subtle px-4 py-4">
            <p className="font-sans text-[13px] leading-5 text-ink-soft">
              Here&apos;s how Allie shapes your celebration and reserves your
              date — together, in under 5 minutes.
            </p>
          </div>
          <div className="flex flex-col gap-1 p-2">{stepList}</div>
          <NotebookActions
            onSave={handleSave}
            onStartOver={handleStartOver}
          />
        </div>
      )}
    </div>
  );
}
