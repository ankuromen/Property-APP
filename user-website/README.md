# User Website — Public property browsing

Vite + React app for customers to browse properties and submit "Contact Vendor" (creates a lead). No login required.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_URL if backend is not on localhost:5000
npm run dev
```

Runs at **http://localhost:5174** (port 5174 to avoid clash with vendor panel on 5173).

## Pages

- **/** — Home / landing with CTA to browse
- **/browse** — List properties (sort, pagination); links to detail
- **/property/:id** — Property detail + "Contact Vendor" form (name, phone); thank-you after submit

Backend: `GET /api/website/properties`, `GET /api/website/properties/:id`, `POST /api/website/leads`.
