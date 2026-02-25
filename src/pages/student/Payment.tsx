import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Smartphone, CreditCard, CheckCircle, Loader } from 'lucide-react';
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

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, addOrder, processPayment, showToast } = useApp();

  const { orderData, totalPrice } = location.state as { orderData: OrderData; totalPrice: number };

  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!currentUser || !orderData) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student/orders')}>
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (paymentMethod === 'mobile_money') {
      if (!phone.trim()) {
        showToast('Please enter your phone number', 'error');
        return;
      }
    } else {
      if (!cardNumber.trim() || !cardName.trim() || !expiry.trim() || !cvv.trim()) {
        showToast('Please fill in all card details', 'error');
        return;
      }
    }

    setLoading(true);

    // Simulate payment processing
    await new Promise(r => setTimeout(r, 1500));

    // Create order
    const order = addOrder({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentPhone: currentUser.phone,
      hostel: currentUser.hostel || '',
      roomNumber: orderData.roomNumber,
      serviceType: orderData.serviceType,
      deliveryType: orderData.deliveryType,
      pickupDate: orderData.pickupDate,
      pickupTime: orderData.pickupTime,
      specialInstructions: orderData.instructions,
      estimatedDelivery: new Date(new Date(orderData.pickupDate).getTime() + 2 * 86400000).toISOString().split('T')[0],
      items: orderData.items,
    });

    // Process payment
    processPayment(order.id, paymentMethod);

    setOrderId(order.id);
    setSuccess(true);
    setLoading(false);

    showToast('Payment successful! Order placed.', 'success');
  };

  if (success) {
    return (
      <div className="page">
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          textAlign: 'center',
        }}>
          <div className="fade-in" style={{
            width: 96, height: 96, borderRadius: '50%',
            background: '#D1FAE5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24,
          }}>
            <CheckCircle size={52} color="#10B981" />
          </div>
          <h2 className="slide-up stagger-1" style={{ fontFamily: 'Sora', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
            Payment Successful!
          </h2>
          <p className="slide-up stagger-2" style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 20 }}>
            Your order has been placed
          </p>
          <div className="slide-up stagger-3" style={{
            background: 'var(--bg)',
            borderRadius: 12,
            padding: '16px 28px',
            marginBottom: 32,
          }}>
            <p style={{ fontFamily: 'Sora', fontSize: 20, fontWeight: 700, color: 'var(--blue)' }}>{orderId}</p>
          </div>
          <button
            onClick={() => navigate('/student/orders')}
            style={{
              padding: '12px 32px',
              borderRadius: 10,
              background: 'var(--blue)',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            View My Orders
          </button>
        </div>
        <StudentNav />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </button>
        <h2 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700 }}>Payment</h2>
      </div>

      <div className="page-content with-bottom-nav">
        <div style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
          {/* Price Display */}
          <div className="card fade-in" style={{ marginBottom: 24, textAlign: 'center', background: 'linear-gradient(135deg, #1E3A8A, #0E1F5A)', color: '#fff' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Total Amount Due</p>
            <p style={{ fontFamily: 'Sora', fontSize: 36, fontWeight: 800, marginBottom: 4 }}>MK {totalPrice}</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Payment required to confirm order</p>
          </div>

          {/* Payment Method Selection */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Payment Method
            </h3>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <button
                onClick={() => setPaymentMethod('mobile_money')}
                style={{
                  flex: 1,
                  padding: '16px 12px',
                  borderRadius: 12,
                  border: `2px solid ${paymentMethod === 'mobile_money' ? 'var(--blue)' : 'var(--border)'}`,
                  background: paymentMethod === 'mobile_money' ? '#EFF6FF' : 'var(--bg-card)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                }}
              >
                <Smartphone size={24} color={paymentMethod === 'mobile_money' ? 'var(--blue)' : 'var(--text-muted)'} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>Mobile Money</span>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                style={{
                  flex: 1,
                  padding: '16px 12px',
                  borderRadius: 12,
                  border: `2px solid ${paymentMethod === 'card' ? 'var(--blue)' : 'var(--border)'}`,
                  background: paymentMethod === 'card' ? '#EFF6FF' : 'var(--bg-card)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                }}
              >
                <CreditCard size={24} color={paymentMethod === 'card' ? 'var(--blue)' : 'var(--text-muted)'} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>Card</span>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePayment}>
            {paymentMethod === 'mobile_money' ? (
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="form-group">
                  <label className="form-label">Mobile Money Number</label>
                  <input
                    className="form-input"
                    type="tel"
                    placeholder="+265 9XX XXX XXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                  />
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                  You will receive a prompt on your phone to complete the payment
                </p>
              </div>
            ) : (
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="John Mwamba"
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Expiry (MM/YY)</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="12/25"
                      value={expiry}
                      onChange={e => setExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 12,
                background: 'var(--blue)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: 16,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <>
                  <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  Processing...
                </>
              ) : (
                <>
                  Pay MK {totalPrice}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <StudentNav />
    </div>
  );
}
