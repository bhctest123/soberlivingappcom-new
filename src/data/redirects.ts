/**
 * Redirect mappings for SEO-friendly URL structure
 * Maps old URLs to new URLs to preserve SEO value and user experience
 */

export interface RedirectRule {
  source: string;
  destination: string;
  permanent: boolean;
}

export const redirects: RedirectRule[] = [
  // Remove .html extensions
  { source: '/features.html', destination: '/features', permanent: true },
  { source: '/about.html', destination: '/about', permanent: true },
  { source: '/contact.html', destination: '/contact', permanent: true },
  { source: '/privacy.html', destination: '/privacy', permanent: true },
  { source: '/terms.html', destination: '/terms', permanent: true },
  
  // Handle index.html files
  { source: '/index.html', destination: '/', permanent: true },
  { source: '/features/index.html', destination: '/features', permanent: true },
  { source: '/blog/index.html', destination: '/blog', permanent: true },
  
  // Blog URL structure preservation
  // Old blog posts with .html extension
  { source: '/blog/post1.html', destination: '/blog/post1', permanent: true },
  { source: '/blog/post2.html', destination: '/blog/post2', permanent: true },
  
  // Legacy blog URLs
  { source: '/posts/:slug', destination: '/blog/:slug', permanent: true },
  { source: '/articles/:slug', destination: '/blog/:slug', permanent: true },
  
  // Common legacy patterns
  { source: '/home', destination: '/', permanent: true },
  { source: '/home.html', destination: '/', permanent: true },
  { source: '/index.php', destination: '/', permanent: true },
  
  // Feature page redirects - critical for SEO preservation
  { source: '/admissions.html', destination: '/features/admissions', permanent: true },
  { source: '/alumni.html', destination: '/features/alumni', permanent: true },
  { source: '/bed-management.html', destination: '/features/bed-management', permanent: true },
  { source: '/billing.html', destination: '/features/billing', permanent: true },
  { source: '/contacts.html', destination: '/features/contacts', permanent: true },
  { source: '/dashboard.html', destination: '/features/dashboard', permanent: true },
  { source: '/employees.html', destination: '/features/employees', permanent: true },
  { source: '/file-storage.html', destination: '/features/file-storage', permanent: true },
  { source: '/housing.html', destination: '/features/housing', permanent: true },
  { source: '/operations.html', destination: '/features/operations', permanent: true },
  { source: '/organizations.html', destination: '/features/organizations', permanent: true },
  { source: '/portal.html', destination: '/features/portal', permanent: true },
  { source: '/properties.html', destination: '/features/properties', permanent: true },
  { source: '/scheduling.html', destination: '/features/scheduling', permanent: true },
  { source: '/security.html', destination: '/features/security', permanent: true },
  { source: '/tasks.html', destination: '/features/tasks', permanent: true },
  
  // Legacy feature page aliases
  { source: '/admission.html', destination: '/features/admissions', permanent: true },
  { source: '/features-overview.html', destination: '/features', permanent: true },
  
  // Blog redirects - comprehensive URL preservation
  { source: '/blog.html', destination: '/blog', permanent: true },
  { source: '/sober-living-app-blog.html', destination: '/blog', permanent: true },
  
  // CRITICAL: Blog posts must maintain exact URL structure for SEO
  // We handle .html removal in Astro config, so these redirects are not needed
  // Old: /sober-living-app-blog/YYYY/M/D/slug.html
  // New: /sober-living-app-blog/YYYY/M/D/slug (same structure, just no .html)
  
  // Blog category and tag pages
  { source: '/sober-living-app-blog/category/:category.html', destination: '/blog?category=:category', permanent: true },
  { source: '/sober-living-app-blog/tag/:tag.html', destination: '/blog?tag=:tag', permanent: true },
  
  // Blog author pages
  { source: '/sober-living-app-blog?author=:author.html', destination: '/blog?author=:author', permanent: true },
  
  // Blog pagination and filtering
  { source: '/sober-living-app-blog?:params', destination: '/blog?:params', permanent: true },
  
  // Other legacy pages
  { source: '/pricing.html', destination: '/pricing', permanent: true },
  { source: '/login.html', destination: '/login', permanent: true },
  { source: '/signup.html', destination: '/signup', permanent: true },
  { source: '/_downloads.html', destination: '/download', permanent: true },
  
  // Feature-specific redirects
  { source: '/features/tracking.html', destination: '/features/tracking', permanent: true },
  { source: '/features/community.html', destination: '/features/community', permanent: true },
  { source: '/features/resources.html', destination: '/features/resources', permanent: true },
  
  // Mobile app redirects
  { source: '/app', destination: '/download', permanent: false },
  { source: '/mobile.html', destination: '/features/mobile', permanent: true },
  { source: '/mobile', destination: '/download', permanent: false },
  { source: '/ios', destination: '/download#ios', permanent: false },
  { source: '/android', destination: '/download#android', permanent: false },
  
  // Old resource URLs
  { source: '/resources/guides/:slug.html', destination: '/resources/guides/:slug', permanent: true },
  { source: '/resources/videos/:slug.html', destination: '/resources/videos/:slug', permanent: true },
  
  // Trailing slash handling for directories (only for legacy paths)
  // Removed /features/ redirect as it was causing redirect loops
];

/**
 * Get all redirects
 */
export function getRedirects(): RedirectRule[] {
  return redirects;
}

/**
 * Find redirect for a given source URL
 */
export function findRedirect(source: string): RedirectRule | undefined {
  return redirects.find(redirect => {
    // Handle exact matches
    if (redirect.source === source) {
      return true;
    }
    
    // Handle dynamic segments (e.g., :slug)
    const sourcePattern = redirect.source.replace(/:(\w+)/g, '([^/]+)');
    const regex = new RegExp(`^${sourcePattern}$`);
    return regex.test(source);
  });
}

/**
 * Apply redirect rule to a source URL
 */
export function applyRedirect(source: string, rule: RedirectRule): string {
  // Handle exact matches
  if (rule.source === source) {
    return rule.destination;
  }
  
  // Handle dynamic segments
  const sourceSegments = rule.source.split('/');
  // const destinationSegments = rule.destination.split('/');
  const actualSegments = source.split('/');
  
  let result = rule.destination;
  
  sourceSegments.forEach((segment, index) => {
    if (segment.startsWith(':')) {
      const paramName = segment.slice(1);
      const actualValue = actualSegments[index];
      result = result.replace(`:${paramName}`, actualValue);
    }
  });
  
  return result;
}