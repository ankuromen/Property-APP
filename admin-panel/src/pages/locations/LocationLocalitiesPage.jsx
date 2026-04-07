import { adminFetch } from '../../api/adminClient';
import Section from './Section';
import { useLocationsModule } from '../../context/LocationsModuleContext';

const selectCls =
  'mt-1 w-full min-w-[12rem] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100';

export default function LocationLocalitiesPage() {
  const {
    BASE,
    countries,
    countryId,
    setCountryId,
    states,
    stateId,
    setStateId,
    cities,
    cityId,
    setCityId,
    localities,
    newLoc,
    setNewLoc,
    loadLocalities,
    handleErr,
    addLocality,
    setErr,
    selectedCity,
  } = useLocationsModule();

  return (
    <div className="space-y-8">
      <Section
        title="Scope"
        subtitle="Pick country, state, and city. Then manage localities below."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <div className="min-w-[160px] flex-1">
            <label className="block text-xs font-medium text-slate-600">Country</label>
            <select
              className={selectCls}
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
            >
              <option value="">Select country…</option>
              {countries.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[160px] flex-1">
            <label className="block text-xs font-medium text-slate-600">State</label>
            <select
              className={selectCls}
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
              disabled={!countryId}
            >
              <option value="">Select state…</option>
              {states.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[160px] flex-1">
            <label className="block text-xs font-medium text-slate-600">City</label>
            <select
              className={selectCls}
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              disabled={!stateId}
            >
              <option value="">Select city…</option>
              {cities.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      <Section
        title="Localities (lat / long)"
        subtitle={
          selectedCity
            ? `Inside: ${selectedCity.name}`
            : 'Select a city to add localities with coordinates.'
        }
      >
        <form onSubmit={addLocality} className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-[160px] flex-1">
            <label className="block text-xs font-medium text-slate-600">Locality name</label>
            <input
              type="text"
              placeholder="e.g. Golf Course Road"
              value={newLoc.name}
              onChange={(e) => setNewLoc((p) => ({ ...p, name: e.target.value }))}
              disabled={!cityId}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100"
            />
          </div>
          <div className="w-32">
            <label className="block text-xs font-medium text-slate-600">Latitude</label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="28.4595"
              value={newLoc.latitude}
              onChange={(e) => setNewLoc((p) => ({ ...p, latitude: e.target.value }))}
              disabled={!cityId}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100"
            />
          </div>
          <div className="w-32">
            <label className="block text-xs font-medium text-slate-600">Longitude</label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="77.0266"
              value={newLoc.longitude}
              onChange={(e) => setNewLoc((p) => ({ ...p, longitude: e.target.value }))}
              disabled={!cityId}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100"
            />
          </div>
          <button
            type="submit"
            disabled={!cityId}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500 disabled:opacity-50"
          >
            Add locality
          </button>
        </form>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-600">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Latitude</th>
                <th className="px-4 py-2">Longitude</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!cityId && (
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-slate-500">
                    Select a city first.
                  </td>
                </tr>
              )}
              {cityId && localities.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-slate-500">
                    No localities yet.
                  </td>
                </tr>
              )}
              {localities.map((loc) => (
                <tr key={loc._id}>
                  <td className="px-4 py-2 font-medium text-slate-900">{loc.name}</td>
                  <td className="px-4 py-2 text-slate-700">{loc.latitude}</td>
                  <td className="px-4 py-2 text-slate-700">{loc.longitude}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      className="mr-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                      onClick={async () => {
                        const name = window.prompt('Locality name', loc.name);
                        if (!name || !name.trim()) return;
                        const latStr = window.prompt('Latitude', String(loc.latitude));
                        const lngStr = window.prompt('Longitude', String(loc.longitude));
                        if (latStr == null || lngStr == null) return;
                        const latitude = parseFloat(latStr);
                        const longitude = parseFloat(lngStr);
                        if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
                          setErr('Invalid coordinates');
                          return;
                        }
                        try {
                          await adminFetch(`${BASE}/localities/${loc._id}`, {
                            method: 'PATCH',
                            body: JSON.stringify({ name: name.trim(), latitude, longitude }),
                          });
                          await loadLocalities(cityId);
                        } catch (e) {
                          handleErr(e);
                        }
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-xs font-medium text-red-600 hover:text-red-800"
                      onClick={async () => {
                        if (!window.confirm(`Delete "${loc.name}"?`)) return;
                        try {
                          await adminFetch(`${BASE}/localities/${loc._id}`, { method: 'DELETE' });
                          await loadLocalities(cityId);
                        } catch (e) {
                          handleErr(e);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
