# Pending business decisions

Items below are **not yet decided**. When you choose, add the outcome to [`BUSINESS-ARCHITECTURE.md`](./BUSINESS-ARCHITECTURE.md), then **remove or move** the item from here.

**Already decided** (do not treat as open) — see [`BUSINESS-ARCHITECTURE.md`](./BUSINESS-ARCHITECTURE.md): subscription **scope**; **billing cycles**; **Razorpay**; **pay up front** per period; **5-day grace** on renewal then **downgrade to Starter** if unpaid; handoff; plans Starter–Gold; single listing + joint visibility; **all listings admin-approved before public**; admin may **reject with reason** or **request more verification** before a listing goes live; **broker directory–only** contacts use **separate profile quota** per plan; brokers may **manually recharge** extra profile quota; **SPAM** leads are **shown** and **marked SPAM** but **not counted** toward caps; **SPAM** detection via **regex**; **lead phone verified by OTP** before the lead is accepted; **guests cannot post properties** (account required); **owner and broker identity verification performed by admin** (not self-serve as final gate); **plan badges** (**Starter**–**Gold**) for **brokers and owners** tied to **subscription plan**; positioning (marketplace, not consultancy).

---

## High impact (billing & scope)

*(No open items here right now.)*

---

## Leads & product mechanics

- **Notifications** — Push/email when owner controls broker visibility; who gets notified per new lead.
- **What counts as one lead** — Deduplication (same buyer, repeat clicks) beyond **OTP-verified** phone.

---

## Verification & trust

- **Owner verification (ops detail)** — Document types, SLA, checklists for **ownership** claims (**admin** performs—see [`BUSINESS-ARCHITECTURE.md`](./BUSINESS-ARCHITECTURE.md); **plan badge** is separate).
- **Extra trust beyond plan badge** — Whether **KYC**, license, or other checks are **required** for directory or listing, in addition to **Starter**–**Gold** badges (**admin** performs any such checks).

---

## Plans & money

- **Refunds** — When fees are refunded (duplicate charge, cooling-off, dispute); **not** for professional advice (platform is marketplace-only — see [`BUSINESS-ARCHITECTURE.md`](./BUSINESS-ARCHITECTURE.md)).
- **Plan changes** — Mid-cycle upgrades/downgrades and **proration** beyond pay-up-front + grace + Starter downgrade.
- **Tax & invoicing** — GST, invoice format for subscription fees (with accountant).

---

## Data, disputes, policy

- **Disputes** — Fake listings, harassment, fee disagreements: support tiers and when you intervene vs users resolving.
- **Data lifecycle** — Retention for leads/chats; **account deletion**; what you must keep for legal/audit.
- **Cross-posting** — Same property on other portals / exclusive broker mandates vs your single-listing rule.

---

## Handoff edge cases

(Core owner ↔ broker flows are decided in [`BUSINESS-ARCHITECTURE.md`](./BUSINESS-ARCHITECTURE.md).)

- **Broker steps off / mandate ends** — Listing visibility, threads, and leads when the broker is removed.
- **Owner withdraws consent** — After broker was approved: revoke broker lead access or on-page visibility; past leads.

---

## Legal & launch (outside product copy)

- **Terms of use**, **privacy**, content/IP for listing media — separate legal review.
