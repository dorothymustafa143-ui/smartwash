import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle, Circle, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StudentNav from '../../components/StudentNav';
import { Order } from '../../types';

const STEPS: { key: Order['status']; label: string; desc: string; icon: string }[] = [
  { key: 'pending', label: 'Order Placed', desc: 'Your request has been received', icon: '📋' },
  { key: 'picked_up', label: 'Picked Up', desc: 'We have your clothes', icon: '🚗' },
  { key: 'washing', label: 'Washing', desc: 'Your clothes are being washed', icon: '🫧' },
  { key: 'drying', label: 'Drying', desc: 'Drying in progress', icon: '☀️' },
  { key: 'ironing', label: 'Ironing', desc: 'Being pressed & folded', icon: '👔' },
  { key: 'ready', label: 'Ready', desc: 'Your clothes are ready!', icon: '✅' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'On the way to you', icon: '🚚' },
  { key: 'delivered', label: 'Delivered', desc: 'Order complete', icon: '🎉' },
];

const STATUS_ORDER = ['pending', 'picked_up', 'washing', 'drying', 'ironing', 'ready', 'out_for_delivery', 'delivered'];

export default function TrackOrderPage() {
  const { id } = useParams<{ id: string }>();
  const { orders } = useApp();
  const navigate = useNavigate();

  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student/orders')}>
            <ChevronLeft size={20} />
          </button>
          <h2 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700 }}>Order Not Found</h2>
        </div>
      </div>
    );
  }

  if (order.status === 'cancelled') {
    return (
      <div className="page">
        <div className="page-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student/orders')}>
            <ChevronLeft size={20} />
          </button>
          <h2 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700 }}>{order.id}</h2>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon" style={{ background: '#FEE2E2' }}>
            <span style={{ fontSize: 32 }}>❌</span>
          </div>
          <p style={{ fontWeight: 700, fontSize: 18 }}>Order Cancelled</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>This order has been cancelled.</p>
        </div>
        <StudentNav />
      </div>
    );
  }

  const currentIdx = STATUS_ORDER.indexOf(order.status);
  const steps = order.serviceType === 'wash_only'
    ? STEPS.filter(s => !['drying', 'ironing'].includes(s.key))
    : order.serviceType === 'wash_dry'
    ? STEPS.filter(s => s.key !== 'ironing')
    : STEPS;

  const serviceLabel = {
    wash_only: 'Wash Only',
    wash_dry: 'Wash & Dry',
    wash_dry_iron: 'Wash, Dry & Iron',
    dry_clean: 'Dry Clean',
  }[order.serviceType];

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student/orders')}>
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700 }}>{order.id}</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{serviceLabel}</p>
        </div>
      </div>

      <div className="page-content with-bottom-nav">
        <div className="desktop-grid-2">
          {/* Left column: Progress and items */}
          <div>
            {/* Progress steps */}
            <h3 style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Progress
            </h3>

            <div className="step-progress">
              {steps.map((step, idx) => {
                const stepIdx = STATUS_ORDER.indexOf(step.key);
                const isDone = stepIdx < currentIdx;
                const isActive = stepIdx === currentIdx;
                const isUpcoming = stepIdx > currentIdx;
                const isLast = idx === steps.length - 1;

                return (
                  <div key={step.key} className="step-item">
                    <div className="step-line-wrapper">
                      <div className={`step-dot ${isDone ? 'step-dot-done' : isActive ? 'step-dot-active' : 'step-dot-upcoming'}`}>
                        {isDone ? <CheckCircle size={16} /> : isActive ? <span>{idx + 1}</span> : <Circle size={14} />}
                      </div>
                      {!isLast && (
                        <div className={`step-connector ${isDone ? 'step-connector-done' : 'step-connector-upcoming'}`} />
                      )}
                    </div>
                    <div className="step-content">
                      <p className={`step-title ${isUpcoming ? 'step-title-upcoming' : ''}`}>
                        {step.label}
                      </p>
                      <p className="step-time">{isActive ? '⏳ In progress' : isDone ? '✓ Completed' : step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Items */}
            <div className="divider" />
            <h3 style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Items ({order.items.reduce((s, i) => s + i.quantity, 0)} pieces)
            </h3>
            {order.items.map(item => (
              <div key={item.id} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: '1px solid var(--border)',
                fontSize: 14,
              }}>
                <span>{item.name}</span>
                <span style={{ fontWeight: 700 }}>{item.quantity}×</span>
              </div>
            ))}

            {order.specialInstructions && (
              <>
                <div className="divider" />
                <div className="card" style={{ background: '#FEF9C3', border: '1px solid #FDE047' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#92400E', marginBottom: 4 }}>Special Instructions</p>
                  <p style={{ fontSize: 14 }}>{order.specialInstructions}</p>
                </div>
              </>
            )}
          </div>

          {/* Right column: Summary card */}
          <div>
            <div className="card fade-in" style={{ background: 'linear-gradient(135deg, #1E3A8A, #0E1F5A)', marginBottom: 24, height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 4 }}>Current Status</p>
                  <p style={{ fontFamily: 'Sora', fontSize: 20, fontWeight: 700, color: '#fff' }}>
                    {STEPS.find(s => s.key === order.status)?.label}
                  </p>
                </div>
                <span style={{ fontSize: 36 }}>
                  {STEPS.find(s => s.key === order.status)?.icon}
                </span>
              </div>
              {order.estimatedDelivery && order.status !== 'delivered' && (
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                  <Clock size={14} />
                  Estimated delivery: {order.estimatedDelivery}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <StudentNav />
    </div>
  );
}
