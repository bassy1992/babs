from django.core.management.base import BaseCommand
from products.models import (
    Product, ProductImage, ProductVariant, FragranceNote,
    ProductHighlight, RitualStep, Ingredient
)
from product_collections.models import ProductCollection


class Command(BaseCommand):
    help = 'Populate database with sample fragrance products'

    def handle(self, *args, **kwargs):
        self.stdout.write('Populating database...')
        
        # Clear existing data
        Product.objects.all().delete()
        ProductCollection.objects.all().delete()
        
        # Create products
        products_data = [
            {
                'id': 'noir-bouquet',
                'name': 'Noir Bouquet',
                'description': 'Velvety florals illuminated by smoked amber and rare Madagascan vanilla for a lingering, magnetic aura.',
                'story': 'Inspired by midnight garden salons in Paris, Noir Bouquet captures the contrast of blooming roses against crisp evening air.',
                'price': 89,
                'is_featured': True,
                'is_bestseller': True,
                'badge': 'Bestseller',
                'rating_average': 4.8,
                'rating_count': 312,
                'images': [
                    'https://images.unsplash.com/photo-1604937455095-ef2fe3d842b6?q=80&w=1600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1549887534-1e8a0f3b4d9c?q=80&w=1600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1526745920543-275d4b786d9d?q=80&w=1600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1542639096-0dca574b3cf4?q=80&w=1600&auto=format&fit=crop',
                ],
                'variants': [
                    {'label': 'Extrait 50ml', 'volume': '50ml', 'price': 89, 'sku': 'NB-50'},
                    {'label': 'Extrait 100ml', 'volume': '100ml', 'price': 138, 'sku': 'NB-100'},
                    {'label': 'Discovery 10ml', 'volume': '10ml', 'price': 32, 'sku': 'NB-10'},
                ],
                'notes': {
                    'top': ['Italian bergamot', 'Crushed fig leaf'],
                    'heart': ['Velvet rose', 'Saffron petal'],
                    'base': ['Smoked amber', 'Creamy sandalwood'],
                },
                'highlights': [
                    {
                        'title': '12-hour sillage',
                        'description': 'High concentration extrait ensures a luxurious, enduring projection from day to evening.',
                    },
                    {
                        'title': 'Skin-first base',
                        'description': 'Crafted with organic sugarcane alcohol and nourishing botanicals for a soft, non-drying finish.',
                    },
                    {
                        'title': 'Responsible sourcing',
                        'description': 'Partnerships with fair-trade growers across Madagascar, Grasse, and Morocco.',
                    },
                ],
                'ritual': [
                    'Mist once over hair to create a diffused trail.',
                    'Layer with Velvet Evenings oil on pulse points for depth.',
                    'Refresh mid-afternoon with the 10ml discovery vial.',
                ],
                'ingredients': [
                    'Organic grain alcohol', 'Rose absolute', 'Fig leaf accord',
                    'Amber resin', 'Sandalwood', 'Vanilla bean',
                ],
            },
            {
                'id': 'rose-velours',
                'name': 'Rose Velours',
                'description': 'A plush blend of rose de mai, blackcurrant bud, and cashmere woods that wraps the senses in warmth.',
                'story': 'Rose Velours nods to gilded lounges in Marrakech, where velvet drapes absorb candlelight and rose petals perfuse the air.',
                'price': 79,
                'is_featured': True,
                'rating_average': 4.7,
                'rating_count': 204,
                'images': [
                    'https://images.unsplash.com/photo-1601688246360-68d1bb27b3f7?q=80&w=1600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1514866726862-0f081731e63f?q=80&w=1600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop',
                ],
                'variants': [
                    {'label': 'Parfum 50ml', 'volume': '50ml', 'price': 79, 'sku': 'RV-50'},
                    {'label': 'Parfum 100ml', 'volume': '100ml', 'price': 126, 'sku': 'RV-100'},
                    {'label': 'Layering oil 15ml', 'volume': '15ml', 'price': 45, 'sku': 'RV-15'},
                ],
                'notes': {
                    'top': ['Pink pepper', 'Blackcurrant bud'],
                    'heart': ['Rose de mai', 'Indian jasmine'],
                    'base': ['Cashmere wood', 'White musk'],
                },
                'highlights': [
                    {
                        'title': 'Soft-focus aura',
                        'description': 'Microfine musk accord diffuses on skin for a gossamer veil.',
                    },
                    {
                        'title': 'Cruelty-free',
                        'description': 'Certified vegan, no animal-derived ingredients or testing.',
                    },
                    {
                        'title': 'Refill eligible',
                        'description': 'Bring back empty bottles for 20% off your refill in-store.',
                    },
                ],
                'ritual': [
                    'Pair with Botanical Library mist for a luminous floral cloud.',
                    'Apply to cashmere or silk scarves to enhance natural fibers.',
                    'Diffuse two sprays in your closet to scent evening wear.',
                ],
                'ingredients': [
                    'Alcohol denat.', 'Rosa centifolia', 'Cassis absolute',
                    'Jasmine sambac', 'Cashmeran',
                ],
            },
            {
                'id': 'amber-dusk',
                'name': 'Amber Dusk',
                'description': 'Resinous amber swirled with roasted tonka and smoked vetiver, reminiscent of golden-hour bonfires.',
                'story': 'Amber Dusk traces the warmth of coastal sunsets, capturing the glow of embers and salted skin.',
                'price': 95,
                'is_featured': True,
                'rating_average': 4.9,
                'rating_count': 178,
                'images': [
                    'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=1600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?q=80&w=1600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?q=80&w=1600&auto=format&fit=crop',
                ],
                'variants': [
                    {'label': 'Parfum 50ml', 'volume': '50ml', 'price': 95, 'sku': 'AD-50'},
                    {'label': 'Parfum 100ml', 'volume': '100ml', 'price': 148, 'sku': 'AD-100'},
                    {'label': 'Travel spray 8ml', 'volume': '8ml', 'price': 34, 'sku': 'AD-8'},
                ],
                'notes': {
                    'top': ['Pink pepper', 'Sea salt'],
                    'heart': ['Amber resin', 'Cedarwood'],
                    'base': ['Roasted tonka', 'Smoked vetiver'],
                },
                'highlights': [
                    {
                        'title': 'After-dusk energy',
                        'description': 'Built for evenings out with an addictive gourmand-amber finish.',
                    },
                    {
                        'title': 'Climate conscious',
                        'description': 'Bottle crafted from 40% recycled glass and FSC-certified packaging.',
                    },
                    {
                        'title': 'Complimentary engraving',
                        'description': 'Personalize the 100ml bottle with monogram engraving in-store.',
                    },
                ],
                'ritual': [
                    'Mist onto wrists and brush through hair for a luminous trail.',
                    'Blend with Noir Bouquet to dial up smokiness.',
                    'Diffuse two sprays into a silk-lined travel case before packing.',
                ],
                'ingredients': [
                    'Alcohol denat.', 'Amber accord', 'Cedarwood',
                    'Tonka bean', 'Vetiver',
                ],
            },
            {
                'id': 'citrus-bloom',
                'name': 'Citrus Bloom',
                'description': 'Sunlit neroli entwined with yuzu zest and white tea for a sparkling, luminous lift.',
                'story': 'Citrus Bloom channels Riviera mornings, brimming with Mediterranean light and orchard breezes.',
                'price': 72,
                'is_featured': True,
                'rating_average': 4.6,
                'rating_count': 241,
                'images': [
                    'https://images.unsplash.com/photo-1547887537-6158d64c30af?q=80&w=1600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1521417531039-75e91486cc00?q=80&w=1600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1520975922284-6c7d53a481d0?q=80&w=1600&auto=format&fit=crop',
                ],
                'variants': [
                    {'label': 'Eau de parfum 50ml', 'volume': '50ml', 'price': 72, 'sku': 'CB-50'},
                    {'label': 'Eau de parfum 100ml', 'volume': '100ml', 'price': 118, 'sku': 'CB-100'},
                    {'label': 'Body veil 75ml', 'volume': '75ml', 'price': 48, 'sku': 'CB-75'},
                ],
                'notes': {
                    'top': ['Yuzu zest', 'Green mandarin'],
                    'heart': ['Orange blossom', 'White tea'],
                    'base': ['Musk', 'Hinoki'],
                },
                'highlights': [
                    {
                        'title': 'Effervescent clarity',
                        'description': 'Bright citrus accord diffuses instantly for an uplifting start.',
                    },
                    {
                        'title': 'Skin-friendly',
                        'description': 'Infused with aloe vera to calm and hydrate the skin.',
                    },
                    {
                        'title': 'Carry-on ready',
                        'description': 'Leak-proof atomizer designed for effortless travel.',
                    },
                ],
                'ritual': [
                    'Spritz before sunrise yoga for an energizing reset.',
                    'Layer with Botanical Library hair mist for a luminous cloud.',
                    'Apply to pulse points after moisturizing to enhance longevity.',
                ],
                'ingredients': [
                    'Alcohol denat.', 'Neroli', 'Yuzu', 'White tea', 'Musk accord',
                ],
            },
        ]
        
        for product_data in products_data:
            # Create product
            product = Product.objects.create(
                id=product_data['id'],
                name=product_data['name'],
                description=product_data['description'],
                story=product_data['story'],
                price=product_data['price'],
                is_featured=product_data.get('is_featured', False),
                is_bestseller=product_data.get('is_bestseller', False),
                badge=product_data.get('badge', ''),
                rating_average=product_data.get('rating_average', 0),
                rating_count=product_data.get('rating_count', 0),
            )
            
            # Create images
            for idx, image_url in enumerate(product_data['images']):
                ProductImage.objects.create(
                    product=product,
                    image_url=image_url,
                    order=idx,
                    is_primary=(idx == 0)
                )
            
            # Create variants
            for variant_data in product_data['variants']:
                ProductVariant.objects.create(
                    product=product,
                    label=variant_data['label'],
                    volume=variant_data['volume'],
                    price=variant_data['price'],
                    sku=variant_data['sku'],
                    stock=100,
                    is_available=True
                )
            
            # Create notes
            for note_type, notes in product_data['notes'].items():
                for idx, note_name in enumerate(notes):
                    FragranceNote.objects.create(
                        product=product,
                        note_type=note_type,
                        name=note_name,
                        order=idx
                    )
            
            # Create highlights
            for idx, highlight in enumerate(product_data['highlights']):
                ProductHighlight.objects.create(
                    product=product,
                    title=highlight['title'],
                    description=highlight['description'],
                    order=idx
                )
            
            # Create ritual steps
            for idx, step in enumerate(product_data['ritual']):
                RitualStep.objects.create(
                    product=product,
                    step=step,
                    order=idx
                )
            
            # Create ingredients
            for idx, ingredient in enumerate(product_data['ingredients']):
                Ingredient.objects.create(
                    product=product,
                    name=ingredient,
                    order=idx
                )
            
            self.stdout.write(self.style.SUCCESS(f'Created product: {product.name}'))
        
        # Create collections
        collections_data = [
            {
                'title': 'Atelier Collection',
                'description': 'Limited extrait editions handcrafted in micro batches.',
                'image': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400&auto=format&fit=crop',
                'is_featured': True,
            },
            {
                'title': 'Botanical Library',
                'description': 'Crisp florals layered with rare citrus absolutes.',
                'image': 'https://images.unsplash.com/photo-1528150177500-4c6bb07b44f2?q=80&w=1400&auto=format&fit=crop',
                'is_featured': True,
            },
            {
                'title': 'Velvet Evenings',
                'description': 'Smoky ambers and musks inspired by golden hour.',
                'image': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1400&auto=format&fit=crop',
                'is_featured': True,
            },
        ]
        
        for collection_data in collections_data:
            collection = ProductCollection.objects.create(**collection_data)
            # Add some products to each collection
            products = Product.objects.all()[:2]
            collection.products.set(products)
            self.stdout.write(self.style.SUCCESS(f'Created collection: {collection.title}'))
        
        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
