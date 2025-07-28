#!/usr/bin/env python3
import os
import re
import glob
import json
from collections import defaultdict

# Common spelling mistakes and corrections
COMMON_MISSPELLINGS = {
    'recieve': 'receive',
    'seperate': 'separate',
    'occured': 'occurred',
    'accomodate': 'accommodate',
    'acheive': 'achieve',
    'adress': 'address',
    'begining': 'beginning',
    'beleive': 'believe',
    'calender': 'calendar',
    'collegue': 'colleague',
    'comming': 'coming',
    'commited': 'committed',
    'concious': 'conscious',
    'decieve': 'deceive',
    'definately': 'definitely',
    'diferent': 'different',
    'embarass': 'embarrass',
    'enviroment': 'environment',
    'existance': 'existence',
    'experiance': 'experience',
    'finaly': 'finally',
    'foriegn': 'foreign',
    'fourty': 'forty',
    'goverment': 'government',
    'grammer': 'grammar',
    'harrass': 'harass',
    'idiosyncracy': 'idiosyncrasy',
    'immediatly': 'immediately',
    'incidently': 'incidentally',
    'independant': 'independent',
    'interupt': 'interrupt',
    'judgement': 'judgment',
    'knowlege': 'knowledge',
    'liase': 'liaise',
    'liason': 'liaison',
    'maintainance': 'maintenance',
    'mischievious': 'mischievous',
    'neccessary': 'necessary',
    'noticable': 'noticeable',
    'occassion': 'occasion',
    'occurence': 'occurrence',
    'pavillion': 'pavilion',
    'perseverence': 'perseverance',
    'posession': 'possession',
    'prefered': 'preferred',
    'priviledge': 'privilege',
    'probaly': 'probably',
    'publically': 'publicly',
    'recieve': 'receive',
    'refered': 'referred',
    'rember': 'remember',
    'resistence': 'resistance',
    'sence': 'sense',
    'seperate': 'separate',
    'succesful': 'successful',
    'supercede': 'supersede',
    'surprize': 'surprise',
    'tendancy': 'tendency',
    'therefor': 'therefore',
    'threshhold': 'threshold',
    'tommorow': 'tomorrow',
    'tounge': 'tongue',
    'truely': 'truly',
    'unfortunatly': 'unfortunately',
    'untill': 'until',
    'upmost': 'utmost',
    'vaccuum': 'vacuum',
    'whereever': 'wherever',
    'wich': 'which',
    'wierd': 'weird'
}

def check_blog_post(filepath):
    """Check a single blog post for various issues."""
    issues = defaultdict(list)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')
    
    # Extract frontmatter
    if content.startswith('---'):
        frontmatter_end = content.find('---', 3)
        if frontmatter_end > 0:
            frontmatter = content[3:frontmatter_end]
            body = content[frontmatter_end+3:]
        else:
            frontmatter = ""
            body = content
    else:
        frontmatter = ""
        body = content
    
    # Check for nbsp entities
    if 'nbsp' in filepath:
        issues['filename'].append("Filename contains 'nbsp' - should be removed")
    
    # Check frontmatter
    if 'title:' in frontmatter:
        title_match = re.search(r'title:\s*"([^"]+)"', frontmatter)
        if title_match:
            title = title_match.group(1)
            # Check for HTML entities in title
            if '&' in title and ';' in title:
                issues['title'].append(f"Title contains HTML entities: {title}")
            # Check for nbsp in title
            if 'nbsp' in title:
                issues['title'].append(f"Title contains 'nbsp': {title}")
    
    # Check for missing image
    if 'image:' not in frontmatter and 'featured: true' in frontmatter:
        issues['image'].append("Featured post missing image")
    
    # Check for broken image references
    image_match = re.search(r'image:\s*"([^"]+)"', frontmatter)
    if image_match:
        image_path = image_match.group(1)
        # Check if image exists
        if image_path.startswith('/images/blog/'):
            full_path = 'public' + image_path
            if not os.path.exists(full_path):
                issues['image'].append(f"Image not found: {image_path}")
    
    # Check body content
    for i, line in enumerate(lines):
        line_num = i + 1
        
        # Check for common misspellings
        for misspelling, correct in COMMON_MISSPELLINGS.items():
            if re.search(r'\b' + misspelling + r'\b', line, re.IGNORECASE):
                issues['spelling'].append(f"Line {line_num}: '{misspelling}' should be '{correct}'")
        
        # Check for double spaces
        if '  ' in line and not line.strip().startswith('*') and not line.strip().startswith('-'):
            issues['formatting'].append(f"Line {line_num}: Double spaces found")
        
        # Check for missing spaces after punctuation
        if re.search(r'[.!?][A-Z]', line):
            issues['grammar'].append(f"Line {line_num}: Missing space after punctuation")
        
        # Check for empty headings
        if re.match(r'^#+\s*$', line):
            issues['formatting'].append(f"Line {line_num}: Empty heading")
        
        # Check for broken markdown links
        link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
        for match in re.finditer(link_pattern, line):
            link_text = match.group(1)
            link_url = match.group(2)
            
            # Check for empty link text
            if not link_text.strip():
                issues['links'].append(f"Line {line_num}: Empty link text")
            
            # Check for broken relative links
            if link_url.startswith('../'):
                issues['links'].append(f"Line {line_num}: Relative link found: {link_url}")
            
            # Check for localhost links
            if 'localhost' in link_url:
                issues['links'].append(f"Line {line_num}: Localhost link found: {link_url}")
    
    # Check for inconsistent heading levels
    headings = re.findall(r'^(#+)\s+(.+)$', body, re.MULTILINE)
    if headings:
        prev_level = 0
        for heading in headings:
            level = len(heading[0])
            if prev_level > 0 and level > prev_level + 1:
                issues['formatting'].append(f"Heading level jump: '{heading[1]}' (level {level} after level {prev_level})")
            prev_level = level
    
    return issues

def main():
    """Check all blog posts and generate a report."""
    blog_dir = 'src/content/blog'
    all_issues = {}
    
    # Get all blog posts
    blog_posts = glob.glob(os.path.join(blog_dir, '*.md'))
    blog_posts.sort()
    
    print(f"Checking {len(blog_posts)} blog posts...\n")
    
    # Check each post
    for post in blog_posts:
        issues = check_blog_post(post)
        if any(issues.values()):
            all_issues[os.path.basename(post)] = dict(issues)
    
    # Generate report
    if all_issues:
        print(f"Found issues in {len(all_issues)} blog posts:\n")
        
        # Summary by issue type
        issue_counts = defaultdict(int)
        for post_issues in all_issues.values():
            for issue_type, issues in post_issues.items():
                issue_counts[issue_type] += len(issues)
        
        print("Summary by issue type:")
        for issue_type, count in sorted(issue_counts.items()):
            print(f"  - {issue_type}: {count} issues")
        print()
        
        # Detailed report
        for post, issues in sorted(all_issues.items()):
            print(f"\n{post}:")
            for issue_type, issue_list in sorted(issues.items()):
                print(f"  {issue_type}:")
                for issue in issue_list:
                    print(f"    - {issue}")
    else:
        print("No issues found!")
    
    # Save detailed report
    with open('blog_issues_report.json', 'w') as f:
        json.dump(all_issues, f, indent=2)
    
    print(f"\nDetailed report saved to blog_issues_report.json")

if __name__ == '__main__':
    main()