import axios from 'axios';

function getMockMatches() {
  const now = Date.now();
  return [
    {
      id: 'mock-ind-aus-1',
      name: 'India vs Australia, 1st T20I',
      matchType: 't20',
      status: 'Match not started',
      venue: 'Wankhede Stadium, Mumbai',
      dateTimeGMT: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
      teams: ['India', 'Australia'],
      teamInfo: [{ name: 'India', shortname: 'IND' }, { name: 'Australia', shortname: 'AUS' }]
    },
    {
      id: 'mock-ind-eng-1',
      name: 'India vs England, 2nd ODI',
      matchType: 'odi',
      status: 'Match not started',
      venue: "Lord's, London",
      dateTimeGMT: new Date(now + 48 * 60 * 60 * 1000).toISOString(),
      teams: ['India', 'England'],
      teamInfo: [{ name: 'India', shortname: 'IND' }, { name: 'England', shortname: 'ENG' }]
    },
    {
      id: 'mock-ind-pak-1',
      name: 'India vs Pakistan, Super 4, T20',
      matchType: 't20',
      status: 'Match not started',
      venue: 'Melbourne Cricket Ground, Melbourne',
      dateTimeGMT: new Date(now + 72 * 60 * 60 * 1000).toISOString(),
      teams: ['India', 'Pakistan'],
      teamInfo: [{ name: 'India', shortname: 'IND' }, { name: 'Pakistan', shortname: 'PAK' }]
    },
    {
      id: 'mock-eng-sa-1',
      name: 'England vs South Africa, ODI Series',
      matchType: 'odi',
      status: 'Match not started',
      venue: 'The Oval, London',
      dateTimeGMT: new Date(now + 36 * 60 * 60 * 1000).toISOString(),
      teams: ['England', 'South Africa'],
      teamInfo: [{ name: 'England', shortname: 'ENG' }, { name: 'South Africa', shortname: 'SA' }]
    },
    {
      id: 'mock-ipl-csk-mi-1',
      name: 'Chennai Super Kings vs Mumbai Indians, IPL',
      matchType: 't20',
      status: 'Match not started',
      venue: 'M. A. Chidambaram Stadium, Chennai',
      dateTimeGMT: new Date(now + 30 * 60 * 60 * 1000).toISOString(),
      teams: ['Chennai Super Kings', 'Mumbai Indians'],
      teamInfo: [{ name: 'Chennai Super Kings', shortname: 'CSK' }, { name: 'Mumbai Indians', shortname: 'MI' }]
    },
    {
      id: 'mock-ipl-rcb-kkr-1',
      name: 'Royal Challengers Bengaluru vs Kolkata Knight Riders, IPL',
      matchType: 't20',
      status: 'Match not started',
      venue: 'M. Chinnaswamy Stadium, Bengaluru',
      dateTimeGMT: new Date(now + 54 * 60 * 60 * 1000).toISOString(),
      teams: ['Royal Challengers Bengaluru', 'Kolkata Knight Riders'],
      teamInfo: [{ name: 'Royal Challengers Bengaluru', shortname: 'RCB' }, { name: 'Kolkata Knight Riders', shortname: 'KKR' }]
    },
    {
      id: 'mock-ipl-gt-rr-1',
      name: 'Gujarat Titans vs Rajasthan Royals, IPL',
      matchType: 't20',
      status: 'Match not started',
      venue: 'Narendra Modi Stadium, Ahmedabad',
      dateTimeGMT: new Date(now + 66 * 60 * 60 * 1000).toISOString(),
      teams: ['Gujarat Titans', 'Rajasthan Royals'],
      teamInfo: [{ name: 'Gujarat Titans', shortname: 'GT' }, { name: 'Rajasthan Royals', shortname: 'RR' }]
    },
    {
      id: 'mock-aus-sa-1',
      name: 'Australia vs South Africa, 1st Test',
      matchType: 'test',
      status: 'Match not started',
      venue: 'Sydney Cricket Ground, Sydney',
      dateTimeGMT: new Date(now + 96 * 60 * 60 * 1000).toISOString(),
      teams: ['Australia', 'South Africa'],
      teamInfo: [{ name: 'Australia', shortname: 'AUS' }, { name: 'South Africa', shortname: 'SA' }]
    },
    {
      id: 'mock-nz-wi-1',
      name: 'New Zealand vs West Indies, 1st T20I',
      matchType: 't20',
      status: 'Match not started',
      venue: 'Eden Park, Auckland',
      dateTimeGMT: new Date(now + 40 * 60 * 60 * 1000).toISOString(),
      teams: ['New Zealand', 'West Indies'],
      teamInfo: [{ name: 'New Zealand', shortname: 'NZ' }, { name: 'West Indies', shortname: 'WI' }]
    }
  ];
}

// In-memory cache for API calls to preserve daily quota and speed up search
const memoryCache = new Map();

function getFromCache(key) {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
}

function setToCache(key, value, ttlMs) {
  memoryCache.set(key, {
    value,
    expiresAt: ttlMs ? Date.now() + ttlMs : null
  });
}

function apiClient() {
  return axios.create({
    baseURL: process.env.CRICKET_API_BASE_URL || 'https://api.cricapi.com/v1',
    timeout: 10000
  });
}

function hasApiKey() {
  const key = process.env.CRICKET_API_KEY;
  return Boolean(key && key.trim().length > 5 && key !== 'your_api_key_here');
}

async function safeApiCall(endpoint, params = {}, ttlMs = 5 * 60 * 1000) {
  if (!hasApiKey()) return null;

  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiClient().get(endpoint, {
      params: { apikey: process.env.CRICKET_API_KEY, ...params }
    });

    if (response.data?.status === 'failure') {
      console.warn(`[CricAPI Warning] Endpoint ${endpoint} returned failure:`, response.data.reason || response.data);
      return null;
    }

    const data = response.data;
    if (data) {
      setToCache(cacheKey, data, ttlMs);
    }
    return data;
  } catch (error) {
    console.warn(`[CricAPI Network Warning] Endpoint ${endpoint} failed:`, error.message);
    return null;
  }
}

// Map team/franchise aliases to league/tournament search terms
const LEAGUE_TEAM_MAP = {
  csk: ['IPL', 'Indian Premier League'],
  'chennai super kings': ['IPL', 'Indian Premier League'],
  chennai: ['IPL', 'Indian Premier League'],
  mi: ['IPL', 'Indian Premier League', 'Mumbai'],
  'mumbai indians': ['IPL', 'Indian Premier League', 'Mumbai'],
  mumbai: ['IPL', 'Indian Premier League', 'Mumbai'],
  rcb: ['IPL', 'Indian Premier League'],
  'royal challengers': ['IPL', 'Indian Premier League'],
  'royal challengers bangalore': ['IPL', 'Indian Premier League'],
  'royal challengers bengaluru': ['IPL', 'Indian Premier League'],
  bangalore: ['IPL', 'Indian Premier League'],
  bengaluru: ['IPL', 'Indian Premier League'],
  kkr: ['IPL', 'Indian Premier League'],
  'kolkata knight riders': ['IPL', 'Indian Premier League'],
  kolkata: ['IPL', 'Indian Premier League'],
  dc: ['IPL', 'Indian Premier League'],
  'delhi capitals': ['IPL', 'Indian Premier League'],
  delhi: ['IPL', 'Indian Premier League'],
  srh: ['IPL', 'Indian Premier League'],
  'sunrisers hyderabad': ['IPL', 'Indian Premier League'],
  hyderabad: ['IPL', 'Indian Premier League'],
  rr: ['IPL', 'Indian Premier League'],
  'rajasthan royals': ['IPL', 'Indian Premier League'],
  rajasthan: ['IPL', 'Indian Premier League'],
  gt: ['IPL', 'Indian Premier League'],
  'gujarat titans': ['IPL', 'Indian Premier League'],
  gujarat: ['IPL', 'Indian Premier League'],
  lsg: ['IPL', 'Indian Premier League'],
  'lucknow super giants': ['IPL', 'Indian Premier League'],
  lucknow: ['IPL', 'Indian Premier League'],
  pbks: ['IPL', 'Indian Premier League'],
  'punjab kings': ['IPL', 'Indian Premier League'],
  punjab: ['IPL', 'Indian Premier League'],
  bbl: ['Big Bash League'],
  psl: ['Pakistan Super League'],
  cpl: ['Caribbean Premier League'],
  sa20: ['SA20'],
  mlc: ['Major League Cricket'],
  hundred: ['The Hundred']
};

export function normalizeMatch(raw) {
  const teamNames = raw.teams?.length ? raw.teams : raw.teamInfo?.map((team) => team.name).filter(Boolean) || [];
  const teams = teamNames.slice(0, 2).map((name) => {
    const info = raw.teamInfo?.find((team) => team.name === name);
    return { name, shortName: info?.shortname || info?.shortName || name.slice(0, 3).toUpperCase() };
  });

  const parsedDate = raw.dateTimeGMT ? new Date(raw.dateTimeGMT) : (raw.date ? new Date(raw.date) : new Date());

  return {
    apiMatchId: raw.id,
    name: raw.name || `${teams[0]?.name || 'Team A'} vs ${teams[1]?.name || 'Team B'}`,
    matchType: raw.matchType || 'cricket',
    venue: raw.venue || 'Venue TBA',
    dateTimeGMT: Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
    teams,
    apiStatus: raw.status || 'Scheduled',
    raw
  };
}

function isValidMatch(match) {
  if (!match.apiMatchId) return false;
  if (!match.teams || match.teams.length < 2) return false;
  const t1 = (match.teams[0].name || '').trim().toLowerCase();
  const t2 = (match.teams[1].name || '').trim().toLowerCase();
  if (t1 === 'tbc' && t2 === 'tbc') return false;
  if (!t1 || !t2) return false;
  return true;
}

function isCompleted(match) {
  const status = match.apiStatus || '';
  const raw = match.raw || {};
  return Boolean(
    raw.matchEnded ||
    /won|draw|tie|no result|abandoned|cancel/i.test(status) ||
    (raw.matchWinner && raw.matchWinner !== 'No Winner')
  );
}

function matchMatchesQuery(match, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const teamNames = (match.teams || []).map((t) => (typeof t === 'string' ? t : t.name || '')).filter(Boolean);
  const teamShortNames = (match.teams || []).map((t) => (typeof t === 'string' ? '' : t.shortName || '')).filter(Boolean);

  // Exact or word boundary match for short acronyms like MI, CSK, RCB, IND, AUS
  if (q.length <= 3) {
    const isShortMatch = teamShortNames.some((sn) => sn.toLowerCase() === q);
    if (isShortMatch) return true;

    const regex = new RegExp(`\\b${escapeRegExp(q)}\\b`, 'i');
    if (regex.test(match.name || '') || teamNames.some((name) => regex.test(name))) {
      return true;
    }
  }

  // General text search
  const searchable = [
    match.name,
    match.matchType,
    match.venue,
    match.apiStatus,
    ...teamNames,
    ...teamShortNames
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (searchable.includes(q)) {
    return true;
  }

  // Check alias terms
  const aliases = LEAGUE_TEAM_MAP[q] || [];
  return aliases.some((alias) => searchable.includes(alias.toLowerCase()));
}

export async function fetchCurrentMatches() {
  const currentRes = await safeApiCall('/currentMatches', { offset: 0 }, 3 * 60 * 1000);
  const rawList = currentRes?.data || [];

  const normalized = rawList.map(normalizeMatch).filter(isValidMatch);
  if (!normalized.length) {
    return getMockMatches().map(normalizeMatch);
  }

  return normalized;
}

async function fetchMatchesForQuery(query) {
  const searchTerms = [query];
  if (LEAGUE_TEAM_MAP[query]) {
    for (const term of LEAGUE_TEAM_MAP[query]) {
      const lower = term.toLowerCase();
      if (!searchTerms.includes(lower)) {
        searchTerms.push(lower);
      }
    }
  }

  // 1. Check current matches (live/recent)
  const currentMatches = await fetchCurrentMatches();

  // 2. Search series matching query and aliases
  const seriesCandidates = [];
  for (const term of searchTerms) {
    const sRes = await safeApiCall('/series', { offset: 0, search: term }, 30 * 60 * 1000);
    const list = sRes?.data || [];
    seriesCandidates.push(...list);
  }

  // Deduplicate and filter series with matches > 0
  const seriesMap = new Map();
  for (const s of seriesCandidates) {
    if (s.matches > 0 && !seriesMap.has(s.id)) {
      seriesMap.set(s.id, s);
    }
  }

  // Prioritize active & upcoming series (sort by startDate descending)
  const sortedSeries = [...seriesMap.values()]
    .sort((a, b) => {
      const timeA = new Date(a.startDate || '1970').getTime();
      const timeB = new Date(b.startDate || '1970').getTime();
      return timeB - timeA;
    })
    .slice(0, 3); // Take top 3 relevant series to conserve quota

  // 3. Fetch series_info for each candidate series
  const seriesMatches = [];
  for (const s of sortedSeries) {
    const infoRes = await safeApiCall('/series_info', { id: s.id }, 30 * 60 * 1000);
    const list = infoRes?.data?.matchList || [];
    seriesMatches.push(...list.map(normalizeMatch));
  }

  // 4. Merge and deduplicate by apiMatchId
  const allMatches = [...currentMatches, ...seriesMatches];
  const uniqueMatches = new Map();
  for (const match of allMatches) {
    if (match.apiMatchId && !uniqueMatches.has(match.apiMatchId) && isValidMatch(match)) {
      uniqueMatches.set(match.apiMatchId, match);
    }
  }

  // 5. Filter for matches that match query or aliases
  const matched = [...uniqueMatches.values()].filter((match) => matchMatchesQuery(match, query));
  return matched;
}

export async function searchCurrentAndUpcomingMatches(searchText) {
  const query = (searchText || '').trim().toLowerCase();

  // If query is empty, return current matches or mock matches
  if (!query) {
    const current = await fetchCurrentMatches();
    if (current.length) return current;
    return getMockMatches().map(normalizeMatch);
  }

  const cacheKey = `search:${query}`;
  const cachedResults = getFromCache(cacheKey);
  if (cachedResults) {
    return cachedResults;
  }

  let matches = [];

  if (hasApiKey()) {
    try {
      matches = await fetchMatchesForQuery(query);
    } catch (err) {
      console.warn('[CricAPI search error]', err.message);
    }
  }

  // If external API has no results, quota is exhausted, or error occurred:
  // Fall back to matching mock matches so the game is always fully playable!
  if (!matches.length) {
    const mockNormalized = getMockMatches().map(normalizeMatch);
    matches = mockNormalized.filter((m) => matchMatchesQuery(m, query));
  }

  // Sort matches: upcoming & live matches first (soonest first), then completed matches
  matches.sort((a, b) => {
    const aCompleted = isCompleted(a);
    const bCompleted = isCompleted(b);
    if (!aCompleted && bCompleted) return -1;
    if (aCompleted && !bCompleted) return 1;

    const timeA = new Date(a.dateTimeGMT).getTime() || 0;
    const timeB = new Date(b.dateTimeGMT).getTime() || 0;
    return timeA - timeB;
  });

  // Cache results for 5 minutes
  if (matches.length) {
    setToCache(cacheKey, matches, 5 * 60 * 1000);
  }

  return matches;
}

export async function fetchMatchInfo(apiMatchId) {
  if (!apiMatchId) return null;

  if (apiMatchId.startsWith('mock-')) {
    const mock = getMockMatches().find((match) => match.id === apiMatchId);
    return mock ? normalizeMatch(mock) : null;
  }

  const cacheKey = `match_info:${apiMatchId}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const response = await safeApiCall('/match_info', { id: apiMatchId }, 2 * 60 * 1000);
  const raw = response?.data;
  if (raw) {
    const normalized = normalizeMatch(raw);
    if (isCompleted(normalized)) {
      setToCache(cacheKey, normalized, 24 * 60 * 60 * 1000); // 24 hours for completed matches
    } else {
      setToCache(cacheKey, normalized, 2 * 60 * 1000);
    }
    return normalized;
  }

  const mock = getMockMatches().find((m) => m.id === apiMatchId);
  return mock ? normalizeMatch(mock) : null;
}

export function extractWinner(matchInfo) {
  const status = matchInfo?.apiStatus || '';
  const teamNames = matchInfo?.teams?.map((team) => team.name) || [];
  const raw = matchInfo?.raw || {};

  // Check CricAPI direct matchWinner field first
  const rawWinner = raw.matchWinner;
  let winner = null;
  if (rawWinner && rawWinner !== 'No Winner') {
    winner = teamNames.find(
      (name) => name.toLowerCase() === rawWinner.toLowerCase() ||
        rawWinner.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(rawWinner.toLowerCase())
    );
  }

  // Fallback: check regex on status string
  if (!winner) {
    winner = teamNames.find((teamName) => new RegExp(`\\b${escapeRegExp(teamName)}\\b`, 'i').test(status)) || null;
  }

  const completed = Boolean(
    raw.matchEnded ||
    /won|draw|tie|no result|abandoned|cancel/i.test(status) ||
    (rawWinner && rawWinner !== 'No Winner')
  );

  return {
    completed,
    winnerTeam: /won/i.test(status) || (rawWinner && rawWinner !== 'No Winner') ? winner : null,
    resultText: status || (winner ? `${winner} won` : completed ? 'Match concluded' : '')
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
