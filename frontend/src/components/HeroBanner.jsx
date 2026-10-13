import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TypeBadge, { getTypeColor } from './TypeBadge';
import { useWatchlist } from '../hooks/useWatchlist';
import { fetchPokemonByIdOrName } from '../hooks/usePokemon';

// Featured Legendary & Iconic Pokémon IDs
const FEATURED_IDS = [6, 150, 249, 384, 487, 493, 94, 448];

const FEATURED_TAGLINES = {
  6: 'Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.',
  150: 'It was created by a scientist after years of horrific gene splicing and DNA engineering experiments.',
  249: 'It sleeps in deep ocean trenches. If it flaps its wings, it is said to cause a 40-day storm.',
  384: 'It lives in the ozone layer far above the clouds and cannot be seen from the surface of the ground.',
  487: 'Banished to the Distortion World for its violence, it silently gazes upon our world from the shadows.',
  493: 'According to Sinnoh mythology, it emerged from an egg before the universe was even born.',
  94: 'Should you feel that you have suddenly been hit by a chilling gust of cold air, Gengar is nearby.',
  448: 'It has the ability to feel the auras of all things. It can understand human speech and intent.',
};

const HeroBanner = () => {
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, recordWatch } = useWatchlist();

  const [featuredList, setFeaturedList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all featured pokémon details
  useEffect(() => {
    let isMounted = true;
    const loadFeatured = async () => {
      try {
        const promises = FEATURED_IDS.map((id) => fetchPokemonByIdOrName(id));
        const results = await Promise.all(promises);
        if (isMounted) {
          setFeaturedList(results.filter(Boolean));
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    };
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (featuredList.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredList.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredList.length]);

  const currentPokemon = featuredList[currentIndex];

  if (loading || !currentPokemon) {
    return (
      <div className="relative w-full h-[75vh] md:h-[85vh] bg-neutral-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pokeflix-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const primaryType = currentPokemon.types?.[0] || 'normal';
  const typeColor = getTypeColor(primaryType);
  const inWatchlist = isInWatchlist(currentPokemon.id);
  const tagline = FEATURED_TAGLINES[currentPokemon.id] || 'An extraordinary legendary Pokémon possessing incomprehensible powers.';

  const handleWatchNow = () => {
    recordWatch(currentPokemon);
    if (currentPokemon.cry) {
      setIsPlayingAudio(true);
      const audio = new Audio(currentPokemon.cry);
      audio.volume = 0.7;
      audio.play().catch(() => {});
      audio.onended = () => setIsPlayingAudio(false);
    }
    navigate(`/pokemon/${currentPokemon.id}`);
  };

  const handleToggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(currentPokemon.id);
    } else {
      addToWatchlist(currentPokemon);
    }
  };

  return (
    <div className="relative w-full h-[80vh] sm:h-[85vh] md:h-[90vh] min-h-[580px] max-h-[920px] bg-neutral-950 overflow-hidden select-none">
      {/* Background Ambient Glow */}
      <div
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-25 transition-all duration-1000"
        style={{ backgroundColor: typeColor }}
      />

      {/* Hero Pokémon Artwork (Right positioned with scale) */}
      <div className="absolute right-0 sm:right-6 md:right-16 top-1/2 -translate-y-1/2 w-full sm:w-[60%] md:w-[50%] h-[70%] sm:h-[80%] flex items-center justify-center pointer-events-none z-10">
        <img
          key={currentPokemon.id}
          src={currentPokemon.image}
          alt={currentPokemon.displayName || currentPokemon.name}
          className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] animate-fade-in transition-all duration-700"
        />
      </div>

      {/* Netflix Vignette Overlays */}
      <div className="absolute inset-0 hero-side-gradient z-20 pointer-events-none" />
      <div className="absolute inset-0 hero-vignette z-20 pointer-events-none" />

      {/* Hero Content Section */}
      <div className="relative z-30 h-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex flex-col justify-center">
        <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-5 animate-slide-up">
          {/* Top Tagline */}
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-black tracking-widest uppercase bg-pokeflix-red text-white shadow">
              POKÉFLIX ORIGINAL
            </span>
            <span className="text-xs font-mono font-bold text-gray-400">
              #{String(currentPokemon.id).padStart(4, '0')}
            </span>
          </div>

          {/* Large Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none drop-shadow-md">
            {currentPokemon.displayName || currentPokemon.name}
          </h1>

          {/* Types and Stats Quick Preview */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {currentPokemon.types?.map((type) => (
              <TypeBadge key={type} type={type} size="sm" showIcon />
            ))}
            <span className="text-gray-400 text-xs font-semibold px-2 border-l border-white/20">
              HP: {currentPokemon.stats?.[0]?.value || 100}
            </span>
            <span className="text-gray-400 text-xs font-semibold px-2 border-l border-white/20">
              ATK: {currentPokemon.stats?.[1]?.value || 100}
            </span>
            <span className="text-green-400 text-xs font-bold px-2 border-l border-white/20">
              98% Match
            </span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-gray-300 font-normal line-clamp-3 leading-relaxed drop-shadow">
            {tagline}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            {/* Watch Now Button */}
            <button
              onClick={handleWatchNow}
              className="flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-lg bg-pokeflix-red hover:bg-red-700 text-white font-bold text-sm sm:text-base transition duration-200 shadow-xl hover:shadow-red-600/40 hover:scale-105 active:scale-95"
            >
              <svg
                className={`w-5 h-5 fill-current ${isPlayingAudio ? 'animate-bounce text-yellow-300' : ''}`}
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Watch Now</span>
            </button>

            {/* My List Button */}
            <button
              onClick={handleToggleWatchlist}
              className={`flex items-center gap-2 px-5 sm:px-6 py-3 rounded-lg font-bold text-sm sm:text-base transition duration-200 backdrop-blur-md border hover:scale-105 active:scale-95 ${
                inWatchlist
                  ? 'bg-neutral-800/80 text-green-400 border-green-500/50 hover:bg-neutral-700/80'
                  : 'bg-neutral-800/80 hover:bg-neutral-700 text-white border-white/10 hover:border-white/30'
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
                  <span>My List</span>
                </>
              )}
            </button>

            {/* More Info Button */}
            <button
              onClick={() => navigate(`/pokemon/${currentPokemon.id}`)}
              className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-sm sm:text-base transition backdrop-blur-md hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Dots & Controls at Bottom Right */}
      <div className="absolute bottom-6 right-6 sm:right-12 z-30 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
        {featuredList.map((poke, idx) => (
          <button
            key={poke.id}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === idx
                ? 'w-6 h-2 bg-pokeflix-red'
                : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
            }`}
            title={poke.displayName || poke.name}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
