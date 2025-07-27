import { useState } from 'react';
import QuranPlayer from './components/QuranPlayer';

export default function App() {
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

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
      <QuranPlayer />
    </div>
  );
}
