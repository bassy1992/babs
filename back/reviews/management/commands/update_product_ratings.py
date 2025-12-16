from django.core.management.base import BaseCommand
from django.db.models import Avg, Count
from products.models import Product
from reviews.models import Review


class Command(BaseCommand):
    help = 'Recalculate and update product ratings from reviews'

    def handle(self, *args, **options):
        products = Product.objects.all()
        updated_count = 0
        
        for product in products:
            # Calculate ratings from approved reviews
            stats = Review.objects.filter(
                product=product,
                is_approved=True
            ).aggregate(
                avg_rating=Avg('rating'),
                count=Count('id')
            )
            
            old_avg = product.rating_average
            old_count = product.rating_count
            
            product.rating_average = stats['avg_rating'] or 0
            product.rating_count = stats['count'] or 0
            product.save(update_fields=['rating_average', 'rating_count'])
            
            if old_avg != product.rating_average or old_count != product.rating_count:
                updated_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Updated {product.name}: {old_avg}★ ({old_count}) → {product.rating_average}★ ({product.rating_count})'
                    )
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated ratings for {updated_count} products!')
        )
