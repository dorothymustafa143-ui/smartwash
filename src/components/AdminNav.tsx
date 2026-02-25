import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Clock, MessageSquare, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Orders', icon: ClipboardList, path: '/admin/orders' },
  { label: 'Time Slots', icon: Clock, path: '/admin/timeslots' },
  { label: 'Feedback', icon: MessageSquare, path: '/admin/feedback' },
];

export default function AdminNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser } = useApp();

  return (
    <nav className="bottom-nav">
      {/* Desktop: Show logo and user info at top */}
      <div className="mobile-hidden" style={{ 
        padding: '0 24px 24px', 
        borderBottom: '1px solid var(--border)',
        marginBottom: 12 
      }}>
        <h2 style={{ 
          fontFamily: 'Sora', 
          fontSize: 20, 
          fontWeight: 700, 
          color: 'var(--blue)',
          marginBottom: 8
        }}>
          SmartWash
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
          Manager
        </p>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
          {currentUser?.name}
        </p>
      </div>

      {items.map(({ label, icon: Icon, path }) => {
        const active = location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
        return (
          <button
            key={path}
            className={`bottom-nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon size={22} className="nav-icon" />
            <span>{label}</span>
          </button>
        );
      })}

      {/* Desktop: Logout button at bottom */}
      <div className="mobile-hidden" style={{ marginTop: 'auto', padding: '12px 12px 0' }}>
        <button
          className="bottom-nav-item"
          onClick={() => { logout(); navigate('/login'); }}
          style={{ color: 'var(--danger)' }}
        >
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
