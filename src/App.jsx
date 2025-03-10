import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

export default function App() {
  const [continents, setContinents] = useState([]);
  const [filterContinent, setFilterContinent] = useState('');
  const [filterCurrency, setFilterCurrency] = useState('');
  const [filterPhoneCode, setFilterPhoneCode] = useState('');
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
  });

  useEffect(() => {
    fetch('https://countries.trevorblades.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query {
            continents {
              code
              name
              countries {
                name
                code
                currency
                phone
              }
            }
          }
        `
      })
    })
      .then(res => res.json())
      .then(data => setContinents(data.data.continents))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const allCountries = continents.flatMap(continent => 
    continent.countries.map(country => ({ ...country, continent: continent.name }))
  );

  const filteredCountries = allCountries
    .filter(country =>
      (filterContinent === '' || country.continent === filterContinent) &&
      (filterCurrency === '' || country.currency?.toLowerCase().includes(filterCurrency.toLowerCase())) &&
      (filterPhoneCode === '' || country.phone.includes(filterPhoneCode))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const addToWishlist = (country) => {
    if (!wishlist.some((item) => item.code === country.code)) {
      setWishlist([...wishlist, country]);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Country List</h1>
      <Link to="/wishlist" className="mb-4 inline-block bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800">Go to Wishlist</Link>
      <form className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Filter by Continent:</label>
          <select
            className="border p-2 rounded w-full"
            value={filterContinent}
            onChange={(e) => setFilterContinent(e.target.value)}
          >
            <option className="text-black" value="">All Continents</option>
            {continents.map((continent) => (
              <option className="text-black" key={continent.code} value={continent.name}>
                {continent.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Filter by Currency:</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={filterCurrency}
            onChange={(e) => setFilterCurrency(e.target.value)}
            placeholder="Enter currency code (e.g., USD)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Filter by Phone Code:</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={filterPhoneCode}
            onChange={(e) => setFilterPhoneCode(e.target.value)}
            placeholder="Enter phone code (e.g., 1)"
          />
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredCountries.map((country) => (
          <div key={country.code} className="border rounded-lg p-3 shadow-md bg-white">
            <h2 className="text-lg text-black font-semibold">{country.name}</h2>
            <p className="text-sm text-gray-600"><strong>Continent:</strong> {country.continent}</p>
            <p className="text-sm text-gray-600"><strong>Currency:</strong> {country.currency || 'N/A'}</p>
            <p className="text-sm text-gray-600"><strong>Phone:</strong> +{country.phone}</p>
            <button 
              className="mt-2 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              onClick={() => addToWishlist(country)}
            >
              Add to Wishlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
