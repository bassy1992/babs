from django.contrib import admin
from .models import ProductCollection


@admin.register(ProductCollection)
class ProductCollectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'is_featured', 'is_active', 'product_count', 'created_at']
    list_filter = ['is_featured', 'is_active', 'created_at']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['products']
