from django.db import models
from django.utils.text import slugify
from products.models import Product


class ProductCollection(models.Model):
    """Product collections (e.g., Atelier, Botanical Library, Velvet Evenings)"""
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField()
    image = models.URLField(max_length=500)
    products = models.ManyToManyField(Product, related_name='collections', blank=True)
    
    # Display settings
    is_featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order', '-created_at']
        
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    @property
    def product_count(self):
        return self.products.count()
