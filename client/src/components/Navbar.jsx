import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, token, logout, isAdmin, getDefaultRoute } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const panelRoute = getDefaultRoute(user);
  const panelLabel = isAdmin ? 'Admin Panel' : 'Member Panel';

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              T
            </div>
            <span className="text-xl font-bold text-slate-100 hidden md:inline">TaskFlow</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {token ? (
              <>
                <Link
                  to={panelRoute}
                  className={`transition-colors ${
                    isActive('/dashboard') || isActive('/admin') || isActive('/member')
                      ? 'text-indigo-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {panelLabel}
                </Link>
                <Link
                  to="/projects"
                  className={`transition-colors ${
                    isActive('/projects')
                      ? 'text-indigo-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Projects
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`transition-colors ${
                    isActive('/login')
                      ? 'text-indigo-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`transition-colors ${
                    isActive('/register')
                      ? 'text-indigo-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-slate-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {token ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-slate-300 text-sm">{user?.name}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      isAdmin ? 'bg-indigo-900 text-indigo-200' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {user?.role || 'User'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-700">
            {token ? (
              <>
                <Link
                  to={panelRoute}
                  className="block py-2 text-slate-400 hover:text-slate-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {panelLabel}
                </Link>
                <Link
                  to="/projects"
                  className="block py-2 text-slate-400 hover:text-slate-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Projects
                </Link>
                <div className="py-4 border-t border-slate-700 mt-2">
                  <p className="text-slate-400 text-sm">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-slate-400 hover:text-slate-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-slate-400 hover:text-slate-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
