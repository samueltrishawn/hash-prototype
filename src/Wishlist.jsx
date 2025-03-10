import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const removeFromWishlist = (countryCode) => {
    const updatedWishlist = wishlist.filter(country => country.code !== countryCode);
    setWishlist(updatedWishlist);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('wishlist');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Wishlist</h1>
      <Link to="/" className="mb-4 inline-block bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800">Back to Home</Link>
      <br/>
      {wishlist.length === 0 ? (
        <p className="hover">No countries in wishlist.</p>
      ) : (
        <>
          <button 
            className="mb-4 bg-red-700 text-white font-semibold px-2 py-1 rounded hover:bg-red-800"
            onClick={clearWishlist}
          >
            Remove All Wishlist
          </button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((country) => (
              <div key={country.code} className="border rounded-lg p-4 shadow-md bg-white">
                <h2 className="text-lg text-black font-semibold">{country.name}</h2>
                <p className="text-sm text-gray-600"><strong>Continent:</strong> {country.continent || 'N/A'}</p>
                <p className="text-sm text-gray-600"><strong>Currency:</strong> {country.currency || 'N/A'}</p>
                <p className="text-sm text-gray-600"><strong>Phone:</strong> +{country.phone}</p>
                <button 
                  className="mt-2 bg-red-700 text-white font-semibold px-4 py-2 rounded hover:bg-red-800"
                  onClick={() => removeFromWishlist(country.code)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}