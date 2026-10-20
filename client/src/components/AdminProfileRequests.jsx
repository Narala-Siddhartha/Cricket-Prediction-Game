import React from 'react';
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  KeyRound,
  Mail,
  RefreshCcw,
  Users,
  X
} from 'lucide-react';
import { UserAvatar } from './UserAvatar.jsx';

export function AdminProfileRequests({
  requests = [],
  onApprove,
  onReject,
  loading = false,
  onRefresh,
  actionId = null
}) {
  return (
    <div className="admin-requests-container">
      <div className="panel-header-row requests-hero-header">
        <div>
          <h2><Users size={20} /> Player Profile Change Requests</h2>
          <p>
            Players cannot change their name or password without League Admin approval to prevent impersonation and maintain competitive fairness.
          </p>
        </div>
        <button
          className="secondary-button"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh Requests"
        >
          <RefreshCcw size={16} className={loading ? 'spin' : ''} />
          <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="empty-requests-box">
          <CheckCircle2 size={44} className="check-emerald" />
          <h3>All Caught Up!</h3>
          <p>There are no pending name or password change requests waiting for approval.</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((req) => {
            const isProcessing = actionId === req.userId;
            return (
              <article className="request-card" key={req.userId}>
                <div className="request-card-top">
                  <div className="request-user-info">
                    <UserAvatar avatarId={req.avatar} size={48} />
                    <div>
                      <strong className="request-current-name">{req.currentName}</strong>
                      <span className="request-email"><Mail size={12} /> {req.email}</span>
                    </div>
                  </div>
                  <span className="pending-badge">
                    <Clock size={13} className="spin-slow" /> Pending Review
                  </span>
                </div>

                <div className="request-changes-summary">
                  {req.requestedName && (
                    <div className="change-item name-change-item">
                      <span className="change-type-label">Requested Name Change:</span>
                      <div className="change-diff">
                        <span className="old-val">{req.currentName}</span>
                        <ArrowRight size={14} className="arrow-diff" />
                        <strong className="new-val">{req.requestedName}</strong>
                      </div>
                    </div>
                  )}

                  {req.hasPasswordChange && (
                    <div className="change-item password-change-item">
                      <span className="change-type-label">Password Reset:</span>
                      <div className="password-diff-badge">
                        <KeyRound size={14} />
                        <span>Player submitted new password (verified via current credentials)</span>
                      </div>
                    </div>
                  )}

                  <div className="request-time-row">
                    <Calendar size={12} />
                    <small>
                      Submitted {new Date(req.requestedAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </small>
                  </div>
                </div>

                <div className="request-actions-row">
                  <button
                    className="primary-button approve-btn"
                    disabled={isProcessing}
                    onClick={() => onApprove(req.userId)}
                  >
                    <Check size={16} />
                    <span>{isProcessing ? 'Processing...' : 'Approve Changes'}</span>
                  </button>

                  <button
                    className="secondary-button reject-btn"
                    disabled={isProcessing}
                    onClick={() => onReject(req.userId)}
                  >
                    <X size={16} />
                    <span>Reject</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
