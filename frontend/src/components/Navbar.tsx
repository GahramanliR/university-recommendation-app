import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/discover', label: 'Discover' },
    { to: '/search', label: 'Search' },
    { to: '/recommendations', label: 'Rankings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/discover" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:bg-sky-400 transition-colors">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">UniVerse</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive(to)
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive('/profile') ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="w-6 h-6 bg-sky-500/20 rounded-full flex items-center justify-center">
                  <span className="text-sky-400 text-xs font-bold">{user?.username[0].toUpperCase()}</span>
                </div>
                {user?.username}
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium transition-colors px-4 py-2">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2">
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-slate-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(to) ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-slate-800 mt-2 pt-2 flex flex-col gap-1">
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm text-slate-400 hover:text-white rounded-lg">
                  Profile ({user?.username})
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="px-4 py-2.5 text-sm text-slate-400 hover:text-white rounded-lg text-left">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm text-slate-400 hover:text-white rounded-lg">Sign in</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm text-sky-400 font-medium rounded-lg">Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
