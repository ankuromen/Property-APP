import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`;

export default function Sidebar() {
  const { logout } = useAdminAuth();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-white">
      <div className="border-b border-slate-800 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Property</p>
        <p className="text-lg font-bold text-white">Admin</p>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Modules</p>
        <NavLink to="/properties" className={linkClass} end={false}>
          <span aria-hidden>◇</span>
          Properties
        </NavLink>
        <NavLink to="/brokers" className={linkClass} end={false}>
          <span aria-hidden>◇</span>
          Brokers
        </NavLink>
        <p className="mb-1 mt-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Locations
        </p>
        <NavLink to="/locations/states" className={linkClass} end>
          <span aria-hidden>◇</span>
          States
        </NavLink>
        <NavLink to="/locations/cities" className={linkClass} end>
          <span aria-hidden>◇</span>
          Cities
        </NavLink>
        <NavLink to="/locations/localities" className={linkClass} end>
          <span aria-hidden>◇</span>
          Localities
        </NavLink>
        <NavLink to="/plans" className={linkClass} end={false}>
          <span aria-hidden>◇</span>
          Plans
        </NavLink>
      </nav>

      <div className="border-t border-slate-800 p-3">
        <button
          type="button"
          onClick={() => logout()}
          className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
