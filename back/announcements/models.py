from django.db import models
from django.utils import timezone


class Announcement(models.Model):
    ANNOUNCEMENT_TYPES = [
        ('promotion', 'Promotion'),
        ('sale', 'Sale'),
        ('new_arrival', 'New Arrival'),
        ('info', 'Information'),
        ('warning', 'Warning'),
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    title = models.CharField(max_length=200)
    message = models.TextField()
    announcement_type = models.CharField(
        max_length=20, 
        choices=ANNOUNCEMENT_TYPES, 
        default='info'
    )
    priority = models.CharField(
        max_length=10, 
        choices=PRIORITY_LEVELS, 
        default='medium'
    )
    
    # Display settings
    is_active = models.BooleanField(default=True)
    show_on_homepage = models.BooleanField(default=True)
    show_on_shop = models.BooleanField(default=True)
    show_on_all_pages = models.BooleanField(default=False)
    
    # Styling
    background_color = models.CharField(
        max_length=7, 
        default='#3B82F6',
        help_text='Hex color code (e.g., #3B82F6)'
    )
    text_color = models.CharField(
        max_length=7, 
        default='#FFFFFF',
        help_text='Hex color code (e.g., #FFFFFF)'
    )
    
    # Optional link
    link_url = models.URLField(blank=True, null=True, help_text='Optional link for the announcement')
    link_text = models.CharField(max_length=100, blank=True, help_text='Text for the link button')
    
    # Scheduling
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-priority', '-start_date']
        verbose_name = 'Announcement'
        verbose_name_plural = 'Announcements'
    
    def __str__(self):
        return f"{self.title} ({self.get_announcement_type_display()})"
    
    @property
    def is_currently_active(self):
        """Check if announcement should be displayed based on dates and active status"""
        if not self.is_active:
            return False
        
        now = timezone.now()
        if self.start_date > now:
            return False
        
        if self.end_date and self.end_date < now:
            return False
        
        return True
    
    def save(self, *args, **kwargs):
        # Ensure colors have # prefix
        if self.background_color and not self.background_color.startswith('#'):
            self.background_color = f'#{self.background_color}'
        if self.text_color and not self.text_color.startswith('#'):
            self.text_color = f'#{self.text_color}'
        super().save(*args, **kwargs)