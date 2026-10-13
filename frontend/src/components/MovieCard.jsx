import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';
import MovieModal from './MovieModal';

const MovieCard = ({ movie, onPlayTrailer = null }) => {
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, recordWatch } = useWatchlist();
  const [showModal, setShowModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!movie) return null;

  // Normalized movie item for watchlist
  const inWatchlist = isInWatchlist(movie.id);

  const handleCardClick = () => {
    recordWatch({
      id: movie.id,
      name: movie.slug || movie.title,
      displayName: movie.title,
      image: movie.poster,
      types: movie.genres?.slice(0, 2) || ['Movie'],
    });
    navigate(`/movie/${movie.slug || movie.id}`);
  };

  const handleToggleWatchlist = (e) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist({
        id: movie.id,
        name: movie.slug || movie.title,
        displayName: movie.title,
        image: movie.poster,
        types: movie.genres?.slice(0, 2) || ['Movie'],
      });
    }
  };

  const handleQuickPlay = (e) => {
    e.stopPropagation();
    recordWatch({
      id: movie.id,
      name: movie.slug || movie.title,
      displayName: movie.title,
      image: movie.poster,
      types: movie.genres?.slice(0, 2) || ['Movie'],
    });
    if (onPlayTrailer) {
      onPlayTrailer(movie);
    } else {
      setShowModal(true);
    }
  };

  const handleOpenInfo = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative flex-none w-44 sm:w-52 md:w-60 h-64 sm:h-76 md:h-84 cursor-pointer rounded-xl bg-neutral-900 border border-neutral-800 transition-all duration-300 ease-out hover:scale-105 hover:z-30 hover:shadow-2xl overflow-hidden select-none"
        style={{
          borderBottom: '3px solid #E50914',
        }}
      >
        {/* Glow halo on hover */}
        <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none rounded-xl" />

        {/* Movie Number & Year Badge Top Left */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
          <span className="px-2 py-0.5 text-[10px] sm:text-xs font-mono font-bold text-white bg-pokeflix-red/90 rounded backdrop-blur-sm shadow">
            {typeof movie.movieNumber === 'number' ? `Movie #${movie.movieNumber}` : movie.movieNumber}
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-mono text-gray-300 bg-black/60 rounded backdrop-blur-sm">
            {movie.year}
          </span>
        </div>

        {/* Watchlist Quick Button Top Right */}
        <button
          onClick={handleToggleWatchlist}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border ${inWatchlist
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

        {/* Center Poster Image */}
        <div className="relative w-full h-[68%] overflow-hidden bg-neutral-950">
          {!imgError ? (
            <img
              src={movie.poster}
              alt={movie.title}
              onError={() => setImgError(true)}
              loading="lazy"
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-neutral-900 to-neutral-800 text-center">
              <span className="text-pokeflix-red font-black text-lg">POKÉFLIX</span>
              <span className="text-white font-bold text-xs mt-1">{movie.shortTitle || movie.title}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />
        </div>

        {/* Bottom Details Section */}
        <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black via-neutral-900/95 to-transparent flex flex-col justify-end">
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-semibold">
            <span className="text-green-400 font-bold">{movie.match}% Match</span>
            <span>&bull;</span>
            <span>{movie.duration}</span>
            <span>&bull;</span>
            <span className="text-xs text-yellow-400 font-bold flex items-center">
              ★ {movie.rating}
            </span>
          </div>

          <h3 className="font-bold text-white text-xs sm:text-sm tracking-wide truncate group-hover:text-red-400 transition-colors mt-1">
            {movie.shortTitle || movie.title}
          </h3>

          <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
            {movie.era}
          </p>

          {/* Hover Action Bar */}
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleQuickPlay}
              className="flex items-center gap-1 text-[11px] font-semibold text-white bg-pokeflix-red hover:bg-red-700 px-2.5 py-1 rounded transition shadow-sm hover:scale-105"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Watch</span>
            </button>

            <button
              onClick={handleOpenInfo}
              className="flex items-center gap-1 text-[11px] font-semibold text-gray-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded transition border border-white/10"
              title="Movie Details"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <MovieModal
        movie={movie}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default MovieCard;
