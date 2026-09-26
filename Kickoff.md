Build a small browser-only Warhammer 40,000 army list-building web app.

The app is intentionally NOT a full Warhammer army builder.

It should not try to validate army legality or reproduce Battle Forge. It is essentially a very fast, visually polished 2,000-point army scratchpad where I organize units according to MY tactical categories.

The first supported faction is Space Marines.

# 1. PRODUCT GOAL

I want to construct a 2,000-point Space Marines army by assigning units into four tactical buckets:

1. CHARACTERS
2. SHOOTING
3. MELEE
4. SUPPORT

These categories are my own classification.

They are NOT Warhammer keywords or official unit classifications.

For example, I might create:

CHARACTERS                              225 PTS

Marneus Calgar                           140
Captain with Jump Pack                    85

+ ADD UNIT


SHOOTING                                330 PTS

Hellblaster Squad — 10 models            230
Eradicator Squad — 3 models              100

+ ADD UNIT


MELEE                                   290 PTS

Bladeguard Veteran Squad — 6 models      XXX
...

+ ADD UNIT


SUPPORT                                 450 PTS

...
+ ADD UNIT


TOTAL                                  1295 PTS
REMAINING                               705 PTS
LIMIT                                  2000 PTS

The main workflow is:

see four tactical roles
→ add units quickly
→ see the subtotal of each role
→ see total army points
→ see points remaining
→ experiment rapidly

Optimize the entire application around this workflow.

# 2. CORE DESIGN PRINCIPLE

This app exists specifically because I do NOT want a rules-heavy army builder.

It is basically:

Warhammer Munitorum points data
+
four tactical buckets
+
a fast calculator
+
browser persistence

Do not add complexity that is not required for that workflow.

# 3. TECHNOLOGY

Build it as a small frontend-only app.

Use:

- React
- TypeScript
- Vite
- regular CSS or CSS modules
- browser localStorage

Do NOT use:

- backend
- database
- authentication
- user accounts
- cloud persistence
- Redux
- heavy UI frameworks
- server-side API
- runtime scraping

Keep dependencies very small.

The app must work completely locally after build.

# 4. PROJECT STRUCTURE

Use a straightforward structure similar to:

src/
  components/
    ArmyHeader.tsx
    PointsSummary.tsx
    BucketGrid.tsx
    Bucket.tsx
    SelectedUnitRow.tsx
    UnitPicker.tsx
    UnitOptionPicker.tsx

  hooks/
    useArmyList.ts
    useLocalStorage.ts

  utils/
    points.ts

  data/
    munitorum/
      space-marines-2026-09.json

  types/
    army.ts
    munitorum.ts

  styles/
    ...

Avoid unnecessary abstraction.

# 5. MUNITORUM CONFIG

Unit names and points MUST NOT be hard-coded inside React components.

Treat points data as versioned configuration.

The initial source is:

https://mfm.warhammer-community.com/en/space-marines

Create the first dataset:

src/data/munitorum/space-marines-2026-09.json

The current Warhammer Community Munitorum Field Manual was updated on
2026-09-02, so use that as the initial snapshot date.

The app itself must NOT scrape Warhammer Community at runtime.

We will manually replace/update these configuration files when points change.

Use a structure such as:

{
  "id": "space-marines-2026-09",
  "faction": "Space Marines",
  "label": "Space Marines — September 2026",
  "source": "Warhammer Community Munitorum Field Manual",
  "sourceUrl": "https://mfm.warhammer-community.com/en/space-marines",
  "updated": "2026-09-02",
  "units": [
    {
      "id": "marneus-calgar-armour-of-antilochus",
      "name": "Marneus Calgar in Armour of Antilochus",
      "options": [
        {
          "id": "1-model",
          "label": "1 model",
          "points": 140
        }
      ]
    }
  ]
}

The important model is:

UNIT
→ one or more POINT OPTIONS

For example:

{
  "id": "hellblaster-squad",
  "name": "Hellblaster Squad",
  "options": [
    {
      "id": "5-models",
      "label": "5 models",
      "points": 115
    },
    {
      "id": "10-models",
      "label": "10 models",
      "points": 230
    }
  ]
}

Do not model rules beyond what is necessary to choose the appropriate points value.

For v1 the useful information is only:

- unit id
- unit name
- option id
- option label
- points

If the current Munitorum has unusual pricing structures such as different prices
for first/subsequent units, upgrades, or another special points condition,
represent those as explicit selectable options rather than building rules around
them.

Example conceptually:

{
  "id": "example-unit",
  "name": "Example Unit",
  "options": [
    {
      "id": "first-unit",
      "label": "1st unit",
      "points": 100
    },
    {
      "id": "second-plus-unit",
      "label": "2nd+ unit",
      "points": 125
    }
  ]
}

The app is a calculator, not a validator.

# 6. IMPORTANT: BUCKETS ARE NOT PART OF MUNITORUM DATA

Do NOT assign:

category: "shooting"

or similar inside the Munitorum data.

The Munitorum file is factual source data.

My four categories are contextual to each army list.

For example, I could put the same type of unit in SHOOTING in one list and
SUPPORT in another.

The bucket belongs to the selected army-list entry, not the unit definition.

# 7. TYPES

Use something approximately like:

type BucketId =
  | "characters"
  | "shooting"
  | "melee"
  | "support";

type MunitorumOption = {
  id: string;
  label: string;
  points: number;
};

type MunitorumUnit = {
  id: string;
  name: string;
  options: MunitorumOption[];
};

type ArmyEntry = {
  instanceId: string;
  unitId: string;
  optionId: string;
  bucket: BucketId;
};

The same unit must be addable multiple times.

Every added occurrence gets its own instanceId.

Do NOT enforce duplicate/unit limits.

# 8. POINTS

Default army limit:

2000 points

Define this centrally, for example:

const DEFAULT_POINTS_LIMIT = 2000;

Do not scatter 2000 around components.

Calculate:

bucketPoints =
sum of all selected options in that bucket

totalPoints =
sum of all selected units

remainingPoints =
pointsLimit - totalPoints

Never store calculated totals in localStorage.

Always derive them.

If the user goes over 2000 points, allow it.

Example:

2045 USED
-45 REMAINING
2000 LIMIT

Do not block adding units.

# 9. LOCAL STORAGE

Persist the current army automatically.

Suggested key:

warhammer-list-builder:v1

Suggested structure:

{
  "targetPoints": 2000,
  "munitorumId": "space-marines-2026-09",
  "entries": [
    {
      "instanceId": "...",
      "unitId": "marneus-calgar-armour-of-antilochus",
      "optionId": "1-model",
      "bucket": "characters"
    }
  ]
}

Reloading the browser must restore the army.

Changes should persist automatically.

Add:

CLEAR LIST

Ask for confirmation before clearing.

No explicit Save button is necessary.

# 10. MAIN SCREEN

Desktop layout concept:

--------------------------------------------------------
SPACE MARINES                               1845 / 2000
ARMY BUILDER                              155 REMAINING
--------------------------------------------------------

| CHARACTERS  · 225 PTS | SHOOTING · 330 PTS |
|                        |                    |
| Calgar             140 | Hellblasters  230 |
| Jump Captain        85 | Eradicators    100 |
|                        |                    |
| + ADD UNIT             | + ADD UNIT         |
------------------------------------------------

| MELEE       · 520 PTS | SUPPORT  · 770 PTS |
|                       |                    |
| ...                   | ...                |
|                       |                    |
| + ADD UNIT            | + ADD UNIT         |
------------------------------------------------

On smaller screens:

CHARACTERS
↓
SHOOTING
↓
MELEE
↓
SUPPORT

Stack vertically.

# 11. HEADER

Keep the header compact.

Example:

SPACE MARINES
ARMY BUILDER

MUNITORUM · SEP 2026

Possibly include a subtle small subtitle:

2,000 PT FORCE

Do not use Games Workshop logos.

Do not reproduce proprietary artwork.

# 12. POINT SUMMARY

Points are one of the most important visual elements.

Show prominently:

1845
USED

155
REMAINING

2000
LIMIT

or an equivalent compact composition.

The user should immediately understand:

- current total
- remaining points
- army limit

When remaining points get close to zero, they should become visually prominent.

When the army goes over the limit, make the negative remaining value clearly
visible.

Do not prevent it.

# 13. BUCKET COMPONENT

Each of the four buckets must prominently show:

BUCKET NAME
SUBTOTAL

Example:

CHARACTERS                              225 PTS

Then selected units.

A row should show only useful information:

Marneus Calgar                             140

Captain with Jump Pack                      85

Hellblaster Squad
10 models                                  230

The point value should align consistently to the right.

If an option label adds useful information, show it in smaller muted text.

Provide a subtle remove action.

Avoid noisy controls.

At the bottom:

+ ADD UNIT

Make adding units visually obvious.

# 14. ADD UNIT FLOW

Clicking:

+ ADD UNIT

inside SHOOTING should open a picker already scoped to:

ADD TO SHOOTING

The picker can be:

- modal
or
- side drawer

Choose whichever works better with the visual design.

At the top:

ADD TO SHOOTING

[ Search Space Marines... ]

Search must be:

- instant
- case-insensitive
- substring matching
- responsive while typing

Sort matching units alphabetically.

Example:

Captain                                      80
Captain in Gravis Armour                     90
Captain in Phobos Armour                     70
Captain with Jump Pack                       85

If a unit has exactly one option:

clicking the unit immediately adds it.

If a unit has multiple options:

Hellblaster Squad                             >

Selecting it reveals:

5 models                                      115
10 models                                     230

Clicking the option adds the unit to SHOOTING and closes the picker.

The flow should be extremely fast.

# 15. MULTIPLE OPTIONS

When a unit has multiple point options:

Do NOT automatically choose one.

Example:

HELLBLASTER SQUAD

5 MODELS                              115 PTS
10 MODELS                             230 PTS

Selecting one creates the ArmyEntry using the corresponding optionId.

# 16. REMOVE UNIT

Every selected unit must have a way to remove it.

Use something visually restrained, for example:

×
trash icon
overflow menu

Do not make destructive controls dominate the row.

Removal should update totals immediately.

# 17. MOVE BETWEEN BUCKETS

Implement a simple way to move an existing entry between:

CHARACTERS
SHOOTING
MELEE
SUPPORT

Do not implement drag-and-drop unless doing so is trivial and does not add
complexity.

A small overflow/context menu is sufficient:

MOVE TO
Characters
Shooting
Melee
Support

Removing/re-adding should not be necessary.

# 18. VISUAL DIRECTION — IMPORTANT

Styling is a FIRST-CLASS part of this implementation.

The app should clearly take visual inspiration from the current interactive
Warhammer Community Munitorum Field Manual:

https://mfm.warhammer-community.com/en/space-marines

Do NOT simply build a generic React application first and sprinkle dark CSS over
it later.

Translate the Munitorum visual language into an original UI from the beginning.

Do NOT copy:

- Games Workshop logos
- Warhammer artwork
- proprietary illustrations
- icons/assets taken from their site
- exact trademarked graphical assets

But DO reproduce the broader visual language.

The desired feeling is:

DARK
MILITARY
REFERENCE MANUAL
UTILITARIAN
40K-ADJACENT
DENSE
PRECISE
TACTICAL

It should feel closer to a digital military ledger / Munitorum terminal than a
modern SaaS dashboard.

# 19. VISUAL CHARACTERISTICS

Use:

- near-black / charcoal page background
- dark grey surfaces
- slightly lighter secondary surfaces
- off-white primary text
- muted grey secondary text
- thin low-contrast borders
- restrained red accent
- uppercase labels
- compact typography
- strong hierarchy
- condensed-looking display headings where practical
- strong numeric typography for point values
- square / angular panels
- very small corner radii or none
- fine horizontal rules
- subtle separators
- dense but readable spacing
- generous alignment
- tabular treatment of point values

Point totals should look especially strong.

Think:

printed military reference document
+
40K Munitorum UI
+
modern responsive browser interface

# 20. AVOID GENERIC SAAS UI

Explicitly avoid:

- giant rounded cards
- huge 20px+ border radii
- bright gradient backgrounds
- glassmorphism
- colourful dashboards
- excessive shadows
- cartoonish icons
- giant whitespace
- pill-shaped everything
- blue SaaS buttons
- excessive animation
- marketing-site aesthetics

Do not make it look like:

Notion
Linear
Stripe dashboard
generic Tailwind admin template

It should have its own distinctive reference-manual aesthetic.

# 21. TYPOGRAPHY

Use freely available or system fonts only.

Do not copy proprietary Warhammer fonts.

For headings, use a strong narrow/condensed sans-serif if an appropriate free
font is practical.

For body/UI copy, prioritize readability.

Possible hierarchy:

ARMY BUILDER
large condensed uppercase

CHARACTERS
medium condensed uppercase

MUNITORUM · SEP 2026
small tracked uppercase

1845
large numeric text

PTS
small uppercase label

Unit names should be highly readable and less stylized.

# 22. CSS THEME TOKENS

Create theme values centrally using CSS custom properties.

For example:

:root {
  --bg: ...;
  --surface: ...;
  --surface-raised: ...;

  --text: ...;
  --text-muted: ...;
  --text-faint: ...;

  --border: ...;
  --border-strong: ...;

  --accent: ...;
  --danger: ...;

  --spacing-xs: ...;
  --spacing-sm: ...;
  --spacing-md: ...;
  --spacing-lg: ...;
}

Do not hard-code visual values randomly throughout components.

Make it easy for us to tune the visual style after the first version.

# 23. INTERACTIONS

Keep interactions quick and restrained.

Useful:

- subtle hover feedback
- row highlight
- modal transitions
- clear keyboard focus state

Avoid:

- bouncing
- dramatic animation
- elaborate page transitions
- animations that slow down army building

# 24. UNIT PICKER VISUAL STYLE

The picker should feel like browsing an index or Munitorum register.

Example:

ADD TO SHOOTING

SEARCH
┌─────────────────────────────────────┐
│ Hell...                             │
└─────────────────────────────────────┘


HELLBLASTER SQUAD                   >
HEAVY INTERCESSOR SQUAD             >
INFERNUS SQUAD                    180
...

Point values aligned right.

Thin dividers between rows.

Hover should make the active row clear without introducing bright generic UI.

# 25. RESPONSIVENESS

Prioritize desktop usage but make it work properly on mobile.

Desktop:
2 × 2 bucket grid.

Tablet:
2 columns where appropriate.

Mobile:
1 column.

The unit picker should work comfortably on narrow screens.

Do not build a separate mobile application.

# 26. ACCESSIBILITY

Basic accessibility is required.

Use:

- semantic buttons
- visible keyboard focus
- labels for search
- Escape closes modal
- sensible tab order
- sufficient text/background contrast

Do not sacrifice accessibility for the visual theme.

# 27. OUT OF SCOPE

Do NOT implement any of these in this iteration:

- army legality
- detachments
- faction rules
- Battleline rules
- maximum unit counts
- keyword validation
- Leader rules
- attached characters
- wargear validation
- weapon profiles
- datasheets
- enhancements
- command points
- force dispositions
- allied-unit restrictions
- automatic Games Workshop synchronization
- runtime scraping
- cloud saving
- authentication
- user accounts
- list sharing
- export
- import
- PDF generation
- multiple saved armies
- multiple factions

Do not anticipate future requirements by making the implementation complex.

# 28. CODE QUALITY

Keep the implementation simple and understandable.

Prefer:

plain React state
+
derived values
+
small hooks
+
localStorage

over introducing libraries.

Point functions should be pure.

Examples:

calculateBucketPoints(entries, bucketId, munitorum)
calculateTotalPoints(entries, munitorum)
calculateRemainingPoints(total, limit)

Handle broken/stale localStorage gracefully.

If an entry references a unit or option that no longer exists in the active
Munitorum config, do not crash the entire app.

# 29. FIRST DATASET

Populate the first config from:

https://mfm.warhammer-community.com/en/space-marines

Use the current Space Marines unit names and points available there.

Important:

Do not manually guess point values.

Use the source.

If direct automated access to the page is blocked in your environment, create
the config structure and a clearly marked representative dataset first rather
than inventing values.

We can separately supply/correct the complete Munitorum snapshot.

# 30. SAMPLE DATA FOR DEVELOPMENT

At minimum during initial development, make sure these kinds of entries exist so
all UI paths can be tested:

- Marneus Calgar in Armour of Antilochus
- Captain
- Captain with Jump Pack
- a squad with two unit-size options
- a vehicle
- a unit with a long name

But use actual current values from the source when available.

# 31. IMPLEMENTATION ORDER

Build this incrementally.

STEP 1

Create Vite + React + TypeScript app.

Create:
- types
- Munitorum config model
- ArmyEntry model
- localStorage hook
- points calculation utilities

Make sure the app runs.

STEP 2

Add the initial Space Marines Munitorum JSON.

Implement a loader/access layer for it.

Do not hard-code units into components.

STEP 3

Build the main interface:

- header
- points summary
- four buckets
- bucket subtotals
- grand total
- remaining points

Make sure derived totals work correctly.

STEP 4

Implement the unit picker:

- bucket-aware opening
- search
- alphabetical list
- single-option units
- multiple-option units
- adding entries

STEP 5

Implement:

- remove
- move between buckets
- persistence
- clear army

STEP 6

Polish the entire app visually.

Actually compare the result against the referenced Munitorum page and make the
UI feel like an original companion to it.

Pay particular attention to:

- typography
- spacing
- header hierarchy
- panel borders
- density
- numeric point presentation
- unit-row treatment
- picker treatment
- red accent usage
- dark surface hierarchy

Do not finish with generic component styling.

# 32. ACCEPTANCE TEST

The first version is successful if I can:

1. Open the app.
2. See an empty Space Marines 2,000-point army.
3. See Characters, Shooting, Melee and Support.
4. Click ADD UNIT under Characters.
5. Search for Calgar.
6. Select him.
7. Immediately see his points in Characters.
8. See the Characters subtotal update.
9. See TOTAL update.
10. See REMAINING update.
11. Add a Captain with Jump Pack.
12. Add shooting/melee/support units.
13. Add the same unit more than once.
14. Choose a unit-size option where applicable.
15. Move a unit to another bucket.
16. Remove a unit.
17. Refresh the browser.
18. See the same army restored.
19. Exceed 2,000 points without the application blocking me.
20. Clear the list.
21. Use the app comfortably on desktop and phone.

# 33. PRODUCT PRIORITY

When you need to choose between:

more Warhammer rules

and

faster list experimentation

choose faster list experimentation.

When you need to choose between:

extra features

and

better four-bucket UX

choose better four-bucket UX.

When you need to choose between:

generic polished SaaS design

and

a distinctive Munitorum-inspired tactical reference-manual design

choose the Munitorum-inspired design.

# 34. STOP POINT

Do not start adding additional features after completing the scope above.

Once this first working version is complete, stop.

Show me:

1. what was implemented
2. the project/file structure
3. any assumptions made
4. whether the Space Marines Munitorum dataset is complete or partial
5. instructions to run it locally

Then we will review the UX before adding anything else.
