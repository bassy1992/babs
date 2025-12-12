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
                'title': 'Holiday Sale — 30% Off Sitewide',
                'message': 'Discover luxury fragrances at exceptional prices. Use code HOLIDAY30 at checkout through December 31st.',
                'announcement_type': 'sale',
                'priority': 'high',
                'background_color': '#1F2937',
                'text_color': '#F9FAFB',
                'show_on_homepage': True,
                'show_on_shop': True,
                'show_on_all_pages': True,
                'link_url': '/shop',
                'link_text': 'Shop Sale',
                'end_date': timezone.now() + timedelta(days=30)
            },
            {
                'title': 'New Arrival — Midnight Garden Collection',
                'message': 'Inspired by moonlit botanical gardens. Limited edition bottles crafted with rare night-blooming florals.',
                'announcement_type': 'new_arrival',
                'priority': 'medium',
                'background_color': '#4C1D95',
                'text_color': '#FAF5FF',
                'show_on_homepage': True,
                'show_on_shop': False,
                'show_on_all_pages': False,
                'link_url': '/collections',
                'link_text': 'Discover Now'
            },
            {
                'title': 'Complimentary Shipping on Orders $75+',
                'message': 'Free express delivery on all orders over $75. Automatically applied at checkout.',
                'announcement_type': 'promotion',
                'priority': 'medium',
                'background_color': '#065F46',
                'text_color': '#ECFDF5',
                'show_on_homepage': False,
                'show_on_shop': True,
                'show_on_all_pages': False,
            },
            {
                'title': 'Same-Day Delivery Now Available',
                'message': 'Order before 2 PM for same-day delivery in select cities. Perfect for last-minute occasions.',
                'announcement_type': 'info',
                'priority': 'low',
                'background_color': '#1E40AF',
                'text_color': '#EFF6FF',
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