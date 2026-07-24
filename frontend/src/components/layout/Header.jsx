import { HiOutlineSearch, HiOutlineBell } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

export default function Header({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 32px', background: 'white',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 40,
      backdropFilter: 'blur(12px)',
      backgroundColor: 'rgba(255,255,255,0.9)',
    }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <HiOutlineSearch size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search..."
            className="form-input"
            style={{ paddingLeft: '40px', width: '240px', height: '40px', fontSize: '13px', borderRadius: '12px' }}
          />
        </div>

        {/* Notifications */}
        <button style={{
          position: 'relative', background: '#F1F5F9', border: 'none',
          borderRadius: '12px', padding: '10px', cursor: 'pointer',
          transition: 'all 0.2s', color: '#64748B',
        }}>
          <HiOutlineBell size={20} />
          <span style={{
            position: 'absolute', top: '6px', right: '6px',
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#EF4444', border: '2px solid white',
          }} />
        </button>

        {/* Profile */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '6px 12px 6px 6px', borderRadius: '12px',
          background: '#F8FAFC', border: '1px solid var(--border)',
        }}>
          <div className="avatar" style={{
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            width: '32px', height: '32px', fontSize: '13px',
          }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {user?.username}
          </span>
        </div>
      </div>
    </header>
  );
}
