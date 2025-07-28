#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');

// Configuration
const MARKDOWN_PATH = path.join(__dirname, '../src/content/blog');
const TAG_MAPPING_FILE = path.join(__dirname, '../original-tags-mapping.json');
const BACKUP_DIR = path.join(__dirname, '../markdown-backups');

// Load tag mapping
let tagMapping;
try {
  tagMapping = JSON.parse(fs.readFileSync(TAG_MAPPING_FILE, 'utf8'));
} catch (error) {
  console.error('Error loading tag mapping. Run extract-original-tags.js first.');
  process.exit(1);
}

/**
 * Normalize a file path to match between original HTML and markdown
 */
function normalizeSlug(slug) {
  // Remove date prefixes and clean up the slug
  const parts = slug.split('/');
  const fileName = parts[parts.length - 1];
  
  // Common transformations
  const normalized = fileName
    .replace(/\.html$/, '')
    .replace(/\+/g, '-')
    .toLowerCase();
  
  return normalized;
}

/**
 * Find markdown file that corresponds to an original HTML post
 */
function findMarkdownFile(htmlPostSlug) {
  const normalizedSlug = normalizeSlug(htmlPostSlug);
  const pattern = path.join(MARKDOWN_PATH, '**/*.md');
  const files = glob.sync(pattern);
  
  // Try to find exact match first
  for (const file of files) {
    const fileName = path.basename(file, '.md');
    if (fileName === normalizedSlug) {
      return file;
    }
  }
  
  // Try partial match
  for (const file of files) {
    const fileName = path.basename(file, '.md');
    if (fileName.includes(normalizedSlug) || normalizedSlug.includes(fileName)) {
      return file;
    }
  }
  
  return null;
}

/**
 * Extract original tags for a blog post
 */
function getOriginalTags(htmlPostSlug) {
  const postTags = tagMapping.postToTags[htmlPostSlug];
  if (!postTags) {
    return [];
  }
  
  // Return tag names (not slugs) to match markdown format
  return postTags.map(tag => tag.name);
}

/**
 * Update tags in a markdown file
 */
function updateMarkdownTags(filePath, originalTags) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(content);
  
  // Get current tags
  const currentTags = parsed.data.tags || [];
  
  // Normalize tags for comparison (lowercase)
  const normalizedCurrent = currentTags.map(t => t.toLowerCase());
  
  // Find tags that need to be added
  const tagsToAdd = originalTags.filter(tag => {
    const normalized = tag.toLowerCase();
    return !normalizedCurrent.includes(normalized);
  });
  
  if (tagsToAdd.length === 0) {
    return { updated: false, currentTags, newTags: currentTags };
  }
  
  // Combine tags, preserving original case from HTML
  const combinedTags = [...currentTags];
  tagsToAdd.forEach(tag => {
    // Check if we already have this tag with different case
    const existingIndex = combinedTags.findIndex(t => t.toLowerCase() === tag.toLowerCase());
    if (existingIndex >= 0) {
      // Replace with original case
      combinedTags[existingIndex] = tag;
    } else {
      combinedTags.push(tag);
    }
  });
  
  // Update frontmatter
  parsed.data.tags = combinedTags.sort();
  
  // Write back to file
  const updatedContent = matter.stringify(parsed.content, parsed.data);
  fs.writeFileSync(filePath, updatedContent);
  
  return { updated: true, currentTags, newTags: combinedTags };
}

/**
 * Create backup of markdown files
 */
function createBackup() {
  console.log('Creating backup of markdown files...');
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
  fs.mkdirSync(backupPath);
  
  // Copy all markdown files
  const files = glob.sync(path.join(MARKDOWN_PATH, '**/*.md'));
  files.forEach(file => {
    const relativePath = path.relative(MARKDOWN_PATH, file);
    const backupFile = path.join(backupPath, relativePath);
    const backupFileDir = path.dirname(backupFile);
    
    if (!fs.existsSync(backupFileDir)) {
      fs.mkdirSync(backupFileDir, { recursive: true });
    }
    
    fs.copyFileSync(file, backupFile);
  });
  
  console.log(`Backup created at: ${backupPath}`);
}

/**
 * Process all blog posts
 */
async function processAllPosts() {
  console.log('Starting tag update process...');
  
  // Create backup first
  createBackup();
  
  let processedCount = 0;
  let updatedCount = 0;
  let notFoundCount = 0;
  const notFoundPosts = [];
  
  // Process each post from the original site
  for (const [htmlSlug, tags] of Object.entries(tagMapping.postToTags)) {
    processedCount++;
    
    // Find corresponding markdown file
    const markdownFile = findMarkdownFile(htmlSlug);
    
    if (!markdownFile) {
      notFoundCount++;
      notFoundPosts.push(htmlSlug);
      continue;
    }
    
    // Update tags
    const result = updateMarkdownTags(markdownFile, tags.map(t => t.name));
    
    if (result.updated) {
      updatedCount++;
      console.log(`Updated: ${path.basename(markdownFile)}`);
      console.log(`  Old tags: ${result.currentTags.join(', ')}`);
      console.log(`  New tags: ${result.newTags.join(', ')}`);
    }
  }
  
  console.log('\nProcessing complete!');
  console.log(`- Total posts processed: ${processedCount}`);
  console.log(`- Markdown files updated: ${updatedCount}`);
  console.log(`- Posts not found: ${notFoundCount}`);
  
  if (notFoundPosts.length > 0) {
    console.log('\nPosts from original site not found in markdown:');
    notFoundPosts.slice(0, 10).forEach(post => {
      console.log(`  - ${post}`);
    });
    if (notFoundPosts.length > 10) {
      console.log(`  ... and ${notFoundPosts.length - 10} more`);
    }
  }
}

/**
 * Generate report of all tags
 */
function generateTagReport() {
  console.log('\nGenerating tag report...');
  
  const allMarkdownTags = new Set();
  const files = glob.sync(path.join(MARKDOWN_PATH, '**/*.md'));
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const parsed = matter(content);
    const tags = parsed.data.tags || [];
    tags.forEach(tag => allMarkdownTags.add(tag));
  });
  
  const originalTags = new Set(tagMapping.allTags.map(slug => 
    decodeURIComponent(slug.replace(/\+/g, ' '))
  ));
  
  console.log(`\nTag statistics:`);
  console.log(`- Original site tags: ${originalTags.size}`);
  console.log(`- Current markdown tags: ${allMarkdownTags.size}`);
  
  // Find tags that exist in original but not in markdown
  const missingTags = Array.from(originalTags).filter(tag => 
    !Array.from(allMarkdownTags).some(mdTag => 
      mdTag.toLowerCase() === tag.toLowerCase()
    )
  );
  
  console.log(`- Tags still missing: ${missingTags.length}`);
  
  if (missingTags.length > 0) {
    console.log('\nMissing tags (first 20):');
    missingTags.slice(0, 20).forEach(tag => {
      console.log(`  - ${tag}`);
    });
  }
  
  // Save report
  const reportPath = path.join(__dirname, '../tag-update-report.json');
  const report = {
    generatedAt: new Date().toISOString(),
    statistics: {
      originalTags: originalTags.size,
      markdownTags: allMarkdownTags.size,
      missingTags: missingTags.length
    },
    allMarkdownTags: Array.from(allMarkdownTags).sort(),
    missingTags: missingTags.sort()
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport saved to: ${reportPath}`);
}

/**
 * Main execution
 */
async function main() {
  try {
    await processAllPosts();
    generateTagReport();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main();