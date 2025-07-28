interface SearchStatsProps {
  totalResults: number;
  currentPage: number;
  totalPages: number;
  resultsPerPage: number;
  query: string;
}

export default function SearchStats({ 
  totalResults, 
  currentPage, 
  totalPages, 
  resultsPerPage, 
  query 
}: SearchStatsProps) {
  // Calculate the range of results being shown
  const startResult = totalResults === 0 ? 0 : (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* Results Summary */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6-4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {totalResults === 0 ? (
              <span>No results found</span>
            ) : (
              <span>
                Showing {startResult}-{endResult} of {totalResults.toLocaleString()} results
              </span>
            )}
          </div>

          {/* Search Query Display */}
          {query && (
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mx-2">for</span>
              <span className="text-sm font-medium text-gray-900 bg-white px-2 py-1 rounded border">
                "{query}"
              </span>
            </div>
          )}
        </div>

        {/* Page Info */}
        {totalPages > 1 && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2M7 4h10M7 4v16a1 1 0 001 1h8a1 1 0 001-1V4M11 8h2m-2 4h2" />
            </svg>
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {/* Additional Stats for Large Result Sets */}
      {totalResults > 100 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tip: Use filters to narrow down your search results for better relevance
          </div>
        </div>
      )}
    </div>
  );
}