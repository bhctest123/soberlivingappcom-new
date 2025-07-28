import { chromium } from 'playwright';

(async () => {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  try {
    // Navigate to blog page
    console.log('Navigating to blog page...');
    await page.goto('http://localhost:4321/blog', { 
      waitUntil: 'networkidle' 
    });
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Take screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `blog-screenshot-${timestamp}.png`;
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log(`Screenshot saved as: ${screenshotPath}`);
    
    // Check for common visual issues
    console.log('\n=== Visual Inspection ===');
    
    // Check if blog posts are visible
    const blogPosts = await page.locator('article, .blog-card, [class*="blog"]').count();
    console.log(`Found ${blogPosts} blog post elements`);
    
    // Check for broken images
    const brokenImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.filter(img => !img.complete || img.naturalWidth === 0).map(img => ({
        src: img.src,
        alt: img.alt
      }));
    });
    
    if (brokenImages.length > 0) {
      console.log('\nBroken images found:');
      brokenImages.forEach(img => console.log(`  - ${img.src} (alt: ${img.alt})`));
    } else {
      console.log('All images loaded successfully');
    }
    
    // Check for overlapping elements
    const overlaps = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const overlapping = [];
      
      for (let i = 0; i < elements.length; i++) {
        const rect1 = elements[i].getBoundingClientRect();
        if (rect1.width === 0 || rect1.height === 0) continue;
        
        for (let j = i + 1; j < elements.length; j++) {
          const rect2 = elements[j].getBoundingClientRect();
          if (rect2.width === 0 || rect2.height === 0) continue;
          
          // Skip parent-child relationships
          if (elements[i].contains(elements[j]) || elements[j].contains(elements[i])) continue;
          
          // Check for overlap
          const overlap = !(rect1.right < rect2.left || 
                          rect2.right < rect1.left || 
                          rect1.bottom < rect2.top || 
                          rect2.bottom < rect1.top);
          
          if (overlap && elements[i].textContent && elements[j].textContent) {
            overlapping.push({
              elem1: elements[i].tagName + '.' + elements[i].className,
              elem2: elements[j].tagName + '.' + elements[j].className
            });
          }
        }
      }
      return overlapping.slice(0, 5); // Limit to first 5 overlaps
    });
    
    if (overlaps.length > 0) {
      console.log('\nPotential overlapping elements:');
      overlaps.forEach(o => console.log(`  - ${o.elem1} overlaps with ${o.elem2}`));
    }
    
    // Check font loading
    const fontStatus = await page.evaluate(() => {
      return document.fonts.ready.then(() => {
        const loadedFonts = Array.from(document.fonts.values()).map(font => font.family);
        return { loaded: true, fonts: [...new Set(loadedFonts)] };
      });
    });
    console.log('\nLoaded fonts:', fontStatus.fonts.join(', '));
    
    // Check for horizontal scrolling
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`Horizontal scroll: ${hasHorizontalScroll ? 'Yes (potential issue)' : 'No'}`);
    
    // Check responsive layout
    console.log('\n=== Responsive Check ===');
    
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: `blog-screenshot-mobile-${timestamp}.png`,
      fullPage: true 
    });
    console.log(`Mobile screenshot saved as: blog-screenshot-mobile-${timestamp}.png`);
    
    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: `blog-screenshot-tablet-${timestamp}.png`,
      fullPage: true 
    });
    console.log(`Tablet screenshot saved as: blog-screenshot-tablet-${timestamp}.png`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();