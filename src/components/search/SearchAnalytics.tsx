import { useEffect } from 'react';

interface SearchAnalyticsProps {
  query: string;
  resultsCount: number;
  selectedCategories: string[];
  selectedTags: string[];
}

// Simple analytics tracker for search events
class SearchAnalytics {
  private static instance: SearchAnalytics;
  private analytics: Array<{
    query: string;
    resultsCount: number;
    timestamp: Date;
    categories: string[];
    tags: string[];
  }> = [];

  static getInstance(): SearchAnalytics {
    if (!SearchAnalytics.instance) {
      SearchAnalytics.instance = new SearchAnalytics();
    }
    return SearchAnalytics.instance;
  }

  trackSearch(query: string, resultsCount: number, categories: string[], tags: string[]) {
    // Only track non-empty searches
    if (!query.trim()) return;

    this.analytics.push({
      query: query.trim().toLowerCase(),
      resultsCount,
      timestamp: new Date(),
      categories,
      tags,
    });

    // Keep only last 1000 searches to prevent memory issues
    if (this.analytics.length > 1000) {
      this.analytics = this.analytics.slice(-1000);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('search-analytics', JSON.stringify(this.analytics));
    } catch (error) {
      console.warn('Failed to store search analytics:', error);
    }
  }

  getPopularSearches(limit: number = 10): Array<{ query: string; count: number }> {
    const queryCount = new Map<string, number>();
    
    this.analytics.forEach(({ query }) => {
      queryCount.set(query, (queryCount.get(query) || 0) + 1);
    });

    return Array.from(queryCount.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getSearchesWithNoResults(): Array<{ query: string; timestamp: Date }> {
    return this.analytics
      .filter(({ resultsCount }) => resultsCount === 0)
      .map(({ query, timestamp }) => ({ query, timestamp }))
      .slice(-50); // Last 50 no-result searches
  }

  getAnalyticsSummary() {
    const totalSearches = this.analytics.length;
    const uniqueQueries = new Set(this.analytics.map(({ query }) => query)).size;
    const averageResults = totalSearches > 0 
      ? this.analytics.reduce((sum, { resultsCount }) => sum + resultsCount, 0) / totalSearches 
      : 0;
    const noResultSearches = this.analytics.filter(({ resultsCount }) => resultsCount === 0).length;

    return {
      totalSearches,
      uniqueQueries,
      averageResults: Math.round(averageResults * 10) / 10,
      noResultSearches,
      noResultRate: totalSearches > 0 ? Math.round((noResultSearches / totalSearches) * 100) : 0,
    };
  }

  // Load analytics from localStorage on initialization
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('search-analytics');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        this.analytics = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      }
    } catch (error) {
      console.warn('Failed to load search analytics:', error);
    }
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }
}

export default function SearchAnalyticsTracker({ 
  query, 
  resultsCount, 
  selectedCategories, 
  selectedTags 
}: SearchAnalyticsProps) {
  useEffect(() => {
    if (query.trim()) {
      const analytics = SearchAnalytics.getInstance();
      
      // Debounce tracking to avoid tracking every keystroke
      const timer = setTimeout(() => {
        analytics.trackSearch(query, resultsCount, selectedCategories, selectedTags);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [query, resultsCount, selectedCategories, selectedTags]);

  return null; // This component doesn't render anything
}

// Export the analytics class for use in other components
export { SearchAnalytics };