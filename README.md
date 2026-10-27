# Recipe Book

A small personal recipe collection designed for a MacBook. Plain HTML, CSS, and JavaScript; no build step or external services.

## Preview

Run `python -m http.server 4173` from this folder and visit http://localhost:4173.

## Recipe updates

Edit `recipes.js`. Each recipe includes its stable ID, name, category, time, yield, ingredients, steps, and a short source credit. Ingredient rows use `[amount, ingredient]`; section dividers use `{group: 'Heading'}`. Recipe steps were lightly rewritten for clarity while preserving supplied quantities and cooking details.

## Publishing

Push to `main` to deploy with the included GitHub Pages workflow. Set the repository's Pages source to GitHub Actions.

## On your Mac

Open the published site in Safari and choose File → Add to Dock. Cook view collapses the photo, enlarges the text, and highlights the current step. Ingredient checks, current step, text size and view preference survive reloads. Start over clears progress while keeping notes, history and timers. Keep screen awake uses the browser wake lock when supported, with a visible status. Search matches names and ingredients; Command-K focuses search. Printing includes only the selected recipe.

No offline caching is included.

## Step timers

Click a highlighted time in a step to start its timer. Adjust timer reveals custom seconds, minutes or hours. Stable step IDs and timer metadata are authored in `recipes.js`. Ranges default to their lower bound; the recipe range stays visible. Squash roasting optionally announces a halfway reminder. Several named timers can run in the floating, collapsible Kitchen timers panel, with pause/resume, cancel, restart, and dismiss controls.

Timers use absolute deadlines and serialized IndexedDB transactions to recover after reloads and remain visible while moving between recipes. Completion plays a four-note Web Audio tune and speaks the timer name using the browser's speech synthesis voice. Use Test sound & voice, or Enable sound & voice after restoring a timer. Sound needs an open page, an awake device, and enabled audio. A sleeping/suspended browser can delay an alarm; on returning, the timer checks the real deadline and shows that it finished. This is a browser timer, not an OS background alarm. Unique run IDs and transactional event claims coordinate completion between tabs. Cancelled and replaced runs cannot announce later.

## Hidden recipes

Hide a recipe with the discreet button at the bottom right of its cooking page. Collection cards do not show Hide. Normal collection filters exclude it. The Hidden filter lists hidden recipes and provides Restore recipe. Direct recipe links still open; hiding leaves notes and cooking history untouched. Visibility preferences are saved in this browser/device under `recipe-book:hidden:v1`.

## Notes and cooking history

Each recipe has a journal at the bottom. Notes are stamped with their creation date and time. Use I made this to log the cooking date/time, an optional 1–5 rating, and optional notes for that batch. Each session has its own rating, which can be changed later. Checking every ingredient offers a reminder to log a cook, but never logs one automatically.

Journal data is stored in IndexedDB. Existing localStorage data is imported automatically and left intact as a recovery copy. Transactions preserve independent changes across tabs. Edit preserves the original creation date; Delete provides Undo. Stale edits are blocked with the draft intact. New-entry drafts survive reloads in the same tab. It stays in the current browser/profile on this device and is never sent to GitHub. Clearing website data removes it; different browsers, devices, and the Safari Add to Dock app may have separate storage. Failed saves keep form text visible and show an error. Notes and history are omitted from recipe printouts.

## Collection and cooking pages

The homepage is a searchable recipe collection. Each recipe opens a dedicated page at `recipes/<id>/` with a full-width photo, the recipe name over a dark gradient, and ingredients and steps beneath. Cooking pages have only an All recipes link and Print recipe button. Old `#<id>` links redirect to the matching page.

The static page shells share `app.js`, `recipes.js`, and `style.css` through a relative base URL. When adding a new recipe, copy an existing shell and change its `data-recipe` ID and document title. Keep shared asset version query strings consistent across the homepage and shells when changing scripts or styles.

## Photos and ingredient colors

Every recipe uses `images/<recipe-id>.webp` for its header photo and thumbnail. Image sources and generation prompts are documented in [IMAGE-NOTES.md](IMAGE-NOTES.md). Ingredient names use the same dark food-inspired color in the ingredient list and method. Recipe-scoped aliases in `ingredient-colors.js` distinguish ingredients such as red pepper and black pepper. All ingredient colors have at least 7:1 contrast on the cream background.

## Backup and checks

Backup & restore on the collection page exports notes, cooking history, ratings and hidden recipes as JSON. Import validates and previews the file before merging by stable entry ID and revision. Reimporting does not duplicate entries; deletion records prevent older backups from resurrecting deleted entries. Data stays local until you choose to save or move a backup. This does not provide cloud sync.

Run regression tests with `node --test tests/state.test.cjs`. Browser verification includes simultaneous notes and independent ratings in two tabs, stale-edit recovery, Delete/Undo, backup restore into a fresh origin, duplicate-safe reimport and synchronized step timers. Safari audio and wake-lock behavior still need a real Mac check.
