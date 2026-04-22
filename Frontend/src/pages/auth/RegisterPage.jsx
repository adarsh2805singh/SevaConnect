// src/pages/auth/RegisterPage.jsx
import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/api';
import './AuthPages.css';

export default function RegisterPage() {
  const [params] = useSearchParams();
  const defaultRole = params.get('role') || 'volunteer';
  const [role, setRole] = useState(defaultRole);
  const [step, setStep] = useState('form'); // 'form' | 'pending'
  const [loading, setLoading] = useState(false);
  const { registerNGO, login, notify } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    ngoCode: '', sector: '', phone: '',
    skills: '', location: '',
  });

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      notify('error', 'Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      if (role === 'ngo') {
        // NGO Registration
        const response = await authService.registerNGO({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          organizationName: form.ngoCode,
          organizationDescription: form.sector
        });
        
        if (response?.data?.success) {
          const { token, user: userData } = response.data;
          authService.saveLoginData(token, 'ngo', userData);
          notify('success', 'NGO registered! Awaiting admin approval...');
          setStep('pending');
        }
      } else {
        // Volunteer Registration
        const response = await authService.registerVolunteer({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          skills: form.skills ? form.skills.split(',').map(s => s.trim()) : [],
          availability: form.location || 'flexible'
        });

        if (response?.data?.success) {
          const { token, user: userData } = response.data;
          authService.saveLoginData(token, 'volunteer', userData);
          notify('success', 'Registration successful! Redirecting...');
          setTimeout(() => navigate('/volunteer/dashboard'), 1000);
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      notify('error', message);
    }
    setLoading(false);
  };

  if (step === 'pending') {
    return (
      <div className="auth-page page-wrapper">
        <div className="auth-container">
          <div className="pending-card card animate-fadeUp">
            <div className="pending-icon animate-float">⏳</div>
            <h2>Registration Submitted!</h2>
            <p className="text-muted">Thank you for registering <strong style={{ color: 'var(--clr-text-primary)' }}>{form.name}</strong> on SevaConnect.</p>
            <div className="alert alert-warning" style={{ marginTop: '1.5rem' }}>
              <span>⚠️</span>
              <div>
                <strong>Awaiting Admin Approval</strong>
                <p style={{ marginTop: '.25rem', fontSize: '.82rem' }}>
                  Your NGO application is currently under review. Our team typically responds within 24–48 hours.
                  You'll receive an email at <strong style={{ color: 'var(--clr-text-primary)' }}>{form.email}</strong> once approved.
                </p>
              </div>
            </div>
            <div className="pending-steps">
              <div className="pending-step done">① Application Received</div>
              <div className="pending-step active animate-pulse">② Admin Review (in progress)</div>
              <div className="pending-step">③ Account Activated</div>
            </div>
            <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem', alignSelf: 'stretch', justifyContent: 'center' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-bg-orb" aria-hidden="true" />
      <div className="auth-container">
        <div className="auth-card card animate-fadeUp">
          {/* Header */}
          <div className="auth-header">
            <Link to="/" className="auth-back-logo">
              <span>🌍</span> <span className="gradient-text fw-700">SevaConnect</span>
            </Link>
            <h1 className="auth-title">Create your account</h1>
            <p className="text-muted text-sm">Join thousands making a difference</p>
          </div>

          {/* Role Toggle */}
          <div className="role-toggle">
            <button
              className={`role-tab ${role === 'volunteer' ? 'active' : ''}`}
              onClick={() => setRole('volunteer')}
              id="register-volunteer-tab"
              type="button"
            >
              🙋 Volunteer
            </button>
            <button
              className={`role-tab ${role === 'ngo' ? 'active' : ''}`}
              onClick={() => setRole('ngo')}
              id="register-ngo-tab"
              type="button"
            >
              🏛️ NGO
            </button>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit} id="register-form">
            <div className="form-group">
              <label className="form-label">{role === 'ngo' ? 'Organisation Name' : 'Full Name'}</label>
              <input id="reg-name" className="form-input" type="text" placeholder={role === 'ngo' ? 'Green Earth Foundation' : 'Arjun Patel'} required value={form.name} onChange={set('name')} />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input id="reg-email" className="form-input" type="email" placeholder="you@example.com" required value={form.email} onChange={set('email')} />
            </div>

            {role === 'ngo' && (
              <>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">NGO Code</label>
                    <input
                      id="reg-ngo-code"
                      className="form-input"
                      type="text"
                      placeholder="e.g. GEF001"
                      required
                      value={form.ngoCode}
                      onChange={set('ngoCode')}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sector</label>
                    <select id="reg-sector" className="form-select" value={form.sector} onChange={set('sector')} required>
                      <option value="">Select sector</option>
                      <option>Environment</option>
                      <option>Education</option>
                      <option>Humanitarian</option>
                      <option>Healthcare</option>
                      <option>Animal Welfare</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input id="reg-phone" className="form-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
                </div>
              </>
            )}

            {role === 'volunteer' && (
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Location / City</label>
                  <input id="reg-location" className="form-input" type="text" placeholder="Mumbai" value={form.location} onChange={set('location')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Skills (comma-separated)</label>
                  <input id="reg-skills" className="form-input" type="text" placeholder="Teaching, First Aid" value={form.skills} onChange={set('skills')} />
                </div>
              </div>
            )}

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input id="reg-password" className="form-input" type="password" placeholder="••••••••" required value={form.password} onChange={set('password')} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input id="reg-confirm-password" className="form-input" type="password" placeholder="••••••••" required value={form.confirmPassword} onChange={set('confirmPassword')} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading} id="register-submit-btn">
              {loading ? 'Creating account…' : role === 'ngo' ? 'Submit NGO Application' : 'Create Volunteer Account'}
            </button>
          </form>

          <p className="auth-footer-text text-muted text-sm" style={{ textAlign: 'center', marginTop: '1rem' }}>
            Already have an account?{' '}
            <Link to={`/login?role=${role}`} className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
