# Environment standards

## API server (`server/.env`)

- `PORT` — default `5000`
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret for broker/auth tokens

Example: see `server/.env.example` (if present) or create from project docs.

## Public + account website (`website/.env`)

- `NEXT_PUBLIC_API_URL` — base URL of the API (e.g. `http://localhost:5000`)
- `NEXT_PUBLIC_SITE_URL` — canonical site URL for metadata/sitemap (e.g. `http://localhost:3000`)

Example file: `website/.env.example`

## Admin panel (`admin-panel/.env`)

- `VITE_API_URL` — API base URL for admin calls

Example file: `admin-panel/.env.example`
