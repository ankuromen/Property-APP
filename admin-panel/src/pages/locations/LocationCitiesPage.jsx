import { adminFetch } from '../../api/adminClient';
import Section from './Section';
import { useLocationsModule } from '../../context/LocationsModuleContext';

const selectCls =
  'mt-1 w-full min-w-[12rem] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100';

export default function LocationCitiesPage() {
  const {
    BASE,
    countries,
    countryId,
    setCountryId,
    states,
    stateId,
    setStateId,
    cities,
    newCity,
    setNewCity,
    loadCities,
    handleErr,
    addCity,
    selectedState,
  } = useLocationsModule();

  return (
    <div className="space-y-8">
      <Section
        title="Scope"
        subtitle="Pick a country and state. Then add or edit cities with coordinates below."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <div className="min-w-[180px] flex-1">
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
          <div className="min-w-[180px] flex-1">
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
        </div>
      </Section>

      <Section
        title="Cities (lat / long)"
        subtitle={selectedState ? `Inside: ${selectedState.name}` : 'Select a state to add or list cities.'}
      >
        <form
          onSubmit={addCity}
          className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
        >
          <div className="min-w-[160px] flex-1">
            <label className="block text-xs font-medium text-slate-600">City name</label>
            <input
              type="text"
              placeholder="e.g. Gurgaon"
              value={newCity.name}
              onChange={(e) => setNewCity((p) => ({ ...p, name: e.target.value }))}
              disabled={!stateId}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100"
            />
          </div>
          <div className="w-28">
            <label className="block text-xs font-medium text-slate-600">Latitude</label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="28.4595"
              value={newCity.latitude}
              onChange={(e) => setNewCity((p) => ({ ...p, latitude: e.target.value }))}
              disabled={!stateId}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100"
            />
          </div>
          <div className="w-28">
            <label className="block text-xs font-medium text-slate-600">Longitude</label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="77.0266"
              value={newCity.longitude}
              onChange={(e) => setNewCity((p) => ({ ...p, longitude: e.target.value }))}
              disabled={!stateId}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100"
            />
          </div>
          <button
            type="submit"
            disabled={!stateId}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500 disabled:opacity-50"
          >
            Add city
          </button>
        </form>
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {!stateId && <li className="px-4 py-3 text-sm text-slate-500">Select a state first.</li>}
          {stateId && cities.length === 0 && <li className="px-4 py-3 text-sm text-slate-500">No cities yet.</li>}
          {cities.map((c) => (
            <li key={c._id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div>
                <span className="text-sm font-medium text-slate-900">{c.name}</span>
                <span className="mt-0.5 block font-mono text-[11px] text-slate-500">
                  {c.latitude != null && c.longitude != null
                    ? `${Number(c.latitude).toFixed(5)}, ${Number(c.longitude).toFixed(5)}`
                    : '—'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                  onClick={async () => {
                    const name = window.prompt('City name', c.name);
                    if (!name || !name.trim()) return;
                    const latStr = window.prompt('Latitude', c.latitude != null ? String(c.latitude) : '');
                    const lngStr = window.prompt('Longitude', c.longitude != null ? String(c.longitude) : '');
                    if (latStr == null || lngStr == null) return;
                    const latitude = parseFloat(latStr);
                    const longitude = parseFloat(lngStr);
                    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return;
                    try {
                      await adminFetch(`${BASE}/cities/${c._id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({ name: name.trim(), latitude, longitude }),
                      });
                      await loadCities(stateId);
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
                    if (!window.confirm(`Delete "${c.name}"? Localities under it must be removed first.`)) return;
                    try {
                      await adminFetch(`${BASE}/cities/${c._id}`, { method: 'DELETE' });
                      await loadCities(stateId);
                    } catch (e) {
                      handleErr(e);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
