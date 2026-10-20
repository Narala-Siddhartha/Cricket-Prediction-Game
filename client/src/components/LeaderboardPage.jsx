import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  Crown,
  Flame,
  Medal,
  RefreshCcw,
  Search,
  Sparkles,
  Target,
  Trophy,
  Users
} from 'lucide-react';
import { UserAvatar } from './UserAvatar.jsx';

// Lightweight, zero-dependency canvas confetti generator
function triggerCelebration(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = (canvas.width = canvas.offsetWidth);
  const height = (canvas.height = canvas.offsetHeight);

  const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444', '#fbbf24'];
  const particles = [];
  const count = 75;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: width * 0.5 + (Math.random() - 0.5) * 120,
      y: height * 0.25 + (Math.random() - 0.5) * 50,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -10 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      shape: Math.random() > 0.5 ? 'rect' : 'circle'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    let activeCount = 0;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.rotSpeed;
      p.opacity -= 0.009;

      if (p.opacity > 0 && p.y < height) {
        activeCount++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    if (activeCount > 0) {
      requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }

  render();
}

export function LeaderboardPage({
  leaderboard = [],
  currentUser,
  loading = false,
  onRefresh
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [celebrated, setCelebrated] = useState(false);
  const canvasRef = useRef(null);
  const myRowRef = useRef(null);

  // Trigger celebration once on load if there are players
  useEffect(() => {
    if (!celebrated && leaderboard.length > 0 && canvasRef.current) {
      setCelebrated(true);
      const timer = setTimeout(() => {
        triggerCelebration(canvasRef.current);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [leaderboard, celebrated]);

  function handleCelebrateClick() {
    if (canvasRef.current) {
      triggerCelebration(canvasRef.current);
    }
  }

  const top3 = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);
  const leaderScore = leaderboard[0]?.totalScore || 1;

  const filteredBoard = useMemo(() => {
    if (!searchTerm.trim()) return leaderboard;
    const term = searchTerm.toLowerCase();
    return leaderboard.filter((user) => user.name.toLowerCase().includes(term));
  }, [leaderboard, searchTerm]);

  const myRank = useMemo(() => {
    if (!currentUser) return null;
    return leaderboard.find((u) => u.id === currentUser.id || u.email === currentUser.email);
  }, [leaderboard, currentUser]);

  function scrollToMyPosition() {
    if (myRowRef.current) {
      myRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      myRowRef.current.classList.add('flash-row');
      setTimeout(() => {
        myRowRef.current?.classList.remove('flash-row');
      }, 2000);
    }
  }

  return (
    <div className="leaderboard-page-container">
      {/* Canvas for confetti particle effects */}
      <canvas ref={canvasRef} className="confetti-canvas" />

      {/* Header Banner */}
      <header className="leaderboard-hero-banner">
        <div className="banner-top-row">
          <div className="banner-title-area">
            <span className="hero-eyebrow">
              <Sparkles size={14} /> Official Standings
            </span>
            <h1>Championship Leaderboard</h1>
            <p>Compete with friends, climb the ranks, and crown the ultimate cricket strategist.</p>
          </div>

          <div className="banner-actions">
            <button
              className="celebrate-button"
              onClick={handleCelebrateClick}
              title="Celebrate League"
            >
              🎉 Celebrate
            </button>
            <button
              className="secondary-button refresh-btn"
              onClick={onRefresh}
              disabled={loading}
              title="Refresh Standings"
            >
              <RefreshCcw size={16} className={loading ? 'spin' : ''} />
              <span>{loading ? 'Updating...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="stats-strip">
          <div className="stat-card">
            <div className="stat-icon-wrap trophy-icon-wrap">
              <Trophy size={18} />
            </div>
            <div>
              <span className="stat-label">League Leader</span>
              <strong className="stat-value">{top3[0]?.name || 'TBA'}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap players-icon-wrap">
              <Users size={18} />
            </div>
            <div>
              <span className="stat-label">Competitors</span>
              <strong className="stat-value">{leaderboard.length} Players</strong>
            </div>
          </div>

          {myRank && (
            <div className="stat-card my-stat-card">
              <div className="stat-icon-wrap my-icon-wrap">
                <Target size={18} />
              </div>
              <div>
                <span className="stat-label">Your Standing</span>
                <strong className="stat-value">Rank #{myRank.rank} · {myRank.totalScore} pts</strong>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Championship Podium for Top 3 */}
      {top3.length > 0 && (
        <section className="podium-section">
          <h2 className="podium-title">
            <Crown size={20} className="crown-shimmer" /> Hall of Champions
          </h2>

          <div className="podium-stage">
            {/* 2nd Place (Silver - Left) */}
            {top3[1] ? (
              <div className="podium-slot rank-2-slot">
                <div className="podium-avatar-bubble">
                  <UserAvatar avatarId={top3[1].avatar} size={64} />
                  <span className="medal-badge silver-medal">
                    <Medal size={16} /> 2
                  </span>
                </div>
                <strong className="podium-player-name">{top3[1].name}</strong>
                <span className="podium-score-pill">{top3[1].totalScore} pts</span>
                <div className="podium-pedestal pedestal-2">
                  <span className="pedestal-rank">#2</span>
                  <span className="pedestal-subtitle">RUNNER UP</span>
                </div>
              </div>
            ) : (
              <div className="podium-slot rank-2-slot empty-slot" />
            )}

            {/* 1st Place (Gold - Center) */}
            {top3[0] && (
              <div className="podium-slot rank-1-slot">
                <div className="champion-glow-ring" />
                <div className="podium-avatar-bubble champion-bubble">
                  <span className="crown-floating">
                    <Crown size={28} />
                  </span>
                  <UserAvatar avatarId={top3[0].avatar} size={84} />
                  <span className="medal-badge gold-medal">
                    <Trophy size={18} /> 1
                  </span>
                </div>
                <strong className="podium-player-name champion-name">{top3[0].name}</strong>
                <span className="podium-score-pill gold-score">{top3[0].totalScore} pts</span>
                <div className="podium-pedestal pedestal-1">
                  <span className="pedestal-rank">#1</span>
                  <span className="pedestal-subtitle">CHAMPION</span>
                </div>
              </div>
            )}

            {/* 3rd Place (Bronze - Right) */}
            {top3[2] ? (
              <div className="podium-slot rank-3-slot">
                <div className="podium-avatar-bubble">
                  <UserAvatar avatarId={top3[2].avatar} size={60} />
                  <span className="medal-badge bronze-medal">
                    <Award size={16} /> 3
                  </span>
                </div>
                <strong className="podium-player-name">{top3[2].name}</strong>
                <span className="podium-score-pill">{top3[2].totalScore} pts</span>
                <div className="podium-pedestal pedestal-3">
                  <span className="pedestal-rank">#3</span>
                  <span className="pedestal-subtitle">3RD PLACE</span>
                </div>
              </div>
            ) : (
              <div className="podium-slot rank-3-slot empty-slot" />
            )}
          </div>
        </section>
      )}

      {/* Main Board Table */}
      <section className="the-board-panel">
        <div className="board-header-bar">
          <div className="board-heading">
            <Flame size={20} className="flame-accent" />
            <h3>All Competitors Standings</h3>
          </div>

          <div className="board-tools">
            <div className="board-search-box">
              <Search size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search player name..."
              />
            </div>

            {myRank && (
              <button className="jump-to-me-btn" onClick={scrollToMyPosition}>
                <Target size={15} /> Find Me
              </button>
            )}
          </div>
        </div>

        {/* Animated Table / Cards */}
        <div className="board-list">
          {filteredBoard.length === 0 ? (
            <div className="empty-board-state">
              <p>No players matched your search.</p>
            </div>
          ) : (
            filteredBoard.map((entry, index) => {
              const isMe = currentUser && (entry.id === currentUser.id || entry.email === currentUser.email);
              const progressPct = leaderScore > 0 ? Math.max(5, Math.round((entry.totalScore / leaderScore) * 100)) : 10;

              return (
                <div
                  key={entry.id || entry.email}
                  ref={isMe ? myRowRef : null}
                  className={`board-row-card rank-${entry.rank} ${isMe ? 'is-current-user' : ''}`}
                  style={{ '--stagger-delay': `${Math.min(index * 0.04, 0.6)}s` }}
                >
                  {/* Rank Badge */}
                  <div className="rank-col">
                    <span className={`rank-indicator rank-badge-${entry.rank <= 3 ? entry.rank : 'default'}`}>
                      {entry.rank === 1 && <Crown size={14} />}
                      {entry.rank === 2 && <Medal size={14} />}
                      {entry.rank === 3 && <Award size={14} />}
                      #{entry.rank}
                    </span>
                  </div>

                  {/* Player Info & Avatar */}
                  <div className="player-col">
                    <UserAvatar avatarId={entry.avatar} size={46} />
                    <div className="player-meta-info">
                      <div className="player-name-row">
                        <strong className="player-display-name">{entry.name}</strong>
                        {isMe && <span className="you-badge">YOU</span>}
                        {entry.rank === 1 && <span className="leader-pill">LEADER</span>}
                      </div>
                      {/* Score relative bar */}
                      <div className="relative-score-bar-bg" title={`${progressPct}% of leader's score`}>
                        <div
                          className="relative-score-bar-fill"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="score-col">
                    <div className="points-display">
                      <strong className="points-number">{entry.totalScore}</strong>
                      <span className="points-unit">PTS</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
