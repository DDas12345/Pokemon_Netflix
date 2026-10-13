import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMovieById, POKEMON_MOVIES } from '../data/pokemonMovies';
import { useWatchlist } from '../hooks/useWatchlist';
import StarRating from '../components/StarRating';
import MovieRow from '../components/MovieRow';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, recordWatch } = useWatchlist();

  const [movie, setMovie] = useState(null);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(true);
  const [userRating, setUserRating] = useState(4.8);

  // Find movie by id or slug
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const found = getMovieById(id);
    if (found) {
      setMovie(found);
      setUserRating(found.rating);
      recordWatch({
        id: found.id,
        name: found.slug || found.title,
        displayName: found.title,
        image: found.poster,
        types: found.genres?.slice(0, 2) || ['Movie'],
      });
    }
  }, [id]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-pokeflix-dark pt-32 px-6 text-center flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-bold mb-4">Movie Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          Could not locate the requested Pokémon movie. Please check the URL or browse our movie catalog.
        </p>
        <button
          onClick={() => navigate('/movies')}
          className="px-6 py-2.5 bg-pokeflix-red text-white font-bold rounded-lg hover:bg-red-700 transition"
        >
          View All Movies
        </button>
      </div>
    );
  }

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

  // Other movies from the same era or surrounding era
  const relatedMovies = POKEMON_MOVIES.filter(
    (m) => m.id !== movie.id && (m.era === movie.era || Math.abs(m.year - movie.year) <= 3)
  ).slice(0, 8);

  return (
    <div className="min-h-screen bg-pokeflix-dark pb-28 text-white select-none">
      {/* Cinematic Theater Area */}
      <div className="relative w-full pt-16 sm:pt-20 bg-black">
        <div className="max-w-6xl mx-auto px-2 sm:px-6 md:px-8 py-4 sm:py-6">
          <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-950">
            {isPlayingTrailer && movie.youtubeTrailerId ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${movie.youtubeTrailerId}?autoplay=1&rel=0&modestbranding=1`}
                title={`${movie.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={movie.backdrop || movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover filter brightness-75"
                />
                <button
                  onClick={() => setIsPlayingTrailer(true)}
                  className="absolute z-20 flex items-center gap-3 px-8 py-4 rounded-full bg-pokeflix-red hover:bg-red-700 text-white font-bold text-base shadow-2xl hover:scale-105 transition"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Play Trailer</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Movie Details Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Poster Thumbnail */}
          <div className="hidden md:block w-56 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Right Details */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded text-xs font-black uppercase tracking-wider bg-pokeflix-red text-white shadow">
                {typeof movie.movieNumber === 'number' ? `Movie #${movie.movieNumber}` : movie.movieNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-neutral-800 text-gray-300 border border-white/10">
                {movie.era}
              </span>
              <span className="text-green-400 font-bold text-sm">
                {movie.match}% Match
              </span>
              <span className="text-gray-400 text-sm font-mono">
                {movie.year} &bull; {movie.duration}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {movie.title}
            </h1>

            {movie.japaneseTitle && (
              <p className="text-sm text-gray-400">
                Japanese Title: <span className="text-gray-300">{movie.japaneseTitle}</span>
              </p>
            )}

            {/* Tagline */}
            {movie.tagline && (
              <p className="text-base text-gray-300 italic">
                "{movie.tagline}"
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsPlayingTrailer(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-pokeflix-red hover:bg-red-700 text-white font-bold text-sm sm:text-base transition hover:scale-105 active:scale-95 shadow-lg"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Play Now</span>
              </button>

              <button
                onClick={handleToggleWatchlist}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm sm:text-base transition border hover:scale-105 active:scale-95 ${
                  inWatchlist
                    ? 'bg-neutral-800 text-green-400 border-green-500/50'
                    : 'bg-neutral-800/80 hover:bg-neutral-700 text-white border-white/20'
                }`}
              >
                {inWatchlist ? (
                  <>
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>In My List</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add to My List</span>
                  </>
                )}
              </button>

              <button
                onClick={() => navigate('/movies')}
                className="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold border border-white/10 transition"
              >
                &larr; Back to Movies
              </button>
            </div>

            {/* Synopsis */}
            <div className="pt-4 border-t border-neutral-800">
              <h3 className="text-lg font-bold text-white mb-2">Storyline</h3>
              <p className="text-base text-gray-300 leading-relaxed max-w-3xl">
                {movie.synopsis}
              </p>
            </div>

            {/* Key Information Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-neutral-900 border border-white/5">
                <span className="text-gray-500 uppercase font-bold block mb-1">Director</span>
                <span className="text-white font-medium">{movie.director}</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900 border border-white/5">
                <span className="text-gray-500 uppercase font-bold block mb-1">Release Date</span>
                <span className="text-white font-medium">{movie.releaseDate}</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900 border border-white/5">
                <span className="text-gray-500 uppercase font-bold block mb-1">Box Office</span>
                <span className="text-green-400 font-bold">{movie.boxOffice || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900 border border-white/5">
                <span className="text-gray-500 uppercase font-bold block mb-1">Trainer Rating</span>
                <div className="flex items-center gap-1.5">
                  <StarRating
                    rating={userRating}
                    interactive={true}
                    size="sm"
                    onRate={(r) => setUserRating(r)}
                  />
                  <span className="text-yellow-400 font-bold">{userRating}</span>
                </div>
              </div>
            </div>

            {/* Featured Legendary Pokémon with Pokédex Links */}
            {movie.featuredPokemon && movie.featuredPokemon.length > 0 && (
              <div className="pt-4">
                <h3 className="text-base font-bold text-white mb-3">
                  Featured Pokémon in this Film
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {movie.featuredPokemon.map((poke) => (
                    <Link
                      key={poke.id}
                      to={`/pokemon/${poke.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/5 hover:border-red-500/50 transition duration-200 group"
                    >
                      <div className="w-12 h-12 flex items-center justify-center bg-neutral-800/80 rounded-lg p-1 group-hover:scale-110 transition">
                        <img
                          src={poke.image}
                          alt={poke.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition">
                          {poke.name}
                        </h4>
                        <span className="text-[11px] font-mono text-gray-500">
                          #{String(poke.id).padStart(3, '0')}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Movies Row */}
        {relatedMovies.length > 0 && (
          <div className="mt-16 pt-8 border-t border-neutral-800">
            <MovieRow
              title={`More From the ${movie.era} Era`}
              movies={relatedMovies}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
