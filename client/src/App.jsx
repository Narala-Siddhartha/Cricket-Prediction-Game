import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Calendar,
  Check,
  Clock,
  Crown,
  LogOut,
  MapPin,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  X
} from 'lucide-react';
import { api, getErrorMessage } from './api.js';
import { TeamAvatar, TeamMatchup } from './components/TeamAvatar.jsx';

const emptyAuth = { email: '', password: '', name: '' };

const POPULAR_SEARCHES = ['India', 'Australia', 'England', 'IPL', 'CSK', 'RCB', 'MI', 'Pakistan', 'South Africa', 'New Zealand'];

function formatDate(value) {
  if (!value) return 'TBA';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'TBA';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

function getMatchStatusCategory(status) {
  const s = (status || '').toLowerCase();
  if (/won|draw|tie|no result|abandoned|cancel/i.test(s)) return 'completed';
  if (/stumps|break|live|trail|lead|target|in progress|opt to/i.test(s)) return 'live';
  return 'upcoming';
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('cricket_token'));
  const [user, setUser] = useState(null);
  const [loadingMe, setLoadingMe] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoadingMe(false);
      return;
    }
    api.get('/auth/me')
      .then((response) => setUser(response.data.user))
      .catch(() => {
        localStorage.removeItem('cricket_token');
        setToken(null);
      })
      .finally(() => setLoadingMe(false));
  }, [token]);

  function handleAuthSuccess(payload) {
    localStorage.setItem('cricket_token', payload.token);
    setToken(payload.token);
    setUser(payload.user);
  }

  function logout() {
    localStorage.removeItem('cricket_token');
    setToken(null);
    setUser(null);
  }

  if (loadingMe) {
    return <Shell><div className="loader">Preparing your league room...</div></Shell>;
  }

  if (!token || !user) {
    return <AuthScreen onSuccess={handleAuthSuccess} />;
  }

  if (user.role !== 'admin' && user.status !== 'approved') {
    return (
      <Shell user={user} onLogout={logout}>
        <section className="empty-state">
          <ShieldCheck size={44} />
          <h1>Approval pending</h1>
          <p>Your account is registered. An admin needs to approve it before you can enter contests.</p>
        </section>
      </Shell>
    );
  }

  return (
    <Shell user={user} onLogout={logout}>
      {user.role === 'admin' ? <AdminDashboard /> : <UserDashboard currentUser={user} />}
    </Shell>
  );
}

function Shell({ children, user, onLogout }) {
  return (
    <main className="app-shell">
      <nav className="topbar">
        <div className="brand">
          <span className="brand-mark"><Trophy size={20} /></span>
          <span>Prediction League</span>
        </div>
        {user && (
          <div className="user-strip">
            <span>{user.name}</span>
            <button className="icon-button" onClick={onLogout} title="Logout"><LogOut size={18} /></button>
          </div>
        )}
      </nav>
      {children}
    </main>
  );
}

function AuthScreen({ onSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(emptyAuth);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      if (mode === 'register') {
        const response = await api.post('/auth/register', form);
        setMessage(response.data.message);
        setMode('login');
        setForm(emptyAuth);
      } else {
        const response = await api.post('/auth/login', { email: form.email, password: form.password });
        onSuccess(response.data);
      }
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <section className="auth-layout">
        <div className="auth-copy">
          <p className="eyebrow">Friends. Fixtures. Stakes.</p>
          <h1>Run a private cricket prediction table with real match results.</h1>
          <p>Admins publish contests from live cricket data, players pick winners before the lock time, and the table settles itself when results arrive.</p>
        </div>
        <form className="auth-card" onSubmit={submit}>
          <div className="segmented">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
          </div>
          {mode === 'register' && (
            <label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
          )}
          <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
          <label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required minLength={8} /></label>
          {message && <p className="form-message">{message}</p>}
          <button className="primary-button" disabled={busy}>{busy ? 'Please wait...' : mode === 'login' ? 'Enter League' : 'Request Access'}</button>
        </form>
      </section>
    </Shell>
  );
}

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [apiMatches, setApiMatches] = useState([]);
  const [contests, setContests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [matchQuery, setMatchQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [settings, setSettings] = useState({ winPoints: 10, lossPoints: 5, lockMinutes: 15 });
  const [message, setMessage] = useState('');
  const [searching, setSearching] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [syncingId, setSyncingId] = useState(null);

  async function loadAdminData() {
    const [usersRes, contestsRes] = await Promise.all([
      api.get('/admin/users'),
      api.get('/admin/contests')
    ]);
    setUsers(usersRes.data.users);
    setContests(contestsRes.data.contests);
  }

  async function executeSearch(queryToSearch) {
    const q = (queryToSearch || '').trim();
    setSearching(true);
    setMessage('');
    setSelected(null);

    try {
      const response = await api.get('/admin/api-matches', { params: { q } });
      setApiMatches(response.data.matches || []);
      setSearchedQuery(q || 'Current & Upcoming Fixtures');
    } catch (error) {
      setApiMatches([]);
      setMessage(getErrorMessage(error));
    } finally {
      setSearching(false);
    }
  }

  useEffect(() => {
    loadAdminData().catch((error) => setMessage(getErrorMessage(error)));
    // Automatically load current and upcoming matches on mount
    executeSearch('');
  }, []);

  async function updateUserStatus(id, status) {
    await api.patch(`/admin/users/${id}/status`, { status });
    await loadAdminData();
  }

  async function searchMatches(event) {
    if (event) event.preventDefault();
    executeSearch(matchQuery);
  }

  function handleChipClick(chip) {
    setMatchQuery(chip);
    executeSearch(chip);
  }

  async function publishContest() {
    if (!selected) return;
    setPublishing(true);
    setMessage('');
    try {
      const matchStart = new Date(selected.dateTimeGMT);
      const lockAt = new Date(matchStart.getTime() - Number(settings.lockMinutes) * 60 * 1000);

      await api.post('/admin/contests', {
        ...selected,
        lockAt,
        winPoints: Number(settings.winPoints),
        lossPoints: Number(settings.lossPoints)
      });
      setSelected(null);
      setMessage(`Contest published for "${selected.name}"!`);
      await loadAdminData();
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setPublishing(false);
    }
  }

  async function syncContest(id) {
    setSyncingId(id);
    try {
      await api.post(`/admin/contests/${id}/sync-result`);
      await loadAdminData();
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setSyncingId(null);
    }
  }

  const pendingUsers = users.filter((candidate) => candidate.status === 'pending');

  const selectedLockTime = useMemo(() => {
    if (!selected) return null;
    const matchStart = new Date(selected.dateTimeGMT);
    return new Date(matchStart.getTime() - Number(settings.lockMinutes) * 60 * 1000);
  }, [selected, settings.lockMinutes]);

  const isLockInPast = useMemo(() => {
    if (!selectedLockTime) return false;
    return new Date() >= selectedLockTime;
  }, [selectedLockTime]);

  return (
    <div className="dashboard-grid admin-grid">
      <section className="panel hero-panel">
        <p className="eyebrow">Admin control</p>
        <h1>Choose fixtures, approve players, settle the table.</h1>
        <button className="secondary-button" onClick={loadAdminData}><RefreshCcw size={16} />Refresh</button>
        {message && <p className="form-message">{message}</p>}
      </section>

      <section className="panel">
        <h2><Users size={18} /> Pending users</h2>
        <div className="list">
          {pendingUsers.length === 0 && <p className="muted">No pending registrations.</p>}
          {pendingUsers.map((candidate) => (
            <div className="row" key={candidate._id}>
              <div><strong>{candidate.name}</strong><span>{candidate.email}</span></div>
              <div className="actions">
                <button className="icon-button success" onClick={() => updateUserStatus(candidate._id, 'approved')} title="Approve"><Check size={17} /></button>
                <button className="icon-button danger" onClick={() => updateUserStatus(candidate._id, 'rejected')} title="Reject"><X size={17} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel wide">
        <div className="panel-header-row">
          <h2><Crown size={18} /> Live & Upcoming Cricket Matches</h2>
          <span className="live-indicator"><Activity size={14} /> CricAPI Sync</span>
        </div>

        <form className="match-search" onSubmit={searchMatches}>
          <label>
            Search team, league or tournament
            <input
              value={matchQuery}
              onChange={(event) => setMatchQuery(event.target.value)}
              placeholder="e.g. India, Australia, IPL, CSK, RCB, England..."
            />
          </label>
          <button className="primary-button" type="submit" disabled={searching}>
            <Search size={16} />{searching ? 'Fetching...' : 'Search'}
          </button>
        </form>

        <div className="quick-chips">
          <span className="chips-label"><Sparkles size={14} /> Quick picks:</span>
          {POPULAR_SEARCHES.map((chip) => (
            <button
              key={chip}
              type="button"
              className={`chip ${matchQuery.toLowerCase() === chip.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleChipClick(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        {searchedQuery && (
          <p className="search-meta-text">
            Showing results for <strong>{searchedQuery}</strong> ({apiMatches.length} match{apiMatches.length === 1 ? '' : 'es'} found)
          </p>
        )}

        {searching ? (
          <div className="match-loading">
            <RefreshCcw size={22} className="spin" />
            <span>Fetching cricket fixtures from CricAPI / CricketData...</span>
          </div>
        ) : (
          <div className="match-picker">
            {apiMatches.map((match) => {
              const category = getMatchStatusCategory(match.apiStatus);
              const isSelected = selected?.apiMatchId === match.apiMatchId;

              return (
                <button
                  key={match.apiMatchId}
                  className={`match-tile ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelected(match)}
                >
                  <div className="match-tile-header">
                    <span className="format-badge">{match.matchType?.toUpperCase() || 'CRICKET'}</span>
                    <span className={`status-pill ${category}`}>{category}</span>
                  </div>

                  <strong className="match-title">{match.name}</strong>

                  <div className="team-names-row">
                    <TeamMatchup teams={match.teams} size={34} />
                  </div>

                  <div className="match-meta">
                    <span><MapPin size={12} /> {match.venue || 'Venue TBA'}</span>
                    <small><Calendar size={12} /> {formatDate(match.dateTimeGMT)}</small>
                  </div>

                  {match.apiStatus && <span className="api-status-note">{match.apiStatus}</span>}
                </button>
              );
            })}
          </div>
        )}

        {searchedQuery && !searching && apiMatches.length === 0 && (
          <div className="no-matches-box">
            <p>No matches found matching "{searchedQuery}".</p>
            <small>Try searching for a country (e.g. India, Australia, England) or a league (e.g. IPL, BBL).</small>
          </div>
        )}

        {selected && (
          <div className="contest-editor">
            <div className="editor-heading">
              <div className="editor-matchup-banner">
                <TeamMatchup teams={selected.teams} size={46} />
              </div>
              <h3>Publish Contest for: {selected.name}</h3>
              <p>Configure points and lock time before players place their bets.</p>
            </div>

            <div className="editor-fields">
              <label>
                Win points
                <input
                  type="number"
                  min="0"
                  value={settings.winPoints}
                  onChange={(event) => setSettings({ ...settings, winPoints: event.target.value })}
                />
              </label>
              <label>
                Loss points
                <input
                  type="number"
                  min="0"
                  value={settings.lossPoints}
                  onChange={(event) => setSettings({ ...settings, lossPoints: event.target.value })}
                />
              </label>
              <label>
                Lock before match (minutes)
                <input
                  type="number"
                  min="1"
                  value={settings.lockMinutes}
                  onChange={(event) => setSettings({ ...settings, lockMinutes: event.target.value })}
                />
              </label>
            </div>

            <div className="lock-preview">
              <Clock size={15} />
              <span>Contest will lock predictions at: <strong>{formatDate(selectedLockTime)}</strong></span>
            </div>

            {isLockInPast && (
              <p className="form-warning">
                Warning: The lock time is already in the past. If published, predictions will be immediately locked.
              </p>
            )}

            <button className="primary-button" onClick={publishContest} disabled={publishing}>
              {publishing ? 'Publishing contest...' : 'Publish Contest Now'}
            </button>
          </div>
        )}
      </section>

      <section className="panel wide">
        <h2>Published contests</h2>
        <ContestTable contests={contests} onSync={syncContest} syncingId={syncingId} />
      </section>
    </div>
  );
}

function UserDashboard({ currentUser }) {
  const [contests, setContests] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [message, setMessage] = useState('');

  async function loadData() {
    const [contestRes, leaderRes] = await Promise.all([
      api.get('/contests'),
      api.get('/leaderboard')
    ]);
    setContests(contestRes.data.contests);
    setPredictions(contestRes.data.predictions);
    setLeaderboard(leaderRes.data.leaderboard);
  }

  useEffect(() => {
    loadData().catch((error) => setMessage(getErrorMessage(error)));
  }, []);

  async function predict(contestId, predictedWinner) {
    try {
      setMessage('');
      await api.post(`/contests/${contestId}/predictions`, { predictedWinner });
      await loadData();
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  }

  const predictionByContest = useMemo(() => {
    return Object.fromEntries(predictions.map((prediction) => [prediction.contestMatch, prediction]));
  }, [predictions]);

  return (
    <div className="dashboard-grid">
      <section className="panel hero-panel">
        <p className="eyebrow">Your score</p>
        <h1>{currentUser.totalScore} points</h1>
        <p>Pick winners before each contest locks. Correct predictions win points; misses subtract them.</p>
        {message && <p className="form-message">{message}</p>}
      </section>

      <section className="panel">
        <h2><Trophy size={18} /> Leaderboard</h2>
        <div className="list">
          {leaderboard.length === 0 && <p className="muted">No players yet.</p>}
          {leaderboard.map((entry) => (
            <div className={`row compact ${entry.name === currentUser.name ? 'current-user-row' : ''}`} key={entry.id}>
              <span>
                <strong className={`rank-tag rank-${entry.rank}`}>#{entry.rank}</strong> {entry.name}
              </span>
              <strong>{entry.totalScore} pts</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="panel wide">
        <h2>Open contests</h2>
        <div className="contest-list">
          {contests.length === 0 && <p className="muted">No active contests at the moment. Ask your admin to publish matches!</p>}
          {contests.map((contest) => (
            <ContestCard
              key={contest._id}
              contest={contest}
              prediction={predictionByContest[contest._id]}
              onPredict={predict}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function ContestCard({ contest, prediction, onPredict }) {
  const isLocked = new Date() >= new Date(contest.lockAt) || contest.status !== 'scheduled';

  return (
    <article className="contest-card">
      <div className="contest-info">
        <div className="contest-meta-badges">
          <span className="format-badge">{contest.matchType?.toUpperCase() || 'CRICKET'}</span>
          <span className={`status-pill ${contest.status}`}>{contest.status}</span>
        </div>
        <TeamMatchup teams={contest.teams} size={34} />
        <strong>{contest.name}</strong>
        <span><MapPin size={12} /> {contest.venue || 'Venue TBA'} | {formatDate(contest.dateTimeGMT)}</span>
        <small className="lock-time-text">
          <Clock size={12} /> {isLocked ? 'Locked' : `Locks ${formatDate(contest.lockAt)}`} | +{contest.winPoints} / -{contest.lossPoints} pts
        </small>
      </div>

      <div className="team-actions">
        {contest.teams.map((team) => {
          const isSelected = prediction?.predictedWinner === team.name;
          return (
            <button
              key={team.name}
              disabled={isLocked}
              className={`team-pick-button ${isSelected ? 'selected-team' : ''}`}
              onClick={() => onPredict(contest._id, team.name)}
              title={isLocked ? 'Prediction locked' : `Predict ${team.name}`}
            >
              <TeamAvatar teamName={team.name} shortName={team.shortName} size={28} />
              <span>{team.shortName || team.name}</span>
            </button>
          );
        })}
      </div>

      {prediction && (
        <span className={`badge ${prediction.outcome} prediction-badge-with-avatar`}>
          <TeamAvatar teamName={prediction.predictedWinner} size={20} />
          <span>{prediction.outcome.toUpperCase()} | Picked: {prediction.predictedWinner}</span>
          {prediction.scoreDelta !== 0 && ` (${prediction.scoreDelta > 0 ? '+' : ''}${prediction.scoreDelta} pts)`}
        </span>
      )}

      {contest.resultText && <p className="muted result-text">{contest.resultText}</p>}
    </article>
  );
}

function ContestTable({ contests, onSync, syncingId }) {
  if (!contests.length) {
    return <p className="muted">No contests published yet.</p>;
  }

  return (
    <div className="table">
      {contests.map((contest) => (
        <div className="table-row" key={contest._id}>
          <div className="table-matchup-cell">
            <TeamMatchup teams={contest.teams} size={30} />
            <small className="match-subtext">{formatDate(contest.dateTimeGMT)}</small>
            {contest.resultText && <small className="result-subtext">{contest.resultText}</small>}
          </div>
          <span className={`badge ${contest.status}`}>{contest.status}</span>
          <span>+{contest.winPoints} / -{contest.lossPoints}</span>
          <button
            className="secondary-button"
            disabled={syncingId === contest._id}
            onClick={() => onSync(contest._id)}
          >
            <RefreshCcw size={15} className={syncingId === contest._id ? 'spin' : ''} />
            {syncingId === contest._id ? 'Syncing...' : 'Sync'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
