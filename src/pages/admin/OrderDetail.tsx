import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, MapPin, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AdminNav from '../../components/AdminNav';
import { Order } from '../../types';

const STATUS_OPTIONS: { value: Order['status']; label: string }[] = [
  { value: 'pending', label: '📋 Pending' },
  { value: 'picked_up', label: '🚗 Picked Up' },
  { value: 'washing', label: '🫧 Washing' },
  { value: 'drying', label: '☀️ Drying' },
  { value: 'ironing', label: '👔 Ironing' },
  { value: 'ready', label: '✅ Ready' },
  { value: 'out_for_delivery', label: '🚚 Out for Delivery' },
  { value: 'delivered', label: '🎉 Delivered' },
  { value: 'cancelled', label: '❌ Cancelled' },
];

const SERVICE_LABELS: Record<string, string> = {
  wash_only: 'Wash Only',
  wash_dry: 'Wash & Dry',
  wash_dry_iron: 'Wash, Dry & Iron',
  dry_clean: 'Dry Clean',
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { orders, updateOrderStatus } = useApp();
  const navigate = useNavigate();

  const order = orders.find(o => o.id === id);
  if (!order) return <div className="page"><div className="empty-state"><p>Order not found</p></div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/orders')}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700 }}>{order.id}</h2>
          <span className={`badge badge-${order.status}`}>{order.status.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="page-content with-bottom-nav">
        <div className="desktop-grid-2">
          {/* Left column: Order details */}
          <div>
            {/* Student info */}
            <div className="card fade-in" style={{ marginBottom: 16 }}>
              <h4 style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Student Details</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--blue), var(--aqua))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: 18,
                  }}>
                    {order.studentName.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 16 }}>{order.studentName}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 13 }}>
                      <Phone size={12} /> {order.studentPhone}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-muted)' }}>
                    <MapPin size={14} /> {order.hostel}{order.roomNumber && `, Room ${order.roomNumber}`}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-muted)' }}>
                    <Calendar size={14} /> {order.pickupDate} at {order.pickupTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Order info */}
            <div className="card" style={{ marginBottom: 16 }}>
              <h4 style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Order Info</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Service</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{SERVICE_LABELS[order.serviceType]}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Delivery</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{order.deliveryType === 'delivery' ? '🚚 Room Delivery' : '🏃 Self Pickup'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Items</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  {order.items.reduce((s, i) => s + i.quantity, 0)} pieces
                </span>
              </div>
            </div>

            {/* Items list */}
            <div className="card" style={{ marginBottom: 16 }}>
              <h4 style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Clothing Items</h4>
              {order.items.map(item => (
                <div key={item.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid var(--border)',
                  fontSize: 14,
                }}>
                  <span>{item.name}</span>
                  <span style={{ fontWeight: 700, color: 'var(--blue)' }}>{item.quantity}×</span>
                </div>
              ))}
              {order.specialInstructions && (
                <div style={{ marginTop: 12, padding: '10px', background: '#FEF9C3', borderRadius: 8 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>⚠️ Special Instructions</p>
                  <p style={{ fontSize: 13 }}>{order.specialInstructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right column: Update status */}
          {order.status !== 'cancelled' && (
            <div className="card" style={{ marginBottom: 16, height: 'fit-content' }}>
              <h4 style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Update Status</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {STATUS_OPTIONS.filter(s => s.value !== 'pending' || order.status === 'pending').map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updateOrderStatus(order.id, value)}
                    style={{
                      padding: '12px 16px', borderRadius: 10,
                      border: `2px solid ${order.status === value ? 'var(--blue)' : 'var(--border)'}`,
                      background: order.status === value ? '#EFF6FF' : 'var(--bg-card)',
                      color: order.status === value ? 'var(--blue)' : 'var(--text)',
                      fontWeight: order.status === value ? 700 : 500,
                      fontSize: 14, cursor: 'pointer',
                      textAlign: 'left', transition: 'all 0.15s',
                    }}
                  >
                    {label}
                    {order.status === value && ' ← Current'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <AdminNav />
    </div>
  );
}
