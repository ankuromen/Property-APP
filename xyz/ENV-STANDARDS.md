# Environment standards

Configure each app with its own **`.env`** at the repo root of that app (`server/`, `website/`, `admin-panel/`). Update variables there when setup changes.

## API server (`server/.env`)

- `PORT` — default `5000`
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret for broker/auth tokens
- `ADMIN_API_KEY` — shared secret for `X-Admin-Key` on `/api/admin/*` (must match admin-panel)
- Optional: `LEAD_SPAM_REGEX` — spam detection pattern for leads (see `server/utils/leadSpam.js`)

## Public + account website (`website/.env`)

- `NEXT_PUBLIC_API_URL` — base URL of the API (e.g. `http://localhost:5000`)
- `NEXT_PUBLIC_SITE_URL` — canonical site URL for metadata/sitemap (e.g. `http://localhost:3000`)

## Admin panel (`admin-panel/.env`)

- `VITE_API_URL` — API base URL (same host as server)
- `VITE_ADMIN_API_KEY` — must match server `ADMIN_API_KEY`
