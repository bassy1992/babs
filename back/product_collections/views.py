from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from .models import ProductCollection
from .serializers import CollectionListSerializer, CollectionDetailSerializer


@method_decorator(cache_page(60 * 15), name='list')  # Cache list for 15 minutes
@method_decorator(cache_page(60 * 30), name='retrieve')  # Cache detail for 30 minutes
class CollectionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing collections.
    
    list: Get all collections
    retrieve: Get a single collection by slug
    featured: Get featured collections
    """
    
    queryset = ProductCollection.objects.filter(is_active=True).prefetch_related('collection_products')
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CollectionDetailSerializer
        return CollectionListSerializer
    
    @action(detail=False, methods=['get'])
    @method_decorator(cache_page(60 * 30))  # Cache for 30 minutes
    def featured(self, request):
        """Get featured collections"""
        featured = self.queryset.filter(is_featured=True)[:6]
        serializer = CollectionListSerializer(featured, many=True)
        return Response(serializer.data)
