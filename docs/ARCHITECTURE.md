# Architecture (target shape)

Short reference for **how the system is organized** (apps, APIs, boundaries). For **business actors, journeys, and rules** without implementation detail, see [`BUSINESS-ARCHITECTURE.md`](./BUSINESS-ARCHITECTURE.md). Open product choices not yet locked are in [`BUSINESS-DECISIONS-PENDING.md`](./BUSINESS-DECISIONS-PENDING.md).

Env variable names live in [`ENV-STANDARDS.md`](./ENV-STANDARDS.md); request shapes in [`API-CONTRACT.md`](./API-CONTRACT.md).

---

## 1. Repositories (three apps + one API)

- **`server`** — Single HTTP API: auth, listings, leads, bookings, subscriptions, public reads. **MongoDB** via Mongoose. **No UI.**
- **`website`** — **Only** customer-facing product: SEO pages, browse/detail, and **signed-in account** (`/account/*`) for people who list as broker or owner (**guests cannot post properties**; marketing pages may still invite users to register). **Next.js (App Router) + Tailwind.**
- **`admin-panel`** — **Separate** internal tool for moderation/ops. **Does not** replace or embed in `website`. Vite + React (or evolve later). Calls **`/api/admin/*`** only.

---

## 2. Layering

- **Presentation** — `website` and `admin-panel` (browsers). No direct DB access.
- **Application / domain** — `server` (Express routes → controllers → services where needed).
- **Data** — MongoDB collections; models live under `server` only.

---

## 3. API surface (who calls what)

| Area | Base path | Called by |
|------|-----------|-----------|
| **Broker (primary)** | `/api/broker/*` | `website` `/account` (JWT) |
| **Public** | `/api/website/*` | `website` (browse, detail, contact, broker directory) |
| **Admin** | `/api/admin/*` | `admin-panel` (future: auth + roles) |
| **Legacy** | `/api/vendor/*` | Deprecated mirror of broker; remove when unused |

- **Rule:** Public pages and anonymous flows use **`/api/website/*`**. Logged-in listing owners/brokers use **`/api/broker/*`**. Admin never shares cookies with the public site in a way that bypasses server checks.

---

## 4. User journeys (conceptual)

- **Visitor** — Discovers listings on `website`; **cannot post a property** without an account. `/post-property` explains sign-up and links to **`/account`** (listing CRUD uses **`/api/broker/*`**).
- **Lister (account)** — Registers/logs in on **`website`** → **`/account`**: profile, CRUD listings, leads (same origin as marketing; better trust and SEO cohesion).
- **Operator** — Uses **`admin-panel`** against **`/api/admin/*`** (moderation queue, brokers, audits) — implemented incrementally.

---

## 5. Naming (product vs code)

- **Product:** “Broker” and “owner” for listing source; “account” for the logged-in area (not a separate “broker panel” product).
- **Code:** `Vendor` model / legacy routes may remain until a deliberate migration; new work prefers **`broker`** routes and clear DTOs.

---

## 6. Cross-cutting concerns

- **Auth:** JWT issued by `server`; stored by `website` client for `/account` (e.g. `localStorage` + `Authorization: Bearer`).
- **CORS:** Allow `website` and `admin-panel` origins in production; tighten for admin.
- **SEO:** All indexable HTML from **`website`** only; `admin-panel` should be **noindex** or non-public.

---

## 7. What this architecture avoids

- Separate “broker panel” SPA repo duplicating `website` chrome and auth.
- Admin features mixed into the public Next.js app (keeps attack surface and deploys simpler).
- Clients talking to MongoDB directly (never).

---

## 8. Evolution (optional next steps)

- **Unified user model** (roles: visitor, lister-broker, lister-owner, admin) if you need one identity across anonymous browse + account.
- **Payment webhooks** only on `server`; `website`/`admin-panel` reflect status via API.
- Retire **`/api/vendor/*`** once all clients use **`/api/broker/*`**.
