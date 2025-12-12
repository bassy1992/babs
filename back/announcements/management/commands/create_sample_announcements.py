from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from announcements.models import Announcement


class Command(BaseCommand):
    help = 'Create sample announcements for testing'

    def handle(self, *args, **options):
        # Clear existing announcements
        Announcement.objects.all().delete()
        
        # Create sample announcements
        announcements = [
            {
                'title': '🎉 Holiday Sale - 30% Off Everything!',
                'message': 'Limited time offer: Get 30% off all fragrances. Use code HOLIDAY30 at checkout. Valid until December 31st.',
                'announcement_type': 'sale',
                'priority': 'high',
                'background_color': '#DC2626',
                'text_color': '#FFFFFF',
                'show_on_homepage': True,
                'show_on_shop': True,
                'show_on_all_pages': True,
                'link_url': '/shop',
                'link_text': 'Shop Now',
                'end_date': timezone.now() + timedelta(days=30)
            },
            {
                'title': '✨ New Arrival: Midnight Garden Collection',
                'message': 'Discover our latest collection inspired by moonlit botanical gardens. Limited edition bottles available now.',
                'announcement_type': 'new_arrival',
                'priority': 'medium',
                'background_color': '#7C3AED',
                'text_color': '#FFFFFF',
                'show_on_homepage': True,
                'show_on_shop': False,
                'show_on_all_pages': False,
                'link_url': '/collections',
                'link_text': 'Explore Collection'
            },
            {
                'title': '🚚 Free Shipping on Orders Over $75',
                'message': 'Enjoy complimentary shipping on all orders over $75. No code needed - discount applied at checkout.',
                'announcement_type': 'promotion',
                'priority': 'medium',
                'background_color': '#059669',
                'text_color': '#FFFFFF',
                'show_on_homepage': False,
                'show_on_shop': True,
                'show_on_all_pages': False,
            },
            {
                'title': '📦 Same-Day Delivery Available',
                'message': 'Order before 2 PM for same-day delivery in select cities. Perfect for last-minute gifts!',
                'announcement_type': 'info',
                'priority': 'low',
                'background_color': '#3B82F6',
                'text_color': '#FFFFFF',
                'show_on_homepage': False,
                'show_on_shop': True,
                'show_on_all_pages': False,
            }
        ]
        
        created_count = 0
        for announcement_data in announcements:
            announcement = Announcement.objects.create(**announcement_data)
            created_count += 1
            self.stdout.write(
                self.style.SUCCESS(f'Created announcement: {announcement.title}')
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} sample announcements!')
        )