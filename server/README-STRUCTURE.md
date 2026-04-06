# Backend structure — modules (isolated)

Each module (**vendor**, **admin**, **website**) has its **own controllers, routes, and API base path**. Changes in one module do not conflict with or affect the others.

## Principle: module isolation

- **Vendor** → only `controllers/vendor/` + `routes/vendor/` → only `/api/vendor/*`
- **Admin** → only `controllers/admin/` + `routes/admin/` → only `/api/admin/*`
- **Website** → only `controllers/website/` + `routes/website/` → only `/api/website/*`

No shared route files or controller files across modules. Each module is self-contained so that:
- Changing vendor APIs does not touch admin or website code.
- Changing admin logic does not touch vendor or website code.
- Changing public website APIs does not touch vendor or admin code.

---

## Folders (strict per module)

```
controllers/
  vendor/          # Only vendor-panel logic
    authController.js
    (later: propertyController.js, leadController.js, ...)
  admin/           # Only admin-panel logic
    (e.g. authController.js, vendorController.js, ...)
  website/         # Only public-site logic (no auth)
    (e.g. propertyController.js, leadController.js)

routes/
  vendor/
    auth.js
    index.js       # mounts all vendor routes
  admin/
    index.js       # mounts all admin routes
  website/
    index.js       # mounts all website routes
```

**Rule:** A controller or route file belongs to **one** module. Do not require a file from another module’s controller/route (use shared **models** or **middleware** instead if needed).

---

## API base paths (no overlap)

| Module   | Base path       | Owned by     | Used by        |
|----------|-----------------|-------------|----------------|
| Vendor   | `/api/vendor/*` | vendor      | Vendor panel   |
| Admin    | `/api/admin/*`   | admin       | Admin panel    |
| Website  | `/api/website/*`| website     | User website   |

URLs never overlap, so there is no conflict between modules.

---

## Shared vs module-specific

- **Shared (everyone can use):** `models/`, `config/`, `middleware/` (e.g. auth helpers). These are not “owned” by a single module.
- **Module-specific:** Controllers and routes live only under that module’s folder. Each module imports from `models/` or `middleware/` as needed but does not import from another module’s `controllers/` or `routes/`.

---

## Current endpoints (by module)

**Vendor**
- `POST /api/vendor/auth/register`
- `POST /api/vendor/auth/login`
- `POST /api/vendor/properties` (create) — auth required
- `GET /api/vendor/properties` (list mine) — auth required
- `GET /api/vendor/properties/:id` (get one) — auth required, own only
- `PUT /api/vendor/properties/:id` (update) — auth required, own only
- `DELETE /api/vendor/properties/:id` (delete) — auth required, own only
- `GET /api/vendor/profile` — auth required, returns current vendor (no password)
- `PUT /api/vendor/profile` — auth required, body: name, email, phone
- `PUT /api/vendor/profile/password` — auth required, body: currentPassword, newPassword
- `GET /api/vendor/leads` — auth required, list leads for current vendor (with property ref)

**Admin** — (none yet)

**Website** (no auth)
- `GET /api/website/properties` — list public properties (query: page, limit, sort, order, city, propertyType, minPrice, maxPrice, bhk, etc.)
- `GET /api/website/properties/:id` — get single public property
- `POST /api/website/leads` — create lead; body: customerName, customerPhone, propertyId

When adding a new feature, add it to the correct module’s controller + route and mount under that module’s base path only.
