import type { ReactNode } from "react";
import {
  EventPlanningNotebook,
  type NotebookStepNum,
} from "@/components/nobu/EventPlanningNotebook";

/** Desktop planning shell — notebook TOC (1/3) + chat work pane (2/3). */
export const PLANNING_NOTEBOOK_SIDEBAR_CLASS =
  "hidden md:flex md:w-1/3 md:max-w-[33.333%] md:shrink-0 md:min-h-0 md:flex-col md:overflow-hidden md:border-r md:border-border-default md:bg-paper";

export const PLANNING_WORK_PANE_CLASS =
  "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:w-2/3";

export const PLANNING_WORK_PANE_FULL_CLASS =
  "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden";

type PlanningChatShellProps = {
  header: ReactNode;
  /** 1–5 — pass `undefined` to skip the notebook entirely (e.g. confirmation). */
  activeStep?: NotebookStepNum;
  /** Highest step the planner has reached; gates click-to-navigate. */
  maxReachable?: NotebookStepNum;
  showNotebookOnMobile?: boolean;
  showNotebookOnDesktop?: boolean;
  onNavigate: (step: NotebookStepNum) => void;
  onSave: () => void;
  onStartOver: () => void;
  children: ReactNode;
};

/**
 * V1.1 planning chat shell — direct counterpart to pam-brides
 * `PlanningChatShell`. Desktop: notebook TOC on the left (1/3), single
 * chat column on the right (2/3). Mobile: collapsible notebook bar
 * above a single-column chat.
 */
export function PlanningChatShell({
  header,
  activeStep,
  maxReachable,
  showNotebookOnMobile = true,
  showNotebookOnDesktop = true,
  onNavigate,
  onSave,
  onStartOver,
  children,
}: PlanningChatShellProps) {
  const hasNotebook = activeStep != null;
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-canvas">
      {header}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        {hasNotebook && (
          <>
            {showNotebookOnMobile && (
              <div className="shrink-0 md:hidden">
                <EventPlanningNotebook
                  activeStep={activeStep}
                  maxReachable={maxReachable ?? activeStep}
                  layout="bar"
                  onNavigate={onNavigate}
                  onSave={onSave}
                  onStartOver={onStartOver}
                />
              </div>
            )}
            {showNotebookOnDesktop && (
              <aside className={PLANNING_NOTEBOOK_SIDEBAR_CLASS}>
                <EventPlanningNotebook
                  activeStep={activeStep}
                  maxReachable={maxReachable ?? activeStep}
                  layout="sidebar"
                  onNavigate={onNavigate}
                  onSave={onSave}
                  onStartOver={onStartOver}
                />
              </aside>
            )}
          </>
        )}

        <div
          className={
            hasNotebook && showNotebookOnDesktop
              ? PLANNING_WORK_PANE_CLASS
              : PLANNING_WORK_PANE_FULL_CLASS
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
