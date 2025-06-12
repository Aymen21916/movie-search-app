import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    setFilter,
    setSort
} from '../store/movieSlice'
import SearchBar from '../components/SearchBar'
import MovieCard from '../components/MovieCard'
import FilterPanel from '../components/FilterPanel'
import Pagination from '../components/Pagination'
import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
    const dispatch = useDispatch()
    const { data, status, filters, sort } = useSelector((state) => state.movies)
    const [currentPage, setCurrentPage] = useState(1)

    const handleFilterChange = (newFilters) => {
        dispatch(setFilter(newFilters))
    }

    const handleSortChange = (e) => {
        dispatch(setSort(e.target.value))
    }

    const filteredData = data
        .filter(item => {
            return (
                (filters.media_type === 'all' || item.media_type === filters.media_type) &&
                (!filters.year ||
                    (item.release_date?.substring(0, 4) === filters.year ||
                        (item.first_air_date?.substring(0, 4) === filters.year)) &&
                    item.vote_average >= filters.rating
                ))
        })
        .sort((a, b) => {
            if (sort === 'popularity.desc') return b.popularity - a.popularity
            if (sort === 'vote_average.desc') return b.vote_average - a.vote_average
            if (sort === 'release_date.desc') {
                return new Date(b.release_date || b.first_air_date) - new Date(a.release_date || a.first_air_date)
            }
            return 0
        })

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <header className="bg-primary dark:bg-primary-dark text-white py-6 shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Movie Explorer</h1>
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                        </div>
                    </div>
                    <div className="mt-6">
                        <SearchBar />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <FilterPanel
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    sortValue={sort}
                    onSortChange={handleSortChange}
                />

                {status === 'loading' && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary mx-auto"></div>
                    </div>
                )}

                {status === 'succeeded' && filteredData.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-xl">No results found. Try a different search!</p>
                    </div>
                )}

                {status === 'succeeded' && filteredData.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredData.map(item => (
                                <MovieCard key={`${item.media_type}-${item.id}`} item={item} />
                            ))}
                        </div>

                        <Pagination />
                    </>
                )}
            </main>
        </div>
    )
}