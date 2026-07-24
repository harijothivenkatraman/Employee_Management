import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Panel - Branding */}
      <div style={{
        width: '50%', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', padding: '48px',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '10%', left: '15%', width: '300px', height: '300px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15), transparent 70%)',
          animation: 'pulse-soft 4s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '10%', width: '250px', height: '250px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)',
          animation: 'pulse-soft 5s ease-in-out infinite 1s',
        }} />
        <div style={{
          position: 'absolute', top: '50%', right: '30%', width: '200px', height: '200px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1), transparent 70%)',
          animation: 'pulse-soft 6s ease-in-out infinite 2s',
        }} />

        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="animate-fade-in" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '480px' }}>
          {/* Logo */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 32px', fontSize: '32px', fontWeight: '800', color: 'white',
            boxShadow: '0 8px 32px rgba(37, 99, 235, 0.3)',
          }}>E</div>

          <h1 style={{
            fontSize: '42px', fontWeight: '800', color: '#F1F5F9',
            lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '16px',
          }}>
            Employee<br />Management<br />System
          </h1>
          <p style={{ fontSize: '16px', color: '#94A3B8', lineHeight: 1.7, maxWidth: '360px', margin: '0 auto' }}>
            Streamline your workforce operations, track performance, and empower your team with our enterprise-grade platform.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
            {['JWT Auth', 'Role-Based', 'REST APIs', 'PostgreSQL'].map((f) => (
              <span key={f} style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                background: 'rgba(255,255,255,0.06)', color: '#94A3B8',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div style={{
        width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F8FAFC', padding: '48px',
      }}>
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1E293B', letterSpacing: '-0.02em' }}>
            Sign in to your account
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', marginTop: '8px' }}>
            Enter your credentials to access the dashboard.
          </p>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: '20px', padding: '14px 16px', borderRadius: '12px',
              background: '#FEF2F2', border: '1px solid #FECACA',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: '#DC2626', fontWeight: '500' }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ marginTop: '32px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="Enter your username"
                required
                style={{ height: '48px', fontSize: '15px' }}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
                style={{ height: '48px', fontSize: '15px' }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                width: '100%', height: '48px', justifyContent: 'center',
                fontSize: '15px', fontWeight: '600', borderRadius: '12px',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="32" strokeLinecap="round" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </form>

          {/* Demo credentials */}
          <div style={{
            marginTop: '24px', padding: '16px', borderRadius: '12px',
            background: '#EFF6FF', border: '1px solid #BFDBFE',
          }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#2563EB', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Demo Credentials
            </p>
            <p style={{ fontSize: '13px', color: '#1E40AF' }}>
              Username: <strong>admin</strong> &nbsp;|&nbsp; Password: <strong>admin123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
