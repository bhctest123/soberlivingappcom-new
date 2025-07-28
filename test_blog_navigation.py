#!/usr/bin/env python3
"""Test blog post navigation buttons with Playwright"""

import asyncio
from playwright.async_api import async_playwright

async def test_blog_navigation():
    async with async_playwright() as p:
        # Launch browser in non-headless mode so you can see it
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        # Navigate to the specific blog post
        url = "http://localhost:4321/sober-living-app-blog/2025/1/13/sober-living-home-regulations-for-narr-affiliate-operators-in-south-dakota-north-dakota-alaska-and-wyoming"
        print(f"Navigating to: {url}")
        await page.goto(url)
        
        # Wait for the page to load
        await page.wait_for_load_state('networkidle')
        
        # Take a screenshot of the full page
        print("Taking screenshot of the full page...")
        await page.screenshot(path="blog_post_full.png", full_page=True)
        print("Screenshot saved as blog_post_full.png")
        
        # Scroll to the bottom to see navigation
        print("Scrolling to bottom of page...")
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(1000)  # Wait for scroll to complete
        
        # Take a screenshot of the bottom area
        await page.screenshot(path="blog_post_bottom.png")
        print("Screenshot saved as blog_post_bottom.png")
        
        # Check for navigation buttons
        print("\nChecking for navigation buttons...")
        
        # Look for Previous Post button
        prev_button = await page.query_selector('a:has-text("Previous Post")')
        if prev_button:
            print("✓ Previous Post button found")
            prev_text = await prev_button.inner_text()
            print(f"  Previous post title: {prev_text}")
            
            # Click on Previous Post
            print("  Clicking Previous Post button...")
            await prev_button.click()
            await page.wait_for_load_state('networkidle')
            new_url = page.url
            print(f"  Navigated to: {new_url}")
            
            # Go back
            await page.go_back()
            await page.wait_for_load_state('networkidle')
        else:
            print("✗ Previous Post button not found")
        
        # Look for Next Post button
        next_button = await page.query_selector('a:has-text("Next Post")')
        if next_button:
            print("\n✓ Next Post button found")
            next_text = await next_button.inner_text()
            print(f"  Next post title: {next_text}")
            
            # Click on Next Post
            print("  Clicking Next Post button...")
            await next_button.click()
            await page.wait_for_load_state('networkidle')
            new_url = page.url
            print(f"  Navigated to: {new_url}")
        else:
            print("\n✗ Next Post button not found")
        
        # Keep browser open for 10 seconds so you can see it
        print("\nKeeping browser open for 10 seconds...")
        await page.wait_for_timeout(10000)
        
        await browser.close()
        print("\nTest completed!")

if __name__ == "__main__":
    asyncio.run(test_blog_navigation())