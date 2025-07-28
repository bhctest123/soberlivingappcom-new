#!/usr/bin/env python3
"""
Fix the Florida blog post image as an example
"""

import re

# The correct image based on the original HTML
correct_featured_image = "Screen_Shot_2021-05-18_at_2.51.03_PM.png"

# Read the markdown file
md_file = "/Users/benweiss/Code/soberlivingappcom/soberlivingappcom-new/src/content/blog/considering-opening-a-sober-living-home-in-florida-heres-how.md"

with open(md_file, 'r') as f:
    content = f.read()

# Update the featured image in frontmatter
new_content = re.sub(
    r'image: "/images/blog/considering-opening-a-sober-living-home-in-florida-heres-how/Screen_Shot_2021-05-18_at_2\.51\.38_PM\.png"',
    f'image: "/images/blog/considering-opening-a-sober-living-home-in-florida-heres-how/{correct_featured_image}"',
    content
)

# Write back
with open(md_file, 'w') as f:
    f.write(new_content)

print(f"Updated Florida blog post to use correct featured image: {correct_featured_image}")