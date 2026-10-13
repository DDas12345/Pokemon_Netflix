import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Detect scroll to toggle transparent/solid background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition duration-200 hover:text-white ${isActive ? 'text-white font-bold' : 'text-gray-300'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${isScrolled
          ? 'bg-pokeflix-dark/95 shadow-xl backdrop-blur-md border-b border-white/5'
          : 'bg-gradient-to-b from-black/85 via-black/40 to-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Brand Logo + Nav Links */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center gap-2.5 group">
            {/* Animated Pokéball SVG Logo */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 group-hover:rotate-180 transition-transform duration-700 ease-in-out">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                <circle cx="50" cy="50" r="48" fill="#141414" stroke="#E50914" strokeWidth="4" />
                <path d="M2 50 A48 48 0 0 1 98 50 Z" fill="#E50914" />
                <path d="M2 50 A48 48 0 0 0 98 50 Z" fill="#FFFFFF" />
                <line x1="2" y1="50" x2="98" y2="50" stroke="#141414" strokeWidth="8" />
                <circle cx="50" cy="50" r="16" fill="#141414" />
                <circle cx="50" cy="50" r="10" fill="#FFFFFF" />
                <circle cx="50" cy="50" r="6" fill="#141414" />
              </svg>
            </div>
            {/* Brand Title */}
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-pokeflix-red group-hover:text-red-500 transition-colors uppercase">
              POKÉFLIX
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/browse/fire" className={navLinkClass}>
              Browse by Type
            </NavLink>
            <NavLink to="/my-list" className={navLinkClass}>
              My List
            </NavLink>
            <NavLink to="/search" className={navLinkClass}>
              Pokédex
            </NavLink>
          </nav>
        </div>

        {/* Right: Search + Profile / Login */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search Bar */}
          <SearchBar />

          {/* Profile Menu or Login Button */}
          {user ? (
            <div ref={profileMenuRef} className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded overflow-hidden border border-white/20 group-hover:border-red-500 transition">
                  <img
                    src={
                      user.avatar ||
                      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
                    }
                    alt={user.username || 'Trainer'}
                    className="w-full h-full object-cover bg-neutral-800"
                  />
                </div>
                <svg
                  className={`w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-transform duration-200 hidden sm:block ${isProfileMenuOpen ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl py-2 z-50 animate-fade-in glass-modal">
                  <div className="px-4 py-2 border-b border-neutral-800">
                    <p className="text-xs text-gray-400 font-medium">Logged in as</p>
                    <p className="text-sm font-bold text-white truncate">
                      {user.username || 'Pokémon Trainer'}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/my-list"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-neutral-800 transition"
                  >
                    My Watchlist
                  </Link>
                  <Link
                    to="/browse/fire"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-neutral-800 transition"
                  >
                    Explore Types
                  </Link>

                  <div className="border-t border-neutral-800 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-neutral-800 transition font-semibold"
                    >
                      Sign Out of Pokéflix
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded bg-pokeflix-red hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition shadow-md"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral-950/95 border-b border-neutral-800 px-6 py-4 space-y-3 animate-fade-in backdrop-blur-lg">
          <NavLink
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-gray-200 hover:text-white py-1"
          >
            Home
          </NavLink>
          <NavLink
            to="/browse/fire"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-gray-200 hover:text-white py-1"
          >
            Browse by Type
          </NavLink>
          <NavLink
            to="/my-list"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-gray-200 hover:text-white py-1"
          >
            My List
          </NavLink>
          <NavLink
            to="/search"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-gray-200 hover:text-white py-1"
          >
            Pokédex Search
          </NavLink>
          {user && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="block w-full text-left text-sm font-semibold text-red-500 py-2 border-t border-neutral-800"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
