# Where to Start — Implementation Order

Recommended order so each step has something working and you can test the flow before adding the next piece.

---

## Phase 0: One-time setup
- **Repo & structure:** Single repo or monorepo (e.g. `backend/`, `vendor-panel/`, `user-website/`, `admin/`).
- **Backend:** Node + Express, MongoDB, env (DB URL, JWT secret).
- **MongoDB:** Create DB; no need for all collections yet.

**Start here:** Backend project + DB connection. No UI yet.

---

## Phase 1: Backend + Vendor can add properties

**Goal:** Vendor registers, logs in, and can add/edit/delete properties. No customer side yet.

| Order | What to build |
|-------|----------------|
| 1 | **Backend — Auth:** Vendor model (name, email, phone, password hash). Register + Login APIs; return JWT. |
| 2 | **Backend — Property:** Property model (title, description, location, price, type, images, `vendorId`). CRUD APIs protected by “vendor only” middleware. |
| 3 | **Vendor Panel — Auth:** Login + Register pages; store JWT; protected layout. |
| 4 | **Vendor Panel — Property:** “My properties” list, Add property form, Edit, Delete. |

**Checkpoint:** Vendor can sign up, log in, and manage properties. You can seed a few properties for the next phase.

---

## Phase 2: User website + Leads

**Goal:** Customers see properties and submit “Contact Vendor”; leads are saved and visible to vendor.

| Order | What to build |
|-------|----------------|
| 5 | **Backend — Lead:** Lead model (customerName, customerPhone, propertyId, vendorId, createdAt). API: create lead (from user site, no auth). API: list leads for logged-in vendor. |
| 6 | **Backend — Public property:** APIs: list properties (with filters/sort), get single property by ID. No auth. |
| 7 | **User Website:** Home, Browse (call list API), Property detail page, **Contact Vendor** form (name, phone) → calls create-lead API. |
| 8 | **Vendor Panel — Leads:** Leads page: list leads with property ref; show name + phone for all (limit not enforced yet). |

**Checkpoint:** Full loop works: user browses → contacts vendor → vendor sees lead. No payment or limit yet.

---

## Phase 3: Daily lead limit + Subscription

**Goal:** Free vendors see only 5 lead contacts per day; subscribed vendors see all.

| Order | What to build |
|-------|----------------|
| 9 | **Backend — Subscription:** Plan/subscription model; vendor has `subscriptionStatus` and `subscriptionEndsAt`. Logic: “can see full lead details?” = subscribed OR within first 5 leads today. |
| 10 | **Backend — Lead API update:** When listing leads for vendor, return full details only for leads that pass the above rule; for rest return masked + “Upgrade to unlock.” |
| 11 | **Vendor Panel — Leads:** Show “X of 5 leads today” for free; show lock + CTA where details are hidden. |
| 12 | **Backend — Payment:** Razorpay (or other) integration: create order, verify, set subscription. Webhook to activate subscription. |
| 13 | **Vendor Panel — Subscription:** “Upgrade” flow: choose plan → pay → redirect back; Dashboard shows subscription status. |

**Checkpoint:** Free vs paid behavior works; payments activate unlimited leads.

---

## Phase 4: Visibility + Polish

**Goal:** Subscribed vendors rank higher; all flows stable.

| Order | What to build |
|-------|----------------|
| 14 | **Backend — Property list:** In list/sort, boost subscribed vendors (e.g. sort by `isSubscribed` first, then date/price). |
| 15 | **Vendor Panel — Dashboard:** Summary cards (properties count, leads today, subscription). |
| 16 | **User Website:** Polish filters, sort, empty states, “Thank you” after contact. |

---

## Phase 5: Admin (can be later)

**Goal:** You can manage vendors, see revenue, support.

| Order | What to build |
|-------|----------------|
| 17 | **Backend — Admin:** Admin user/role; admin-only routes: list vendors, properties, leads, subscriptions. |
| 18 | **Admin Panel:** Login, Dashboard (counts), Vendor list, Subscription/revenue view. |

---

## Summary: where to start

1. **Start with:** Backend project + MongoDB + **Vendor Auth** (register/login) + **Property model & CRUD**.
2. **Then:** Vendor Panel (auth + property management) so you can add properties.
3. **Then:** Backend Lead + public property APIs + User website (browse + contact) so the core loop works.
4. **Then:** Daily limit + Subscription + Payment.
5. **Last:** Visibility boost, dashboard polish, Admin.

If you want a single “first task”: **Backend — Vendor register + login API and Property model + create property API.** After that, build the Vendor Panel login and “Add property” form.
