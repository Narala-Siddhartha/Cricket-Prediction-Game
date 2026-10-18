import React, { useState } from 'react';

/**
 * Registry of official teams, colors, short names, and aliases.
 * All avatar assets are stored locally in `/avatars/teams/<key>.svg`.
 */
export const TEAMS_REGISTRY = {
  // ================= IPL FRANCHISES =================
  csk: {
    key: 'csk',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    aliases: ['chennai super kings', 'csk', 'chennai', 'super kings'],
    primaryColor: '#FDB913',
    secondaryColor: '#005FA2',
    avatar: '/avatars/teams/csk.svg'
  },
  mi: {
    key: 'mi',
    name: 'Mumbai Indians',
    shortName: 'MI',
    aliases: ['mumbai indians', 'mi', 'mumbai'],
    primaryColor: '#004BA0',
    secondaryColor: '#D1AB3E',
    avatar: '/avatars/teams/mi.svg'
  },
  rcb: {
    key: 'rcb',
    name: 'Royal Challengers Bengaluru',
    shortName: 'RCB',
    aliases: ['royal challengers bengaluru', 'royal challengers bangalore', 'rcb', 'bangalore', 'bengaluru'],
    primaryColor: '#C41E3A',
    secondaryColor: '#C5A059',
    avatar: '/avatars/teams/rcb.svg'
  },
  kkr: {
    key: 'kkr',
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    aliases: ['kolkata knight riders', 'kkr', 'kolkata'],
    primaryColor: '#3A225D',
    secondaryColor: '#F2A900',
    avatar: '/avatars/teams/kkr.svg'
  },
  dc: {
    key: 'dc',
    name: 'Delhi Capitals',
    shortName: 'DC',
    aliases: ['delhi capitals', 'dc', 'delhi', 'delhi daredevils'],
    primaryColor: '#17449E',
    secondaryColor: '#E31837',
    avatar: '/avatars/teams/dc.svg'
  },
  rr: {
    key: 'rr',
    name: 'Rajasthan Royals',
    shortName: 'RR',
    aliases: ['rajasthan royals', 'rr', 'rajasthan'],
    primaryColor: '#EB198B',
    secondaryColor: '#0B2B60',
    avatar: '/avatars/teams/rr.svg'
  },
  srh: {
    key: 'srh',
    name: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    aliases: ['sunrisers hyderabad', 'srh', 'sunrisers', 'hyderabad'],
    primaryColor: '#FF5722',
    secondaryColor: '#111111',
    avatar: '/avatars/teams/srh.svg'
  },
  gt: {
    key: 'gt',
    name: 'Gujarat Titans',
    shortName: 'GT',
    aliases: ['gujarat titans', 'gt', 'gujarat', 'titans'],
    primaryColor: '#0B1B3D',
    secondaryColor: '#E0B865',
    avatar: '/avatars/teams/gt.svg'
  },
  lsg: {
    key: 'lsg',
    name: 'Lucknow Super Giants',
    shortName: 'LSG',
    aliases: ['lucknow super giants', 'lsg', 'lucknow', 'super giants'],
    primaryColor: '#0055A5',
    secondaryColor: '#FF6E14',
    avatar: '/avatars/teams/lsg.svg'
  },
  pbks: {
    key: 'pbks',
    name: 'Punjab Kings',
    shortName: 'PBKS',
    aliases: ['punjab kings', 'kings xi punjab', 'pbks', 'kxip', 'punjab'],
    primaryColor: '#DD1F2D',
    secondaryColor: '#D6A847',
    avatar: '/avatars/teams/pbks.svg'
  },

  // ================= INTERNATIONAL TEAMS =================
  ind: {
    key: 'ind',
    name: 'India',
    shortName: 'IND',
    aliases: ['india', 'ind', 'team india', 'bharat'],
    primaryColor: '#0C4898',
    secondaryColor: '#FF9933',
    avatar: '/avatars/teams/ind.svg'
  },
  aus: {
    key: 'aus',
    name: 'Australia',
    shortName: 'AUS',
    aliases: ['australia', 'aus', 'aussies'],
    primaryColor: '#005A36',
    secondaryColor: '#FFCD00',
    avatar: '/avatars/teams/aus.svg'
  },
  eng: {
    key: 'eng',
    name: 'England',
    shortName: 'ENG',
    aliases: ['england', 'eng'],
    primaryColor: '#0A2540',
    secondaryColor: '#CE1124',
    avatar: '/avatars/teams/eng.svg'
  },
  pak: {
    key: 'pak',
    name: 'Pakistan',
    shortName: 'PAK',
    aliases: ['pakistan', 'pak'],
    primaryColor: '#01411C',
    secondaryColor: '#FFFFFF',
    avatar: '/avatars/teams/pak.svg'
  },
  sa: {
    key: 'sa',
    name: 'South Africa',
    shortName: 'SA',
    aliases: ['south africa', 'sa', 'rsa', 'proteas'],
    primaryColor: '#007749',
    secondaryColor: '#FFB81C',
    avatar: '/avatars/teams/sa.svg'
  },
  nz: {
    key: 'nz',
    name: 'New Zealand',
    shortName: 'NZ',
    aliases: ['new zealand', 'nz', 'blackcaps', 'kiwis'],
    primaryColor: '#151515',
    secondaryColor: '#00A3E0',
    avatar: '/avatars/teams/nz.svg'
  },
  wi: {
    key: 'wi',
    name: 'West Indies',
    shortName: 'WI',
    aliases: ['west indies', 'wi', 'windies', 'caribbean'],
    primaryColor: '#7B1123',
    secondaryColor: '#F7D117',
    avatar: '/avatars/teams/wi.svg'
  },
  sl: {
    key: 'sl',
    name: 'Sri Lanka',
    shortName: 'SL',
    aliases: ['sri lanka', 'sl', 'lions'],
    primaryColor: '#0C2340',
    secondaryColor: '#FFB81C',
    avatar: '/avatars/teams/sl.svg'
  },
  ban: {
    key: 'ban',
    name: 'Bangladesh',
    shortName: 'BAN',
    aliases: ['bangladesh', 'ban', 'tigers'],
    primaryColor: '#006A4E',
    secondaryColor: '#F42A41',
    avatar: '/avatars/teams/ban.svg'
  },
  afg: {
    key: 'afg',
    name: 'Afghanistan',
    shortName: 'AFG',
    aliases: ['afghanistan', 'afg', 'afghan'],
    primaryColor: '#1C3F94',
    secondaryColor: '#D3202A',
    avatar: '/avatars/teams/afg.svg'
  },
  ire: {
    key: 'ire',
    name: 'Ireland',
    shortName: 'IRE',
    aliases: ['ireland', 'ire', 'irish'],
    primaryColor: '#009A44',
    secondaryColor: '#FF8200',
    avatar: '/avatars/teams/ire.svg'
  },
  zim: {
    key: 'zim',
    name: 'Zimbabwe',
    shortName: 'ZIM',
    aliases: ['zimbabwe', 'zim'],
    primaryColor: '#C8102E',
    secondaryColor: '#FFCD00',
    avatar: '/avatars/teams/zim.svg'
  },
  ned: {
    key: 'ned',
    name: 'Netherlands',
    shortName: 'NED',
    aliases: ['netherlands', 'ned', 'holland', 'dutch'],
    primaryColor: '#FF6600',
    secondaryColor: '#1D2A44',
    avatar: '/avatars/teams/ned.svg'
  },
  sco: {
    key: 'sco',
    name: 'Scotland',
    shortName: 'SCO',
    aliases: ['scotland', 'sco'],
    primaryColor: '#002456',
    secondaryColor: '#8A3B8B',
    avatar: '/avatars/teams/sco.svg'
  },
  usa: {
    key: 'usa',
    name: 'United States',
    shortName: 'USA',
    aliases: ['united states', 'usa', 'america', 'us'],
    primaryColor: '#0A3161',
    secondaryColor: '#B31942',
    avatar: '/avatars/teams/usa.svg'
  },
  nep: {
    key: 'nep',
    name: 'Nepal',
    shortName: 'NEP',
    aliases: ['nepal', 'nep'],
    primaryColor: '#DC143C',
    secondaryColor: '#003893',
    avatar: '/avatars/teams/nep.svg'
  },
  nam: {
    key: 'nam',
    name: 'Namibia',
    shortName: 'NAM',
    aliases: ['namibia', 'nam'],
    primaryColor: '#003580',
    secondaryColor: '#D21034',
    avatar: '/avatars/teams/nam.svg'
  },
  uae: {
    key: 'uae',
    name: 'United Arab Emirates',
    shortName: 'UAE',
    aliases: ['uae', 'emirates', 'united arab emirates'],
    primaryColor: '#00732F',
    secondaryColor: '#FF0000',
    avatar: '/avatars/teams/uae.svg'
  },
  can: {
    key: 'can',
    name: 'Canada',
    shortName: 'CAN',
    aliases: ['canada', 'can'],
    primaryColor: '#FF0000',
    secondaryColor: '#FFFFFF',
    avatar: '/avatars/teams/can.svg'
  },
  oma: {
    key: 'oma',
    name: 'Oman',
    shortName: 'OMA',
    aliases: ['oman', 'oma'],
    primaryColor: '#DB162F',
    secondaryColor: '#008000',
    avatar: '/avatars/teams/oma.svg'
  },

  // ================= DEFAULT PLACEHOLDER TEAMS =================
  team_a: {
    key: 'team_a',
    name: 'Team A',
    shortName: 'TMA',
    aliases: ['team a', 'tma', 'team-a', 'teama'],
    primaryColor: '#2563EB',
    secondaryColor: '#93C5FD',
    avatar: '/avatars/teams/team-a.svg'
  },
  team_b: {
    key: 'team_b',
    name: 'Team B',
    shortName: 'TMB',
    aliases: ['team b', 'tmb', 'team-b', 'teamb'],
    primaryColor: '#DC2626',
    secondaryColor: '#FCA5A5',
    avatar: '/avatars/teams/team-b.svg'
  }
};

/**
 * Intelligent resolver that normalizes team names, codes, and variations.
 */
export function getTeamConfig(teamName, shortName) {
  if (!teamName && !shortName) {
    return {
      key: 'default',
      name: 'Cricket Team',
      shortName: 'CRK',
      primaryColor: '#17201B',
      secondaryColor: '#15803D',
      avatar: '/avatars/teams/default.svg',
      isDefault: true
    };
  }

  const rawLower = (teamName || '').toLowerCase().trim();
  const rawShortLower = (shortName || '').toLowerCase().trim();

  // Explicit Team A / Team B check
  if (rawLower === 'team a' || rawShortLower === 'tma' || rawLower.includes('team a')) {
    return TEAMS_REGISTRY.team_a;
  }
  if (rawLower === 'team b' || rawShortLower === 'tmb' || rawLower.includes('team b')) {
    return TEAMS_REGISTRY.team_b;
  }

  const clean = (val) =>
    (val || '')
      .toLowerCase()
      .replace(/women|wmns|u19|u-19|men's|mens|\bteam\b/gi, '')
      .replace(/[^a-z0-9]/g, ' ')
      .trim();

  const queryName = clean(teamName);
  const queryShort = clean(shortName);

  // 1. Direct shortName / key lookup
  for (const team of Object.values(TEAMS_REGISTRY)) {
    if (queryShort && (team.shortName.toLowerCase() === queryShort || team.key === queryShort)) {
      return team;
    }
  }

  // 2. Exact alias match
  for (const team of Object.values(TEAMS_REGISTRY)) {
    if (team.aliases.some((alias) => clean(alias) === queryName)) {
      return team;
    }
  }

  // 3. Substring match
  for (const team of Object.values(TEAMS_REGISTRY)) {
    if (
      team.aliases.some((alias) => {
        const cAlias = clean(alias);
        return cAlias.length >= 3 && (queryName.includes(cAlias) || cAlias.includes(queryName));
      })
    ) {
      return team;
    }
  }

  // 4. Default fallback
  const displayShort = (shortName || teamName || 'CRK')
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 3)
    .toUpperCase() || 'CRK';

  return {
    key: 'default',
    name: teamName || 'Cricket Team',
    shortName: displayShort,
    primaryColor: '#17201B',
    secondaryColor: '#15803D',
    avatar: '/avatars/teams/default.svg',
    isDefault: true
  };
}

/**
 * TeamAvatar Component
 * 
 * Props:
 * - teamName: string
 * - shortName: string (optional)
 * - size: number in px (default 32)
 * - shape: 'circle' | 'rounded' (default 'circle')
 * - className: string
 */
export function TeamAvatar({
  teamName,
  shortName,
  size = 36,
  shape = 'circle',
  className = '',
  style = {}
}) {
  const team = getTeamConfig(teamName, shortName);
  const [imgError, setImgError] = useState(false);
  const borderRadius = shape === 'circle' ? '50%' : '8px';

  const isIPL = ['csk', 'mi', 'rcb', 'kkr', 'dc', 'rr', 'srh', 'gt', 'lsg', 'pbks'].includes(team.key);

  return (
    <div
      className={`team-avatar-container ${className}`}
      title={team.name}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: isIPL ? '#ffffff' : 'transparent',
        border: isIPL ? '1px solid rgba(0,0,0,0.08)' : 'none',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        flexShrink: 0,
        ...style
      }}
    >
      <img
        src={imgError ? '/avatars/teams/default.svg' : team.avatar}
        alt={team.name}
        onError={() => setImgError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          padding: isIPL ? '3px' : '0px',
          borderRadius,
          display: 'block'
        }}
        loading="lazy"
      />
    </div>
  );
}

/**
 * TeamMatchup Component
 * Renders a stylized face-off with both team avatars and an authentic "VS" badge.
 */
export function TeamMatchup({ teams = [], size = 34, className = '' }) {
  const teamA = teams[0] || { name: 'Team A', shortName: 'TMA' };
  const teamB = teams[1] || { name: 'Team B', shortName: 'TMB' };

  return (
    <div className={`team-matchup-row ${className}`}>
      <div className="matchup-team-pill">
        <TeamAvatar teamName={teamA.name} shortName={teamA.shortName} size={size} />
        <span className="matchup-team-title">{teamA.shortName || teamA.name}</span>
      </div>

      <span className="matchup-vs-tag">VS</span>

      <div className="matchup-team-pill">
        <TeamAvatar teamName={teamB.name} shortName={teamB.shortName} size={size} />
        <span className="matchup-team-title">{teamB.shortName || teamB.name}</span>
      </div>
    </div>
  );
}

export default TeamAvatar;
