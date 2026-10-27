# Private recipe sync

This is a separate Cloudflare Worker (`recipe-book-sync`) and D1 database (`recipe-book-sync`). It does not bind to or call Setmate's Worker or workout database. The endpoint is public; every data request requires the separate 256-bit recipe capability code. Only its SHA-256 hash is stored in D1. No code is bundled in the website, committed, placed in a URL, or written to service logs. Observability is disabled.

Connect each browser with the same recipe code in Cloud sync. The connection persists in this site's IndexedDB. Anyone with that code can read and edit the recipe library, so retain the private setup file securely. Disconnect keeps local data and cloud data; it does not revoke other computers. To revoke a lost code, provision a replacement token hash for the same library row and reconnect authorized browsers.

The client downloads before uploading and uses the last downloaded document as a three-way merge base. Distinct notes and cooking sessions merge by ID. Different fields of the same entry merge separately. Conflicting edits preserve a marked alternate entry; deletion versus an offline edit keeps the deletion plus a marked copy of the edited entry. Creation dates remain intact. Per-recipe hidden flags support both hide and restore. Deletion tombstones and baselines are retained.

D1 conditionally increments a document revision with each write. A stale revision returns 409, prompting a fresh download and merge. Interrupted uploads retry safely. IndexedDB transactions integrate cloud snapshots with the latest local data, preserving edits made during network requests. Browsers on one computer use Web Locks when available; revision checks remain authoritative when unavailable. The last merge base persists across reloads and reconnecting with the same code.

Local saves schedule sync after 1.5 seconds. Open pages poll every 20 seconds and on focus/reconnection. Failures retain local changes and retry with a delay up to one minute. Closed/suspended pages cannot sync until reopened. Timers and cooking progress are intentionally device-local. Export remains an optional manual backup.

The connection code is stored locally; this is private access control, not end-to-end encryption. Recipe data is processed by Cloudflare. The site and its private connection code must be treated as trusted credentials.

Deploy with the existing authenticated Wrangler CLI: apply `schema.sql` to this recipe database, provision a library row with a random token's SHA-256 hash, and deploy this Worker. `cloud-config.js` contains only the Worker URL. Private provisioning files are ignored by Git. The Pages workflow packages an explicit list of website assets, excluding cloud tools and private files.

Run all tests from the repository root: `node --test tests/*.test.cjs cloud/worker.test.js`. Worker tests use an in-memory SQLite database. Live integration tests use a separate, disposable test library and synthetic records, never the main recipe library or any workouts.
