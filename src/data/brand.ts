/**
 * Brand Assets Manifest
 * Central location for all brand-related assets and paths
 */

export const brandAssets = {
  logos: {
    // Main app logo/icon
    appIcon: {
      path: '/images/brand/sober-living-app-icon.png',
      alt: 'Sober Living App Icon',
      width: 512,
      height: 512,
      status: 'required' as const,
    },
    
    // Text logo variants
    appTextLogo: {
      path: '/images/brand/sober-living-app-text.png',
      alt: 'Sober Living App',
      width: 300,
      height: 60,
      status: 'required' as const,
    },
    
    appTextLogo2x: {
      path: '/images/brand/sober-living-app-text@2x.png',
      alt: 'Sober Living App',
      width: 600,
      height: 120,
      status: 'required' as const,
    },
    
    // BehaveHealth branding
    behaveHealthLogo: {
      path: '/images/brand/behavehealth-logo.png',
      alt: 'BehaveHealth',
      width: 200,
      height: 50,
      status: 'required' as const,
    },
    
    behaveHealthLogoWhite: {
      path: '/images/brand/behavehealth-logo-white.png',
      alt: 'BehaveHealth',
      width: 200,
      height: 50,
      status: 'required' as const,
    },
  },
  
  badges: {
    // App Store download badge
    appStore: {
      path: '/images/badges/app-store-badge.svg',
      alt: 'Download on the App Store',
      width: 135,
      height: 40,
      url: 'https://hubs.ly/H0C9Mg00',
      status: 'required' as const,
    },
    
    // Google Play download badge
    googlePlay: {
      path: '/images/badges/google-play-badge.png',
      alt: 'Get it on Google Play',
      width: 135,
      height: 40,
      url: 'https://hubs.ly/H0C9PN30',
      status: 'required' as const,
    },
  },
  
  icons: {
    // Favicon
    favicon: {
      path: '/images/brand/favicon.ico',
      status: 'available' as const,
    },
    
    // Apple touch icon
    appleTouchIcon: {
      path: '/images/brand/apple-touch-icon.png',
      size: 180,
      status: 'required' as const,
    },
  },
  
  // Brand colors (extracted from the existing site)
  colors: {
    primary: '#2563eb', // Blue
    secondary: '#10b981', // Green
    accent: '#8b5cf6', // Purple
    dark: '#1f2937',
    light: '#f3f4f6',
  },
} as const;

// Helper function to get asset with fallback
export function getBrandAsset(path: string, fallback?: string): string {
  // In production, this would check if the asset exists
  // For now, return the path or fallback
  return path || fallback || '/images/placeholder.png';
}

// Asset status types
export type AssetStatus = 'available' | 'required' | 'optional';

// Export types for TypeScript support
export type BrandAssets = typeof brandAssets;
export type LogoAsset = typeof brandAssets.logos[keyof typeof brandAssets.logos];
export type BadgeAsset = typeof brandAssets.badges[keyof typeof brandAssets.badges];