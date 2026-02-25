import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AdminNav from '../../components/AdminNav';
import OrderCard from '../../components/OrderCard';

const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Ready', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const { orders } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = orders.filter(o => {
    const matchSearch = search.trim() === '' ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.studentName.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'Pending') return o.status === 'pending';
    if (filter === 'In Progress') return ['picked_up', 'washing', 'drying', 'ironing'].includes(o.status);
    if (filter === 'Ready') return ['ready', 'out_for_delivery'].includes(o.status);
    if (filter === 'Delivered') return o.status === 'delivered';
    if (filter === 'Cancelled') return o.status === 'cancelled';
    return true;
  });

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin')}>
          <ChevronLeft size={20} />
        </button>
        <h2 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700 }}>All Orders</h2>
        <span style={{ marginLeft: 'auto', background: 'var(--bg)', borderRadius: 20, padding: '3px 10px', fontSize: 13, fontWeight: 700, color: 'var(--blue)' }}>
          {orders.length}
        </span>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            placeholder="Search order ID or student name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: 6, padding: '10px 16px',
        background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
        overflowX: 'auto',
      }}>
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px', borderRadius: 20,
              border: 'none',
              background: filter === f ? 'var(--blue)' : 'var(--bg)',
              color: filter === f ? '#fff' : 'var(--text-muted)',
              fontWeight: 600, fontSize: 12,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="page-content with-bottom-nav">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontWeight: 600 }}>No orders found</p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Try a different filter</p>
          </div>
        ) : (
          <div className="orders-list-grid">
            {filtered.map(order => <OrderCard key={order.id} order={order} adminView />)}
          </div>
        )}
      </div>
      <AdminNav />
    </div>
  );
}
