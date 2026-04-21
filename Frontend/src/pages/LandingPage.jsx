// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import './LandingPage.css';

const stats = [
  { label: 'Active NGOs', value: '1,200+', icon: '🏛️' },
  { label: 'Volunteers', value: '45,000+', icon: '🙋' },
  { label: 'Tasks Completed', value: '87,000+', icon: '✅' },
  { label: 'Cities Covered', value: '120+', icon: '🗺️' },
];

const features = [
  {
    icon: '🎯',
    title: 'Smart Task Matching',
    desc: 'AI-powered matching connects volunteers to causes that align with their skills, location, and availability.',
  },
  {
    icon: '⚡',
    title: 'Urgency Prioritization',
    desc: 'Color-coded urgency levels ensure critical tasks get the attention they deserve — fast.',
  },
  {
    icon: '🛡️',
    title: 'Verified NGOs',
    desc: 'Every NGO is manually reviewed and approved by our admin team before going live on the platform.',
  },
  {
    icon: '📊',
    title: 'Impact Dashboard',
    desc: 'Real-time dashboards for NGOs and volunteers to track tasks, applications, and community impact.',
  },
  {
    icon: '🤝',
    title: 'Seamless Coordination',
    desc: 'Streamlined application flow with instant status updates and communication channels.',
  },
  {
    icon: '🌐',
    title: 'Nationwide Reach',
    desc: 'Connect across 120+ cities. From flood relief to education — every cause finds its champion.',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Volunteer — Mumbai',
    avatar: 'PS',
    quote: 'SevaConnect made it incredibly easy to find meaningful volunteer work near me. The urgency system is brilliant — I knew exactly where I was needed most.'
  },
  {
    name: 'Green Earth Foundation',
    role: 'NGO Partner',
    avatar: 'GE',
    quote: 'We went from struggling to find volunteers to having a waiting list. The platform handles everything so we can focus on our mission.'
  },
  {
    name: 'Aryan Mehta',
    role: 'Student Volunteer — Delhi',
    avatar: 'AM',
    quote: 'Applied to 3 NGO tasks in my first week. The interface is so clean and the whole experience feels premium. Highly recommend!'
  },
];

export default function LandingPage() {
  return (
    <div className="landing-page page-wrapper">
      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-bg-grid" aria-hidden="true" />
        <div className="hero-gradient-orb orb-1" aria-hidden="true" />
        <div className="hero-gradient-orb orb-2" aria-hidden="true" />

        <div className="container hero-content">
          <div className="hero-badge animate-fadeUp">
            <span className="badge badge-brand">🌍 Connecting Communities</span>
          </div>
          <h1 className="hero-title animate-fadeUp delay-100">
            Volunteer for <span className="gradient-text">impact.</span>
            <br />Lead with <span className="gradient-text">purpose.</span>
          </h1>
          <p className="hero-subtitle animate-fadeUp delay-200">
            SevaConnect bridges passionate volunteers with verified NGOs tackling the
            world's most pressing problems — from disaster relief to digital literacy.
          </p>

          <div className="hero-role-cards animate-fadeUp delay-300">
            {/* NGO Card */}
            <div className="role-card" id="ngo-role-card">
              <div className="role-card-icon ngo-icon">🏛️</div>
              <div className="role-card-body">
                <h2>For NGOs</h2>
                <p>Post tasks, manage volunteers, and amplify your impact with powerful dashboard tools.</p>
                <ul className="role-features">
                  <li>✔ Post unlimited tasks</li>
                  <li>✔ Track applicants in real-time</li>
                  <li>✔ Admin-verified platform</li>
                </ul>
              </div>
              <div className="role-card-actions">
                <Link to="/register?role=ngo" className="btn btn-primary btn-lg" id="ngo-register-btn">
                  Register as NGO
                </Link>
                <Link to="/login?role=ngo" className="btn btn-secondary" id="ngo-login-btn">
                  Sign In
                </Link>
              </div>
            </div>

            {/* Divider */}
            <div className="role-divider">
              <div className="divider-line" />
              <span className="divider-or">or</span>
              <div className="divider-line" />
            </div>

            {/* Volunteer Card */}
            <div className="role-card" id="volunteer-role-card">
              <div className="role-card-icon volunteer-icon">🙋</div>
              <div className="role-card-body">
                <h2>For Volunteers</h2>
                <p>Discover meaningful tasks near you, apply instantly, and build a portfolio of good deeds.</p>
                <ul className="role-features">
                  <li>✔ Browse 1000+ active tasks</li>
                  <li>✔ Urgency-sorted feed</li>
                  <li>✔ One-click applications</li>
                </ul>
              </div>
              <div className="role-card-actions">
                <Link to="/register?role=volunteer" className="btn btn-primary btn-lg" id="volunteer-register-btn">
                  Join as Volunteer
                </Link>
                <Link to="/login?role=volunteer" className="btn btn-secondary" id="volunteer-login-btn">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-strip">
            {stats.map((s, i) => (
              <div key={i} className="stat-item animate-fadeUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="stat-item-icon">{s.icon}</span>
                <span className="stat-item-value">{s.value}</span>
                <span className="stat-item-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="badge badge-purple mb-2">✦ Platform Features</span>
            <h2 style={{ fontSize: '2.25rem' }}>Everything you need to <span className="gradient-text">make an impact</span></h2>
            <p className="text-muted mt-1">Built for NGOs and volunteers who want results, not complexity.</p>
          </div>
          <div className="grid grid-3 mt-4">
            {features.map((f, i) => (
              <div key={i} className="feature-card card animate-fadeUp" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p className="text-muted text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 style={{ fontSize: '2rem' }}>Voices from the <span className="gradient-text">community</span></h2>
          </div>
          <div className="grid grid-3 mt-4">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card card animate-fadeUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="user-avatar" style={{ background: 'linear-gradient(135deg,var(--clr-brand-600),var(--clr-accent-600))' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="fw-600 text-sm">{t.name}</div>
                    <div className="text-muted text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-glow-orb" aria-hidden="true" />
            <h2>Ready to make a difference?</h2>
            <p className="text-muted">Join thousands of volunteers and NGOs already creating impact on SevaConnect.</p>
            <div className="cta-buttons">
              <Link to="/register?role=volunteer" className="btn btn-primary btn-xl" id="cta-volunteer-btn">
                Start Volunteering Free
              </Link>
              <Link to="/register?role=ngo" className="btn btn-secondary btn-xl" id="cta-ngo-btn">
                Register Your NGO
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="logo-icon">🌍</span>
              <span className="logo-text fw-700"><span className="gradient-text">Seva</span>Connect</span>
            </div>
            <p className="text-muted text-sm">© 2026 SevaConnect. Built to connect hearts with causes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
