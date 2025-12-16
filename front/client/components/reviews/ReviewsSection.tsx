import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import ReviewStats from './ReviewStats';
import { reviewsApi } from '@/api/reviews';
import { MessageSquare } from 'lucide-react';

interface ReviewsSectionProps {
  productId: string | number;
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const { data: reviews = [], isLoading, refetch } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewsApi.getProductReviews(productId),
  });

  const handleReviewSuccess = () => {
    setShowForm(false);
    refetch();
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Customer Reviews</h2>
            <p className="text-gray-600">
              See what our customers are saying about this product
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Stats Column */}
            <div className="lg:col-span-1">
              <ReviewStats productId={productId} />
              
              {!showForm && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="w-full mt-6"
                  size="lg"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Write a Review
                </Button>
              )}
            </div>

            {/* Reviews Column */}
            <div className="lg:col-span-2">
              {showForm ? (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                  <ReviewForm
                    productId={productId}
                    onSuccess={handleReviewSuccess}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="mt-4"
                  >
                    Cancel
                  </Button>
                </div>
              ) : null}

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  <p className="mt-4 text-sm text-gray-600">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Be the first to share your experience with this product
                  </p>
                  {!showForm && (
                    <Button onClick={() => setShowForm(true)}>
                      Write the First Review
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
