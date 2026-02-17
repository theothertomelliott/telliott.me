import fs from 'fs/promises';
import path from 'path';

const BLOG_DIR = 'src/blog';
const PUBLIC_DIR = 'public';

async function checkMissingImages() {
  console.log('Checking for missing images in blog frontmatter...\n');
  
  const missingImages = [];
  const brokenImages = [];
  
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
  
  const mdFiles = await findMarkdownFiles(BLOG_DIR);
  
  for (const filePath of mdFiles) {
    const content = await fs.readFile(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n(.*?)\n---/s);
    
    if (!frontmatterMatch) {
      console.log(`⚠️  No frontmatter found in: ${filePath}`);
      continue;
    }
    
    const frontmatterText = frontmatterMatch[1];
    const imageUrl = extractImageUrl(frontmatterText);
    const relativePath = path.relative(process.cwd(), filePath);
    const fileName = path.basename(filePath, '.md');
    
    if (!imageUrl) {
      missingImages.push({
        file: relativePath,
        title: fileName,
        path: filePath
      });
    } else {
      // Check if it's a local image or external URL
      if (imageUrl.startsWith('http')) {
        // External URL - skip file existence check
        continue;
      } else {
        // Local image - check if file exists
        // Convert URL from "/assets/blog/..." to "public/assets/blog/..."
        const imagePath = path.join(PUBLIC_DIR, imageUrl.replace(/^\//, ''));
        
        try {
          await fs.access(imagePath);
        } catch (error) {
          brokenImages.push({
            file: relativePath,
            title: fileName,
            imageUrl: imageUrl,
            imagePath: imagePath
          });
        }
      }
    }
  }
  
  // Skip reporting missing images - only focus on broken image references
  
  // Report broken images
  if (brokenImages.length > 0) {
    console.log(`❌ Found ${brokenImages.length} posts with broken image references:\n`);
    
    brokenImages.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   📁 ${post.file}`);
      console.log(`   🖼️  ${post.imageUrl}`);
      console.log(`   ❌ File not found: ${post.imagePath}\n`);
    });
  }
  
  if (brokenImages.length === 0) {
    console.log('🎉 All referenced image files exist!');
  }
  
  return { missingImages, brokenImages };
}

checkMissingImages().catch(console.error);
