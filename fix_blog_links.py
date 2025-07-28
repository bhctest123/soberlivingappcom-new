#!/usr/bin/env python3
import os
import re
import glob

def fix_relative_links(content):
    """Fix relative links in the content."""
    # Pattern to match markdown links
    link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
    
    def replace_link(match):
        link_text = match.group(1)
        link_url = match.group(2)
        
        # Fix relative links that start with ../
        if link_url.startswith('../'):
            # Remove all ../ prefixes and leading /
            clean_url = link_url
            while clean_url.startswith('../'):
                clean_url = clean_url[3:]
            
            # Remove .html extension
            if clean_url.endswith('.html'):
                clean_url = clean_url[:-5]
            
            # Add leading / if not present
            if not clean_url.startswith('/'):
                clean_url = '/' + clean_url
            
            return f'[{link_text}]({clean_url})'
        
        return match.group(0)
    
    return re.sub(link_pattern, replace_link, content)

def process_file(filepath):
    """Process a single file to fix relative links."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix relative links
    new_content = fix_relative_links(content)
    
    # Write back if changed
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    """Fix all relative links in blog posts."""
    blog_dir = 'src/content/blog'
    fixed_count = 0
    
    # Get all blog posts
    blog_posts = glob.glob(os.path.join(blog_dir, '*.md'))
    
    print(f"Processing {len(blog_posts)} blog posts...")
    
    for post in blog_posts:
        if process_file(post):
            fixed_count += 1
            print(f"Fixed: {os.path.basename(post)}")
    
    print(f"\nFixed relative links in {fixed_count} files")

if __name__ == '__main__':
    main()