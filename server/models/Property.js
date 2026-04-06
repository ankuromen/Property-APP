const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    // —— Identity & listing ——
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, sparse: true },
    propertyType: { type: String, required: true, trim: true },
    propertySubType: { type: String, trim: true },
    transactionType: { type: String, trim: true }, // Sale, Rent, Lease, PG
    status: { type: String, trim: true, enum: ['Pending', 'Active', 'Rejected'], default: 'Active' },
    description: { type: String, trim: true, default: '' },
    reraId: { type: String, trim: true },
    reraStatus: { type: String, trim: true },
    readyToMove: { type: Boolean, default: false },
    visibility: { type: String, trim: true, default: 'Public' },

    // —— Location & address ——
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    locality: { type: String, trim: true },
    location: { type: String, trim: true }, // kept for backward compatibility; can duplicate locality/city
    sublocality: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' },
    landmark: { type: String, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    directions: { type: String, trim: true },
    crossStreet: { type: String, trim: true },
    subdivisionName: { type: String, trim: true },
    cityRegion: { type: String, trim: true },

    // —— Area & dimensions ——
    carpetAreaSqft: { type: Number, min: 0 },
    carpetAreaSqm: { type: Number, min: 0 },
    builtUpAreaSqft: { type: Number, min: 0 },
    builtUpAreaSqm: { type: Number, min: 0 },
    superBuiltUpAreaSqft: { type: Number, min: 0 },
    areaUnit: { type: String, trim: true },
    areaSource: { type: String, trim: true },
    lotSizeSqft: { type: Number, min: 0 },
    lotSizeAcres: { type: Number, min: 0 },
    lotDimensions: { type: String, trim: true },
    floorNumber: { type: Number },
    totalFloors: { type: Number },

    // —— Price & financial ——
    price: { type: Number, required: true, min: 0 },
    pricePerSqft: { type: Number, min: 0 },
    priceDisplay: { type: String, trim: true },
    currency: { type: String, trim: true, default: 'INR' },
    priceUnit: { type: String, trim: true },
    deposit: { type: Number, min: 0 },
    maintenanceCharges: { type: Number, min: 0 },
    maintenanceIncluded: { type: Boolean },
    electricityWaterCharges: { type: String, trim: true },
    leaseTerm: { type: String, trim: true },
    rentAgreementDuration: { type: String, trim: true },
    monthsOfNotice: { type: Number, min: 0 },
    leaseAmount: { type: Number, min: 0 },
    leaseAmountFrequency: { type: String, trim: true },
    capRate: { type: Number },
    grossIncome: { type: Number },
    netOperatingIncome: { type: Number },

    // —— Configuration (residential) ——
    bhk: { type: Number, min: 0 },
    bedroomsTotal: { type: Number, min: 0 },
    bathroomsFull: { type: Number, min: 0 },
    bathroomsHalf: { type: Number, min: 0 },
    bathroomsTotal: { type: Number, min: 0 },
    balconies: { type: Number, min: 0 },
    bedroomsPossible: { type: Number, min: 0 },
    levels: { type: Number },

    // —— Furnishing & appliances ——
    furnishing: { type: String, trim: true },
    furnishingsDetail: { type: mongoose.Schema.Types.Mixed },
    appliances: [{ type: String }],
    laundryFeatures: { type: String, trim: true },
    cooling: { type: String, trim: true },

    // —— Eligibility (residential) ——
    availableFor: { type: String, trim: true },
    petsAllowed: { type: String, trim: true },
    preferredTenant: { type: String, trim: true },

    // —— Structure & building ——
    yearBuilt: { type: Number },
    propertyAge: { type: String, trim: true },
    structureType: { type: String, trim: true },
    architecturalStyle: { type: String, trim: true },
    constructionMaterials: [{ type: String }],
    flooring: { type: String, trim: true },
    roof: { type: String, trim: true },
    directionFaces: { type: String, trim: true },
    commonWalls: { type: String, trim: true },
    basement: { type: String, trim: true },
    basementYn: { type: Boolean },
    newConstructionYn: { type: Boolean },

    // —— Amenities & features ——
    parkingCount: { type: Number, min: 0 },
    parkingType: { type: String, trim: true },
    powerBackup: { type: String, trim: true },
    security: [{ type: String }],
    highlights: [{ type: String }],
    communityFeatures: [{ type: String }],
    lotFeatures: [{ type: String }],
    exteriorFeatures: [{ type: String }],
    interiorFeatures: [{ type: String }],
    heating: { type: String, trim: true },
    accessibilityFeatures: [{ type: String }],
    view: { type: String, trim: true },
    viewYn: { type: Boolean },
    waterfrontYn: { type: Boolean },
    poolYn: { type: Boolean },
    poolFeatures: { type: String, trim: true },
    gymYn: { type: Boolean },
    clubHouseYn: { type: Boolean },

    // —— Legal & compliance ——
    reraRegistered: { type: Boolean },
    reraNumber: { type: String, trim: true },
    reraWebsite: { type: String, trim: true },
    ownershipType: { type: String, trim: true },
    encumbrances: { type: String, trim: true },

    // —— Media ——
    images: [{ type: String }],
    videoUrl: { type: String, trim: true },
    floorPlanUrl: { type: String, trim: true },
    documentUrls: [{ type: String }],

    // —— Listing source & ownership ——
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }, // legacy owner pointer (required for broker-posted listings)
    postedByType: { type: String, enum: ['broker', 'owner'], default: 'broker' },
    postedById: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    ownerContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
    },
    listedBy: { type: String, trim: true },

    // —— Moderation ——
    reviewNotes: { type: String, trim: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    reviewedAt: { type: Date },

    // —— Discovery ——
    placesNearby: [{ type: mongoose.Schema.Types.Mixed }],
    schools: [{ type: mongoose.Schema.Types.Mixed }],
    similarPropertyIds: [{ type: mongoose.Schema.Types.ObjectId }],
    relatedSearches: [{ type: mongoose.Schema.Types.Mixed }],
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },

    // —— Commercial-specific ——
    businessName: { type: String, trim: true },
    businessType: { type: String, trim: true },
    leasableAreaSqft: { type: Number, min: 0 },
    availableLeaseType: [{ type: String }],
    leaseExpiration: { type: Date },
    numberOfUnitsTotal: { type: Number, min: 0 },
    numberOfUnitsVacant: { type: Number, min: 0 },
    anchorsCoTenants: { type: String, trim: true },
    hoursDaysOfOperation: { type: String, trim: true },
    seatingCapacity: { type: Number, min: 0 },

    // —— Land / agricultural ——
    landUse: { type: String, trim: true },
    developmentStatus: { type: String, trim: true },
    topography: { type: String, trim: true },
    roadFrontageType: { type: String, trim: true },
    cultivatedArea: { type: Number, min: 0 },
    vegetation: { type: String, trim: true },
    waterSource: { type: String, trim: true },

    // —— HOA / society ——
    associationYn: { type: Boolean },
    associationName: { type: String, trim: true },
    associationFee: { type: Number, min: 0 },
    associationFeeFrequency: { type: String, trim: true },
    associationFeeIncludes: [{ type: String }],
    associationAmenities: [{ type: String }],

    // —— Tax & other ——
    taxAmount: { type: Number, min: 0 },
    taxYear: { type: Number },
    homeWarrantyYn: { type: Boolean },
    disclaimer: { type: String, trim: true },
    copyrightNotice: { type: String, trim: true },

    // Legacy: keep 'type' as alias for propertyType if needed
    type: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
