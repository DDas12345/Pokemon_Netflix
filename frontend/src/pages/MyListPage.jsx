import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';
import PokemonCard from '../components/PokemonCard';

const MyListPage = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'name' | 'id'

  // Available types in user's watchlist
  const availableTypes = Array.from(
    new Set(watchlist.flatMap((p) => p.types || []))
  );

  // Filtered & Sorted
  let displayedList = [...watchlist];
  if (filterType !== 'all') {
    displayedList = displayedList.filter((p) =>
      p.types?.includes(filterType)
    );
  }

  if (sortBy === 'name') {
    displayedList.sort((a, b) => (a.displayName || a.name).localeCompare(b.displayName || b.name));
  } else if (sortBy === 'id') {
    displayedList.sort((a, b) => Number(a.id) - Number(b.id));
  }

  return (
    <div className="min-h-screen bg-pokeflix-dark pt-24 md:pt-32 pb-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto text-white select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            My List
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {watchlist.length} {watchlist.length === 1 ? 'Pokémon title' : 'Pokémon titles'} bookmarked in your queue
          </p>
        </div>

        {/* Filter and Sort Bar */}
        {watchlist.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {/* Type Filter */}
            {availableTypes.length > 1 && (
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-pokeflix-red"
              >
                <option value="all">All Types</option>
                {availableTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.toUpperCase()}
                  </option>
                ))}
              </select>
            )}

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-pokeflix-red"
            >
              <option value="recent">Recently Added</option>
              <option value="name">Name (A-Z)</option>
              <option value="id">Pokédex Number</option>
            </select>
          </div>
        )}
      </div>

      {/* Empty State: Snorlax Sleeping */}
      {watchlist.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-6">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png"
              alt="Sleeping Snorlax"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] animate-pulse-subtle"
            />
            {/* Zzz Animation */}
            <div className="absolute top-4 right-10 text-3xl font-pixel text-blue-300 font-bold animate-bounce">
              Zzz...
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Your list is empty! Even Snorlax is sleeping on this.
          </h2>
          <p className="text-gray-400 text-sm max-w-md mb-8">
            Explore the legendary archives and tap "+ My List" on any Pokémon to save them to your personal watchlist for streaming anytime.
          </p>

          <Link
            to="/"
            className="px-8 py-3.5 bg-pokeflix-red hover:bg-red-700 text-white font-bold rounded-lg shadow-xl hover:shadow-red-700/40 transition hover:scale-105 active:scale-95 text-sm"
          >
            Explore Featured Pokémon &rarr;
          </Link>
        </div>
      ) : (
        /* Grid of Saved Pokémon */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 animate-fade-in">
          {displayedList.map((pokemon) => (
            <div key={pokemon.id} className="relative group">
              <PokemonCard pokemon={pokemon} />
              {/* Quick Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWatchlist(pokemon.id);
                }}
                className="absolute top-2 right-2 z-40 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                title="Remove from list"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListPage;
