import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';

// Pages
import HomePage from './pages/HomePage';
import PokemonDetailPage from './pages/PokemonDetailPage';
import BrowsePage from './pages/BrowsePage';
import MyListPage from './pages/MyListPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

/**
 * ProtectedRoute Wrapper
 * Redirects unauthenticated users to /login preserving the requested location
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-pokeflix-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-pokeflix-red border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm font-semibold tracking-wider uppercase">
            Loading Pokéflix...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Main App Component
 */
function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-pokeflix-dark text-white flex flex-col font-sans selection:bg-pokeflix-red selection:text-white">
      {/* Show Navbar on non-auth pages */}
      {!isAuthPage && <Navbar />}

      {/* Routes */}
      <main className="flex-1">
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Main Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pokemon/:id"
            element={
              <ProtectedRoute>
                <PokemonDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/browse/:type"
            element={
              <ProtectedRoute>
                <BrowsePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/browse"
            element={<Navigate to="/browse/fire" replace />}
          />

          <Route
            path="/my-list"
            element={
              <ProtectedRoute>
                <MyListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer on non-auth pages */}
      {!isAuthPage && (
        <footer className="border-t border-white/5 py-10 px-4 sm:px-8 md:px-12 bg-neutral-950 text-gray-500 text-xs select-none">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-pokeflix-red font-bold text-sm">POKÉFLIX</span>
              <span>&bull;</span>
              <span>The Premier Pokémon Streaming Experience</span>
            </div>
            <div className="flex flex-wrap gap-4 text-gray-400">
              <span className="hover:text-white cursor-pointer transition">Audio Description</span>
              <span className="hover:text-white cursor-pointer transition">Help Center</span>
              <span className="hover:text-white cursor-pointer transition">Privacy & Pokédex Policy</span>
              <span className="hover:text-white cursor-pointer transition">Terms of League</span>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-4 text-center sm:text-left text-gray-600 text-[11px]">
            &copy; {new Date().getFullYear()} Pokéflix Inc. Pokémon and Pokémon character names are trademarks of Nintendo / Creatures Inc. / GAME FREAK inc.
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
