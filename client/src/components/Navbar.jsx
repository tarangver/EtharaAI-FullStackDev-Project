import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User, FolderGit2, LayoutDashboard, Shield, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

export default function Navbar() {
  const { user, token, logout, isAdmin, getDefaultRoute } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  
  const panelRoute = getDefaultRoute(user);
  const panelLabel = isAdmin ? 'Admin Panel' : 'Member Panel';

  const isActive = (path) => location.pathname.startsWith(path);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Extract initials for the profile avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-50 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LEFT SECTION: Logo Branding */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
              E
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-750 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent tracking-tight group-hover:text-slate-950 dark:group-hover:text-slate-50 transition-colors">
              EtharaAI
            </span>
          </Link>

          {/* MIDDLE SECTION: Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5">
            {token ? (
              <>
                <Link
                  to={panelRoute}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                    isActive('/dashboard') || isActive('/admin') || isActive('/member')
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30 shadow-sm shadow-indigo-100/10'
                      : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    {panelLabel}
                  </span>
                </Link>
                <Link
                  to="/projects"
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                    isActive('/projects')
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30 shadow-sm shadow-indigo-100/10'
                      : 'text-slate-605 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4" />
                    Projects
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                    isActive('/login')
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30'
                      : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                    isActive('/register')
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30'
                      : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* RIGHT SECTION: Profile, Theme Toggle & User Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-slate-205 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 focus:outline-none shadow-sm"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500 animate-pulse-slow" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {token ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Trigger Button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 transition-all focus:outline-none shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                    {getInitials(user?.name)}
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-medium max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3.5 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold truncate">{user?.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs truncate mt-0.5">{user?.email}</p>
                      
                      {/* Role Capsule Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2.5 ${
                        isAdmin 
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-750 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}>
                        <Shield className="w-3 h-3" />
                        {user?.role || 'User'}
                      </span>
                    </div>

                    <div className="p-1 mt-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/register"
                className="btn-primary py-2 px-5 text-sm !rounded-full text-center"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* MOBILE SECTION: Hamburger & Theme Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            
            {/* Theme Toggle Button for Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-550 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none transition-colors shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none transition-colors shadow-sm"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE SECTION: Navigation Panel Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
          <div className="px-4 pt-3 pb-6 space-y-4">
            
            {token ? (
              <>
                {/* Active Panel Link */}
                <Link
                  to={panelRoute}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    isActive('/dashboard') || isActive('/admin') || isActive('/member')
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4.5 h-4.5" />
                  {panelLabel}
                </Link>

                {/* Projects Link */}
                <Link
                  to="/projects"
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    isActive('/projects')
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <FolderGit2 className="w-4.5 h-4.5" />
                  Projects
                </Link>

                {/* Profile Directory info */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-extrabold text-xs flex items-center justify-center">
                      {getInitials(user?.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-800 dark:text-slate-200 text-sm font-bold truncate">{user?.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs truncate mt-0.5">{user?.role}</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Logout action */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 bg-red-55 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 hover:bg-red-100/50 dark:hover:bg-red-900/50 transition-all text-left mt-2"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  Logout Session
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  className="py-2.5 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="py-2.5 text-center text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/15"
                >
                  Register
                </Link>
              </div>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}
