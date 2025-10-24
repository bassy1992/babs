from django.contrib import admin
from .models import (
    Product, ProductImage, ProductVariant, FragranceNote,
    ProductHighlight, RitualStep, Ingredient
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


class FragranceNoteInline(admin.TabularInline):
    model = FragranceNote
    extra = 3


class ProductHighlightInline(admin.TabularInline):
    model = ProductHighlight
    extra = 1


class RitualStepInline(admin.TabularInline):
    model = RitualStep
    extra = 1


class IngredientInline(admin.TabularInline):
    model = Ingredient
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'is_featured', 'is_bestseller', 'is_active', 'created_at']
    list_filter = ['is_featured', 'is_bestseller', 'is_active', 'created_at']
    search_fields = ['name', 'description', 'id']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [
        ProductImageInline,
        ProductVariantInline,
        FragranceNoteInline,
        ProductHighlightInline,
        RitualStepInline,
        IngredientInline,
    ]
