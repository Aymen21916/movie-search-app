import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

export const fetchMovies = createAsyncThunk(
    'movies/fetchMovies',
    async ({ query, page = 1 }) => {
        const response = await axios.get(
            `${API_URL}/search/multi?api_key=${API_KEY}&query=${query}&page=${page}`
        )

        return {
            results: response.data.results,
            page: response.data.page,
            totalPages: response.data.total_pages,
            totalResults: response.data.total_results
        }
    }
)

const movieSlice = createSlice({
    name: 'movies',
    initialState: {
        data: [],
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
        status: 'idle',
        error: null,
        filters: {
            media_type: 'all',
            year: '',
            rating: 0,
        },
        sort: 'popularity.desc',
        query: '',
    },
    reducers: {
        setFilter: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        setSort: (state, action) => {
            state.sort = action.payload
        },
        setQuery: (state, action) => {
            state.query = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.results;
                state.currentPage = action.payload.page;
                state.totalPages = action.payload.totalPages;
                state.totalResults = action.payload.totalResults;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    },
})

export const { setFilter, setSort, setQuery } = movieSlice.actions
export default movieSlice.reducer