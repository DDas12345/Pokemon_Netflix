import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, demoLogin, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    if (!email.trim()) {
      setLocalError('Please enter a valid trainer email.');
      return false;
    }
    if (!password) {
      setLocalError('Password is required to enter the Pokéflix arena.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!validate()) return;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemoLogin = () => {
    demoLogin('Ash Ketchum');
    navigate(from, { replace: true });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-16 bg-black overflow-hidden select-none">
      {/* Background Poster Collage with Blur and Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md opacity-25 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?q=80&w=1920&auto=format&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950" />

      {/* Top Left Logo */}
      <div className="absolute top-6 left-6 sm:left-12 z-20">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="#141414" stroke="#E50914" strokeWidth="4" />
              <path d="M2 50 A48 48 0 0 1 98 50 Z" fill="#E50914" />
              <path d="M2 50 A48 48 0 0 0 98 50 Z" fill="#FFFFFF" />
              <line x1="2" y1="50" x2="98" y2="50" stroke="#141414" strokeWidth="8" />
              <circle cx="50" cy="50" r="16" fill="#141414" />
              <circle cx="50" cy="50" r="10" fill="#FFFFFF" />
              <circle cx="50" cy="50" r="6" fill="#141414" />
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tight text-pokeflix-red uppercase">
            POKÉFLIX
          </span>
        </Link>
      </div>

      {/* Center Auth Card */}
      <div className="relative z-10 w-full max-w-md bg-neutral-900/90 backdrop-blur-xl border border-white/10 p-8 sm:p-12 rounded-2xl shadow-2xl animate-fade-in">
        <h1 className="text-3xl font-extrabold text-white mb-6 tracking-tight">
          Sign In
        </h1>

        {/* Error Alert */}
        {(localError || authError) && (
          <div className="mb-6 p-3 rounded-lg bg-red-900/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{localError || authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Trainer Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trainer@pokeflix.tv"
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-gray-500 focus:outline-none focus:border-pokeflix-red focus:ring-1 focus:ring-pokeflix-red transition text-sm"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Passcode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-gray-500 focus:outline-none focus:border-pokeflix-red focus:ring-1 focus:ring-pokeflix-red transition text-sm"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-lg bg-pokeflix-red hover:bg-red-700 text-white font-bold text-sm tracking-wide transition shadow-lg hover:shadow-red-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Trainer One-Click Login */}
        <div className="mt-4 pt-4 border-t border-neutral-800">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-gray-200 hover:text-white font-semibold text-xs tracking-wider transition border border-white/10 flex items-center justify-center gap-2"
          >
            <span>⚡ Quick Demo Trainer Login (Ash Ketchum)</span>
          </button>
        </div>

        {/* Register Footer Link */}
        <div className="mt-8 text-center text-sm text-gray-400">
          New to Pokéflix?{' '}
          <Link
            to="/register"
            className="text-white hover:text-red-400 font-bold transition ml-1"
          >
            Sign up now &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
