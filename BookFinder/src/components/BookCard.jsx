


import { useState } from "react";
import { HiCalendar } from "react-icons/hi";
import { getCoverUrl } from "./utils"; 

const formatAuthors = (authors) =>
  Array.isArray(authors) ? authors.slice(0, 2).join(", ") : "Unknown Author";


const BookCover = ({ coverUrl, title, className = "" }) => {
  const [imgError, setImgError] = useState(false);

  const fallback =
    "https://via.placeholder.com/150x220.png?text=No+Cover";

  return (
    <div
      className={`relative bg-gray-100 flex items-center justify-center overflow-hidden ${className}`}
    >
      <img
        src={!imgError ? coverUrl : fallback}
        alt={title}
        className="w-auto h-full object-contain"
        onError={() => setImgError(true)}
      />
    </div>
  );
};


const BookCard = ({ book, onSelect, viewMode }) => {

  const coverUrl = getCoverUrl(book, "M");
  const authors = formatAuthors(book.author_name);

  if (viewMode === "list") {
    return (
      <button
        onClick={() => onSelect(book)}
        className="w-full text-left bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-100 hover:border-blue-200 cursor-pointer"
      >
        <div className="flex gap-4">
          <BookCover
            coverUrl={coverUrl}
            title={book.title}
            className="w-16 h-20 rounded-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
              {book.title}
            </h3>
            <p className="text-gray-600 text-xs mb-2 line-clamp-1">{authors}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {book.first_publish_year && (
                <span className="flex items-center gap-1">
                  <HiCalendar className="w-3 h-3" />
                  {book.first_publish_year}
                </span>
              )}
              {book.language && book.language[0] && (
                <span className="uppercase">{book.language[0]}</span>
              )}
            </div>
          </div>
        </div>
      </button>
    );
  }

 
  return (
    <button
      onClick={() => onSelect(book)}
      className="w-full text-left bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200 cursor-pointer"
    >
      <div className="aspect-[3/4] relative flex items-center justify-center bg-gray-50">
        <BookCover
          coverUrl={coverUrl}
          title={book.title}
          className="w-28 h-40" 
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
          {book.title}
        </h3>
        <p className="text-gray-600 text-xs mb-3 line-clamp-1">{authors}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          {book.first_publish_year && (
            <span className="flex items-center gap-1">
              <HiCalendar className="w-3 h-3" />
              {book.first_publish_year}
            </span>
          )}
          {book.language && book.language[0] && (
            <span className="bg-gray-100 px-2 py-1 rounded-full uppercase font-medium">
              {book.language[0]}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default BookCard;