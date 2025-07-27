import { useState } from 'react';

const API_BASE = 'https://api.alquran.cloud/v1';

export default function Search({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await fetch(
        `${API_BASE}/search/${encodeURIComponent(query)}/all`
      );
      const data = await res.json();
      if (data.data && Array.isArray(data.data.matches)) {
        setResults(data.data.matches);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Failed to search:', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Quran"
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {results.map((r, idx) => (
          <li key={idx}>
            <button
              style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: 'blue' }}
              onClick={() => onSelect({ surah: r.surah.number, ayah: r.numberInSurah - 1 })}
            >
              {r.text} ({r.surah.number}:{r.numberInSurah})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
