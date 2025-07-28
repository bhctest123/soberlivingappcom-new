#!/usr/bin/env python3
"""
Check for missing images across all pages of the soberlivingapp.com Netlify site
"""

import asyncio
import json
from datetime import datetime
from playwright.async_api import async_playwright
from urllib.parse import urljoin, urlparse
import sys

BASE_URL = "http://localhost:4321"

# Define all pages to check
STATIC_PAGES = [
    "/",
    "/about",
    "/contact",
    "/download",
    "/login",
    "/pricing",
    "/signup",
    "/blog",
    "/west-virginia-narr-state-affiliate",
    # Features pages
    "/features/admissions",
    "/features/alumni",
    "/features/bed-management",
    "/features/billing",
    "/features/contacts",
    "/features/dashboard",
    "/features/dashboard/admissions",
    "/features/dashboard/admissions-breakdown",
    "/features/dashboard/alumni",
    "/features/dashboard/alumni-breakdown",
    "/features/dashboard/billing",
    "/features/dashboard/communication",
    "/features/dashboard/drug-testing",
    "/features/dashboard/employee",
    "/features/dashboard/housing",
    "/features/dashboard/operations",
    "/features/dashboard/property",
    "/features/dashboard/scheduling",
    "/features/dashboard/task",
    "/features/employees",
    "/features/file-storage",
    "/features/housing",
    "/features/mobile",
    "/features/operations",
    "/features/organizations",
    "/features/portal",
    "/features/properties",
    "/features/residents",
    "/features/scheduling",
    "/features/security",
    "/features/tasks",
    # Special pages
    "/blog/alabama",
    "/blog/regulations"
]

async def get_all_blog_posts(page):
    """Get all blog post URLs from the blog page"""
    await page.goto(f"{BASE_URL}/blog", wait_until="networkidle")
    
    # Get all blog post links
    blog_links = await page.evaluate("""
        () => {
            const links = document.querySelectorAll('a[href^="/blog/"]');
            return Array.from(links)
                .map(link => link.href)
                .filter(href => {
                    const path = new URL(href).pathname;
                    return path.startsWith('/blog/') && 
                           path !== '/blog/' && 
                           !path.includes('/tag/') &&
                           !path.includes('/category/') &&
                           path !== '/blog/alabama' &&
                           path !== '/blog/regulations';
                })
                .filter((value, index, self) => self.indexOf(value) === index);
        }
    """)
    
    return [urlparse(url).path for url in blog_links]

async def check_images_on_page(page, url, base_url):
    """Check all images on a page and return broken ones"""
    full_url = urljoin(base_url, url)
    broken_images = []
    
    try:
        # Navigate to the page
        response = await page.goto(full_url, wait_until="networkidle", timeout=30000)
        
        if response and response.status != 200:
            print(f"⚠️  Page returned status {response.status}: {url}")
            return broken_images
        
        # Wait a bit for lazy-loaded images
        await page.wait_for_timeout(2000)
        
        # Get all image elements
        images = await page.evaluate("""
            () => {
                const imgs = [];
                
                // Regular img tags
                document.querySelectorAll('img').forEach(img => {
                    imgs.push({
                        src: img.src,
                        alt: img.alt,
                        naturalWidth: img.naturalWidth,
                        naturalHeight: img.naturalHeight,
                        complete: img.complete,
                        type: 'img'
                    });
                });
                
                // Background images
                document.querySelectorAll('*').forEach(el => {
                    const bg = window.getComputedStyle(el).backgroundImage;
                    if (bg && bg !== 'none' && bg.includes('url(')) {
                        const urlMatch = bg.match(/url\\(['"]?([^'")]+)['"]?\\)/);
                        if (urlMatch) {
                            imgs.push({
                                src: urlMatch[1],
                                alt: '',
                                type: 'background'
                            });
                        }
                    }
                });
                
                return imgs;
            }
        """)
        
        # Check each image
        for img in images:
            if not img['src']:
                continue
                
            # Skip data URLs and external images we don't control
            if img['src'].startswith('data:') or 'googleusercontent.com' in img['src']:
                continue
            
            # For regular img tags, check if they loaded
            if img['type'] == 'img':
                if not img['complete'] or img['naturalWidth'] == 0:
                    broken_images.append({
                        'src': img['src'],
                        'alt': img['alt'],
                        'type': img['type']
                    })
            else:
                # For background images, try to fetch them
                try:
                    img_response = await page.context.request.get(img['src'])
                    if img_response.status >= 400:
                        broken_images.append({
                            'src': img['src'],
                            'alt': img['alt'],
                            'type': img['type'],
                            'status': img_response.status
                        })
                except:
                    broken_images.append({
                        'src': img['src'],
                        'alt': img['alt'],
                        'type': img['type'],
                        'error': 'Failed to fetch'
                    })
        
        if broken_images:
            print(f"❌ Found {len(broken_images)} broken images on {url}")
        else:
            print(f"✅ All images OK on {url}")
            
    except Exception as e:
        print(f"❌ Error checking {url}: {str(e)}")
        
    return broken_images

async def main():
    """Main function to check all pages"""
    print(f"🔍 Starting image check on {BASE_URL}")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    all_broken_images = {}
    
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            ignore_https_errors=True
        )
        page = await context.new_page()
        
        # Check static pages
        print("\n📄 Checking static pages...")
        for url in STATIC_PAGES:
            broken = await check_images_on_page(page, url, BASE_URL)
            if broken:
                all_broken_images[url] = broken
        
        # Get and check all blog posts
        print("\n📝 Getting blog post URLs...")
        blog_posts = await get_all_blog_posts(page)
        print(f"Found {len(blog_posts)} blog posts to check")
        
        print("\n📝 Checking blog posts...")
        for i, url in enumerate(blog_posts, 1):
            print(f"[{i}/{len(blog_posts)}] Checking {url}")
            broken = await check_images_on_page(page, url, BASE_URL)
            if broken:
                all_broken_images[url] = broken
        
        await browser.close()
    
    # Generate report
    print("\n" + "=" * 80)
    print("📊 SUMMARY REPORT")
    print("=" * 80)
    
    if not all_broken_images:
        print("✅ No broken images found! All images are loading correctly.")
    else:
        total_broken = sum(len(images) for images in all_broken_images.values())
        print(f"❌ Found {total_broken} broken images across {len(all_broken_images)} pages")
        
        print("\n📋 Detailed breakdown:")
        for page_url, images in all_broken_images.items():
            print(f"\n{page_url} ({len(images)} broken images):")
            for img in images:
                print(f"  - {img['src']}")
                if img.get('alt'):
                    print(f"    Alt: {img['alt']}")
                if img.get('status'):
                    print(f"    Status: {img['status']}")
                if img.get('error'):
                    print(f"    Error: {img['error']}")
    
    # Save detailed report
    report = {
        "check_date": datetime.now().isoformat(),
        "base_url": BASE_URL,
        "total_pages_checked": len(STATIC_PAGES) + len(blog_posts),
        "pages_with_broken_images": len(all_broken_images),
        "total_broken_images": sum(len(images) for images in all_broken_images.values()),
        "broken_images_by_page": all_broken_images
    }
    
    with open("missing_images_report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"\n💾 Detailed report saved to missing_images_report.json")
    
    # Return exit code based on findings
    return 1 if all_broken_images else 0

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)