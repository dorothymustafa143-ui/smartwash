import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AdminNav from '../../components/AdminNav';
import OrderCard from '../../components/OrderCard';

export default function AdminDashboard() {
  const { currentUser, logout, orders, feedback, getTotalAdminEarnings } = useApp();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.pickupDate === today || o.createdAt.startsWith(today));
  const totalEarnings = getTotalAdminEarnings();

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => ['picked_up', 'washing', 'drying', 'ironing'].includes(o.status)).length,
    ready: orders.filter(o => o.status === 'ready').length,
    delivering: orders.filter(o => o.status === 'out_for_delivery').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  const recent = orders.slice(0, 5);
  const avgRating = feedback.length
    ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
    : 'N/A';

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0E1F5A, #1E3A8A)',
        padding: '24px 20px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(6,182,212,0.1)',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 10 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginBottom: 2 }}>Manager</p>
            <h2 style={{ fontFamily: 'Sora', fontSize: 22, fontWeight: 700, color: '#fff' }}>
              {currentUser?.name}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            className="btn btn-ghost btn-sm desktop-hidden"
            style={{ color: 'rgba(255,255,255,0.7)' }}
            onClick={() => { logout(); navigate('/login'); }}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Key stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 20 }} className="desktop-grid-3">
          {[
            { label: 'Total Orders', value: stats.total },
            { label: 'In Progress', value: stats.inProgress },
            { label: 'Ready', value: stats.ready },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '12px 10px',
              border: '1px solid rgba(255,255,255,0.12)',
              textAlign: 'center',
            }}>
              <p style={{ fontFamily: 'Sora', fontSize: 24, fontWeight: 700, color: '#fff' }}>{value}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 500, marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="page-content with-bottom-nav">
        {/* Earnings section */}
        <h3 style={{ fontFamily: 'Sora', fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
          Your Earnings
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}>
            <p style={{ fontSize: 12, opacity: 0.9, marginBottom: 8 }}>Total Earnings (After Fees)</p>
            <p style={{ fontFamily: 'Sora', fontSize: 28, fontWeight: 700 }}>MK {totalEarnings.toLocaleString()}</p>
            <p style={{ fontSize: 11, opacity: 0.85, marginTop: 4 }}>From all completed orders</p>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: '#fff' }}>
            <p style={{ fontSize: 12, opacity: 0.9, marginBottom: 8 }}>Completed Orders</p>
            <p style={{ fontFamily: 'Sora', fontSize: 28, fontWeight: 700 }}>
              {orders.filter(o => o.payment?.status === 'completed').length}
            </p>
            <p style={{ fontSize: 11, opacity: 0.85, marginTop: 4 }}>Paid by customers</p>
          </div>
        </div>

        {/* Status breakdown */}
        <h3 style={{ fontFamily: 'Sora', fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
          Order Status
        </h3>

        <div className="status-cards-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Pending', value: stats.pending, color: '#92400E', bg: '#FEF3C7' },
            { label: 'In Progress', value: stats.inProgress, color: '#0369A1', bg: '#E0F2FE' },
            { label: 'Out for Delivery', value: stats.delivering, color: '#991B1B', bg: '#FEE2E2' },
            { label: 'Delivered Today', value: orders.filter(o => o.status === 'delivered' && o.updatedAt.startsWith(today)).length, color: '#065F46', bg: '#D1FAE5' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="card" style={{ background: bg }}>
              <p style={{ fontFamily: 'Sora', fontSize: 30, fontWeight: 700, color }}>{value}</p>
              <p style={{ fontSize: 12, color, fontWeight: 600, opacity: 0.8 }}>{label}</p>
            </div>
          ))}
          
          {/* Average rating card */}
          <div className="card fade-in" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 36 }}>⭐</div>
            <div>
              <p style={{ fontFamily: 'Sora', fontSize: 28, fontWeight: 700, color: '#F59E0B' }}>{avgRating}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Average rating • {feedback.length} reviews</p>
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontFamily: 'Sora', fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Recent Orders
          </h3>
          <button
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 13, color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 2 }}
            onClick={() => navigate('/admin/orders')}
          >
            View all <ChevronRight size={14} />
          </button>
        </div>

        <div className="orders-list-grid">
          {recent.map(order => (
            <OrderCard key={order.id} order={order} adminView />
          ))}
        </div>
      </div>

      <AdminNav />
    </div>
  );
}
