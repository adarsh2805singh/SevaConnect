// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './AuthPages.css';

const DASHBOARD_PATHS = {
  volunteer: '/volunteer/dashboard',
  ngo: '/ngo/dashboard',
  admin: '/admin/panel',
};

export default function LoginPage() {
  const [params] = useSearchParams();
  const defaultRole = params.get('role') || 'volunteer';
  const [role, setRole] = useState(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, notify } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(role, { email, password });
    setLoading(false);
    if (success) navigate(DASHBOARD_PATHS[role] || '/');
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-bg-orb auth-bg-orb-right" aria-hidden="true" />
      <div className="auth-container">
        <div className="auth-card card animate-fadeUp">
          <div className="auth-header">
            <Link to="/" className="auth-back-logo">
              <span>🌍</span> <span className="gradient-text fw-700">SevaConnect</span>
            </Link>
            <h1 className="auth-title">Welcome back</h1>
            <p className="text-muted text-sm">Sign in to continue your mission</p>
          </div>

          {/* Role Toggle */}
          <div className="role-toggle">
            <button className={`role-tab ${role === 'volunteer' ? 'active' : ''}`} onClick={() => setRole('volunteer')} type="button" id="login-volunteer-tab">🙋 Volunteer</button>
            <button className={`role-tab ${role === 'ngo' ? 'active' : ''}`}       onClick={() => setRole('ngo')}       type="button" id="login-ngo-tab">🏛️ NGO</button>
            <button className={`role-tab ${role === 'admin' ? 'active' : ''}`}     onClick={() => setRole('admin')}     type="button" id="login-admin-tab">🛡️ Admin</button>
          </div>



          <form className="auth-form" onSubmit={handleSubmit} id="login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input id="login-email" className="form-input" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input id="login-password" className="form-input" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <a href="#" className="auth-link text-sm">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? 'Signing in…' : `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>
          </form>

          <p className="text-muted text-sm" style={{ textAlign: 'center', marginTop: '1rem' }}>
            New to SevaConnect?{' '}
            <Link to={`/register?role=${role}`} className="auth-link">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
