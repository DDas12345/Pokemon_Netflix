import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';
import StarRating from './StarRating';

const MovieModal = ({ movie, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, recordWatch } = useWatchlist();
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [userRating, setUserRating] = useState(movie?.rating || 4.8);

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

  if (!isOpen || !movie) return null;

  const inWatchlist = isInWatchlist(movie.id);

  const handleToggleWatchlist = () => {
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

  const handlePlayMovie = () => {
    recordWatch({
      id: movie.id,
      name: movie.slug || movie.title,
      displayName: movie.title,
      image: movie.poster,
      types: movie.genres?.slice(0, 2) || ['Movie'],
    });
    setIsPlayingTrailer(true);
  };

  const handleGoToDetailPage = () => {
    onClose();
    navigate(`/movie/${movie.slug || movie.id}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl my-auto bg-neutral-900 border border-neutral-700/60 rounded-2xl shadow-2xl overflow-hidden glass-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 40px rgba(229,9,20,0.25)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition border border-white/20 hover:scale-110"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video Player or Cinematic Banner Area */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {isPlayingTrailer && movie.youtubeTrailerId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${movie.youtubeTrailerId}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {/* Backdrop / Poster Banner */}
              <img
                src={movie.backdrop || movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-black/40 to-black/30" />

              {/* Play Trailer Overlay Button */}
              <button
                onClick={handlePlayMovie}
                className="absolute z-20 flex items-center gap-3 px-6 py-3 rounded-full bg-pokeflix-red/90 hover:bg-red-700 text-white font-bold text-sm sm:text-base shadow-2xl hover:scale-110 transition duration-300"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Watch Official Trailer</span>
              </button>

              {/* Tagline Preview */}
              {movie.tagline && (
                <div className="absolute bottom-4 left-6 right-6 z-10 hidden sm:block">
                  <p className="text-gray-300 text-xs sm:text-sm italic drop-shadow">
                    "{movie.tagline}"
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Header Row: Title, Metadata, Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-pokeflix-red text-white shadow">
                  {typeof movie.movieNumber === 'number' ? `Movie #${movie.movieNumber}` : movie.movieNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-800 text-gray-300 border border-white/10">
                  {movie.era}
                </span>
                <span className="text-green-400 font-bold text-xs">
                  {movie.match}% Match
                </span>
                <span className="text-gray-400 text-xs font-mono">
                  {movie.year} &bull; {movie.duration}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {movie.title}
              </h2>
              {movie.japaneseTitle && (
                <p className="text-xs text-gray-400 font-normal">
                  {movie.japaneseTitle}
                </p>
              )}
            </div>

            {/* Watchlist and Full Page Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
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

              <button
                onClick={handleGoToDetailPage}
                className="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs sm:text-sm font-bold border border-white/10 transition hover:scale-105"
              >
                Full Movie Page &rarr;
              </button>
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            {movie.synopsis}
          </p>

          {/* Featured Legendary / Iconic Pokémon */}
          {movie.featuredPokemon && movie.featuredPokemon.length > 0 && (
            <div className="bg-neutral-950/70 p-4 rounded-xl border border-white/5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Key Legendary & Featured Pokémon
              </h4>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {movie.featuredPokemon.map((poke) => (
                  <Link
                    key={poke.id}
                    to={`/pokemon/${poke.id}`}
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 hover:border-red-500/50 transition group"
                  >
                    <img
                      src={poke.image}
                      alt={poke.name}
                      className="w-7 h-7 object-contain group-hover:scale-110 transition"
                    />
                    <span className="text-xs font-bold text-gray-200 group-hover:text-white">
                      {poke.name}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      #{String(poke.id).padStart(3, '0')}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Footer: Director, Genres, Rating */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-neutral-800 text-xs text-gray-400">
            <div>
              <span className="text-gray-500">Directed by: </span>
              <span className="text-white font-medium">{movie.director}</span>
              {movie.boxOffice && (
                <span className="ml-3 text-gray-500">
                  Box Office: <span className="text-gray-300">{movie.boxOffice}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <StarRating
                rating={userRating}
                interactive={true}
                size="sm"
                onRate={(newRating) => setUserRating(newRating)}
              />
              <span className="text-gray-300 font-bold">{userRating} / 5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
