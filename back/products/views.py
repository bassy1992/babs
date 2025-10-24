from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Product
from .serializers import ProductListSerializer, ProductDetailSerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing products.
    
    list: Get all products with optional filtering and search
    retrieve: Get a single product by slug or ID
    featured: Get featured products
    bestsellers: Get bestseller products
    search: Search products by name or description
    """
    
    queryset = Product.objects.filter(is_active=True).prefetch_related(
        'images', 'variants', 'notes', 'highlights', 'ritual_steps', 'ingredients'
    )
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'story']
    ordering_fields = ['price', 'created_at', 'rating_average', 'name']
    ordering = ['-created_at']
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filter by featured/bestseller
        is_featured = self.request.query_params.get('featured')
        is_bestseller = self.request.query_params.get('bestseller')
        
        if is_featured == 'true':
            queryset = queryset.filter(is_featured=True)
        if is_bestseller == 'true':
            queryset = queryset.filter(is_bestseller=True)
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        """Get product by slug or ID"""
        slug_or_id = kwargs.get('slug')
        try:
            # Try to get by slug first
            instance = self.queryset.get(slug=slug_or_id)
        except Product.DoesNotExist:
            # Try by ID
            try:
                instance = self.queryset.get(id=slug_or_id)
            except Product.DoesNotExist:
                return Response({'detail': 'Not found.'}, status=404)
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products"""
        featured_products = self.queryset.filter(is_featured=True)[:4]
        serializer = ProductListSerializer(featured_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def bestsellers(self, request):
        """Get bestseller products"""
        bestsellers = self.queryset.filter(is_bestseller=True)[:4]
        serializer = ProductListSerializer(bestsellers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search products"""
        query = request.query_params.get('q', '')
        if query:
            products = self.queryset.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(story__icontains=query)
            )
        else:
            products = self.queryset.all()
        
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def related(self, request, slug=None):
        """Get related products"""
        product = self.get_object()
        # Simple related logic: exclude current product, get 3 random
        related = self.queryset.exclude(id=product.id).order_by('?')[:3]
        serializer = ProductListSerializer(related, many=True)
        return Response(serializer.data)
