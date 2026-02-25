import { useNavigate } from 'react-router-dom';
import { ChevronRight, MapPin, Calendar } from 'lucide-react';
import { Order, ServiceType } from '../types';

const SERVICE_LABELS: Record<ServiceType, string> = {
  wash_only: 'Wash Only',
  wash_dry: 'Wash & Dry',
  wash_dry_iron: 'Wash, Dry & Iron',
  dry_clean: 'Dry Clean',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  picked_up: 'Picked Up',
  washing: 'Washing',
  drying: 'Drying',
  ironing: 'Ironing',
  ready: 'Ready',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

interface Props {
  order: Order;
  showTrack?: boolean;
  adminView?: boolean;
}

export default function OrderCard({ order, showTrack = false, adminView = false }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="card"
      onClick={() => adminView
        ? navigate(`/admin/orders/${order.id}`)
        : showTrack && navigate(`/student/orders/${order.id}/track`)
      }
      style={{ cursor: 'pointer', marginBottom: 12, transition: 'transform 0.15s', }}
      onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
      onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{order.id}</p>
          <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16 }}>
            {SERVICE_LABELS[order.serviceType]}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className={`badge badge-${order.status}`}>
            {STATUS_LABELS[order.status]}
          </span>
          {(showTrack || adminView) && <ChevronRight size={16} color="var(--text-light)" />}
        </div>
      </div>

      {adminView && (
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
          {order.studentName}
        </p>
      )}

      {adminView && order.payment?.status === 'completed' && (
        <div style={{ marginBottom: 10, padding: 10, background: 'var(--bg)', borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: 'var(--text-muted)' }}>Customer Paid:</span>
            <span style={{ fontWeight: 700 }}>MK {order.totalPrice}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: 'var(--text-muted)' }}>Platform Fee (2%):</span>
            <span style={{ fontWeight: 700, color: '#F59E0B' }}>-MK {order.payment.platformFee || 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderTop: '1px solid var(--border)', paddingTop: 6 }}>
            <span style={{ fontWeight: 700 }}>Your Earning:</span>
            <span style={{ fontWeight: 800, color: 'var(--blue)' }}>MK {order.payment.adminEarnings || 0}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-muted)' }}>
          <Calendar size={14} />
          {order.pickupDate} at {order.pickupTime}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-muted)' }}>
          <MapPin size={14} />
          {order.deliveryType === 'delivery' ? 'Delivery to room' : 'Self pickup'}
        </div>
      </div>

      {order.items.length > 0 && (
        <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {order.items.map(item => (
            <span key={item.id} style={{
              background: 'var(--bg)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: 12,
              color: 'var(--text-muted)',
              fontWeight: 500,
            }}>
              {item.quantity}× {item.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
