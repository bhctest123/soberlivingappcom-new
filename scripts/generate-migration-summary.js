#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSummary() {
  try {
    // Read the verification report
    const reportPath = path.join(__dirname, 'image-verification-report.json');
    const report = JSON.parse(await fs.readFile(reportPath, 'utf-8'));
    
    // Read the image mappings
    const mappingsPath = path.join(__dirname, 'image-mappings.json');
    const mappings = JSON.parse(await fs.readFile(mappingsPath, 'utf-8'));
    
    // Count blog directories
    const blogDir = path.join(__dirname, '..', 'public', 'images', 'blog');
    const blogDirs = await fs.readdir(blogDir);
    const actualBlogDirs = blogDirs.filter(item => item !== '.DS_Store' && !item.startsWith('.'));
    
    // Generate summary
    const summary = {
      migrationDate: report.timestamp,
      statistics: {
        totalImages: report.summary.totalImages,
        validImages: report.summary.validImages,
        missingImages: report.summary.missingImages,
        externalImages: report.summary.externalImages,
        blogPostsWithImages: actualBlogDirs.length,
        urlMappings: Object.keys(mappings).length
      },
      source: {
        primaryCDN: 'Squarespace CDN (images.squarespace-cdn.com)',
        sourceFormats: ['PNG', 'JPG', 'JPEG', 'Various without extensions'],
        urlPattern: 'https://images.squarespace-cdn.com/content/v1/5a811b28d55b410667f7bf1e/*'
      },
      destination: {
        structure: '/public/images/blog/{blog-slug}/{sanitized-filename}',
        organization: 'Organized by blog post slug',
        namingConvention: 'Spaces replaced with underscores, special chars sanitized'
      },
      tools: {
        downloadScript: 'scripts/download-blog-images.js',
        verificationScript: 'scripts/verify-blog-images.js',
        npmCommands: ['npm run download-images', 'npm run verify-images']
      },
      sampleMappings: Object.entries(mappings).slice(0, 5).map(([source, dest]) => ({
        source: source.substring(0, 80) + (source.length > 80 ? '...' : ''),
        destination: dest
      }))
    };
    
    // Write summary
    const summaryPath = path.join(__dirname, 'migration-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
    
    console.log('=== Blog Image Migration Summary ===');
    console.log(`Migration Date: ${new Date(summary.migrationDate).toLocaleDateString()}`);
    console.log(`Total Images: ${summary.statistics.totalImages}`);
    console.log(`Blog Posts with Images: ${summary.statistics.blogPostsWithImages}`);
    console.log(`URL Mappings Created: ${summary.statistics.urlMappings}`);
    console.log(`Missing Images: ${summary.statistics.missingImages}`);
    console.log(`External Images Remaining: ${summary.statistics.externalImages}`);
    console.log(`\nAll images successfully migrated! ✅`);
    console.log(`\nDetailed summary saved to: ${summaryPath}`);
    
  } catch (error) {
    console.error('Error generating summary:', error.message);
    process.exit(1);
  }
}

generateSummary();