import { useQuery } from '@tanstack/react-query';
import StarRating from './StarRating';
import { reviewsApi } from '@/api/reviews';
import { cn } from '@/lib/utils';

interface ReviewStatsProps {
  productId: number;
  className?: string;
}

export default function ReviewStats({ productId, className }: ReviewStatsProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['review-stats', productId],
    queryFn: () => reviewsApi.getProductStats(productId),
  });

  if (isLoading || !stats) {
    return null;
  }

  const ratingBars = [
    { stars: 5, count: stats.five_star, percent: stats.five_star_percent },
    { stars: 4, count: stats.four_star, percent: stats.four_star_percent },
    { stars: 3, count: stats.three_star, percent: stats.three_star_percent },
    { stars: 2, count: stats.two_star, percent: stats.two_star_percent },
    { stars: 1, count: stats.one_star, percent: stats.one_star_percent },
  ];

  return (
    <div className={cn("bg-gray-50 rounded-xl p-6", className)}>
      {/* Overall Rating */}
      <div className="text-center mb-6 pb-6 border-b border-gray-200">
        <div className="text-5xl font-bold text-gray-900 mb-2">
          {stats.average_rating.toFixed(1)}
        </div>
        <StarRating rating={stats.average_rating} size="lg" className="justify-center mb-2" />
        <p className="text-sm text-gray-600">
          Based on {stats.total_reviews} review{stats.total_reviews !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Rating Breakdown */}
      <div className="space-y-3">
        {ratingBars.map((bar) => (
          <div key={bar.stars} className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 w-12">
              {bar.stars} star{bar.stars !== 1 ? 's' : ''}
            </span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${bar.percent}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 w-12 text-right">
              {bar.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
