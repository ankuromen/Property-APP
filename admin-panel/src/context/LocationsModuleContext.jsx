import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminFetch } from '../api/adminClient';
import { useAdminAuth } from './AdminAuthContext';

const BASE = '/api/admin/locations';

const LocationsModuleContext = createContext(null);

export function LocationsModuleProvider({ children }) {
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
    return adminFetch(BASE + '/countries')
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

  const value = {
    BASE,
    err,
    setErr,
    countries,
    states,
    cities,
    localities,
    countryId,
    setCountryId,
    stateId,
    setStateId,
    cityId,
    setCityId,
    newCountry,
    setNewCountry,
    newState,
    setNewState,
    newCity,
    setNewCity,
    newLoc,
    setNewLoc,
    loadCountries,
    loadStates,
    loadCities,
    loadLocalities,
    handleErr,
    addCountry,
    addState,
    addCity,
    addLocality,
    selectedCountry: countries.find((c) => c._id === countryId),
    selectedState: states.find((s) => s._id === stateId),
    selectedCity: cities.find((c) => c._id === cityId),
  };

  return <LocationsModuleContext.Provider value={value}>{children}</LocationsModuleContext.Provider>;
}

export function useLocationsModule() {
  const ctx = useContext(LocationsModuleContext);
  if (!ctx) throw new Error('useLocationsModule must be used within LocationsModuleProvider');
  return ctx;
}
