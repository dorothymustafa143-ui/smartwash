import { useNavigate } from 'react-router-dom';
import { Shirt, ClipboardList, History, Bell, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StudentNav from '../../components/StudentNav';
import OrderCard from '../../components/OrderCard';

export default function StudentDashboard() {
  const { currentUser, logout, getStudentOrders, showToast } = useApp();
  const navigate = useNavigate();
  const orders = getStudentOrders();
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const recentOrders = orders.slice(0, 3);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="page">
      {/* Hero header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #0E1F5A 100%)',
        padding: '24px 20px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(6,182,212,0.12)',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 10 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 }}>
              {getGreeting()} 👋
            </p>
            <h2 style={{ fontFamily: 'Sora', fontSize: 22, fontWeight: 700, color: '#fff' }}>
              {currentUser?.name.split(' ')[0]}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 2 }}>
              {currentUser?.hostel}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              className="btn btn-ghost btn-sm" 
              style={{ color: 'rgba(255,255,255,0.7)' }}
              onClick={() => showToast('You have no new notifications', 'notification')}
              title="Notifications"
            >
              <Bell size={20} />
            </button>
            <button
              className="btn btn-ghost btn-sm desktop-hidden"
              style={{ color: 'rgba(255,255,255,0.7)' }}
              onClick={() => { logout(); navigate('/login'); }}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Active orders badge */}
        {activeOrders.length > 0 && (
          <div className="fade-in" style={{
            marginTop: 20,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            padding: '12px 16px',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Active orders</p>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 20, fontFamily: 'Sora' }}>
                {activeOrders.length}
              </p>
            </div>
            <button
              className="btn btn-sm"
              style={{ background: 'var(--aqua)', color: '#fff' }}
              onClick={() => navigate('/student/orders')}
            >
              View →
            </button>
          </div>
        )}
      </div>

      <div className="page-content with-bottom-nav">
        {/* Quick actions */}
        <h3 style={{ fontFamily: 'Sora', fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
          Quick Actions
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }} className="desktop-grid-3">
          {[
            { icon: Shirt, label: 'Request Service', color: '#1E3A8A', bg: '#EFF6FF', path: '/student/request' },
            { icon: ClipboardList, label: 'My Orders', color: '#0369A1', bg: '#E0F2FE', path: '/student/orders' },
            { icon: History, label: 'History', color: '#065F46', bg: '#D1FAE5', path: '/student/orders' },
          ].map(({ icon: Icon, label, color, bg, path }) => (
            <button
              key={label}
              className="card fade-in"
              onClick={() => navigate(path)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 10, padding: '16px 8px', cursor: 'pointer',
                border: 'none', transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={22} color={color} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', textAlign: 'center', lineHeight: 1.3 }}>
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Recent orders */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontFamily: 'Sora', fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Recent Orders
          </h3>
          <button
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 13, color: 'var(--blue)' }}
            onClick={() => navigate('/student/orders')}
          >
            See all
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Shirt size={28} /></div>
            <p style={{ fontWeight: 600, color: 'var(--text)' }}>No orders yet</p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              Submit your first laundry request
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/student/request')}>
              Request Service
            </button>
          </div>
        ) : (
          recentOrders.map(order => (
            <OrderCard key={order.id} order={order} showTrack />
          ))
        )}
      </div>

      <StudentNav />
    </div>
  );
}
