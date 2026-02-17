import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
const BLOG_DIR = 'src/blog';
const PUBLIC_DIR = 'public';
const MAX_WIDTH = 800;

async function checkImageSizes() {
  console.log('Checking image sizes in blog frontmatter...\n');
  
  const oversizedImages = [];
  
  // Recursively find all markdown files
  async function findMarkdownFiles(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    const results = [];
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        results.push(...await findMarkdownFiles(fullPath));
      } else if (file.name.endsWith('.md')) {
        results.push(fullPath);
      }
    }
    
    return results;
  }
  
  // Extract image URL from frontmatter
  function extractImageUrl(frontmatterText) {
    const imageMatch = frontmatterText.match(/image:\s*\n\s*url:\s*["']([^"']+)["']/);
    return imageMatch ? imageMatch[1] : null;
  }
  
  // Get image dimensions using sharp
  async function getImageDimensions(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      return { width: metadata.width, height: metadata.height };
    } catch (error) {
      console.log(`⚠️  Could not read dimensions for ${imagePath}: ${error.message}`);
      return null;
    }
  }
  
  // Resize image using sharp
  async function resizeImage(imagePath, newWidth) {
    try {
      const backupPath = imagePath.replace(/(\.[^.]+)$/, '_original$1');
      const tempPath = imagePath.replace(/(\.[^.]+)$/, '_temp$1');
      
      // Create backup if it doesn't exist
      try {
        await fs.access(backupPath);
      } catch {
        await fs.copyFile(imagePath, backupPath);
        console.log(`📋 Created backup: ${backupPath}`);
      }
      
      // Resize the image to a temporary file first
      await sharp(imagePath)
        .resize(newWidth, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .toFile(tempPath);
      
      // Replace the original with the resized version
      await fs.copyFile(tempPath, imagePath);
      await fs.unlink(tempPath);
      
      console.log(`✅ Resized ${imagePath} to ${newWidth}px wide`);
      return true;
    } catch (error) {
      console.log(`❌ Failed to resize ${imagePath}: ${error.message}`);
      return false;
    }
  }
  
  const mdFiles = await findMarkdownFiles(BLOG_DIR);
  
  for (const filePath of mdFiles) {
    const content = await fs.readFile(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n(.*?)\n---/s);
    
    if (!frontmatterMatch) continue;
    
    const frontmatterText = frontmatterMatch[1];
    const imageUrl = extractImageUrl(frontmatterText);
    
    if (!imageUrl || imageUrl.startsWith('http')) continue;
    
    // Convert URL from "/assets/blog/..." to "public/assets/blog/..."
    const imagePath = path.join(PUBLIC_DIR, imageUrl.replace(/^\//, ''));
    
    try {
      await fs.access(imagePath);
      
      const dimensions = await getImageDimensions(imagePath);
      if (dimensions && dimensions.width > MAX_WIDTH) {
        oversizedImages.push({
          file: path.relative(process.cwd(), filePath),
          title: path.basename(filePath, '.md'),
          imageUrl: imageUrl,
          imagePath: imagePath,
          currentWidth: dimensions.width,
          currentHeight: dimensions.height,
          newWidth: MAX_WIDTH,
          aspectRatio: dimensions.width / dimensions.height
        });
      }
    } catch (error) {
      // File doesn't exist, skip
    }
  }
  
  if (oversizedImages.length === 0) {
    console.log('🎉 All images are within the size limit!');
  } else {
    console.log(`❌ Found ${oversizedImages.length} oversized images:\n`);
    
    oversizedImages.forEach((image, index) => {
      const newHeight = Math.round(MAX_WIDTH / image.aspectRatio);
      console.log(`${index + 1}. ${image.title}`);
      console.log(`   📁 ${image.file}`);
      console.log(`   🖼️  ${image.imageUrl}`);
      console.log(`   📏 Current: ${image.currentWidth}x${image.currentHeight}px`);
      console.log(`   📏 Suggested: ${MAX_WIDTH}x${newHeight}px\n`);
    });
    
    console.log('💡 To resize all images, run:');
    console.log('   node scripts/check-image-sizes.mjs --resize');
    console.log('\n💡 To resize a specific image, run:');
    console.log('   node scripts/check-image-sizes.mjs --resize <image-number>');
    console.log('\n⚠️  Original files will be backed up with "_original" suffix');
  }
  
  // Handle resize arguments
  const args = process.argv.slice(2);
  if (args.includes('--resize')) {
    const resizeIndex = args.indexOf('--resize') + 1;
    const targetIndex = args[resizeIndex] ? parseInt(args[resizeIndex]) - 1 : null;
    
    const imagesToResize = targetIndex !== null && targetIndex >= 0 && targetIndex < oversizedImages.length
      ? [oversizedImages[targetIndex]]
      : oversizedImages;
    
    if (imagesToResize.length === 0) {
      console.log('No images to resize or invalid index specified.');
    } else {
      console.log('\n🔄 Resizing images...');
      for (const image of imagesToResize) {
        await resizeImage(image.imagePath, image.newWidth);
      }
    }
  }
  
  return oversizedImages;
}

checkImageSizes().catch(console.error);
