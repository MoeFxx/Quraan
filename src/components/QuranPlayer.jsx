import { useEffect, useState, useRef } from 'react';

const API_BASE = 'https://api.alquran.cloud/v1';
const TRANSLATION_OPTIONS = ['en.asad', 'en.pickthall', 'en.sahih'];
const TRANSLITERATION_EDITION = 'en.transliteration';

import { t } from '../i18n';

export default function QuranPlayer({
  surahNumber,
  currentAyahIndex,
  onSurahChange,
  onAyahChange,
  lang,
}) {
  const [surahs, setSurahs] = useState([]);
  const [translationEdition, setTranslationEdition] = useState('en.asad');
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [ayahs, setAyahs] = useState([]);
  const [translationAyahs, setTranslationAyahs] = useState([]);
  const [translitAyahs, setTranslitAyahs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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

  // Load saved state on mount
  useEffect(() => {
    const savedSurah = Number(localStorage.getItem('surahNumber'));
    const savedIndex = Number(localStorage.getItem('currentAyahIndex'));
    if (!Number.isNaN(savedSurah) && savedSurah > 0) {
      onSurahChange(savedSurah);
    }
    if (!Number.isNaN(savedIndex) && savedIndex >= 0) {
      onAyahChange(savedIndex);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch(`${API_BASE}/surah`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setSurahs(data.data);
          setErrorMessage('');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch surahs:', err);
        setErrorMessage(t(lang, 'unableSurah'));
      });
  }, []);

  useEffect(() => {
    const editions = [`ar.alafasy`, translationEdition];
    if (showTransliteration) editions.push(TRANSLITERATION_EDITION);
    fetch(`${API_BASE}/surah/${surahNumber}/editions/${editions.join(',')}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          const [audioEd, transEd, translitEd] = data.data;
          setAyahs(audioEd.ayahs || []);
          setTranslationAyahs(transEd?.ayahs || []);
          if (showTransliteration) {
            setTranslitAyahs(translitEd?.ayahs || []);
          } else {
            setTranslitAyahs([]);
          }
          const savedSurah = Number(localStorage.getItem('surahNumber'));
          const savedIndex = Number(localStorage.getItem('currentAyahIndex'));
          if (surahNumber === savedSurah && !Number.isNaN(savedIndex)) {
            onAyahChange(Math.min(savedIndex, (audioEd.ayahs || []).length - 1));
          } else {
            onAyahChange(0);
          }
          setErrorMessage('');
        } else if (data.data && data.data.ayahs) {
          setAyahs(data.data.ayahs);
          setTranslationAyahs([]);
          setTranslitAyahs([]);
          onAyahChange(0);
          setErrorMessage('');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch ayahs:', err);
        setErrorMessage(t(lang, 'unableAyah'));
      });
  }, [surahNumber, translationEdition, showTransliteration, onAyahChange]);

  // Persist progress
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

  const playAudio = () => {
    audioRef.current?.play();
  };

  const nextAyah = () => {
    onAyahChange(Math.min(currentAyahIndex + 1, ayahs.length - 1));
  };

  const prevAyah = () => {
    onAyahChange(Math.max(currentAyahIndex - 1, 0));
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
        onAyahChange(currentAyahIndex + 1);
      } else {
        setAutoPlayNext(true);
        onAyahChange(rangeStart - 1);
      }
    }
  };

  return (
    <div className="quran-player">
      <h2>{t(lang, 'quranPlayer')}</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div>
        <label htmlFor="surah-select">{t(lang, 'surah')}:</label>{' '}
        <select
          id="surah-select"
          value={surahNumber}
          onChange={(e) => onSurahChange(Number(e.target.value))}
        >
          {surahs.map((s) => (
            <option key={s.number} value={s.number}>
              {s.number}. {lang === 'ar' ? s.name : s.englishName}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <label htmlFor="edition-select">{t(lang, 'edition')}:</label>{' '}
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
      <div style={{ marginTop: '0.5rem' }}>
        <label>
          <input
            type="checkbox"
            checked={showTransliteration}
            onChange={(e) => setShowTransliteration(e.target.checked)}
          />{' '}
          {t(lang, 'showTranslit')}
        </label>
      </div>
      {ayahs.length > 0 && (
        <div className="player-section">
          <p>{ayahs[currentAyahIndex].text}</p>
          {translationAyahs[currentAyahIndex] && (
            <p style={{ fontStyle: 'italic' }}>
              {translationAyahs[currentAyahIndex].text}
            </p>
          )}
          {showTransliteration && translitAyahs[currentAyahIndex] && (
            <p style={{ fontStyle: 'italic' }}>
              {translitAyahs[currentAyahIndex].text}
            </p>
          )}
          <audio
            ref={audioRef}
            controls
            src={ayahs[currentAyahIndex].audio}
            onEnded={handleAudioEnded}
          />
          <div className="controls">
            <div style={{ marginTop: '0.5rem' }}>
              <label htmlFor="speed-select">{t(lang, 'speed')}:</label>{' '}
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
                {t(lang, 'previous')}
              </button>{' '}
              <button onClick={playAudio}>{t(lang, 'play')}</button>{' '}
              <button
                onClick={nextAyah}
                disabled={currentAyahIndex === ayahs.length - 1}
              >
                {t(lang, 'next')}
              </button>{' '}
              <button onClick={repeatAyah}>{t(lang, 'repeat')}</button>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <label>
                <input
                  type="checkbox"
                  checked={loopSingle}
                  onChange={(e) => setLoopSingle(e.target.checked)}
                />{' '}
                {t(lang, 'loopCurrent')}
              </label>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <label>{t(lang, 'range')}: </label>
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
                {t(lang, 'loopRange')}
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
