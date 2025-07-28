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

    // Close any modal/overlay if present
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

    // Check for hamburger menu button - it's visible in the screenshot as three lines
    console.log('Looking for hamburger menu button...');
    
    // The hamburger menu is visible as three horizontal lines in the top right
    // Let's find it more specifically
    const hamburgerButton = await page.$('nav button, header button');
    
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

      // Get button HTML
      const buttonHTML = await hamburgerButton.evaluate(el => el.outerHTML);
      console.log('Button HTML:', buttonHTML);

      // Highlight the button before screenshot
      await hamburgerButton.evaluate(el => {
        el.style.border = '3px solid red';
        el.style.boxShadow = '0 0 10px red';
      });

      // Take screenshot
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = `mobile-view-clean-${timestamp}.png`;
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: false 
      });
      console.log(`Screenshot saved as: ${screenshotPath}`);

      // Try clicking the hamburger menu
      console.log('Attempting to click hamburger menu...');
      await hamburgerButton.click();
      
      // Wait for menu to open
      await page.waitForTimeout(1000);
      
      // Check if mobile menu is now visible
      const mobileMenu = await page.$('nav[aria-expanded="true"], .mobile-menu-open, nav.open, [data-mobile-menu-open]');
      if (mobileMenu) {
        console.log('Mobile menu opened successfully!');
      } else {
        console.log('Checking for any visible navigation items...');
        const navItems = await page.$$('nav a:visible, nav li:visible');
        console.log(`Found ${navItems.length} visible navigation items`);
      }
      
      // Take another screenshot with menu open
      const menuOpenPath = `mobile-menu-open-${timestamp}.png`;
      await page.screenshot({ 
        path: menuOpenPath,
        fullPage: false 
      });
      console.log(`Screenshot with menu open saved as: ${menuOpenPath}`);

      // Get all visible links in the mobile menu
      const menuLinks = await page.$$eval('nav a:visible', links => 
        links.map(link => ({
          text: link.textContent.trim(),
          href: link.href
        }))
      );
      console.log('Mobile menu links:', menuLinks);

    } else {
      console.log('Hamburger menu button not found!');
    }

    // Additional debugging: log all buttons on the page
    const allButtons = await page.$$eval('button', buttons => 
      buttons.map(btn => ({
        text: btn.textContent.trim(),
        isVisible: btn.offsetParent !== null,
        className: btn.className,
        id: btn.id
      }))
    );
    console.log('All buttons on page:', allButtons);

  } catch (error) {
    console.error('Error:', error);
    // Take error screenshot
    await page.screenshot({ path: 'error-screenshot-improved.png' });
  } finally {
    // Close browser
    await browser.close();
  }
})();