import { useState } from 'react';
import { t } from '../i18n';

const API_BASE = 'https://api.alquran.cloud/v1';

export default function Search({ onSelect, lang }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

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
      setSearched(true);
    } catch (err) {
      console.error('Failed to search:', err);
    }
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t(lang, 'searchPlaceholder')}
        />
        <button type="submit">{t(lang, 'searchButton')}</button>
      </form>
      {searched && results.length === 0 && (
        <p>{t(lang, 'noResults')}</p>
      )}
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
