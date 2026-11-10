# Room Fifteen Landing Page (v1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the satirical Room Fifteen landing page: a "Neon Vegas noir" one-pager with a waitlist form, a stub waitlist API and a funding link.

**Architecture:** A static Next.js App Router page composed of self-contained section components. Pure logic (counter value, email validation, waitlist gating) lives in `lib/` and is unit-tested. One API route, `POST /api/waitlist`, delegates to a no-op `addToWaitlist()` seam where Resend will plug in later.

**Tech Stack:** Next.js (latest, App Router) · TypeScript · Tailwind CSS v4 · `next/font/google` (Anton, Inter, JetBrains Mono) · Vitest + @testing-library/react + jsdom.

**Spec:** `docs/superpowers/specs/2026-11-10-room-fifteen-landing-design.md`

## Global Constraints

- Brief copy is used verbatim: "We bring efficiency to your gambling." · "Calculate your losses in advance and stop wasting your precious time gambling." · "Run the simulation and pay us what you'll owe us." · "We only take 1% commission unlike the real casinos that take all." · "Saving 100% of your time for 1% of your money."
- Funding copy, verbatim: "This is a joke, but you can still fund the further development of this project."
- No card form or real payment for the fake bill anywhere. No simulator in v1.
- Colors: bg `#0B0710`, surface `#150D1F`, border `#2A1D3D`, pink `#FF2E93`, gold `#FFD23F`, text `#F4EEFF`, muted `#B9A9D6`.
- Fonts: Anton for headlines (uppercase), Inter for body, JetBrains Mono for all money and numbers. Buttons are fully rounded pills.
- Glow only on the hero headline, the primary CTA and the counter. `prefers-reduced-motion` stops the marquee, freezes the counter and removes glow pulses.
- Env: `NEXT_PUBLIC_FUNDING_URL` (funding block hidden when unset); `RESEND_API_KEY` (gates the waitlist in production).
- Testimonials use fictional people with initials avatars. No stock photos, no real people.
- Must work at 360px width and up.

## Review Focus

1. **Waitlist closed in production** (no `RESEND_API_KEY`): the form must show "Waitlist opens soon" and the route must return 503. It must never return a fake "You're on the list." Tests are in Tasks 3, 4 and 5.
2. **Malformed request bodies** (invalid JSON, missing `email`, non-string `email`): 400 with an error, never 500. Tested in Task 4.
3. **Emails with surrounding whitespace or mixed case** (`"  Gary@Example.COM "`): accepted, then trimmed and lowercased before `addToWaitlist`. Tested in Tasks 3 and 4.
4. **Double-clicking submit:** exactly one request is sent, and the button is disabled while pending. Tested in Task 5.
5. **Counter around midnight and on re-render:** the value resets to about 0 at local midnight and never decreases within a day. Tested in Task 2.

---

### Task 1: Scaffold project, theme and layout

**Files:**
- Create: the Next.js app in the repo root (`app/`, `package.json`, `tsconfig.json`, …)
- Modify: `app/globals.css`, `app/layout.tsx`
- Create: `vitest.config.ts`, `vitest.setup.ts`, `.env.example`

**Interfaces:**
- Produces: Tailwind theme colors `bg`, `surface`, `line`, `pink`, `gold`, `ink`, `muted` (e.g. `bg-bg`, `text-gold`, `border-line`); font utilities `font-display`, `font-sans`, `font-mono`; utility classes `.glow-pink` and `.glow-gold` (`text-shadow`, disabled under reduced motion via `@media (prefers-reduced-motion: reduce)`); `npm test` runs Vitest.

- [ ] **Step 1:** Run `npx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm` (keep the existing `docs/`).
- [ ] **Step 2:** Install the test tooling: `npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`. Configure `vitest.config.ts` with `environment: 'jsdom'`, the `@` alias and the setup file that imports `@testing-library/jest-dom/vitest`. Add `"test": "vitest run"` to `package.json`.
- [ ] **Step 3:** In `globals.css`, define the colors from Global Constraints with `@theme` (names as listed in Interfaces), plus `--font-display`, `--font-sans` and `--font-mono` pointing at the next/font CSS variables, and the glow utilities. The body is `bg-bg text-ink font-sans`.
- [ ] **Step 4:** In `layout.tsx`, load Anton (400), Inter and JetBrains Mono via `next/font/google` as CSS variables. Set the metadata: title "Room Fifteen — Gambling, but efficient", description "We bring efficiency to your gambling. Saving 100% of your time for 1% of your money.", `lang="en"`.
- [ ] **Step 5:** Write `.env.example` with `NEXT_PUBLIC_FUNDING_URL=` and `RESEND_API_KEY=`, and replace the default `app/page.tsx` with a placeholder `<main>`.
- [ ] **Step 6:** Verify. Run `npm run build`; expected: success. Run `npm test -- --passWithNoTests`; expected: exit 0.
- [ ] **Step 7:** Commit with `chore: scaffold Next.js app with Neon Vegas theme`.

### Task 2: Live "lost today" counter

**Files:**
- Create: `lib/counter.ts`, `components/LossCounter.tsx`
- Test: `tests/counter.test.ts`

**Interfaces:**
- Produces: `LOSS_PER_SECOND = 28.73`; `lostTodayAt(date: Date): number` (integer euros = floor(seconds since *local* midnight × `LOSS_PER_SECOND`)); `formatEuro(n: number): string` (`€2,481,904`, `en-US` grouping, no decimals); `<LossCounter />` (client component, takes no props).

- [ ] **Step 1: Write the failing tests**

```ts
test('is 0 at local midnight', () => expect(lostTodayAt(new Date(2026,0,1,0,0,0))).toBe(0));
test('one hour in', () => expect(lostTodayAt(new Date(2026,0,1,1,0,0))).toBe(Math.floor(3600*28.73)));
test('monotonic within a day', () => {
  const a = lostTodayAt(new Date(2026,0,1,12,0,0)), b = lostTodayAt(new Date(2026,0,1,12,0,1));
  expect(b).toBeGreaterThanOrEqual(a);
});
test('resets after midnight', () =>
  expect(lostTodayAt(new Date(2026,0,2,0,0,1))).toBeLessThan(lostTodayAt(new Date(2026,0,1,23,59,59))));
test('formats euros', () => expect(formatEuro(2481904)).toBe('€2,481,904'));
```

- [ ] **Step 2:** Run `npm test tests/counter.test.ts`; expected: FAIL (module not found).
- [ ] **Step 3:** Implement `lib/counter.ts` per Interfaces.
- [ ] **Step 4:** Implement `LossCounter`. It renders `formatEuro(lostTodayAt(now))` in `font-mono text-gold glow-gold` followed by " lost today. None of it at a casino." It updates every 100ms via `setInterval`. When `matchMedia('(prefers-reduced-motion: reduce)')` matches, it renders once and doesn't tick. To avoid a hydration mismatch, the value starts as `null` (render `€—`) and is set in `useEffect`. Use `aria-live="off"`.
- [ ] **Step 5:** Run `npm test tests/counter.test.ts`; expected: PASS.
- [ ] **Step 6:** Commit with `feat: add live lost-today counter`.

### Task 3: Waitlist logic

**Files:**
- Create: `lib/waitlist.ts`
- Test: `tests/waitlist.test.ts`

**Interfaces:**
- Produces:
  - `normalizeEmail(raw: unknown): string | null`: trims and lowercases. Returns `null` unless the input is a string of ≤254 chars matching `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
  - `isWaitlistOpen(env: { NODE_ENV?: string; RESEND_API_KEY?: string } = process.env): boolean`: true when `NODE_ENV !== 'production'` or `RESEND_API_KEY` is non-empty.
  - `addToWaitlist(email: string): Promise<void>`: a no-op in v1, with a `// TODO(resend): resend.contacts.create({ email, audienceId })` marker.

- [ ] **Step 1: Write the failing tests**

```ts
test('trims and lowercases', () => expect(normalizeEmail('  Gary@Example.COM ')).toBe('gary@example.com'));
test.each([undefined, 42, '', 'gary', 'gary@', 'a b@c.d', 'x@y', `${'a'.repeat(250)}@b.co`])
  ('rejects %s', v => expect(normalizeEmail(v)).toBeNull());
test('open in dev without key', () => expect(isWaitlistOpen({ NODE_ENV: 'development' })).toBe(true));
test('closed in prod without key', () => expect(isWaitlistOpen({ NODE_ENV: 'production' })).toBe(false));
test('closed in prod with empty key', () => expect(isWaitlistOpen({ NODE_ENV: 'production', RESEND_API_KEY: '' })).toBe(false));
test('open in prod with key', () => expect(isWaitlistOpen({ NODE_ENV: 'production', RESEND_API_KEY: 're_x' })).toBe(true));
test('addToWaitlist resolves', async () => await expect(addToWaitlist('a@b.co')).resolves.toBeUndefined());
```

- [ ] **Step 2:** Run `npm test tests/waitlist.test.ts`; expected: FAIL.
- [ ] **Step 3:** Implement `lib/waitlist.ts` per Interfaces.
- [ ] **Step 4:** Run `npm test tests/waitlist.test.ts`; expected: PASS.
- [ ] **Step 5:** Commit with `feat: add waitlist validation and gating`.

### Task 4: `POST /api/waitlist` route

**Files:**
- Create: `app/api/waitlist/route.ts`
- Test: `tests/route.test.ts`

**Interfaces:**
- Consumes: `normalizeEmail`, `isWaitlistOpen` and `addToWaitlist` from Task 3.
- Produces: `POST(req: Request): Promise<Response>`. Body: `{ email: unknown; company?: unknown }`. Responses:
  - `503 { error: 'Waitlist opens soon.' }` when the waitlist is closed (checked first).
  - `400 { error: 'Invalid request.' }` for unparseable JSON or a non-object body.
  - `200 { ok: true }` when `company` (the honeypot) is a non-empty string, without calling `addToWaitlist`.
  - `400 { error: "That doesn't look like an email. Even we have standards." }` when `normalizeEmail` returns null.
  - `200 { ok: true }` after `await addToWaitlist(normalized)`.
  - `500 { error: 'Something went wrong. The house always wins.' }` if `addToWaitlist` throws.

- [ ] **Step 1: Write the failing tests.** Use `vi.mock('@/lib/waitlist', …)`, keeping the real `normalizeEmail`, a spy `addToWaitlist` and a controllable `isWaitlistOpen`. Build requests with `new Request('http://x/api/waitlist', { method: 'POST', body })`.

```ts
test('valid email → 200 and normalized email passed', async () => {
  const res = await POST(req(JSON.stringify({ email: ' A@B.co ' })));
  expect(res.status).toBe(200); expect(addSpy).toHaveBeenCalledWith('a@b.co');
});
test('invalid JSON → 400', async () => expect((await POST(req('{nope'))).status).toBe(400));
test('missing email → 400', async () => expect((await POST(req('{}'))).status).toBe(400));
test('non-string email → 400', async () => expect((await POST(req('{"email":5}'))).status).toBe(400));
test('honeypot → 200, not stored', async () => {
  expect((await POST(req(JSON.stringify({ email: 'a@b.co', company: 'bot' })))).status).toBe(200);
  expect(addSpy).not.toHaveBeenCalled();
});
test('closed → 503, not stored', async () => {
  openMock.mockReturnValue(false);
  expect((await POST(req(JSON.stringify({ email: 'a@b.co' })))).status).toBe(503);
  expect(addSpy).not.toHaveBeenCalled();
});
test('addToWaitlist throws → 500', async () => {
  addSpy.mockRejectedValueOnce(new Error('x'));
  expect((await POST(req(JSON.stringify({ email: 'a@b.co' })))).status).toBe(500);
});
```

- [ ] **Step 2:** Run `npm test tests/route.test.ts`; expected: FAIL.
- [ ] **Step 3:** Implement the route per Interfaces, checking in the order listed.
- [ ] **Step 4:** Run `npm test tests/route.test.ts`; expected: PASS.
- [ ] **Step 5:** Commit with `feat: add waitlist API route stub`.

### Task 5: Waitlist form and funding block

**Files:**
- Create: `components/WaitlistForm.tsx`, `components/WaitlistSection.tsx`, `components/FundingBlock.tsx`
- Test: `tests/waitlist-form.test.tsx`, `tests/funding.test.tsx`

**Interfaces:**
- Consumes: `normalizeEmail`, `isWaitlistOpen` (Task 3); the `/api/waitlist` contract (Task 4).
- Produces:
  - `<WaitlistForm open: boolean />` (client component).
  - `<WaitlistSection />`: a server component, `id="waitlist"`, with the H2 "Be the first to lose efficiently." It renders `<WaitlistForm open={isWaitlistOpen()} />`.
  - `<FundingBlock url?: string />`: renders `null` when `url` is falsy. The page passes `process.env.NEXT_PUBLIC_FUNDING_URL`.
- Form copy (exact): input label "Email", placeholder "gary@losingefficiently.com", button "Join the waitlist" ("Joining…" while pending), consent "We'll email you when the simulator launches. Unsubscribe anytime." with a link "Privacy" → `/privacy`. Success: "You're on the list. Your losses have been reserved." Closed: "Waitlist opens soon." Error: the response's `error` string, or for a network failure "Couldn't reach the house. Try again."
- Hidden honeypot input `name="company"`, `tabIndex={-1}`, `autoComplete="off"`, visually hidden, `aria-hidden`.

- [ ] **Step 1: Write the failing tests** (mock `fetch` with `vi.fn()`)

```tsx
test('closed shows notice, no input', () => {
  render(<WaitlistForm open={false} />);
  expect(screen.getByText('Waitlist opens soon.')).toBeInTheDocument();
  expect(screen.queryByLabelText('Email')).toBeNull();
});
test('invalid email shows inline error, no fetch', async () => { /* type "gary", click */
  expect(await screen.findByText("That doesn't look like an email. Even we have standards.")).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});
test('success replaces form', async () => { /* fetch → 200 {ok:true} */
  expect(await screen.findByText("You're on the list. Your losses have been reserved.")).toBeInTheDocument();
});
test('double click sends one request', async () => { /* pending promise; click twice */
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Joining…' })).toBeDisabled();
});
test('server error message shown', async () => { /* fetch → 503 {error:'Waitlist opens soon.'} */ });
test('error clears when typing', async () => { /* after inline error, type → error gone */ });
// funding.test.tsx
test('hidden without url', () => { const { container } = render(<FundingBlock />); expect(container).toBeEmptyDOMElement(); });
test('link with url', () => {
  render(<FundingBlock url="https://ko-fi.com/x" />);
  const a = screen.getByRole('link', { name: 'Fund development' });
  expect(a).toHaveAttribute('href', 'https://ko-fi.com/x');
  expect(a).toHaveAttribute('target', '_blank');
  expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  expect(screen.getByText('This is a joke, but you can still fund the further development of this project.')).toBeInTheDocument();
});
```

- [ ] **Step 2:** Run `npm test tests/waitlist-form.test.tsx tests/funding.test.tsx`; expected: FAIL.
- [ ] **Step 3:** Implement the components. The form state is `'idle' | 'pending' | 'success' | 'error'`. Validate with `normalizeEmail` before `fetch`. Guard re-entry with the pending state. The form posts `{ email, company }`. Styling: the input is a dark pill with a `border-line` border and a pink focus ring; the submit is the primary pink pill. The funding block is a separate `bg-surface` card with a gold-outline pill button "Fund development".
- [ ] **Step 4:** Run `npm test`; expected: all PASS.
- [ ] **Step 5:** Commit with `feat: add waitlist form and funding block`.

### Task 6: Landing sections and page composition

**Files:**
- Create: `components/Nav.tsx`, `Hero.tsx`, `Marquee.tsx`, `HowItWorks.tsx`, `Pricing.tsx`, `Comparison.tsx`, `Testimonials.tsx`, `Faq.tsx`, `Footer.tsx`
- Modify: `app/page.tsx`
- Test: `tests/page.test.tsx`

**Interfaces:**
- Consumes: `LossCounter` (Task 2); `WaitlistSection` and `FundingBlock` (Task 5).
- Produces: section anchors `#how-it-works`, `#pricing`, `#compare`, `#faq` and `#waitlist`. `page.tsx` renders, in order: Nav, Hero, Marquee, HowItWorks, Pricing, Comparison, Testimonials, Faq, WaitlistSection, FundingBlock, Footer.

Copy and content come straight from spec §5. Values the implementer must not change:
- Hero H1: "WE BRING EFFICIENCY" / "TO YOUR GAMBLING." (second line gold, `glow-pink` on the H1). Subline: "Calculate your losses in advance and stop wasting your precious time gambling. Run the simulation and pay us what you'll owe us." CTA: "Run the simulation", an `<a href="#waitlist">` styled as a pink pill with glow. `<LossCounter />` sits under the CTA.
- Nav: wordmark "ROOM FIFTEEN"; links How it works · Compare · FAQ · Waitlist (hidden below `md`); gold outline pill "Only 1% commission".
- Marquee items: "Saving 100% of your time for 1% of your money", "No dealers", "No drinks", "No hope", "We only take 1%". Duplicate the track for a seamless CSS loop; it's static under reduced motion and `aria-hidden`, with an `sr-only` copy of the items.
- How it works: 1. "Choose your game." 2. "Simulate your losses." 3. "Pay us." Include a chip "Simulator coming soon".
- Pricing: a big gold "1%"; the brief's commission line verbatim; a sample bill with rows "Projected losses (3 h slots, €1 stake)" €126.00 · "Time-saving fee (1%)" €1.26 with a "Best value" badge · "Total due" €127.26. Caption: "Time saved: 3 h 00 min. You're welcome."
- Comparison table: the rows exactly as in spec §5.6. It's a semantic `<table>` that scrolls horizontally in a wrapper below `sm`.
- Testimonials: label "What our users say, allegedly". Three fictional quotes, including the "Gary L., Professional Optimist" one. Avatars are circles with initials.
- FAQ: native `<details>` for "Can I win?" ("No. Neither could you before."), "What's the 1% for?", "Is this legal?" and "Is this a joke?". The last one must say plainly that it's satire and that no money is taken except voluntary funding.
- Footer fine print: "Past losses are a guarantee of future losses. Room Fifteen is satire and not a gambling service." Add a responsible-gambling link, "Need help with gambling? BeGambleAware" → `https://www.begambleaware.org/`, a link "Privacy" → `/privacy`, and "© {current year} Room Fifteen".

- [ ] **Step 1: Write the failing smoke test.** Render each section component (not the async page) and assert the copy is present:

```tsx
test('brief copy present', () => {
  render(<><Hero /><Pricing /><Marquee /></>);
  expect(screen.getByText(/We bring efficiency/i)).toBeInTheDocument();
  expect(screen.getByText('We only take 1% commission unlike the real casinos that take all.')).toBeInTheDocument();
  expect(screen.getAllByText('Saving 100% of your time for 1% of your money').length).toBeGreaterThan(0);
});
test('CTA targets waitlist', () => {
  render(<Hero />);
  expect(screen.getByRole('link', { name: 'Run the simulation' })).toHaveAttribute('href', '#waitlist');
});
test('sample bill totals', () => { render(<Pricing />); expect(screen.getByText('€127.26')).toBeInTheDocument(); });
test('footer has help link and satire disclaimer', () => {
  render(<Footer />);
  expect(screen.getByRole('link', { name: /BeGambleAware/ })).toHaveAttribute('href', 'https://www.begambleaware.org/');
  expect(screen.getByText(/satire and not a gambling service/)).toBeInTheDocument();
});
```

- [ ] **Step 2:** Run `npm test tests/page.test.tsx`; expected: FAIL.
- [ ] **Step 3:** Implement the sections and compose `page.tsx`.
- [ ] **Step 4:** Run `npm test`; expected: all PASS. Run `npm run build`; expected: success.
- [ ] **Step 5:** Commit with `feat: build landing page sections`.

### Task 7: Privacy page, OG image and favicon

**Files:**
- Create: `app/privacy/page.tsx`, `app/opengraph-image.tsx`, `app/icon.tsx`
- Test: `tests/privacy.test.tsx`

**Interfaces:**
- Produces: the `/privacy` route; an OG image (1200×630) via `next/og` `ImageResponse`; the favicon via `ImageResponse` (32×32).

- [ ] **Step 1:** Write a test that renders the privacy page and asserts the headings "What we collect", "Why", "Where it's stored", "Unsubscribe and deletion" and "Contact", plus the text "email address only".
- [ ] **Step 2:** Run `npm test tests/privacy.test.tsx`; expected: FAIL.
- [ ] **Step 3:** Implement the privacy page in plain language. Storage reads: "Our email provider (Resend), once the waitlist opens." Contact: a `mailto:` placeholder of `hello@roomfifteen.example`, flagged with `TODO(owner)`. OG image: a `#0B0710` background, the pink "ROOM FIFTEEN" wordmark, and the gold line "Saving 100% of your time for 1% of your money". Favicon: a pink rounded square with a dark "15".
- [ ] **Step 4:** Run `npm test && npm run build`; expected: PASS, success, and the build output lists `/privacy`, `/opengraph-image` and `/icon`.
- [ ] **Step 5:** Commit with `feat: add privacy page, OG image and favicon`.

### Task 8: Final verification

- [ ] **Step 1:** Run `npm run lint && npm test && npm run build`; expected: all clean.
- [ ] **Step 2:** Run `npm run start` and check with a headless browser (Playwright screenshot) at 360, 768 and 1440 widths: no horizontal page overflow, the hero is readable at 360, and the counter ticks.
- [ ] **Step 3:** Emulate `prefers-reduced-motion: reduce` and confirm the marquee is static and the counter doesn't change over 2s.
- [ ] **Step 4:** Tab through the page: every link, the CTA, the FAQ summaries, the email input and the submit are reachable, with a visible focus ring.
- [ ] **Step 5:** `NODE_ENV=production` without `RESEND_API_KEY`: the form shows "Waitlist opens soon." Run `curl -X POST localhost:3000/api/waitlist -d '{"email":"a@b.co"}'`; expected: 503.
- [ ] **Step 6:** Fix anything found, then commit with `chore: final verification fixes` if there were changes.
