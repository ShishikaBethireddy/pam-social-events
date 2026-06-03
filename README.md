# Nobu Social Events — Booking Concierge

A premium digital experience for **Nobu Hotels** that lets guests
discover, plan, reserve, and book social celebrations through a
combination of inspirational marketing, a conversational booking
assistant (Allie), and a refundable-deposit reservation workflow.

> **Spun off from the `pam-brides` Nobu Weddings prototype (V1.1, 2026-06-01 snapshot)**
> — same UX pattern (marketing → chat → estimate → deposit), retargeted
> for birthdays, anniversaries, engagement parties, bridal/baby
> showers, graduations, private dinners, family reunions, and more.
>
> Tracks the V1.1 **PlanningChatShell** (1/3 notebook + 2/3 chat) +
> the navigable **Event Planning Notebook** (5 steps, click-to-jump,
> Save / Start over actions with toast confirmations).
>
> **Re-skinned with the RCD design system** (warm cream `canvas`,
> charcoal `ink`, brand `copper`, Isabella Grand + Poppins).

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run test         # vitest
```

## Routes

| Route | Page | Purpose |
| ----- | ---- | ------- |
| `/`               | `Landing`              | **Social Events marketing landing** — hero, event types, venues, stays, dining, Allie concierge value-props, testimonials, FAQ, closing CTA |
| `/direct`         | `Landing` *(alias)*    | Back-compat alias for any deep-link from the old persona-picker |
| `/plan`           | `Plan`                 | **Pre-chat editorial landing — corporate-events voice.** Video hero (Nobu candlelit reception clip), staggered "A gathering your team won't forget" headline, glass card with "We're hosting a…" event-type picker (Conference / Off-site / Product Launch / Holiday Party / Award Gala / Investor Dinner / Leadership Retreat / Networking Reception / Client Summit / Custom Event) + "…around" season/year picker, "Real Events" team testimonials (Helios Bio / Quill / Atlas Capital), "Right Now" trending venues for corporate event leads, and a "From kickoff to standing ovation" closing CTA. Funnels into `/chat` once an event type is chosen. Mirrors pam-brides `/plan/`. |
| `/chat`           | `Chat`                 | Allie concierge chat wrapped in `PlanningChatShell`. **V1.1 pattern**: notebook TOC on the left (1/3) with click-to-navigate, single-column thread on the right (2/3), inline panels (calendar, gallery, slider), Save Progress + Start Over actions, toast confirmations, manual scroll-back behavior. Consumes `nobu_event_type` + `nobu_event_date` from sessionStorage if Plan funneled in (skips the celebration + dates prompts). |
| `/estimate`       | `Estimate`             | Estimate detail with shareable breakdown |
| `/worldpay`       | `Worldpay`             | Refundable deposit checkout (mock) |
| `/saved`          | `SavedDate`            | Post-deposit confirmation |
| `/auth`           | `Auth`                 | Sign in / sign up |
| `/account`        | `Account`              | Saved estimates + profile |
| `/estimate/:id`   | `EstimateDetail`       | Single estimate view |
| `/portal/:id`     | `EventPortal`          | Booked-event portal (guest list, vendors, room block, itinerary) |
| `/travel-agent`   | `TravelAgent`          | Trade-partner portal (commissionable rates, multi-event tools) |
| `/travel-agent/:id` | `TravelAgentIntake`  | Agent-led booking intake |

## Marketing landing anatomy (matches pam-brides Nobu Weddings)

The `/` route in `src/pages/Landing.tsx` composes the marketing
experience from a set of dedicated components in
`src/components/nobu/`:

| Section | Component | Notes |
| ------- | --------- | ----- |
| Sticky header (copper ribbon + ink brand bar)        | `Nav.tsx`            | Includes "Speak to an Event Specialist" pill + hamburger |
| Full-bleed photographic hero with editorial title    | `Hero.tsx`           | Eyebrow → italic-serif headline → body → copper + ghost CTAs |
| Featured event types (3 cards + chip rail)           | `EventTypes.tsx`     | Maps to brief: birthdays, engagements, showers, anniversaries, graduations, dinners, reunions |
| Signature venues showcase (4 cards with capacity)    | `Venues.tsx`         | Private dining, rooftop, poolside, ballroom |
| Stay & celebrate accommodations + perks              | `Stays.tsx`          | Room blocks, suite options, full-floor takeovers |
| Food & beverage band (dark ink + copper accent)      | `Dining.tsx`         | Omakase, cocktails, sake pairings, custom catering |
| **Powered by Allie · AI Event Concierge** value-props  | `AllieConcierge.tsx`   | Direct counterpart to pam-brides "All-in-one planning suite" |
| Guest stories (3 testimonials)                       | `Testimonials.tsx`   | Quote + name + event metadata |
| Frequently asked (7 questions accordion)             | `FAQ.tsx`            | Capacity, room blocks, catering, timeline, cancellation |
| Closing CTA (italic serif + dual CTAs on ink)        | `ClosingCTA.tsx`     | `ClosingCTA` + `Footer` exports |
| Multi-column footer (brand, plan, connect, partners) | `ClosingCTA.tsx`     | |

Plus two global overlays mounted from `Landing.tsx`:

* `SpecialistSheet.tsx` — right-side sheet with four ways to connect
  (chat with Allie, book a consultation, WhatsApp, call the events line)
* `MenuOverlay.tsx` — full-screen menu with section links and CTAs

## Planning chat shell (V1.1)

The `/plan` route mirrors the V1.1 pam-brides chat experience. Three
shared building blocks live in `src/components/nobu/` and
`src/hooks/`:

| Component | Counterpart in pam-brides | Role |
| --------- | -------------------------- | ---- |
| `PlanningChatShell.tsx`       | `components/PlanningChatShell.tsx`  | Desktop: 1/3 notebook + 2/3 chat. Mobile: collapsible notebook bar above full-width chat. |
| `EventPlanningNotebook.tsx`   | `components/WeddingNotebook.tsx`    | 5-step TOC (Celebration → Logistics → Style → Recommendations → Hold the Date). Click-to-jump for reached steps. Save / Start over actions. Toast for confirmations. |
| `SaveProgressSheet.tsx`       | `components/SaveProgressSheet.tsx`  | Email-capture dialog launched from the notebook footer. |
| `useChatPinScroll.ts` (hook)  | `hooks/useAllieChatPinScroll.ts`    | Each new Allie bubble pins to the top of the scrollport. **Manual scroll-back**: when the planner scrolls up to read history, new bubbles are appended without auto-pin until they return within 50px of the latest. |

### Notebook step ⇄ chat step mapping

| Notebook | Chat step(s)                |
| -------- | --------------------------- |
| 1 · Celebration       | `eventType`        |
| 2 · Logistics         | `guests`, `dates`, `venue` |
| 3 · Style             | `fnb`              |
| 4 · Recommendations   | `name`, `email`, `summary` |
| 5 · Hold the Date     | post-deposit       |

Progress is persisted to `sessionStorage` under `nobu_plan_progress`,
so refreshes and click-back-to-an-earlier-step navigation pick up
exactly where the planner left off.

## Design system

The design system is wired up through three files in `src/`:

| File | Role |
| --- | --- |
| `src/styles/rcd-tokens.css` | Canonical RCD tokens — hex source of truth + `@font-face` for Isabella Grand and locally-bundled Poppins (back-compat). |
| `index.html`                | Loads **Poppins · Cormorant Garamond · Playfair Display** from Google Fonts — matches the pam-brides Nobu Weddings font stack. |
| `src/index.css`             | Imports the tokens, remaps the shadcn HSL aliases (`--primary`, `--accent`, `--muted` …) to the RCD palette, defines `.eyebrow` / `.hairline` / `.font-title`. |
| `tailwind.config.ts`        | Exposes direct RCD utilities alongside the shadcn ones — `bg-ink`, `text-copper`, `bg-canvas`, `bg-cream`, `font-title`, `font-title-plain`, `rounded-pill`, `shadow-rcd`. |
| `public/fonts/`             | Bundled Isabella Grand (regular + italic + plain) + Poppins (300 / 400 / 600 / 700) — kept as a fallback for any RCD-authored components. |
| `src/assets/logo-nobu-white.png` | Official Nobu Hotel Los Cabos wordmark — shared with `pam-brides/public/assets/logo-nobu-white.png`. Used in every Nav, MenuOverlay, Chat header, Footer, and Travel Agent header. |
| `public/videobg-corporate.mp4` | Hero background video on `/plan` — an upscale corporate-reception/gala clip (guests around a candlelit table raising glasses). Sourced from Pexels ("People Doing Cheers" by cottonbro studio, UHD 2732×1440, 25fps, ~27MB). Royalty-free under the Pexels license. |

**Font stack (synced with pam-brides):**

- `font-sans` → `Poppins` (UI + body, weights 300 / 400 / 500 / 600 + italics)
- `font-serif` / `font-title` → `Cormorant Garamond` (editorial serif, 400 / 500 / 600 + italics)
- `font-display` → `Playfair Display` (large display, 400 / 500 / 600 / 700 + italics)
- Isabella Grand remains in the cascade as a back-compat fallback after Cormorant.

### Authoring rules

1. **No hard-coded hex / `hsl()` / px type sizes** in components. Reach
   for the Tailwind utility (`bg-copper`, `text-ink-soft`, `rounded-pill`)
   or `var(--color-*)` directly.
2. **Use `font-title` for hero / editorial headings** (Isabella Grand
   with swashes). Use `font-title-plain` when the swashes feel too loud
   for long subheads. Body / UI defaults to Poppins via `font-sans`.
3. **Buttons are pills**. The `Button` primitive in
   `src/components/ui/button.tsx` exposes the RCD roles directly:
   - `variant="default"` → ink (primary)
   - `variant="copper"` → copper (secondary)
   - `variant="ghost"` → ink outline
4. **Eyebrows** use the `.eyebrow` utility (Poppins semibold, copper,
   `0.22em` tracking).

The legacy shadcn aliases (`bg-primary`, `text-accent`, `font-serif`,
etc.) are mapped to RCD tokens, so any unmigrated component still picks
up the brand without code changes.

## User journey

```
/ (Landing)
  ├─ Hero CTA "Start Planning My Event" ──┐
  ├─ AllieConcierge CTA  ────────────────────┼──> /plan (Allie chat)
  ├─ ClosingCTA "Start Planning My Event" ─┘                │
  ├─ Hero CTA "Speak to an Event Specialist" ──┐           │
  ├─ Nav button     ─────────────────────────── ┼──> SpecialistSheet (overlay)
  └─ ClosingCTA "Speak to an Event Specialist" ─┘     │
                                                       │
                                                       ├──> "Chat with Allie"   ──> /plan
                                                       ├──> "Book a consultation"
                                                       ├──> "WhatsApp the events desk"
                                                       └──> "Call the events line"

/plan (Allie)
  Celebration → Logistics (guests, dates, venue) → Experience (F&B)
       → Contact → Estimate (modal) → Summary → "Hold the Date" (modal)
            └──> /worldpay (refundable deposit checkout)
                       └──> /saved (confirmation)
                                  └──> /portal/:id (booked-event portal)
```
