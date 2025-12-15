const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_URL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

export interface Review {
  id: number;
  customer_name: string;
  rating: number;
  rating_display: string;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
  five_star_percent: number;
  four_star_percent: number;
  three_star_percent: number;
  two_star_percent: number;
  one_star_percent: number;
}

export interface ReviewFormData {
  product: number;
  customer_name: string;
  customer_email: string;
  rating: number;
  title: string;
  comment: string;
}

export const reviewsApi = {
  // Get reviews for a product
  getProductReviews: async (productId: number): Promise<Review[]> => {
    const response = await fetch(`${API_URL}/reviews/product/${productId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return response.json();
  },

  // Get review statistics for a product
  getProductStats: async (productId: number): Promise<ReviewStats> => {
    const response = await fetch(`${API_URL}/reviews/product/${productId}/stats/`);
    if (!response.ok) {
      throw new Error('Failed to fetch review stats');
    }
    return response.json();
  },

  // Create a new review
  createReview: async (data: ReviewFormData): Promise<{ message: string; review_id: number }> => {
    const response = await fetch(`${API_URL}/reviews/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit review');
    }
    
    return response.json();
  },

  // Get featured reviews
  getFeaturedReviews: async (): Promise<Review[]> => {
    const response = await fetch(`${API_URL}/reviews/featured/`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured reviews');
    }
    return response.json();
  },
};
