import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

// Memory cache to avoid repeated network calls
const cache = {
  pokemon: new Map(),
  species: new Map(),
  types: new Map(),
  allList: null,
};

// Helper: Get Official Artwork URL
export const getPokemonImageUrl = (id) => {
  if (!id) return '';
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

// Helper: Get Pokemon Cry Audio URL
export const getPokemonCryUrl = (id) => {
  if (!id) return '';
  return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
};

// Helper: Format Pokemon Name
export const formatPokemonName = (name) => {
  if (!name) return '';
  return name
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// Helper: Extract ID from PokeAPI URL
export const extractIdFromUrl = (url) => {
  if (!url) return null;
  const matches = url.match(/\/(\d+)\/?$/);
  return matches ? parseInt(matches[1], 10) : null;
};

// Direct fetcher for a single Pokemon with caching
export const fetchPokemonByIdOrName = async (idOrName) => {
  const key = String(idOrName).toLowerCase().trim();
  if (cache.pokemon.has(key)) {
    return cache.pokemon.get(key);
  }

  try {
    const res = await axios.get(`${POKEAPI_BASE}/pokemon/${key}`);
    const data = res.data;
    const formatted = {
      id: data.id,
      name: data.name,
      displayName: formatPokemonName(data.name),
      types: data.types.map((t) => t.type.name),
      stats: data.stats.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
      height: data.height / 10, // meters
      weight: data.weight / 10, // kg
      abilities: data.abilities.map((a) => ({
        name: formatPokemonName(a.ability.name),
        is_hidden: a.is_hidden,
        url: a.ability.url,
      })),
      moves: data.moves.map((m) => ({
        name: formatPokemonName(m.move.name),
        url: m.move.url,
      })),
      image: getPokemonImageUrl(data.id),
      cry: data.cries?.latest || getPokemonCryUrl(data.id),
      sprite: data.sprites?.front_default,
    };
    cache.pokemon.set(key, formatted);
    cache.pokemon.set(String(data.id), formatted);
    return formatted;
  } catch (err) {
    console.error(`Error fetching Pokémon ${idOrName}:`, err);
    return null;
  }
};

/**
 * Hook to fetch paginated or list of Pokemon
 */
export const usePokemonList = (limit = 20, offset = 0) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchList = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`);
        setTotalCount(res.data.count);

        // Fetch basic details for each to get types and stats
        const detailedPromises = res.data.results.map((item) => {
          const id = extractIdFromUrl(item.url);
          return fetchPokemonByIdOrName(id);
        });

        const results = await Promise.all(detailedPromises);
        if (isMounted) {
          setPokemonList(results.filter(Boolean));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load Pokémon list');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchList();
    return () => {
      isMounted = false;
    };
  }, [limit, offset]);

  return { pokemonList, loading, error, totalCount };
};

/**
 * Hook to fetch Pokemon by specific IDs (e.g. Featured Legendaries)
 */
export const usePokemonByIds = (ids = []) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchBatch = async () => {
      if (!ids || ids.length === 0) {
        setPokemonList([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const promises = ids.map((id) => fetchPokemonByIdOrName(id));
        const results = await Promise.all(promises);
        if (isMounted) {
          setPokemonList(results.filter(Boolean));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load Pokémon batch');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBatch();
    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(ids)]);

  return { pokemonList, loading, error };
};

/**
 * Hook to fetch detailed Pokemon info including species & evolution chain
 */
export const usePokemonDetail = (idOrName) => {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idOrName) return;
    let isMounted = true;

    const fetchAllDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const basicData = await fetchPokemonByIdOrName(idOrName);
        if (!basicData) throw new Error('Pokemon not found');

        // Fetch species info (flavor text, evolution chain url, category)
        let speciesData = null;
        try {
          const specRes = await axios.get(`${POKEAPI_BASE}/pokemon-species/${basicData.id}`);
          speciesData = specRes.data;
        } catch (specErr) {
          console.warn('Species fetch error:', specErr);
        }

        // Process flavor text
        let flavorText = 'A rare and mystical Pokémon.';
        let genus = 'Pokémon';
        let generation = 'Generation I';

        if (speciesData) {
          const englishEntry = speciesData.flavor_text_entries?.find(
            (entry) => entry.language.name === 'en'
          );
          if (englishEntry) {
            flavorText = englishEntry.flavor_text
              .replace(/\f/g, '\n')
              .replace(/\u00ad\n/g, '')
              .replace(/\u00ad/g, '')
              .replace(/[\n\r]+/g, ' ');
          }

          const englishGenus = speciesData.genera?.find(
            (g) => g.language.name === 'en'
          );
          if (englishGenus) {
            genus = englishGenus.genus;
          }

          if (speciesData.generation?.name) {
            generation = formatPokemonName(speciesData.generation.name);
          }
        }

        // Parse Evolution Chain if present
        const evoList = [];
        if (speciesData?.evolution_chain?.url) {
          try {
            const evoRes = await axios.get(speciesData.evolution_chain.url);
            const chain = evoRes.data.chain;

            const parseEvolution = (node) => {
              if (!node) return;
              const evoId = extractIdFromUrl(node.species.url);
              evoList.push({
                id: evoId,
                name: node.species.name,
                displayName: formatPokemonName(node.species.name),
                image: getPokemonImageUrl(evoId),
                minLevel: node.evolution_details?.[0]?.min_level || null,
                trigger: node.evolution_details?.[0]?.trigger?.name || 'level-up',
                item: node.evolution_details?.[0]?.item?.name || null,
              });

              if (node.evolves_to && node.evolves_to.length > 0) {
                node.evolves_to.forEach(parseEvolution);
              }
            };

            parseEvolution(chain);
          } catch (evoErr) {
            console.warn('Evolution fetch error:', evoErr);
          }
        }

        if (isMounted) {
          setPokemon(basicData);
          setSpecies({
            flavorText,
            genus,
            generation,
            baseHappiness: speciesData?.base_happiness || 70,
            captureRate: speciesData?.capture_rate || 45,
            isLegendary: speciesData?.is_legendary || false,
            isMythical: speciesData?.is_mythical || false,
          });
          setEvolutionChain(evoList);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load Pokémon details');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAllDetails();
    return () => {
      isMounted = false;
    };
  }, [idOrName]);

  return { pokemon, species, evolutionChain, loading, error };
};

/**
 * Hook to fetch Pokemon by primary type
 */
export const usePokemonByType = (type, limit = 24) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!type) return;
    let isMounted = true;

    const fetchByType = async () => {
      setLoading(true);
      setError(null);
      const cleanType = type.toLowerCase().trim();

      try {
        const res = await axios.get(`${POKEAPI_BASE}/type/${cleanType}`);
        const pokemonEntries = res.data.pokemon || [];
        
        // Take up to limit
        const slice = pokemonEntries.slice(0, limit);
        const detailedPromises = slice.map((item) => {
          const id = extractIdFromUrl(item.pokemon.url);
          return fetchPokemonByIdOrName(id);
        });

        const results = await Promise.all(detailedPromises);
        if (isMounted) {
          setPokemonList(results.filter(Boolean));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || `Failed to load Pokémon of type ${type}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchByType();
    return () => {
      isMounted = false;
    };
  }, [type, limit]);

  return { pokemonList, loading, error };
};

/**
 * Hook to search Pokemon by query (debounced and fast)
 */
export const useSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const cleanQuery = query?.trim().toLowerCase();

    if (!cleanQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    const searchPokemon = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load master list once if not cached
        if (!cache.allList) {
          const allRes = await axios.get(`${POKEAPI_BASE}/pokemon?limit=1025`);
          cache.allList = allRes.data.results.map((p) => ({
            name: p.name,
            id: extractIdFromUrl(p.url),
          }));
        }

        // Filter by name or ID
        const matched = cache.allList
          .filter((p) => p.name.includes(cleanQuery) || String(p.id) === cleanQuery)
          .slice(0, 24);

        // Fetch detailed data for matches
        const detailedMatches = await Promise.all(
          matched.map((m) => fetchPokemonByIdOrName(m.id))
        );

        if (isMounted) {
          setResults(detailedMatches.filter(Boolean));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Search failed');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(searchPokemon, 300);
    return () => {
      clearTimeout(timer);
      isMounted = false;
    };
  }, [query]);

  return { results, loading, error };
};

export default {
  usePokemonList,
  usePokemonByIds,
  usePokemonDetail,
  usePokemonByType,
  useSearch,
  fetchPokemonByIdOrName,
  getPokemonImageUrl,
  getPokemonCryUrl,
  formatPokemonName,
  extractIdFromUrl,
};
