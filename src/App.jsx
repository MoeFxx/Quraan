import { useState } from 'react';
import QuranPlayer from './components/QuranPlayer';
import Search from './components/Search';
import { t } from './i18n';

export default function App() {
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('ar');

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  const toggleLang = () => {
    setLang((l) => (l === 'ar' ? 'en' : 'ar'));
  };

  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahIndex, setAyahIndex] = useState(0);

  return (
    <div className={`app ${theme}-theme`} style={{ fontSize: `${fontSize}px` }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h1>{t(lang, 'heading')}</h1>
      <div className="controls">
        <label>
          {t(lang, 'fontSize')}: {fontSize}px
          <input
            type="range"
            min="12"
            max="30"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </label>{' '}
        <button onClick={toggleTheme} style={{ marginLeft: '0.5rem' }}>
          {theme === 'light' ? t(lang, 'darkMode') : t(lang, 'lightMode')}
        </button>{' '}
        <button onClick={toggleLang} style={{ marginLeft: '0.5rem' }}>
          {lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      <Search
        lang={lang}
        onSelect={({ surah, ayah }) => {
          setSurahNumber(surah);
          setAyahIndex(ayah);
        }}
      />
      <QuranPlayer
        surahNumber={surahNumber}
        currentAyahIndex={ayahIndex}
        onSurahChange={setSurahNumber}
        onAyahChange={setAyahIndex}
        lang={lang}
      />
    </div>
  );
}
