from django.urls import path
from . import views

app_name = 'reviews'

urlpatterns = [
    # Create review
    path('create/', views.ReviewCreateView.as_view(), name='review-create'),
    
    # Product reviews
    path('product/<int:product_id>/', views.ProductReviewListView.as_view(), name='product-reviews'),
    path('product/<int:product_id>/stats/', views.product_review_stats, name='product-review-stats'),
    
    # Featured reviews
    path('featured/', views.featured_reviews, name='featured-reviews'),
]
