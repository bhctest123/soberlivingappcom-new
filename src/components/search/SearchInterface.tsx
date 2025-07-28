import { useState, useEffect, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import SearchStats from './SearchStats';
import SearchAnalyticsTracker from './SearchAnalytics';

export interface SearchPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: Date;
  author: string;
  category: string[];
  tags: string[];
  image?: string;
  imageAlt?: string;
  featured: boolean;
  url: string;
}

interface SearchInterfaceProps {
  searchData: SearchPost[];
  categories: string[];
  tags: string[];
}

export type SortOption = 'relevance' | 'date-desc' | 'date-asc';

const RESULTS_PER_PAGE = 12;

// Fuse.js configuration for search
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'content', weight: 0.2 },
    { name: 'tags', weight: 0.05 },
    { name: 'category', weight: 0.05 }
  ],
  threshold: 0.3, // More permissive for better results
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
};

export default function SearchInterface({ searchData, categories, tags }: SearchInterfaceProps) {
  // Search state
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Initialize Fuse instance
  const fuse = useMemo(() => new Fuse(searchData, fuseOptions), [searchData]);

  // Get search suggestions
  const getSearchSuggestions = useCallback((searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    // Get unique terms from all content
    const allTerms = new Set<string>();
    
    searchData.forEach(post => {
      // Extract words from title and description
      const words = [
        ...post.title.toLowerCase().split(/\W+/),
        ...post.description.toLowerCase().split(/\W+/),
        ...post.tags.map(tag => tag.toLowerCase()),
      ].filter(word => word.length > 2);
      
      words.forEach(word => allTerms.add(word));
    });

    // Filter suggestions based on search term
    const filtered = Array.from(allTerms)
      .filter(term => term.includes(searchTerm.toLowerCase()))
      .slice(0, 5);

    setSuggestions(filtered);
  }, [searchData]);

  // Debounced suggestion update
  useEffect(() => {
    const timer = setTimeout(() => {
      getSearchSuggestions(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, getSearchSuggestions]);

  // Filter and search posts
  const filteredResults = useMemo(() => {
    let results = searchData;

    // Apply text search
    if (query.trim()) {
      const searchResults = fuse.search(query);
      results = searchResults.map(result => result.item);
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter(post => 
        post.category.some(cat => selectedCategories.includes(cat))
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      results = results.filter(post => 
        post.tags.some(tag => selectedTags.includes(tag))
      );
    }

    // Apply date range filter
    if (dateRange.start || dateRange.end) {
      results = results.filter(post => {
        const postDate = new Date(post.date);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;

        if (startDate && postDate < startDate) return false;
        if (endDate && postDate > endDate) return false;
        return true;
      });
    }

    // Apply sorting
    if (sortBy === 'date-desc') {
      results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'date-asc') {
      results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    // 'relevance' maintains Fuse.js ordering when there's a query, or original order otherwise

    return results;
  }, [searchData, query, selectedCategories, selectedTags, dateRange, sortBy, fuse]);

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / RESULTS_PER_PAGE);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategories, selectedTags, dateRange, sortBy]);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setQuery(value);
    setShowSuggestions(true);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setQuery('');
    setSelectedCategories([]);
    setSelectedTags([]);
    setDateRange({});
    setSortBy('relevance');
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = Boolean(query || selectedCategories.length > 0 || selectedTags.length > 0 || 
    dateRange.start || dateRange.end || sortBy !== 'relevance');

  return (
    <div className="space-y-6">
      {/* Analytics Tracking */}
      <SearchAnalyticsTracker
        query={query}
        resultsCount={filteredResults.length}
        selectedCategories={selectedCategories}
        selectedTags={selectedTags}
      />

      {/* Search Filters */}
      <SearchFilters
        query={query}
        onQueryChange={handleSearchChange}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        onSuggestionSelect={handleSuggestionSelect}
        onSuggestionsClose={() => setShowSuggestions(false)}
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
        tags={tags}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearAll={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Search Stats */}
      <SearchStats
        totalResults={filteredResults.length}
        currentPage={currentPage}
        totalPages={totalPages}
        resultsPerPage={RESULTS_PER_PAGE}
        query={query}
      />

      {/* Search Results */}
      <SearchResults
        results={paginatedResults}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        query={query}
      />
    </div>
  );
}