from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count
from .models import Review


@receiver([post_save, post_delete], sender=Review)
def update_product_rating(sender, instance, **kwargs):
    """
    Update product rating whenever a review is created, updated, or deleted
    """
    product = instance.product
    
    # Calculate new ratings from approved reviews only
    stats = Review.objects.filter(
        product=product,
        is_approved=True
    ).aggregate(
        avg_rating=Avg('rating'),
        count=Count('id')
    )
    
    # Update product
    product.rating_average = stats['avg_rating'] or 0
    product.rating_count = stats['count'] or 0
    product.save(update_fields=['rating_average', 'rating_count'])
