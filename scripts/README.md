# Blog Image Migration Scripts

This directory contains scripts for downloading and organizing blog images from external URLs (primarily Squarespace CDN) to local storage.

## Scripts

### `download-blog-images.js`
Downloads all external images referenced in blog posts and updates markdown files to use local paths.

**Features:**
- Scans all markdown files in `src/content/blog/`
- Downloads images from external URLs (Squarespace CDN, etc.)
- Organizes images in subdirectories by blog post slug
- Updates markdown files to use local image paths
- Creates safe filenames by sanitizing URLs
- Generates a mapping file for reference

**Usage:**
```bash
npm run download-images
```

**Output:**
- Images saved to: `/public/images/blog/{blog-slug}/{image-filename}`
- URL mappings saved to: `scripts/image-mappings.json`

### `verify-blog-images.js`
Verifies that all image references in blog posts point to existing local files.

**Features:**
- Checks all image references in blog markdown files
- Verifies that local files exist
- Reports missing images and external URLs
- Generates detailed verification report

**Usage:**
```bash
npm run verify-images
```

**Output:**
- Verification report saved to: `scripts/image-verification-report.json`

## Image Organization Structure

```
public/images/blog/
├── {blog-post-slug-1}/
│   ├── image1.png
│   ├── image2.jpg
│   └── ...
├── {blog-post-slug-2}/
│   ├── image1.png
│   └── ...
└── ...
```

## Migration Results

- **Total Images Processed:** 370
- **Successfully Downloaded:** 370
- **Missing Images:** 0
- **External Images Remaining:** 0

All blog images have been successfully migrated from external URLs (primarily Squarespace CDN) to local storage with proper organization and updated references in markdown files.

## URL Transformation Examples

External URLs are transformed to local paths following these patterns:

```
From: https://images.squarespace-cdn.com/content/v1/5a811b28d55b410667f7bf1e/1587491845561-IZNT282MFXXUZQKFUFPQ/Screenshot+2020-04-16+at+10.28.45+AM.png
To:   /images/blog/3-coronavirus-changes-your-sober-living-home-needs-to-make-this-week/Screenshot_2020-04-16_at_10.28.45_AM.png

From: https://images.squarespace-cdn.com/content/v1/5a811b28d55b410667f7bf1e/1557776727467-90TCH0IKRC5JL7TFF62V/realestatedeal
To:   /images/blog/3-things-to-look-for-in-your-first-sober-living-home-real-estate-deal/realestatedeal.png
```

## File Naming

- Spaces are replaced with underscores
- Special characters are replaced with underscores
- URL encoding is decoded
- Default extension (.png) is added if missing
- Filenames are made filesystem-safe

## Benefits

1. **Performance:** Local images load faster than external CDN images
2. **Reliability:** No dependency on external services
3. **Control:** Full control over image optimization and delivery
4. **SEO:** Better Core Web Vitals scores
5. **Consistency:** Uniform image delivery across the site