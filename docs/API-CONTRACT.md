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
- `POST /register`
  - body: `name`, `email`, `phone`, `password`
  - success: `{ user: { id, name, email, phone }, token }`
- `POST /login`
  - body: `email`, `password`
  - success: `{ user: { id, name, email, phone }, token }`

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
- `POST /properties/submit` (planned in Section 4)
  - body (planned): `title`, `propertyType`, `price`, `ownerName`, `ownerPhone` (+ optional fields)
  - expected behavior: creates listing with `status = Pending`

### Leads
- `POST /leads`
  - body: `customerName`, `customerPhone`, `propertyId`

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
