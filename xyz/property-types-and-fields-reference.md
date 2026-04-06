# Property types and all possible fields — reference

A single reference for **property types** (by category) and **all possible fields** you may need for listings. Use this to extend the Property model and forms. Sources: RESO Data Dictionary, 99acres/Magicbricks patterns, and India-specific usage.

---

## Part 1: Property types (by category)

### 1.1 Residential (India common)

| Type | Subtypes / notes |
|------|-------------------|
| **Apartment / Flat** | 1/2/3/4/5+ BHK, Studio, Penthouse |
| **Independent House / Villa** | Single, duplex, row house |
| **Plot / Land (residential)** | Residential plot, plotted development, gated community plot |
| **Studio** | Single room with attached bath/kitchen |
| **Penthouse** | Top-floor apartment |
| **PG / Co-living** | Paying guest, co-living space |
| **Farm house** | Residential farm house |

### 1.2 Commercial (India common)

| Type | Subtypes / notes |
|------|-------------------|
| **Office space** | Built-up office, coworking, IT park |
| **Shop / Showroom** | Retail, showroom, kiosk |
| **Commercial land** | Plot for commercial use |
| **Warehouse / Godown** | Storage, logistics |
| **Industrial building** | Manufacturing, factory |
| **Industrial shed** | Prefab, shed |
| **Hotel / Resort** | Hospitality |
| **Restaurant / Café** | F&B |

### 1.3 Land (India common)

| Type | Subtypes / notes |
|------|-------------------|
| **Residential land** | Plot, layout, approved residential |
| **Commercial land** | Commercial plot |
| **Industrial land** | Manufacturing, SEZ |
| **Agricultural land** | Farm, orchard, plantation (restrictions apply) |
| **Barren / Non-cultivable** | As per revenue records |

### 1.4 Transaction type (applies to any type)

- **Sale** (buy/sell)
- **Rent** (lease)
- **Lease** (long-term, commercial)
- **PG** (paying guest)

---

## Part 2: All possible fields (grouped)

### 2.1 Identity & listing

| Field | Type | Description | India/99acres |
|-------|------|-------------|----------------|
| listingId / listingKey | string | Unique listing ID | ✓ (e.g. Q89542636) |
| title | string | Short headline | ✓ |
| slug | string | URL-friendly slug (type, location, area) | ✓ |
| propertyType | enum | Apartment, Villa, Plot, Office, etc. | ✓ |
| propertySubType | string | e.g. Independent House/Villa, 1 BHK | ✓ |
| transactionType | enum | Sale, Rent, Lease, PG | ✓ |
| status | enum | Active, Sold, Rented, Inactive, Draft | ✓ |
| description | string | Long description / “About property” | ✓ |
| reraId | string | RERA registration number (if applicable) | ✓ |
| reraStatus | enum | Available, Not Available, etc. | ✓ |
| listedAt / updatedAt | date | Posted / last updated | ✓ |
| readyToMove | boolean | Available immediately | ✓ |
| visibility | enum | Public, Unlisted, Featured | — |

### 2.2 Location & address

| Field | Type | Description | India/99acres |
|-------|------|-------------|----------------|
| addressLine1 / streetNumber, streetName | string | Street address | ✓ |
| addressLine2 / streetAdditionalInfo | string | Building, block, flat no. | ✓ |
| locality / area | string | Nehru Ground, Koramangala, etc. | ✓ |
| sublocality | string | Sector, block, phase | ✓ |
| city | string | Faridabad, Bangalore, etc. | ✓ |
| state / stateOrProvince | string | State | ✓ |
| pincode / postalCode | string | PIN code | ✓ |
| country | string | India (default) | ✓ |
| landmark | string | Near X landmark | ✓ |
| latitude, longitude | number | For map | ✓ |
| directions | string | How to reach | ✓ |
| crossStreet | string | Nearest cross streets | ✓ |
| subdivisionName / projectName | string | Society, project, township | ✓ |
| cityRegion | string | Zone / region within city | — |

### 2.3 Area & dimensions

| Field | Type | Description | India/99acres |
|-------|------|-------------|----------------|
| carpetAreaSqft | number | Carpet area (sq ft) | ✓ |
| carpetAreaSqm | number | Carpet area (sq m) | ✓ |
| builtUpAreaSqft | number | Built-up area (sq ft) | ✓ |
| builtUpAreaSqm | number | Built-up area (sq m) | ✓ |
| superBuiltUpAreaSqft | number | Super built-up (if used) | ✓ |
| areaUnit | enum | sqft, sqm, sqyd | ✓ |
| areaSource | string | Agent, Assessor, Builder, etc. | — |
| lotSizeSqft / plotAreaSqft | number | Plot / land area (sq ft) | ✓ (for land/villa) |
| lotSizeAcres | number | Plot in acres | — |
| lotDimensions | string | e.g. 40x60 | — |
| floorNumber | number | Which floor | ✓ |
| totalFloors | number | Total floors in building | ✓ |

### 2.4 Price & financial

| Field | Type | Description | India/99acres |
|-------|------|-------------|----------------|
| price | number | Listing price | ✓ |
| pricePerSqft | number | Derived or entered | ✓ |
| priceDisplay | string | “₹16,000/month”, “₹2.5 Cr”, “Price on request” | ✓ |
| currency | string | INR | ✓ |
| priceUnit | enum | Per month, total, per sqft | ✓ |
| deposit / securityDeposit | number | For rent | ✓ |
| maintenanceCharges | number | Monthly maintenance | ✓ |
| maintenanceIncluded | boolean | Included in rent or not | ✓ |
| electricityWaterCharges | string | Included / not included / separate | ✓ |
| leaseTerm | string | 11 months, 3 years, etc. | ✓ |
| rentAgreementDuration | string | e.g. 11 months | ✓ |
| monthsOfNotice | number | Notice period (months) | ✓ |
| leaseAmount, leaseAmountFrequency | number, enum | For commercial lease | — |
| capRate, grossIncome, netOperatingIncome | number | For commercial / investment | — |

### 2.5 Configuration (residential)

| Field | Type | Description | India/99acres |
|-------|------|-------------|----------------|
| bhk / bedroomsTotal | number | 1, 2, 3, 4, 5+ BHK | ✓ |
| bathroomsFull | number | Full bathrooms | ✓ |
| bathroomsHalf | number | Half / powder rooms | ✓ |
| bathroomsTotal | number | Total bathrooms | ✓ |
| balconies | number | Balcony count | ✓ |
| bedroomsPossible | number | Optional / convertible rooms | — |
| levels / stories | number | Floors within unit (e.g. duplex) | — |

### 2.6 Furnishing & appliances

| Field | Type | Description | India/99acres |
|-------|------|-------------|----------------|
| furnishing | enum | Unfurnished, Semi-furnished, Fully furnished | ✓ |
| furnishingsDetail | object/array | Bed, wardrobe, AC, fridge, etc. + count or yes/no | ✓ |
| appliances | string[] | List of appliances included | ✓ |
| laundryFeatures | string | In unit, common, none | — |
| acCount / cooling | string | Central AC, split, none | ✓ |

### 2.7 Eligibility & use (residential)

| Field | Type | Description | India/99acres |
|-------|------|-------------|----------------|
| availableFor | enum | Family, Bachelors (Men), Bachelors (Women), Company, All | ✓ |
| petsAllowed | boolean / enum | Yes, No, Negotiable | — |
| preferredTenant | string | Optional description | — |

### 2.8 Structure & building

| Field | Type | Description | India/99acres |
|-------|------|-------------|----------------|
| yearBuilt | number | Construction year | ✓ |
| propertyAge | string | 0–1 year, 1–5 years, 5–10 years, 10+ years | ✓ |
| structureType | string | Single family, multi-family, etc. | — |
| architecturalStyle | string | Modern, traditional, etc. | — |
| constructionMaterials | string[] | — | — |
| flooring | string | Ceramic, marble, wooden, etc. | ✓ |
| roof | string | — | — |
| directionFaces | string | North, South, East, West | ✓ (optional) |
| commonWalls | string | 1 common wall, no common wall | — |
| basement / basementYn | string, boolean | — | — |
| newConstructionYn | boolean | New / never occupied | ✓ |

### 2.9 Amenities & features

| Field | Type | Description | India/99acres |
|-------|------|-------------|----------------|
| parkingCount | number | Number of parking | ✓ |
| parkingType | string | Open, Covered, Both | ✓ |
| powerBackup | string | Full, Partial, None | ✓ |
| security | string[] | Guard, CCTV, etc. | ✓ |
| highlights / whyConsider | string[] | Close to metro, school, furnished, etc. | ✓ |
| communityFeatures | string[] | Pool, gym, clubhouse, garden | ✓ |
| lotFeatures | string[] | Garden, terrace | — |
| exteriorFeatures | string[] | — | — |
| interiorFeatures | string[] | — | — |
| cooling / heating | string | AC, central heating | ✓ |
| accessibilityFeatures | string[] | — | — |
| view / viewYn | string, boolean | Park, lake, city | — |
| waterfrontYn | boolean | — | — |
| poolYn, poolFeatures | boolean, string | — | — |
| gymYn, clubHouseYn | boolean | — | — |

### 2.10 Legal & compliance

| Field | Type | Description | India/99acres |
|-------|------|-------------|----------------|
| reraRegistered | boolean | RERA registered or not | ✓ |
| reraNumber | string | RERA registration number | ✓ |
| reraWebsite | string | State RERA link (e.g. haryanarera.gov.in) | ✓ |
| ownershipType | string | Freehold, Leasehold | ✓ |
| encumbrances | string | Any liens / disputes (optional) | — |

### 2.11 Media

| Field | Type | Description | India/99acres |
|-------|------|-------------|----------------|
| images | string[] | URLs of listing images | ✓ |
| imageCount | number | Total images | ✓ |
| videoUrl | string | Virtual tour / video | — |
| floorPlanUrl | string | Floor plan image | — |
| documentUrls | string[] | Brochure, legal docs | — |

### 2.12 Vendor / owner / agent

| Field | Type | Description | India/99acres |
|-------|------|-------------|----------------|
| vendorId / ownerId | ref | Our Vendor model | ✓ |
| listedBy | enum | Owner, Dealer, Builder | ✓ |
| ownerName / dealerName | string | Display name | ✓ |
| ownerPhone / contactPhone | string | Contact (reveal on CTA) | ✓ |
| propertiesListedCount | number | Other listings by same vendor | ✓ |
| localitiesListed | string[] | Other localities they list in | ✓ |
| memberSince | date | When dealer joined (if dealer) | — |

### 2.13 Discovery & SEO

| Field | Type | Description | India/99acres |
|-------|------|-------------|----------------|
| placesNearby | array | Landmarks (metro, hospital, school) + distance/label | ✓ |
| schools | array | School name, district, distance | — |
| similarPropertyIds | string[] | For “Similar properties” | ✓ |
| relatedSearches | array | “Related to your search” links | ✓ |
| metaTitle, metaDescription | string | SEO | — |

### 2.14 Commercial-specific

| Field | Type | Description |
|-------|------|-------------|
| businessName, businessType | string | If business is being sold |
| leasableAreaSqft | number | Leasable area |
| availableLeaseType | string[] | Net, NNN, Gross, etc. |
| leaseExpiration | date | Lease end |
| numberOfUnitsTotal | number | Multi-unit commercial |
| numberOfUnitsVacant | number | Vacancy |
| anchorsCoTenants | string | Anchor tenants (mall/retail) |
| hoursDaysOfOperation | string | For retail/F&B |
| seatingCapacity | number | For F&B |

### 2.15 Land / agricultural-specific

| Field | Type | Description |
|-------|------|-------------|
| landUse | string | Residential, commercial, agricultural |
| developmentStatus | string | Ready, Under development, Raw |
| topography | string | Flat, rolling, etc. |
| roadFrontageType | string | Highway, internal, etc. |
| cultivatedArea | number | For agricultural |
| vegetation | string | Crop type, orchard |
| waterSource | string | Borewell, canal, etc. |

### 2.16 HOA / society (India: society maintenance)

| Field | Type | Description |
|-------|------|-------------|
| associationYn | boolean | Is there society/HOA |
| associationName | string | Society name |
| associationFee | number | Maintenance amount |
| associationFeeFrequency | enum | Monthly, quarterly, yearly |
| associationFeeIncludes | string[] | Water, lift, security, etc. |
| associationAmenities | string[] | Pool, gym, garden |

### 2.17 Tax & other

| Field | Type | Description |
|-------|------|-------------|
| taxAmount | number | Annual property tax |
| taxYear | number | — |
| homeWarrantyYn | boolean | — |
| disclaimer | string | Legal disclaimer text |
| copyrightNotice | string | — |

---

## Part 3: Property type ↔ field relevance (quick map)

| Category | Most relevant field groups |
|----------|----------------------------|
| **Residential (flat/house)** | Identity, Location, Area, Price, Configuration, Furnishing, Eligibility, Structure, Amenities, Media, Vendor |
| **Residential (plot)** | Identity, Location, Area (plot), Price, Land-specific, Media, Vendor |
| **Commercial (office/shop)** | Identity, Location, Area (leasable), Price/Lease, Commercial-specific, Media, Vendor |
| **Land / agricultural** | Identity, Location, Area (lot), Price, Land/agricultural-specific, Media, Vendor |

**All fields listed in Part 2 are the full set for creating and editing properties.** Use this doc as the single reference for the Property model and add/edit forms.
