"""
URL configuration for fragrance backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def api_root(request):
    return JsonResponse({
        "message": "Babs Fragrance API",
        "version": "1.0.0",
        "endpoints": {
            "admin": "/admin/",
            "api_docs": "/api/docs/",
            "products": "/api/products/",
            "collections": "/api/collections/",
            "orders": "/api/orders/",
            "announcements": "/api/announcements/",
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/products/', include('products.urls')),
    path('api/collections/', include('product_collections.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/announcements/', include('announcements.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
