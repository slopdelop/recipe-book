CREATE TABLE IF NOT EXISTS recipe_libraries (
 id TEXT PRIMARY KEY,
 token_hash TEXT UNIQUE NOT NULL,
 payload TEXT NOT NULL DEFAULT '{"version":1,"journals":{},"hidden":[]}',
 revision INTEGER NOT NULL DEFAULT 0,
 updated_at TEXT
);
