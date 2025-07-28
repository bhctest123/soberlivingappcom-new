const fs = require('fs');
const path = require('path');

// Blog post image mappings
const blogImageMappings = {
  'can-inclusive-recovery-cities-help-fight-nimby-stigma': {
    originalImage: '1739255929100-MC2KBOOCWABU0NHSP6D0/unsplash-image-6Qo5-GUXFqc.jpg',
    newImage: 'inclusive-recovery-cities-nimby.jpg'
  },
  'grants-for-recovery-homes-funding-guide': {
    originalImage: '1739255929100-MC2KBOOCWABU0NHSP6D0/unsplash-image-6Qo5-GUXFqc.jpg',
    newImage: 'grants-recovery-homes-funding.jpg'
  },
  'trump-behavioral-health-policy-predictions-2025': {
    originalImage: '1739255929100-MC2KBOOCWABU0NHSP6D0/unsplash-image-6Qo5-GUXFqc.jpg',
    newImage: 'trump-behavioral-health-policy.jpg'
  },
  'best-practices-resident-management': {
    originalImage: '1739255929100-MC2KBOOCWABU0NHSP6D0/unsplash-image-6Qo5-GUXFqc.jpg',
    newImage: 'best-practices-resident-management.jpg'
  },
  'compliance-guide': {
    originalImage: '1739255929100-MC2KBOOCWABU0NHSP6D0/unsplash-image-6Qo5-GUXFqc.jpg',
    newImage: 'compliance-guide.jpg'
  },
  'welcome': {
    originalImage: '1739255929100-MC2KBOOCWABU0NHSP6D0/unsplash-image-6Qo5-GUXFqc.jpg',
    newImage: 'welcome.jpg'
  }
};

// Create blog images directory
const blogImagesDir = path.join(__dirname, '../public/images/blog');
if (!fs.existsSync(blogImagesDir)) {
  fs.mkdirSync(blogImagesDir, { recursive: true });
}

// Copy images from old structure to new structure
Object.entries(blogImageMappings).forEach(([postSlug, mapping]) => {
  const sourcePath = path.join(__dirname, '../../soberlivingappcom-current-sitesucker/images.squarespace-cdn.com/content/v1/5a811b28d55b410667f7bf1e', mapping.originalImage);
  const destPath = path.join(blogImagesDir, mapping.newImage);
  
  if (fs.existsSync(sourcePath)) {
    console.log(`Copying ${mapping.originalImage} to ${mapping.newImage}`);
    fs.copyFileSync(sourcePath, destPath);
  } else {
    console.log(`Warning: Source image not found: ${sourcePath}`);
  }
});

console.log('Blog image migration completed!'); 