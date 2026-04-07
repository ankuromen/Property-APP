# Environment standards

Configure each app with its own **`.env`** at the repo root of that app (`server/`, `website/`, `admin-panel/`). Update variables there when setup changes.

## API server (`server/.env`)

- `PORT` — default `5000`
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret for broker/auth tokens and **admin JWT** (same secret verifies admin login tokens)
- Optional: `LEAD_SPAM_REGEX` — spam detection pattern for leads (see `server/utils/leadSpam.js`)

### Super admin (MongoDB)

Admin users live in the **`AdminUser`** collection (email + hashed password, role `super_admin`).  
Bootstrap the first super admin: from `server/`, run **`npm run seed:admin`** (uses `MONGODB_URI`).  
To change credentials later, update the document in MongoDB or adjust `server/scripts/seedSuperAdmin.js` and re-run (or build a small admin UI later).

## Public + account website (`website/.env`)

- `NEXT_PUBLIC_API_URL` — base URL of the API (e.g. `http://localhost:5000`)
- `NEXT_PUBLIC_SITE_URL` — canonical site URL for metadata/sitemap (e.g. `http://localhost:3000`)

## Admin panel (`admin-panel/.env`)

- `VITE_API_URL` — API base URL (same host as server)

Sign in with the **super admin email and password** stored in MongoDB; the panel keeps the returned JWT in the browser.
