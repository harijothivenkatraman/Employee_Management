import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineOfficeBuilding,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineLogout,
} from 'react-icons/hi';

const navItems = [
  { to: '/', icon: HiOutlineViewGrid, label: 'Dashboard' },
  { to: '/employees', icon: HiOutlineUsers, label: 'Employees' },
  { to: '/departments', icon: HiOutlineOfficeBuilding, label: 'Departments' },
  { to: '/reports', icon: HiOutlineChartBar, label: 'Reports' },
  { to: '/profile', icon: HiOutlineUser, label: 'Profile' },
  { to: '/settings', icon: HiOutlineCog, label: 'Settings' },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '24px 20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', fontWeight: '800', color: 'white'
          }}>E</div>
          <div>
            <div style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '700', letterSpacing: '-0.02em' }}>EmpManager</div>
            <div style={{ color: '#64748B', fontSize: '12px' }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '16px 0', flex: 1 }}>
        <div style={{ padding: '0 16px 8px', fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Menu
        </div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            end={to === '/'}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
          <div className="avatar" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', width: '36px', height: '36px', fontSize: '14px' }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#E2E8F0', fontSize: '14px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.username}
            </div>
            <div style={{ color: '#64748B', fontSize: '12px' }}>{user?.role}</div>
          </div>
          <button
            onClick={handleLogout}
            data-tooltip="Logout"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '6px', borderRadius: '8px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.color = '#EF4444'; e.target.style.background = 'rgba(239,68,68,0.1)'; }}
            onMouseLeave={(e) => { e.target.style.color = '#64748B'; e.target.style.background = 'none'; }}
          >
            <HiOutlineLogout size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
