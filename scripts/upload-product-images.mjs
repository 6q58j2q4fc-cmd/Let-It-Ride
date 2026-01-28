// Script to upload product images to S3 and update database
// Run with: node scripts/upload-product-images.mjs

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const DATABASE_URL = process.env.DATABASE_URL;
const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!DATABASE_URL || !FORGE_API_URL || !FORGE_API_KEY) {
  console.error('Required environment variables: DATABASE_URL, BUILT_IN_FORGE_API_URL, BUILT_IN_FORGE_API_KEY');
  process.exit(1);
}

// Map of product slugs to their downloaded image files
const productImages = {
  // Pedego bikes
  'pedego-avenue': '/home/ubuntu/upload/search_images/igJw0qDR3w7j.jpg',
  'pedego-interceptor': '/home/ubuntu/upload/search_images/sKWQeTCWR620.jpg',
  'pedego-interceptor-platinum': '/home/ubuntu/upload/search_images/fMLlOFLRV6Q0.jpg',
  'pedego-boomerang': '/home/ubuntu/upload/search_images/YaIFbE1HItba.jpg',
  'pedego-boomerang-platinum': '/home/ubuntu/upload/search_images/5YSe3KkGhCKV.jpg',
  'pedego-element': '/home/ubuntu/upload/search_images/A3F4Xehv0eUA.jpg',
  'pedego-element-platinum': '/home/ubuntu/upload/search_images/6JoukPcg990V.jpg',
  'pedego-city-commuter': '/home/ubuntu/upload/search_images/B9F4WbkduDSg.jpg',
  'pedego-cargo': '/home/ubuntu/upload/search_images/k3ZpCKe0haNs.jpg',
  'pedego-moto': '/home/ubuntu/upload/search_images/TKw9cEGs1VWb.jpg',
  'pedego-fat-tire-trike': '/home/ubuntu/upload/search_images/JXzn05jIKfAQ.jpg',
  
  // Urtopia bikes
  'urtopia-carbon-classic': '/home/ubuntu/upload/search_images/KS0gNEBTMI7N.jpg',
  'urtopia-carbon-classic-step-thru': '/home/ubuntu/upload/search_images/7xHGDQOX4PyW.jpg',
  'urtopia-carbon-1-pro': '/home/ubuntu/upload/search_images/fR7OmdYsxcUV.webp',
  'urtopia-carbon-1-step-thru': '/home/ubuntu/upload/search_images/nDumwJKIVHq2.jpg',
  'urtopia-joy-carbon': '/home/ubuntu/upload/search_images/VbgsRiqcr2dr.jpg',
  'urtopia-joy-carbon-ultra': '/home/ubuntu/upload/search_images/ugkZY5ukY2b8.png',
  'urtopia-carbon-fold-1': '/home/ubuntu/upload/search_images/ZkZ4L2CUfdMl.webp',
  'urtopia-carbon-fold-step-thru': '/home/ubuntu/upload/search_images/r2OwGvIfxfQi.webp',
  'urtopia-carbon-fusion-pro': '/home/ubuntu/upload/search_images/g7EG9haWpWWJ.jpg',
  'urtopia-carbon-fusion-gt': '/home/ubuntu/upload/search_images/Z0rmbI9SHJwC.jpg'
};

async function uploadToS3(filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  
  let contentType = 'image/jpeg';
  if (ext === '.png') contentType = 'image/png';
  else if (ext === '.webp') contentType = 'image/webp';
  
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const key = `products/${fileName}-${randomSuffix}${ext}`;
  
  // Build the upload URL
  const baseUrl = FORGE_API_URL.endsWith('/') ? FORGE_API_URL : `${FORGE_API_URL}/`;
  const uploadUrl = new URL('v1/storage/upload', baseUrl);
  uploadUrl.searchParams.set('path', key);
  
  // Create form data with the file
  const blob = new Blob([fileBuffer], { type: contentType });
  const formData = new FormData();
  formData.append('file', blob, path.basename(filePath));
  
  const response = await fetch(uploadUrl.toString(), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FORGE_API_KEY}`
    },
    body: formData
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Failed to upload ${fileName}: ${response.status} ${errorText}`);
  }
  
  const result = await response.json();
  return result.url;
}

async function updateProductImages() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection(DATABASE_URL);
  
  let successCount = 0;
  let failCount = 0;
  
  try {
    for (const [slug, imagePath] of Object.entries(productImages)) {
      if (!fs.existsSync(imagePath)) {
        console.log(`  ⚠ Image not found for ${slug}: ${imagePath}`);
        failCount++;
        continue;
      }
      
      console.log(`Uploading image for ${slug}...`);
      
      try {
        const imageUrl = await uploadToS3(imagePath, slug);
        
        // Update the product record
        await connection.execute(
          'UPDATE products SET image = ? WHERE slug = ?',
          [imageUrl, slug]
        );
        
        console.log(`  ✓ ${slug}`);
        successCount++;
      } catch (error) {
        console.log(`  ✗ Failed: ${error.message}`);
        failCount++;
      }
    }
    
    console.log(`\\n✅ Product image upload complete!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Failed: ${failCount}`);
    
  } catch (error) {
    console.error('Error updating product images:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

updateProductImages();
