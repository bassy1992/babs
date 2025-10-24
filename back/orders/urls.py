from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, CartViewSet, PromoCodeViewSet

router = DefaultRouter()
router.register(r'', OrderViewSet, basename='order')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'promo', PromoCodeViewSet, basename='promo')

urlpatterns = [
    path('', include(router.urls)),
]
