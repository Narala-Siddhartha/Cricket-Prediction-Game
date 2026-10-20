import React from 'react';
import { Check, Sparkles, X } from 'lucide-react';

export const AVATAR_PRESETS = [
  {
    id: 'cric-captain',
    name: 'The Captain',
    title: 'Tactical Leader',
    primaryColor: '#1d4ed8',
    secondaryColor: '#f59e0b',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#grad-captain)" />
        <path d="M18 36C18 28.268 24.268 22 32 22C39.732 22 46 28.268 46 36V44H18V36Z" fill="#1e3a8a" />
        <path d="M16 38H48C49.1046 38 50 38.8954 50 40C50 41.1046 49.1046 42 48 42H16C14.8954 42 14 41.1046 14 40C14 38.8954 14.8954 38 16 38Z" fill="#3b82f6" />
        <path d="M25 18L32 12L39 18L36 24H28L25 18Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        <circle cx="32" cy="18" r="2.5" fill="#ffffff" />
        <circle cx="28" cy="20" r="1.5" fill="#ffffff" />
        <circle cx="36" cy="20" r="1.5" fill="#ffffff" />
        <path d="M26 33C26 31 29 30 32 30C35 30 38 31 38 33" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id="grad-captain" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e40af" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'cric-blaster',
    name: 'Master Blaster',
    title: 'Destructive Opener',
    primaryColor: '#dc2626',
    secondaryColor: '#f97316',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#grad-blaster)" />
        <path d="M19 45L45 19L41 15L15 41L19 45Z" fill="#e2e8f0" stroke="#f97316" strokeWidth="1" />
        <path d="M45 45L19 19L23 15L49 41L45 45Z" fill="#e2e8f0" stroke="#f97316" strokeWidth="1" />
        <circle cx="32" cy="32" r="13" fill="#991b1b" />
        <path d="M22 32C22 26.4772 26.4772 22 32 22C37.5228 22 42 26.4772 42 32H22Z" fill="#dc2626" />
        <path d="M23 33H41M25 37H39M27 41H37M32 33V43" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="grad-blaster" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#b91c1c" />
            <stop offset="1" stopColor="#450a0a" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'cric-pacer',
    name: 'Pace Demon',
    title: '150+ km/h Bowler',
    primaryColor: '#0284c7',
    secondaryColor: '#38bdf8',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#grad-pacer)" />
        <path d="M34 10L18 34H32L26 54L48 26H34L40 10H34Z" fill="#38bdf8" />
        <path d="M34 13L22 33H33L29 48L44 28H34L37 13H34Z" fill="#ffffff" />
        <circle cx="44" cy="44" r="10" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
        <path d="M36 44C39 40 49 40 52 44" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 2" />
        <defs>
          <linearGradient id="grad-pacer" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0369a1" />
            <stop offset="1" stopColor="#082f49" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'cric-spinner',
    name: 'Spin Wizard',
    title: 'Mystery Turner',
    primaryColor: '#7c3aed',
    secondaryColor: '#c084fc',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#grad-spinner)" />
        <circle cx="32" cy="32" r="16" stroke="#a855f7" strokeWidth="2" strokeDasharray="6 4" />
        <circle cx="32" cy="32" r="22" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.6" />
        <circle cx="32" cy="32" r="10" fill="#dc2626" />
        <path d="M26 32C28 28 36 28 38 32C36 36 28 36 26 32Z" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M32 14L34 18L38 20L34 22L32 26L30 22L26 20L30 18L32 14Z" fill="#facc15" />
        <defs>
          <linearGradient id="grad-spinner" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6d28d9" />
            <stop offset="1" stopColor="#2e1065" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'cric-keeper',
    name: 'Safe Hands',
    title: 'Wicket-Keeper',
    primaryColor: '#d97706',
    secondaryColor: '#fde047',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#grad-keeper)" />
        <rect x="23" y="16" width="3" height="26" rx="1.5" fill="#fef08a" />
        <rect x="30.5" y="14" width="3" height="28" rx="1.5" fill="#fef08a" />
        <rect x="38" y="16" width="3" height="26" rx="1.5" fill="#fef08a" />
        <rect x="21" y="13" width="22" height="2.5" rx="1" fill="#fef08a" />
        <path d="M20 38C20 32 24 28 32 28C40 28 44 32 44 38C44 46 38 52 32 52C26 52 20 46 20 38Z" fill="#b45309" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="32" cy="38" r="5" fill="#dc2626" />
        <defs>
          <linearGradient id="grad-keeper" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#b45309" />
            <stop offset="1" stopColor="#451a03" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'cric-sixer',
    name: 'Sixer King',
    title: 'Maximums Hunter',
    primaryColor: '#ea580c',
    secondaryColor: '#f97316',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#grad-sixer)" />
        <path d="M12 48C18 24 38 18 52 14" stroke="#fed7aa" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
        <circle cx="48" cy="18" r="9" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M41 18C43 14 53 14 55 18" stroke="#ffffff" strokeWidth="1" strokeDasharray="1.5 1.5" />
        <path d="M40 24L36 30L44 26L40 34L46 26" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
        <circle cx="26" cy="38" r="12" fill="#c2410c" />
        <text x="26" y="44" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="16" fontFamily="sans-serif">6</text>
        <defs>
          <linearGradient id="grad-sixer" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c2410c" />
            <stop offset="1" stopColor="#431407" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'cric-wall',
    name: 'The Wall',
    title: 'Defensive Anchor',
    primaryColor: '#059669',
    secondaryColor: '#34d399',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#grad-wall)" />
        <path d="M32 14L46 20V34C46 43 40 49 32 52C24 49 18 43 18 34V20L32 14Z" fill="#047857" stroke="#6ee7b7" strokeWidth="2" />
        <rect x="30" y="22" width="4" height="22" rx="2" fill="#fef08a" />
        <rect x="29" y="40" width="6" height="4" rx="1" fill="#d97706" />
        <circle cx="32" cy="22" r="3" fill="#ffffff" />
        <defs>
          <linearGradient id="grad-wall" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#047857" />
            <stop offset="1" stopColor="#064e3b" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'cric-star',
    name: 'All-Rounder',
    title: 'Bat & Ball Ace',
    primaryColor: '#0d9488',
    secondaryColor: '#2dd4bf',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#grad-star)" />
        <polygon points="32,12 37,24 50,25 40,34 43,47 32,40 21,47 24,34 14,25 27,24" fill="#0f766e" stroke="#5eead4" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="7" fill="#dc2626" />
        <path d="M28 32C29 29 35 29 36 32" stroke="#ffffff" strokeWidth="1" />
        <defs>
          <linearGradient id="grad-star" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0f766e" />
            <stop offset="1" stopColor="#134e4a" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'cric-champ',
    name: 'Trophy Hunter',
    title: 'League Champion',
    primaryColor: '#eab308',
    secondaryColor: '#fde047',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#grad-champ)" />
        <path d="M22 18H42V28C42 34 38 38 32 38C26 38 22 34 22 28V18Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        <path d="M22 21H17C15.5 21 15 24 16 27C17 30 20 31 22 30" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
        <path d="M42 21H47C48.5 21 49 24 48 27C47 30 44 31 42 30" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
        <rect x="29" y="38" width="6" height="8" fill="#d97706" />
        <rect x="24" y="46" width="16" height="6" rx="2" fill="#b45309" />
        <polygon points="32,23 33.5,27 38,27.5 34.5,30.5 35.5,35 32,32.5 28.5,35 29.5,30.5 26,27.5 30.5,27" fill="#ffffff" />
        <defs>
          <linearGradient id="grad-champ" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a16207" />
            <stop offset="1" stopColor="#451a03" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'cric-yorker',
    name: 'Yorker Specialist',
    title: 'Toe Crusher',
    primaryColor: '#be123c',
    secondaryColor: '#f43f5e',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#grad-yorker)" />
        <path d="M22 18L18 36" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
        <path d="M32 14L32 38" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
        <path d="M42 18L46 36" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
        <path d="M24 12L38 10" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" transform="rotate(-15 31 11)" />
        <circle cx="32" cy="45" r="9" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M26 45C28 41 36 41 38 45" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 1.5" />
        <defs>
          <linearGradient id="grad-yorker" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9f1239" />
            <stop offset="1" stopColor="#4c0519" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'cric-dynamo',
    name: 'Power Striker',
    title: 'Strike Rate 200+',
    primaryColor: '#c026d3',
    secondaryColor: '#e879f9',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#grad-dynamo)" />
        <circle cx="32" cy="32" r="22" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="32" cy="32" r="16" stroke="#fbcfe8" strokeWidth="2" />
        <rect x="29" y="16" width="6" height="28" rx="3" fill="#fdf4ff" stroke="#d946ef" strokeWidth="1.5" />
        <path d="M26 36L38 36" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="22" r="2" fill="#ec4899" />
        <defs>
          <linearGradient id="grad-dynamo" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a21caf" />
            <stop offset="1" stopColor="#4a044e" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'cric-legend',
    name: 'Cricket Legend',
    title: 'Hall of Famer',
    primaryColor: '#334155',
    secondaryColor: '#94a3b8',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#grad-legend)" />
        <path d="M18 36C18 26 24 18 32 16C40 18 46 26 46 36" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
        <path d="M22 36L26 26L32 31L38 26L42 36H22Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="32" cy="42" r="4" fill="#fbbf24" />
        <circle cx="26" cy="42" r="3" fill="#cbd5e1" />
        <circle cx="38" cy="42" r="3" fill="#cbd5e1" />
        <defs>
          <linearGradient id="grad-legend" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e293b" />
            <stop offset="1" stopColor="#090d16" />
          </linearGradient>
        </defs>
      </svg>
    )
  }
];

export function getAvatarPreset(avatarId) {
  return AVATAR_PRESETS.find((p) => p.id === avatarId) || AVATAR_PRESETS[0];
}

export function UserAvatar({
  avatarId = 'cric-captain',
  size = 40,
  className = '',
  showBadge = false,
  badgeText = '',
  onClick = null
}) {
  const preset = getAvatarPreset(avatarId);

  return (
    <div
      className={`user-avatar-wrapper ${onClick ? 'clickable' : ''} ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
      title={preset.name}
    >
      <div className="avatar-graphic-container" style={{ width: size, height: size }}>
        {preset.svg}
      </div>
      {showBadge && badgeText && (
        <span className="user-avatar-badge">{badgeText}</span>
      )}
    </div>
  );
}

export function AvatarPickerModal({
  currentAvatar = 'cric-captain',
  onSelect,
  onClose,
  saving = false
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="avatar-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Sparkles size={20} className="sparkle-icon" />
            <div>
              <h3>Choose Your Cricket Avatar</h3>
              <p>Pick an avatar that reflects your playing style. Updates instantly!</p>
            </div>
          </div>
          <button className="icon-button close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="avatar-grid-scroller">
          {AVATAR_PRESETS.map((preset) => {
            const isSelected = preset.id === currentAvatar;
            return (
              <button
                key={preset.id}
                type="button"
                className={`avatar-option-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect(preset.id)}
                disabled={saving}
              >
                <div className="option-avatar-preview">
                  <UserAvatar avatarId={preset.id} size={56} />
                  {isSelected && (
                    <span className="selected-check-badge">
                      <Check size={14} />
                    </span>
                  )}
                </div>
                <div className="option-meta">
                  <strong className="option-name">{preset.name}</strong>
                  <span className="option-title">{preset.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="modal-footer">
          <span className="footer-tip">💡 No admin approval required for avatar changes.</span>
          <button className="secondary-button" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
