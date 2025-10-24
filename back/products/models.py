from django.db import models
from django.utils.text import slugify


class Product(models.Model):
    """Product model for fragrances"""
    
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField()
    story = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Product details
    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    badge = models.CharField(max_length=50, blank=True)
    
    # Ratings
    rating_average = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    rating_count = models.IntegerField(default=0)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    """Product images for gallery"""
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField(max_length=500)
    alt_text = models.CharField(max_length=200, blank=True)
    order = models.IntegerField(default=0)
    is_primary = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['order']
        
    def __str__(self):
        return f"{self.product.name} - Image {self.order}"


class ProductVariant(models.Model):
    """Product size/volume variants"""
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    label = models.CharField(max_length=100)
    volume = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sku = models.CharField(max_length=100, unique=True)
    stock = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['price']
        
    def __str__(self):
        return f"{self.product.name} - {self.label}"


class FragranceNote(models.Model):
    """Fragrance notes (top, heart, base)"""
    
    NOTE_TYPES = [
        ('top', 'Top'),
        ('heart', 'Heart'),
        ('base', 'Base'),
    ]
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='notes')
    note_type = models.CharField(max_length=10, choices=NOTE_TYPES)
    name = models.CharField(max_length=100)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['note_type', 'order']
        
    def __str__(self):
        return f"{self.product.name} - {self.note_type}: {self.name}"


class ProductHighlight(models.Model):
    """Product highlights/features"""
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='highlights')
    title = models.CharField(max_length=200)
    description = models.TextField()
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        
    def __str__(self):
        return f"{self.product.name} - {self.title}"


class RitualStep(models.Model):
    """Usage ritual steps"""
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='ritual_steps')
    step = models.TextField()
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        
    def __str__(self):
        return f"{self.product.name} - Step {self.order}"


class Ingredient(models.Model):
    """Product ingredients"""
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='ingredients')
    name = models.CharField(max_length=200)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        
    def __str__(self):
        return f"{self.product.name} - {self.name}"
