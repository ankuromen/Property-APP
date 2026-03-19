# Sprint 1 — Vendor can add properties

**Goal:** A vendor can register, log in, and add / edit / delete their properties. No customer-facing site yet.

Sprint 1 is split into **4 steps**. Do them in order; each step has a clear deliverable and checkpoint.

---

## Step 1: Backend — Vendor model & Auth APIs

**Scope**
- Vendor model in MongoDB (name, email, phone, password hash).
- Register API: create vendor, hash password, return JWT.
- Login API: validate email + password, return JWT.
- Use `JWT_SECRET` from `.env`; no auth middleware yet.

**Deliverables**
| Item | Details |
|------|--------|
| Model | `models/Vendor.js`: name, email, phone, password (hashed with bcrypt), timestamps. |
| Routes | `POST /api/auth/register`, `POST /api/auth/login`. |
| Response | `{ user: { id, name, email, phone }, token }` (no password in response). |

**Checkpoint**
- Postman/curl: register a vendor → get token.
- Login with same email/password → get token.
- Invalid login → 401.

**Do Step 1 first, then move to Step 2.**

---

## Step 2: Backend — Property model & CRUD APIs

**Scope**
- Property model (title, description, location, price, type, images, `vendorId`).
- CRUD APIs for properties, all protected: only logged-in vendor can create; vendor can only read/update/delete their own properties.
- Auth middleware: verify JWT and attach `req.vendor`.

**Deliverables**
| Item | Details |
|------|--------|
| Model | `models/Property.js`: title, description, location, price, type, images[], vendorId (ref to Vendor). |
| Middleware | `middleware/auth.js`: Bearer token → decode JWT → set `req.vendor`. 401 if invalid/missing. |
| Routes | `POST /api/properties` (create), `GET /api/properties` (list mine), `GET /api/properties/:id` (get one mine), `PUT /api/properties/:id` (update mine), `DELETE /api/properties/:id` (delete mine). All use auth middleware; filter by `vendorId`. |

**Checkpoint**
- With token: create property → 201 and saved in DB.
- Get list → only that vendor’s properties.
- Edit/delete own property → success; other vendor’s ID → 404/403.

**Do Step 2 after Step 1.**

---

## Step 3: Vendor Panel — Auth (Login & Register)

**Scope**
- React (or chosen frontend) app for vendors: Login and Register pages.
- Call backend auth APIs; store JWT (e.g. localStorage or cookie).
- Protected layout: if no token, redirect to login.
- Logout clears token and redirects to login.

**Deliverables**
| Item | Details |
|------|--------|
| Setup | Create `vendor-panel/` (e.g. Vite + React), env for `VITE_API_URL`. |
| Pages | Login page (email, password), Register page (name, email, phone, password). |
| Auth flow | On success: save token, redirect to dashboard/home. On fail: show error. |
| Layout | Protected route wrapper: check token; else redirect to login. Logout button. |

**Checkpoint**
- Register from UI → redirects inside app.
- Refresh → still “logged in” (token present).
- Logout → redirect to login; visiting protected page without token → redirect to login.

**Do Step 3 after Step 2.**

---

## Step 4: Vendor Panel — Property (List, Add, Edit, Delete)

**Scope**
- “My properties” list (table or cards) from `GET /api/properties` with auth token.
- Add property form → `POST /api/properties`.
- Edit property form (prefilled) → `PUT /api/properties/:id`.
- Delete (with confirm) → `DELETE /api/properties/:id`.

**Deliverables**
| Item | Details |
|------|--------|
| List | Page showing vendor’s properties (title, location, price, type); link to edit. |
| Add | Form: title, description, location, price, type, images (optional). Submit → create → redirect to list or detail. |
| Edit | Same form as add, prefilled; submit → update → back to list. |
| Delete | Button on list or detail; confirm dialog → delete → refresh list. |
| API calls | All requests send `Authorization: Bearer <token>`. |

**Checkpoint**
- Logged-in vendor sees empty list → add property → appears in list.
- Edit property → changes persist.
- Delete property → removed from list and from backend.

**Do Step 4 after Step 3.**

---

## Sprint 1 summary

| Step | Focus | Outcome |
|------|--------|--------|
| **1** | Backend — Vendor + Auth APIs | Register & login return JWT. |
| **2** | Backend — Property + CRUD + auth middleware | Vendor can manage properties via API. |
| **3** | Vendor Panel — Auth UI | Vendor can log in and stay in protected area. |
| **4** | Vendor Panel — Property UI | Vendor can list, add, edit, delete properties in the app. |

**End of Sprint 1:** Vendor can sign up, log in, and manage their properties from the vendor panel. Ready to start Sprint 2 (user website + leads) when you are.
