from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    rating_display = serializers.ReadOnlyField()
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id',
            'product',
            'product_name',
            'customer_name',
            'customer_email',
            'rating',
            'rating_display',
            'title',
            'comment',
            'is_verified_purchase',
            'is_approved',
            'is_featured',
            'created_at'
        ]
        read_only_fields = ['id', 'is_approved', 'is_verified_purchase', 'is_featured', 'created_at']
    
    def validate_rating(self, value):
        """Ensure rating is between 1 and 5"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating reviews"""
    
    class Meta:
        model = Review
        fields = [
            'product',
            'customer_name',
            'customer_email',
            'rating',
            'title',
            'comment'
        ]
    
    def validate_rating(self, value):
        """Ensure rating is between 1 and 5"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def validate_customer_email(self, value):
        """Validate email format"""
        if not value or '@' not in value:
            raise serializers.ValidationError("Please provide a valid email address")
        return value.lower()


class ReviewListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing reviews"""
    rating_display = serializers.ReadOnlyField()
    
    class Meta:
        model = Review
        fields = [
            'id',
            'customer_name',
            'rating',
            'rating_display',
            'title',
            'comment',
            'is_verified_purchase',
            'is_featured',
            'created_at'
        ]
