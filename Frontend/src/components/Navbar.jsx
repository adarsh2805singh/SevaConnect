// src/components/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';
  return (
    <button
      className="theme-toggle btn-icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      id="theme-toggle-btn"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

function UserDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const roleColor = { volunteer: '#38bdf8', ngo: '#a78bfa', admin: '#f87171' }[user.role] || '#38bdf8';

  return (
    <div className="user-dropdown-wrap" ref={ref}>
      <button className="user-chip" onClick={() => setOpen(!open)} id="user-menu-btn">
        <div className="user-avatar" style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}99)` }}>
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div className="user-chip-info">
          <span className="user-chip-name">{user.name?.split(' ')[0]}</span>
          <span className="user-chip-role">{user.role}</span>
        </div>
        <svg className={`chevron ${open ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div className="user-dropdown-menu anim-scale-in">
          <div className="dropdown-header">
            <div className="user-avatar lg" style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}99)` }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="fw-700 text-sm">{user.name}</div>
              <div className="text-dimmed text-xs">{user.email}</div>
              <span className="badge badge-brand mt-xs">{user.role}</span>
            </div>
          </div>
          <div className="dropdown-divider" />
          <button className="dropdown-item danger" onClick={() => { onLogout(); setOpen(false); }} id="logout-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  const navLinks = {
    ngo:       [{ label: 'Dashboard', to: '/ngo/dashboard' }, { label: 'My Tasks', to: '/ngo/tasks' }],
    volunteer: [{ label: 'Explore Tasks', to: '/volunteer/dashboard' }],
    admin:     [{ label: 'NGO Management', to: '/admin/panel' }],
  }[user?.role] || [];

  return (
    <nav className="navbar glass">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-globe">🌍</span>
          <span className="logo-text">
            <span className="gradient-text">Seva</span>Connect
          </span>
        </Link>

        {/* Desktop links */}
        {navLinks.length > 0 && (
          <div className="navbar-links">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className={`nav-link ${isActive(l.to) ? 'active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="navbar-right">
          <ThemeToggle />
          {user ? (
            <UserDropdown user={user} onLogout={handleLogout} />
          ) : (
            <div className="auth-btns">
              <Link to="/login"    className="btn btn-ghost btn-sm"    id="signin-btn">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm"  id="getstarted-btn">Get Started</Link>
            </div>
          )}
          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            id="hamburger-btn"
          >
            <span/><span/><span/>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-drawer anim-fade-up">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className={`mobile-link ${isActive(l.to) ? 'active' : ''}`}>
              {l.label}
            </Link>
          ))}
          <div className="mobile-divider" />
          {user ? (
            <button className="btn btn-ghost" onClick={() => { handleLogout(); setMenuOpen(false); }} style={{ width: '100%' }}>Sign Out</button>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost"   onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
