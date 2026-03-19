# Property Platform — Modules & Functionality

Document describing **Vendor Panel**, **User Website**, **Backend Server**, and **Admin** with their respective modules. Use this for scoping before MERN implementation.

---

## 1. Vendor Side Panel

*Separate app or area where vendors log in to manage listings and leads.*

| Module | What it does |
|--------|----------------|
| **Auth** | Register (name, email, phone, password), Login, Logout, Forgot password / Reset password. |
| **Dashboard** | Overview after login: total properties, leads today, subscription status (active / free), quick link to “Upgrade” if free. |
| **Property management** | Add property (title, description, location, price, type, images, etc.), Edit property, Delete property, List “My properties” with status. Draft vs published (optional). |
| **Leads** | List all leads (with date, property reference). Show customer **name + phone** only for leads within daily free limit; for rest show “🔒 Upgrade to unlock.” Show count: “X of 5 leads viewed today” for free vendors. |
| **Subscription** | View current plan (Free / Paid). Upgrade CTA → payment flow. After payment: show “Active until &lt;date&gt;.” Optionally: billing history, renew, cancel. |
| **Profile / Settings** | View and edit vendor profile (name, email, phone). Change password. |

---

## 2. User Side Website

*Public-facing site where customers browse and contact vendors (no login).*

| Module | What it does |
|--------|----------------|
| **Home / Landing** | Hero, featured or recent properties, search bar, categories or filters teaser. Trust/CTA. |
| **Browse / Search** | List properties with filters (location, price range, type, etc.) and sort (newest, price, relevance). Results use **visibility rule**: subscribed vendors’ listings appear higher. Pagination or infinite scroll. |
| **Property detail** | Single property page: images, description, location, price, vendor name (optional). **“Contact Vendor”** button. |
| **Contact Vendor** | Form: Customer name, Phone. Property reference sent automatically. Submit → “Thank you” message; backend creates one lead for that property’s vendor. No signup required. |
| **Static / Info** | About, Contact us, Privacy, Terms (as needed). |

---

## 3. Backend Server

*API and business logic (Node + Express or similar in MERN).*

| Module | What it does |
|--------|----------------|
| **Auth** | Vendor register, login (return JWT). Password hashing, refresh token (optional). Admin login (separate role). |
| **Vendor** | CRUD for vendor profile. Middleware: “vendor only” for protected routes. |
| **Property** | CRUD for properties (vendor-scoped). Public endpoints: list (with filters, sort, **subscription boost**), get by ID (for detail page). |
| **Lead** | Create lead (from user website: name, phone, propertyId). List leads for logged-in vendor. **Daily limit logic**: for free vendors, mark which leads have “details visible” (first 5 per day); rest return masked/restricted. |
| **Subscription** | Plan model (e.g. monthly). Mark vendor as subscribed (start/end date). Webhook from payment provider to activate subscription. API for vendor: “my subscription status.” |
| **Payment** | Integrate Razorpay (or chosen provider): create order, verify signature, confirm subscription. Webhook for success/failure. |
| **Admin** | Admin-only routes: list vendors, list properties, list leads, override or view subscription, basic stats (counts). Optional: suspend vendor, moderate property. |

---

## 4. Admin

*Internal panel for platform operators.*

| Module | What it does |
|--------|----------------|
| **Auth** | Admin login (separate from vendor login). Logout. |
| **Dashboard** | KPIs: total vendors, total properties, leads (today / week / month), revenue (subscriptions), new signups. Simple charts or tables. |
| **Vendor management** | List vendors (search, filter by subscription). View vendor detail (profile, properties count, leads count). Optional: suspend/activate vendor. |
| **Property management** | List all properties (filter by vendor, status). View/edit or moderate if needed. Optional: feature property, take down. |
| **Lead overview** | List leads (filter by date, vendor). View only; no edit. For support or analytics. |
| **Subscription / Revenue** | List active subscriptions, payment history, failed payments. Manual “mark as paid” or extend subscription if required. |
| **Settings** | Configure subscription plan (price, duration). Optional: visibility rules, daily free lead count (e.g. 5). |

---

## Cross-cutting

| Concern | Where it applies |
|--------|-------------------|
| **Daily lead limit** | Backend (Lead module); Vendor Panel (Leads UI). |
| **Visibility / ranking** | Backend (Property list API); User website (Browse). |
| **Subscription status** | Backend (Subscription + Payment); Vendor Panel (Dashboard, Leads, Subscription); Admin (Vendor + Subscription modules). |

---

## Summary

| App | Main modules |
|-----|----------------|
| **Vendor Panel** | Auth, Dashboard, Property management, Leads, Subscription, Profile/Settings |
| **User Website** | Home, Browse/Search, Property detail, Contact Vendor, Static pages |
| **Backend** | Auth, Vendor, Property, Lead, Subscription, Payment, Admin APIs |
| **Admin** | Auth, Dashboard, Vendor management, Property management, Lead overview, Subscription/Revenue, Settings |

You can use this doc to split work into phases (e.g. Phase 1: Backend + User website + basic Vendor Panel; Phase 2: Subscription + Payment; Phase 3: Admin) when you start MERN implementation.
