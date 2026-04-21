// src/pages/admin/AdminPanel.jsx
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './AdminPanel.css';

const STATUS_CONFIG = {
  approved: { label: 'Approved', class: 'badge-low' },
  pending:  { label: 'Pending',  class: 'badge-medium' },
  rejected: { label: 'Rejected', class: 'badge-high' },
};

export default function AdminPanel() {
  const { ngos, approveNGO, rejectNGO } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmAction, setConfirmAction] = useState(null); // { ngoId, action }

  const filtered = ngos.filter((n) => {
    const matchStatus = filter === 'all' || n.status === filter;
    const matchSearch = n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.code.toLowerCase().includes(search.toLowerCase()) ||
      n.sector?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all: ngos.length,
    pending: ngos.filter((n) => n.status === 'pending').length,
    approved: ngos.filter((n) => n.status === 'approved').length,
    rejected: ngos.filter((n) => n.status === 'rejected').length,
  };

  const handleAction = (ngoId, action) => {
    if (action === 'approve') approveNGO(ngoId);
    else rejectNGO(ngoId);
    setConfirmAction(null);
  };

  const stats = [
    { label: 'Total NGOs',    value: counts.all,      icon: '🏛️', color: 'var(--clr-brand-500)' },
    { label: 'Pending Review',value: counts.pending,  icon: '⏳', color: '#facc15' },
    { label: 'Approved',      value: counts.approved, icon: '✅', color: '#4ade80' },
    { label: 'Rejected',      value: counts.rejected, icon: '❌', color: '#f87171' },
  ];

  return (
    <div className="dashboard-page page-wrapper">
      {/* Confirm Modal */}
      {confirmAction && (
        <div className="modal-overlay" onClick={() => setConfirmAction(null)}>
          <div className="modal-box card animate-fadeUp" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', gap: '1.5rem' }}>
            <div className="modal-header">
              <h2>{confirmAction.action === 'approve' ? '✅ Approve NGO' : '❌ Reject NGO'}</h2>
            </div>
            <p className="text-muted text-sm">
              Are you sure you want to <strong>{confirmAction.action}</strong> this NGO? This action can be reversed later.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmAction(null)} id="cancel-action-btn">Cancel</button>
              <button
                className={`btn ${confirmAction.action === 'approve' ? 'btn-success' : 'btn-danger'}`}
                onClick={() => handleAction(confirmAction.ngoId, confirmAction.action)}
                id="confirm-action-btn"
              >
                Confirm {confirmAction.action.charAt(0).toUpperCase() + confirmAction.action.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Admin Panel</h1>
            <p className="text-muted">Review and manage NGO registration requests</p>
          </div>
          <span className="badge badge-purple">🛡️ Super Admin</span>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-card animate-fadeUp" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="stat-icon" style={{ background: `${s.color}1a`, border: `1px solid ${s.color}40` }}>
                <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
              </div>
              <div className="stat-info">
                <h3 style={{ color: s.color }}>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="admin-filters">
          <div className="search-input-wrap" style={{ flex: 1, maxWidth: '360px' }}>
            <span className="search-icon">🔍</span>
            <input
              id="admin-search"
              className="form-input search-input"
              type="text"
              placeholder="Search by name, code, sector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="urgency-filters">
            {['all', 'pending', 'approved', 'rejected'].map((s) => (
              <button
                key={s}
                id={`admin-filter-${s}`}
                className={`urgency-filter-btn ${filter === s ? 'active btn-primary' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
              </button>
            ))}
          </div>
        </div>

        {/* NGO Table */}
        <div className="admin-table-wrapper card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="admin-table-header">
            <span>NGO Details</span>
            <span>Sector</span>
            <span>Status</span>
            <span>Stats</span>
            <span>Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem' }}>
              <div className="empty-icon">🔍</div>
              <h3>No NGOs found</h3>
              <p>Adjust your search or filter</p>
            </div>
          ) : (
            filtered.map((ngo, i) => {
              const sc = STATUS_CONFIG[ngo.status];
              return (
                <div key={ngo.id} className="admin-table-row animate-fadeUp" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="ngo-details">
                    <div className="ngo-avatar">{ngo.name.charAt(0)}</div>
                    <div>
                      <div className="fw-600 text-sm">{ngo.name}</div>
                      <div className="text-muted text-xs">Code: {ngo.code} · {ngo.email}</div>
                    </div>
                  </div>
                  <div>
                    <span className="badge badge-gray">{ngo.sector || 'N/A'}</span>
                  </div>
                  <div>
                    <span className={`badge ${sc.class}`}>{sc.label}</span>
                  </div>
                  <div className="ngo-stats-inline">
                    <span>👥 {ngo.volunteers}</span>
                    <span>📋 {ngo.tasksPosted}</span>
                  </div>
                  <div className="ngo-actions">
                    {ngo.status === 'pending' ? (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => setConfirmAction({ ngoId: ngo.id, action: 'approve' })}
                          id={`approve-ngo-${ngo.id}`}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setConfirmAction({ ngoId: ngo.id, action: 'reject' })}
                          id={`reject-ngo-${ngo.id}`}
                        >
                          ✕ Reject
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setConfirmAction({ ngoId: ngo.id, action: ngo.status === 'approved' ? 'reject' : 'approve' })}
                        id={`toggle-ngo-${ngo.id}`}
                      >
                        {ngo.status === 'approved' ? 'Revoke' : 'Re-approve'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
