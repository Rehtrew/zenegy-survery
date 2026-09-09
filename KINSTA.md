# Deploy — Kinsta (zenegy.com)

The survey runs as a folder inside the WordPress public directory, exactly like
`CVR-Tjek` and `SalesTeam`: a static build plus a couple of PHP files that write
to the site's MySQL database. No Node, no third-party service, no key in the
browser.

```
/www/zenegycomwebsite_223/public/
└── undersogelse/           ← the survey (folder name is yours to choose)
    ├── index.html
    ├── assets/…
    └── api/
        ├── submit.php      POST one completed survey
        ├── health.php      GET  "are the credentials and tables right?"
        └── config.php, db.php, columns.php, respond.php
```

## What this does and does not touch

- **It adds one table**, `survey_submissions`. The prefix is deliberate: nothing
  in this code reads, writes, alters or drops a `wp_` table, and there is no
  foreign key between the survey and WordPress.
- **It adds one folder.** WordPress serves existing files and folders directly
  and only rewrites paths that don't exist, so a new folder can't shadow a page
  unless a page with that exact slug already exists. Pick a slug nothing uses.
- **It reads `wp-config.php` for database credentials** — read, never executed,
  and only the four `DB_*` constants. That avoids keeping a second copy of the
  password. If you'd rather be explicit, set `SURVEY_DB_NAME`, `SURVEY_DB_USER`,
  `SURVEY_DB_PASSWORD` and `SURVEY_DB_HOST` as environment variables or in a
  `.env` next to the folder, and those win.
- **No email and no IP is ever stored with an answer.** The optional "send me the
  report" email goes straight to HubSpot from the browser and never reaches this
  database — which is what makes "Anonymt" on the landing page true. Keep it that
  way: don't add an email column to `survey_submissions`.

## 1. Create the tables

MyKinsta → your site → **Database** → **SQL console**. Paste the contents of
[`kinsta/schema.sql`](kinsta/schema.sql) and run it. It is two
`CREATE TABLE IF NOT EXISTS` statements, so running it twice is harmless.

Confirm with:

```sql
SHOW TABLES LIKE 'survey_%';
```

One row back means you're done. (Take a backup first if you'd rather —
MyKinsta → Backups → Create backup now. Creating tables can't affect the
existing ones, but there's no harm in a restore point.)

## 2. Build and upload

```bash
npm ci
npm run build:kinsta
```

That produces `dist/` containing the site *and* `dist/api/*.php`. Upload the
**contents of `dist/`** into a new folder under `public/`, e.g.
`public/undersogelse/`.

- **SFTP** is the reliable route: credentials are in MyKinsta → Info → SFTP/SSH.
- The **Files** tab in MyKinsta works too — create the folder, then upload.

`kinsta/schema.sql` is intentionally *not* part of the build: it belongs in the
SQL console, not on the web.

After uploading, clear the site cache (MyKinsta → Caching → Clear cache) so the
new `index.html` is served.

## 3. Verify before sending the link out

```bash
curl https://zenegy.com/undersogelse/api/health.php
```

Expect `{"ok":true,"tables":{"survey_submissions":true}}`.

- `503` with "Ingen forbindelse til databasen" → credentials didn't resolve; set
  the `SURVEY_DB_*` variables explicitly.
- `503` with a table listed as `false` → step 1 didn't run in this database.

Then walk the survey to the end in a browser. The final screen shows
"Dine svar er registreret" when the row is written. Check it landed:

```sql
SELECT id, created_at, track, payroll_context FROM survey_submissions ORDER BY id DESC LIMIT 5;
```

## 4. Getting the data out

From the SQL console, or **Database → survey_submissions → Export** in MyKinsta:

```sql
SELECT * FROM survey_submissions ORDER BY id;
```

The report emails aren't here — they're contacts in HubSpot, on the form you
configured below.

The list-type answers (`c_payroll_systems`, `b_frustrations`, the priority
rankings) are stored as JSON. In MySQL you can unpack them, e.g. how many
bureaus work in each payroll system:

```sql
SELECT system, COUNT(*) AS bureauer
FROM survey_submissions,
     JSON_TABLE(c_payroll_systems, '$[*]' COLUMNS (system VARCHAR(40) PATH '$')) AS s
WHERE track = 'bureau'
GROUP BY system
ORDER BY bureauer DESC;
```

## HubSpot — the report signup

The email on the final screen is submitted straight to a HubSpot form from the
browser, using HubSpot's public form endpoint. No token, no proxy, nothing stored
on Kinsta.

Set these at build time (a `.env` file next to `package.json`, see
`.env.example`) **before** running `npm run build:kinsta` — Vite bakes them into
the bundle:

| Variable | Where to find it |
|---|---|
| `VITE_HUBSPOT_PORTAL_ID` | Marketing → Forms → your form → Share, or the number in any embed code |
| `VITE_HUBSPOT_FORM_GUID` | same place — the form's id |
| `VITE_HUBSPOT_NEWSLETTER_FIELD` | optional: the internal name of the newsletter property on that form |
| `VITE_HUBSPOT_SURVEYS_FIELD` | optional: the property for "keep me posted about future surveys" |

Neither the portal id nor the form guid is a secret; they're visible in every
embedded HubSpot form on the web.

Two things worth knowing:

- **HubSpot rejects a submission containing a field the form doesn't have.** That
  is why each checkbox is only sent when you name its field. If the form has
  required fields beyond email, submissions get rejected too, so keep it to email
  plus the two optional checkbox properties.
- **The two opt-ins are deliberately separate.** Someone happy to answer another
  survey often doesn't want the newsletter, so they need their own property in
  HubSpot rather than sharing one.
- **The `hubspotutk` cookie is passed along** when the visitor has one, so the
  signup joins up with the rest of their activity in HubSpot. If your form uses
  GDPR consent options, tell me and I'll add `legalConsentOptions` to the
  payload — right now the consent text on the screen is ours, not HubSpot's.

## Updating the survey later

Change the questions, then:

```bash
npm run build:kinsta
```

…and re-upload `dist/` over the folder, then clear the cache. If you added a
question, add its column in **both** `kinsta/schema.sql` (as an `ALTER TABLE …
ADD COLUMN`) and `kinsta/api/columns.php` — the endpoint writes only the columns
listed there, so an unlisted answer is silently dropped rather than stored.

## Local development

```bash
npm install
npm run build:kinsta
npm run api      # PHP's built-in server on :8000, serving dist/ + the endpoints
npm run dev      # UI with hot reload on :5173, /api proxied to :8000
```

Point it at a local MySQL with `SURVEY_DB_NAME` / `SURVEY_DB_USER` /
`SURVEY_DB_PASSWORD` / `SURVEY_DB_HOST`, and create the tables there with the
same `kinsta/schema.sql`. `npm run dev` on its own is enough for design work —
only the final screen needs the database.

```bash
npm test         # unit tests (Vitest) + the PHP validation checks
```

## Notes for whoever comes after

- `kinsta/api/columns.php` is the allowlist. Anything a browser posts that isn't
  listed there is dropped, and every write is a prepared statement.
- Rate limiting is per IP in a temp file (30 submissions/hour, 10 signups/hour).
  It blunts a script; it is not a security control.
- Vercel and Supabase were the prototype. Neither is used by this deployment.
