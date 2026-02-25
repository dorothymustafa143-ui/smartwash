import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, PlusCircle, MessageSquare, User, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

const items = [
  { label: 'Home', icon: Home, path: '/student' },
  { label: 'Orders', icon: ClipboardList, path: '/student/orders' },
  { label: 'Request', icon: PlusCircle, path: '/student/request' },
  { label: 'Feedback', icon: MessageSquare, path: '/student/feedback' },
  { label: 'Profile', icon: User, path: '/student/profile' },
];

export default function StudentNav() {
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
          Student
        </p>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
          {currentUser?.name}
        </p>
      </div>

      {items.map(({ label, icon: Icon, path }) => {
        const active = location.pathname === path;
        const isCenter = label === 'Request';
        return (
          <button
            key={path}
            className={`bottom-nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(path)}
            style={isCenter ? { position: 'relative', top: -10 } : {}}
          >
            {isCenter ? (
              <div className="desktop-hidden" style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: active ? 'var(--blue)' : 'var(--aqua)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(6,182,212,0.4)',
              }}>
                <Icon size={24} color="#fff" />
              </div>
            ) : null}
            {/* Desktop shows all items the same way */}
            <div className="mobile-hidden" style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
              <Icon size={22} className="nav-icon" />
              <span>{label}</span>
            </div>
            {/* Mobile shows icons + labels (except center button) */}
            {!isCenter && (
              <div className="desktop-hidden" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Icon size={22} className="nav-icon" />
                <span>{label}</span>
              </div>
            )}
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
