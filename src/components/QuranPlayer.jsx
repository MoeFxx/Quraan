import { useEffect, useState, useRef } from 'react';

const API_BASE = 'https://api.alquran.cloud/v1';
const TRANSLATION_OPTIONS = ['en.asad', 'en.pickthall', 'en.sahih'];

export default function QuranPlayer() {
  const [surahs, setSurahs] = useState([]);
  const [surahNumber, setSurahNumber] = useState(1);
  const [translationEdition, setTranslationEdition] = useState('en.asad');
  const [ayahs, setAyahs] = useState([]);
  const [translationAyahs, setTranslationAyahs] = useState([]);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/surah`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setSurahs(data.data);
        }
      })
      .catch((err) => console.error('Failed to fetch surahs:', err));
  }, []);

  useEffect(() => {
    fetch(
      `${API_BASE}/surah/${surahNumber}/editions/ar.alafasy,${translationEdition}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data) && data.data.length >= 2) {
          setAyahs(data.data[0].ayahs || []);
          setTranslationAyahs(data.data[1].ayahs || []);
          setCurrentAyahIndex(0);
        }
      })
      .catch((err) => console.error('Failed to fetch ayahs:', err));
  }, [surahNumber, translationEdition]);

  const playAudio = () => {
    audioRef.current?.play();
  };

  const nextAyah = () => {
    setCurrentAyahIndex((i) => Math.min(i + 1, ayahs.length - 1));
  };

  const prevAyah = () => {
    setCurrentAyahIndex((i) => Math.max(i - 1, 0));
  };

  const repeatAyah = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [currentAyahIndex]);

  return (
    <div>
      <h2>Quran Player</h2>
      <div>
        <label htmlFor="surah-select">Surah:</label>{' '}
        <select
          id="surah-select"
          value={surahNumber}
          onChange={(e) => setSurahNumber(Number(e.target.value))}
        >
          {surahs.map((s) => (
            <option key={s.number} value={s.number}>
              {s.number}. {s.englishName}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <label htmlFor="edition-select">Edition:</label>{' '}
        <select
          id="edition-select"
          value={translationEdition}
          onChange={(e) => setTranslationEdition(e.target.value)}
        >
          {TRANSLATION_OPTIONS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      {ayahs.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <p>{ayahs[currentAyahIndex].text}</p>
          {translationAyahs[currentAyahIndex] && (
            <p style={{ fontStyle: 'italic' }}>
              {translationAyahs[currentAyahIndex].text}
            </p>
          )}
          <audio
            ref={audioRef}
            controls
            src={ayahs[currentAyahIndex].audio}
          />
          <div style={{ marginTop: '0.5rem' }}>
            <button onClick={prevAyah} disabled={currentAyahIndex === 0}>
              Previous
            </button>{' '}
            <button onClick={playAudio}>Play</button>{' '}
            <button
              onClick={nextAyah}
              disabled={currentAyahIndex === ayahs.length - 1}
            >
              Next
            </button>{' '}
            <button onClick={repeatAyah}>Repeat</button>
          </div>
        </div>
      )}
    </div>
  );
}
