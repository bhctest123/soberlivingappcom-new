# App Store Badges Directory

This directory should contain the official app store download badges:

## Required Badge Files

1. **app-store-badge.svg**
   - Official Apple App Store download badge
   - Standard size: 135x40px
   - File name in S3: `Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg`
   - Links to: https://apps.apple.com/us/app/sober-living-app/id1463294451

2. **google-play-badge.png**
   - Official Google Play Store download badge
   - Standard size: 135x40px (or proportional)
   - Links to: https://play.google.com/store/apps/details?id=com.soberlivingapp

## Alternative Sources

If the S3 bucket remains inaccessible, these badges can be obtained from:

1. **Apple App Store Badge**
   - https://developer.apple.com/app-store/marketing/guidelines/
   - Download the official badge generator

2. **Google Play Badge**
   - https://play.google.com/intl/en_us/badges/
   - Generate and download the official badge

## Usage

These badges are referenced in the brand assets manifest at:
`/src/data/brand.ts`

They will be used in the footer and other locations where app download links are displayed.