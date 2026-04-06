# Implementation List — Property Platform (Broker + Owner Model)

**Goal:** Build a **marketplace platform** where users browse properties, owners and brokers post listings, and monetization is through **platform** levers (lead-access plans, visibility, optional booking facilitation)—not the platform acting as a property consultant.

**Website stack:** **Next.js + Tailwind CSS** with **SEO-first implementation**.

**Status:** Sections 1-8 completed. Next: **9.1**.

---

## 1. Foundation and Architecture

- [x] ✓ **1.1** Finalize product terminology: Vendor -> Broker, User Website -> Public Website, Vendor Panel -> Broker Panel.
- [x] ✓ **1.2** Freeze system modules: `server`, `website` (public + `/account`), `admin-panel`.
- [x] ✓ **1.3** Define shared env standards (per-app `.env`, API base URLs, JWT secret, DB URI).
- [x] ✓ **1.4** Confirm route strategy and ownership:
  - Broker APIs: `/api/broker/*`
  - Public APIs: `/api/website/*`
  - Admin APIs: `/api/admin/*`
- [x] ✓ **1.5** Create master API contract doc (request/response/error shape).

**Checkpoint:** Clear naming + route contracts + env setup locked before feature work.

---

## 2. Backend Core Refactor (Vendor -> Broker)

- [x] ✓ **2.1** Rename app-facing labels from Vendor to Broker (without breaking existing DB data).
- [x] ✓ **2.2** Keep backward compatibility for existing `Vendor` collection/model while migrating service and route naming.
- [x] ✓ **2.3** Broker auth APIs: register/login, JWT middleware, profile APIs.
- [x] ✓ **2.4** Broker property CRUD remains broker-scoped.
- [x] ✓ **2.5** Add migration notes for full model rename later (optional).

**Checkpoint:** Broker auth + property management APIs are stable and backward compatible.

---

## 3. Property Source Model (Broker + Owner Posting)

- [x] ✓ **3.1** Extend property schema with listing source:
  - `postedByType`: `broker | owner`
  - `postedById` (broker id if broker)
  - `ownerContact` (name, phone, email optional) if owner listing
- [x] ✓ **3.2** Add moderation fields:
  - `status`: `Pending | Active | Rejected`
  - `reviewNotes`, `reviewedBy`, `reviewedAt`
- [x] ✓ **3.3** Ensure public listing APIs only expose `Active` properties.
- [x] ✓ **3.4** Keep owner privacy and anti-abuse validations.

**Checkpoint:** Both broker and owner listings supported with moderation-safe lifecycle.

---

## 4. Public Property Submission (No Full Account Required)

- [x] ✓ **4.1** Create public submit endpoint: `POST /api/website/properties/submit`.
- [x] ✓ **4.2** Validate required fields + phone format + basic spam controls (rate limit/captcha-ready hooks).
- [x] ✓ **4.3** Save public submissions as `Pending` by default.
- [x] ✓ **4.4** Return tracking/ack response for user confirmation.

**Checkpoint:** Owners can submit listings; unapproved listings never appear publicly.

---

## 5. Leads and Contact Flow

- [x] ✓ **5.1** Keep/upgrade lead creation endpoint from property detail (name + phone + property ref).
- [x] ✓ **5.2** Route lead destination correctly:
  - broker listing -> broker lead inbox
  - owner listing -> owner contact pipeline
- [x] ✓ **5.3** Broker leads API in broker panel with property reference and timestamps.
- [x] ✓ **5.4** Add lead status field (`new`, `contacted`, `closed` optional for next phase).

**Checkpoint:** Contact actions create reliable leads for both broker and owner listings.

---

## 6. Consultation / Property Visit Booking (Paid Intent Filter)

- [x] ✓ **6.1** Add booking model: consultation/visit request linked to property + broker.
- [x] ✓ **6.2** Add broker-level dynamic booking fee (`consultationFee`, default recommendation: Rs 100).
- [x] ✓ **6.3** Create booking flow APIs:
  - create booking order
  - verify payment
  - confirm booking
- [x] ✓ **6.4** Only confirmed paid bookings appear in broker high-intent queue.
- [x] ✓ **6.5** Add cancellation/refund status hooks (manual first, automation later).

**Checkpoint:** Paid booking works and filters non-serious buyers.

---

## 7. Subscription + Lead Access Control (Broker Monetization)

- [x] ✓ **7.1** Subscription model/fields for broker (`status`, `startAt`, `endAt`, `planId`).
- [x] ✓ **7.2** Free broker rule: max 5 full lead contacts/day.
- [x] ✓ **7.3** Beyond free limit, mask lead phone/details with upgrade CTA.
- [x] ✓ **7.4** Add subscription boost factor in public property sorting.
- [x] ✓ **7.5** Expose broker subscription status API for broker panel.

**Checkpoint:** Free-vs-paid lead visibility rules enforced end-to-end.

---

## 8. Public Website (Next.js + Tailwind + SEO)

- [x] ✓ **8.1** Initialize `website` (Next.js App Router + Tailwind) with integrated account area.
- [x] ✓ **8.2** Build pages:
  - Home (SEO landing)
  - Browse listings
  - Property detail
  - Post property
  - Broker directory + broker profile
- [x] ✓ **8.3** Build SEO foundations:
  - metadata API per page
  - canonical URLs
  - OpenGraph/Twitter meta
  - schema.org (RealEstateListing/Breadcrumb)
  - dynamic sitemap + robots.txt
- [x] ✓ **8.4** Use SSR/ISR for listing and detail pages for crawlability.
- [x] ✓ **8.5** Add Core Web Vitals optimizations (image, font, caching, lazy loading).
- [x] ✓ **8.6** Add location-driven SEO pages (city/locality landing pages).

**Checkpoint:** Website is indexable, fast, and SEO-friendly by default.

---

## 9. Account on website (broker/owner hub + expand)

- [x] ✓ **9.0** Unified **website** app: public pages + `/account` (auth, properties, profile, leads) — no separate broker panel app.
- [ ] **9.1** Branding and copy: broker/owner roles clearly in account UI.
- [ ] **9.2** Keep modules: auth, properties, profile, leads (already in `/account`).
- [ ] **9.3** Add broker settings for consultation fee and availability slots.
- [ ] **9.4** Add subscription status + upgrade flow in account.
- [ ] **9.5** Add booking inbox (paid visit/consultation requests).

**Checkpoint:** Brokers/owners manage listings, leads, booking fees, and paid consultations from the same site.

---

## 10. Payments

- [ ] **10.1** Integrate payment provider for subscription and booking payments.
- [ ] **10.2** Create order + verify signature endpoints.
- [ ] **10.3** Implement webhook handlers for success/failure reconciliation.
- [ ] **10.4** Record transaction logs and audit trail.

**Checkpoint:** Payments are verifiable and reflected in product state.

---

## 11. Admin / Moderation (Lean First)

- [ ] **11.1** Admin auth + role guard.
- [ ] **11.2** Property moderation queue for `Pending` owner submissions.
- [ ] **11.3** Basic views: brokers, owners, listings, leads, bookings, subscriptions.
- [ ] **11.4** Approve/reject workflows with notes.

**Checkpoint:** Platform can safely moderate and operate supply quality.

---

## 12. QA, Analytics, and Launch Readiness

- [ ] **12.1** End-to-end test checklist for critical funnels:
  - browse -> detail -> contact lead
  - owner post -> moderation -> publish
  - booking payment -> broker queue
  - free lead limit -> paywall -> subscription unlock
- [ ] **12.2** Add analytics events (lead created, booking started/paid, property submitted, upgrade clicked).
- [ ] **12.3** Security and abuse controls (rate limiting, validation hardening, auth checks).
- [ ] **12.4** Production release checklist + rollback plan.

**Checkpoint:** MVP is test-validated and launch-ready.

---

## Priority Execution Order (Recommended)

1. Sections **1-4** (core architecture + owner posting)
2. Section **8** (Next.js website with SEO baseline)
3. Sections **5 + 9** (lead flow + broker panel rename/continuity)
4. Sections **6 + 10** (paid booking + payments)
5. Sections **7 + 11 + 12** (monetization controls, moderation, launch hardening)

---

## How to Use

- Execute items in order unless dependencies are explicitly independent.
- Mark completed work as: `- [x] ✓`.
- Do not start payment-heavy work before core listing + lead funnels are stable.
- Treat SEO tasks as first-class requirements, not post-launch polish.
