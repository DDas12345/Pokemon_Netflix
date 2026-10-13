import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'pokeflix_watchlist';
const HISTORY_KEY = 'pokeflix_watch_history';

export const useWatchlist = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage or API
  const fetchWatchlist = useCallback(async () => {
    setLoading(true);
    let items = [];

    // First load from localStorage to be instantaneous
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        items = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading watchlist from storage:', e);
    }

    // If user is authenticated, attempt sync with backend API
    if (user) {
      try {
        const res = await axios.get('/api/watchlist');
        if (Array.isArray(res.data)) {
          items = res.data;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } else if (res.data?.watchlist) {
          items = res.data.watchlist;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
      } catch (err) {
        // Fall back gracefully to localStorage
      }
    }

    setWatchlist(items);

    // Also fetch watch history
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setWatchHistory(JSON.parse(storedHistory));
      } else {
        // Default popular Pokémon in continue watching
        const defaults = [
          { id: 25, name: 'pikachu', displayName: 'Pikachu', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', progress: 85 },
          { id: 6, name: 'charizard', displayName: 'Charizard', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', progress: 45 },
          { id: 150, name: 'mewtwo', displayName: 'Mewtwo', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png', progress: 60 },
          { id: 94, name: 'gengar', displayName: 'Gengar', types: ['ghost', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png', progress: 30 },
        ];
        setWatchHistory(defaults);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(defaults));
      }
    } catch {
      // Ignore
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  // Check if a pokemon is in watchlist
  const isInWatchlist = useCallback(
    (pokemonId) => {
      const targetId = Number(pokemonId);
      return watchlist.some((item) => Number(item.id) === targetId);
    },
    [watchlist]
  );

  // Add to watchlist
  const addToWatchlist = useCallback(
    async (pokemon) => {
      if (!pokemon || !pokemon.id) return;
      const normalizedPokemon = {
        id: pokemon.id,
        name: pokemon.name,
        displayName: pokemon.displayName || pokemon.name,
        types: pokemon.types || [],
        image: pokemon.image || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
        stats: pokemon.stats || [],
        addedAt: new Date().toISOString(),
      };

      setWatchlist((prev) => {
        if (prev.some((item) => Number(item.id) === Number(pokemon.id))) {
          return prev;
        }
        const updated = [normalizedPokemon, ...prev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      if (user) {
        try {
          await axios.post('/api/watchlist', { pokemonId: pokemon.id, pokemon: normalizedPokemon });
        } catch (err) {
          // Keep local version
        }
      }
    },
    [user]
  );

  // Remove from watchlist
  const removeFromWatchlist = useCallback(
    async (pokemonId) => {
      const targetId = Number(pokemonId);
      setWatchlist((prev) => {
        const updated = prev.filter((item) => Number(item.id) !== targetId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      if (user) {
        try {
          await axios.delete(`/api/watchlist/${targetId}`);
        } catch (err) {
          // Keep local version
        }
      }
    },
    [user]
  );

  // Record a watch event into continue watching history
  const recordWatch = useCallback((pokemon, progress = 100) => {
    if (!pokemon || !pokemon.id) return;
    const historyItem = {
      id: pokemon.id,
      name: pokemon.name,
      displayName: pokemon.displayName || pokemon.name,
      types: pokemon.types || [],
      image: pokemon.image || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
      progress: Math.floor(Math.random() * 40) + 50,
      watchedAt: new Date().toISOString(),
    };

    setWatchHistory((prev) => {
      const filtered = prev.filter((item) => Number(item.id) !== Number(pokemon.id));
      const updated = [historyItem, ...filtered].slice(0, 15);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    watchlist,
    watchHistory,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    fetchWatchlist,
    recordWatch,
  };
};

export default useWatchlist;
