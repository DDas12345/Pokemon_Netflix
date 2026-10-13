import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../hooks/usePokemon';
import PokemonCard from '../components/PokemonCard';
import { GridSkeleton } from '../components/LoadingSkeleton';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const { results, loading } = useSearch(searchTerm);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchTerm) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-pokeflix-dark pt-24 md:pt-32 pb-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto text-white select-none">
      {/* Search Header and Input */}
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
          Pokédex Global Search
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Find your favorite Pokémon across all generations by name or Pokédex number.
        </p>

        {/* Big Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search by name (e.g. Mewtwo, Pikachu, Charizard) or ID (e.g. 150)..."
            className="w-full pl-12 pr-10 py-4 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-gray-500 focus:outline-none focus:border-pokeflix-red focus:ring-2 focus:ring-pokeflix-red/40 shadow-xl text-base transition"
            autoFocus
          />
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {/* Clear Button */}
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results Meta */}
      {searchTerm.trim() && !loading && (
        <div className="mb-6 flex items-center justify-between border-b border-neutral-800 pb-3">
          <span className="text-sm text-gray-400">
            Results for <span className="text-white font-bold">"{searchTerm}"</span>
          </span>
          <span className="text-xs font-mono text-gray-500">
            {results.length} matches found
          </span>
        </div>
      )}

      {/* Grid Results or States */}
      {loading ? (
        <GridSkeleton count={12} />
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 animate-fade-in">
          {results.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      ) : searchTerm.trim() ? (
        /* Team Rocket Empty State */
        <div className="py-16 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 mb-4">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png"
              alt="Meowth Team Rocket"
              className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Looks like Team Rocket blasted away with those Pokémon!
          </h2>
          <p className="text-gray-400 text-sm max-w-md mb-6">
            We couldn't find any Pokémon matching "{searchTerm}". Try checking your spelling or search by Pokédex number.
          </p>
          <button
            onClick={handleClear}
            className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm rounded-lg border border-white/10 transition"
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* Prompt to type search */
        <div className="py-20 text-center text-gray-500 text-sm italic">
          Type above to explore the entire universe of Pokémon titles...
        </div>
      )}
    </div>
  );
};

export default SearchPage;
