# Architecture and Naming Standards

## Product terminology (locked)
- Vendor -> Broker (product-facing naming)
- User Website -> Public Website
- Vendor Panel -> Broker Panel

## Module boundaries (locked)
- `backend`: APIs and business logic
- `website-nextjs`: SEO-first public website (Next.js + Tailwind)
- `broker-panel`: broker dashboard app
- `admin-panel` (optional): moderation/operations

Current transition note:
- Existing implementation also has `vendor-panel` and `user-website` directories.
- Canonical target modules are `broker-panel` and `website-nextjs`.

## API ownership and route strategy
- Broker APIs: `/api/broker/*` (primary)
- Legacy compatibility APIs: `/api/vendor/*` (temporary)
- Public APIs: `/api/website/*`
- Admin APIs: `/api/admin/*`

## Ownership rules
- Only broker panel should call broker/private APIs.
- Public website should call website/public APIs only.
- Admin APIs remain isolated from broker/public modules.
