# Recipe Book

A small personal recipe collection designed for a MacBook. Plain HTML, CSS, and JavaScript; no build step or external services.

## Preview

Run `python -m http.server 4173` from this folder and visit http://localhost:4173.

## Recipe updates

Edit `recipes.js`. Each recipe includes its stable ID, name, category, time, yield, ingredients, steps, and a short source credit. Ingredient rows use `[amount, ingredient]`; section dividers use `{group: 'Heading'}`. Recipe steps were lightly rewritten for clarity while preserving supplied quantities and cooking details.

## Publishing

Push to `main` to deploy with the included GitHub Pages workflow. Set the repository's Pages source to GitHub Actions.

## On your Mac

Open the published site in Safari and choose File → Add to Dock. Ingredient checks last until the cooking page is refreshed or left. Use Reset checks to start again. Search matches names and ingredients; Command-K focuses search. Printing includes only the selected recipe.

No offline caching is included.

## Hidden recipes

Hide a recipe with the discreet button at the bottom right of its cooking page. Collection cards do not show Hide. Normal collection filters exclude it. The Hidden filter lists hidden recipes and provides Restore recipe. Direct recipe links still open; hiding leaves notes and cooking history untouched. Visibility preferences are saved in this browser/device under `recipe-book:hidden:v1`.

## Notes and cooking history

Each recipe has a journal at the bottom. Notes are stamped with their creation date and time. Use I made this to log the cooking date/time, an optional 1–5 rating, and optional notes for that batch. Each session has its own rating, which can be changed later. Checking every ingredient offers a reminder to log a cook, but never logs one automatically.

Journal data is stored in localStorage under `recipe-book:journal:v1:<recipe-id>`. It stays in the current browser/profile on this device and is never sent to GitHub. Clearing website data removes it; different browsers, devices, and the Safari Add to Dock app may have separate storage. Failed saves keep form text visible and show an error. Notes and history are omitted from recipe printouts.

## Collection and cooking pages

The homepage is a searchable recipe collection. Each recipe opens a dedicated page at `recipes/<id>/` with a full-width photo, the recipe name over a dark gradient, and ingredients and steps beneath. Cooking pages have only an All recipes link and Print recipe button. Old `#<id>` links redirect to the matching page.

The static page shells share `app.js`, `recipes.js`, and `style.css` through a relative base URL. When adding a new recipe, copy an existing shell and change its `data-recipe` ID and document title. Keep shared asset version query strings consistent across the homepage and shells when changing scripts or styles.

## Photos and ingredient colors

Every recipe uses `images/<recipe-id>.webp` for its header photo and thumbnail. Image sources and generation prompts are documented in [IMAGE-NOTES.md](IMAGE-NOTES.md). Ingredient names use the same dark food-inspired color in the ingredient list and method. Recipe-scoped aliases in `ingredient-colors.js` distinguish ingredients such as red pepper and black pepper. All ingredient colors have at least 7:1 contrast on the cream background.
