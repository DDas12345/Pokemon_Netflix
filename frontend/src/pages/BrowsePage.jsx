import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePokemonByType } from '../hooks/usePokemon';
import PokemonCard from '../components/PokemonCard';
import { GridSkeleton } from '../components/LoadingSkeleton';
import { TYPE_COLORS, getTypeColor } from '../components/TypeBadge';

const ALL_TYPES = [
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
];

const BrowsePage = () => {
  const { type: urlType } = useParams();
  const navigate = useNavigate();

  const currentType = urlType ? urlType.toLowerCase() : 'fire';
  const [displayCount, setDisplayCount] = useState(24);

  const { pokemonList, loading, error } = usePokemonByType(currentType, displayCount);

  // If URL type changed, reset display count
  useEffect(() => {
    setDisplayCount(24);
  }, [currentType]);

  const handleTypeSelect = (t) => {
    navigate(`/browse/${t}`);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 24);
  };

  const activeColor = getTypeColor(currentType);

  return (
    <div className="min-h-screen bg-pokeflix-dark pt-24 md:pt-32 pb-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto text-white select-none">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight flex items-center gap-3">
          <span>Browse By Type</span>
          <span
            className="text-sm px-3 py-1 rounded-full uppercase tracking-wider font-extrabold text-white"
            style={{
              backgroundColor: activeColor,
              boxShadow: `0 0 15px ${activeColor}60`,
            }}
          >
            {currentType}
          </span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Explore all Pokémon species cataloged in the Pokéflix database under the {currentType} category.
        </p>
      </div>

      {/* Type Filter Pills Carousel / Wrapping Row */}
      <div className="flex gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-3 mb-8">
        {ALL_TYPES.map((t) => {
          const isSelected = t === currentType;
          const color = TYPE_COLORS[t];

          return (
            <button
              key={t}
              onClick={() => handleTypeSelect(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap border flex-shrink-0 ${
                isSelected
                  ? 'text-white scale-105 shadow-lg'
                  : 'text-gray-300 hover:text-white bg-neutral-900/80 border-white/10 hover:border-white/30'
              }`}
              style={{
                backgroundColor: isSelected ? color : undefined,
                borderColor: isSelected ? color : undefined,
                boxShadow: isSelected ? `0 0 12px ${color}80` : undefined,
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Grid of Pokemon */}
      {loading && pokemonList.length === 0 ? (
        <GridSkeleton count={18} />
      ) : error ? (
        <div className="py-16 text-center text-gray-400">
          <p className="text-lg text-red-400 mb-2">Error loading Pokémon for {currentType}</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 animate-fade-in">
            {pokemonList.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-12 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-8 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm transition border border-white/10 hover:border-white/30 shadow-md hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Catching more Pokémon...' : 'Load More Pokémon'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BrowsePage;
