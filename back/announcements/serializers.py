from rest_framework import serializers
from .models import Announcement


class AnnouncementSerializer(serializers.ModelSerializer):
    is_currently_active = serializers.ReadOnlyField()
    
    class Meta:
        model = Announcement
        fields = [
            'id',
            'title',
            'message',
            'announcement_type',
            'priority',
            'is_active',
            'is_currently_active',
            'show_on_homepage',
            'show_on_shop', 
            'show_on_all_pages',
            'background_color',
            'text_color',
            'link_url',
            'link_text',
            'start_date',
            'end_date',
            'created_at'
        ]