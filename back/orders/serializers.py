from rest_framework import serializers
from .models import Order, OrderItem, Cart, CartItem, PromoCode
from products.serializers import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product_name', 'product_image', 'variant_label',
            'quantity', 'price', 'subtotal'
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'email', 'full_name',
            'shipping_address', 'shipping_city', 'shipping_postal_code', 'shipping_country',
            'status', 'subtotal', 'shipping_cost', 'tax', 'total',
            'payment_method', 'payment_status', 'payment_reference',
            'promo_code', 'discount_amount',
            'items', 'created_at', 'updated_at', 'notes'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'payment_reference']


class OrderCreateSerializer(serializers.ModelSerializer):
    items = serializers.ListField(write_only=True)
    id = serializers.CharField(read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'email', 'full_name',
            'shipping_address', 'shipping_city', 'shipping_postal_code', 'shipping_country',
            'payment_method', 'promo_code', 'total', 'items'
        ]
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Calculate totals
        subtotal = sum(item['price'] * item['quantity'] for item in items_data)
        shipping_cost = 0 if subtotal > 150 else 12
        tax = subtotal * 0.08
        discount = 0
        
        # Apply promo code if provided
        promo_code = validated_data.get('promo_code')
        if promo_code:
            try:
                promo = PromoCode.objects.get(code=promo_code)
                if promo.is_valid() and subtotal >= promo.min_purchase:
                    if promo.discount_type == 'percentage':
                        discount = subtotal * (promo.discount_value / 100)
                    else:
                        discount = promo.discount_value
                    promo.times_used += 1
                    promo.save()
            except PromoCode.DoesNotExist:
                pass
        
        total = subtotal + shipping_cost + tax - discount
        
        # Create order
        order = Order.objects.create(
            **validated_data,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax=tax,
            discount_amount=discount,
            total=total,
            payment_status='pending'
        )
        
        # Create order items
        for item_data in items_data:
            OrderItem.objects.create(
                order=order,
                product_id=item_data.get('product_id'),
                variant_id=item_data.get('variant_id'),
                product_name=item_data['name'],
                product_image=item_data.get('image', ''),
                variant_label=item_data.get('variant_label', ''),
                quantity=item_data['quantity'],
                price=item_data['price']
            )
        
        return order


class PaystackInitializeSerializer(serializers.Serializer):
    """Serializer for initializing Paystack payment"""
    order_id = serializers.CharField()
    callback_url = serializers.URLField(required=False)


class PaystackVerifySerializer(serializers.Serializer):
    """Serializer for verifying Paystack payment"""
    reference = serializers.CharField()


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'variant', 'quantity', 'price', 'subtotal']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'session_key', 'items', 'total_items', 'subtotal', 'created_at', 'updated_at']


class PromoCodeSerializer(serializers.ModelSerializer):
    is_valid = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = PromoCode
        fields = [
            'code', 'description', 'discount_type', 'discount_value',
            'min_purchase', 'is_valid'
        ]
