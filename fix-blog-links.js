const fs = require('fs');
const path = require('path');

// Common patterns to fix
const linkReplacements = [
  // Fix feature page links
  {
    pattern: /\.\.\/\.\.\/\.\.\/\.\.\/housing\.html/g,
    replacement: '/features/bed-management'
  },
  
  // Fix specific cross-references we know about
  {
    pattern: /\.\.\/\.\.\/3\/31\/5-ways-coronavirus-is-changing-the-sober-living-industrynbsp\.html/g,
    replacement: '/sober-living-app-blog/5-ways-coronavirus-is-changing-the-sober-living-industrynbsp'
  },
  {
    pattern: /\.\.\/\.\.\/\.\.\/2020\/1\/21\/mat-and-sober-living-deemed-more-compatible-than-ever-before\.html/g,
    replacement: '/sober-living-app-blog/mat-and-sober-living-deemed-more-compatible-than-ever-before'
  },
  {
    pattern: /\.\.\/17\/how-to-streamline-drug-testing-at-your-sober-living-home\.html/g,
    replacement: '/sober-living-app-blog/how-to-streamline-drug-testing-at-your-sober-living-home'
  },
  {
    pattern: /\.\.\/6\/3-mistakes-you-might-be-making-with-mat-patients-at-your-sober-living-home\.html/g,
    replacement: '/sober-living-app-blog/3-mistakes-you-might-be-making-with-mat-patients-at-your-sober-living-home'
  },
  {
    pattern: /\.\.\/\.\.\/3\/3\/5-things-all-of-the-best-sober-living-home-managers-have-in-common\.html/g,
    replacement: '/sober-living-app-blog/5-things-all-of-the-best-sober-living-home-managers-have-in-common'
  },
  {
    pattern: /\.\.\/17\/your-questions-about-opening-a-sober-living-home-in-nebraska-answered\.html/g,
    replacement: '/sober-living-app-blog/your-questions-about-opening-a-sober-living-home-in-nebraska-answered'
  },
  {
    pattern: /\.\.\/10\/kansas-is-a-great-state-to-open-a-sober-living-home\.html/g,
    replacement: '/sober-living-app-blog/kansas-is-a-great-state-to-open-a-sober-living-home'
  },

  // Generic date-based URL patterns - convert to blog post structure
  {
    pattern: /\.\.\/\.\.\/\d{4}\/\d{1,2}\/\d{1,2}\/([^/\)]+)\.html/g,
    replacement: '/sober-living-app-blog/$1'
  },
  {
    pattern: /\.\./\d{1,2}\/([^/\)]+)\.html/g,
    replacement: '/sober-living-app-blog/$1'
  },
  {
    pattern: /\.\.\/\.\./\d{1,2}\/\d{1,2}\/([^/\)]+)\.html/g,
    replacement: '/sober-living-app-blog/$1'
  },
  
  // Clean up any remaining Newer/Older Post patterns
  {
    pattern: /Newer Post\[([^\]]+)\]\([^)]+\)/g,
    replacement: 'Newer Post: $1'
  },
  {
    pattern: /Older Post\[([^\]]+)\]\([^)]+\)/g,
    replacement: 'Older Post: $1'
  },
];

// Get all markdown files
const blogDir = path.join(__dirname, 'src/content/blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md')).map(f => path.join(blogDir, f));

console.log(`Processing ${files.length} blog files...`);

let totalReplacements = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let fileReplacements = 0;
  
  linkReplacements.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      fileReplacements += matches.length;
      content = content.replace(pattern, replacement);
    }
  });
  
  if (fileReplacements > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${fileReplacements} links in ${path.basename(filePath)}`);
    totalReplacements += fileReplacements;
  }
});

console.log(`\nCompleted! Fixed ${totalReplacements} broken links across all blog posts.`);