import { useEffect, useState, useRef } from 'react';

const API_BASE = 'https://api.alquran.cloud/v1';

export default function QuranPlayer() {
  const [surahs, setSurahs] = useState([]);
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahs, setAyahs] = useState([]);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const audioRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loopSingle, setLoopSingle] = useState(false);
  const [loopRange, setLoopRange] = useState(false);
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);
  const [autoPlayNext, setAutoPlayNext] = useState(false);

  useEffect(() => {
    if (loopSingle) {
      setLoopRange(false);
    }
  }, [loopSingle]);

  useEffect(() => {
    if (loopRange) {
      setLoopSingle(false);
    }
  }, [loopRange]);

  // Load saved state on mount so the user can resume where they left off
  useEffect(() => {
    const savedSurah = Number(localStorage.getItem('surahNumber'));
    const savedIndex = Number(localStorage.getItem('currentAyahIndex'));
    if (!Number.isNaN(savedSurah) && savedSurah > 0) {
      setSurahNumber(savedSurah);
    }
    if (!Number.isNaN(savedIndex) && savedIndex >= 0) {
      setCurrentAyahIndex(savedIndex);
    }
  }, []);

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
          const savedSurah = Number(localStorage.getItem('surahNumber'));
          const savedIndex = Number(localStorage.getItem('currentAyahIndex'));
          if (surahNumber === savedSurah && !Number.isNaN(savedIndex)) {
            setCurrentAyahIndex(Math.min(savedIndex, data.data.ayahs.length - 1));
          } else {
            setCurrentAyahIndex(0);
          }
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

  const handleAudioEnded = () => {
    if (loopSingle) {
      repeatAyah();
    } else if (
      loopRange &&
      rangeStart >= 1 &&
      rangeEnd >= rangeStart &&
      rangeStart <= ayahs.length
    ) {
      if (currentAyahIndex < rangeEnd - 1 && currentAyahIndex < ayahs.length - 1) {
        setAutoPlayNext(true);
        setCurrentAyahIndex((i) => i + 1);
      } else {
        setAutoPlayNext(true);
        setCurrentAyahIndex(rangeStart - 1);
      }
    }
  };

  // Persist surah and ayah index so progress is saved between sessions
  useEffect(() => {
    localStorage.setItem('surahNumber', String(surahNumber));
  }, [surahNumber]);

  useEffect(() => {
    localStorage.setItem('currentAyahIndex', String(currentAyahIndex));
  }, [currentAyahIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.playbackRate = playbackRate;
      if (autoPlayNext) {
        audioRef.current.play();
      }
    }
    setAutoPlayNext(false);
  }, [currentAyahIndex, autoPlayNext, playbackRate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

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
            onEnded={handleAudioEnded}
          />
          <div style={{ marginTop: '0.5rem' }}>
            <label htmlFor="speed-select">Speed:</label>{' '}
            <select
              id="speed-select"
              value={playbackRate}
              onChange={(e) => setPlaybackRate(Number(e.target.value))}
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
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
          <div style={{ marginTop: '0.5rem' }}>
            <label>
              <input
                type="checkbox"
                checked={loopSingle}
                onChange={(e) => setLoopSingle(e.target.checked)}
              />{' '}
              Loop current ayah
            </label>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <label>Range: </label>
            <input
              type="number"
              min="1"
              max={ayahs.length}
              value={rangeStart}
              onChange={(e) => setRangeStart(Number(e.target.value))}
              style={{ width: '4rem' }}
            />{' '}
            -{' '}
            <input
              type="number"
              min="1"
              max={ayahs.length}
              value={rangeEnd}
              onChange={(e) => setRangeEnd(Number(e.target.value))}
              style={{ width: '4rem' }}
            />{' '}
            <label>
              <input
                type="checkbox"
                checked={loopRange}
                onChange={(e) => setLoopRange(e.target.checked)}
              />{' '}
              Loop range
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
