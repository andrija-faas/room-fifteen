# Room Fifteen — Landing Page (v1) Design Spec

Date: 2026-11-10
Status: Draft for review

## 1. Overview

Room Fifteen is a **satirical** "gambling efficiency software". The pitch: instead of
wasting hours gambling, simulate your losses in advance and pay Room Fifteen what
you would have lost — plus a 1% time-saving fee.

v1 is **the landing page only**. The simulator is announced but not built; the main
CTA leads to a waitlist.

### Core copy (from the brief, verbatim)
- "We bring efficiency to your gambling."
- "Calculate your losses in advance and stop wasting your precious time gambling."
- "Run the simulation and pay us what you'll owe us."
- "We only take 1% commission unlike the real casinos that take all."
- "Saving 100% of your time for 1% of your money."

### The joke, stated precisely
The bill is **projected loss + 1% time-saving fee**. The 1% is presented proudly as
the product's selling point; the projected loss is treated as a formality. "We only
take 1%" is technically true and still costs you everything a casino would.

## 2. Goals and non-goals

**Goals (v1)**
- A modern, slick page that unmistakably reads as a gambling site.
- Played completely straight: deadpan, confident, fintech/casino marketing voice.
- Waitlist signup ("Be the first to lose efficiently").
- A real, clearly labelled funding link: *"This is a joke, but you can still fund the
  further development of this project."*

**Non-goals (v1)**
- The simulator (loss calculation, animation, invoice, joke checkout) — deferred to v2.
- Any real payment for the fake "bill". No card form anywhere.
- Storing waitlist emails (Resend integration comes next; see §6).
- Analytics, CMS, i18n, multiple pages beyond a privacy note.

## 3. Tech

- Next.js (App Router) + TypeScript + Tailwind CSS. Deployed on Vercel.
- Static landing page; one API route (`/api/waitlist`).
- Fonts via `next/font/google`: Anton (display), Inter (body), JetBrains Mono (numbers).
- Env vars:
  - `NEXT_PUBLIC_FUNDING_URL` — external funding link (Stripe Payment Link / Ko-fi / etc.).
    If unset, the funding button is hidden (never a dead link).
  - Later: `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`.

## 4. Visual direction — "Neon Vegas noir" (Direction A)

| Token | Value | Use |
|---|---|---|
| `bg` | `#0B0710` | Page background |
| `surface` | `#150D1F` | Cards |
| `border` | `#2A1D3D` | Hairlines |
| `pink` | `#FF2E93` | Primary CTA, wordmark, accents |
| `gold` | `#FFD23F` | Highlights, "1%" emphasis, counters |
| `text` | `#F4EEFF` | Body text |
| `muted` | `#B9A9D6` | Supporting text |

- Headlines: Anton, uppercase, tight leading. Body: Inter. All money/numbers: JetBrains Mono.
- Pill-shaped buttons (fully rounded). Pink filled = primary; gold outline = secondary.
- Casino cues: neon glow on headline/CTA (subtle `text-shadow`/`box-shadow`), chip-style
  badges, marquee ticker, live "lost today" counter, card-suit glyphs as decoration.
- Restraint: glow on at most the hero headline, primary CTA and the counter.
- `prefers-reduced-motion`: marquee stops, counter shows a static value, no glow pulse.
- Fully responsive; mobile-first, hero readable at 360px wide.

## 5. Page structure (single route `/`)

1. **Nav** — `ROOM FIFTEEN` wordmark (pink, Anton); anchor links: How it works ·
   Compare · FAQ · Waitlist; gold outlined pill "Only 1% commission". On mobile, links
   collapse; the pill and wordmark remain.
2. **Hero**
   - H1: "WE BRING EFFICIENCY / TO YOUR GAMBLING." (second line gold)
   - Sub: "Calculate your losses in advance and stop wasting your precious time
     gambling. Run the simulation and pay us what you'll owe us."
   - Primary CTA: "Run the simulation" → scrolls to `#waitlist`.
   - Live counter: "€X,XXX,XXX lost today. None of it at a casino." The value is
     derived from seconds since local midnight × a fixed rate, ticking every ~100ms,
     so it is stable across reloads and obviously decorative.
3. **Marquee ticker** — scrolling strip: "Saving 100% of your time for 1% of your money ·
   No dealers · No drinks · No hope · We only take 1% · …"
4. **How it works** — three neon cards: 1. Choose your game. 2. Simulate your losses.
   3. Pay us. Each with one deadpan sentence. Small "Simulator coming soon" chip.
5. **Pricing / the 1% section** — big gold "1%" with "We only take 1% commission unlike
   the real casinos that take all." A sample bill (static, illustrative):

   | Line | Amount |
   |---|---|
   | Projected losses (VIP weekend, slots) | €125,249.00 |
   | Time-saving fee (1%) — *best value* | €1,252.49 |
   | **Total due** | **€126,501.49** |

   Caption: "Time saved: 48 h 00 min. You're welcome."
6. **Comparison — Room Fifteen vs. real casinos**

   | | Room Fifteen | Real casinos |
   |---|---|---|
   | Commission | 1% | 100% (eventually) |
   | Time required | 3 seconds | Your entire weekend |
   | Free drinks | ✗ — we respect your liver | ✓ |
   | Outcome | You lose | You lose |

7. **Testimonials** — 3 obviously fictional people with joke names and illustrated
   initials avatars (no stock photos, no real people). E.g. "I used to lose €500 in a
   whole night. Now I lose it before breakfast." — *Gary L., Professional Optimist*.
   Section label makes the fiction plain in tone ("What our users say, allegedly").
8. **FAQ** (accordion, native `<details>`): "Can I win?" ("No. Neither could you before."),
   "What's the 1% for?", "Is this legal?", "Is this a joke?" (answered honestly: yes,
   it's satire; no real money is taken except voluntary funding).
9. **Waitlist** (`#waitlist`) — H2 "Be the first to lose efficiently." Email input +
   "Join the waitlist" button. Consent line: "We'll email you when the simulator
   launches. Unsubscribe anytime." + link to `/privacy`. States: idle, submitting,
   success ("You're on the list. Your losses have been reserved."), error (inline).
10. **Funding block** — visually separated card: "This is a joke, but you can still fund
    the further development of this project." Gold outline button → `NEXT_PUBLIC_FUNDING_URL`
    (opens new tab, `rel="noopener noreferrer"`).
11. **Footer** — wordmark; fine print ("Past losses are a guarantee of future losses.
    Room Fifteen is satire and not a gambling service."); a real responsible-gambling
    help link; link to `/privacy`; © year.

**`/privacy`** — short plain-language page: what's collected (email only), why (launch
notification), where (email provider, once connected), how to unsubscribe/delete, contact.

## 6. Waitlist — form and API

**Client:** `WaitlistForm` (client component). Validates email format before submit;
inline error "That doesn't look like an email. Even we have standards." Disables
double-submit while pending. On success, replaces the form with the success message.

**API:** `POST /api/waitlist`, JSON body `{ email: string }`.
- Validates: string, trimmed, ≤254 chars, basic email regex. Invalid → `400 { error }`.
- Honeypot field (`company`, hidden); if filled → `200` silently, no-op.
- Calls `addToWaitlist(email)` from `lib/waitlist.ts`.
- Success → `200 { ok: true }`. Unexpected failure → `500 { error }`.

**`addToWaitlist` in v1 is a no-op** (resolves immediately). It is the single seam where
Resend Audiences will be plugged in (`resend.contacts.create({ email, audienceId })` +
confirmation email).

> ⚠ **Deployment caveat:** while `addToWaitlist` is a no-op, the success message would
> be untrue for real visitors. Don't share the deployed URL publicly until Resend is
> connected (or, if deployed earlier, the form must show "Waitlist opens soon" instead).
> Implementation: when `RESEND_API_KEY` is unset in production, the form renders a
> disabled-state notice "Waitlist opens soon" rather than accepting emails.

## 7. File layout

```
app/
  layout.tsx            fonts, metadata, OG tags
  page.tsx              composes sections
  privacy/page.tsx
  api/waitlist/route.ts
components/
  Nav.tsx  Hero.tsx  LossCounter.tsx  Marquee.tsx  HowItWorks.tsx
  Pricing.tsx  Comparison.tsx  Testimonials.tsx  Faq.tsx
  WaitlistForm.tsx  FundingBlock.tsx  Footer.tsx
lib/
  waitlist.ts           validateEmail(), addToWaitlist()
  counter.ts            lostTodayAt(date) — pure
tests/
  waitlist.test.ts  counter.test.ts  route.test.ts
```

Each section is a self-contained component with copy inline; no shared state between
sections besides anchor IDs.

## 8. SEO and meta

Title "Room Fifteen — Gambling, but efficient". Description from the tagline. OG image:
static 1200×630 PNG in the hero style (wordmark + "Saving 100% of your time for 1% of
your money"). Favicon: pink "15" chip.

## 9. Testing

- Unit (Vitest): `validateEmail` edge cases; `lostTodayAt` is monotonic within a day and
  resets at midnight; route returns 400/200/honeypot behaviour.
- Build: `next build` passes with no type or lint errors.
- Manual/visual: page checked at 360px, 768px, 1440px; reduced-motion respected;
  keyboard navigation through nav, CTA, FAQ, form; Lighthouse accessibility ≥ 95.

## 10. Open items

- Funding URL (Stripe Payment Link / Ko-fi / BMC) — placeholder via env until provided.
- Resend Audience + confirmation email — next iteration.
- v2: the simulator (expected-value loss calc, roll-up animation, invoice, joke payment
  methods with "Payment declined — you saved your money" reveal). Design notes from
  brainstorming are preserved in conversation; to be specced separately.
