from django.urls import path
from . import views

app_name = 'announcements'

urlpatterns = [
    path('', views.AnnouncementListView.as_view(), name='announcement-list'),
    path('<str:page_type>/', views.announcements_by_page, name='announcements-by-page'),
]