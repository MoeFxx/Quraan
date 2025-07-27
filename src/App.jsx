import { useState } from 'react';
import QuranPlayer from './components/QuranPlayer';
import Search from './components/Search';

export default function App() {
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahIndex, setAyahIndex] = useState(0);

  return (
    <div>
      <h1>Hello, Quraan!</h1>
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
