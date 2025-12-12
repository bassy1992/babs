from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from .models import Announcement
from .serializers import AnnouncementSerializer


class AnnouncementListView(generics.ListAPIView):
    """
    List all active announcements
    """
    serializer_class = AnnouncementSerializer
    
    def get_queryset(self):
        queryset = Announcement.objects.filter(is_active=True)
        
        # Filter by current date/time
        now = timezone.now()
        queryset = queryset.filter(start_date__lte=now)
        queryset = queryset.exclude(end_date__lt=now)
        
        # Filter by page type if specified
        page_type = self.request.query_params.get('page', None)
        if page_type == 'homepage':
            queryset = queryset.filter(show_on_homepage=True)
        elif page_type == 'shop':
            queryset = queryset.filter(show_on_shop=True)
        elif page_type == 'all':
            queryset = queryset.filter(show_on_all_pages=True)
        
        return queryset.order_by('-priority', '-start_date')


@api_view(['GET'])
def announcements_by_page(request, page_type):
    """
    Get announcements for a specific page type
    """
    valid_pages = ['homepage', 'shop', 'all']
    if page_type not in valid_pages:
        return Response(
            {'error': f'Invalid page type. Must be one of: {", ".join(valid_pages)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    now = timezone.now()
    queryset = Announcement.objects.filter(
        is_active=True,
        start_date__lte=now
    ).exclude(end_date__lt=now)
    
    if page_type == 'homepage':
        queryset = queryset.filter(show_on_homepage=True)
    elif page_type == 'shop':
        queryset = queryset.filter(show_on_shop=True)
    elif page_type == 'all':
        queryset = queryset.filter(show_on_all_pages=True)
    
    queryset = queryset.order_by('-priority', '-start_date')
    serializer = AnnouncementSerializer(queryset, many=True)
    
    return Response({
        'announcements': serializer.data,
        'count': len(serializer.data)
    })