import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  KeyRound,
  Mail,
  Pencil,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  X
} from 'lucide-react';
import { api, getErrorMessage } from '../api.js';
import { AvatarPickerModal, UserAvatar, getAvatarPreset } from './UserAvatar.jsx';

export function ProfilePage({ user, onUserUpdated }) {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  // Edit form state
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Status messages
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cancellingRequest, setCancellingRequest] = useState(false);

  const activeAvatarPreset = getAvatarPreset(user.avatar);
  const pendingUpdate = user.pendingUpdate;

  // Handle immediate avatar update
  async function handleAvatarSelect(avatarId) {
    if (avatarId === user.avatar) {
      setShowAvatarPicker(false);
      return;
    }
    setSavingAvatar(true);
    setError('');
    setMessage('');
    try {
      const response = await api.patch('/auth/avatar', { avatar: avatarId });
      onUserUpdated(response.data.user);
      setMessage('Avatar updated successfully!');
      setShowAvatarPicker(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSavingAvatar(false);
    }
  }

  // Handle submitting name & password update request for admin approval
  async function handleProfileSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    const trimmedName = name.trim();
    const isNameChanged = trimmedName && trimmedName !== user.name;
    const isPasswordChanging = Boolean(newPassword);

    if (!isNameChanged && !isPasswordChanging) {
      setError('No changes detected. Update your name or enter a new password.');
      return;
    }

    if (isPasswordChanging) {
      if (!currentPassword) {
        setError('Current password is required to request a password change.');
        return;
      }
      if (newPassword.length < 8) {
        setError('New password must be at least 8 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match.');
        return;
      }
    }

    setBusy(true);
    try {
      const payload = {};
      if (isNameChanged) payload.name = trimmedName;
      if (isPasswordChanging) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const response = await api.post('/auth/profile-request', payload);
      onUserUpdated(response.data.user);
      setMessage('Request submitted! Your changes are awaiting League Admin approval.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordFields(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  // Handle cancelling pending request
  async function handleCancelRequest() {
    setCancellingRequest(true);
    setError('');
    setMessage('');
    try {
      const response = await api.delete('/auth/profile-request');
      onUserUpdated(response.data.user);
      setName(response.data.user.name);
      setMessage('Pending profile request has been cancelled.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCancellingRequest(false);
    }
  }

  return (
    <div className="profile-page-layout">
      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <AvatarPickerModal
          currentAvatar={user.avatar}
          onSelect={handleAvatarSelect}
          onClose={() => setShowAvatarPicker(false)}
          saving={savingAvatar}
        />
      )}

      {/* Hero Card */}
      <section className="profile-hero-card">
        <div className="profile-hero-main">
          <div className="profile-avatar-interactive-wrap">
            <UserAvatar avatarId={user.avatar} size={104} />
            <button
              type="button"
              className="change-avatar-floating-btn"
              onClick={() => setShowAvatarPicker(true)}
              title="Change Avatar"
            >
              <Pencil size={15} />
              <span>Change</span>
            </button>
          </div>

          <div className="profile-identity-info">
            <div className="profile-badge-row">
              <span className={`status-pill ${user.status}`}>
                <ShieldCheck size={12} /> {user.status?.toUpperCase()}
              </span>
              <span className="role-pill">
                <UserCheck size={12} /> {user.role?.toUpperCase()}
              </span>
            </div>

            <h1 className="profile-user-name">{user.name}</h1>
            <p className="profile-avatar-title">
              <Sparkles size={14} className="sparkle-gold" /> {activeAvatarPreset.name} · {activeAvatarPreset.title}
            </p>
            <p className="profile-email-line">
              <Mail size={14} /> {user.email}
            </p>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="profile-score-banner">
          <div className="score-stat-item">
            <Trophy size={20} className="trophy-gold" />
            <div>
              <span className="sub-stat-label">Total Points</span>
              <strong className="sub-stat-value">{user.totalScore} pts</strong>
            </div>
          </div>
          <button
            type="button"
            className="secondary-button quick-avatar-btn"
            onClick={() => setShowAvatarPicker(true)}
          >
            <Sparkles size={15} /> Browse 12 Avatars
          </button>
        </div>
      </section>

      {/* Notifications */}
      {message && (
        <div className="feedback-banner success-banner">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="feedback-banner error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Pending Admin Approval Banner */}
      {pendingUpdate && (
        <section className="pending-request-card">
          <div className="pending-card-header">
            <div className="pending-header-left">
              <Clock size={20} className="clock-amber spin-slow" />
              <div>
                <h3>Change Request Awaiting Admin Approval</h3>
                <p>Your requested profile modifications are currently under review by the League Admin.</p>
              </div>
            </div>
            <button
              className="cancel-request-btn"
              onClick={handleCancelRequest}
              disabled={cancellingRequest}
              title="Withdraw Request"
            >
              <X size={15} /> {cancellingRequest ? 'Cancelling...' : 'Cancel Request'}
            </button>
          </div>

          <div className="pending-details-grid">
            {pendingUpdate.name && (
              <div className="pending-detail-item">
                <span className="detail-label">Requested New Name:</span>
                <strong className="detail-value highlight-name">&quot;{pendingUpdate.name}&quot;</strong>
              </div>
            )}
            {pendingUpdate.hasPasswordChange && (
              <div className="pending-detail-item">
                <span className="detail-label">Password Change:</span>
                <strong className="detail-value highlight-key">
                  <KeyRound size={14} /> New Password Pending Approval
                </strong>
              </div>
            )}
            <div className="pending-detail-item">
              <span className="detail-label">Submitted On:</span>
              <span className="detail-value">
                <Calendar size={13} />{' '}
                {new Date(pendingUpdate.requestedAt).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Edit Form Section */}
      <section className="profile-edit-section">
        <div className="section-header">
          <h2>Edit Profile & Credentials</h2>
          <p>
            Update your display name or password. <strong>Note:</strong> Avatar changes take effect immediately, while name and password changes are applied once reviewed and approved by League Admins.
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="profile-edit-form">
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="profile-name-input">
              Display Name
              <span className="approval-tag">Requires Admin Approval</span>
            </label>
            <input
              id="profile-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your league display name"
              required
              minLength={2}
              maxLength={80}
            />
            <small className="field-hint">This name appears on the leaderboard, match predictions, and admin consoles.</small>
          </div>

          {/* Email Field (Read only) */}
          <div className="form-group">
            <label htmlFor="profile-email-input">
              Email Address <span className="read-only-tag">Account Login</span>
            </label>
            <input
              id="profile-email-input"
              type="email"
              value={user.email}
              disabled
              className="disabled-input"
            />
            <small className="field-hint">Email address is permanently tied to your league profile.</small>
          </div>

          {/* Password Change Toggle */}
          <div className="password-accordion-box">
            <div className="accordion-header">
              <div className="accordion-label">
                <KeyRound size={16} />
                <span>Change Password</span>
                <span className="approval-tag">Requires Admin Approval</span>
              </div>
              <button
                type="button"
                className="secondary-button toggle-pwd-btn"
                onClick={() => setShowPasswordFields(!showPasswordFields)}
              >
                {showPasswordFields ? 'Hide Password Fields' : 'Request Password Change'}
              </button>
            </div>

            {showPasswordFields && (
              <div className="password-fields-container">
                <div className="form-group">
                  <label htmlFor="current-pwd">Current Password</label>
                  <input
                    id="current-pwd"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    required={showPasswordFields}
                  />
                  <small className="field-hint">Required to verify your identity.</small>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="new-pwd">New Password</label>
                    <input
                      id="new-pwd"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      required={showPasswordFields}
                      minLength={8}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirm-pwd">Confirm New Password</label>
                    <input
                      id="confirm-pwd"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required={showPasswordFields}
                      minLength={8}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-actions-row">
            <button
              type="submit"
              className="primary-button submit-profile-btn"
              disabled={busy}
            >
              {busy ? 'Submitting Request...' : 'Submit Changes for Admin Approval'}
            </button>
          </div>
        </form>
      </section>

      {/* Avatar Showcase / Preset Gallery */}
      <section className="avatar-showcase-section">
        <div className="showcase-header">
          <div>
            <h3>Available League Avatars (12 Styles)</h3>
            <p>Click any avatar below to switch immediately. No approval needed!</p>
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setShowAvatarPicker(true)}
          >
            Open Full Selector
          </button>
        </div>

        <div className="avatar-quick-grid">
          {['cric-captain', 'cric-blaster', 'cric-pacer', 'cric-spinner', 'cric-keeper', 'cric-sixer'].map((id) => {
            const preset = getAvatarPreset(id);
            const isSelected = user.avatar === id;
            return (
              <button
                key={id}
                type="button"
                className={`quick-avatar-tile ${isSelected ? 'active-avatar' : ''}`}
                onClick={() => handleAvatarSelect(id)}
                disabled={savingAvatar}
                title={`Select ${preset.name}`}
              >
                <UserAvatar avatarId={id} size={48} />
                <span className="tile-name">{preset.name}</span>
                {isSelected && (
                  <span className="active-tag">
                    <Check size={12} /> Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
