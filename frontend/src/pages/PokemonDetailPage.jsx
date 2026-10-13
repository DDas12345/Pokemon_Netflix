import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePokemonDetail, usePokemonByType } from '../hooks/usePokemon';
import { useWatchlist } from '../hooks/useWatchlist';
import TypeBadge, { getTypeColor } from '../components/TypeBadge';
import StatBar from '../components/StatBar';
import StarRating from '../components/StarRating';
import PokemonRow from '../components/PokemonRow';
import { HeroSkeleton } from '../components/LoadingSkeleton';

const PokemonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pokemon, species, evolutionChain, loading, error } = usePokemonDetail(id);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, recordWatch } = useWatchlist();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [userRating, setUserRating] = useState(4.8);
  const [selectedTab, setSelectedTab] = useState('episodes'); // 'episodes' | 'stats' | 'evolution'

  // Similar Pokémon by primary type
  const primaryType = pokemon?.types?.[0] || 'normal';
  const { pokemonList: similarList, loading: similarLoading } = usePokemonByType(primaryType, 15);
  const filteredSimilar = similarList.filter((p) => Number(p.id) !== Number(pokemon?.id));

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pokeflix-dark pt-20">
        <HeroSkeleton />
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-pokeflix-dark pt-32 px-6 text-center flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-white mb-4">Pokémon Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          {error || "It seems this Pokémon hasn't been discovered in our regional database yet."}
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-pokeflix-red text-white font-bold rounded-lg hover:bg-red-700 transition"
        >
          Return to Browse
        </button>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(pokemon.id);
  const typeColor = getTypeColor(primaryType);

  const handlePlayCry = () => {
    recordWatch(pokemon);
    if (pokemon.cry) {
      setIsPlayingAudio(true);
      const audio = new Audio(pokemon.cry);
      audio.volume = 0.7;
      audio.play().catch(() => {});
      audio.onended = () => setIsPlayingAudio(false);
    }
  };

  const handleToggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(pokemon.id);
    } else {
      addToWatchlist(pokemon);
    }
  };

  return (
    <div className="min-h-screen bg-pokeflix-dark pb-24 overflow-x-hidden text-white">
      {/* Hero Section */}
      <div className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden">
        {/* Ambient Type Glow */}
        <div
          className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 pointer-events-none"
          style={{ backgroundColor: typeColor }}
        />

        {/* Backdrop Gradients */}
        <div className="absolute inset-0 hero-side-gradient z-10 pointer-events-none" />
        <div className="absolute inset-0 hero-vignette z-10 pointer-events-none" />

        {/* Giant Artwork */}
        <div className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 w-full md:w-[48%] h-[65%] md:h-[80%] flex items-center justify-center pointer-events-none z-10">
          <img
            src={pokemon.image}
            alt={pokemon.displayName || pokemon.name}
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] animate-fade-in"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-24 md:py-32 w-full">
          <div className="max-w-2xl space-y-5 animate-slide-up">
            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-black tracking-widest uppercase bg-pokeflix-red text-white shadow">
                POKÉFLIX SERIES
              </span>
              <span className="text-sm font-mono font-bold text-gray-400">
                #{String(pokemon.id).padStart(4, '0')}
              </span>
              <span className="text-gray-400 text-sm font-semibold">
                {species?.genus || 'Pokémon'}
              </span>
              <span className="text-green-400 text-sm font-bold">
                99% Match
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none drop-shadow-lg">
              {pokemon.displayName || pokemon.name}
            </h1>

            {/* Types Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {pokemon.types?.map((type) => (
                <TypeBadge key={type} type={type} size="md" showIcon />
              ))}
              <span className="text-gray-400 text-xs font-mono ml-2 border-l border-white/20 pl-3">
                {species?.generation || 'Gen I'}
              </span>
            </div>

            {/* Pokédex Flavor Text Description */}
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed drop-shadow max-w-xl">
              {species?.flavorText || 'A remarkable creature studied extensively across the Pokémon regions.'}
            </p>

            {/* Ratings & Interactive Stars */}
            <div className="flex items-center gap-4 py-1">
              <StarRating
                rating={userRating}
                interactive={true}
                size="md"
                onRate={(newRating) => setUserRating(newRating)}
              />
              <span className="text-xs text-gray-400">
                (Trainer Rating &bull; Tap stars to rate)
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={handlePlayCry}
                className="flex items-center gap-2.5 px-7 py-3 rounded-lg bg-pokeflix-red hover:bg-red-700 text-white font-bold text-base transition shadow-xl hover:shadow-red-700/50 hover:scale-105 active:scale-95"
              >
                <svg
                  className={`w-5 h-5 fill-current ${isPlayingAudio ? 'animate-bounce text-yellow-300' : ''}`}
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>{isPlayingAudio ? 'Playing Pokémon Cry...' : 'Watch (Play Cry)'}</span>
              </button>

              <button
                onClick={handleToggleWatchlist}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-base transition border backdrop-blur-md hover:scale-105 active:scale-95 ${
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Detail Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 mt-6">
        <div className="flex border-b border-neutral-800 gap-8">
          <button
            onClick={() => setSelectedTab('episodes')}
            className={`pb-3 text-base sm:text-lg font-bold transition relative ${
              selectedTab === 'episodes'
                ? 'text-white border-b-2 border-pokeflix-red'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Moves as Episodes ({pokemon.moves?.length || 0})
          </button>
          <button
            onClick={() => setSelectedTab('stats')}
            className={`pb-3 text-base sm:text-lg font-bold transition relative ${
              selectedTab === 'stats'
                ? 'text-white border-b-2 border-pokeflix-red'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Base Stats & Abilities
          </button>
          <button
            onClick={() => setSelectedTab('evolution')}
            className={`pb-3 text-base sm:text-lg font-bold transition relative ${
              selectedTab === 'evolution'
                ? 'text-white border-b-2 border-pokeflix-red'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Evolution Chain
          </button>
        </div>

        {/* Tab 1: Moves Styled as Netflix Episodes */}
        {selectedTab === 'episodes' && (
          <div className="py-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Season 1: Signature Battle Techniques</h3>
              <span className="text-xs text-gray-400 font-mono">Showing Top 20 Moves</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pokemon.moves?.slice(0, 20).map((move, index) => (
                <div
                  key={move.name}
                  className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/80 hover:bg-neutral-800/80 border border-white/5 transition group"
                >
                  <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center font-mono font-bold text-gray-400 text-sm group-hover:bg-pokeflix-red group-hover:text-white transition">
                    EP {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-base group-hover:text-red-400 transition">
                        {move.name}
                      </h4>
                      <span className="text-xs font-mono text-gray-400">
                        {Math.floor(Math.random() * 20) + 10} PP
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      Powerful battle maneuver learned through natural leveling and combat training.
                    </p>
                  </div>
                  <button
                    onClick={handlePlayCry}
                    className="w-8 h-8 rounded-full bg-neutral-800 group-hover:bg-pokeflix-red flex items-center justify-center text-gray-300 group-hover:text-white transition"
                    title="Play Move"
                  >
                    <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Base Stats & Abilities */}
        {selectedTab === 'stats' && (
          <div className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            {/* Base Stats */}
            <div className="bg-neutral-900/60 p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-xl font-bold text-white mb-2">Combat Power & Base Stats</h3>
              <div className="space-y-3">
                {pokemon.stats?.map((stat) => (
                  <StatBar key={stat.name} name={stat.name} value={stat.value} />
                ))}
              </div>
              <div className="pt-2 text-xs text-gray-400 flex justify-between border-t border-neutral-800">
                <span>Base Stat Total (BST)</span>
                <span className="font-mono font-bold text-white">
                  {pokemon.stats?.reduce((acc, s) => acc + s.value, 0)}
                </span>
              </div>
            </div>

            {/* Abilities & Physical Traits */}
            <div className="space-y-6">
              <div className="bg-neutral-900/60 p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">Abilities</h3>
                <div className="space-y-3">
                  {pokemon.abilities?.map((ability) => (
                    <div
                      key={ability.name}
                      className="p-3 bg-neutral-800/60 rounded-xl border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-white text-sm block">
                          {ability.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {ability.is_hidden ? 'Hidden Ability' : 'Standard Ability'}
                        </span>
                      </div>
                      {ability.is_hidden && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-500/40">
                          Hidden
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Physical Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/5 text-center">
                  <span className="text-xs text-gray-400 uppercase font-semibold">Height</span>
                  <p className="text-lg font-bold text-white font-mono mt-1">{pokemon.height} m</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/5 text-center">
                  <span className="text-xs text-gray-400 uppercase font-semibold">Weight</span>
                  <p className="text-lg font-bold text-white font-mono mt-1">{pokemon.weight} kg</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/5 text-center col-span-2 sm:col-span-1">
                  <span className="text-xs text-gray-400 uppercase font-semibold">Capture Rate</span>
                  <p className="text-lg font-bold text-green-400 font-mono mt-1">{species?.captureRate || 45}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Evolution Chain */}
        {selectedTab === 'evolution' && (
          <div className="py-8 animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6">Evolutionary Line</h3>
            {evolutionChain && evolutionChain.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-6">
                {evolutionChain.map((evo, idx) => (
                  <React.Fragment key={evo.id}>
                    {/* Arrow between stages */}
                    {idx > 0 && (
                      <div className="flex flex-col items-center text-gray-400">
                        <svg className="w-8 h-8 text-pokeflix-red animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        <span className="text-[11px] font-mono text-gray-400 mt-1">
                          {evo.minLevel ? `Lvl ${evo.minLevel}` : evo.item ? evo.item : evo.trigger}
                        </span>
                      </div>
                    )}

                    {/* Stage Card */}
                    <Link
                      to={`/pokemon/${evo.id}`}
                      className={`flex flex-col items-center p-6 rounded-2xl transition duration-300 transform hover:scale-105 border ${
                        Number(evo.id) === Number(pokemon.id)
                          ? 'bg-neutral-800/90 border-pokeflix-red shadow-lg shadow-red-900/20'
                          : 'bg-neutral-900/80 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center mb-3">
                        <img
                          src={evo.image}
                          alt={evo.displayName}
                          className="max-h-full max-w-full object-contain filter drop-shadow-md"
                        />
                      </div>
                      <span className="text-xs font-mono text-gray-400">
                        #{String(evo.id).padStart(3, '0')}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">
                        {evo.displayName}
                      </h4>
                      {Number(evo.id) === Number(pokemon.id) && (
                        <span className="mt-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-pokeflix-red text-white">
                          Currently Viewing
                        </span>
                      )}
                    </Link>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic text-center py-8">
                This Pokémon does not evolve or its evolution lineage is singular.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Similar Pokémon Row */}
      {filteredSimilar.length > 0 && (
        <div className="mt-8">
          <PokemonRow
            title={`More Like This (${pokemon.displayName} • ${primaryType.toUpperCase()})`}
            pokemonList={filteredSimilar}
            loading={similarLoading}
          />
        </div>
      )}
    </div>
  );
};

export default PokemonDetailPage;
