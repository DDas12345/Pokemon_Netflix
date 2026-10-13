import React from 'react';

const STAT_CONFIG = {
  hp: { label: 'HP', max: 255 },
  attack: { label: 'ATK', max: 190 },
  defense: { label: 'DEF', max: 230 },
  'special-attack': { label: 'SP.ATK', max: 194 },
  'special-defense': { label: 'SP.DEF', max: 230 },
  speed: { label: 'SPD', max: 200 },
};

const getStatColor = (value) => {
  if (value >= 130) return '#7038F8'; // Legendary Purple / Dragon
  if (value >= 100) return '#6890F0'; // Water / Cyan Elite
  if (value >= 75) return '#78C850';  // Grass Green Solid
  if (value >= 50) return '#F8D030';  // Electric Yellow Average
  return '#E50914';                   // Pokeflix Red Low
};

const StatBar = ({ name, value, max = 255, showLabel = true }) => {
  const normalizedKey = name.toLowerCase().replace(/\s+/g, '-');
  const config = STAT_CONFIG[normalizedKey] || { label: name.toUpperCase(), max };
  const maxValue = config.max || 255;
  const percentage = Math.min(100, Math.round((value / maxValue) * 100));
  const color = getStatColor(value);

  return (
    <div className="w-full mb-2">
      <div className="flex justify-between items-center text-xs mb-1 font-medium">
        {showLabel && (
          <span className="text-gray-300 tracking-wider text-[11px] font-bold">
            {config.label}
          </span>
        )}
        <span className="font-mono text-white text-[12px] font-bold">
          {value} <span className="text-gray-500 font-normal">/ {maxValue}</span>
        </span>
      </div>
      <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-white/5">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}80`,
          }}
        />
      </div>
    </div>
  );
};

export default StatBar;
