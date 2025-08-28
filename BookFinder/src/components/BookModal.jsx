

import { HiBookOpen, HiX } from "react-icons/hi";
import { getCoverUrl, getBookUrl } from "./utils"; 



const InfoBlock = ({ label, value }) => (
  <div>
    <h4 className="font-semibold text-gray-700 mb-1">{label}</h4>
    <p className="text-gray-900">{value}</p>
  </div>
);

const TagBlock = ({ label, tags, color, uppercase }) => (
  <div>
    <h4 className="font-semibold text-gray-700 mb-1">{label}</h4>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className={`bg-${color}-100 text-${color}-800 px-2 py-1 rounded-full text-sm ${
            uppercase ? "uppercase" : ""
          }`}
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const BookModal = ({ book, onClose }) => {
  const coverUrl = getCoverUrl(book, "L"); 
  const bookUrl = getBookUrl(book);

  const authors = Array.isArray(book.author_name)
    ? book.author_name.join(", ")
    : "Unknown Author";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
   
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
      
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
            {book.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-6">
       
            <div className="w-40 md:w-48 flex-shrink-0 self-center md:self-start">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={book.title}
                  className="w-full rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                  <HiBookOpen className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

        
            <div className="flex-1 space-y-4 text-sm sm:text-base">
              <InfoBlock label="Author(s)" value={authors} />
              {book.first_publish_year && (
                <InfoBlock label="Publication Year" value={book.first_publish_year} />
              )}
              {book.publisher?.length > 0 && (
                <InfoBlock label="Publisher" value={book.publisher[0]} />
              )}
              {book.subject?.length > 0 && (
                <TagBlock label="Subjects" tags={book.subject.slice(0, 8)} color="blue" />
              )}
              {book.language?.length > 0 && (
                <TagBlock label="Languages" tags={book.language.slice(0, 5)} color="gray" uppercase />
              )}
              {book.number_of_pages_median && (
                <InfoBlock label="Pages" value={book.number_of_pages_median} />
              )}
              {bookUrl && (
                <div>
                  <a
                    href={bookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-600 hover:underline font-medium"
                  >
                    View on OpenLibrary
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




export default BookModal;