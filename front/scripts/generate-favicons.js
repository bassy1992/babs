#!/usr/bin/env node

/**
 * Favicon Generator Script
 * 
 * This script generates all required favicon sizes from a source logo image.
 * 
 * Requirements:
 * - Node.js
 * - Sharp package: npm install sharp
 * - Source logo image (preferably 512x512px or larger)
 * 
 * Usage:
 * node scripts/generate-favicons.js path/to/logo.png
 */

const fs = require('fs');
const path = require('path');

// Check if Sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('Sharp is not installed. Please run: npm install sharp');
  process.exit(1);
}

// Favicon configurations
const faviconSizes = [
  // Standard favicons
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  
  // Android Chrome icons
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  
  // Apple Touch Icons
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'apple-touch-icon-152x152.png', size: 152 },
  { name: 'apple-touch-icon-144x144.png', size: 144 },
  { name: 'apple-touch-icon-120x120.png', size: 120 },
  { name: 'apple-touch-icon-114x114.png', size: 114 },
  { name: 'apple-touch-icon-76x76.png', size: 76 },
  { name: 'apple-touch-icon-72x72.png', size: 72 },
  { name: 'apple-touch-icon-60x60.png', size: 60 },
  { name: 'apple-touch-icon-57x57.png', size: 57 },
  
  // Microsoft Tiles
  { name: 'mstile-70x70.png', size: 70 },
  { name: 'mstile-144x144.png', size: 144 },
  { name: 'mstile-150x150.png', size: 150 },
  { name: 'mstile-310x310.png', size: 310 },
];

// Special sizes for Microsoft wide tile and social media
const specialSizes = [
  { name: 'mstile-310x150.png', width: 310, height: 150 },
  { name: 'og-image.png', width: 1200, height: 630 },
  { name: 'twitter-image.png', width: 1200, height: 600 },
];

async function generateFavicons(logoPath) {
  const outputDir = path.join(process.cwd(), 'public');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Check if source logo exists
  if (!fs.existsSync(logoPath)) {
    console.error(`Source logo not found: ${logoPath}`);
    process.exit(1);
  }
  
  console.log(`Generating favicons from: ${logoPath}`);
  console.log(`Output directory: ${outputDir}`);
  
  try {
    // Generate square favicons
    for (const { name, size } of faviconSizes) {
      const outputPath = path.join(outputDir, name);
      
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated ${name} (${size}x${size})`);
    }
    
    // Generate special sized images
    for (const { name, width, height } of specialSizes) {
      const outputPath = path.join(outputDir, name);
      
      if (name.includes('og-image') || name.includes('twitter-image')) {
        // For social media images, create a centered logo on branded background
        await sharp({
          create: {
            width,
            height,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          }
        })
        .composite([{
          input: await sharp(logoPath)
            .resize(Math.min(width * 0.6, height * 0.6), Math.min(width * 0.6, height * 0.6), {
              fit: 'contain',
              background: { r: 255, g: 255, b: 255, alpha: 0 }
            })
            .png()
            .toBuffer(),
          gravity: 'center'
        }])
        .png()
        .toFile(outputPath);
      } else {
        // For Microsoft tiles, fit the logo within the dimensions
        await sharp(logoPath)
          .resize(width, height, {
            fit: 'contain',
            background: { r: 233, g: 30, b: 99, alpha: 1 } // Brand color background
          })
          .png()
          .toFile(outputPath);
      }
      
      console.log(`✓ Generated ${name} (${width}x${height})`);
    }
    
    // Generate ICO file (requires multiple sizes)
    const icoSizes = [16, 32, 48];
    const icoBuffers = [];
    
    for (const size of icoSizes) {
      const buffer = await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toBuffer();
      icoBuffers.push(buffer);
    }
    
    // Note: Sharp doesn't support ICO format directly
    // You'll need to use an online converter or another tool for favicon.ico
    console.log('⚠ Note: favicon.ico needs to be generated separately from the PNG files');
    console.log('  You can use an online converter or ImageMagick:');
    console.log('  convert favicon-16x16.png favicon-32x32.png favicon-48x48.png favicon.ico');
    
    console.log('\n🎉 Favicon generation complete!');
    console.log('\nGenerated files:');
    console.log('- Standard favicons: 16x16, 32x32, 48x48');
    console.log('- Android Chrome icons: 192x192, 512x512');
    console.log('- Apple Touch icons: Various sizes from 57x57 to 180x180');
    console.log('- Microsoft tiles: Various sizes including wide tile');
    console.log('- Social media images: Open Graph and Twitter cards');
    
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

// Main execution
const logoPath = process.argv[2];

if (!logoPath) {
  console.error('Usage: node scripts/generate-favicons.js <path-to-logo>');
  console.error('Example: node scripts/generate-favicons.js logo.png');
  process.exit(1);
}

generateFavicons(logoPath);