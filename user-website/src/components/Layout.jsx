import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-stone-900 tracking-tight">
            Property
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-stone-600 hover:text-stone-900 text-sm font-medium">
              Home
            </Link>
            <Link to="/browse" className="text-stone-600 hover:text-stone-900 text-sm font-medium">
              Browse
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
        © Property listings. Contact vendors directly for inquiries.
      </footer>
    </div>
  );
}
