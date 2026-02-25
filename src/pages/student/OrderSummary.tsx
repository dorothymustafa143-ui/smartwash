import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StudentNav from '../../components/StudentNav';
import { ClothingItem, ServiceType, DeliveryType } from '../../types';

interface OrderData {
  serviceType: ServiceType;
  deliveryType: DeliveryType;
  pickupDate: string;
  pickupTime: string;
  roomNumber: string;
  instructions: string;
  items: ClothingItem[];
}

const serviceLabels: Record<ServiceType, string> = {
  wash_only: 'Wash Only',
  wash_dry: 'Wash & Dry',
  wash_dry_iron: 'Wash, Dry & Iron',
  dry_clean: 'Dry Clean',
};

export default function OrderSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { calculateOrderPrice } = useApp();

  const orderData = location.state as OrderData;

  if (!orderData) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student/request')}>
            <ChevronLeft size={20} />
          </button>
          <h2 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700 }}>Order Summary</h2>
        </div>
      </div>
    );
  }

  const totalPrice = calculateOrderPrice(orderData.serviceType, orderData.deliveryType);
  const itemCount = orderData.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleProceedToPayment = () => {
    navigate('/student/payment', { state: { orderData, totalPrice } });
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student/request')}>
          <ChevronLeft size={20} />
        </button>
        <h2 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700 }}>Order Summary</h2>
      </div>

      <div className="page-content with-bottom-nav">
        <div style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
          {/* Service Details */}
          <div className="card fade-in" style={{ marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Service Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Service Type</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{serviceLabels[orderData.serviceType]}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Pickup Date</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{orderData.pickupDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Pickup Time</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{orderData.pickupTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Delivery Type</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  {orderData.deliveryType === 'delivery' ? '🚚 Room Delivery' : '🏃 Self Pickup'}
                </span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Items ({itemCount} pieces)</h3>
            {orderData.items.map(item => (
              <div key={item.id} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: '1px solid var(--border)',
                fontSize: 14,
              }}>
                <span>{item.name}</span>
                <span style={{ fontWeight: 700, color: 'var(--blue)' }}>{item.quantity}×</span>
              </div>
            ))}
          </div>

          {/* Special Instructions */}
          {orderData.instructions && (
            <div className="card" style={{ marginBottom: 16, background: '#FEF9C3', border: '1px solid #FDE047' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 6 }}>⚠️ Special Instructions</p>
              <p style={{ fontSize: 13 }}>{orderData.instructions}</p>
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Price Breakdown</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px dashed var(--blue)' }}>
              <span style={{ fontSize: 14 }}>Service ({serviceLabels[orderData.serviceType]})</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>MK {(() => {
                const prices: Record<string, number> = {
                  wash_only: 800,
                  wash_dry: 1200,
                  wash_dry_iron: 1800,
                  dry_clean: 2500,
                };
                return prices[orderData.serviceType];
              })()}</span>
            </div>
            {orderData.deliveryType === 'delivery' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, paddingTop: 8, borderBottom: '1px dashed var(--blue)' }}>
                <span style={{ fontSize: 14 }}>Delivery Charge</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>MK 200</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12 }}>
              <span style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700 }}>Total</span>
              <span style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 800, color: 'var(--blue)' }}>MK {totalPrice}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleProceedToPayment}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 12,
              background: 'var(--blue)',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
              marginBottom: 8,
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#1E40AF')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'var(--blue)')}
          >
            <ShoppingCart size={20} />
            Proceed to Payment
          </button>

          <button
            onClick={() => navigate('/student/request')}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 12,
              background: 'transparent',
              color: 'var(--blue)',
              border: '2px solid var(--blue)',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Edit Order
          </button>
        </div>
      </div>
      <StudentNav />
    </div>
  );
}
