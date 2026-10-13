import React, { useRef, useState, useEffect } from 'react';
import PokemonCard from './PokemonCard';
import { CardSkeleton } from './LoadingSkeleton';

const PokemonRow = ({ title, pokemonList = [], loading = false, emptyMessage = null }) => {
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [pokemonList]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <div className="relative group/row my-6 md:my-8 px-4 sm:px-8 md:px-12 select-none">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <span>{title}</span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-2 hidden sm:inline">
            Explore All &gt;
          </span>
        </h2>
        {pokemonList.length > 0 && (
          <span className="text-xs font-mono text-gray-400">
            {pokemonList.length} titles
          </span>
        )}
      </div>

      {/* Row Container with Navigation Chevrons */}
      <div className="relative">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-200 backdrop-blur-sm rounded-r hover:scale-105"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 transform -translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          onScroll={checkScroll}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-3 px-1 items-center"
        >
          {loading ? (
            [...Array(6)].map((_, idx) => <CardSkeleton key={idx} />)
          ) : pokemonList.length > 0 ? (
            pokemonList.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                progress={pokemon.progress || null}
              />
            ))
          ) : emptyMessage ? (
            <div className="w-full py-8 text-center text-gray-500 text-sm italic">
              {emptyMessage}
            </div>
          ) : null}
        </div>

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-200 backdrop-blur-sm rounded-l hover:scale-105"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6 transform translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default PokemonRow;
