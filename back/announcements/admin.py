from django.contrib import admin
from django.utils.html import format_html
from .models import Announcement


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = [
        'title', 
        'announcement_type', 
        'priority', 
        'is_active', 
        'is_currently_active_display',
        'start_date', 
        'end_date',
        'color_preview'
    ]
    list_filter = [
        'announcement_type', 
        'priority', 
        'is_active', 
        'show_on_homepage', 
        'show_on_shop', 
        'show_on_all_pages',
        'start_date'
    ]
    search_fields = ['title', 'message']
    readonly_fields = ['created_at', 'updated_at', 'color_preview']
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'message', 'announcement_type', 'priority')
        }),
        ('Display Settings', {
            'fields': (
                'is_active', 
                'show_on_homepage', 
                'show_on_shop', 
                'show_on_all_pages'
            )
        }),
        ('Styling', {
            'fields': ('background_color', 'text_color', 'color_preview'),
            'classes': ('collapse',)
        }),
        ('Link (Optional)', {
            'fields': ('link_url', 'link_text'),
            'classes': ('collapse',)
        }),
        ('Scheduling', {
            'fields': ('start_date', 'end_date')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def is_currently_active_display(self, obj):
        """Display current active status with color coding"""
        if obj.is_currently_active:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ Active</span>'
            )
        return format_html(
            '<span style="color: red; font-weight: bold;">✗ Inactive</span>'
        )
    is_currently_active_display.short_description = 'Currently Active'
    
    def color_preview(self, obj):
        """Show a preview of the announcement colors"""
        if obj.background_color and obj.text_color:
            return format_html(
                '<div style="background-color: {}; color: {}; padding: 8px 12px; '
                'border-radius: 4px; display: inline-block; min-width: 100px; '
                'text-align: center; font-weight: bold;">Preview</div>',
                obj.background_color,
                obj.text_color
            )
        return "No colors set"
    color_preview.short_description = 'Color Preview'
    
    actions = ['activate_announcements', 'deactivate_announcements']
    
    def activate_announcements(self, request, queryset):
        """Bulk activate announcements"""
        updated = queryset.update(is_active=True)
        self.message_user(
            request, 
            f'{updated} announcement(s) were successfully activated.'
        )
    activate_announcements.short_description = "Activate selected announcements"
    
    def deactivate_announcements(self, request, queryset):
        """Bulk deactivate announcements"""
        updated = queryset.update(is_active=False)
        self.message_user(
            request, 
            f'{updated} announcement(s) were successfully deactivated.'
        )
    deactivate_announcements.short_description = "Deactivate selected announcements"