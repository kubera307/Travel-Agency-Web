import React from 'react';
import { Star } from 'lucide-react';

export default function Rating({
  value = 5,
  count,
  size = 'sm',
  showScore = true,
  className = ''
}) {
  const numValue = Number(value) || 0;

  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    xs: 'text-[11px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.round(numValue);
          return (
            <Star
              key={star}
              className={`${starSizes[size] || starSizes.sm} ${
                isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'
              }`}
            />
          );
        })}
      </div>
      {showScore && (
        <span className={`font-semibold text-slate-800 ${textSizes[size] || textSizes.sm}`}>
          {numValue.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className={`text-slate-500 ${textSizes[size] || textSizes.sm}`}>
          ({count})
        </span>
      )}
    </div>
  );
}

