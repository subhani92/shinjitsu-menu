import React, { useState, useCallback, useEffect } from 'react';
import ProfileBar from './components/ProfileBar';
import CameraUpload from './components/CameraUpload';
import DishCard from './components/DishCard';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [selectedProfiles, setSelectedProfiles] = useState(['HALAL']);
  const [dishes, setDishes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [processingTime, setProcessingTime] = useState(null);
  const [scannedProfiles, setScannedProfiles] = useState(null);
  const [scanStep, setScanStep] = useState('');

  const toggleProfile = useCallback((profileId) => {
    setSelectedProfiles((prev) => {
      if (prev.includes(profileId)) {
        return prev.length > 1 ? prev.filter((p) => p !== profileId) : prev;
      }
      return [...prev, profileId];
    });
  }, []);

  const scanMenu = useCallback(async (imageInfo) => {
    if (selectedProfiles.length === 0) {
      setError('Select at least one dietary profile');
      return;
    }

    setLoading(true);
    setError(null);
    setImageData(imageInfo);
    setProcessingTime(null);

    const steps = ['Extracting Kanji & Hiragana dish names...', 'Inferring hidden ingredients (dashi, mirin, lard)...', 'Cross-checking against ' + selectedProfiles.join(', ') + ' rules...'];
    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, steps.length - 1);
      setScanStep(steps[stepIdx]);
    }, 2000);

    try {
      const response = await fetch(`${API_BASE}/api/scan-menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageInfo.preview,
          profiles: selectedProfiles,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      setDishes(data.dishes);
      setScannedProfiles(data.profiles);
      setProcessingTime(data.processingTimeMs);
    } catch (err) {
      setError(err.message || 'Failed to scan menu. Please try again.');
      console.error('Scan error:', err);
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  }, [selectedProfiles]);

  useEffect(() => {
    if (imageData && dishes && scannedProfiles && selectedProfiles.length > 0) {
      const profilesChanged = JSON.stringify(selectedProfiles.sort()) !== JSON.stringify(scannedProfiles.sort());
      if (profilesChanged) {
        scanMenu(imageData);
      }
    }
  }, [selectedProfiles]);

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__logo">
          <span className="app__logo-icon">🍱</span>
          <div>
            <h1 className="app__title">Shinjitsu Menu</h1>
            <p className="app__subtitle">Menu safety scanner for Japan</p>
          </div>
        </div>
      </header>

      <div className="app__sticky-bar">
        <ProfileBar
          selectedProfiles={selectedProfiles}
          onToggle={toggleProfile}
          compact={!!dishes}
        />
      </div>

      <main className="app__main">
        {!dishes && !loading && (
          <div className="app__intro">
            <p>Select your dietary profiles above, then photograph a Japanese restaurant menu below.</p>
            <p className="app__intro-hint">The scanner will analyze each dish and tell you if it's safe.</p>
          </div>
        )}

        <CameraUpload onScanComplete={scanMenu} isLoading={loading} />

        {loading && (
          <div className="app__loading">
            <div className="app__loading-spinner" />
            <h3>Scanning Japanese Menu...</h3>
            <p className="app__loading-step">{scanStep || 'Extracting Kanji & Hiragana dish names...'}</p>
            <p className="app__loading-hint">
              Inferring hidden dashi, mirin, pork lard, and soy sauce brewing agents using Japanese culinary knowledge.
            </p>
          </div>
        )}

        {error && (
          <div className="app__error">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {dishes && dishes.length > 0 && (
          <section className="app__results">
            <div className="app__results-header">
              <h2>Results</h2>
              <div className="app__results-meta">
                {processingTime && <span>{processingTime}ms</span>}
                {scannedProfiles && <span>Profiles: {scannedProfiles.join(', ')}</span>}
              </div>
            </div>

            <div className="app__summary">
              <div className="app__summary-badge app__summary-badge--safe">
                <span className="app__summary-count" style={{ color: 'var(--color-safe)' }}>{dishes.filter((d) => d.verdict === 'SAFE').length}</span>
                <span className="app__summary-label">Safe</span>
              </div>
              <div className="app__summary-badge app__summary-badge--unsafe">
                <span className="app__summary-count" style={{ color: 'var(--color-unsafe)' }}>{dishes.filter((d) => d.verdict === 'LIKELY_UNSAFE').length}</span>
                <span className="app__summary-label">Unsafe</span>
              </div>
              <div className="app__summary-badge app__summary-badge--uncertain">
                <span className="app__summary-count" style={{ color: 'var(--color-uncertain)' }}>{dishes.filter((d) => d.verdict === 'UNCERTAIN').length}</span>
                <span className="app__summary-label">Uncertain</span>
              </div>
            </div>

            <div className="app__dish-list">
              {dishes.map((dish, i) => (
                <DishCard key={i} dish={dish} selectedProfiles={selectedProfiles} />
              ))}
            </div>

            <div className="app__disclaimer">
              <p>This tool uses AI inference based on dish names. When in doubt, always ask the restaurant staff. For serious allergies, carry an allergy translation card.</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}