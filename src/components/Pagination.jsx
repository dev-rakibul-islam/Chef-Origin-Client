import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-all duration-300"
        aria-label="Previous Page"
      >
        <FiChevronLeft />
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
            currentPage === page
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-all duration-300"
        aria-label="Next Page"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}
