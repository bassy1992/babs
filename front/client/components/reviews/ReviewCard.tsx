import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import StarRating from './StarRating';
import type { Review } from '@/api/reviews';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export default function ReviewCard({ review, className }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      className={cn(
        "p-6 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow",
        review.is_featured && "ring-2 ring-primary/20",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{review.customer_name}</h4>
            {review.is_verified_purchase && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <CheckCircle className="h-3 w-3" />
                Verified Purchase
              </span>
            )}
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>
        <time className="text-sm text-gray-500 whitespace-nowrap">
          {formatDate(review.created_at)}
        </time>
      </div>

      {/* Review Title */}
      <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>

      {/* Review Comment */}
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>

      {/* Featured Badge */}
      {review.is_featured && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="inline-flex items-center text-xs font-medium text-primary">
            ⭐ Featured Review
          </span>
        </div>
      )}
    </div>
  );
}
