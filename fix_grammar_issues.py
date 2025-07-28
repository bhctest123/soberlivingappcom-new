#!/usr/bin/env python3
import os
import re
import glob

def fix_grammar_issues(content):
    """Fix grammar issues like missing spaces after punctuation."""
    # Fix missing space after period, exclamation, or question mark followed by capital letter
    content = re.sub(r'([.!?])([A-Z])', r'\1 \2', content)
    
    return content

def process_file(filepath):
    """Process a single file to fix grammar issues."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix grammar issues
    new_content = fix_grammar_issues(content)
    
    # Write back if changed
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    """Fix grammar issues in all blog posts."""
    blog_dir = 'src/content/blog'
    fixed_count = 0
    
    # Get all blog posts
    blog_posts = glob.glob(os.path.join(blog_dir, '*.md'))
    
    print(f"Processing {len(blog_posts)} blog posts for grammar issues...")
    
    for post in blog_posts:
        if process_file(post):
            fixed_count += 1
            print(f"Fixed: {os.path.basename(post)}")
    
    print(f"\nFixed grammar issues in {fixed_count} files")

if __name__ == '__main__':
    main()