#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '..', 'src', 'content', 'blog');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Regular expression to find markdown images
const IMAGE_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g;

// Function to check if a file exists
function fileExists(filepath) {
  return existsSync(filepath);
}

// Main function
async function main() {
  console.log('Verifying all blog image references...\n');
  
  const blogFiles = await fs.readdir(BLOG_DIR);
  const markdownFiles = blogFiles.filter(file => file.endsWith('.md'));
  
  let totalImages = 0;
  let validImages = 0;
  let missingImages = 0;
  let externalImages = 0;
  const missingFiles = [];
  const externalUrls = [];
  
  for (const file of markdownFiles) {
    const filepath = path.join(BLOG_DIR, file);
    const content = await fs.readFile(filepath, 'utf-8');
    
    // Find all images in the markdown
    const matches = [...content.matchAll(IMAGE_REGEX)];
    
    if (matches.length === 0) continue;
    
    console.log(`Checking: ${file} (${matches.length} images)`);
    
    for (const match of matches) {
      const [fullMatch, altText, imageUrl] = match;
      totalImages++;
      
      // Check if it's a local path
      if (imageUrl.startsWith('/images/')) {
        const absolutePath = path.join(PUBLIC_DIR, imageUrl);
        if (fileExists(absolutePath)) {
          validImages++;
          console.log(`  ✓ Found: ${imageUrl}`);
        } else {
          missingImages++;
          missingFiles.push({ file, imageUrl, altText });
          console.log(`  ✗ Missing: ${imageUrl}`);
        }
      } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        externalImages++;
        externalUrls.push({ file, imageUrl, altText });
        console.log(`  ⚠ External: ${imageUrl}`);
      } else if (imageUrl.startsWith('./') || imageUrl.startsWith('../')) {
        // Relative paths - try to resolve them
        const resolvedPath = path.resolve(path.dirname(filepath), imageUrl);
        if (fileExists(resolvedPath)) {
          validImages++;
          console.log(`  ✓ Found (relative): ${imageUrl}`);
        } else {
          missingImages++;
          missingFiles.push({ file, imageUrl, altText });
          console.log(`  ✗ Missing (relative): ${imageUrl}`);
        }
      } else {
        console.log(`  ? Unknown format: ${imageUrl}`);
      }
    }
  }
  
  // Summary
  console.log('\n=== Image Verification Summary ===');
  console.log(`Total images found: ${totalImages}`);
  console.log(`Valid local images: ${validImages}`);
  console.log(`Missing local images: ${missingImages}`);
  console.log(`External images: ${externalImages}`);
  
  if (missingFiles.length > 0) {
    console.log('\n=== Missing Images ===');
    missingFiles.forEach(({ file, imageUrl, altText }) => {
      console.log(`${file}: ${imageUrl} (alt: "${altText}")`);
    });
  }
  
  if (externalUrls.length > 0) {
    console.log('\n=== External Images (still need downloading) ===');
    externalUrls.forEach(({ file, imageUrl, altText }) => {
      console.log(`${file}: ${imageUrl} (alt: "${altText}")`);
    });
  }
  
  // Save detailed report
  const report = {
    summary: {
      totalImages,
      validImages,
      missingImages,
      externalImages
    },
    missingFiles,
    externalUrls,
    timestamp: new Date().toISOString()
  };
  
  const reportPath = path.join(__dirname, 'image-verification-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\nDetailed report saved to: ${reportPath}`);
  
  // Exit with error code if there are issues
  if (missingImages > 0 || externalImages > 0) {
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);