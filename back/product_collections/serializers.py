from rest_framework import serializers
from .models import ProductCollection
from products.serializers import ProductListSerializer


class CollectionListSerializer(serializers.ModelSerializer):
    """Simplified serializer for collection lists"""
    
    href = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductCollection
        fields = ['id', 'title', 'slug', 'description', 'image', 'href', 'product_count', 'is_featured']
    
    def get_href(self, obj):
        return f"/collection/{obj.slug}"
    
    def get_product_count(self, obj):
        return obj.collection_products.filter(is_active=True).count()


class CollectionDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single collection view"""
    
    products = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductCollection
        fields = [
            'id', 'title', 'slug', 'description', 'image',
            'products', 'product_count', 'is_featured',
            'created_at', 'updated_at'
        ]
    
    def get_products(self, obj):
        # Get products where this collection is the primary collection
        products = obj.collection_products.filter(is_active=True)
        return ProductListSerializer(products, many=True).data
    
    def get_product_count(self, obj):
        return obj.collection_products.filter(is_active=True).count()
