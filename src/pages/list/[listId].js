import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaStar, FaArrowLeft, FaLink, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

export default function ListViewPage() {
  const router = useRouter();
  const { listId } = router.query;
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!listId) return;
    
    const savedLists = localStorage.getItem('movieLists');
    if (savedLists) {
      try {
        const lists = JSON.parse(savedLists);
        const foundList = lists.find(l => l.id === parseInt(listId));
        
        if (foundList) {
          setList(foundList);
        } else {
          setError('List not found');
        }
      } catch (e) {
        setError('Error loading list data');
        console.error('Error parsing saved lists:', e);
      }
    } else {
      setError('No saved lists found');
    }
    
    setLoading(false);
  }, [listId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">List Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/">
            <a className="bg-secondary hover:bg-teal-600 text-white px-6 py-3 rounded-lg inline-flex items-center transition duration-300">
              <FaArrowLeft className="mr-2" />
              Back to Home
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <a className="flex items-center text-white hover:text-gray-200 transition">
                <FaArrowLeft className="mr-2" />
                Back to Search
              </a>
            </Link>
            <h1 className="text-2xl font-bold text-center">{list.name}</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{list.name}</h2>
              <p className="text-gray-600 mt-2">
                Created on {new Date(list.created).toLocaleDateString()} • {list.items.length} items
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigator.clipboard.writeText(list.shareLink || window.location.href)}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full text-gray-600 transition"
                title="Copy link"
              >
                <FaLink />
              </button>
            </div>
          </div>

          {list.items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-xl">This list is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.items.map(movie => (
                <div key={movie.id} className="border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-md transition">
                  <div className="flex">
                    <div className="w-1/3">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/w500${movie.poster_path}`} 
                        alt={movie.title || movie.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="font-bold text-lg">{movie.title || movie.name}</h3>
                      <div className="flex items-center mt-2">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-gray-700">{movie.vote_average.toFixed(1)}</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-2">
                        {movie.release_date?.substring(0,4) || movie.first_air_date?.substring(0,4)}
                      </p>
                      <Link href={`/details/${movie.media_type}/${movie.id}`}>
                        <a className="inline-block mt-4 text-sm text-secondary hover:underline">
                          View Details
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}