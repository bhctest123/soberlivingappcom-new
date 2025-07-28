#!/usr/bin/env python3
"""
Analyze duplicate images in blog posts
"""

import os
import json
import re
from collections import defaultdict, Counter
from pathlib import Path

def extract_images_from_markdown(file_path):
    """Extract all image references from a markdown file"""
    images = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
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
                    'line': content[:content.find(image_match.group(0))].count('\n') + 1
                })
        
        # Extract markdown images ![alt](path)
        for match in re.finditer(r'!\[([^\]]*)\]\(([^)]+)\)', content):
            images.append({
                'type': 'markdown',
                'path': match.group(2),
                'alt': match.group(1),
                'line': content[:match.start()].count('\n') + 1
            })
        
        # Extract HTML images
        for match in re.finditer(r'<img[^>]+src=["\'](([^"\']+))["\']', content):
            images.append({
                'type': 'html',
                'path': match.group(1),
                'line': content[:match.start()].count('\n') + 1
            })
    
    return images

def main():
    blog_dir = Path('/Users/benweiss/Code/soberlivingappcom/soberlivingappcom-new/src/content/blog')
    
    # Track images by path
    image_usage = defaultdict(list)
    all_posts = []
    
    # Scan all markdown files
    for md_file in blog_dir.glob('**/*.md'):
        relative_path = md_file.relative_to(blog_dir)
        images = extract_images_from_markdown(md_file)
        
        post_info = {
            'file': str(relative_path),
            'images': images,
            'image_count': len(images)
        }
        all_posts.append(post_info)
        
        # Track where each image is used
        for img in images:
            image_usage[img['path']].append({
                'file': str(relative_path),
                'type': img['type'],
                'line': img['line']
            })
    
    # Find duplicates
    duplicate_images = {path: usage for path, usage in image_usage.items() if len(usage) > 1}
    
    # Find most commonly used images
    image_counter = Counter()
    for path, usage in image_usage.items():
        image_counter[path] = len(usage)
    
    # Generate report
    report = {
        'summary': {
            'total_posts': len(all_posts),
            'total_unique_images': len(image_usage),
            'duplicate_images': len(duplicate_images),
            'posts_with_duplicates': len(set(usage['file'] for usages in duplicate_images.values() for usage in usages))
        },
        'duplicate_images': duplicate_images,
        'most_used_images': image_counter.most_common(20),
        'posts_by_image_count': sorted(all_posts, key=lambda x: x['image_count'], reverse=True)[:20]
    }
    
    # Write detailed report
    with open('blog_image_audit_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    # Write human-readable report
    with open('BLOG_IMAGE_AUDIT.md', 'w') as f:
        f.write("# Blog Image Audit Report\n\n")
        f.write(f"Generated: {Path(__file__).stat().st_mtime}\n\n")
        
        f.write("## Summary\n\n")
        f.write(f"- **Total Blog Posts**: {report['summary']['total_posts']}\n")
        f.write(f"- **Total Unique Images**: {report['summary']['total_unique_images']}\n")
        f.write(f"- **Duplicate Images**: {report['summary']['duplicate_images']}\n")
        f.write(f"- **Posts with Duplicate Images**: {report['summary']['posts_with_duplicates']}\n\n")
        
        f.write("## Duplicate Images\n\n")
        f.write("These images are used in multiple blog posts:\n\n")
        
        for image_path, usages in sorted(duplicate_images.items(), key=lambda x: len(x[1]), reverse=True):
            f.write(f"### `{image_path}` (Used {len(usages)} times)\n\n")
            for usage in usages:
                f.write(f"- **{usage['file']}** (line {usage['line']}, {usage['type']})\n")
            f.write("\n")
        
        f.write("## Most Used Images (Top 20)\n\n")
        f.write("| Image Path | Usage Count |\n")
        f.write("|------------|-------------|\n")
        for path, count in report['most_used_images']:
            f.write(f"| `{path}` | {count} |\n")
        
        f.write("\n## Posts with Most Images (Top 20)\n\n")
        f.write("| Post | Image Count |\n")
        f.write("|------|-------------|\n")
        for post in report['posts_by_image_count']:
            f.write(f"| {post['file']} | {post['image_count']} |\n")
        
        f.write("\n## Recommendations\n\n")
        f.write("1. **Generic Images**: Many posts use generic or placeholder images that should be replaced with unique, relevant images\n")
        f.write("2. **Featured Images**: Ensure each post has a unique featured image that relates to its content\n")
        f.write("3. **Image Naming**: Use descriptive names that include the post title or topic\n")
        f.write("4. **SEO Impact**: Duplicate images can negatively impact SEO - each post should have unique visual content\n")
        f.write("5. **Next Steps**:\n")
        f.write("   - Generate unique images for posts currently using duplicates\n")
        f.write("   - Update image alt text to be specific to each post\n")
        f.write("   - Consider using AI image generation for unique featured images\n")

if __name__ == "__main__":
    main()