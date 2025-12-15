from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Avg, Count, Q
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer, ReviewListSerializer
from products.models import Product


class ProductReviewListView(generics.ListAPIView):
    """
    List all approved reviews for a specific product
    """
    serializer_class = ReviewListSerializer
    
    def get_queryset(self):
        product_id = self.kwargs.get('product_id')
        return Review.objects.filter(
            product_id=product_id,
            is_approved=True
        ).order_by('-is_featured', '-created_at')


class ReviewCreateView(generics.CreateAPIView):
    """
    Create a new review
    """
    serializer_class = ReviewCreateSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check if product exists
        product_id = serializer.validated_data.get('product').id
        if not Product.objects.filter(id=product_id).exists():
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Save review (will be pending approval)
        review = serializer.save(is_approved=False)
        
        return Response(
            {
                'message': 'Thank you for your review! It will be published after moderation.',
                'review_id': review.id
            },
            status=status.HTTP_201_CREATED
        )


@api_view(['GET'])
def product_review_stats(request, product_id):
    """
    Get review statistics for a product
    """
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    reviews = Review.objects.filter(product=product, is_approved=True)
    
    # Calculate statistics
    stats = reviews.aggregate(
        average_rating=Avg('rating'),
        total_reviews=Count('id'),
        five_star=Count('id', filter=Q(rating=5)),
        four_star=Count('id', filter=Q(rating=4)),
        three_star=Count('id', filter=Q(rating=3)),
        two_star=Count('id', filter=Q(rating=2)),
        one_star=Count('id', filter=Q(rating=1))
    )
    
    # Format average rating
    if stats['average_rating']:
        stats['average_rating'] = round(stats['average_rating'], 1)
    else:
        stats['average_rating'] = 0
    
    # Calculate percentages
    total = stats['total_reviews']
    if total > 0:
        stats['five_star_percent'] = round((stats['five_star'] / total) * 100)
        stats['four_star_percent'] = round((stats['four_star'] / total) * 100)
        stats['three_star_percent'] = round((stats['three_star'] / total) * 100)
        stats['two_star_percent'] = round((stats['two_star'] / total) * 100)
        stats['one_star_percent'] = round((stats['one_star'] / total) * 100)
    else:
        stats['five_star_percent'] = 0
        stats['four_star_percent'] = 0
        stats['three_star_percent'] = 0
        stats['two_star_percent'] = 0
        stats['one_star_percent'] = 0
    
    return Response(stats)


@api_view(['GET'])
def featured_reviews(request):
    """
    Get featured reviews across all products
    """
    reviews = Review.objects.filter(
        is_approved=True,
        is_featured=True
    ).select_related('product')[:10]
    
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)
