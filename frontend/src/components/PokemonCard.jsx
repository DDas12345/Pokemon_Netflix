import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TypeBadge, { getTypeColor } from './TypeBadge';
import { useWatchlist } from '../hooks/useWatchlist';
import PokemonModal from './PokemonModal';
import { CardSkeleton } from './LoadingSkeleton';

const PokemonCard = ({ pokemon, loading = false, progress = null }) => {
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, recordWatch } = useWatchlist();
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const hoverTimerRef = useRef(null);

  if (loading || !pokemon) {
    return <CardSkeleton />;
  }

  const inWatchlist = isInWatchlist(pokemon.id);
  const primaryType = pokemon.types?.[0] || 'normal';
  const typeColor = getTypeColor(primaryType);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
  };

  const handleCardClick = () => {
    recordWatch(pokemon);
    navigate(`/pokemon/${pokemon.id}`);
  };

  const handleToggleWatchlist = (e) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(pokemon.id);
    } else {
      addToWatchlist(pokemon);
    }
  };

  const handleOpenModal = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleTrailer = (e) => {
    e.stopPropagation();
    if (pokemon.trailerUrl) {
      window.open(pokemon.trailerUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    handleOpenModal(e);
  };

  const handleMoviePlay = (e) => {
    e.stopPropagation();
    if (pokemon.movieUrl) {
      window.open(pokemon.movieUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    handleCardClick();
  };

  return (
    <>
      <div
        className="group relative flex-none w-44 sm:w-48 md:w-56 h-64 sm:h-72 md:h-80 cursor-pointer rounded-xl bg-neutral-900 border border-neutral-800 transition-all duration-300 ease-out hover:scale-105 hover:z-30 hover:shadow-2xl overflow-hidden select-none"
        style={{
          borderBottom: `3px solid ${typeColor}`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        {/* Glow halo on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition duration-300 pointer-events-none rounded-xl"
          style={{ backgroundColor: typeColor }}
        />

        {/* Pokemon ID Number Top Corner */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2 py-0.5 text-[10px] sm:text-xs font-mono font-bold text-gray-400 bg-black/60 rounded backdrop-blur-sm border border-white/5">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
        </div>

        {/* Watchlist Quick Button Top Right */}
        <button
          onClick={handleToggleWatchlist}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border ${
            inWatchlist
              ? 'bg-green-600/90 text-white border-green-400 shadow-md scale-100'
              : 'bg-black/60 text-gray-300 border-white/10 hover:border-white hover:text-white hover:scale-110 opacity-0 group-hover:opacity-100'
          }`}
          title={inWatchlist ? 'In My List' : 'Add to My List'}
        >
          {inWatchlist ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>

        {/* Center Artwork */}
        <div className="relative w-full h-[65%] flex items-center justify-center p-4">
          <img
            src={pokemon.poster || pokemon.image}
            alt={pokemon.displayName || pokemon.name}
            loading="lazy"
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transform group-hover:scale-110 transition duration-300 ease-out"
          />
        </div>

        {/* Continue Watching Progress Bar (if provided) */}
        {progress !== null && (
          <div className="absolute bottom-20 left-0 right-0 h-1 bg-neutral-800">
            <div
              className="h-full bg-pokeflix-red"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Bottom Details Section */}
        <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black via-neutral-900/90 to-transparent flex flex-col justify-end">
          <h3 className="font-bold text-white text-sm sm:text-base tracking-wide truncate group-hover:text-red-400 transition-colors">
            {pokemon.displayName || pokemon.name}
          </h3>

          {/* Types Row */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {pokemon.types?.map((t) => (
              <TypeBadge key={t} type={t} size="xs" />
            ))}
          </div>

          {/* Hover Action Bar */}
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleTrailer}
              className="flex items-center gap-1 flex-1 text-[11px] font-semibold text-white bg-pokeflix-red hover:bg-red-700 px-2.5 py-1 rounded transition shadow-sm hover:scale-105"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Trailer</span>
            </button>

            <button
              onClick={handleMoviePlay}
              className="flex items-center gap-1 flex-1 text-[11px] font-semibold text-gray-100 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded transition border border-white/10"
              title="Play Movie"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zm3 4v6l6-3-6-3z" />
              </svg>
              <span>Movie</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <PokemonModal
        pokemon={pokemon}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default PokemonCard;
