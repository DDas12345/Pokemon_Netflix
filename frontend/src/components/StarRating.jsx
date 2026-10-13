import React, { useState } from 'react';

const StarRating = ({
  rating = 4.5,
  maxStars = 5,
  size = 'md',
  interactive = true,
  onRate,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const handleClick = (starValue) => {
    if (!interactive) return;
    setCurrentRating(starValue);
    if (onRate) onRate(starValue);
  };

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }[size] || 'w-5 h-5';

  const activeRating = hoverRating || currentRating;

  return (
    <div className="flex items-center gap-1.5 select-none">
      <div className="flex items-center gap-1">
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = activeRating >= starValue;
          const isHalf = !isFilled && activeRating >= starValue - 0.5;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`transition-transform duration-150 ${
                interactive
                  ? 'cursor-pointer hover:scale-125 focus:outline-none'
                  : 'cursor-default'
              }`}
              title={`${starValue} Stars`}
            >
              <svg
                className={`${starSizes} ${
                  isFilled
                    ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                    : isHalf
                    ? 'text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]'
                    : 'text-neutral-600 hover:text-neutral-400'
                } transition-colors duration-150 fill-current`}
                viewBox="0 0 24 24"
              >
                {isHalf ? (
                  <>
                    <defs>
                      <linearGradient id={`half-${index}`}>
                        <stop offset="50%" stopColor="#FACC15" />
                        <stop offset="50%" stopColor="#525252" />
                      </linearGradient>
                    </defs>
                    <path
                      fill={`url(#half-${index})`}
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    />
                  </>
                ) : (
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                )}
              </svg>
            </button>
          );
        })}
      </div>
      <span className="text-xs font-semibold text-yellow-400/90 ml-1">
        {activeRating.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;
