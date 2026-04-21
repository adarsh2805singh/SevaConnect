// src/pages/volunteer/VolunteerDashboard.jsx
import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import TaskCard from '../../components/TaskCard';
import './VolunteerDashboard.css';

const URGENCY_ORDER = { high: 0, medium: 1, low: 2 };

export default function VolunteerDashboard() {
  const { user, tasks } = useApp();
  const [search, setSearch] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [activeTab, setActiveTab] = useState('explore');

  const appliedTaskIds = user?.appliedTasks || [];

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.location.toLowerCase().includes(search.toLowerCase()) ||
          (t.tags || []).some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
        const matchUrgency = filterUrgency === 'all' || t.urgency === filterUrgency;
        return matchSearch && matchUrgency;
      })
      .sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]);
  }, [tasks, search, filterUrgency]);

  const appliedTasks = tasks.filter((t) => appliedTaskIds.includes(t.id));

  const stats = [
    { label: 'Tasks Available', value: tasks.length,   icon: '📋', color: 'var(--clr-brand-500)' },
    { label: 'Applied',         value: appliedTaskIds.length, icon: '✅', color: '#4ade80' },
    { label: 'Urgent Tasks',    value: tasks.filter((t) => t.urgency === 'high').length, icon: '🔴', color: '#f87171' },
    { label: 'Cities',          value: [...new Set(tasks.map((t) => t.location.split(',').pop().trim()))].length, icon: '🗺️', color: '#a78bfa' },
  ];

  return (
    <div className="dashboard-page page-wrapper">
      <div className="container dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Volunteer Dashboard</h1>
            <p className="text-muted">
              Hello, <strong style={{ color: 'var(--clr-text-primary)' }}>{user?.name}</strong>! Discover tasks that match your passion.
            </p>
          </div>
          <div className="volunteer-profile-chip">
            <div className="user-avatar">{user?.name?.charAt(0)}</div>
            <div>
              <div className="fw-600 text-sm">{user?.name}</div>
              <div className="text-muted text-xs">📍 {user?.location}</div>
            </div>
          </div>
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

        {/* Tabs */}
        <div className="vol-tabs">
          <button
            className={`vol-tab ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
            id="explore-tab"
          >
            🔍 Explore Tasks <span className="tab-count">{filteredTasks.length}</span>
          </button>
          <button
            className={`vol-tab ${activeTab === 'applied' ? 'active' : ''}`}
            onClick={() => setActiveTab('applied')}
            id="applied-tab"
          >
            ✅ My Applications <span className="tab-count">{appliedTaskIds.length}</span>
          </button>
        </div>

        {activeTab === 'explore' && (
          <>
            {/* Search & Filters */}
            <div className="search-filter-bar">
              <div className="search-input-wrap">
                <span className="search-icon">🔍</span>
                <input
                  id="task-search"
                  className="form-input search-input"
                  type="text"
                  placeholder="Search by title, location, tag..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="urgency-filters">
                {['all', 'high', 'medium', 'low'].map((u) => (
                  <button
                    key={u}
                    id={`filter-urgency-${u}`}
                    className={`urgency-filter-btn ${filterUrgency === u ? 'active' : ''} ${u !== 'all' ? `badge-${u}` : ''}`}
                    onClick={() => setFilterUrgency(u)}
                    style={{ background: filterUrgency === u && u === 'all' ? 'var(--clr-brand-600)' : undefined }}
                  >
                    {u !== 'all' && { high: '🔴', medium: '🟡', low: '🟢' }[u]}{' '}
                    {u.charAt(0).toUpperCase() + u.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon">🔍</div>
                <h3>No matching tasks</h3>
                <p>Try changing your search or filter</p>
              </div>
            ) : (
              <div className="grid grid-3">
                {filteredTasks.map((task, i) => (
                  <div key={task.id} className="animate-fadeUp" style={{ animationDelay: `${i * 0.05}s` }}>
                    <TaskCard
                      task={task}
                      showActions={true}
                      isApplied={appliedTaskIds.includes(task.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'applied' && (
          <>
            {appliedTasks.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon">📝</div>
                <h3>No applications yet</h3>
                <p>Start exploring tasks and apply to ones that inspire you!</p>
                <button className="btn btn-primary mt-2" onClick={() => setActiveTab('explore')} id="go-explore-btn">
                  Explore Tasks
                </button>
              </div>
            ) : (
              <div className="grid grid-3">
                {appliedTasks.map((task, i) => (
                  <div key={task.id} className="animate-fadeUp" style={{ animationDelay: `${i * 0.06}s` }}>
                    <TaskCard
                      task={task}
                      showActions={true}
                      isApplied={true}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
