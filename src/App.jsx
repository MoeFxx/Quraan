import { useState } from 'react';
import QuranPlayer from './components/QuranPlayer';
import Search from './components/Search';

export default function App() {
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahIndex, setAyahIndex] = useState(0);

  return (
    <div className={`app ${theme}-theme`} style={{ fontSize: `${fontSize}px` }}>
      <h1>Hello, Quraan!</h1>
      <div className="controls">
        <label>
          Font Size: {fontSize}px
          <input
            type="range"
            min="12"
            max="30"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </label>{' '}
        <button onClick={toggleTheme} style={{ marginLeft: '0.5rem' }}>
          {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>

      <Search onSelect={({ surah, ayah }) => {
        setSurahNumber(surah);
        setAyahIndex(ayah);
      }} />
      <QuranPlayer
        surahNumber={surahNumber}
        currentAyahIndex={ayahIndex}
        onSurahChange={setSurahNumber}
        onAyahChange={setAyahIndex}
      />
    </div>
  );
}
