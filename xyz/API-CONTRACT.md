# API Contract (v1)

This document defines the baseline request/response/error shapes and endpoint groups for current and near-term implementation.

## Global response shape

### Success
- Object payload: `{ ...resource }`
- List payload: `{ items: [...], pagination?: {...} }` (for newly added APIs)

### Error
- `{ "message": "human-readable message" }`
- HTTP status codes used: `400`, `401`, `403`, `404`, `409`, `422`, `500`

## Auth header
- Protected endpoints require: `Authorization: Bearer <token>`

---

## Broker auth (`/api/broker/auth`)
- `POST /check-phone`
  - body: `{ phone }` (10-digit Indian mobile)
  - if user exists: sends OTP (MSG91) and returns `{ "exists": true, "message": "OTP sent successfully" }`
  - if not: returns `{ "exists": false }` (no OTP)
- `POST /login/verify-otp`
  - body: `{ phone, otp }`
  - success: `{ user: { id, name, email?, phone, roles }, token }`
- `POST /signup`
  - body: `{ fullName, phone, email? }`
  - sends OTP and returns `{ message: "OTP sent successfully" }`
- `POST /signup/verify-otp`
  - body: `{ phone, otp }`
  - success: `{ user: { id, name, email?, phone, roles }, token }`

## Broker profile (`/api/broker/profile`)
- `GET /`
- `PUT /`
- `PUT /password`

## Broker properties (`/api/broker/properties`)
- `POST /`
- `GET /`
- `GET /:id`
- `PUT /:id`
- `DELETE /:id`

## Broker leads (`/api/broker/leads`)
- `GET /`

---

## Public APIs (`/api/website`)

### Properties
- `GET /properties`
  - query: `page`, `limit`, `sort`, `order`, `city`, `locality`, `propertyType`, `transactionType`, `minPrice`, `maxPrice`, `bhk`
- `GET /properties/:id`
- `POST /properties/submit` — **disabled for guests.** Returns **403**; listing creation is **`POST /api/broker/properties`** (authenticated) only. *(Business rule: guests cannot post properties.)*

### Leads
- `POST /leads/send-otp` — body: `customerPhone`, `propertyId` (valid 10-digit Indian mobile). Issues OTP (logged in dev).
- `POST /leads` — body: `customerName`, `customerPhone`, `propertyId`, `otp`, optional `notes`. Requires OTP from prior step.

### Plans (public pricing snapshot)
- `GET /plans` — returns `{ plans: [...] }` for plans with `isActive` and `showOnWebsite`. Used by marketing pages (e.g. `/post-property`). Fields include `code`, `name`, `description`, `priceAmount` (INR), `billingCycle` (`none` \| `monthly` \| `quarterly` \| `half_yearly` \| `yearly`), `leadCapPerListing` (`-1` = unlimited), `profileQuota`.

---

## Admin (`/api/admin/*`)

### Auth (no prior header)
- `POST /auth/login` — body: `{ loginId, password }` (`loginId` = super admin **email** in MongoDB `AdminUser`). Returns `{ token }` (JWT, ~8h). Bootstrap with `npm run seed:admin` in `server/`. Admin UI uses `Authorization: Bearer <token>`.

### Protected routes
- `Authorization: Bearer <token>` from `/auth/login`.

### Properties
- `GET /properties` — query: `status` (`Pending` \| `Active` \| `Rejected`), `page`, `limit`
- `PATCH /properties/:id/approve`
- `PATCH /properties/:id/reject` — body: `{ reason }`
- `PATCH /properties/:id/request-verification` — body: `{ message }` (listing stays `Pending`)

### Plans (subscription tiers)
- `GET /plans` — list all plans (admin)
- `POST /plans` — create (body: `code`, `name`, optional `description`, `priceAmount`, `billingCycle`, `leadCapPerListing`, `profileQuota`, `sortOrder`, `isActive`, `showOnWebsite`)
- `GET /plans/:id`
- `PATCH /plans/:id`
- `DELETE /plans/:id` — blocked if any broker account’s `subscriptionPlanId` matches this plan’s `code` (case-insensitive)

### Locations (hierarchy: Country → State → City → Locality)

All under `/api/admin/locations`, JWT required. Names are unique within their parent (e.g. one `Gurgaon` per state). **Cities** and **localities** require `latitude` and `longitude` (WGS84).

| Method | Path | Notes |
|--------|------|--------|
| `GET` | `/locations/countries` | List countries |
| `POST` | `/locations/countries` | body: `{ name }` |
| `GET` | `/locations/countries/:id` | |
| `PATCH` | `/locations/countries/:id` | body: `{ name }` |
| `DELETE` | `/locations/countries/:id` | Fails if states exist |
| `GET` | `/locations/states?countryId=` | |
| `POST` | `/locations/states` | body: `{ countryId, name }` |
| `GET` | `/locations/states/:id` | |
| `PATCH` | `/locations/states/:id` | body: `{ name }` |
| `DELETE` | `/locations/states/:id` | Fails if cities exist |
| `GET` | `/locations/cities?stateId=` | |
| `POST` | `/locations/cities` | body: `{ stateId, name, latitude, longitude }` |
| `GET` | `/locations/cities/:id` | |
| `PATCH` | `/locations/cities/:id` | body: `{ name, latitude, longitude }` |
| `DELETE` | `/locations/cities/:id` | Fails if localities exist |
| `GET` | `/locations/localities?cityId=` | |
| `POST` | `/locations/localities` | body: `{ cityId, name, latitude, longitude }` |
| `GET` | `/locations/localities/:id` | |
| `PATCH` | `/locations/localities/:id` | body: `{ name, latitude, longitude }` |
| `DELETE` | `/locations/localities/:id` | |

---

## Compatibility policy
- `/api/vendor/*` remains available during migration.
- New frontend work should use `/api/broker/*` and `/api/website/*` only.


## Consultation / Visit Booking

### Public (`/api/website/bookings`)
- `POST /create-order`
  - body: `propertyId`, `customerName`, `customerPhone`, `bookingType`, `notes`, `scheduledAt`
  - returns: `bookingId`, `amount`, `paymentStatus`, `status`
- `POST /verify-payment`
  - body: `bookingId`, `paymentRef`
  - marks `paymentStatus = verified`
- `POST /confirm`
  - body: `bookingId`
  - requires verified payment; marks `status = confirmed`

### Broker (`/api/broker/bookings`)
- `GET /`
  - returns confirmed, paid-intent bookings for current broker
- `PATCH /:id/status`
  - allowed status: `cancelled`, `refund_requested`, `refunded`

### Broker fee
- Broker profile supports `consultationFee` (dynamic per broker, recommended default: `100`).


## Subscription + Lead Access
- Broker profile subscription status: `GET /api/broker/profile/subscription`
- Broker fields: `subscriptionStatus`, `subscriptionPlanId`, `subscriptionStartAt`, `subscriptionEndsAt`
- Broker leads (`GET /api/broker/leads`) behavior:
  - subscribed brokers: full lead details
  - free brokers: only first 5 leads of current day are fully visible
  - beyond limit: phone/name are masked with upgrade CTA
- Public listing boost:
  - active subscribed brokers get ranking boost over free brokers in `/api/website/properties`


## Public broker APIs
- `GET /api/website/brokers`
  - query: `page`, `limit`, `city`
  - returns broker directory with listing counts
- `GET /api/website/brokers/:id`
  - returns broker profile and latest active listings
