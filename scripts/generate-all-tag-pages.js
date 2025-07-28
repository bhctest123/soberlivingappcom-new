#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const TAG_MAPPING_FILE = path.join(__dirname, '../original-tags-mapping.json');
const TAG_DATA_FILE = path.join(__dirname, '../src/data/all-tags.json');
const ASTRO_TAG_GENERATOR = path.join(__dirname, '../src/pages/sober-living-app-blog/tag/[tag]/[...page].astro');

// Load tag mapping
let tagMapping;
try {
  tagMapping = JSON.parse(fs.readFileSync(TAG_MAPPING_FILE, 'utf8'));
} catch (error) {
  console.error('Error loading tag mapping. Run extract-original-tags.js first.');
  process.exit(1);
}

/**
 * Generate a comprehensive tag data file
 */
function generateTagDataFile() {
  console.log('Generating comprehensive tag data...');
  
  const tagData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalTags: tagMapping.allTags.length,
      source: 'Original Squarespace site'
    },
    tags: {}
  };
  
  // Process each tag from the original site
  tagMapping.allTags.forEach(tagSlug => {
    const tagName = decodeURIComponent(tagSlug.replace(/\+/g, ' '));
    const tagInfo = tagMapping.tagMapping[tagSlug] || {
      name: tagName,
      slug: tagSlug,
      posts: []
    };
    
    tagData.tags[tagSlug] = {
      name: tagName,
      slug: tagSlug,
      displayName: tagName,
      postCount: tagInfo.posts ? tagInfo.posts.length : 0,
      url: `/sober-living-app-blog/tag/${tagSlug}`,
      // SEO metadata
      title: `${tagName} - Sober Living App Blog`,
      description: `Articles tagged with "${tagName}" - insights and resources for sober living professionals.`,
      // Categories for organization
      category: categorizeTag(tagName)
    };
  });
  
  // Ensure data directory exists
  const dataDir = path.dirname(TAG_DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Save tag data
  fs.writeFileSync(TAG_DATA_FILE, JSON.stringify(tagData, null, 2));
  console.log(`Tag data saved to: ${TAG_DATA_FILE}`);
  
  return tagData;
}

/**
 * Categorize tags for better organization
 */
function categorizeTag(tagName) {
  const tag = tagName.toLowerCase();
  
  // Geographic tags
  if (isState(tag) || isCity(tag)) {
    return 'geographic';
  }
  
  // Organization tags
  if (tag.includes('narr') || tag.includes('arr') || tag.includes('association') || 
      tag.includes('alliance') || tag.includes('department')) {
    return 'organization';
  }
  
  // Legal/Regulatory tags
  if (tag.includes('bill') || tag.includes('act') || tag.includes('cfr') || 
      tag.includes('law') || tag.includes('regulation')) {
    return 'legal';
  }
  
  // Clinical/Medical tags
  if (tag.includes('treatment') || tag.includes('medication') || tag.includes('therapy') ||
      tag.includes('clinical') || tag.includes('medical')) {
    return 'clinical';
  }
  
  // Business/Operations tags
  if (tag.includes('billing') || tag.includes('accounting') || tag.includes('management') ||
      tag.includes('operations') || tag.includes('business')) {
    return 'business';
  }
  
  return 'general';
}

/**
 * Check if tag is a US state
 */
function isState(tag) {
  const states = [
    'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut',
    'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa',
    'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan',
    'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire',
    'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio',
    'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota',
    'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia',
    'wisconsin', 'wyoming', 'washington dc'
  ];
  
  return states.includes(tag);
}

/**
 * Check if tag is a known city
 */
function isCity(tag) {
  const cities = [
    'albuquerque', 'anchorage', 'baton rouge', 'bellevue', 'burlington', 'camas',
    'denham springs', 'lafayette', 'las vegas', 'phoenix', 'seattle', 'tupelo'
  ];
  
  return cities.some(city => tag.includes(city));
}

/**
 * Update Astro tag generator to handle all tags
 */
function updateAstroGenerator(tagData) {
  console.log('\nUpdating Astro tag page generator...');
  
  // Read current generator
  let generatorContent = fs.readFileSync(ASTRO_TAG_GENERATOR, 'utf8');
  
  // Add comment about comprehensive tag support
  const comment = `
// This generator supports ALL ${tagData.metadata.totalTags} tags from the original site
// Including tags without any posts (preserved for SEO)
// Tag data is loaded from: src/data/all-tags.json
`;
  
  // Check if we need to update the generator
  if (!generatorContent.includes('all-tags.json')) {
    console.log('Note: You may need to update the Astro tag generator to use the comprehensive tag data.');
    console.log('The tag data file has been created at: src/data/all-tags.json');
  }
}

/**
 * Generate tag redirect configuration
 */
function generateRedirects(tagData) {
  console.log('\nGenerating redirect configuration...');
  
  const redirects = [];
  
  // Handle special cases
  Object.entries(tagData.tags).forEach(([slug, tag]) => {
    // Redirect variations of tag URLs
    if (slug.includes('+')) {
      // Also support dash version
      const dashSlug = slug.replace(/\+/g, '-');
      redirects.push({
        from: `/sober-living-app-blog/tag/${dashSlug}`,
        to: `/sober-living-app-blog/tag/${slug}`,
        status: 301
      });
    }
    
    // Handle .html extension
    redirects.push({
      from: `/sober-living-app-blog/tag/${slug}.html`,
      to: `/sober-living-app-blog/tag/${slug}`,
      status: 301
    });
  });
  
  const redirectFile = path.join(__dirname, '../tag-redirects.json');
  fs.writeFileSync(redirectFile, JSON.stringify(redirects, null, 2));
  console.log(`Redirect configuration saved to: ${redirectFile}`);
  console.log(`Total redirects: ${redirects.length}`);
}

/**
 * Generate summary report
 */
function generateSummaryReport(tagData) {
  console.log('\n=== TAG MIGRATION SUMMARY ===');
  console.log(`Total tags to preserve: ${tagData.metadata.totalTags}`);
  
  // Count by category
  const categoryCounts = {};
  Object.values(tagData.tags).forEach(tag => {
    categoryCounts[tag.category] = (categoryCounts[tag.category] || 0) + 1;
  });
  
  console.log('\nTags by category:');
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });
  
  // Tags with posts vs empty tags
  const tagsWithPosts = Object.values(tagData.tags).filter(tag => tag.postCount > 0).length;
  const emptyTags = tagData.metadata.totalTags - tagsWithPosts;
  
  console.log(`\nTags with posts: ${tagsWithPosts}`);
  console.log(`Empty tags (SEO preservation): ${emptyTags}`);
  
  console.log('\n=== NEXT STEPS ===');
  console.log('1. Update src/pages/sober-living-app-blog/tag/[tag]/[...page].astro to use all-tags.json');
  console.log('2. Ensure empty tag pages show appropriate "No posts found" message');
  console.log('3. Configure redirects using tag-redirects.json');
  console.log('4. Test all tag URLs return 200 status');
  console.log('5. Submit updated sitemap to Google Search Console');
}

/**
 * Main execution
 */
async function main() {
  try {
    // Generate comprehensive tag data
    const tagData = generateTagDataFile();
    
    // Update Astro generator
    updateAstroGenerator(tagData);
    
    // Generate redirects
    generateRedirects(tagData);
    
    // Summary report
    generateSummaryReport(tagData);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main();