#!/usr/bin/env python3
"""
Compare original blog post images with current implementation
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict
from bs4 import BeautifulSoup

def extract_images_from_html(html_file):
    """Extract all image references from an HTML file"""
    images = []
    
    with open(html_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
        
        # Extract featured image from meta tags
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            img_url = og_image['content']
            # Extract filename from URL
            filename = img_url.split('/')[-1].split('?')[0]
            images.append({
                'type': 'featured',
                'url': img_url,
                'filename': filename
            })
        
        # Extract images from content
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src')
            if src:
                filename = src.split('/')[-1].split('?')[0]
                images.append({
                    'type': 'content',
                    'url': src,
                    'filename': filename,
                    'alt': img.get('alt', '')
                })
    
    return images

def extract_images_from_markdown(md_file):
    """Extract all image references from a markdown file"""
    images = []
    
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
        # Extract frontmatter image
        frontmatter_match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
        if frontmatter_match:
            frontmatter = frontmatter_match.group(1)
            image_match = re.search(r'image:\s*"([^"]+)"', frontmatter)
            if image_match:
                images.append({
                    'type': 'frontmatter',
                    'path': image_match.group(1),
                    'filename': os.path.basename(image_match.group(1))
                })
        
        # Extract markdown images
        for match in re.finditer(r'!\[([^\]]*)\]\(([^)]+)\)', content):
            images.append({
                'type': 'markdown',
                'path': match.group(2),
                'filename': os.path.basename(match.group(2)),
                'alt': match.group(1)
            })
    
    return images

def find_matching_files(original_dir, new_dir):
    """Find blog posts that exist in both directories"""
    matches = []
    
    # Map of URL patterns to filenames
    for year_dir in Path(original_dir).glob('*/'):
        if not year_dir.is_dir() or not year_dir.name.isdigit():
            continue
            
        for month_dir in year_dir.glob('*/'):
            if not month_dir.is_dir():
                continue
                
            for day_dir in month_dir.glob('*/'):
                if not day_dir.is_dir():
                    continue
                    
                for html_file in day_dir.glob('*.html'):
                    # Build potential markdown filename
                    slug = html_file.stem
                    md_file = Path(new_dir) / f"{slug}.md"
                    
                    if md_file.exists():
                        matches.append({
                            'slug': slug,
                            'html': html_file,
                            'markdown': md_file,
                            'url_path': f"{year_dir.name}/{month_dir.name}/{day_dir.name}/{slug}"
                        })
    
    return matches

def main():
    original_blog_dir = '/Users/benweiss/Code/soberlivingappcom/soberlivingappcom-current-sitesucker/soberlivingapp.com/sober-living-app-blog'
    new_blog_dir = '/Users/benweiss/Code/soberlivingappcom/soberlivingappcom-new/src/content/blog'
    
    # Find matching blog posts
    matches = find_matching_files(original_blog_dir, new_blog_dir)
    
    mismatches = []
    correct_matches = []
    
    for match in matches:
        try:
            # Extract images from both versions
            html_images = extract_images_from_html(match['html'])
            md_images = extract_images_from_markdown(match['markdown'])
            
            # Compare featured images
            html_featured = next((img for img in html_images if img['type'] == 'featured'), None)
            md_featured = next((img for img in md_images if img['type'] == 'frontmatter'), None)
            
            if html_featured and md_featured:
                if html_featured['filename'] != md_featured['filename']:
                    mismatches.append({
                        'post': match['slug'],
                        'type': 'featured_image_mismatch',
                        'original': html_featured['filename'],
                        'current': md_featured['filename'],
                        'markdown_file': str(match['markdown'])
                    })
                else:
                    correct_matches.append({
                        'post': match['slug'],
                        'type': 'featured_image_match',
                        'image': html_featured['filename']
                    })
            
            # Check for duplicate images in content
            md_content_images = [img for img in md_images if img['type'] == 'markdown']
            seen_images = set()
            duplicates = []
            
            for img in md_content_images:
                if img['filename'] in seen_images:
                    duplicates.append(img['filename'])
                seen_images.add(img['filename'])
            
            if duplicates:
                mismatches.append({
                    'post': match['slug'],
                    'type': 'duplicate_images',
                    'duplicates': list(set(duplicates)),
                    'markdown_file': str(match['markdown'])
                })
                
        except Exception as e:
            print(f"Error processing {match['slug']}: {e}")
    
    # Generate report
    report = {
        'total_posts_analyzed': len(matches),
        'posts_with_mismatches': len(set(m['post'] for m in mismatches)),
        'correct_featured_images': len(correct_matches),
        'mismatches': mismatches
    }
    
    # Write JSON report
    with open('blog_image_comparison_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    # Write human-readable report
    with open('BLOG_IMAGE_COMPARISON.md', 'w') as f:
        f.write("# Blog Image Comparison Report\n\n")
        f.write(f"Analyzed {report['total_posts_analyzed']} blog posts\n\n")
        
        f.write("## Summary\n\n")
        f.write(f"- **Posts with correct featured images**: {report['correct_featured_images']}\n")
        f.write(f"- **Posts with mismatches**: {report['posts_with_mismatches']}\n\n")
        
        f.write("## Featured Image Mismatches\n\n")
        f.write("These posts are using the wrong featured image:\n\n")
        
        featured_mismatches = [m for m in mismatches if m['type'] == 'featured_image_mismatch']
        for mismatch in featured_mismatches:
            f.write(f"### {mismatch['post']}\n")
            f.write(f"- **Original**: `{mismatch['original']}`\n")
            f.write(f"- **Current**: `{mismatch['current']}`\n")
            f.write(f"- **File**: `{mismatch['markdown_file']}`\n\n")
        
        f.write("## Posts with Duplicate Images\n\n")
        duplicates = [m for m in mismatches if m['type'] == 'duplicate_images']
        for dup in duplicates:
            f.write(f"### {dup['post']}\n")
            f.write(f"- **Duplicate images**: {', '.join(dup['duplicates'])}\n")
            f.write(f"- **File**: `{dup['markdown_file']}`\n\n")
        
        f.write("## Fix Script\n\n")
        f.write("```python\n")
        f.write("# Script to fix featured image mismatches\n")
        f.write("import re\n\n")
        f.write("fixes = [\n")
        for mismatch in featured_mismatches:
            f.write(f"    {{\n")
            f.write(f"        'file': '{mismatch['markdown_file']}',\n")
            f.write(f"        'old': '{mismatch['current']}',\n")
            f.write(f"        'new': '{mismatch['original']}'\n")
            f.write(f"    }},\n")
        f.write("]\n\n")
        f.write("for fix in fixes:\n")
        f.write("    with open(fix['file'], 'r') as f:\n")
        f.write("        content = f.read()\n")
        f.write("    content = re.sub(f'image: \"/images/blog/[^/]+/{fix[\"old\"]}\"',\n")
        f.write("                     f'image: \"/images/blog/[^/]+/{fix[\"new\"]}\"',\n")
        f.write("                     content)\n")
        f.write("    with open(fix['file'], 'w') as f:\n")
        f.write("        f.write(content)\n")
        f.write("```\n")

if __name__ == "__main__":
    main()