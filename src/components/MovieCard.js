import Link from 'next/link'
import { FaStar } from 'react-icons/fa'

export default function MovieCard({ item }) {
  const imageUrl = item.poster_path 
    ? `${"https://image.tmdb.org/t/p"}/w500${item.poster_path}`
    : '/no-image.png'

  return (
    <Link href={`/details/${item.media_type}/${item.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer">
        <img 
          src={imageUrl ?? '../../public/no-image.png'} 
          alt={item.title || item.name} 
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg text-black truncate">{item.title || item.name}</h3>
          <div className="flex items-center mt-1">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="text-gray-700">{item?.vote_average?.toFixed(1) ?? 0}</span>
            <span className="ml-2 text-xs bg-secondary text-white px-2 py-1 rounded-full">
              {item.media_type === 'movie' ? 'Movie' : 'TV'}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {item.release_date?.substring(0,4) || item.first_air_date?.substring(0,4)}
          </p>
        </div>
      </div>
    </Link>
  )
}