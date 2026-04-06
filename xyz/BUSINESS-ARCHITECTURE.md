# Business architecture (ideas first)

This document describes **what the platform is for** and **how it feels from three points of view**. It stays free of implementation detail. For systems and technical boundaries, see [`ARCHITECTURE.md`](./ARCHITECTURE.md).

**Decisions you have already made** live in this file. **What is still undecided** is tracked separately in [`BUSINESS-DECISIONS-PENDING.md`](./BUSINESS-DECISIONS-PENDING.md)—when you choose, update this doc and adjust the pending list.

**Positioning:** You are building a **marketplace platform**—you connect buyers with brokers and owners, list supply, route leads, and may charge **for use of the platform** (plans, visibility, fees). You are **not** a consultancy, advisory firm, or property consultant; any viewing or meeting is **between the parties**, not a service sold by you as “consultation.”

---

## POV 1 — Normal user (buyer / renter / browser)

**Who this is:** Someone looking for a property—not posting listings, not running the platform.

**What they can do**

- Discover listings through search, filters, and location-oriented browsing.
- **Browse brokers** — explore a directory of brokers on the platform (profiles, areas, how they present themselves).
- **Contact brokers** — reach out to a broker from their profile or listing context (name, phone, and any flow the product defines), not only when attached to a single property.
- Open a listing and see enough detail to decide interest (basics, location story, price band, who is offering it—broker vs owner where relevant).
- **Contact** the right party on a listing when they want to move forward: leave name and phone (a **lead**). **Phone is verified with an OTP** sent to that number before the lead is accepted as complete—so listers mainly see **reachable** interest, not random or mistyped numbers (see **Lead submission — OTP** below).
- Where the product supports it, optional flows (e.g. scheduling a viewing or expressing stronger intent) can exist as **tools on the platform**—still an introduction between buyer and seller/broker, not the platform acting as an advisor.

**What they should experience**

- **Clarity** — Who they are contacting (broker vs direct owner) matches what they read on the listing **or** on the broker’s profile in the directory. Where the product shows it, they can see each lister’s **plan tier** (**Starter** / **Bronze** / **Silver** / **Gold**) via a **badge** tied to that account’s subscription (see **Plan badges** in POV 2).
- **Trust** — **Every property** is **verified by admin** before it can appear on the public website; nothing is browseable until **you** approve it (see **Listing visibility** in POV 2). **One listing per property** in search (no duplicate owner/broker ads—see **single listing, joint visibility** in POV 2).
- **Low friction** — Browsing stays simple; **one** extra step on interest—**OTP on the phone they entered**—is there to protect listers and keep leads **real**, not to add unnecessary friction elsewhere.

**Lead submission — OTP (decided)**

- When someone submits a **lead** (contact form with **phone**), the platform sends an **OTP** to that mobile number. The lead is **finalised / shown to the lister** as a proper lead **only after** they enter the correct OTP (provider, expiry, retries—implementation detail).
- **Why** — Confirms the buyer **controls that number**, cuts fake and mistyped contacts, and keeps the lead pipeline **higher quality** for brokers and owners.

**What they do not do**

- Run moderation, see other users’ private operational data, or manage the platform.

**Note (lead volume vs POV 2)** — Nothing here limits how often a buyer can browse or send interest. For **brokers**, two kinds of limit apply on the supply side: **per-listing** caps on property ads, and a **separate profile quota** for contacts that come only from the **broker directory / profile** (no property listing)—see **Profile / directory quota** in POV 2. **Owners** use **per-listing** limits; they do not use the broker-directory pool unless the product later adds an equivalent.

---

## POV 2 — User who wants to supply listings (broker **or** property owner)

**Who this is:** Someone who wants to **put properties on the platform** and **receive interest**—either as a **broker** (business, many listings, clients) or as a **property owner** (their own asset, fewer listings).

**Shared idea**

- One **public website** story: they can **create an account** and use a single **“my account”** area to complete a profile, manage listings, and see **leads**—without a separate “broker-only product” split at the business level.
- **Listing source** is a business distinction: this listing is **broker-led** vs **owner-led**, so **leads route** to the right party.

**Listing visibility (decided): admin gate for everything on the site**

- **All** property listings (**broker or owner with a registered account**) are **reviewed and approved by admin** before they are **shown** on the public website (browse, search, detail, SEO pages). **Guests cannot post a property**—listing creation requires **sign-up / log-in** first.
- Until approved, listings stay **off** public discovery—users may still **save drafts** or see status in **account** per product design, but **buyers never see** unapproved properties as live inventory.

**Admin outcomes on a listing (decided)**

- **Approve** — Listing becomes **live** on the public site under your rules.
- **Reject** — Listing stays **not public**; the lister gets a **clear reason** (categories or free text—product choice) so they understand what failed.
- **More verification needed** — Not a final reject: you **pause** going live and ask the lister to **supply proof or corrections** (documents, photos, address checks, etc.). They resubmit or complete the ask; you **review again** until you approve or reject.

**Listing policy (chosen): single listing, joint visibility**

- **One listing per property** in search and discovery — the same flat or plot does **not** appear twice as separate ads (owner vs broker).
- **Joint visibility** — When both an **owner** and a **broker** are part of the deal, they still use the **same** listing page; **who appears publicly** and **who sees leads** follow the **handoff** rules below (owner consent and verification).
- **Why** — Buyers get **one** clear story; search stays clean; no “which listing is real?” confusion.
- **Plan lead caps** still apply **per that listing** (see below when owner and broker both appear).

**Handoff policy (decided): two directions (same single listing)**

**A — Owner posted first, broker joins later**

- The **owner must approve** the broker being tied to **that** property. If the owner **does not approve**, the broker is **not** associated and **does not see leads** there.
- **Broker lead visibility** — The broker **only** sees leads on that listing **after** the owner approves. The **owner** may also choose whether the **broker’s name appears** on the public listing and whether **leads are shared** with the broker (**owner-controlled** toggles if you split them in the product).
- **Per-listing lead cap** when both may access leads — use **whoever has the higher plan** (order: **Starter** → **Bronze** → **Silver** → **Gold**; **Gold** = unlimited wins). **If both have the same plan**, **one** shared cap for that listing (not doubled). *Example:* owner Starter (5), broker Silver (50) → cap **50** for that listing for parties who are allowed to see leads.

**B — Broker posted first, owner joins / claims the property**

- The **owner must be verified by admin** as the **legitimate owner** of that property before the owner is shown on the listing (what documents or checks you require—implementation detail).
- After verification, the **owner appears** on the **same** listing (still one ad in search).
- The **owner** then decides: whether the **broker stays visible** on the public property page, and whether **leads are visible to the broker** (owner-controlled toggles or equivalent flows).
- **Symmetry:** Lead access for the broker follows **owner approval/consent** — **only when the owner allows it** does the broker **see leads** on that listing; the owner always retains visibility appropriate to their role once verified.

**Plans on the listing** — When **both** may see leads, the **higher plan** sets the shared per-listing cap (as in **A**). If the **owner turns off** lead visibility for the broker, only the **owner’s** plan applies to the owner’s access on that listing.

**Subscription plans — Starter (free) plus Bronze, Silver, Gold (for now; same idea for broker and owner)**

**Plan mechanics (decided):** A lister has **one subscription (plan) on their account** — **Starter**, **Bronze**, **Silver**, or **Gold**. That plan sets **how many leads they may fully access per listing** on **any** property they publish: a **higher plan raises that limit everywhere** (each listing still counts its own leads up to that cap; it is **not** one shared pool of leads across all listings). The **cap shape** is **per listing**, driven by **account plan**.

**Profile / directory quota — brokers only (decided)**

- When a buyer contacts a **broker** from the **directory or broker profile** and **no property listing** is in play, those contacts are **not** counted against **per-listing** caps. They use a **separate pool**: **profile quota** that **comes with the plan** (more generous at higher tiers—**amounts per tier are admin-configurable**, like per-listing caps).
- **Brokers** may **recharge** (manually **top up** profile quota) **beyond** what their plan includes, **as needed**—pack sizes, price, and payment flow are **product/ops** choices (e.g. **Razorpay** add-on purchases); the business rule is **optional paid extra capacity** on top of plan-included profile quota.
- **Property owners** do not use this directory-only pool unless you later add a parallel concept for owners.

**Lead counting & SPAM (decided)**

- **Plan limits** (**per-listing** caps and **profile quota**) apply only to leads that **count** toward those limits—not to every row in the inbox.
- **SPAM** — Contacts are flagged as **SPAM** when they match **regex** rules (patterns you define and maintain—e.g. on name, phone, message). They **still appear** in the lister’s lead view so they are not blind to abuse or mistakes. They are **shown** with a clear **SPAM** mark (label or status). They are **not counted** against **per-listing** limits or **profile quota**.

**Billing period (decided):** For **paid** tiers (**Bronze / Silver / Gold**), renewal runs on a **billing cycle** configured **per plan by admin**. Allowed cycles: **monthly**, **quarterly**, **half-yearly**, or **yearly**. Which tier uses which cycle (and the price for that cycle) is **admin-defined**—not hard-coded. **Starter** stays **free** and does not use a paid billing cycle.

**Payments & renewal (decided):**

- **Provider:** **Razorpay** only for collecting subscription / platform fees.
- **When users pay:** They pay **up front** for the current period — e.g. **first month** (or first quarter / half-year / year) **according to the billing cycle** of the plan they choose; same idea on each **renewal**.
- **Grace on renewal:** When a paid period **ends**, the user gets **5 days** to complete payment for the **next** period. During grace, product behaviour (full access vs restricted) is an **implementation detail**, but the **business rule** is **5 calendar days** to pay.
- **If still unpaid after grace:** The account is **moved to Starter** (free tier — **5 leads per listing** cap and no paid subscription), until they upgrade again.

There is a **free Starter** tier and **three paid** tiers. Each tier sets **how many leads per listing** the account can **fully access** (see and act on) on **each** of its listings, and a **price** for the platform (except **Starter**, which is **₹0**). **Gold** gives **unlimited** lead access **per listing**.

| Plan        | Lead access per listing (default) | Price (default, INR) |
|-------------|-------------------------------------|----------------------|
| **Starter** | **5** leads (free tier)           | **Free (₹0)**        |
| **Bronze**  | **10** leads                      | **₹199**             |
| **Silver**  | **50** leads                      | **₹500**             |
| **Gold**    | **All leads, no cap**             | **₹1,000**           |

- New listers start on **Starter** at the **account** level and can access **up to five leads per listing** at no charge; **upgrading the account** to **Bronze / Silver / Gold** increases the **per-listing** cap on **all** their listings (e.g. Bronze → 10 leads on each listing).
- **Admin (you)** can **change** each tier’s **per-listing lead count** (including Starter’s **5**), **price**, and **billing period** (monthly / quarterly / half-yearly / yearly) per plan; table defaults are **starting points**, not fixed forever. You also set **profile / directory quota** defaults **per tier** and any **recharge** packs for extra profile capacity.

**Plan badges (decided)**

- **Brokers** and **property owners** each get a **badge** that reflects their **current subscription plan** — **Starter**, **Bronze**, **Silver**, or **Gold**. When they **change plan** (upgrade, downgrade, or return to **Starter** after unpaid grace), the **badge updates** to match.
- **Same rule for both** — Plan is **account-level**, so the badge is about **how they pay for the platform**, not a separate “owner vs broker” badge type unless you choose different **wording** per role in the UI.
- **Look and feel** (label text, colour, where it appears—listing card, profile, directory) is a **product/UI** choice; you can align defaults with **admin** plan configuration.

**As a broker (business lister)**

- Register and build a **profile** that supports trust (name, firm, how to reach them—details are a product choice)—visible in the **broker directory** so normal users can find and contact them even before picking a specific listing. Their **plan badge** (**Starter**–**Gold**) shows buyers which tier they are on.
- **Create and edit** many listings; keep them accurate as deals move.
- Receive **leads** from buyers on **listings** (counted **per listing** under the plan) **and**, separately, leads from **directory / profile-only** contact—those draw from **profile quota** included in the plan; **top up** with **manual recharge** when they need more.
- Use **Starter** for **free** (**5 leads per listing**), then pay **for the platform** via **Bronze / Silver / Gold** (and any future **visibility** or other platform fees you add). Higher tiers unlock **more lead access per listing** up to **unlimited** on Gold, and **more included profile quota** for directory-only contacts. (Fees are for **software / distribution**, not for you acting as a consultant.)

**As a property owner**

- **Sign up** (or log in) and manage listings and leads in **account**—there is **no guest listing flow**; **admin must still approve** before the property appears on the website (same rule as all listings).
- The **same plan ladder** (**Starter** through **Gold**) applies once they are the accountable lister receiving leads (broker and owner are treated **equally** on plan rules), including the same **plan badge** visible to buyers where the product shows it.
- Own the story of **their** property; leads meant for them should not silently go elsewhere.

**What they should experience**

- **Fairness** — **Starter** (free) and **Bronze / Silver / Gold** rules are the same for brokers and owners on **listings** (**per-listing** lead caps, price, and **plan badge**). **Brokers** additionally have **profile quota** for directory-only leads and optional **recharge**—clear and separate from per-listing math.
- **Control** — Their listings and profile reflect what they intend; updates are possible without a separate app. If admin **rejects** a listing, they see **why**; if admin **asks for more verification**, they know **what to provide** before the listing can go live.
- **Alignment** — Owner vs broker roles are clear on the **same** listing when both apply (**joint visibility**), so buyers (POV 1) are not split across duplicate ads.

**Identity verification — owner & broker (decided)**

- **Plan badges** (**Starter**–**Gold**) come from **subscription state**, not from a separate manual approval step—they show which **plan** the broker or owner has chosen (see **Plan badges** above).
- **Owner verification** (e.g. proving **legitimate ownership** when an owner joins after a broker, or other ownership checks you define) is done **by admin**—review and approval sit with the platform operator, not automated self-certification alone.
- **Broker / owner checks beyond the plan badge** (e.g. KYC, license, extra “trusted” flags) are **optional** processes **done by admin** when you require them; they are **not** the same thing as the **plan** badge.

---

## POV 3 — Admin (platform operator — you)

**Who this is:** You and anyone you delegate—**internal only**, not a public role.

**What you are responsible for**

- **Policy** — What may appear on the site, what counts as spam or duplicate, and how **rejections** and **verification requests** are worded so listers can act on them.
- **Moderation** — **Every** listing is **verified here** before it goes public. You may **approve**, **reject with a stated reason**, or **ask for more verification** (evidence or fixes) before deciding—**account-holding** brokers and owners all follow the same gate; nothing goes live until **you** approve.
- **Owner & broker verification** — **You (admin)** perform **identity / legitimacy verification** where rules require it beyond **plan badges** (e.g. **owner** claims after broker-listed-first—see handoff B in POV 2; optional **KYC** / license for brokers). **Plan tier badges** follow **subscription** automatically; **what** you ask for in manual checks stays configurable; **who** signs off is **always admin**, not self-serve automation as the final gate.
- **Operations** — See the health of supply: brokers, owners, listings, leads, and **who is on Starter / Bronze / Silver / Gold**.
- **Plan configuration** — Set each tier’s **per-listing lead limit** (defaults: **5** Starter, **10** Bronze, **50** Silver, **unlimited** Gold), **profile / directory quota per broker** per tier, **recharge** options for extra profile capacity, **price**, and **billing cycle** (**monthly**, **quarterly**, **half-yearly**, or **yearly**) per paid plan; **Starter** stays **free** (no paid cycle) with an admin-adjustable per-listing cap. **Badge** presentation (names/labels per tier for brokers and owners) should stay **consistent** with these tiers.
- **Payments** — **Razorpay** for collections; **5-day grace** after each paid period ends before downgrade to **Starter** if renewal is unpaid (see **Payments & renewal** above).
- **Trust & safety** — Reduce fraud and abuse; escalate when real disputes appear.

**What you should have**

- **Separation** — Admin work is **not** mixed into the normal user site in a way that confuses POV 1 or POV 2; it is its own internal experience.
- **Authority** — Only **admin-approved** listings appear in public discovery; you control what meets the quality bar before anything is visible to POV 1.

**What you do not optimize for**

- Acting as a day-to-day buyer in the admin tool—that remains POV 1 on the public product.

---

## How the three POVs connect (one sentence each)

- **POV 1** brings **demand** and **trust** in what they see.
- **POV 2** brings **supply** and **relationships** (broker or owner) under clear rules.
- **POV 3 (you)** holds **quality, policy, and operations**—including **admin-run verification** of owners and brokers where the rules require it—so the marketplace stays defensible as it scales.

---

## Appendix — Handoff summary (decided; same as POV 2)

**Owner listed first → broker joins**

- Owner must **approve**; **only then** can the broker **see leads** on that listing.
- Owner may control **broker on the public page** and **whether leads are shared** with the broker.
- When both may see leads: **higher plan** sets the shared per-listing cap; same tier → one shared cap.

**Broker listed first → owner joins**

- **Owner verified by admin** as legitimate owner before owner is shown.
- Owner then chooses **broker visibility** on the page and **whether the broker sees leads** (same idea: broker sees leads **only if** owner allows).

Edge cases (e.g. broker steps off, owner revokes consent) are listed until decided in [`BUSINESS-DECISIONS-PENDING.md`](./BUSINESS-DECISIONS-PENDING.md).

All of this stays on **one canonical listing per property**.
