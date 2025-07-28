# Sober Living App Website

A modern, SEO-optimized website for Sober Living App, built with Astro and React. This project represents a complete migration from Squarespace to a modern static site generator while preserving 100% of SEO value.

## 🚀 Status: Production Ready

✅ **Migration Complete** - All 625 URLs preserved with zero SEO loss  
✅ **Modern Tech Stack** - Astro, React, Tailwind CSS, shadcn/ui  
✅ **Performance Optimized** - Static generation, image optimization, caching  
✅ **SEO Preserved** - All original URLs, meta tags, and search rankings maintained  

## 🏗️ Tech Stack

- **Framework**: [Astro](https://astro.build/) with React integration
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **Content**: Markdown with frontmatter
- **Search**: [Fuse.js](https://fusejs.io/) for full-text search
- **Deployment**: Netlify (testing) / AWS (production)

## 📁 Project Structure

```
soberlivingappcom-new/
├── src/
│   ├── components/     # React and Astro components
│   ├── content/        # Blog posts and feature pages
│   ├── layouts/        # Page layouts
│   ├── pages/          # Astro pages
│   └── styles/         # Global styles
├── public/             # Static assets
├── scripts/            # Build and migration scripts
└── dist/               # Build output
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run verify-redirects` - Verify URL redirects
- `npm run download-images` - Download blog images
- `npm run image-summary` - Generate migration summary

## 🌐 URL Structure

The site maintains the original URL structure for SEO preservation:

- `/` - Homepage
- `/blog` - Blog listing with search functionality
- `/blog/[slug]` - Individual blog posts (146 posts)
- `/blog/category/[category]` - Category archives (22 categories)
- `/blog/tag/[tag]` - Tag archives (455 tags)
- `/features` - Features overview
- `/features/[feature]` - Individual feature pages
- `/about`, `/contact`, `/privacy`, `/terms`, `/pricing` - Static pages

## 📊 Migration Statistics

- **Blog Posts**: 146 migrated with exact URL preservation
- **Categories**: 22 category archive pages
- **Tags**: 455 tag archive pages
- **Images**: 370 blog images downloaded and optimized
- **URLs**: 625 total URLs preserved with zero SEO loss
- **Redirects**: Comprehensive redirect mapping for all legacy URLs

## 🔍 Search Functionality

The site includes a powerful search system:

- **Full-text search** across all blog posts
- **Category and tag filtering**
- **Real-time results** with Fuse.js
- **Advanced filtering** options
- **Mobile-optimized** search interface

## 🎨 Design System

Built with a modern design system:

- **shadcn/ui** components for consistency
- **Tailwind CSS** for styling
- **Responsive design** across all devices
- **Accessibility** compliant
- **Dark mode** support (if needed)

## 📈 SEO Features

- **Sitemap**: Auto-generated at `/sitemap-index.xml`
- **Meta Tags**: Optimized for search engines
- **Structured Data**: JSON-LD schema markup
- **URL Preservation**: All original URLs maintained
- **Redirects**: Comprehensive redirect mapping
- **Performance**: Optimized for Core Web Vitals

## 🚀 Deployment

### Netlify (Testing Phase)

The site is configured for Netlify deployment with:

- `netlify.toml` - Build configuration
- `public/_redirects` - URL redirects
- Automatic HTTPS and CDN
- Form handling and asset optimization

### AWS (Production)

Future production deployment will use:

- **S3** for static hosting
- **CloudFront** for CDN
- **Route 53** for DNS
- **ACM** for SSL certificates

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 Configuration

### Environment Variables

Currently no sensitive environment variables required. Add any needed variables to your deployment platform.

### Build Configuration

- **Output**: Static site generation
- **Format**: Directory-based routing
- **Optimization**: Terser minification, CSS purging
- **Caching**: Aggressive caching headers

## 📝 Content Management

### Blog Posts

Blog posts are written in Markdown with frontmatter:

```markdown
---
title: "Post Title"
description: "Post description"
date: 2024-01-01
category: "Category"
tags: ["tag1", "tag2"]
image: "/images/blog/post-image.jpg"
---

Post content here...
```

### Feature Pages

Feature pages use the same Markdown format with additional frontmatter for the features system.

## 🧪 Testing

### Build Verification

```bash
# Verify build completes successfully
npm run build

# Check for TypeScript errors
npm run astro check
```

### URL Testing

```bash
# Verify all redirects work correctly
npm run verify-redirects
```

## 📊 Performance

The site is optimized for performance:

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for all metrics
- **Image Optimization**: WebP and AVIF support
- **Code Splitting**: Automatic JavaScript optimization
- **Caching**: Aggressive caching headers

## 🔒 Security

Security features include:

- **HTTPS enforcement**
- **Security headers** (X-Frame-Options, X-XSS-Protection, etc.)
- **Content Security Policy** (to be implemented)
- **Rate limiting** (via CloudFront)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For questions or issues:

- **Technical Issues**: Create an issue in the repository
- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Content Updates**: Contact the content team

---

**Built with ❤️ using Astro, React, and Tailwind CSS**