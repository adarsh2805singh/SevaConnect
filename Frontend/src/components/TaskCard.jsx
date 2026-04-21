// src/components/TaskCard.jsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './TaskCard.css';

const URGENCY = {
  high:   { label: 'High Urgency',   cls: 'high',   dot: '🔴', color: '#ef4444' },
  medium: { label: 'Medium Urgency', cls: 'medium', dot: '🟡', color: '#eab308' },
  low:    { label: 'Low Urgency',    cls: 'low',    dot: '🟢', color: '#22c55e' },
};

function CountdownBadge({ daysLeft }) {
  if (daysLeft > 7) return null;
  const color = daysLeft <= 2 ? '#f87171' : '#facc15';
  return (
    <span className="countdown-tag anim-pulse" style={{ color, borderColor: `${color}40`, background: `${color}12` }}>
      ⏰ {daysLeft}d left
    </span>
  );
}

export default function TaskCard({ task, showActions = true, isApplied = false, onViewApplicants, onRemoveTask, isLoading = false }) {
  const { user, applyTask, withdrawTask, deleteTask } = useApp();
  const [applying, setApplying] = useState(false);
  const urg = URGENCY[task?.urgency] || URGENCY.low;

  if (isLoading) {
    return (
      <div className="task-card skeleton-card">
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-rect" style={{ height: 100 }} />
        <div className="skeleton skeleton-line medium" />
        <div className="skeleton skeleton-line full" />
      </div>
    );
  }

  const spotsLeft   = task.requiredVolunteers - task.appliedVolunteers;
  const fillPercent = Math.min(100, Math.round((task.appliedVolunteers / task.requiredVolunteers) * 100));
  const isFull      = spotsLeft <= 0;

  const handleApply = async (e) => {
    e.stopPropagation();
    setApplying(true);
    await new Promise(r => setTimeout(r, 500));
    applyTask(task.id);
    setApplying(false);
  };
  const handleWithdraw = (e) => { e.stopPropagation(); withdrawTask(task.id); };

  return (
    <div className={`task-card card card-hover card-glow urg-${urg.cls}`} tabIndex={0} role="article">
      {/* Urgency accent stripe */}
      <div className="task-accent-bar" style={{ background: `linear-gradient(90deg, ${urg.color}, ${urg.color}66)` }} />

      {/* Header */}
      <div className="task-header">
        <div className="task-badges">
          <span className={`badge badge-${urg.cls}`}>{urg.dot} {urg.label}</span>
          {task.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="badge badge-gray">{tag}</span>
          ))}
        </div>
        <CountdownBadge daysLeft={task.daysLeft} />
      </div>

      {/* Body */}
      <div className="task-body">
        <h3 className="task-title">{task.title}</h3>
        <p className="task-ngo">by {task.ngoName}</p>
        <p className="task-desc">{task.description}</p>
      </div>

      {/* Meta */}
      <div className="task-meta">
        <div className="meta-row">
          <span className="meta-icon">📍</span>
          <span>{task.location}</span>
        </div>
        <div className="meta-row">
          <span className="meta-icon">🗓️</span>
          <span>{task.date} · {task.time}</span>
        </div>
        <div className="meta-row">
          <span className="meta-icon">👥</span>
          <span className={isFull ? 'text-danger' : ''}>
            {isFull ? 'Fully booked' : `${spotsLeft} of ${task.requiredVolunteers} spots open`}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="task-progress">
        <div className="progress-labels">
          <span>{task.appliedVolunteers} applied</span>
          <span className="fw-600" style={{ color: urg.color }}>{fillPercent}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${fillPercent}%`, background: `linear-gradient(90deg, ${urg.color}, ${urg.color}cc)` }}
          />
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="task-actions">
          {user?.role === 'volunteer' && (
            isApplied ? (
              <button className="btn btn-ghost btn-sm" onClick={handleWithdraw} id={`withdraw-${task.id}`}>
                ✕ Withdraw
              </button>
            ) : (
              <button
                className={`btn btn-primary btn-sm ${isFull ? '' : ''}`}
                onClick={handleApply}
                disabled={isFull || applying}
                id={`apply-${task.id}`}
              >
                {applying
                  ? <><span className="spinner" style={{ width:14,height:14 }} /> Applying…</>
                  : isFull ? '🔒 Full' : '✦ Apply Now'}
              </button>
            )
          )}
          {user?.role === 'ngo' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {onViewApplicants && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => onViewApplicants(task)}
                  id={`applicants-${task.id}`}
                >
                  👁 View {task.appliedVolunteers} Applicants
                </button>
              )}
              <button
                className="btn btn-sm"
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid currentColor' }}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (onRemoveTask) {
                    onRemoveTask(task);
                  } else {
                    deleteTask(task.id); 
                  }
                }}
                id={`delete-${task.id}`}
              >
                ✕ Remove
              </button>
            </div>
          )}
          {isApplied && user?.role === 'volunteer' && (
            <span className="badge badge-success" style={{ padding: '.3rem .8rem' }}>✓ Applied</span>
          )}
        </div>
      )}
    </div>
  );
}
