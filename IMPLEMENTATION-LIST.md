# Implementation list — Property Platform

**Goal:** Complete the platform as per [idea.txt](idea.txt). Work through the list in order; mark items `[x]` when done.

**Status:** Sections 1–3 complete. Next: **4.1** (Subscription/plan model).

---

## 1. Backend foundation

- [x] ✓ **1.1** Backend project (Node, Express, MongoDB), env (DB URL, JWT secret), health endpoint.
- [x] ✓ **1.2** Vendor model (name, email, phone, password hash). Register + Login APIs; return JWT.
- [x] ✓ **1.3** Auth middleware: verify JWT, attach `req.vendor` for protected routes.
- [x] ✓ **1.4** Module structure: separate `routes` and `controllers` for vendor, admin, website; mount at `/api/vendor`, `/api/admin`, `/api/website`.
- [x] ✓ **1.5** Vendor profile APIs: GET/PUT `/api/vendor/profile`, PUT `/api/vendor/profile/password`.

---

## 2. Property (backend + vendor panel)

- [x] ✓ **2.1** Property model with all fields (identity, location, area, price, configuration, furnishing, amenities, legal, media, etc.) and `vendorId`.
- [x] ✓ **2.2** Property CRUD APIs (create, list mine, get one, update, delete) under `/api/vendor/properties`; all protected, vendor-scoped.
- [x] ✓ **2.3** Vendor panel: Login and Register pages; store JWT; protected layout with sidebar.
- [x] ✓ **2.4** Vendor panel: Dashboard (welcome + link to properties).
- [x] ✓ **2.5** Vendor panel: My properties list (with Edit, Delete).
- [x] ✓ **2.6** Vendor panel: Add property form (all fields in sections) and Edit property (same form, prefilled).
- [x] ✓ **2.7** Vendor panel: Profile page (edit name, email, phone; change password).
- [x] ✓ **2.8** Vendor panel: Sidebar nav (Dashboard, My properties, Add property, Profile, Logout).

---

## 3. Leads + public property + user website

- [x] ✓ **3.1** Backend: Lead model (`customerName`, `customerPhone`, `propertyId`, `vendorId`, `createdAt`).
- [ ] **3.2** Backend: POST endpoint to create lead (no auth; from user website). Validate property exists and is active.
- [x] ✓ **3.3** Backend: Public property APIs — list (filters, sort, pagination), get by ID (for detail page). No auth.
- [x] ✓ **3.4** Backend: GET leads for logged-in vendor under `/api/vendor/leads` (all leads; daily limit not applied yet).
- [x] ✓ **3.5** User website: Project setup (e.g. Vite + React), home/landing, browse page (call list API), property detail page.
- [x] ✓ **3.6** User website: “Contact Vendor” form (name, phone) on property detail; submit creates lead and shows thank-you message.
- [x] ✓ **3.7** Vendor panel: Leads page — list leads with property reference, customer name, phone (full access for now).

**Checkpoint:** Customer can browse properties, submit Contact Vendor; vendor sees lead. No daily limit or payment yet.

---

## 4. Daily lead limit + subscription (backend)

- [ ] **4.1** Backend: Subscription/plan model (or fields on Vendor: `subscriptionEndsAt`, `subscriptionStatus`).
- [ ] **4.2** Backend: Logic “can vendor see full lead details?” = subscribed **or** within first 5 leads today (calendar day, e.g. IST).
- [ ] **4.3** Backend: Lead list API for vendor — return full details only for leads that pass above; for rest return masked (e.g. “🔒 Upgrade to unlock”) and still count them in list.
- [ ] **4.4** Backend: Public property list — sort/boost so subscribed vendors’ properties appear higher.

---

## 5. Payment + vendor subscription (backend + vendor panel)

- [ ] **5.1** Backend: Payment integration (e.g. Razorpay): create order, verify signature, set subscription (start/end date) on vendor.
- [ ] **5.2** Backend: Webhook from payment provider to activate subscription on success.
- [ ] **5.3** Backend: API for vendor to get “my subscription status” (used by vendor panel).
- [ ] **5.4** Vendor panel: Subscription/Upgrade flow — choose plan → redirect to payment → return URL; show success and subscription status.
- [ ] **5.5** Vendor panel: Leads page — show “X of 5 leads viewed today” for free vendors; show lock + “Upgrade to unlock” where details are hidden.
- [ ] **5.6** Vendor panel: Dashboard (or sidebar) — show subscription status (Free / Active until &lt;date&gt;) and Upgrade CTA when free.

**Checkpoint:** Free vendors see 5 lead contacts/day; paid vendors see all; payment activates subscription.

---

## 6. Polish + visibility

- [ ] **6.1** User website: Filters (location, price, type, BHK, etc.) and sort (newest, price); empty states; “Thank you” after contact.
- [ ] **6.2** Vendor panel: Dashboard summary cards (total properties, leads today, subscription status).
- [ ] **6.3** Ensure public property list uses subscription boost (subscribed vendors rank higher).

---

## 7. Admin (optional / later)

- [ ] **7.1** Backend: Admin user/role; admin-only routes (list vendors, properties, leads, subscriptions; basic stats).
- [ ] **7.2** Admin panel: Login, Dashboard (counts), Vendor list, Subscription/revenue view.

---

## Summary

| Block | Description |
|-------|-------------|
| **1** | Backend foundation (server, vendor auth, middleware, modules, profile) |
| **2** | Property (model, CRUD API, vendor panel: list, add, edit, delete, profile, sidebar) |
| **3** | Leads + public property API + user website (browse, detail, contact) + vendor leads page |
| **4** | Daily lead limit + subscription logic + visibility boost in API |
| **5** | Payment integration + vendor panel subscription flow + leads limit UI |
| **6** | Polish (filters, sort, dashboard cards, thank-you) |
| **7** | Admin (backend + panel) |

**How to use:** Do items in order. When an item is done, change `- [ ]` to `- [x] ✓` in this file.
