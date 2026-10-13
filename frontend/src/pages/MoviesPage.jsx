import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { POKEMON_MOVIES, MOVIE_ERAS } from '../data/pokemonMovies';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import { useWatchlist } from '../hooks/useWatchlist';

const MoviesPage = () => {
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, recordWatch } = useWatchlist();

  const [selectedEra, setSelectedEra] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('chrono'); // 'chrono' | 'newest' | 'oldest' | 'rating'
  const [featuredModalMovie, setFeaturedModalMovie] = useState(null);

  // Featured Hero Movie (Default: Movie 1 Mewtwo Strikes Back or Secrets of the Jungle)
  const heroMovie = POKEMON_MOVIES[0];
  const inWatchlistHero = isInWatchlist(heroMovie.id);

  // Filtered and Sorted Movies
  const filteredMovies = useMemo(() => {
    let list = [...POKEMON_MOVIES];

    // Era filter
    if (selectedEra !== 'All') {
      list = list.filter((m) => {
        if (selectedEra === 'Live-Action') {
          return m.era === 'Live-Action' || typeof m.movieNumber === 'string';
        }
        return m.era.toLowerCase().includes(selectedEra.toLowerCase());
      });
    }

    // Search query filter (matches title, synopsis, or featured pokemon)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.shortTitle?.toLowerCase().includes(q) ||
          m.synopsis.toLowerCase().includes(q) ||
          String(m.year).includes(q) ||
          m.featuredPokemon?.some((p) => p.name.toLowerCase().includes(q))
      );
    }

    // Sort order
    if (sortBy === 'chrono') {
      list.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => a.year - b.year);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedEra, searchQuery, sortBy]);

  const handleHeroWatch = () => {
    recordWatch({
      id: heroMovie.id,
      name: heroMovie.slug || heroMovie.title,
      displayName: heroMovie.title,
      image: heroMovie.poster,
      types: heroMovie.genres?.slice(0, 2) || ['Movie'],
    });
    setFeaturedModalMovie(heroMovie);
  };

  const handleToggleHeroWatchlist = () => {
    if (inWatchlistHero) {
      removeFromWatchlist(heroMovie.id);
    } else {
      addToWatchlist({
        id: heroMovie.id,
        name: heroMovie.slug || heroMovie.title,
        displayName: heroMovie.title,
        image: heroMovie.poster,
        types: heroMovie.genres?.slice(0, 2) || ['Movie'],
      });
    }
  };

  return (
    <div className="min-h-screen bg-pokeflix-dark pb-28 text-white select-none">
      {/* Hero Showcase Banner */}
      <div className="relative w-full h-[65vh] sm:h-[75vh] min-h-[500px] max-h-[750px] bg-neutral-950 overflow-hidden">
        {/* Cinematic Backdrop Image */}
        <img
          src={heroMovie.backdrop || heroMovie.poster}
          alt={heroMovie.title}
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45] scale-105"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
        <div className="absolute inset-0 hero-vignette z-10" />

        {/* Hero Content */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex flex-col justify-center">
          <div className="max-w-2xl space-y-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-black tracking-widest uppercase bg-pokeflix-red text-white shadow">
                POKÉMON CINEMATIC UNIVERSE
              </span>
              <span className="text-xs font-mono font-bold text-gray-300">
                All 24 Movies + Specials
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg">
              {heroMovie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-gray-300">
              <span className="text-green-400 font-bold">99% Match</span>
              <span>&bull;</span>
              <span>{heroMovie.year}</span>
              <span>&bull;</span>
              <span>{heroMovie.duration}</span>
              <span>&bull;</span>
              <span className="text-yellow-400 font-bold">★ {heroMovie.rating} / 5</span>
              <span>&bull;</span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-gray-200 text-xs">
                {heroMovie.era}
              </span>
            </div>

            <p className="text-sm sm:text-base text-gray-300 line-clamp-3 leading-relaxed drop-shadow max-w-xl">
              {heroMovie.synopsis}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleHeroWatch}
                className="flex items-center gap-2.5 px-7 py-3 rounded-lg bg-pokeflix-red hover:bg-red-700 text-white font-bold text-sm sm:text-base transition duration-200 shadow-xl hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Watch Trailer</span>
              </button>

              <button
                onClick={handleToggleHeroWatchlist}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm sm:text-base transition duration-200 border backdrop-blur-md hover:scale-105 active:scale-95 ${
                  inWatchlistHero
                    ? 'bg-neutral-800 text-green-400 border-green-500/50'
                    : 'bg-neutral-800/80 hover:bg-neutral-700 text-white border-white/20'
                }`}
              >
                {inWatchlistHero ? (
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
                onClick={() => navigate(`/movie/${heroMovie.slug || heroMovie.id}`)}
                className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-sm sm:text-base transition backdrop-blur-md hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Full Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Browse Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pt-10">
        {/* Section Heading & Quick Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>All Pokémon Movies</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-neutral-800 text-pokeflix-red border border-white/10">
                {POKEMON_MOVIES.length} Films
              </span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Every Pokémon theatrical movie and feature special from 1998 to present day.
            </p>
          </div>

          {/* Quick Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search within movies */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies or Pokémon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 sm:w-64 px-3.5 py-2 pl-9 rounded-lg bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
              />
              <svg
                className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="chrono">Chronological Order</option>
              <option value="newest">Release Year (Newest)</option>
              <option value="oldest">Release Year (Oldest)</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Era Filter Carousel / Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-4 my-2">
          {MOVIE_ERAS.map((era) => {
            const isSelected = selectedEra === era;
            return (
              <button
                key={era}
                onClick={() => setSelectedEra(era)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border flex-shrink-0 ${
                  isSelected
                    ? 'bg-pokeflix-red text-white border-pokeflix-red shadow-lg scale-105'
                    : 'bg-neutral-900/90 text-gray-300 hover:text-white border-white/10 hover:border-white/30'
                }`}
              >
                {era}
              </button>
            );
          })}
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="text-xl font-bold text-white mb-2">No Pokémon Movies Found</p>
            <p className="text-sm">Try clearing your search query or choosing another era filter.</p>
            <button
              onClick={() => {
                setSelectedEra('All');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-lg bg-pokeflix-red text-white text-xs font-bold hover:bg-red-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mt-6 animate-fade-in">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onPlayTrailer={(m) => setFeaturedModalMovie(m)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Featured Modal */}
      {featuredModalMovie && (
        <MovieModal
          movie={featuredModalMovie}
          isOpen={Boolean(featuredModalMovie)}
          onClose={() => setFeaturedModalMovie(null)}
        />
      )}
    </div>
  );
};

export default MoviesPage;
