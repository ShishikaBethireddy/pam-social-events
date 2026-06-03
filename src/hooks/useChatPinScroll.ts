import {
  useEffect,
  useLayoutEffect,
  useRef,
  type DependencyList,
  type RefObject,
} from "react";

const ALLIE_MESSAGE_SELECTOR = '[data-chat-role="allie"]';
const USER_MESSAGE_SELECTOR = '[data-chat-role="user"]';
const SCROLL_TRAIL_SELECTOR = "[data-chat-scroll-trail]";

const PIN_MARGIN_PX = 40;
const SCROLL_UP_THRESHOLD_PX = 50;
const BUBBLE_ENTER_DURATION_MS = 360;

function updateScrollTrail(container: HTMLElement) {
  const trail = container.querySelector<HTMLElement>(SCROLL_TRAIL_SELECTOR);
  if (!trail) return;
  const height = container.clientHeight;
  if (height > 0) {
    trail.style.minHeight = `${Math.max(0, height - PIN_MARGIN_PX)}px`;
  }
}

function getMessageEls(container: HTMLElement): HTMLElement[] {
  const out: HTMLElement[] = [];
  container.querySelectorAll<HTMLElement>(ALLIE_MESSAGE_SELECTOR).forEach((el) => out.push(el));
  container.querySelectorAll<HTMLElement>(USER_MESSAGE_SELECTOR).forEach((el) => out.push(el));
  return out;
}

function getLatestMessageTop(container: HTMLElement): number | null {
  const messages = getMessageEls(container);
  if (messages.length === 0) return null;
  const containerRect = container.getBoundingClientRect();
  let latestTop = -Infinity;
  for (const el of messages) {
    if (el.closest(SCROLL_TRAIL_SELECTOR)) continue;
    const top = container.scrollTop + (el.getBoundingClientRect().top - containerRect.top);
    if (top > latestTop) latestTop = top;
  }
  return Number.isFinite(latestTop) ? latestTop : null;
}

function userScrolledUp(container: HTMLElement): boolean {
  const latestTop = getLatestMessageTop(container);
  if (latestTop == null) return false;
  const viewportBottom = container.scrollTop + container.clientHeight;
  return viewportBottom < latestTop + SCROLL_UP_THRESHOLD_PX;
}

function pinTo(container: HTMLElement, target: HTMLElement) {
  updateScrollTrail(container);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      updateScrollTrail(container);
      target.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  });
}

/**
 * Single-source-of-truth chat scroll behavior — direct port of pam-brides
 * `useAllieChatPinScroll`. Each new Allie message pins near the top of the
 * scrollport after its entrance animation settles. Manual scroll-back:
 * when the user has scrolled up to read history, new Allie messages are
 * appended without auto-pin until they return within 50px of the latest.
 */
export function useChatPinScroll(
  containerRef: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
) {
  const pinnedCountRef = useRef(0);
  const pinTimerRef = useRef<number | null>(null);
  const userScrolledUpRef = useRef(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container) updateScrollTrail(container);
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const clearPin = () => {
      if (pinTimerRef.current != null) {
        window.clearTimeout(pinTimerRef.current);
        pinTimerRef.current = null;
      }
    };

    const syncScrollUp = () => {
      userScrolledUpRef.current = userScrolledUp(container);
    };

    const sync = () => {
      const nodes = container.querySelectorAll<HTMLElement>(ALLIE_MESSAGE_SELECTOR);
      const count = nodes.length;
      if (count < pinnedCountRef.current) pinnedCountRef.current = count;

      updateScrollTrail(container);
      syncScrollUp();

      if (count <= pinnedCountRef.current) return;

      if (pinnedCountRef.current === 0 && count >= 1) {
        pinnedCountRef.current = count;
        return;
      }

      const target = nodes[count - 1];
      if (!target) return;
      pinnedCountRef.current = count;
      clearPin();
      if (userScrolledUpRef.current) return;

      pinTimerRef.current = window.setTimeout(() => {
        syncScrollUp();
        if (!userScrolledUpRef.current) pinTo(container, target);
        pinTimerRef.current = null;
      }, BUBBLE_ENTER_DURATION_MS + 50);
    };

    syncScrollUp();
    sync();

    const onScroll = () => syncScrollUp();
    container.addEventListener("scroll", onScroll, { passive: true });

    const mo = new MutationObserver(sync);
    mo.observe(container, { childList: true, subtree: true });

    const ro = new ResizeObserver(() => {
      updateScrollTrail(container);
      syncScrollUp();
    });
    ro.observe(container);

    return () => {
      clearPin();
      container.removeEventListener("scroll", onScroll);
      mo.disconnect();
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller supplies meaningful deps
  }, deps);
}
