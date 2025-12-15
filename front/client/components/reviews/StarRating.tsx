import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onRatingChange,
  className
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        const isPartial = starValue > rating && starValue - 1 < rating;
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={cn(
              "relative transition-all",
              interactive && "cursor-pointer hover:scale-110",
              !interactive && "cursor-default"
            )}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                interactive && "hover:text-yellow-400"
              )}
            />
            {isPartial && (
              <Star
                className={cn(
                  sizeClasses[size],
                  "absolute top-0 left-0 fill-yellow-400 text-yellow-400"
                )}
                style={{
                  clipPath: `inset(0 ${100 - ((rating - (starValue - 1)) * 100)}% 0 0)`
                }}
              />
            )}
          </button>
        );
      })}
      {showNumber && (
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
