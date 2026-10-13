import React from 'react';

export const TYPE_COLORS = {
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  psychic: '#F85888',
  ice: '#98D8D8',
  dragon: '#7038F8',
  dark: '#705848',
  fairy: '#EE99AC',
  normal: '#A8A878',
  fighting: '#C03028',
  flying: '#A890F0',
  poison: '#A040A0',
  ground: '#E0C068',
  rock: '#B8A038',
  bug: '#A8B820',
  ghost: '#705898',
  steel: '#B8B8D0',
};

export const TYPE_ICONS = {
  fire: '🔥',
  water: '💧',
  grass: '🍃',
  electric: '⚡',
  psychic: '🔮',
  ice: '❄️',
  dragon: '🐉',
  dark: '🌙',
  fairy: '✨',
  normal: '⚪',
  fighting: '🥊',
  flying: '🕊️',
  poison: '☠️',
  ground: '⛰️',
  rock: '🪨',
  bug: '🐛',
  ghost: '👻',
  steel: '🛡️',
};

export const getTypeColor = (type) => {
  if (!type) return '#777777';
  const clean = type.toLowerCase().trim();
  return TYPE_COLORS[clean] || '#777777';
};

const TypeBadge = ({ type, size = 'sm', showIcon = false, className = '' }) => {
  if (!type) return null;
  const cleanType = type.toLowerCase().trim();
  const color = getTypeColor(cleanType);
  const icon = TYPE_ICONS[cleanType] || '•';

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] tracking-wide font-medium',
    sm: 'px-2.5 py-0.5 text-xs tracking-wider font-semibold',
    md: 'px-3.5 py-1 text-sm tracking-wider font-bold',
    lg: 'px-4 py-1.5 text-base tracking-wider font-extrabold',
  }[size] || 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase text-white shadow-sm transition-transform hover:scale-105 select-none ${sizeClasses} ${className}`}
      style={{
        backgroundColor: color,
        boxShadow: `0 2px 8px ${color}55`,
        textShadow: '0 1px 2px rgba(0,0,0,0.6)',
      }}
    >
      {showIcon && <span className="text-xs leading-none">{icon}</span>}
      <span>{cleanType}</span>
    </span>
  );
};

export default TypeBadge;
