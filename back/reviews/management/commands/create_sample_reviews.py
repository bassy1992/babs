from django.core.management.base import BaseCommand
from reviews.models import Review
from products.models import Product


class Command(BaseCommand):
    help = 'Create sample reviews for testing'

    def handle(self, *args, **options):
        # Get first few products
        products = Product.objects.all()[:3]
        
        if not products:
            self.stdout.write(self.style.ERROR('No products found. Please create products first.'))
            return
        
        # Sample reviews data
        sample_reviews = [
            {
                'customer_name': 'Sarah Johnson',
                'customer_email': 'sarah.j@example.com',
                'rating': 5,
                'title': 'Absolutely Divine!',
                'comment': 'This fragrance is everything I hoped for and more. The scent is sophisticated yet not overpowering. It lasts all day and I receive compliments everywhere I go. Worth every penny!',
                'is_verified_purchase': True,
                'is_approved': True,
                'is_featured': True
            },
            {
                'customer_name': 'Michael Chen',
                'customer_email': 'mchen@example.com',
                'rating': 5,
                'title': 'Best Purchase This Year',
                'comment': 'I\'ve tried many luxury fragrances, but this one stands out. The blend of notes is perfectly balanced and the longevity is impressive. Highly recommend!',
                'is_verified_purchase': True,
                'is_approved': True,
                'is_featured': True
            },
            {
                'customer_name': 'Emma Williams',
                'customer_email': 'emma.w@example.com',
                'rating': 4,
                'title': 'Beautiful Scent',
                'comment': 'Really lovely fragrance with great staying power. The only reason I didn\'t give 5 stars is that it\'s a bit pricey, but the quality justifies it.',
                'is_verified_purchase': True,
                'is_approved': True,
                'is_featured': False
            },
            {
                'customer_name': 'David Martinez',
                'customer_email': 'david.m@example.com',
                'rating': 5,
                'title': 'Elegant and Long-lasting',
                'comment': 'Perfect for both day and evening wear. The scent evolves beautifully throughout the day. My new signature fragrance!',
                'is_verified_purchase': True,
                'is_approved': True,
                'is_featured': False
            },
            {
                'customer_name': 'Lisa Anderson',
                'customer_email': 'lisa.a@example.com',
                'rating': 4,
                'title': 'Great Quality',
                'comment': 'Very pleased with this purchase. The packaging is luxurious and the scent is exactly as described. Will definitely buy again.',
                'is_verified_purchase': False,
                'is_approved': True,
                'is_featured': False
            }
        ]
        
        created_count = 0
        for product in products:
            for review_data in sample_reviews:
                review = Review.objects.create(
                    product=product,
                    **review_data
                )
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Created review: {review.customer_name} - {product.name} ({review.rating}★)'
                    )
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} sample reviews!')
        )
