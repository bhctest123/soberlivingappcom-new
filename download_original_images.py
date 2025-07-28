#!/usr/bin/env python3
"""
Download original images from Squarespace blog posts
"""

import os
import re
import json
import requests
from pathlib import Path
from urllib.parse import unquote, urlparse
from bs4 import BeautifulSoup
from collections import defaultdict
import time

def extract_all_images_from_html(html_file):
    """Extract ALL image URLs from an HTML file"""
    images = []
    
    with open(html_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
        
        # Extract featured image from meta tags
        for meta_tag in ['og:image', 'twitter:image']:
            tag = soup.find('meta', property=meta_tag)
            if not tag:
                tag = soup.find('meta', {'name': meta_tag})
            if tag and tag.get('content'):
                images.append({
                    'url': tag['content'],
                    'type': 'featured',
                    'source': f'meta_{meta_tag}'
                })
        
        # Extract from itemprop
        tag = soup.find('meta', itemprop='image')
        if tag and tag.get('content'):
            images.append({
                'url': tag['content'],
                'type': 'featured',
                'source': 'meta_itemprop'
            })
        
        # Extract from link rel="image_src"
        tag = soup.find('link', rel='image_src')
        if tag and tag.get('href'):
            images.append({
                'url': tag['href'],
                'type': 'featured',
                'source': 'link_image_src'
            })
        
        # Extract all images from content
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src')
            if src and ('squarespace' in src or 'sqspcdn' in src):
                images.append({
                    'url': src,
                    'type': 'content',
                    'source': 'img_tag',
                    'alt': img.get('alt', '')
                })
    
    return images

def normalize_image_url(url):
    """Normalize Squarespace image URL"""
    # Remove query parameters for comparison
    base_url = url.split('?')[0]
    
    # Handle protocol-relative URLs
    if base_url.startswith('//'):
        base_url = 'https:' + base_url
    elif base_url.startswith('http://'):
        base_url = base_url.replace('http://', 'https://')
    
    return base_url

def extract_filename_from_url(url):
    """Extract filename from Squarespace URL"""
    # Get the last part of the URL path
    parsed = urlparse(url)
    path_parts = parsed.path.split('/')
    
    # Find the filename (usually the last part)
    filename = None
    for part in reversed(path_parts):
        if part and ('+' in part or '.' in part):
            filename = unquote(part)
            break
    
    if not filename:
        # Use the ID from the URL as filename
        if '/t/' in url:
            parts = url.split('/t/')[1].split('/')[0]
            filename = f"image_{parts}"
    
    return filename

def download_image(url, output_path):
    """Download image from URL"""
    try:
        # Add format parameter for best quality
        if '?' in url:
            url += '&format=original'
        else:
            url += '?format=original'
        
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def main():
    original_blog_dir = '/Users/benweiss/Code/soberlivingappcom/soberlivingappcom-current-sitesucker/soberlivingapp.com/sober-living-app-blog'
    output_base_dir = '/Users/benweiss/Code/soberlivingappcom/soberlivingappcom-new/public/images/blog'
    
    # Track all images to download
    images_to_download = defaultdict(list)
    download_log = []
    
    # Find all HTML files
    for year_dir in Path(original_blog_dir).glob('*/'):
        if not year_dir.is_dir() or not year_dir.name.isdigit():
            continue
            
        for month_dir in year_dir.glob('*/'):
            if not month_dir.is_dir():
                continue
                
            for day_dir in month_dir.glob('*/'):
                if not day_dir.is_dir():
                    continue
                    
                for html_file in day_dir.glob('*.html'):
                    slug = html_file.stem
                    
                    # Extract all images
                    images = extract_all_images_from_html(html_file)
                    
                    if images:
                        # Get unique featured image (first one found)
                        featured_images = [img for img in images if img['type'] == 'featured']
                        if featured_images:
                            # Normalize URLs and deduplicate
                            seen_urls = set()
                            unique_featured = None
                            
                            for img in featured_images:
                                normalized = normalize_image_url(img['url'])
                                if normalized not in seen_urls:
                                    seen_urls.add(normalized)
                                    unique_featured = img
                                    break
                            
                            if unique_featured:
                                filename = extract_filename_from_url(unique_featured['url'])
                                if filename:
                                    images_to_download[slug].append({
                                        'url': unique_featured['url'],
                                        'filename': filename,
                                        'type': 'featured'
                                    })
                        
                        # Get content images
                        content_images = [img for img in images if img['type'] == 'content']
                        for img in content_images:
                            filename = extract_filename_from_url(img['url'])
                            if filename:
                                images_to_download[slug].append({
                                    'url': img['url'],
                                    'filename': filename,
                                    'type': 'content',
                                    'alt': img.get('alt', '')
                                })
    
    # Download images
    print(f"Found {sum(len(imgs) for imgs in images_to_download.values())} images to download from {len(images_to_download)} posts")
    
    for slug, images in images_to_download.items():
        # Create directory for this post
        post_dir = Path(output_base_dir) / slug
        post_dir.mkdir(parents=True, exist_ok=True)
        
        for img in images:
            output_path = post_dir / img['filename']
            
            if output_path.exists():
                print(f"Skipping existing: {img['filename']}")
                download_log.append({
                    'slug': slug,
                    'filename': img['filename'],
                    'status': 'existed',
                    'type': img['type']
                })
            else:
                print(f"Downloading: {img['filename']} for {slug}")
                success = download_image(img['url'], output_path)
                
                download_log.append({
                    'slug': slug,
                    'filename': img['filename'],
                    'url': img['url'],
                    'status': 'success' if success else 'failed',
                    'type': img['type']
                })
                
                # Rate limit to avoid overwhelming server
                time.sleep(0.5)
    
    # Write download log
    with open('image_download_log.json', 'w') as f:
        json.dump({
            'total_images': len(download_log),
            'posts_processed': len(images_to_download),
            'downloads': download_log
        }, f, indent=2)
    
    # Generate update script
    generate_update_script(images_to_download)

def generate_update_script(images_data):
    """Generate script to update markdown files with correct images"""
    
    updates = []
    for slug, images in images_data.items():
        featured = next((img for img in images if img['type'] == 'featured'), None)
        if featured:
            updates.append({
                'slug': slug,
                'filename': featured['filename']
            })
    
    with open('update_blog_images.py', 'w') as f:
        f.write('''#!/usr/bin/env python3
"""
Update blog posts with correct featured images
"""

import re
from pathlib import Path

updates = ''')
        f.write(repr(updates))
        f.write('''

blog_dir = Path('/Users/benweiss/Code/soberlivingappcom/soberlivingappcom-new/src/content/blog')

for update in updates:
    md_file = blog_dir / f"{update['slug']}.md"
    
    if md_file.exists():
        with open(md_file, 'r') as f:
            content = f.read()
        
        # Update featured image in frontmatter
        new_content = re.sub(
            r'image: "/images/blog/[^"]+/[^"]+',
            f'image: "/images/blog/{update["slug"]}/{update["filename"]}',
            content
        )
        
        if new_content != content:
            with open(md_file, 'w') as f:
                f.write(new_content)
            print(f"Updated {update['slug']}")
        else:
            print(f"No change needed for {update['slug']}")
    else:
        print(f"File not found: {update['slug']}")
''')

if __name__ == "__main__":
    main()