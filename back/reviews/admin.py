from django.contrib import admin
from django.utils.html import format_html
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = [
        'customer_name',
        'product',
        'rating_stars',
        'is_verified_purchase',
        'is_approved',
        'is_featured',
        'created_at'
    ]
    list_filter = [
        'rating',
        'is_approved',
        'is_verified_purchase',
        'is_featured',
        'created_at'
    ]
    search_fields = ['customer_name', 'customer_email', 'title', 'comment', 'product__name']
    readonly_fields = ['created_at', 'updated_at', 'rating_display_admin']
    
    fieldsets = (
        ('Customer Information', {
            'fields': ('customer_name', 'customer_email')
        }),
        ('Review Details', {
            'fields': ('product', 'rating', 'rating_display_admin', 'title', 'comment')
        }),
        ('Status', {
            'fields': ('is_approved', 'is_verified_purchase', 'is_featured')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    actions = ['approve_reviews', 'unapprove_reviews', 'feature_reviews', 'unfeature_reviews']
    
    def rating_stars(self, obj):
        """Display rating as colored stars"""
        stars = '★' * obj.rating + '☆' * (5 - obj.rating)
        color = '#F59E0B' if obj.rating >= 4 else '#EF4444' if obj.rating <= 2 else '#6B7280'
        return format_html(
            '<span style="color: {}; font-size: 16px;">{}</span>',
            color,
            stars
        )
    rating_stars.short_description = 'Rating'
    
    def rating_display_admin(self, obj):
        """Display rating with visual stars in detail view"""
        stars = '★' * obj.rating + '☆' * (5 - obj.rating)
        return format_html(
            '<div style="font-size: 24px; color: #F59E0B;">{}</div>',
            stars
        )
    rating_display_admin.short_description = 'Rating Display'
    
    def approve_reviews(self, request, queryset):
        """Bulk approve reviews"""
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} review(s) were approved.')
    approve_reviews.short_description = "Approve selected reviews"
    
    def unapprove_reviews(self, request, queryset):
        """Bulk unapprove reviews"""
        updated = queryset.update(is_approved=False)
        self.message_user(request, f'{updated} review(s) were unapproved.')
    unapprove_reviews.short_description = "Unapprove selected reviews"
    
    def feature_reviews(self, request, queryset):
        """Bulk feature reviews"""
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} review(s) were featured.')
    feature_reviews.short_description = "Feature selected reviews"
    
    def unfeature_reviews(self, request, queryset):
        """Bulk unfeature reviews"""
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} review(s) were unfeatured.')
    unfeature_reviews.short_description = "Unfeature selected reviews"
