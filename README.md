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
- Minimal named list storage: choose a list to load, Save to update it, Save as new
  to create a copy, and Delete to remove a saved list. Lists remain in this browser.
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
validation. Paid wargear and the optional Outrider Invader ATV are attached
wargear: add the base unit, then use its **Add wargear** button and set the
quantity. Wargear rows use the MFM cost-band background. Wargear points contribute
to totals, but wargear does not count as units. Moving or duplicating a unit includes
its wargear. The app performs no wargear validation.

Old standalone wargear entries automatically attach when exactly one matching
base unit exists in the same bucket. Ambiguous or orphaned wargear remains visible
with their original points and a note to remove and reapply under the intended unit.

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

## Saved lists

The current draft still saves automatically. Named lists are separate snapshots:
use **Save** to name a draft or update the selected saved list, and **Save as new**
to create another list. Choose a name in the selector to load it. Unsaved changes
require confirmation before switching. Selecting **New empty list** while a saved
list is active starts a blank draft; **Clear list** also empties the current draft.
Deleting a saved list requires confirmation and retains the current draft.

Lists include model options and attached wargear. Saved lists use the separate
`warhammer-saved-lists:v1` storage key; existing drafts stay intact. There is no
file export or cloud storage.

## Points sources

The header has a **Points source / MFM** selector. Changing it preserves army
entries and recalculates points from the selected snapshot. Saved lists remember
their source, and loading a list restores it. Clearing a list retains its source.
Missing units/options remain visible but do not contribute points. If an entire
saved source is unavailable, the app displays a warning rather than silently
using another edition’s prices.

The September 2026 snapshot and **Interim (unreleased)** source are bundled.
The interim source contains exactly 56 user-supplied units, 69 model-size options,
and six per-item wargear choices. Names follow the official Space Marines MFM
where present; the four Blood Angels names were checked against their MFM, and
Kaius Konorius was confirmed by the user. Its prices are the user's unreleased
figures, not officially verified prices or a transcription of the linked video.
Sanguinary Guard's doubled-size option is intentionally omitted. The interim date
records preparation, not a publication date. Unlisted units, sizes, wargear and
first/subsequent-unit pricing tiers are not inherited from the official dataset.

When switching, a previous pricing-tier selection resolves to the same model
count if the target has exactly one price for that count. Ambiguous or missing
options stay unavailable, rather than silently choosing a tier.

To add another edition, put its JSON in `src/data/munitorum/`, import it in `index.ts`, and append
it to `munitorums`. Give it a unique dataset ID; retain stable unit/option/wargear
IDs where the underlying selection is the same. Each snapshot uses the existing
Munitorum schema. The selector lists registered sources without runtime fetching.
