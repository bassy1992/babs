# Favicon Generation Instructions

## Required Favicon Sizes

To complete the favicon setup, you'll need to generate the following PNG files from the logo:

### Standard Favicons
- `favicon-16x16.png` (16x16px)
- `favicon-32x32.png` (32x32px) 
- `favicon-48x48.png` (48x48px)
- `favicon.ico` (multi-size ICO file containing 16x16, 32x32, 48x48)

### Android Chrome Icons
- `android-chrome-192x192.png` (192x192px)
- `android-chrome-512x512.png` (512x512px)

### Apple Touch Icons
- `apple-touch-icon.png` (180x180px)
- `apple-touch-icon-152x152.png` (152x152px)
- `apple-touch-icon-144x144.png` (144x144px)
- `apple-touch-icon-120x120.png` (120x120px)
- `apple-touch-icon-114x114.png` (114x114px)
- `apple-touch-icon-76x76.png` (76x76px)
- `apple-touch-icon-72x72.png` (72x72px)
- `apple-touch-icon-60x60.png` (60x60px)
- `apple-touch-icon-57x57.png` (57x57px)

### Microsoft Tiles
- `mstile-70x70.png` (70x70px)
- `mstile-144x144.png` (144x144px)
- `mstile-150x150.png` (150x150px)
- `mstile-310x150.png` (310x150px)
- `mstile-310x310.png` (310x310px)

### Social Media Images
- `og-image.png` (1200x630px) - Open Graph image
- `twitter-image.png` (1200x600px) - Twitter card image

## Generation Methods

### Option 1: Online Favicon Generators
1. Use the logo image with these online tools:
   - [Favicon.io](https://favicon.io/)
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [Favicon Generator](https://www.favicon-generator.org/)

### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
# Then use the logo image to generate different sizes

# Standard favicons
convert logo.png -resize 16x16 favicon-16x16.png
convert logo.png -resize 32x32 favicon-32x32.png
convert logo.png -resize 48x48 favicon-48x48.png

# Android Chrome
convert logo.png -resize 192x192 android-chrome-192x192.png
convert logo.png -resize 512x512 android-chrome-512x512.png

# Apple Touch Icons
convert logo.png -resize 180x180 apple-touch-icon.png
convert logo.png -resize 152x152 apple-touch-icon-152x152.png
# ... continue for other sizes

# Create ICO file
convert favicon-16x16.png favicon-32x32.png favicon-48x48.png favicon.ico
```

### Option 3: Using Node.js Script
```javascript
const sharp = require('sharp');
const fs = require('fs');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  // ... add other sizes
];

async function generateFavicons() {
  for (const { name, size } of sizes) {
    await sharp('logo.png')
      .resize(size, size)
      .png()
      .toFile(`public/${name}`);
  }
}

generateFavicons();
```

## Logo Requirements

For best results, the source logo should be:
- High resolution (at least 512x512px)
- Square aspect ratio
- PNG format with transparent background
- Simple design that works at small sizes

## Testing

After generating the favicons, test them by:
1. Loading the website in different browsers
2. Checking browser tabs for the favicon
3. Adding to home screen on mobile devices
4. Sharing on social media to test Open Graph images

## Current Setup

The HTML head already includes all necessary favicon links and meta tags. Once you generate the image files and place them in the `public/` directory, the favicons will work automatically.