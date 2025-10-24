from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.conf import settings
from decouple import config
from .models import Order, Cart, CartItem, PromoCode
from .serializers import (
    OrderSerializer, OrderCreateSerializer,
    CartSerializer, CartItemSerializer, PromoCodeSerializer,
    PaystackInitializeSerializer, PaystackVerifySerializer
)
from .paystack import paystack
from products.models import Product, ProductVariant


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing orders.
    
    list: Get all orders (for authenticated user)
    retrieve: Get a single order
    create: Create a new order
    initialize_payment: Initialize Paystack payment
    verify_payment: Verify Paystack payment
    """
    
    queryset = Order.objects.all().prefetch_related('items')
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action == 'initialize_payment':
            return PaystackInitializeSerializer
        elif self.action == 'verify_payment':
            return PaystackVerifySerializer
        return OrderSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by user if authenticated
        if self.request.user.is_authenticated:
            queryset = queryset.filter(user=self.request.user)
        
        # Filter by email for guest checkout
        email = self.request.query_params.get('email')
        if email:
            queryset = queryset.filter(email=email)
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def confirmation(self, request, pk=None):
        """Get order confirmation details"""
        order = self.get_object()
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def initialize_payment(self, request):
        """
        Initialize Paystack payment for an order
        
        POST /api/orders/initialize_payment/
        {
            "order_id": "ORD123456",
            "callback_url": "http://localhost:8080/order/ORD123456/confirmation"
        }
        """
        serializer = PaystackInitializeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        order_id = serializer.validated_data['order_id']
        callback_url = serializer.validated_data.get('callback_url')
        
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Generate unique reference
        reference = f"PAY-{order.id}-{order.created_at.timestamp()}"
        
        # Initialize payment with Paystack
        result = paystack.initialize_transaction(
            email=order.email,
            amount=float(order.total),
            reference=reference,
            callback_url=callback_url,
            metadata={
                'order_id': order.id,
                'customer_name': order.full_name,
                'items_count': order.items.count(),
            }
        )
        
        if result.get('status'):
            # Save payment reference to order
            order.payment_reference = reference
            order.payment_method = 'paystack'
            order.save()
            
            return Response({
                'status': True,
                'message': 'Payment initialized successfully',
                'data': {
                    'authorization_url': result['data']['authorization_url'],
                    'access_code': result['data']['access_code'],
                    'reference': reference,
                }
            })
        else:
            return Response(
                {
                    'status': False,
                    'message': result.get('message', 'Failed to initialize payment')
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        """
        Verify Paystack payment
        
        POST /api/orders/verify_payment/
        {
            "reference": "PAY-ORD123456-1234567890"
        }
        """
        serializer = PaystackVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        reference = serializer.validated_data['reference']
        
        # Verify payment with Paystack
        result = paystack.verify_transaction(reference)
        
        if result.get('status') and result.get('data', {}).get('status') == 'success':
            # Find order by reference
            try:
                order = Order.objects.get(payment_reference=reference)
                order.payment_status = 'paid'
                order.status = 'processing'
                order.save()
                
                return Response({
                    'status': True,
                    'message': 'Payment verified successfully',
                    'data': {
                        'order_id': order.id,
                        'amount': float(order.total),
                        'status': order.payment_status,
                    }
                })
            except Order.DoesNotExist:
                return Response(
                    {'error': 'Order not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(
                {
                    'status': False,
                    'message': 'Payment verification failed'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def paystack_config(self, request):
        """Get Paystack public key for frontend"""
        return Response({
            'public_key': config('PAYSTACK_PUBLIC_KEY', default='')
        })


class CartViewSet(viewsets.ViewSet):
    """
    ViewSet for managing shopping cart.
    
    retrieve: Get cart by session key
    add_item: Add item to cart
    update_item: Update item quantity
    remove_item: Remove item from cart
    clear: Clear all items from cart
    """
    
    permission_classes = [AllowAny]
    
    def _get_or_create_cart(self, session_key):
        """Get or create cart by session key"""
        cart, created = Cart.objects.get_or_create(session_key=session_key)
        return cart
    
    def retrieve(self, request, pk=None):
        """Get cart by session key"""
        cart = self._get_or_create_cart(pk)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        """Add item to cart"""
        cart = self._get_or_create_cart(pk)
        
        product_id = request.data.get('product_id')
        variant_id = request.data.get('variant_id')
        quantity = int(request.data.get('quantity', 1))
        
        try:
            product = Product.objects.get(id=product_id)
            variant = ProductVariant.objects.get(id=variant_id) if variant_id else None
            
            # Check if item already exists in cart
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                variant=variant,
                defaults={'quantity': quantity}
            )
            
            if not created:
                # Update quantity if item already exists
                cart_item.quantity += quantity
                cart_item.save()
            
            serializer = CartSerializer(cart)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['patch'])
    def update_item(self, request, pk=None):
        """Update cart item quantity"""
        cart = self._get_or_create_cart(pk)
        
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity', 1))
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            cart_item.quantity = max(1, quantity)
            cart_item.save()
            
            serializer = CartSerializer(cart)
            return Response(serializer.data)
            
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Cart item not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['delete'])
    def remove_item(self, request, pk=None):
        """Remove item from cart"""
        cart = self._get_or_create_cart(pk)
        
        item_id = request.data.get('item_id')
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            cart_item.delete()
            
            serializer = CartSerializer(cart)
            return Response(serializer.data)
            
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Cart item not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def clear(self, request, pk=None):
        """Clear all items from cart"""
        cart = self._get_or_create_cart(pk)
        cart.items.all().delete()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class PromoCodeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for promo codes.
    
    validate: Validate a promo code
    """
    
    queryset = PromoCode.objects.filter(is_active=True)
    serializer_class = PromoCodeSerializer
    permission_classes = [AllowAny]
    lookup_field = 'code'
    
    @action(detail=True, methods=['post'])
    def validate(self, request, code=None):
        """Validate a promo code"""
        try:
            promo = PromoCode.objects.get(code=code)
            
            if not promo.is_valid():
                return Response(
                    {'valid': False, 'message': 'Promo code is not valid or has expired'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            subtotal = float(request.data.get('subtotal', 0))
            
            if subtotal < float(promo.min_purchase):
                return Response(
                    {
                        'valid': False,
                        'message': f'Minimum purchase of {promo.min_purchase} required'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate discount
            if promo.discount_type == 'percentage':
                discount = subtotal * (float(promo.discount_value) / 100)
            else:
                discount = float(promo.discount_value)
            
            serializer = self.get_serializer(promo)
            return Response({
                'valid': True,
                'promo': serializer.data,
                'discount_amount': discount
            })
            
        except PromoCode.DoesNotExist:
            return Response(
                {'valid': False, 'message': 'Promo code not found'},
                status=status.HTTP_404_NOT_FOUND
            )
