# Environment Standards

This file locks the shared environment conventions across modules.

## Backend (`backend/.env`)
Required:
- `PORT` (default `5000`)
- `MONGODB_URI`
- `JWT_SECRET`

Recommended:
- `FRONTEND_PUBLIC_URL`
- `BROKER_PANEL_URL`

Example file: `backend/.env.example`

## Public website (`website-nextjs/.env`)
Required:
- `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:5000`)
- `NEXT_PUBLIC_SITE_URL` (e.g. `http://localhost:3000`)

Example file: `website-nextjs/.env.example`

## Broker panel (`broker-panel/.env`)
Required:
- `VITE_API_URL` (e.g. `http://localhost:5000`)

Example file: `broker-panel/.env.example`

## Security rules
- Never commit real `.env` files.
- Commit only `.env.example` with placeholder values.
- Rotate `JWT_SECRET` if accidentally exposed.
