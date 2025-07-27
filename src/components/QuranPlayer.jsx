import { useEffect, useState, useRef } from 'react';

const API_BASE = 'https://api.alquran.cloud/v1';

export default function QuranPlayer() {
  const [surahs, setSurahs] = useState([]);
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahs, setAyahs] = useState([]);
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
    fetch(`${API_BASE}/surah/${surahNumber}/ar.alafasy`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.ayahs) {
          setAyahs(data.data.ayahs);
          setCurrentAyahIndex(0);
        }
      })
      .catch((err) => console.error('Failed to fetch ayahs:', err));
  }, [surahNumber]);

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

      {ayahs.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <p>{ayahs[currentAyahIndex].text}</p>
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
