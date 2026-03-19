# Analysis: 99acres property listing page

**URL (parsed):**  
`https://www.99acres.com/1-bhk-bedroom-independent-house-villa-for-rent-in-nehru-ground-faridabad-450-sq-ft-spid-Q89542636`

**Note:** The live page could not be fetched (timeout). This analysis is based on the URL structure and common patterns used by 99acres and similar portals (Magicbricks, Housing, etc.).

---

## 1. What the URL tells us

| Part in URL | Meaning | Example value |
|-------------|---------|----------------|
| `1-bhk-bedroom` | Configuration | 1 BHK |
| `independent-house-villa` | Property type | Independent house / Villa |
| `for-rent` | Transaction type | Rent (vs buy/sell) |
| `nehru-ground-faridabad` | Location | Locality + city |
| `450-sq-ft` | Carpet/super area | 450 sq ft |
| `spid-Q89542636` | Listing ID | Unique ID (Q89542636) |

**Takeaway for our platform:**  
- Use a clear, readable slug (type, location, area) + a stable **listing ID** in the URL.  
- Support **transaction type** (rent/sale) and **property type** (apartment, villa, etc.) in the schema and filters.

---

## 2. Typical structure of a property detail page (99acres-style)

Sites like 99acres usually structure a listing page into these sections:

### Above the fold
- **Image gallery** — Hero image + thumbnails; often with “Contact owner” / “Schedule visit” CTA.
- **Title** — Short headline (e.g. “1 BHK House for Rent in Nehru Ground”).
- **Price** — Prominent (e.g. “₹15,000/month” or “₹2.5 Cr”); sometimes “Price on request”.
- **Quick facts** — BHK, bath, area (sq ft), property type, listed date.

### Main content
- **Description** — Long text block (details, highlights, neighbourhood).
- **Key details / Specifications** — Table or list: carpet area, furnished status, floor, facing, etc.
- **Amenities / Features** — Icons + labels (parking, power backup, security, etc.).
- **Location** — Address + embedded map (Google Maps); sometimes “Nearby landmarks”.

### Sidebar / sticky
- **Contact** — “Contact owner” / “Contact agent”; sometimes phone, WhatsApp, enquiry form.
- **Owner/agent card** — Name, photo, “Posted on”, “Viewed X times”, “Enquire now”.

### Below / secondary
- **Similar listings** — “More properties like this” (same locality or type).
- **Disclaimer / report** — “Report this listing”, legal text.

---

## 3. Data points to support (for our Property platform)

From this pattern, our **Property** model (or detail API) could expose:

| Field / concept | Purpose |
|-----------------|--------|
| Title | Headline on listing and detail page. |
| Description | Long text for “About this property”. |
| Price | Rent or sale price; display format (e.g. “₹X/month” or “₹X Cr”). |
| Transaction type | Rent / Sale (filters + URL). |
| Property type | Apartment, villa, plot, etc. |
| BHK / bedrooms | For residential. |
| Bathrooms | Count. |
| Carpet / super area | In sq ft (for search and slug). |
| Location / locality | Text + optional city, state, pincode. |
| Address | Full address for map and contact. |
| Images[] | Multiple images; first = hero. |
| Furnished | Unfurnished / Semi / Fully. |
| Floor / total floors | Optional. |
| Listed date / updated | For “Posted on” / “Updated”. |
| Vendor/owner ref | For “Contact vendor” and lead creation. |

We already have: **title, description, location, price, type, images, vendorId**.  
We can extend with: **transactionType** (rent/sale), **bhk**, **bathrooms**, **areaSqft**, **furnished**, **address** (for map), etc., when we build the **user-facing property detail page** and filters.

---

## 4. UX patterns to consider

- **Single clear CTA** — One primary “Contact vendor” (or “Enquire”) above the fold and in sidebar.
- **No login to view** — Listing and contact form visible without signup (we already plan this).
- **Gallery** — At least one hero image; multiple images with thumbnails improve trust.
- **Trust cues** — “Posted on”, “Last updated”, optional “Verified listing” later.
- **Mobile** — Sticky “Contact” / “Call” bar on scroll; same on our user website.

---

## 5. Summary

- **URL:** Use a **slug** (type, location, area) + **listing ID** for stable, shareable links.  
- **Layout:** **Gallery + price + quick facts** at top; **description + specs + amenities + map** in main; **contact + vendor card** in sidebar; **similar listings** below.  
- **Data:** Extend our property schema with **transaction type**, **BHK**, **bathrooms**, **area (sq ft)**, **furnished**, **address** when we build the public listing/detail pages and filters.

We can align our **user website** (browse + property detail + “Contact vendor”) and **Vendor Panel** (add/edit property) with this structure as we implement Step 4 and Phase 2.

---

## 6. Extracted details from 99acres property details page (screenshots)

Below is a full extraction of **what 99acres shows** on a property details page, based on the screenshots you shared.

### 6.1 Global / Header (all pages)

| Element | What they show |
|--------|-----------------|
| **Logo** | 99acres logo (top left) |
| **Search bar** | Category dropdown (e.g. “Rent”), locality/project/society/landmark input, location + mic + search icons |
| **Nav actions** | “Post property FREE”, profile icon, hamburger menu |
| **Breadcrumbs** | Home → Property for rent in Faridabad → House for rent in Faridabad → … → 1 BHK House for rent in Nehru Ground |
| **Status line** | “Updated 4d ago by owner”, “Ready to move” (right side) |

### 6.2 Hero / Above the fold (sticky header style)

| Field | Example / Notes |
|-------|-----------------|
| **Price** | Large bold: **₹16,000** (or “Per Month” below) |
| **Configuration** | **1 Bedroom 1 Bath** (next to price, separated by vertical line) |
| **Shortlist** | Heart icon in circular border (save / wishlist) |
| **Primary CTA** | **“Contact Owner FREE”** — blue button with small “FREE” badge |
| **RERA status** | “RERA STATUS” (info icon) → “NOT AVAILABLE” (green) + link to state RERA site (e.g. haryanarera.gov.in) |

### 6.3 Tab navigation

- **Overview** (default active)
- **Owner Details**
- **Featured Dealers**
- **Recommendations**

Active tab: blue/teal underline.

### 6.4 Overview tab — Left: Media

| Element | What they show |
|---------|-----------------|
| **Gallery label** | “Property (6)” — count of photos |
| **Main image** | Large hero image (e.g. interior shot) |
| (Implied) | Thumbnails / carousel for multiple images |

### 6.5 Overview tab — Right: Key specs (grid with icons)

| Label | Example value | Icon type |
|-------|----------------|-----------|
| **Configuration** | 1 Bedroom, 1 Bathroom, 1 Balcony | Room/layout |
| **Rent** | ₹ 16,000 | Price tag |
| **Built-up area** | 450 sq.ft. (expandable) | Area |
| **Carpet area** | 400 sq.ft. (37.16 sq.m.) | Area |
| **Address** | Nehru Ground, Faridabad | Location pin |
| **Furnishing** | Furnished + “View Furnishings” link | Bed |
| **Available for** | Bachelors (Men/Women) | People |

### 6.6 Overview — “Places nearby”

| Element | What they show |
|---------|-----------------|
| **Header** | “Places nearby” + location pin + “Nehru Ground, Faridabad” |
| **Action** | “View All (50)” link |
| **Content** | Horizontal scroll cards: e.g. Bata chowk metro, Neelam chowk ajronda metro, Friends Ear Nose Throat Centre, Asha Nursing Home (metro / medical icons) |
| **UI** | Blue circular arrow for horizontal scroll |

### 6.7 Overview — “Why consider this property?” (highlights)

| Element | What they show |
|---------|-----------------|
| **Heading** | “Why should you consider this property?” |
| **Tags** | Rounded teal chips, e.g. Close to Metro Station, Close to School, Centrally Air Conditioned, Newly Constructed, Parking Available, Furnished, etc. |

### 6.8 Overview — Property details (4-column grid)

Each row: **Label** (gray) + **Value** (bold black).

| Label | Example value |
|-------|----------------|
| Total Floors | 3 Floors |
| Months of Notice | 2 Months |
| Flooring | Ceramic |
| Electricity & Water Charges | Charges not included |
| Parking | 1 Open |
| Power Backup | None |
| Rent Agreement Duration | None |
| Property Age | 0 to 1 Year Old |

### 6.9 Overview — “About Property”

| Element | What they show |
|---------|-----------------|
| **Heading** | “About Property” |
| **Address** | Nehru Ground, Faridabad (clear line) |
| **Description** | Paragraph: furnished 1 BHK independent house, 450 sq.ft., 0–1 year old, ready to move, central AC, near Bata Chowk & Neelam Chowk Ajronda metro |
| **Expand** | “More >>” link for full description |

### 6.10 Overview — “Furnished” (amenity grid)

- **Available (dark icons + count):** e.g. 1 Bed, 1 Wardrobe, 1 Fan, 1 Washing Machine, 1 Stove, 7 Lights, 1 AC  
- **Not available (gray + “No”):** e.g. No Chimney, No Curtains, No Dining Table, No Exhaust Fan, No Geyser, No Modular Kitchen, No Microwave, No Fridge, No Sofa, No TV, No Water Purifier  

### 6.11 Owner Details tab

| Block | What they show |
|-------|-----------------|
| **Owner profile** | Silhouette avatar, **Name** (e.g. “Aadyansh Arora”), label “Owner”, **“View Phone Number”** (teal button) |
| **Stats** | “Properties Listed: 1” (number as link), “Localities: Nehru Ground” |
| **Enquiry form** | “Send enquiry to Owner” |
| **Form fields** | “You are” → Individual / Dealer (radio); **Name** (text); **Phone** (country code e.g. IND +91 + number); **Message** (textarea, placeholder “I am interested in this Property.”, 400 chars); **Checkbox** “I agree to Terms & Conditions and Privacy Policy”; **“Send Email & SMS”** (blue button) |

### 6.12 Featured Dealers tab

| Element | What they show |
|---------|-----------------|
| **Section** | “Reach out to Featured Dealers” + “who are popular amongst Residential Tenants” (orange ribbon icon) |
| **Action** | “View all” link |
| **Dealer cards** | Per card: activity (e.g. “87 Buyers this week”), profile image + orange badge, name/agency, “Member Since …”, “RENTAL” tag, **“Contact Dealer”** (outline button), footer “X Matching Properties >” with thumbnail |

### 6.13 Recommendations tab — Similar properties

| Element | What they show |
|---------|-----------------|
| **Heading** | “Similar Properties” |
| **Cards** | Thumbnail, heart icon, overlay “Owner name (Owner) + date”, price + BHK, locality/project, **“Enquire Now”** (teal link) |
| **Footer links** | “Related to your search”: Nehru Ground & nearby, Property options in Nehru Ground, House near Nehru Ground |

### 6.14 Global UI (all screens)

| Element | What they show |
|---------|-----------------|
| **Send Feedback** | Vertical tab on right edge |
| **Back to top** | Arrow button, bottom right |

---

## 7. Consolidated data fields (for our platform)

From the extraction above, these are the **property details** 99acres exposes. We can map them to our schema or add new fields.

| Category | Fields |
|----------|--------|
| **Identity** | Listing ID, title, property type (e.g. Independent House/Villa), transaction (Rent/Sale) |
| **Price** | Rent/sale amount, “Per Month” or total, “Price on request” (optional) |
| **Configuration** | BHK, bedrooms, bathrooms, balconies |
| **Area** | Built-up area (sq.ft), carpet area (sq.ft / sq.m) |
| **Location** | Address, locality, city (e.g. Nehru Ground, Faridabad) |
| **Furnishing** | Furnished / Semi / Unfurnished + detailed list (beds, AC, fridge, etc.) |
| **Eligibility** | Available for (e.g. Bachelors Men/Women, Family) |
| **Building** | Total floors, floor number, property age, flooring type |
| **Policies** | Months of notice, rent agreement duration, electricity/water charges |
| **Amenities** | Parking (count + type), power backup, and “Why consider” tags (metro, school, AC, etc.) |
| **Media** | Multiple images with count (e.g. “Property (6)”) |
| **Vendor** | Owner name, “Owner”/“Agent”, phone (reveal on CTA), properties listed, localities |
| **Trust** | Posted/updated date (“Updated 4d ago”), “Ready to move”, RERA status + link |
| **Discovery** | Places nearby (landmarks), similar properties, related search links |

Use this list when defining the **Property** model and the **user-facing property detail page** so we show the same level of detail as 99acres where relevant.
