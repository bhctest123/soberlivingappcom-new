import { chromium } from 'playwright';

(async () => {
  // Launch browser
  const browser = await chromium.launch({
    headless: false // Set to true if you don't want to see the browser
  });

  // Create a new page with mobile viewport
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  });
  
  const page = await context.newPage();

  try {
    // Navigate to the local development server
    console.log('Navigating to http://localhost:4321...');
    await page.goto('http://localhost:4321', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait a bit for any animations or lazy loading
    await page.waitForTimeout(2000);

    // Check for hamburger menu button
    console.log('Checking for hamburger menu button...');
    
    // Common selectors for hamburger menu buttons
    const menuSelectors = [
      'button[aria-label*="menu"]',
      'button[aria-label*="Menu"]',
      'button.mobile-menu',
      'button.hamburger',
      '[data-mobile-menu]',
      'button svg.lucide-menu',
      'button:has(svg.lucide-menu)',
      '.mobile-menu-button',
      '#mobile-menu-button'
    ];

    let hamburgerButton = null;
    for (const selector of menuSelectors) {
      try {
        hamburgerButton = await page.$(selector);
        if (hamburgerButton) {
          console.log(`Found hamburger menu with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!hamburgerButton) {
      // Try a more generic approach - look for any button in the header/nav area
      hamburgerButton = await page.$('header button, nav button');
    }

    if (hamburgerButton) {
      // Check if it's visible
      const isVisible = await hamburgerButton.isVisible();
      console.log(`Hamburger menu is visible: ${isVisible}`);

      // Check if it's clickable
      const isEnabled = await hamburgerButton.isEnabled();
      console.log(`Hamburger menu is enabled/clickable: ${isEnabled}`);

      // Get button details
      const boundingBox = await hamburgerButton.boundingBox();
      console.log('Button location:', boundingBox);

      // Highlight the button before screenshot
      await hamburgerButton.evaluate(el => {
        el.style.border = '3px solid red';
        el.style.boxShadow = '0 0 10px red';
      });
    } else {
      console.log('Hamburger menu button not found!');
    }

    // Take screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `mobile-view-${timestamp}.png`;
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: false 
    });
    console.log(`Screenshot saved as: ${screenshotPath}`);

    // Try clicking the hamburger menu if found
    if (hamburgerButton) {
      console.log('Attempting to click hamburger menu...');
      await hamburgerButton.click();
      
      // Wait for menu to open
      await page.waitForTimeout(1000);
      
      // Take another screenshot with menu open
      const menuOpenPath = `mobile-menu-open-${timestamp}.png`;
      await page.screenshot({ 
        path: menuOpenPath,
        fullPage: false 
      });
      console.log(`Screenshot with menu open saved as: ${menuOpenPath}`);
    }

  } catch (error) {
    console.error('Error:', error);
    // Take error screenshot
    await page.screenshot({ path: 'error-screenshot.png' });
  } finally {
    // Close browser
    await browser.close();
  }
})();