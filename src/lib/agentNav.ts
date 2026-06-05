/**
 * Route constants for the Partner Portal (Travel-Agent prototype).
 * Centralised so the nav, dashboard and detail pages stay in sync.
 */
export const AGENT_HUB_HREF = "/travel-agent";
export const CLIENTS_HREF = "/travel-agent/clients";
export const REQUESTS_HREF = "/travel-agent/requests";
export const ADD_CLIENT_HREF = "/travel-agent/new-client";
export const ASK_ALLIE_HREF = "/travel-agent/check-availability";

export const clientHref = (slug: string) => `/travel-agent/clients/${slug}`;
export const clientVendorsHref = (slug: string) => `/travel-agent/clients/${slug}/vendors`;

/** sessionStorage relay for the "new client added" toast on the dashboard. */
const TOAST_KEY = "pam:agent:toast";
export function setAgentToast(msg: string) {
  try {
    sessionStorage.setItem(TOAST_KEY, msg);
  } catch {
    /* ignore */
  }
}
export function consumeAgentToast(): string | null {
  try {
    const msg = sessionStorage.getItem(TOAST_KEY);
    if (msg) sessionStorage.removeItem(TOAST_KEY);
    return msg;
  } catch {
    return null;
  }
}
