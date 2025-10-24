from rest_framework import serializers
from .models import (
    Product, ProductImage, ProductVariant, FragranceNote,
    ProductHighlight, RitualStep, Ingredient
)


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'alt_text', 'order', 'is_primary']


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'label', 'volume', 'price', 'sku', 'stock', 'is_available']


class FragranceNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = FragranceNote
        fields = ['id', 'note_type', 'name', 'order']


class ProductHighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductHighlight
        fields = ['id', 'title', 'description', 'order']


class RitualStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RitualStep
        fields = ['id', 'step', 'order']


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'order']


class ProductListSerializer(serializers.ModelSerializer):
    """Simplified serializer for product lists"""
    
    image = serializers.SerializerMethodField()
    collection_name = serializers.CharField(source='collection.title', read_only=True)
    collection_slug = serializers.CharField(source='collection.slug', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'price', 'image', 'badge', 'is_bestseller', 'collection_name', 'collection_slug']
    
    def get_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return primary_image.image_url
        first_image = obj.images.first()
        return first_image.image_url if first_image else None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single product view"""
    
    images = ProductImageSerializer(many=True, read_only=True)
    notes = serializers.SerializerMethodField()
    highlights = ProductHighlightSerializer(many=True, read_only=True)
    ritual_steps = serializers.SerializerMethodField()
    ingredients = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()
    sizes = serializers.SerializerMethodField()
    accords = serializers.SerializerMethodField()
    ritual = serializers.SerializerMethodField()
    collection_name = serializers.CharField(source='collection.title', read_only=True)
    collection_slug = serializers.CharField(source='collection.slug', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'story', 'price',
            'images', 'notes', 'highlights', 'ritual_steps',
            'ingredients', 'rating', 'badge', 'is_featured', 'is_bestseller',
            'created_at', 'updated_at', 'collection_name', 'collection_slug',
            # Frontend-compatible fields
            'gallery', 'sizes', 'accords', 'ritual'
        ]
    
    def get_notes(self, obj):
        notes = obj.notes.all()
        return FragranceNoteSerializer(notes, many=True).data
    
    def get_ritual_steps(self, obj):
        steps = obj.ritual_steps.all()
        return [step.step for step in steps]
    
    def get_ingredients(self, obj):
        ingredients = obj.ingredients.all()
        return [ing.name for ing in ingredients]
    
    def get_rating(self, obj):
        return {
            'average': float(obj.rating_average),
            'count': obj.rating_count
        }
    
    def get_gallery(self, obj):
        """Return image URLs for frontend gallery"""
        return [img.image_url for img in obj.images.all()]
    
    def get_sizes(self, obj):
        """Return variants in frontend format"""
        return ProductVariantSerializer(obj.variants.all(), many=True).data
    
    def get_accords(self, obj):
        """Return notes grouped by type for frontend"""
        notes = obj.notes.all()
        return {
            'top': [n.name for n in notes if n.note_type == 'top'],
            'heart': [n.name for n in notes if n.note_type == 'heart'],
            'base': [n.name for n in notes if n.note_type == 'base'],
        }
    
    def get_ritual(self, obj):
        """Return ritual steps as array for frontend"""
        return [step.step for step in obj.ritual_steps.all()]
