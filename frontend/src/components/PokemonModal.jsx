import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TypeBadge, { getTypeColor } from './TypeBadge';
import StatBar from './StatBar';
import { useWatchlist } from '../hooks/useWatchlist';

const PokemonModal = ({ pokemon, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, recordWatch } = useWatchlist();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !pokemon) return null;

  const inWatchlist = isInWatchlist(pokemon.id);
  const primaryType = pokemon.types?.[0] || 'normal';
  const typeColor = getTypeColor(primaryType);

  const playCry = () => {
    if (pokemon.cry) {
      setIsPlayingAudio(true);
      const audio = new Audio(pokemon.cry);
      audio.volume = 0.6;
      audio.play().catch(() => {});
      audio.onended = () => setIsPlayingAudio(false);
    }
  };

  const handleWatchNow = () => {
    recordWatch(pokemon);
    playCry();
  };

  const handleToggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(pokemon.id);
    } else {
      addToWatchlist(pokemon);
    }
  };

  const handleMoreInfo = () => {
    onClose();
    navigate(`/pokemon/${pokemon.id}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700/60 rounded-2xl shadow-2xl overflow-hidden glass-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 40px ${typeColor}25`,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition border border-white/20 hover:scale-110"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header / Banner Area */}
        <div className="relative h-64 md:h-72 w-full bg-gradient-to-b from-neutral-800 to-neutral-900 overflow-hidden flex items-center justify-center">
          {/* Subtle glow circle matching type color */}
          <div
            className="absolute w-80 h-80 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: typeColor }}
          />

          {/* Large Artwork */}
          <img
            src={pokemon.image}
            alt={pokemon.displayName || pokemon.name}
            className="relative z-10 max-h-56 md:max-h-64 object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] transform hover:scale-105 transition duration-500"
          />

          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

          {/* Badge ID */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-xs font-mono font-bold text-gray-300 border border-white/10">
              #{String(pokemon.id).padStart(4, '0')}
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                {pokemon.displayName || pokemon.name}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {pokemon.types?.map((type) => (
                  <TypeBadge key={type} type={type} size="sm" showIcon />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleWatchNow}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-pokeflix-red hover:bg-red-700 text-white font-bold text-sm transition shadow-lg hover:shadow-red-900/50 hover:scale-105 active:scale-95"
              >
                <svg
                  className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-yellow-300' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>{isPlayingAudio ? 'Crying...' : 'Watch Cry'}</span>
              </button>

              <button
                onClick={handleToggleWatchlist}
                className={`p-2.5 rounded-lg border text-sm font-semibold transition hover:scale-105 active:scale-95 flex items-center justify-center ${
                  inWatchlist
                    ? 'border-green-500/50 bg-green-950/40 text-green-400 hover:bg-green-900/50'
                    : 'border-white/20 bg-neutral-800/80 text-white hover:bg-neutral-700'
                }`}
                title={inWatchlist ? 'Remove from My List' : 'Add to My List'}
              >
                {inWatchlist ? (
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mini Stats Summary */}
          {pokemon.stats && pokemon.stats.length > 0 && (
            <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Base Stats Overview
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                {pokemon.stats.slice(0, 4).map((s) => (
                  <StatBar key={s.name} name={s.name} value={s.value} />
                ))}
              </div>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-neutral-800/50 border border-white/5">
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Height</span>
              <span className="text-white font-mono font-bold text-sm">{pokemon.height || '1.0'} m</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-800/50 border border-white/5">
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Weight</span>
              <span className="text-white font-mono font-bold text-sm">{pokemon.weight || '30.0'} kg</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-800/50 border border-white/5 col-span-2 sm:col-span-1">
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Status</span>
              <span className="text-green-400 font-bold text-sm">Streaming</span>
            </div>
          </div>

          {/* Detail Link Footer */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleMoreInfo}
              className="flex items-center gap-2 text-sm font-bold text-gray-200 hover:text-white group px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition"
            >
              <span>Full Pokédex Details & Episodes</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition duration-150"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonModal;
