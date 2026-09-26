# Teleportarium

A browser-only Space Marines army scratchpad. Assign units to Characters, Shooting,
Melee and Support, choose their points options, and experiment against a 2,000-point
target. Duplicates and armies over the target are allowed. No army legality rules
are enforced.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local address printed by Vite (normally http://localhost:5173).

```sh
npm run build
npm run preview
```

The production build is in `dist/`. Serve that directory with any static web
server. No backend or external network calls are required by the app. The source
link opens the official page only when clicked.

## Implementation

- Four tactical buckets with derived subtotals and used/remaining/limit points.
- Searchable, alphabetically sorted unit register with explicit option selection.
- Duplicate units, removal, and moving entries via the small arrow control.
- Automatic localStorage persistence and confirmation before clearing.
- Responsive dark reference-manual styling, native modal keyboard handling,
  focus restoration, and reduced-motion support.
- Invalid saved rows are discarded; stale references remain removable and do not
  contribute to totals. Unavailable storage displays a session-only warning.

## Structure

```text
src/
  components/      Header, summary, buckets, rows and picker
  data/munitorum/  Versioned JSON snapshot and typed access layer
  hooks/          Army edits and localStorage persistence
  styles/         Central theme tokens and responsive styles
  types/          Army and Munitorum models
  utils/          Pure points calculations and saved-state validation
tests/
  core.test.ts    Calculation, storage and dataset checks
  browser/        Playwright acceptance checks
scripts/
  inspect-source.mjs  Development-only extraction of downloaded source HTML
```

## Dataset and assumptions

The snapshot contains all **103 units displayed on the official Space Marines
page**, retrieved on 2026-09-26 from
[Warhammer Community](https://mfm.warhammer-community.com/en/space-marines).
Legends, detachments and enhancements are excluded. Unit labels retain the source
wording with title casing; points come directly from its rendered price rows.
There is no runtime scraping or synchronization.

The source identifies itself as **v1.4**. The requested 2026-09-02 snapshot date
is retained as `updated`, but was not independently confirmed from the page;
`dateVerified: false` and `retrieved` record this distinction.

First/subsequent-unit prices are separate selectable options, without automatic
validation. Paid wargear is explicitly labelled **Upgrade only**: add the base
unit, then add each paid upgrade as a separate entry. The Outrider `+ 1 Invader ATV`
option is likewise an additional cost, not a complete squad. The app performs no
wargear validation.

The army starts empty and the target is fixed at 2,000. Anton headings and Bitter
body text match the MFM font families, bundled locally through Fontsource under
their open font licenses. Dark colors follow the MFM neutral palette and slate
header bands. Browser storage is local to the current origin/browser profile.

## Verification

`npm run build` and `npm test` passed. Browser acceptance tests are included, but
have **not been verified**: the required Playwright browser was unavailable, and
manual browser testing was chosen instead.

Optional automated browser checks:

```sh
npx playwright install chromium
npx playwright test
```

For manual review, follow the acceptance checklist in `Kickoff.md`, especially
multi-option units, moving duplicates independently, refreshing the army, going
over 2,000 points, clear confirmation, and the phone layout.
