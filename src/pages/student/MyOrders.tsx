import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shirt } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StudentNav from '../../components/StudentNav';
import OrderCard from '../../components/OrderCard';

const tabs = ['All', 'Active', 'Completed', 'Cancelled'];

export default function MyOrdersPage() {
  const { getStudentOrders, cancelOrder } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('All');
  const orders = getStudentOrders();

  const filtered = orders.filter(o => {
    if (tab === 'Active') return !['delivered', 'cancelled'].includes(o.status);
    if (tab === 'Completed') return o.status === 'delivered';
    if (tab === 'Cancelled') return o.status === 'cancelled';
    return true;
  });

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student')}>
          <ChevronLeft size={20} />
        </button>
        <h2 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700 }}>My Orders</h2>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 4,
        padding: '12px 16px',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        overflowX: 'auto',
      }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '7px 16px',
              borderRadius: 20,
              border: 'none',
              background: tab === t ? 'var(--blue)' : 'var(--bg)',
              color: tab === t ? '#fff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {t}
            {t === 'Active' && orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length > 0 && (
              <span style={{
                marginLeft: 6, background: 'var(--aqua)', color: '#fff',
                borderRadius: 10, padding: '1px 6px', fontSize: 11,
              }}>
                {orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="page-content with-bottom-nav">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Shirt size={28} /></div>
            <p style={{ fontWeight: 600, color: 'var(--text)' }}>No orders here</p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              {tab === 'All' ? 'Submit your first laundry request' : `No ${tab.toLowerCase()} orders`}
            </p>
            {tab === 'All' && (
              <button className="btn btn-primary" onClick={() => navigate('/student/request')}>
                Request Service
              </button>
            )}
          </div>
        ) : (
          <div className="orders-list-grid">
            {filtered.map(order => (
              <div key={order.id}>
                <OrderCard order={order} showTrack />
                {!['delivered', 'cancelled'].includes(order.status) && (
                  <div style={{ display: 'flex', gap: 8, marginTop: -4, marginBottom: 16, paddingLeft: 4 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: 13, color: 'var(--blue)' }}
                      onClick={() => navigate(`/student/orders/${order.id}/track`)}
                    >
                      Track order →
                    </button>
                    {order.status === 'pending' && (
                      <button
                        className="btn btn-ghost btn-sm"
                      style={{ fontSize: 13, color: 'var(--danger)' }}
                      onClick={() => {
                        if (confirm('Cancel this order?')) cancelOrder(order.id);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          </div>
        )}
      </div>
      <StudentNav />
    </div>
  );
}
