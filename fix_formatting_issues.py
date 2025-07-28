#!/usr/bin/env python3
import os
import re
import glob

def fix_formatting_issues(content):
    """Fix formatting issues like double spaces."""
    lines = content.split('\n')
    fixed_lines = []
    
    for line in lines:
        # Skip lines that are list items or markdown formatting
        if line.strip().startswith('*') or line.strip().startswith('-') or line.strip().startswith('#'):
            fixed_lines.append(line)
            continue
        
        # Fix double spaces in regular text
        while '  ' in line:
            line = line.replace('  ', ' ')
        
        fixed_lines.append(line)
    
    return '\n'.join(fixed_lines)

def process_file(filepath):
    """Process a single file to fix formatting issues."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix formatting issues
    new_content = fix_formatting_issues(content)
    
    # Write back if changed
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    """Fix formatting issues in all blog posts."""
    blog_dir = 'src/content/blog'
    fixed_count = 0
    
    # Get all blog posts
    blog_posts = glob.glob(os.path.join(blog_dir, '*.md'))
    
    print(f"Processing {len(blog_posts)} blog posts for formatting issues...")
    
    for post in blog_posts:
        if process_file(post):
            fixed_count += 1
            print(f"Fixed: {os.path.basename(post)}")
    
    print(f"\nFixed formatting issues in {fixed_count} files")

if __name__ == '__main__':
    main()