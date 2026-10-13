import React from 'react';
import HeroBanner from '../components/HeroBanner';
import PokemonRow from '../components/PokemonRow';
import { usePokemonByType, usePokemonByIds } from '../hooks/usePokemon';
import { useWatchlist } from '../hooks/useWatchlist';
import ALL_POKEMON_MOVIES from '../data/pokemonMovies';

// Featured Legendaries IDs
const LEGENDARY_IDS = [150, 249, 250, 384, 483, 484, 487, 643, 644, 646, 716, 717, 888, 889];

// Latest Generation Pokémon IDs (Gen 9 Paldea)
const RECENT_IDS = [908, 911, 914, 959, 979, 980, 1005, 1006, 1007, 1008];

const HomePage = () => {
  const { watchlist, watchHistory } = useWatchlist();

  // Fetch rows
  const { pokemonList: legendaries, loading: legendariesLoading } = usePokemonByIds(LEGENDARY_IDS);
  const { pokemonList: recentPokemon, loading: recentLoading } = usePokemonByIds(RECENT_IDS);
  const { pokemonList: fireList, loading: fireLoading } = usePokemonByType('fire', 18);
  const { pokemonList: waterList, loading: waterLoading } = usePokemonByType('water', 18);
  const { pokemonList: psychicList, loading: psychicLoading } = usePokemonByType('psychic', 18);
  const { pokemonList: dragonList, loading: dragonLoading } = usePokemonByType('dragon', 18);

  return (
    <div className="min-h-screen bg-pokeflix-dark pb-20 overflow-x-hidden">
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Row Containers */}
      <div className="-mt-16 sm:-mt-24 md:-mt-32 relative z-30 space-y-4">
        {/* Complete Pokémon Movie Library */}
        <PokemonRow
          title="Pokémon Movies"
          pokemonList={ALL_POKEMON_MOVIES}
        />

        {/* Continue Watching (if any history) */}
        {watchHistory && watchHistory.length > 0 && (
          <PokemonRow
            title="Continue Watching"
            pokemonList={watchHistory}
          />
        )}

        {/* Featured Legendaries Row */}
        <PokemonRow
          title="Featured Legendaries"
          pokemonList={legendaries}
          loading={legendariesLoading}
        />

        {/* User Watchlist Row (if any) */}
        {watchlist && watchlist.length > 0 && (
          <PokemonRow
            title="My List"
            pokemonList={watchlist}
          />
        )}

        {/* Fire Type Row */}
        <PokemonRow
          title="Fire Type Originals"
          pokemonList={fireList}
          loading={fireLoading}
        />

        {/* Dragon Type Row */}
        <PokemonRow
          title="Mythical Dragons"
          pokemonList={dragonList}
          loading={dragonLoading}
        />

        {/* Water Type Row */}
        <PokemonRow
          title="Deep Water Adventures"
          pokemonList={waterList}
          loading={waterLoading}
        />

        {/* Psychic Type Row */}
        <PokemonRow
          title="Mind-Bending Psychic"
          pokemonList={psychicList}
          loading={psychicLoading}
        />

        {/* Recently Discovered (Paldea Gen 9) */}
        <PokemonRow
          title="Recently Added (Paldean Discoveries)"
          pokemonList={recentPokemon}
          loading={recentLoading}
        />
      </div>
    </div>
  );
};

export default HomePage;
