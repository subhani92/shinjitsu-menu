import React, { useState } from 'react';
import { Volume2, Copy, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import './DishCard.css';

const VERDICT_CONFIG = {
  SAFE: { label: 'Safe to Eat', className: 'dish-card--safe', icon: '✓', dotColor: 'var(--color-safe)' },
  LIKELY_UNSAFE: { label: 'Likely Unsafe', className: 'dish-card--unsafe', icon: '✗', dotColor: 'var(--color-unsafe)' },
  UNCERTAIN: { label: 'Uncertain', className: 'dish-card--uncertain', icon: '?', dotColor: 'var(--color-uncertain)' },
};

const COMMON_QUESTIONS = [
  { label: 'Check Pork / Mirin', ja: 'すみません、豚肉やみりんは入っていますか？', ro: 'Sumimasen, butaniku ya mirin wa hairatte imasu ka?', en: 'Does this contain pork or mirin?' },
  { label: 'Check Bonito Dashi', ja: 'すみません、かつお出汁や魚の出汁は使われていますか？', ro: 'Sumimasen, katsuo dashi ya sakana no dashi wa tsukawarete imasu ka?', en: 'Is bonito or fish stock used?' },
  { label: 'No Onion / Garlic', ja: '玉ねぎやニンニクは抜きにできますか？', ro: 'Tamanegi ya ninniku wa nuki ni dekimasu ka?', en: 'Can you remove onions/garlic?' },
  { label: 'Check Beef / Beef Fat', ja: '牛肉や牛脂は入っていますか？', ro: 'Gyuuniku ya gyuushi wa hairatte imasu ka?', en: 'Does this contain beef or beef fat?' },
  { label: 'Check Alcohol in Sauce', ja: 'つゆにお酒は使われていますか？', ro: 'Tsuyu ni osake wa tsukawarete imasu ka?', en: 'Is alcohol used in the sauce?' },
  { label: 'Check Gelatin', ja: 'ゼラチンは使われていますか？', ro: 'Zerachin wa tsukawarete imasu ka?', en: 'Is gelatin used?' },
];

const TEST_PROFILES = [
  { id: 'HALAL', label: 'Halal', color: 'var(--color-safe)' },
  { id: 'KOSHER', label: 'Kosher', color: '#3b82f6' },
  { id: 'JAIN', label: 'Jain', color: 'var(--color-uncertain)' },
  { id: 'VEGAN', label: 'Vegan', color: '#16a34a' },
  { id: 'HINDU_NONVEG', label: 'No Beef', color: 'var(--color-unsafe)' },
  { id: 'GLUTEN_ALLERGY', label: 'No Gluten', color: '#9333ea' },
];

function StaffCardModal({ isOpen, onClose, dish, question, romaji, english }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customText, setCustomText] = useState(null);
  const [customRo, setCustomRo] = useState('');
  const [customEn, setCustomEn] = useState('');

  if (!isOpen) return null;

  const displayJa = customText || question || 'すみません、この料理に豚肉やアルコール、魚の出汁は入っていますか？';
  const displayRo = customRo || romaji || '';
  const displayEn = customEn || english || '';

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(displayJa);
    u.lang = 'ja-JP'; u.rate = 0.85;
    u.onstart = () => setIsPlaying(true);
    u.onend = () => setIsPlaying(false);
    u.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(u);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(displayJa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCustomText(null); setCustomRo(''); setCustomEn('');
    onClose();
  };

  return (
    <div className="staff-modal-overlay" onClick={handleClose}>
      <div className="staff-modal" onClick={(e) => e.stopPropagation()}>
        <div className="staff-modal__header">
          <div className="staff-modal__header-left">
            <span className="staff-modal__jp-badge">JP</span>
            <div>
              <h2 className="staff-modal__title">Show Staff in Japan</h2>
              <p className="staff-modal__subtitle">Hold phone up or tap audio to speak</p>
            </div>
          </div>
          <button className="staff-modal__close" onClick={handleClose}><X className="w-5 h-5" /></button>
        </div>

        {dish && (
          <div className="staff-modal__dish-ref">
            <span className="staff-modal__dish-label">Inquiry for Dish:</span>
            <span className="staff-modal__dish-name">{dish.dishRomaji || dish.dish} ({dish.dish})</span>
          </div>
        )}

        <div className="staff-modal__card">
          <div className="staff-modal__card-top">
            <span className="staff-modal__card-label">日本語 (Question for Waiter)</span>
            <p className="staff-modal__card-question">{displayJa}</p>
          </div>
          <div className="staff-modal__card-bottom">
            <div className="staff-modal__romaji"><strong>Romaji:</strong> {displayRo}</div>
            <div className="staff-modal__english"><strong>English:</strong> {displayEn}</div>
          </div>
        </div>

        <div className="staff-modal__actions">
          <button className={`staff-modal__speak-btn ${isPlaying ? 'staff-modal__speak-btn--playing' : ''}`} onClick={handleSpeak}>
            <Volume2 className={`w-5 h-5 ${isPlaying ? 'staff-modal__bounce' : ''}`} />
            <span>{isPlaying ? 'Speaking...' : '🔊 Read Out Loud'}</span>
          </button>
          <button className="staff-modal__copy-btn" onClick={handleCopy}>
            {copied ? <Check className="w-5 h-5 staff-modal__copy-check" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        <div className="staff-modal__common">
          <span className="staff-modal__common-label">Quick Questions:</span>
          <div className="staff-modal__common-grid">
            {COMMON_QUESTIONS.map((q, idx) => (
              <button key={idx} className={`staff-modal__common-btn ${customText === q.ja ? 'staff-modal__common-btn--active' : ''}`} onClick={() => { setCustomText(q.ja); setCustomRo(q.ro); setCustomEn(q.en); }}>
                <div className="staff-modal__common-label-text">{q.label}</div>
                <div className="staff-modal__common-ja">{q.ja}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DishCard({ dish, selectedProfiles }) {
  const config = VERDICT_CONFIG[dish.verdict] || VERDICT_CONFIG.UNCERTAIN;
  const [showStaffCard, setShowStaffCard] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const questionData = dish.questionForStaff;
  const questionJa = typeof questionData === 'string' ? questionData : (questionData?.japanese || '');
  const questionRo = typeof questionData === 'object' ? questionData.romaji : '';
  const questionEn = typeof questionData === 'object' ? questionData.english : '';

  const inferredIngredients = dish.inferredIngredients || [];
  const hiddenIngredients = dish.hiddenIngredients || [];

  return (
    <>
      <div className={`dish-card ${config.className}`}>
        <div className="dish-card__header">
          <div className="dish-card__name">
            <span className="dish-card__jp">{dish.dish}</span>
            {dish.dishRomaji && dish.dishRomaji !== dish.dish && (
              <span className="dish-card__romaji">{dish.dishRomaji}</span>
            )}
          </div>
          <span className={`dish-card__badge ${config.className.replace('dish-card--', '')}`} style={{ borderColor: config.dotColor }}>
            <span className="dish-card__dot" style={{ backgroundColor: config.dotColor }} />
            {config.icon} {config.label}
          </span>
        </div>

        <div className="dish-card__reasoning">
          <span className="dish-card__reasoning-label">Dietary Reasoning:</span>
          <p className="dish-card__reason">{dish.reason}</p>
        </div>

        {hiddenIngredients.length > 0 && (
          <div className="dish-card__hidden">
            <span className="dish-card__hidden-label">⚠ Flagged:</span>
            <div className="dish-card__hidden-pills">
              {hiddenIngredients.map((h, i) => <span key={i} className="dish-card__hidden-pill">{h}</span>)}
            </div>
          </div>
        )}

        <div className="dish-card__meta">
          {dish.confidence && <span className="dish-card__confidence">Confidence: {dish.confidence}</span>}
          {dish.profilesAffected?.length > 0 && <span className="dish-card__profiles">Affects: {dish.profilesAffected.join(', ')}</span>}
        </div>

        <div className="dish-card__test-profiles">
          <span className="dish-card__test-label">Test Profile:</span>
          <div className="dish-card__test-pills">
            {TEST_PROFILES.map((p) => (
              <span key={p.id} className="dish-card__test-pill" style={{ borderColor: p.color, color: p.color }}>{p.label}</span>
            ))}
          </div>
        </div>

        <div className="dish-card__actions">
          <button className="dish-card__staff-btn" onClick={() => setShowStaffCard(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            Ask Japanese Staff
          </button>
          <button className="dish-card__ingredients-btn" onClick={() => setIsExpanded(!isExpanded)}>
            <span>Ingredients ({inferredIngredients.length})</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {isExpanded && (
          <div className="dish-card__expanded">
            {inferredIngredients.length > 0 && (
              <div className="dish-card__ingredient-section">
                <h4 className="dish-card__section-label">Inferred Ingredients:</h4>
                <div className="dish-card__ingredient-pills">
                  {inferredIngredients.map((ing, idx) => (
                    <span key={idx} className="dish-card__ingredient-pill">{ing}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <StaffCardModal
        isOpen={showStaffCard}
        onClose={() => setShowStaffCard(false)}
        dish={dish}
        question={questionJa}
        romaji={questionRo}
        english={questionEn}
      />
    </>
  );
}