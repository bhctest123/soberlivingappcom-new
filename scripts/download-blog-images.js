#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import { createWriteStream, existsSync } from 'fs';
import { mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '..', 'src', 'content', 'blog');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'blog');

// Regular expression to find markdown images
const IMAGE_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g;

// Function to download an image
async function downloadImage(url, filepath) {
  const dir = path.dirname(filepath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const file = createWriteStream(filepath);
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        file.close();
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        file.close();
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      reject(err);
    });
  });
}

// Function to get a safe filename from URL
function getSafeFilename(url) {
  const urlParts = new URL(url);
  let filename = path.basename(urlParts.pathname);
  
  // Decode URL encoding
  filename = decodeURIComponent(filename);
  
  // Replace spaces and special characters
  filename = filename.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // Ensure it has an extension
  if (!path.extname(filename)) {
    filename += '.png'; // Default to .png if no extension
  }
  
  return filename;
}

// Function to generate a local path for an image
function getLocalImagePath(url, blogSlug) {
  const filename = getSafeFilename(url);
  // Create a subdirectory for each blog post to avoid naming conflicts
  return `/images/blog/${blogSlug}/${filename}`;
}

// Main function
async function main() {
  console.log('Scanning blog posts for external images...\n');
  
  const blogFiles = await fs.readdir(BLOG_DIR);
  const markdownFiles = blogFiles.filter(file => file.endsWith('.md'));
  
  let totalImages = 0;
  let downloadedImages = 0;
  let failedImages = 0;
  const imageMap = new Map(); // To track URL -> local path mappings
  
  for (const file of markdownFiles) {
    const filepath = path.join(BLOG_DIR, file);
    const content = await fs.readFile(filepath, 'utf-8');
    const blogSlug = path.basename(file, '.md');
    
    // Find all images in the markdown
    const matches = [...content.matchAll(IMAGE_REGEX)];
    
    if (matches.length === 0) continue;
    
    console.log(`\nProcessing: ${file}`);
    console.log(`Found ${matches.length} images`);
    
    let updatedContent = content;
    
    for (const match of matches) {
      const [fullMatch, altText, imageUrl] = match;
      totalImages++;
      
      // Skip if already a local path
      if (imageUrl.startsWith('/images/') || imageUrl.startsWith('./') || imageUrl.startsWith('../')) {
        console.log(`  ✓ Already local: ${imageUrl}`);
        continue;
      }
      
      // Skip if not a valid URL
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        console.log(`  ⚠ Invalid URL: ${imageUrl}`);
        continue;
      }
      
      try {
        // Generate local path
        const localPath = getLocalImagePath(imageUrl, blogSlug);
        const absoluteLocalPath = path.join(__dirname, '..', 'public', localPath);
        
        // Check if already downloaded
        if (existsSync(absoluteLocalPath)) {
          console.log(`  ✓ Already downloaded: ${path.basename(localPath)}`);
        } else {
          console.log(`  ↓ Downloading: ${imageUrl}`);
          await downloadImage(imageUrl, absoluteLocalPath);
          downloadedImages++;
          console.log(`  ✓ Downloaded to: ${localPath}`);
        }
        
        // Update the markdown content
        updatedContent = updatedContent.replace(
          fullMatch,
          `![${altText}](${localPath})`
        );
        
        imageMap.set(imageUrl, localPath);
        
      } catch (error) {
        console.error(`  ✗ Failed to download: ${imageUrl}`);
        console.error(`    Error: ${error.message}`);
        failedImages++;
      }
    }
    
    // Write updated content back to file if changed
    if (updatedContent !== content) {
      await fs.writeFile(filepath, updatedContent, 'utf-8');
      console.log(`  ✓ Updated markdown file with local paths`);
    }
  }
  
  // Summary
  console.log('\n=== Summary ===');
  console.log(`Total images found: ${totalImages}`);
  console.log(`Images downloaded: ${downloadedImages}`);
  console.log(`Failed downloads: ${failedImages}`);
  console.log(`Already local/downloaded: ${totalImages - downloadedImages - failedImages}`);
  
  // Save image mappings for reference
  if (imageMap.size > 0) {
    const mappingsPath = path.join(__dirname, 'image-mappings.json');
    await fs.writeFile(
      mappingsPath,
      JSON.stringify(Object.fromEntries(imageMap), null, 2),
      'utf-8'
    );
    console.log(`\nImage URL mappings saved to: ${mappingsPath}`);
  }
}

// Run the script
main().catch(console.error);