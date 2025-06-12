import { useState, useEffect } from 'react';
import { FaTimes, FaLink, FaTrash, FaStar, FaPlus } from 'react-icons/fa';

export default function MovieListManager({ onAddToList, activeMovie }) {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [activeList, setActiveList] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const savedLists = localStorage.getItem('movieLists');
    if (savedLists) {
      try {
        setLists(JSON.parse(savedLists));
      } catch (e) { 
        console.error('Error parsing saved lists:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('movieLists', JSON.stringify(lists));
  }, [lists]);

  const createList = () => {
    if (newListName.trim()) {
      const newList = {
        id: Date.now(),
        name: newListName,
        items: [],
        shareLink: '',
        created: new Date().toISOString()
      };
      setLists([...lists, newList]);
      setNewListName('');
      setActiveList(newList);
      showNotification(`"${newListName}" created successfully!`);
    }
  };

  const addToActiveList = () => {
    if (!activeList || !activeMovie) return;
    
    const updatedLists = lists.map(list => {
      if (list.id === activeList.id) {
        if (!list.items.some(item => item.id === activeMovie.id)) {
          return {
            ...list,
            items: [...list.items, activeMovie]
          };
        }
      }
      return list;
    });
    
    setLists(updatedLists);
    showNotification(`Added to "${activeList.name}"!`);
  };

  const removeFromList = (listId, movieId) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.filter(item => item.id !== movieId)
        };
      }
      return list;
    });
    
    setLists(updatedLists);
    showNotification('Removed from list');
  };

  const deleteList = (listId) => {
    const updatedLists = lists.filter(list => list.id !== listId);
    setLists(updatedLists);
    
    if (activeList?.id === listId) {
      setActiveList(null);
    }
    
    showNotification('List deleted');
  };

  const generateShareLink = (list) => {
    const shareLink = `${window.location.origin}/list/${list.id}`;
    const updatedLists = lists.map(l => 
      l.id === list.id ? { ...l, shareLink } : l
    );
    setLists(updatedLists);
    setShowShareModal(true);
    return shareLink;
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="mt-8 bg-gray-400 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-primary">My Movie Lists</h2>
      
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fadeIn">
          {notification}
        </div>
      )}
      
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="New list name (e.g. Favorite Sci-Fi Movies)"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          className="border border-gray-300 rounded-l-md p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <button 
          onClick={createList}
          className="bg-secondary hover:bg-teal-600 text-white px-6 py-3 rounded-r-md transition duration-300"
        >
          Create List
        </button>
      </div>
      
      {lists.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Your Lists:</h3>
          <div className="flex flex-wrap gap-3">
            {lists.map(list => (
              <div 
                key={list.id} 
                className={`relative group px-4 py-2 rounded-lg flex items-center ${
                  activeList?.id === list.id
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-200 hover:border-secondary'
                }`}
              >
                <button
                  onClick={() => setActiveList(list)}
                  className="flex items-center"
                >
                  <span className="font-medium">{list.name}</span>
                  <span className="ml-2 text-sm bg-tertiary text-primary px-2 py-1 rounded-full">
                    {list.items.length}
                  </span>
                </button>
                
                <div className="ml-3 flex space-x-1">
                  <button 
                    onClick={() => generateShareLink(list)}
                    className="text-gray-500 hover:text-secondary transition"
                    title="Share list"
                  >
                    <FaLink />
                  </button>
                  <button 
                    onClick={() => deleteList(list.id)}
                    className="text-gray-500 hover:text-red-500 transition"
                    title="Delete list"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeList && activeMovie && (
        <div className="mb-6">
          <button
            onClick={addToActiveList}
            className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-300"
          >
            <FaPlus className="mr-2" />
            Add to "{activeList.name}"
          </button>
        </div>
      )}
      
      {activeList && activeList.items.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">{activeList.name}</span>
            <span className="text-sm bg-tertiary text-primary px-2 py-1 rounded-full">
              {activeList.items.length} items
            </span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeList.items.map(movie => (
              <div key={movie.id} className="flex items-center bg-white rounded-lg shadow p-3">
                <div className="flex-shrink-0 mr-4">
                  <img 
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/w92${movie.poster_path}`} 
                    alt={movie.title || movie.name} 
                    className="w-16 h-24 object-cover rounded"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold">{movie.title || movie.name}</h4>
                  <div className="flex items-center mt-1">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromList(activeList.id, movie.id)}
                  className="ml-4 text-gray-400 hover:text-red-500 transition"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showShareModal && activeList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary">Share Your List</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <p className="mb-4 text-gray-600">
              Share your "{activeList.name}" list with friends:
            </p>
            <div className="flex mb-4">
              <input
                type="text"
                value={activeList.shareLink}
                readOnly
                className="border border-gray-300 rounded-l-md p-3 flex-grow focus:outline-none"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(activeList.shareLink);
                  showNotification('Link copied to clipboard!');
                }}
                className="bg-secondary hover:bg-teal-600 text-white px-4 py-3 rounded-r-md transition duration-300"
              >
                Copy
              </button>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                Anyone with this link can view your list. Your lists are saved locally in your browser.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}