# Recipe Book

A small personal recipe collection designed for a MacBook. Plain HTML, CSS, and JavaScript; no build step or external services.

## Preview

Run `python -m http.server 4173` from this folder and visit http://localhost:4173.

## Recipe updates

Edit `recipes.js`. Each recipe includes its stable ID, name, category, time, yield, ingredients, steps, and a short source credit. Ingredient rows use `[amount, ingredient]`; section dividers use `{group: 'Heading'}`. Recipe steps were lightly rewritten for clarity while preserving supplied quantities and cooking details.

## Publishing

Push to `main` to deploy with the included GitHub Pages workflow. Set the repository's Pages source to GitHub Actions.

## On your Mac

Open the published site in Safari and choose File → Add to Dock. Ingredient checks last while the app is open, and are kept separately for each recipe. Use Reset checks to start again. Search matches names and ingredients; Command-K focuses search. Printing includes only the selected recipe.

No offline caching is included.
