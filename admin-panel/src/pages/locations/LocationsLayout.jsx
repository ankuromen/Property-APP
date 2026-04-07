import { NavLink, Outlet } from 'react-router-dom';
import { useLocationsModule } from '../../context/LocationsModuleContext';

const tabClass = ({ isActive }) =>
  `rounded-lg px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-teal-600 text-white shadow-sm'
      : 'border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-slate-50'
  }`;

export default function LocationsLayout() {
  const { err } = useLocationsModule();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Locations</h1>
        <p className="mt-1 text-slate-600">
          Country → State → City → Locality. Choose a submodule below; your country / state / city picks are kept
          as you switch tabs. Cities and localities use WGS84 coordinates.
        </p>
        <nav className="mt-5 flex flex-wrap gap-2" aria-label="Locations submodules">
          <NavLink to="/locations/states" className={tabClass} end>
            States
          </NavLink>
          <NavLink to="/locations/cities" className={tabClass} end>
            Cities
          </NavLink>
          <NavLink to="/locations/localities" className={tabClass} end>
            Localities
          </NavLink>
        </nav>
      </header>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {err}
        </div>
      )}

      <Outlet />
    </div>
  );
}
