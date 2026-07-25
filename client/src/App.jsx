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
            <p className="app__intro-hint">
              The scanner will analyze each dish and tell you if it's safe based on your selected restrictions.
            </p>
          </div>
        )}

        <CameraUpload
          onScanComplete={scanMenu}
          isLoading={loading}
        />

        {loading && (
          <div className="app__loading">
            <div className="loading-bar" />
            <p>Analyzing menu against {selectedProfiles.join(', ')} rules...</p>
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
                {processingTime && (
                  <span className="app__processing-time">{processingTime}ms</span>
                )}
                {scannedProfiles && (
                  <span className="app__profiles-used">
                    Profiles: {scannedProfiles.join(', ')}
                  </span>
                )}
              </div>
            </div>

            <div className="app__summary">
              <SummaryBadge
                label="Safe"
                count={dishes.filter((d) => d.verdict === 'SAFE').length}
                color="var(--color-safe)"
              />
              <SummaryBadge
                label="Unsafe"
                count={dishes.filter((d) => d.verdict === 'LIKELY_UNSAFE').length}
                color="var(--color-unsafe)"
              />
              <SummaryBadge
                label="Uncertain"
                count={dishes.filter((d) => d.verdict === 'UNCERTAIN').length}
                color="var(--color-uncertain)"
              />
            </div>

            <div className="app__dish-list">
              {dishes.map((dish, i) => (
                <DishCard key={i} dish={dish} />
              ))}
            </div>

            <div className="app__disclaimer">
              <p>⚠ This tool uses AI inference based on dish names. When in doubt, always ask the restaurant staff. For serious allergies, carry an allergy translation card.</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function SummaryBadge({ label, count, color }) {
  return (
    <div className="app__summary-badge" style={{ borderColor: color }}>
      <span className="app__summary-count" style={{ color }}>{count}</span>
      <span className="app__summary-label">{label}</span>
    </div>
  );
}