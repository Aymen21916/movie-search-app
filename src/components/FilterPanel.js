export default function FilterPanel({ filters, onFilterChange, sortValue, onSortChange }) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <div className="mb-8 bg-white dark:bg-slate-700 p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Media Type
          </label>
          <select
            value={filters.media_type}
            onChange={(e) => onFilterChange({ media_type: e.target.value })}
            className="w-full text-gray-300 border border-gray-300 rounded-md p-2"
          >
            <option value="all">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Year
          </label>
          <select
            value={filters.year}
            onChange={(e) => onFilterChange({ year: e.target.value })}
            className="w-full text-gray-300 border border-gray-300 rounded-md p-2"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Minimum Rating: {filters.rating}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={filters.rating}
            onChange={(e) => onFilterChange({ rating: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Sort By
          </label>
          <select
            value={sortValue}
            onChange={onSortChange}
            className="w-full text-gray-300 border border-gray-300 rounded-md p-2"
          >
            <option value="popularity.desc">Popularity (High to Low)</option>
            <option value="vote_average.desc">Rating (High to Low)</option>
            <option value="release_date.desc">Release Date (Newest)</option>
          </select>
        </div>
      </div>
    </div>
  )
}