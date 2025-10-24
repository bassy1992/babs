from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ProductCollection
from .serializers import CollectionListSerializer, CollectionDetailSerializer


class CollectionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing collections.
    
    list: Get all collections
    retrieve: Get a single collection by slug
    featured: Get featured collections
    """
    
    queryset = ProductCollection.objects.filter(is_active=True).prefetch_related('products')
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CollectionDetailSerializer
        return CollectionListSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured collections"""
        featured = self.queryset.filter(is_featured=True)[:3]
        serializer = CollectionListSerializer(featured, many=True)
        return Response(serializer.data)
