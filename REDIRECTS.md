# Redirect Strategy Documentation

## Overview

This document outlines the redirect strategy implemented for soberlivingapp.com to ensure SEO preservation during the migration to the new Astro-based site structure.

## Redirect Implementation

### 1. Redirect System Architecture

The redirect system consists of three main components:

1. **Redirect Data Source** (`/src/data/redirects.ts`)
   - Central source of truth for all redirect mappings
   - Exports redirect rules with source, destination, and permanence status
   - Includes helper functions for finding and applying redirects

2. **Middleware Handler** (`/src/middleware.ts`)
   - Intercepts incoming requests before page rendering
   - Checks against redirect rules and returns appropriate HTTP responses
   - Handles both 301 (permanent) and 302 (temporary) redirects

3. **Configuration Integration** (`astro.config.mjs`)
   - Integrates redirects into Astro's build process
   - Ensures redirects work in both development and production environments

### 2. Redirect Patterns

#### HTML Extension Removal
- **Pattern**: `/page.html` → `/page`
- **Purpose**: Modern URL structure without file extensions
- **Status**: 301 Permanent

#### Index File Handling
- **Pattern**: `/directory/index.html` → `/directory`
- **Purpose**: Clean directory URLs
- **Status**: 301 Permanent

#### Blog URL Consolidation
- **Pattern**: `/posts/:slug` → `/blog/:slug`
- **Pattern**: `/articles/:slug` → `/blog/:slug`
- **Purpose**: Unified blog structure
- **Status**: 301 Permanent

#### Mobile App Redirects
- **Pattern**: `/app`, `/mobile` → `/download`
- **Pattern**: `/ios` → `/download#ios`
- **Pattern**: `/android` → `/download#android`
- **Purpose**: Centralized download page with platform anchors
- **Status**: 302 Temporary

#### Trailing Slash Removal
- **Pattern**: `/page/` → `/page`
- **Purpose**: Consistent URL structure
- **Status**: 301 Permanent

### 3. Adding New Redirects

To add new redirects:

1. Edit `/src/data/redirects.ts`
2. Add new redirect rule to the `redirects` array:
   ```typescript
   {
     source: '/old-url',
     destination: '/new-url',
     permanent: true  // true for 301, false for 302
   }
   ```

3. For dynamic segments, use `:paramName` syntax:
   ```typescript
   {
     source: '/old/:category/:slug',
     destination: '/new/:category/:slug',
     permanent: true
   }
   ```

### 4. Testing Redirects

#### Manual Testing
1. Start the development server: `npm run dev`
2. Visit the old URL in your browser
3. Verify you're redirected to the new URL
4. Check browser network tab for correct status code (301 or 302)

#### Automated Testing
Run the verification script:
```bash
npm run verify-redirects
```

This script will:
- Test each redirect rule
- Verify correct status codes
- Check destination URLs
- Report any failures

### 5. Production Considerations

#### Static Site Generation
- Redirects are handled by middleware during development
- For production static builds, ensure your hosting provider supports redirect rules
- Consider generating a `_redirects` file for Netlify or `.htaccess` for Apache

#### Performance
- 301 redirects are cached by browsers (use for permanent moves)
- 302 redirects are not cached (use for temporary redirects)
- Set appropriate cache headers in middleware

#### SEO Best Practices
1. **Use 301 for permanent moves** - Transfers SEO value to new URL
2. **Avoid redirect chains** - Direct old URL to final destination
3. **Update internal links** - Don't rely on redirects for internal navigation
4. **Monitor 404s** - Add redirects for any missed URLs post-launch
5. **Submit sitemap** - Help search engines discover new URL structure

### 6. Common Redirect Scenarios

#### Content Migration
When moving content between sections:
```typescript
{ source: '/resources/guide-name', destination: '/guides/guide-name', permanent: true }
```

#### Feature Deprecation
When removing features:
```typescript
{ source: '/old-feature', destination: '/alternative-feature', permanent: false }
```

#### Marketing Campaigns
For campaign-specific URLs:
```typescript
{ source: '/promo-2024', destination: '/features#pricing', permanent: false }
```

### 7. Monitoring and Maintenance

1. **Regular Audits**
   - Run redirect verification monthly
   - Check Google Search Console for crawl errors
   - Monitor analytics for redirect traffic

2. **Cleanup Strategy**
   - After 1 year, evaluate removing redirects with no traffic
   - Keep SEO-critical redirects indefinitely
   - Document removal decisions

3. **Performance Monitoring**
   - Track redirect response times
   - Monitor for redirect loops
   - Check for excessive redirect chains

## Troubleshooting

### Redirect Not Working
1. Check source URL matches exactly (including query strings if needed)
2. Verify middleware is enabled in astro.config.mjs
3. Clear browser cache (301s are cached)
4. Check for conflicting page routes

### Redirect Loops
1. Ensure destination doesn't redirect back to source
2. Check for circular redirect chains
3. Use browser dev tools to trace redirect path

### Dynamic Segments Not Matching
1. Verify regex pattern in findRedirect function
2. Test with exact URL structure
3. Check parameter names match in source and destination

## Future Enhancements

1. **Analytics Integration**
   - Track redirect usage
   - Identify popular old URLs
   - Monitor redirect performance

2. **Admin Interface**
   - UI for managing redirects
   - Bulk import/export functionality
   - Redirect testing tools

3. **Advanced Patterns**
   - Query string preservation
   - Regex-based matching
   - Conditional redirects based on user agent