import { adminFetch } from '../../api/adminClient';
import Section from './Section';
import { useLocationsModule } from '../../context/LocationsModuleContext';

export default function LocationStatesPage() {
  const {
    BASE,
    countries,
    countryId,
    setCountryId,
    states,
    stateId,
    setStateId,
    newCountry,
    setNewCountry,
    newState,
    setNewState,
    loadCountries,
    loadStates,
    handleErr,
    addCountry,
    addState,
    selectedCountry,
  } = useLocationsModule();

  return (
    <div className="space-y-8">
      <Section title="Countries" subtitle="Add a country, then select it to manage states.">
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
        title="States"
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
    </div>
  );
}
