'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '../../lib/apiClient';
import { useAuth } from '../../context/AuthContext';

const PROPERTY_TYPES = [
  'Apartment', 'Independent House', 'Villa', 'Plot', 'Studio', 'Penthouse', 'PG', 'Farm house',
  'Office', 'Shop', 'Showroom', 'Warehouse', 'Industrial building', 'Industrial shed', 'Commercial land',
  'Residential land', 'Agricultural land',
];
const TRANSACTION_TYPES = ['Sale', 'Rent', 'Lease', 'PG'];
const FURNISHING = ['Unfurnished', 'Semi-furnished', 'Fully furnished'];
const AVAILABLE_FOR = ['Family', 'Bachelors (Men)', 'Bachelors (Women)', 'Company', 'All'];
const PARKING_TYPE = ['Open', 'Covered', 'Both'];
const POWER_BACKUP = ['None', 'Partial', 'Full'];
const OWNERSHIP = ['Freehold', 'Leasehold'];
const RERA_STATUS = ['Available', 'Not Available'];

function Section({ title, children }) {
  return (
    <fieldset className="border border-slate-200 rounded-xl p-4 sm:p-6 bg-slate-50/50">
      <legend className="text-sm font-semibold text-slate-700 px-2">{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2 mt-2">{children}</div>
    </fieldset>
  );
}

function Input({ label, type = 'text', value, onChange, placeholder, required, options, multiple, className = '' }) {
  const id = label.replace(/\s+/g, '-').toLowerCase();
  const base = 'block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20';
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}{required && ' *'}</span>
      {options ? (
        <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={base}>
          <option value="">Select</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={base} />
      ) : type === 'checkbox' ? (
        <input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="rounded border-slate-300" />
      ) : (
        <input id={id} type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className={base} />
      )}
    </label>
  );
}

function arrFromStr(s) {
  if (Array.isArray(s)) return s;
  if (typeof s !== 'string') return [];
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}
function strFromArr(a) {
  return Array.isArray(a) ? a.join(', ') : '';
}

export default function PropertyFormClient() {
  const params = useParams();
  const id = params?.id;
  const isEdit = Boolean(id);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const isBroker = roles.includes('broker');
  const [postingAs, setPostingAs] = useState(
    isEdit ? 'owner' : (searchParams.get('postingAs') || '').toLowerCase()
  );
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', propertyType: '', propertySubType: '', transactionType: '', status: 'Active', description: '',
    addressLine1: '', addressLine2: '', locality: '', location: '', sublocality: '', city: '', state: '', pincode: '', country: 'India', landmark: '', latitude: '', longitude: '', directions: '', crossStreet: '', subdivisionName: '',
    carpetAreaSqft: '', builtUpAreaSqft: '', superBuiltUpAreaSqft: '', lotSizeSqft: '', lotDimensions: '', floorNumber: '', totalFloors: '',
    price: '', pricePerSqft: '', priceDisplay: '', priceUnit: '', deposit: '', maintenanceCharges: '', maintenanceIncluded: false, electricityWaterCharges: '', leaseTerm: '', rentAgreementDuration: '', monthsOfNotice: '',
    bhk: '', bathroomsTotal: '', balconies: '',
    furnishing: '', appliances: '', cooling: '',
    availableFor: '', petsAllowed: '',
    yearBuilt: '', propertyAge: '', flooring: '', directionFaces: '', newConstructionYn: false,
    parkingCount: '', parkingType: '', powerBackup: '', security: '', highlights: '', communityFeatures: '',
    reraRegistered: false, reraNumber: '', reraStatus: '', reraWebsite: '', ownershipType: '',
    images: '', videoUrl: '', floorPlanUrl: '',
    readyToMove: false,
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (isEdit) return;
    const qPostingAs = (searchParams.get('postingAs') || '').toLowerCase();
    if (qPostingAs) setPostingAs(qPostingAs);
  }, [isEdit, searchParams]);

  useEffect(() => {
    if (!isEdit) return;
    apiClient(`/api/broker/properties/${id}`)
      .then((p) => {
        setForm({
          title: p.title ?? '',
          propertyType: p.propertyType ?? p.type ?? '',
          propertySubType: p.propertySubType ?? '',
          transactionType: p.transactionType ?? '',
          status: p.status ?? 'Active',
          description: p.description ?? '',
          addressLine1: p.addressLine1 ?? '',
          addressLine2: p.addressLine2 ?? '',
          locality: p.locality ?? '',
          location: p.location ?? '',
          sublocality: p.sublocality ?? '',
          city: p.city ?? '',
          state: p.state ?? '',
          pincode: p.pincode ?? '',
          country: p.country ?? 'India',
          landmark: p.landmark ?? '',
          latitude: p.latitude ?? '',
          longitude: p.longitude ?? '',
          directions: p.directions ?? '',
          crossStreet: p.crossStreet ?? '',
          subdivisionName: p.subdivisionName ?? '',
          carpetAreaSqft: p.carpetAreaSqft ?? '',
          builtUpAreaSqft: p.builtUpAreaSqft ?? '',
          superBuiltUpAreaSqft: p.superBuiltUpAreaSqft ?? '',
          lotSizeSqft: p.lotSizeSqft ?? '',
          lotDimensions: p.lotDimensions ?? '',
          floorNumber: p.floorNumber ?? '',
          totalFloors: p.totalFloors ?? '',
          price: p.price ?? '',
          pricePerSqft: p.pricePerSqft ?? '',
          priceDisplay: p.priceDisplay ?? '',
          priceUnit: p.priceUnit ?? '',
          deposit: p.deposit ?? '',
          maintenanceCharges: p.maintenanceCharges ?? '',
          maintenanceIncluded: p.maintenanceIncluded ?? false,
          electricityWaterCharges: p.electricityWaterCharges ?? '',
          leaseTerm: p.leaseTerm ?? '',
          rentAgreementDuration: p.rentAgreementDuration ?? '',
          monthsOfNotice: p.monthsOfNotice ?? '',
          bhk: p.bhk ?? '',
          bathroomsTotal: p.bathroomsTotal ?? '',
          balconies: p.balconies ?? '',
          furnishing: p.furnishing ?? '',
          appliances: strFromArr(p.appliances),
          cooling: p.cooling ?? '',
          availableFor: p.availableFor ?? '',
          petsAllowed: p.petsAllowed ?? '',
          yearBuilt: p.yearBuilt ?? '',
          propertyAge: p.propertyAge ?? '',
          flooring: p.flooring ?? '',
          directionFaces: p.directionFaces ?? '',
          newConstructionYn: p.newConstructionYn ?? false,
          parkingCount: p.parkingCount ?? '',
          parkingType: p.parkingType ?? '',
          powerBackup: p.powerBackup ?? '',
          security: strFromArr(p.security),
          highlights: strFromArr(p.highlights),
          communityFeatures: strFromArr(p.communityFeatures),
          reraRegistered: p.reraRegistered ?? false,
          reraNumber: p.reraNumber ?? '',
          reraStatus: p.reraStatus ?? '',
          reraWebsite: p.reraWebsite ?? '',
          ownershipType: p.ownershipType ?? '',
          images: strFromArr(p.images),
          videoUrl: p.videoUrl ?? '',
          floorPlanUrl: p.floorPlanUrl ?? '',
          readyToMove: p.readyToMove ?? false,
        });
      })
      .catch(() => setError('Property not found'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function buildPayload() {
    const p = { ...form };
    if (p.price !== '') p.price = Number(p.price);
    if (p.carpetAreaSqft !== '') p.carpetAreaSqft = Number(p.carpetAreaSqft);
    if (p.builtUpAreaSqft !== '') p.builtUpAreaSqft = Number(p.builtUpAreaSqft);
    if (p.deposit !== '') p.deposit = Number(p.deposit);
    if (p.maintenanceCharges !== '') p.maintenanceCharges = Number(p.maintenanceCharges);
    if (p.bhk !== '') p.bhk = Number(p.bhk);
    if (p.bathroomsTotal !== '') p.bathroomsTotal = Number(p.bathroomsTotal);
    if (p.balconies !== '') p.balconies = Number(p.balconies);
    if (p.floorNumber !== '') p.floorNumber = Number(p.floorNumber);
    if (p.totalFloors !== '') p.totalFloors = Number(p.totalFloors);
    if (p.parkingCount !== '') p.parkingCount = Number(p.parkingCount);
    if (p.yearBuilt !== '') p.yearBuilt = Number(p.yearBuilt);
    if (p.monthsOfNotice !== '') p.monthsOfNotice = Number(p.monthsOfNotice);
    if (p.latitude !== '') p.latitude = Number(p.latitude);
    if (p.longitude !== '') p.longitude = Number(p.longitude);
    p.type = p.propertyType;
    p.location = [p.locality, p.city].filter(Boolean).join(', ') || p.location;
    p.appliances = arrFromStr(p.appliances);
    p.security = arrFromStr(p.security);
    p.highlights = arrFromStr(p.highlights);
    p.communityFeatures = arrFromStr(p.communityFeatures);
    p.images = arrFromStr(p.images);
    p.postingAs = postingAs === 'broker' ? 'broker' : 'owner';
    return p;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = buildPayload();
    const method = isEdit ? 'PUT' : 'POST';
    const path = isEdit ? `/api/broker/properties/${id}` : '/api/broker/properties';
    apiClient(path, { method, body: JSON.stringify(payload) })
      .then(() => router.push('/account/properties'))
      .catch((err) => setError(err.message || 'Save failed'))
      .finally(() => setSaving(false));
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-600">Loading...</div>;
  if (error && isEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Link href="/account/properties" className="mt-4 inline-block text-amber-600 hover:underline">Back to list</Link>
        </div>
      </div>
    );
  }

  if (!isEdit && !postingAs) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow-sm px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/account/properties" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
              ← My properties
            </Link>
            <h1 className="text-lg font-semibold text-slate-800">Choose posting flow</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto p-6 space-y-6">
          {!isBroker && (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Post as owner</h2>
              <p className="mt-2 text-sm text-slate-600">
                Add property details and submit. Your listing goes to admin for review before it appears publicly.
              </p>
              <button
                type="button"
                onClick={() => setPostingAs('owner')}
                className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Continue as owner
              </button>
            </section>
          )}

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Post as broker</h2>
            {isBroker ? (
              <>
                <p className="mt-2 text-sm text-slate-600">
                  You are an approved broker. Continue to create a broker listing.
                </p>
                <button
                  type="button"
                  onClick={() => setPostingAs('broker')}
                  className="mt-4 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Continue as broker
                </button>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-slate-600">
                  Broker posting requires an approved broker profile. Complete broker onboarding to unlock this option.
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  <li>Public broker profile visibility</li>
                  <li>Higher trust with verified badge after approval</li>
                  <li>Better qualified lead discovery</li>
                </ul>
                <Link
                  href="/account/broker-profile"
                  className="mt-4 inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Complete broker profile
                </Link>
              </>
            )}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm px-4 py-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/account/properties" className="text-slate-600 hover:text-slate-900 text-sm font-medium">← My properties</Link>
          <h1 className="text-lg font-semibold text-slate-800">{isEdit ? 'Edit property' : 'Add property'}</h1>
            {!isEdit && (
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                Posting as {postingAs === 'broker' ? 'broker' : 'owner'}
              </span>
            )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">{error}</div>}

          <Section title="Basic">
            <Input label="Title" value={form.title} onChange={(v) => set('title', v)} required />
            <Input label="Property type" value={form.propertyType} onChange={(v) => set('propertyType', v)} options={PROPERTY_TYPES} required />
            <Input label="Property sub-type" value={form.propertySubType} onChange={(v) => set('propertySubType', v)} placeholder="e.g. 1 BHK, Independent House" className="sm:col-span-2" />
            <Input label="Transaction" value={form.transactionType} onChange={(v) => set('transactionType', v)} options={TRANSACTION_TYPES} />
            <Input label="Status" value={form.status} onChange={(v) => set('status', v)} />
            <Input label="Ready to move" type="checkbox" value={form.readyToMove} onChange={(v) => set('readyToMove', v)} />
            <Input label="Description" type="textarea" value={form.description} onChange={(v) => set('description', v)} placeholder="About the property" className="sm:col-span-2" />
          </Section>

          <Section title="Location & address">
            <Input label="Address line 1" value={form.addressLine1} onChange={(v) => set('addressLine1', v)} />
            <Input label="Address line 2" value={form.addressLine2} onChange={(v) => set('addressLine2', v)} />
            <Input label="Locality" value={form.locality} onChange={(v) => set('locality', v)} />
            <Input label="Sublocality" value={form.sublocality} onChange={(v) => set('sublocality', v)} />
            <Input label="City" value={form.city} onChange={(v) => set('city', v)} />
            <Input label="State" value={form.state} onChange={(v) => set('state', v)} />
            <Input label="Pincode" value={form.pincode} onChange={(v) => set('pincode', v)} />
            <Input label="Landmark" value={form.landmark} onChange={(v) => set('landmark', v)} />
            <Input label="Project / Society" value={form.subdivisionName} onChange={(v) => set('subdivisionName', v)} />
            <Input label="Latitude" type="number" value={form.latitude} onChange={(v) => set('latitude', v)} placeholder="e.g. 28.4089" />
            <Input label="Longitude" type="number" value={form.longitude} onChange={(v) => set('longitude', v)} placeholder="e.g. 77.3178" />
            <Input label="Directions" type="textarea" value={form.directions} onChange={(v) => set('directions', v)} className="sm:col-span-2" />
          </Section>

          <Section title="Area & configuration">
            <Input label="Carpet area (sq ft)" type="number" value={form.carpetAreaSqft} onChange={(v) => set('carpetAreaSqft', v)} />
            <Input label="Built-up area (sq ft)" type="number" value={form.builtUpAreaSqft} onChange={(v) => set('builtUpAreaSqft', v)} />
            <Input label="Super built-up (sq ft)" type="number" value={form.superBuiltUpAreaSqft} onChange={(v) => set('superBuiltUpAreaSqft', v)} />
            <Input label="Plot area (sq ft)" type="number" value={form.lotSizeSqft} onChange={(v) => set('lotSizeSqft', v)} />
            <Input label="Lot dimensions" value={form.lotDimensions} onChange={(v) => set('lotDimensions', v)} placeholder="e.g. 40x60" />
            <Input label="Floor number" type="number" value={form.floorNumber} onChange={(v) => set('floorNumber', v)} />
            <Input label="Total floors" type="number" value={form.totalFloors} onChange={(v) => set('totalFloors', v)} />
            <Input label="BHK" type="number" value={form.bhk} onChange={(v) => set('bhk', v)} />
            <Input label="Bathrooms" type="number" value={form.bathroomsTotal} onChange={(v) => set('bathroomsTotal', v)} />
            <Input label="Balconies" type="number" value={form.balconies} onChange={(v) => set('balconies', v)} />
          </Section>

          <Section title="Price & financial">
            <Input label="Price" type="number" value={form.price} onChange={(v) => set('price', v)} required />
            <Input label="Price per sq ft" type="number" value={form.pricePerSqft} onChange={(v) => set('pricePerSqft', v)} />
            <Input label="Price display text" value={form.priceDisplay} onChange={(v) => set('priceDisplay', v)} placeholder="e.g. ₹16,000/month" />
            <Input label="Deposit" type="number" value={form.deposit} onChange={(v) => set('deposit', v)} />
            <Input label="Maintenance (₹/month)" type="number" value={form.maintenanceCharges} onChange={(v) => set('maintenanceCharges', v)} />
            <Input label="Maintenance included" type="checkbox" value={form.maintenanceIncluded} onChange={(v) => set('maintenanceIncluded', v)} />
            <Input label="Electricity & water" value={form.electricityWaterCharges} onChange={(v) => set('electricityWaterCharges', v)} placeholder="Included / Not included" className="sm:col-span-2" />
            <Input label="Lease term" value={form.leaseTerm} onChange={(v) => set('leaseTerm', v)} placeholder="e.g. 11 months" />
            <Input label="Rent agreement duration" value={form.rentAgreementDuration} onChange={(v) => set('rentAgreementDuration', v)} />
            <Input label="Months of notice" type="number" value={form.monthsOfNotice} onChange={(v) => set('monthsOfNotice', v)} />
          </Section>

          <Section title="Furnishing & eligibility">
            <Input label="Furnishing" value={form.furnishing} onChange={(v) => set('furnishing', v)} options={FURNISHING} />
            <Input label="Appliances (comma-separated)" value={form.appliances} onChange={(v) => set('appliances', v)} placeholder="AC, fridge, washing machine" className="sm:col-span-2" />
            <Input label="Cooling" value={form.cooling} onChange={(v) => set('cooling', v)} placeholder="Central AC, Split" />
            <Input label="Available for" value={form.availableFor} onChange={(v) => set('availableFor', v)} options={AVAILABLE_FOR} />
            <Input label="Pets allowed" value={form.petsAllowed} onChange={(v) => set('petsAllowed', v)} />
          </Section>

          <Section title="Structure">
            <Input label="Year built" type="number" value={form.yearBuilt} onChange={(v) => set('yearBuilt', v)} />
            <Input label="Property age" value={form.propertyAge} onChange={(v) => set('propertyAge', v)} placeholder="e.g. 0-1 year" />
            <Input label="Flooring" value={form.flooring} onChange={(v) => set('flooring', v)} placeholder="Ceramic, marble, wooden" />
            <Input label="Facing" value={form.directionFaces} onChange={(v) => set('directionFaces', v)} placeholder="North, South, East, West" />
            <Input label="New construction" type="checkbox" value={form.newConstructionYn} onChange={(v) => set('newConstructionYn', v)} />
          </Section>

          <Section title="Amenities">
            <Input label="Parking count" type="number" value={form.parkingCount} onChange={(v) => set('parkingCount', v)} />
            <Input label="Parking type" value={form.parkingType} onChange={(v) => set('parkingType', v)} options={PARKING_TYPE} />
            <Input label="Power backup" value={form.powerBackup} onChange={(v) => set('powerBackup', v)} options={POWER_BACKUP} />
            <Input label="Security (comma-separated)" value={form.security} onChange={(v) => set('security', v)} placeholder="Guard, CCTV" className="sm:col-span-2" />
            <Input label="Highlights (comma-separated)" value={form.highlights} onChange={(v) => set('highlights', v)} placeholder="Close to metro, furnished" className="sm:col-span-2" />
            <Input label="Community features (comma-separated)" value={form.communityFeatures} onChange={(v) => set('communityFeatures', v)} placeholder="Pool, gym, garden" className="sm:col-span-2" />
          </Section>

          <Section title="Legal & RERA">
            <Input label="RERA registered" type="checkbox" value={form.reraRegistered} onChange={(v) => set('reraRegistered', v)} />
            <Input label="RERA number" value={form.reraNumber} onChange={(v) => set('reraNumber', v)} />
            <Input label="RERA status" value={form.reraStatus} onChange={(v) => set('reraStatus', v)} options={RERA_STATUS} />
            <Input label="RERA website" value={form.reraWebsite} onChange={(v) => set('reraWebsite', v)} placeholder="https://..." />
            <Input label="Ownership" value={form.ownershipType} onChange={(v) => set('ownershipType', v)} options={OWNERSHIP} />
          </Section>

          <Section title="Media">
            <Input label="Image URLs (comma-separated)" type="textarea" value={form.images} onChange={(v) => set('images', v)} placeholder="https://..." className="sm:col-span-2" />
            <Input label="Video URL" value={form.videoUrl} onChange={(v) => set('videoUrl', v)} />
            <Input label="Floor plan URL" value={form.floorPlanUrl} onChange={(v) => set('floorPlanUrl', v)} />
          </Section>

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? 'Saving...' : isEdit ? 'Update property' : 'Create property'}
            </button>
            <Link href="/account/properties" className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
