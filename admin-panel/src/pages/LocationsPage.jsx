import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminFetch } from '../api/adminClient';
import { useAdminAuth } from '../context/AdminAuthContext';

const BASE = '/api/admin/locations';

function Section({ title, subtitle, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function LocationsPage() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [err, setErr] = useState('');

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);

  const [countryId, setCountryId] = useState('');
  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');

  const [newCountry, setNewCountry] = useState('');
  const [newState, setNewState] = useState('');
  const [newCity, setNewCity] = useState({ name: '', latitude: '', longitude: '' });
  const [newLoc, setNewLoc] = useState({ name: '', latitude: '', longitude: '' });

  const handleErr = useCallback(
    (e) => {
      if (e.status === 401) {
        logout();
        navigate('/login', { replace: true });
        return;
      }
      setErr(e.message || 'Something went wrong');
    },
    [logout, navigate]
  );

  const loadCountries = useCallback(() => {
    setErr('');
    return adminFetch(`${BASE}/countries`)
      .then((d) => setCountries(d.countries || []))
      .catch(handleErr);
  }, [handleErr]);

  const loadStates = useCallback(
    (cid) => {
      if (!cid) {
        setStates([]);
        return Promise.resolve();
      }
      setErr('');
      return adminFetch(`${BASE}/states?countryId=${encodeURIComponent(cid)}`)
        .then((d) => setStates(d.states || []))
        .catch(handleErr);
    },
    [handleErr]
  );

  const loadCities = useCallback(
    (sid) => {
      if (!sid) {
        setCities([]);
        return Promise.resolve();
      }
      setErr('');
      return adminFetch(`${BASE}/cities?stateId=${encodeURIComponent(sid)}`)
        .then((d) => setCities(d.cities || []))
        .catch(handleErr);
    },
    [handleErr]
  );

  const loadLocalities = useCallback(
    (cid) => {
      if (!cid) {
        setLocalities([]);
        return Promise.resolve();
      }
      setErr('');
      return adminFetch(`${BASE}/localities?cityId=${encodeURIComponent(cid)}`)
        .then((d) => setLocalities(d.localities || []))
        .catch(handleErr);
    },
    [handleErr]
  );

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  useEffect(() => {
    setStateId('');
    setCityId('');
    setStates([]);
    setCities([]);
    setLocalities([]);
    if (countryId) loadStates(countryId);
  }, [countryId, loadStates]);

  useEffect(() => {
    setCityId('');
    setCities([]);
    setLocalities([]);
    if (stateId) loadCities(stateId);
  }, [stateId, loadCities]);

  useEffect(() => {
    setLocalities([]);
    if (cityId) loadLocalities(cityId);
  }, [cityId, loadLocalities]);

  async function addCountry(e) {
    e.preventDefault();
    const name = newCountry.trim();
    if (!name) return;
    setErr('');
    try {
      await adminFetch(`${BASE}/countries`, { method: 'POST', body: JSON.stringify({ name }) });
      setNewCountry('');
      await loadCountries();
    } catch (e) {
      handleErr(e);
    }
  }

  async function addState(e) {
    e.preventDefault();
    if (!countryId) return;
    const name = newState.trim();
    if (!name) return;
    setErr('');
    try {
      await adminFetch(`${BASE}/states`, {
        method: 'POST',
        body: JSON.stringify({ countryId, name }),
      });
      setNewState('');
      await loadStates(countryId);
    } catch (e) {
      handleErr(e);
    }
  }

  async function addCity(e) {
    e.preventDefault();
    if (!stateId) return;
    const name = newCity.name.trim();
    const latitude = parseFloat(newCity.latitude);
    const longitude = parseFloat(newCity.longitude);
    if (!name || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setErr('City: enter name, latitude, and longitude');
      return;
    }
    setErr('');
    try {
      await adminFetch(`${BASE}/cities`, {
        method: 'POST',
        body: JSON.stringify({ stateId, name, latitude, longitude }),
      });
      setNewCity({ name: '', latitude: '', longitude: '' });
      await loadCities(stateId);
    } catch (e) {
      handleErr(e);
    }
  }

  async function addLocality(e) {
    e.preventDefault();
    if (!cityId) return;
    const name = newLoc.name.trim();
    const latitude = parseFloat(newLoc.latitude);
    const longitude = parseFloat(newLoc.longitude);
    if (!name || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setErr('Enter name, latitude, and longitude');
      return;
    }
    setErr('');
    try {
      await adminFetch(`${BASE}/localities`, {
        method: 'POST',
        body: JSON.stringify({ cityId, name, latitude, longitude }),
      });
      setNewLoc({ name: '', latitude: '', longitude: '' });
      await loadLocalities(cityId);
    } catch (e) {
      handleErr(e);
    }
  }

  const selectedCountry = countries.find((c) => c._id === countryId);
  const selectedState = states.find((s) => s._id === stateId);
  const selectedCity = cities.find((c) => c._id === cityId);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Locations</h1>
        <p className="mt-1 text-slate-600">
          Hierarchy: Country → State → City → Locality. Cities and localities each store latitude and longitude (WGS84)
          for mapping.
        </p>
      </header>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {err}
        </div>
      )}

      <Section title="1. Countries" subtitle="Add a country, then select it to manage states below.">
        <form onSubmit={addCountry} className="mb-4 flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Country name (e.g. India)"
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value)}
            className="min-w-[200px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500"
          >
            Add country
          </button>
          <button
            type="button"
            onClick={() => loadCountries()}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
          >
            Refresh
          </button>
        </form>
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {countries.length === 0 && <li className="px-4 py-3 text-sm text-slate-500">No countries yet.</li>}
          {countries.map((c) => (
            <li key={c._id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <button
                type="button"
                onClick={() => setCountryId(c._id)}
                className={`text-left text-sm font-medium ${
                  countryId === c._id ? 'text-teal-700' : 'text-slate-900 hover:text-teal-600'
                }`}
              >
                {c.name}
                {countryId === c._id && <span className="ml-2 text-xs text-teal-600">(selected)</span>}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                  onClick={async () => {
                    const name = window.prompt('Country name', c.name);
                    if (!name || !name.trim()) return;
                    setErr('');
                    try {
                      await adminFetch(`${BASE}/countries/${c._id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({ name: name.trim() }),
                      });
                      await loadCountries();
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
                    if (!window.confirm(`Delete "${c.name}"? Child states must be removed first.`)) return;
                    setErr('');
                    try {
                      await adminFetch(`${BASE}/countries/${c._id}`, { method: 'DELETE' });
                      if (countryId === c._id) setCountryId('');
                      await loadCountries();
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

      <Section
        title="2. States"
        subtitle={
          selectedCountry
            ? `Inside: ${selectedCountry.name}`
            : 'Select a country above to add or list states.'
        }
      >
        <form onSubmit={addState} className="mb-4 flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="State name (e.g. Haryana)"
            value={newState}
            onChange={(e) => setNewState(e.target.value)}
            disabled={!countryId}
            className="min-w-[200px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={!countryId}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500 disabled:opacity-50"
          >
            Add state
          </button>
        </form>
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {!countryId && <li className="px-4 py-3 text-sm text-slate-500">Select a country first.</li>}
          {countryId && states.length === 0 && (
            <li className="px-4 py-3 text-sm text-slate-500">No states yet.</li>
          )}
          {states.map((s) => (
            <li key={s._id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <button
                type="button"
                onClick={() => setStateId(s._id)}
                className={`text-left text-sm font-medium ${
                  stateId === s._id ? 'text-teal-700' : 'text-slate-900 hover:text-teal-600'
                }`}
              >
                {s.name}
                {stateId === s._id && <span className="ml-2 text-xs text-teal-600">(selected)</span>}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                  onClick={async () => {
                    const name = window.prompt('State name', s.name);
                    if (!name || !name.trim()) return;
                    setErr('');
                    try {
                      await adminFetch(`${BASE}/states/${s._id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({ name: name.trim() }),
                      });
                      await loadStates(countryId);
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
                    if (!window.confirm(`Delete "${s.name}"? Cities under it must be removed first.`)) return;
                    setErr('');
                    try {
                      await adminFetch(`${BASE}/states/${s._id}`, { method: 'DELETE' });
                      if (stateId === s._id) setStateId('');
                      await loadStates(countryId);
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

      <Section
        title="3. Cities (lat / long)"
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
              <button
                type="button"
                onClick={() => setCityId(c._id)}
                className={`max-w-[min(100%,20rem)] text-left text-sm font-medium ${
                  cityId === c._id ? 'text-teal-700' : 'text-slate-900 hover:text-teal-600'
                }`}
              >
                <span className="block">
                  {c.name}
                  {cityId === c._id && <span className="ml-2 text-xs text-teal-600">(selected)</span>}
                </span>
                <span className="mt-0.5 block font-mono text-[11px] font-normal text-slate-500">
                  {c.latitude != null && c.longitude != null
                    ? `${Number(c.latitude).toFixed(5)}, ${Number(c.longitude).toFixed(5)}`
                    : '—'}
                </span>
              </button>
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
                    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
                      setErr('Invalid coordinates');
                      return;
                    }
                    setErr('');
                    try {
                      await adminFetch(`${BASE}/cities/${c._id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({
                          name: name.trim(),
                          latitude,
                          longitude,
                        }),
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
                    setErr('');
                    try {
                      await adminFetch(`${BASE}/cities/${c._id}`, { method: 'DELETE' });
                      if (cityId === c._id) setCityId('');
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

      <Section
        title="4. Localities (lat / long)"
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
                        setErr('');
                        try {
                          await adminFetch(`${BASE}/localities/${loc._id}`, {
                            method: 'PATCH',
                            body: JSON.stringify({
                              name: name.trim(),
                              latitude,
                              longitude,
                            }),
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
                        setErr('');
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
