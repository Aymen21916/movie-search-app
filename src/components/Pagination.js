import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../store/movieSlice';
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';

export default function Pagination() {
  const dispatch = useDispatch();
  const { currentPage, totalPages, totalResults, status, query } = useSelector((state) => state.movies);
  
  if (totalPages <= 1 || status !== 'succeeded') return null;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    dispatch(fetchMovies({ query, page })); // Now query is available
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`px-3 py-1 rounded ${
          1 === currentPage
            ? 'bg-secondary text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        1
      </button>
    );
    
    // Show ellipsis if current page is more than 3 away from start
    if (currentPage > maxVisiblePages - 1) {
      pages.push(
        <span key="start-ellipsis" className="px-2">
          <FaEllipsisH className="text-gray-500" />
        </span>
      );
    }
    
    // Calculate start and end pages
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust if near the beginning
    if (currentPage <= maxVisiblePages - 1) {
      endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
    }
    
    // Adjust if near the end
    if (currentPage >= totalPages - (maxVisiblePages - 2)) {
      startPage = Math.max(2, totalPages - (maxVisiblePages - 2));
    }
    
    // Render middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            i === currentPage
              ? 'bg-secondary text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Show ellipsis if current page is more than 2 away from end
    if (currentPage < totalPages - (maxVisiblePages - 2)) {
      pages.push(
        <span key="end-ellipsis" className="px-2">
          <FaEllipsisH className="text-gray-500" />
        </span>
      );
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 rounded ${
            totalPages === currentPage
              ? 'bg-secondary text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {totalPages}
        </button>
      );
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 py-4 border-t border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
        Showing page {currentPage} of {totalPages} • {totalResults} results
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded flex items-center ${
            currentPage === 1
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <FaChevronLeft className="mr-1" />
          Previous
        </button>
        
        <div className="flex space-x-1 mx-2">
          {renderPageNumbers()}
        </div>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded flex items-center ${
            currentPage === totalPages
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Next
          <FaChevronRight className="ml-1" />
        </button>
      </div>
    </div>
  );
}