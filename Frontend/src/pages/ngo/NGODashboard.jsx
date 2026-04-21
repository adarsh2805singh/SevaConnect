// src/pages/ngo/NGODashboard.jsx
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import TaskCard from '../../components/TaskCard';
import './NGODashboard.css';

function CreateTaskModal({ onClose }) {
  const { createTask, loading } = useApp();
  const [form, setForm] = useState({
    title: '', description: '', location: '',
    date: '', time: '', requiredVolunteers: '',
    daysLeft: '',
  });

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask({
      ...form,
      requiredVolunteers: parseInt(form.requiredVolunteers),
      daysLeft: parseInt(form.daysLeft) || 14,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box card animate-fadeUp" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Task</h2>
          <button className="modal-close" onClick={onClose} id="close-create-modal">✕</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} id="create-task-form">
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input id="task-title" className="form-input" type="text" placeholder="e.g. Beach Cleanup Campaign" required value={form.title} onChange={set('title')} />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea id="task-desc" className="form-textarea" placeholder="Describe what volunteers will be doing..." required value={form.description} onChange={set('description')} />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input id="task-location" className="form-input" type="text" placeholder="e.g. Juhu Beach, Mumbai" required value={form.location} onChange={set('location')} />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input id="task-date" className="form-input" type="date" required value={form.date} onChange={set('date')} />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input id="task-time" className="form-input" type="time" required value={form.time} onChange={set('time')} />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Volunteers Needed</label>
              <input id="task-volunteers" className="form-input" type="number" min="1" placeholder="20" required value={form.requiredVolunteers} onChange={set('requiredVolunteers')} />
            </div>
            <div className="form-group">
              <label className="form-label">Days Until Deadline</label>
              <input id="task-days" className="form-input" type="number" min="1" placeholder="14" value={form.daysLeft} onChange={set('daysLeft')} />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} id="cancel-task-btn">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} id="submit-task-btn">
              {loading ? 'Creating…' : '✦ Publish Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ApplicantsModal({ task, onClose }) {
  // Mock applicants list
  const applicants = Array.from({ length: task.appliedVolunteers }, (_, i) => ({
    id: i + 1,
    name: ['Arjun Patel', 'Sneha Reddy', 'Rahul Kumar', 'Priya Singh', 'Vikram Das'][i % 5],
    location: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune'][i % 5],
    skills: ['Teaching', 'First Aid', 'Driving', 'Coding', 'Cooking'][i % 5],
    avatar: ['AP', 'SR', 'RK', 'PS', 'VD'][i % 5],
  }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box card animate-fadeUp" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div>
            <h2>Applicants</h2>
            <p className="text-muted text-sm">{task.title}</p>
          </div>
          <button className="modal-close" onClick={onClose} id="close-applicants-modal">✕</button>
        </div>

        {applicants.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🙁</div>
            <h3>No applicants yet</h3>
            <p>Share your task to attract volunteers</p>
          </div>
        )}

        <div className="applicants-list">
          {applicants.map((a) => (
            <div key={a.id} className="applicant-row">
              <div className="user-avatar" style={{ background: 'linear-gradient(135deg,var(--clr-brand-600),var(--clr-accent-600))' }}>
                {a.avatar}
              </div>
              <div className="applicant-info">
                <span className="fw-600 text-sm">{a.name}</span>
                <span className="text-muted text-xs">📍 {a.location} · Skills: {a.skills}</span>
              </div>
              <span className="badge badge-brand">Applied</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ task, onClose }) {
  const { deleteTask } = useApp();
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box card animate-fadeUp" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2>Confirm Deletion</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p style={{ marginTop: '1rem', color: 'var(--clr-text-secondary)' }}>
          Are you sure you want to remove <strong>{task.title}</strong>? This action cannot be undone.
        </p>
        <div className="modal-actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn" style={{ background: '#ef4444', color: 'white' }} onClick={() => { deleteTask(task.id); onClose(); }}>
            Remove Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NGODashboard() {
  const { user, tasks } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const myTasks = tasks.filter((t) => t.ngoId === user?.id);
  const stats = [
    { label: 'Tasks Posted',    value: myTasks.length, icon: '📋', color: 'var(--clr-brand-500)' },
    { label: 'Total Applied',   value: myTasks.reduce((s, t) => s + t.appliedVolunteers, 0), icon: '🙋', color: '#a78bfa' },
    { label: 'Spots Available', value: myTasks.reduce((s, t) => s + Math.max(0, t.requiredVolunteers - t.appliedVolunteers), 0), icon: '⭕', color: '#4ade80' },
    { label: 'Active Now',      value: myTasks.filter((t) => t.urgency === 'high').length, icon: '⚡', color: '#f87171' },
  ];

  return (
    <div className="dashboard-page page-wrapper">
      {showCreate && <CreateTaskModal onClose={() => setShowCreate(false)} />}
      {selectedTask && <ApplicantsModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
      {taskToDelete && <ConfirmDeleteModal task={taskToDelete} onClose={() => setTaskToDelete(null)} />}

      <div className="container dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>NGO Dashboard</h1>
            <p className="text-muted">Welcome back, <strong style={{ color: 'var(--clr-text-primary)' }}>{user?.name}</strong></p>
          </div>
          <div className="dashboard-header-actions">
            <span className="badge badge-brand">✓ Account Verified</span>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreate(true)}
              id="create-task-btn"
            >
              + Create Task
            </button>
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

        {/* Tasks Grid */}
        <div className="section-header">
          <h2>Your Tasks</h2>
          <p className="text-muted">Manage and monitor all your posted volunteer opportunities</p>
        </div>

        {myTasks.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">📋</div>
            <h3>No tasks yet</h3>
            <p>Create your first task to start attracting volunteers</p>
            <button className="btn btn-primary mt-2" onClick={() => setShowCreate(true)} id="first-task-btn">
              + Create First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-3">
            {myTasks.map((task, i) => (
              <div key={task.id} className="animate-fadeUp" style={{ animationDelay: `${i * 0.06}s` }}>
                <TaskCard
                  task={task}
                  showActions={true}
                  onViewApplicants={setSelectedTask}
                  onRemoveTask={setTaskToDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
