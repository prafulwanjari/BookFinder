import { 
  HiSearch, HiFilter,  HiRefresh, HiExclamation, HiBookOpen, HiViewGrid, HiViewList, HiStar, HiCalendar, HiUser, HiHashtag,HiX,HiMenu
} from "react-icons/hi";
import BookCard from "./BookCard";
import BookModal from "./BookModal";
import { useCallback, useMemo, useState } from "react";


const BookFinder = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [selectedBook, setSelectedBook] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [filterByYear, setFilterByYear] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleApiError = (error, context) => {
    console.error(`API Error in ${context}:`, error);
    if (!navigator.onLine) {
      return "No internet connection. Please check your network and try again.";
    }
    if (error.name === "AbortError") {
      return "Search was cancelled. Please try again.";
    }
    if (error.message?.includes("429")) {
      return "Too many requests. Please wait a moment and try again.";
    }
    return "Unable to fetch books at this time. Please try again later.";
  };

  const searchBooks = useCallback(async (searchQuery, type = "title") => {
    if (!searchQuery?.trim()) {
      setError("Please enter a search term.");
      return;
    }

    const abortController = new AbortController();
    setLoading(true);
    setError("");

    try {
      const searchParams = new URLSearchParams({
        limit: "24",
        fields: "key,title,author_name,first_publish_year,publisher,subject,cover_i,isbn,language,number_of_pages_median",
      });

      let endpoint;
      switch (type) {
        case "author":
          endpoint = `https://openlibrary.org/search.json?author=${encodeURIComponent(searchQuery)}`;
          break;
        case "subject":
          endpoint = `https://openlibrary.org/search.json?subject=${encodeURIComponent(searchQuery)}`;
          break;
        case "isbn":
          endpoint = `https://openlibrary.org/search.json?isbn=${encodeURIComponent(searchQuery)}`;
          break;
        default:
          endpoint = `https://openlibrary.org/search.json?title=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(`${endpoint}&${searchParams}`, {
        signal: abortController.signal,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const filteredBooks = (data.docs || []).filter(
        (book) => book.title && book.title.length > 0 && book.title !== "Unknown"
      );

      setBooks(filteredBooks);

      if (filteredBooks.length === 0) {
        setError(`No books found for "${searchQuery}". Try different keywords, check spelling, or use a different search type.`);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(handleApiError(err, "searchBooks"));
        setBooks([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    searchBooks(query.trim(), searchType);
    setSidebarOpen(false);
  }, [query, searchType, searchBooks]);

  const clearQuery = () => {
    setQuery("");
    setBooks([]);
    setError("");
  };

  const sortedAndFilteredBooks = useMemo(() => {
    let filtered = [...books];

    if (filterByYear !== "all") {
      const currentYear = new Date().getFullYear();
      filtered = filtered.filter((book) => {
        if (!book.first_publish_year) return false;
        switch (filterByYear) {
          case "recent":
            return book.first_publish_year >= currentYear - 10;
          case "classic":
            return book.first_publish_year <= 1950;
          case "modern":
            return book.first_publish_year > 1950 && book.first_publish_year < currentYear - 10;
          default:
            return true;
        }
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "year-desc":
          return (b.first_publish_year || 0) - (a.first_publish_year || 0);
        case "year-asc":
          return (a.first_publish_year || 0) - (b.first_publish_year || 0);
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "author":
          const authorA = Array.isArray(a.author_name) && a.author_name.length > 0 ? a.author_name[0] : "";
          const authorB = Array.isArray(b.author_name) && b.author_name.length > 0 ? b.author_name[0] : "";
          return authorA.localeCompare(authorB);
        default:
          return 0;
      }
    });

    return filtered;
  }, [books, filterByYear, sortBy]);

  const searchTypeIcon = {
    title: HiBookOpen,
    author: HiUser,
    subject: HiStar,
    isbn: HiHashtag
  };

  const SearchTypeIcon = searchTypeIcon[searchType];

  return (
    <div className="min-h-screen bg-gray-50 flex">
     
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto h-screen`}>
        <div className="flex flex-col h-full">
        
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-xl">
                  <HiBookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">BookVault</h1>
                  <p className="text-sm text-gray-500">Discover amazing books</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            <div className="space-y-6">
      
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Search Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(searchTypeIcon).map(([type, Icon]) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSearchType(type)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        searchType === type
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1" />
                      <div className="capitalize">{type}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Search Query
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <SearchTypeIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Enter ${searchType}...`}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={clearQuery}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !query.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <HiRefresh className="w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <HiSearch className="w-5 h-5" />
                    Search Books
                  </>
                )}
              </button>
            </div>

            {/* Filters */}
            {books.length > 0 && (
              <div className="mt-8 space-y-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <HiFilter className="w-4 h-4" />
                  Filters & Sorting
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="title">Title A-Z</option>
                    <option value="author">Author A-Z</option>
                    <option value="year-desc">Newest First</option>
                    <option value="year-asc">Oldest First</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                  <select
                    value={filterByYear}
                    onChange={(e) => setFilterByYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Years</option>
                    <option value="recent">Recent (Last 10 years)</option>
                    <option value="modern">Modern (1951-2014)</option>
                    <option value="classic">Classic (Before 1951)</option>
                  </select>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-800 font-medium">
                    {sortedAndFilteredBooks.length} of {books.length} books
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <HiMenu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {books.length > 0 ? `Found ${books.length} books` : 'Book Search'}
                </h2>
                {query && (
                  <p className="text-sm text-gray-500">
                    Searching for "{query}" in {searchType}
                  </p>
                )}
              </div>
            </div>

            {books.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid" ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <HiViewGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list" ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <HiViewList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 lg:p-6 relative max-h-[calc(100vh-80px)] overflow-y-auto">
        
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center z-30">
              <div className="text-center">
                <HiRefresh className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                <p className="text-lg text-gray-700">Searching books...</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <HiExclamation className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Search Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {sortedAndFilteredBooks.length > 0 && (
            <div className={
              viewMode === "grid" 
                ? "grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "space-y-3"
            }>
              {sortedAndFilteredBooks.map((book, idx) => (
                <BookCard
                  key={`${book.key || book.title}-${idx}`}
                  book={book}
                  onSelect={setSelectedBook}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && !error && books.length === 0 && query && (
            <div className="text-center py-20">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiSearch className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Books Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any books matching "{query}". Try adjusting your search terms or using a different search type.
              </p>
              <button
                onClick={clearQuery}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Clear Search
              </button>
            </div>
          )}

          {!query && !loading && (
            <div className="text-center py-20">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiBookOpen className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to BookVault</h3>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed mb-6">
                Discover your next favorite book from millions of titles. Search by title, author, subject, or ISBN to find exactly what you're looking for.
              </p>
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
              >
                Start Searching
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
};

export default BookFinder;