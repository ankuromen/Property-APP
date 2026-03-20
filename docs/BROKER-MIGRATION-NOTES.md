# Broker Migration Notes

Current DB model remains `Vendor` for backward compatibility.

## Current state
- Both `/api/vendor/*` and `/api/broker/*` routes are active.
- Broker routes now resolve through `controllers/broker/*` aliases.
- Auth middleware exposes `req.vendor` (legacy) and `req.broker` (new) on broker-protected routes.
- Property ownership still uses legacy `vendorId` until Section 3 model extension is implemented.

## Planned migration
1. Introduce `Broker` model alias while keeping Mongo collection stable.
2. Gradually move shared controller internals from `vendor` naming to neutral/broker naming.
3. Add new ownership fields (`postedByType`, `postedById`) in Section 3.
4. Deprecate `/api/vendor/*` after frontend migration is complete.
