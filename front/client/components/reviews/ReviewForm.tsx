import { useState } from 'react';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';
import { reviewsApi, type ReviewFormData } from '@/api/reviews';
import { toast } from 'sonner';

interface ReviewFormProps {
  productId: number;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    rating: 0,
    title: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData: ReviewFormData = {
        product: productId,
        ...formData
      };

      const response = await reviewsApi.createReview(reviewData);
      
      toast.success(response.message);
      
      // Reset form
      setFormData({
        customer_name: '',
        customer_email: '',
        rating: 0,
        title: '',
        comment: ''
      });

      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4">Write a Review</h3>
        <p className="text-sm text-gray-600 mb-6">
          Share your experience with this product. Your review will be published after moderation.
        </p>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <StarRating
          rating={formData.rating}
          size="lg"
          interactive
          onRatingChange={(rating) => setFormData({ ...formData, rating })}
        />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="customer_name"
          required
          value={formData.customer_name}
          onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          placeholder="Enter your name"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-2">
          Your Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="customer_email"
          required
          value={formData.customer_email}
          onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          placeholder="your.email@example.com"
        />
        <p className="mt-1 text-xs text-gray-500">Your email will not be published</p>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Review Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          placeholder="Sum up your experience"
        />
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          required
          rows={5}
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          placeholder="Tell us what you think about this product..."
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto px-8"
        size="lg"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
