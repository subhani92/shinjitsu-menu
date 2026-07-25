import React from 'react';
import './ProfileBar.css';

const PROFILES = [
  { id: 'HALAL', label: 'Halal', icon: '☪' },
  { id: 'KOSHER', label: 'Kosher', icon: '✡' },
  { id: 'HINDU_VEG', label: 'Hindu Veg', icon: '🕉' },
  { id: 'HINDU_NONVEG', label: 'Hindu No Beef', icon: '🐄' },
  { id: 'JAIN', label: 'Jain', icon: '🙏' },
  { id: 'VEGAN', label: 'Vegan', icon: '🌱' },
  { id: 'EGG_ALLERGY', label: 'No Egg', icon: '🥚' },
  { id: 'DAIRY_ALLERGY', label: 'No Dairy', icon: '🥛' },
  { id: 'SHELLFISH_ALLERGY', label: 'No Shellfish', icon: '🦐' },
  { id: 'PEANUT_ALLERGY', label: 'No Peanut', icon: '🥜' },
  { id: 'GLUTEN_ALLERGY', label: 'No Gluten', icon: '🌾' },
];

export default function ProfileBar({ selectedProfiles, onToggle, compact }) {
  return (
    <div className={`profile-bar ${compact ? 'profile-bar--compact' : ''}`}>
      <div className="profile-bar__label">Dietary profiles</div>
      <div className="profile-bar__toggles">
        {PROFILES.map((profile) => {
          const isSelected = selectedProfiles.includes(profile.id);
          return (
            <button
              key={profile.id}
              className={`profile-bar__toggle ${isSelected ? 'profile-bar__toggle--active' : ''}`}
              onClick={() => onToggle(profile.id)}
              aria-pressed={isSelected}
              title={profile.label}
            >
              <span className="profile-bar__icon">{profile.icon}</span>
              {!compact && <span className="profile-bar__text">{profile.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}