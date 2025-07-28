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

    // Close any modal/overlay if present (the video player error)
    try {
      const closeButton = await page.$('button:has-text("×"), button:has-text("X"), .close-button, [aria-label="Close"]');
      if (closeButton && await closeButton.isVisible()) {
        await closeButton.click();
        console.log('Closed overlay/modal');
        await page.waitForTimeout(500);
      }
    } catch (e) {
      console.log('No overlay to close');
    }

    // Look for the mobile hamburger menu button specifically
    console.log('Looking for mobile hamburger menu button...');
    
    // Based on the code, the mobile menu button has an image with src="/images/icons/menu.png"
    const hamburgerButton = await page.$('button:has(img[src="/images/icons/menu.png"])');
    
    if (!hamburgerButton) {
      // Try alternative selectors
      console.log('Trying alternative selectors...');
      const alternatives = [
        'button:has(span:text("Toggle Menu"))',
        '.lg\\:hidden button',
        'button[aria-label*="menu" i]',
        'button:has(img[alt="Menu"])'
      ];
      
      for (const selector of alternatives) {
        const btn = await page.$(selector);
        if (btn && await btn.isVisible()) {
          console.log(`Found button with selector: ${selector}`);
          break;
        }
      }
    }
    
    if (hamburgerButton && await hamburgerButton.isVisible()) {
      console.log('Hamburger menu found and is visible!');

      // Get button details
      const boundingBox = await hamburgerButton.boundingBox();
      console.log('Button location:', boundingBox);

      // Highlight the button
      await hamburgerButton.evaluate(el => {
        el.style.border = '3px solid red';
        el.style.boxShadow = '0 0 10px red';
        el.style.zIndex = '9999';
      });

      // Take screenshot showing the highlighted hamburger menu
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = `mobile-hamburger-highlighted-${timestamp}.png`;
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: false 
      });
      console.log(`Screenshot with highlighted hamburger menu saved as: ${screenshotPath}`);

      // Click the hamburger menu
      console.log('Clicking hamburger menu...');
      await hamburgerButton.click();
      
      // Wait for the Sheet component to open
      await page.waitForTimeout(500);
      
      // Check if the mobile menu sheet is open
      const mobileMenuSheet = await page.$('[data-state="open"], [role="dialog"]');
      if (mobileMenuSheet) {
        console.log('Mobile menu sheet opened successfully!');
        
        // Get all menu items
        const menuItems = await page.$$eval('nav a', links => 
          links.map(link => ({
            text: link.textContent.trim(),
            href: link.href
          }))
        );
        console.log('Mobile menu items:', menuItems);
        
        // Take screenshot with menu open
        const menuOpenPath = `mobile-menu-open-${timestamp}.png`;
        await page.screenshot({ 
          path: menuOpenPath,
          fullPage: false 
        });
        console.log(`Screenshot with menu open saved as: ${menuOpenPath}`);
      } else {
        console.log('Mobile menu sheet not detected after click');
      }

    } else {
      console.log('ERROR: Hamburger menu button not found or not visible!');
      console.log('This suggests the mobile menu might not be rendering correctly in mobile viewport.');
      
      // Debug: Check viewport size
      const viewportSize = await page.viewportSize();
      console.log('Current viewport size:', viewportSize);
      
      // Debug: Check if we're in mobile breakpoint
      const isMobileView = await page.evaluate(() => window.innerWidth < 1024); // lg breakpoint
      console.log('Is mobile view (width < 1024):', isMobileView);
      
      // Debug: Look for any buttons
      const allButtons = await page.$$eval('button', buttons => 
        buttons.map(btn => ({
          text: btn.textContent.trim(),
          isVisible: btn.offsetParent !== null,
          hasMenuIcon: btn.querySelector('img[src*="menu"]') !== null
        }))
      );
      console.log('All buttons found:', allButtons);
    }

  } catch (error) {
    console.error('Error during test:', error);
    // Take error screenshot
    await page.screenshot({ path: 'error-screenshot-final.png' });
  } finally {
    // Keep browser open for a moment to see the result
    await page.waitForTimeout(3000);
    // Close browser
    await browser.close();
  }
})();