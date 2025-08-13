import { useState } from 'react';
import API from '../services/api';
import '../styles/UserSearch.css';

export default function UserSearch({ onResults }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.get(`/Users/search?query=${encodeURIComponent(query)}`);
      setResults(res.data);
      onResults && onResults(res.data);
    } catch (err) {
      setError('No users found.');
      setResults([]);
      onResults && onResults([]);
    }
  };

  return (
    <div className="user-search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search users by username or email..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {error && <div className="error">{error}</div>}
      <ul className="user-search-results">
        {results.map(u => (
          <li key={u.id}>{u.username} ({u.email})</li>
        ))}
      </ul>
    </div>
  );
} 