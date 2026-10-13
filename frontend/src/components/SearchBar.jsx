import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../hooks/usePokemon';
import TypeBadge from './TypeBadge';

const SearchBar = ({ onSearchSubmit }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const { results, loading } = useSearch(query);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Click outside to collapse if empty
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (!query.trim()) {
          setIsExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsExpanded(false);
      if (onSearchSubmit) onSearchSubmit(query.trim());
    }
  };

  const handleSelectPokemon = (id) => {
    navigate(`/pokemon/${id}`);
    setIsExpanded(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      <form
        onSubmit={handleSubmit}
        className={`flex items-center transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'w-56 sm:w-72 md:w-80 bg-black/80 border border-white/30 rounded-full px-3 py-1.5'
            : 'w-9 h-9 bg-transparent border-transparent justify-center'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-300 hover:text-white transition focus:outline-none flex-shrink-0 p-1"
          title="Search Pokémon"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {isExpanded && (
          <>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Titles, Pokémon, types..."
              className="bg-transparent text-white text-sm placeholder-gray-400 focus:outline-none w-full ml-2 pr-2"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-gray-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            )}
          </>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isExpanded && query.trim().length > 0 && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-pokeflix-red border-t-transparent rounded-full animate-spin" />
              <span>Searching Pokédex...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-white/5">
              {results.slice(0, 6).map((poke) => (
                <div
                  key={poke.id}
                  onClick={() => handleSelectPokemon(poke.id)}
                  className="flex items-center gap-3 p-2.5 hover:bg-neutral-800/80 cursor-pointer transition group"
                >
                  <img
                    src={poke.image}
                    alt={poke.displayName || poke.name}
                    className="w-10 h-10 object-contain group-hover:scale-110 transition"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white truncate">
                        {poke.displayName || poke.name}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        #{String(poke.id).padStart(3, '0')}
                      </span>
                    </div>
                    <div className="flex gap-1 mt-0.5">
                      {poke.types?.map((t) => (
                        <TypeBadge key={t} type={t} size="xs" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div
                onClick={handleSubmit}
                className="p-2.5 text-center text-xs font-bold text-red-400 hover:bg-neutral-800 cursor-pointer transition"
              >
                See all results for "{query}" &rarr;
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-gray-400">
              No Pokémon found matching "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
