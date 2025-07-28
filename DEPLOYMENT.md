# Deployment Guide

This document outlines the deployment process for the Sober Living App website, covering both testing (Netlify) and production (AWS) environments.

## Overview

- **Testing Environment**: Netlify (for staging and testing)
- **Production Environment**: AWS (for final production deployment)
- **Framework**: Astro with React integration
- **Build Output**: Static site generation

## Netlify Deployment (Testing Phase)

### Prerequisites

1. Netlify account
2. GitHub repository access
3. Node.js 18+ installed locally

### Configuration Files

The project includes the following Netlify-specific configuration:

- `netlify.toml` - Build settings and redirects
- `public/_redirects` - URL redirects for SEO preservation
- `astro.config.mjs` - Astro configuration optimized for static generation

### Deployment Steps

1. **Connect Repository to Netlify**:
   - Log into Netlify dashboard
   - Click "New site from Git"
   - Connect to your GitHub repository
   - Select the repository branch (main/master)

2. **Build Settings** (automatically configured via `netlify.toml`):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

3. **Environment Variables** (if needed):
   - Add any required environment variables in Netlify dashboard
   - Currently no sensitive environment variables required

4. **Deploy**:
   - Netlify will automatically build and deploy on each push to the main branch
   - Preview deployments are created for pull requests

### Netlify Features Enabled

- **Automatic HTTPS**: Enabled by default
- **CDN**: Global content delivery network
- **Form Handling**: Built-in form processing
- **Redirects**: SEO-preserving redirects configured
- **Headers**: Security and performance headers configured
- **Asset Optimization**: Automatic compression and caching

### URL Structure

The site maintains the following URL structure for SEO preservation:

- `/` - Homepage
- `/blog` - Blog listing with search functionality
- `/blog/[slug]` - Individual blog posts
- `/blog/category/[category]` - Category archives
- `/blog/tag/[tag]` - Tag archives
- `/features` - Features overview
- `/features/[feature]` - Individual feature pages
- `/about` - About page
- `/contact` - Contact page
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/pricing` - Pricing page

## AWS Production Deployment (Future)

### Architecture Overview

```
Route 53 → CloudFront → S3 → Lambda@Edge (optional)
```

### Components

1. **S3 Bucket**: Static file hosting
2. **CloudFront**: CDN and caching
3. **Route 53**: DNS management
4. **ACM**: SSL certificate management
5. **Lambda@Edge** (optional): Dynamic redirects and headers

### Deployment Process

1. **S3 Setup**:
   ```bash
   # Create S3 bucket
   aws s3 mb s3://soberlivingapp.com
   
   # Configure for static website hosting
   aws s3 website s3://soberlivingapp.com --index-document index.html --error-document 404.html
   ```

2. **CloudFront Distribution**:
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom domain
   - Set up SSL certificate via ACM

3. **Route 53**:
   - Create hosted zone for domain
   - Point domain to CloudFront distribution

4. **Deployment Script**:
   ```bash
   # Build the site
   npm run build
   
   # Sync to S3
   aws s3 sync dist/ s3://soberlivingapp.com --delete
   
   # Invalidate CloudFront cache
   aws cloudfront create-invalidation --distribution-id [DISTRIBUTION_ID] --paths "/*"
   ```

### AWS Infrastructure as Code

Consider using AWS CDK or Terraform for infrastructure management:

```typescript
// Example CDK stack
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class SoberLivingAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket for static hosting
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: 'soberlivingapp.com',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: ['soberlivingapp.com', 'www.soberlivingapp.com'],
      certificate: certificate, // ACM certificate
    });
  }
}
```

## SEO and Performance Optimization

### SEO Features

- **Sitemap**: Automatically generated at `/sitemap-index.xml`
- **Meta Tags**: Optimized for search engines
- **Structured Data**: JSON-LD schema markup
- **URL Preservation**: All original URLs maintained
- **Redirects**: Comprehensive redirect mapping

### Performance Features

- **Static Generation**: Pre-built HTML for fast loading
- **Image Optimization**: WebP and AVIF support
- **Code Splitting**: Automatic JavaScript optimization
- **CSS Optimization**: Purged unused styles
- **Caching**: Aggressive caching headers
- **Compression**: Gzip/Brotli compression

### Monitoring and Analytics

- **Google Analytics**: Configured for tracking
- **Core Web Vitals**: Optimized for performance metrics
- **Error Tracking**: 404 and error page handling
- **Uptime Monitoring**: Health checks and alerts

## Security Considerations

### Headers Configured

- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `X-Content-Type-Options: nosniff` - MIME type sniffing protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Referrer control

### Additional Security Measures

- HTTPS enforcement
- CSP headers (to be implemented)
- Rate limiting (CloudFront)
- DDoS protection (AWS Shield)

## Maintenance and Updates

### Regular Tasks

1. **Security Updates**: Keep dependencies updated
2. **Performance Monitoring**: Monitor Core Web Vitals
3. **SEO Monitoring**: Track search rankings and traffic
4. **Content Updates**: Regular blog and feature updates
5. **Backup**: Regular backups of content and configuration

### Deployment Checklist

- [ ] All tests passing
- [ ] Build completes without errors
- [ ] SEO meta tags verified
- [ ] Redirects tested
- [ ] Performance metrics acceptable
- [ ] Security headers configured
- [ ] Analytics tracking verified
- [ ] Mobile responsiveness tested
- [ ] Cross-browser compatibility verified

## Troubleshooting

### Common Issues

1. **Build Failures**: Check Node.js version and dependencies
2. **Redirect Issues**: Verify `_redirects` file syntax
3. **Performance Issues**: Check image optimization and caching
4. **SEO Issues**: Verify sitemap and meta tags
5. **SSL Issues**: Check certificate configuration

### Support Resources

- [Astro Documentation](https://docs.astro.build/)
- [Netlify Documentation](https://docs.netlify.com/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Project Issues](https://github.com/[username]/soberlivingappcom/issues)

## Contact

For deployment issues or questions:
- **Development Team**: [Team Contact]
- **DevOps**: [DevOps Contact]
- **Emergency**: [Emergency Contact] 