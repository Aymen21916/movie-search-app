import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaStar, FaPlay, FaPlus, FaShare } from 'react-icons/fa'
import ReactPlayer from 'react-player'
import MovieListManager from '../../../components/MovieListManager';


export default function MediaDetails() {
  const router = useRouter()
  const { type, id } = router.query
  const [media, setMedia] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!id || !type) return

      try {
        setLoading(true)
        const API_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

        const mediaRes = await axios.get(
          `${API_URL}/${type}/${id}?api_key=${API_KEY}`
        )

        const videosRes = await axios.get(
          `${API_URL}/${type}/${id}/videos?api_key=${API_KEY}`
        )

        setMedia(mediaRes.data)
        setVideos(videosRes.data.results)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching media details:', error)
        setLoading(false)
      }
    }

    fetchMediaDetails()
  }, [id, type])

  const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    )
  }

  if (!media) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Media not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="h-96 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/original${media.backdrop_path})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 flex justify-center">
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/w500${media.poster_path}`}
              alt={media.title || media.name}
              className="rounded-lg shadow-lg w-64"
            />
          </div>

          <div className="md:w-2/3 md:pl-8 mt-6 md:mt-0">
            <h1 className="text-4xl font-bold text-white">
              {media.title || media.name}
            </h1>

            <div className="flex items-center mt-4">
              <div className="flex items-center bg-primary rounded-full px-4 py-1">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-white font-medium">
                  {media.vote_average.toFixed(1)}
                </span>
              </div>
              <span className="ml-4 text-gray-300">
                {media.release_date?.substring(0, 4) || media.first_air_date?.substring(0, 4)}
              </span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-gray-300">
                {media.runtime || media.episode_run_time?.[0] || 'N/A'} min
              </span>
            </div>

            <div className="mt-6 flex space-x-4">
              {trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center bg-secondary hover:bg-teal-600 text-white px-4 py-2 rounded-full"
                >
                  <FaPlay className="mr-2" />
                  Play Trailer
                </button>
              )}
              <button className="flex items-center bg-transparent hover:bg-rose-600 bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full">
                <FaPlus className="mr-2" />
                Add to List
              </button>
              <button className="flex items-center bg-transparent hover:bg-sky-500 bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full">
                <FaShare className="mr-2" />
                Share
              </button>
            </div>

            <div className="mt-10">
              <h2 className="text-3xl font-semibold text-gray-800">Overview</h2>
              <p className="mt-2 text-gray-400">{media.overview}</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-400">Genres</h3>
                <div className="flex flex-wrap mt-2">
                  {media.genres.map(genre => (
                    <span
                      key={genre.id}
                      className="bg-tertiary text-primary  text-gray-400 text-sm px-3 py-1 rounded-full mr-2 mb-2"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {type === 'movie' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-400">Production Companies</h3>
                  <div className="flex flex-wrap mt-2">
                    {media.production_companies.slice(0, 3).map(company => (
                      <span
                        key={company.id}
                        className="text-gray-300 text-sm mr-4 mb-2 text-gray-400"
                      >
                        {company.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <MovieListManager activeMovie={media} />
        </div>
      </div>

      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <div className="relative pt-[56.25%]">
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${trailer.key}`}
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
                controls
              />
            </div>
            <button
              onClick={() => setShowTrailer(false)}
              className="mt-4 text-white hover:text-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}