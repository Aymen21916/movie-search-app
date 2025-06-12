import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchMovies, setQuery } from '../store/movieSlice' // Now setQuery is available
import { FaSearch } from 'react-icons/fa'

export default function SearchBar() {
  const [queryInput, setQueryInput] = useState('')
  const dispatch = useDispatch()

  const handleSearch = (e) => {
    e.preventDefault()
    if (queryInput.trim()) {
      dispatch(setQuery(queryInput)) // Dispatch setQuery action
      dispatch(fetchMovies({ query: queryInput, page: 1 }))
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="flex items-center border-b-2 border-secondary py-2">
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 dark:text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Search movies, series, actors..."
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
        />
        <button
          className="flex-shrink-0 bg-secondary hover:bg-teal-700 text-sm text-white py-2 px-4 rounded-full flex items-center"
          type="submit"
        >
          <FaSearch className="mr-2" />
          Search
        </button>
      </div>
    </form>
  )
}