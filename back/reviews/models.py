from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from products.models import Product


class Review(models.Model):
    """Product reviews and ratings"""
    
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    
    # Customer information
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    
    # Review content
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text='Rating from 1 to 5 stars'
    )
    title = models.CharField(max_length=200)
    comment = models.TextField()
    
    # Verification
    is_verified_purchase = models.BooleanField(default=False)
    
    # Moderation
    is_approved = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Review'
        verbose_name_plural = 'Reviews'
        indexes = [
            models.Index(fields=['product', '-created_at']),
            models.Index(fields=['is_approved', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.customer_name} - {self.product.name} ({self.rating}★)"
    
    @property
    def rating_display(self):
        """Return rating as stars"""
        return '★' * self.rating + '☆' * (5 - self.rating)
