#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const ORIGINAL_SITE_PATH = path.join(__dirname, '../../soberlivingappcom-current-sitesucker/soberlivingapp.com/sober-living-app-blog');
const OUTPUT_FILE = path.join(__dirname, '../original-tags-mapping.json');

// Tag extraction regex
const TAG_LINK_REGEX = /href="[^"]*\/tag\/([^"]+)"/g;
const TAG_URL_REGEX = /\/sober-living-app-blog\/tag\/([^"]+)/;

// Results storage
const tagMapping = {};
const allTags = new Set();
const postToTags = {};

/**
 * Extract tags from HTML content
 */
function extractTagsFromHtml(htmlContent, filePath) {
  const tags = [];
  let match;
  
  // Find all tag links in the HTML
  while ((match = TAG_LINK_REGEX.exec(htmlContent)) !== null) {
    let tagSlug = match[1];
    
    // Remove .html extension if present
    tagSlug = tagSlug.replace('.html', '');
    
    // Decode the tag (convert + to spaces)
    const tagName = decodeURIComponent(tagSlug.replace(/\+/g, ' '));
    
    tags.push({
      slug: tagSlug,
      name: tagName,
      url: `/sober-living-app-blog/tag/${tagSlug}`
    });
    
    allTags.add(tagSlug);
  }
  
  return tags;
}

/**
 * Extract the post slug from file path
 */
function getPostSlug(filePath) {
  // Remove base path and .html extension
  const relativePath = path.relative(ORIGINAL_SITE_PATH, filePath);
  return relativePath.replace('.html', '');
}

/**
 * Process all HTML files
 */
async function processHtmlFiles() {
  console.log('Starting tag extraction from original HTML files...');
  
  // Find all HTML files in year directories
  const pattern = path.join(ORIGINAL_SITE_PATH, '**/*.html');
  const files = glob.sync(pattern);
  
  console.log(`Found ${files.length} HTML files to process`);
  
  let processedCount = 0;
  let blogPostCount = 0;
  
  for (const file of files) {
    // Skip tag and category pages
    if (file.includes('/tag/') || file.includes('/category/')) {
      continue;
    }
    
    // Skip non-blog post pages
    const fileName = path.basename(file);
    if (fileName === 'alabama.html' || fileName === 'regulations.html') {
      continue;
    }
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      const tags = extractTagsFromHtml(content, file);
      
      if (tags.length > 0) {
        const postSlug = getPostSlug(file);
        postToTags[postSlug] = tags;
        blogPostCount++;
        
        // Map each tag to posts
        tags.forEach(tag => {
          if (!tagMapping[tag.slug]) {
            tagMapping[tag.slug] = {
              name: tag.name,
              slug: tag.slug,
              url: tag.url,
              posts: []
            };
          }
          tagMapping[tag.slug].posts.push(postSlug);
        });
      }
      
      processedCount++;
      if (processedCount % 100 === 0) {
        console.log(`Processed ${processedCount} files...`);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`\nProcessing complete!`);
  console.log(`- Total files processed: ${processedCount}`);
  console.log(`- Blog posts with tags: ${blogPostCount}`);
  console.log(`- Unique tags found: ${allTags.size}`);
}

/**
 * Analyze tag usage
 */
function analyzeTagUsage() {
  console.log('\nTag usage analysis:');
  
  // Sort tags by usage count
  const tagsByUsage = Object.entries(tagMapping)
    .map(([slug, data]) => ({
      ...data,
      count: data.posts.length
    }))
    .sort((a, b) => b.count - a.count);
  
  console.log('\nTop 20 most used tags:');
  tagsByUsage.slice(0, 20).forEach((tag, index) => {
    console.log(`${index + 1}. ${tag.name} (${tag.slug}): ${tag.count} posts`);
  });
  
  // Find tags with only one post
  const singleUseTags = tagsByUsage.filter(tag => tag.count === 1);
  console.log(`\nTags used only once: ${singleUseTags.length}`);
  
  // Find duplicate/similar tags
  const similarTags = findSimilarTags(tagsByUsage);
  if (similarTags.length > 0) {
    console.log('\nPotentially duplicate tags:');
    similarTags.forEach(pair => {
      console.log(`- "${pair[0]}" and "${pair[1]}"`);
    });
  }
}

/**
 * Find similar tags that might be duplicates
 */
function findSimilarTags(tags) {
  const similar = [];
  
  for (let i = 0; i < tags.length; i++) {
    for (let j = i + 1; j < tags.length; j++) {
      const tag1 = tags[i].name.toLowerCase();
      const tag2 = tags[j].name.toLowerCase();
      
      // Check for very similar tags
      if (
        tag1 === tag2 || // Exact match (different case)
        tag1.replace(/[^a-z0-9]/g, '') === tag2.replace(/[^a-z0-9]/g, '') || // Same without special chars
        (tag1.includes(tag2) || tag2.includes(tag1)) && Math.abs(tag1.length - tag2.length) <= 2 // One contains the other
      ) {
        similar.push([tags[i].name, tags[j].name]);
      }
    }
  }
  
  return similar;
}

/**
 * Save results to JSON file
 */
function saveResults() {
  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalTags: allTags.size,
      totalPosts: Object.keys(postToTags).length
    },
    tagMapping: tagMapping,
    postToTags: postToTags,
    allTags: Array.from(allTags).sort()
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\nResults saved to: ${OUTPUT_FILE}`);
}

/**
 * Main execution
 */
async function main() {
  try {
    await processHtmlFiles();
    analyzeTagUsage();
    saveResults();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main();