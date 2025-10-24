from rest_framework import serializers
from .models import ProductCollection
from products.serializers import ProductListSerializer


class CollectionListSerializer(serializers.ModelSerializer):
    """Simplified serializer for collection lists"""
    
    href = serializers.SerializerMethodField()
    product_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = ProductCollection
        fields = ['id', 'title', 'slug', 'description', 'image', 'href', 'product_count', 'is_featured']
    
    def get_href(self, obj):
        return f"/collection/{obj.slug}"


class CollectionDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single collection view"""
    
    products = ProductListSerializer(many=True, read_only=True)
    product_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = ProductCollection
        fields = [
            'id', 'title', 'slug', 'description', 'image',
            'products', 'product_count', 'is_featured',
            'created_at', 'updated_at'
        ]
