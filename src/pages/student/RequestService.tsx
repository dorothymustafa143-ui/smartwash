import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StudentNav from '../../components/StudentNav';
import { ClothingItem, ServiceType, DeliveryType } from '../../types';

const services = [
  { value: 'wash_only', label: 'Wash Only', desc: 'Clean clothes, not dried/ironed', icon: '💦' },
  { value: 'wash_dry', label: 'Wash & Dry', desc: 'Washed and machine dried', icon: '☀️' },
  { value: 'wash_dry_iron', label: 'Wash, Dry & Iron', desc: 'Full service, ready to wear', icon: '👕' },
  { value: 'dry_clean', label: 'Dry Clean', desc: 'For delicates & special fabrics', icon: '✨' },
];

const commonItems = ['Shirts', 'T-shirts', 'Trousers', 'Shorts', 'Dresses', 'Blouses', 'Underwear', 'Socks', 'Sweaters', 'Jackets'];

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

export default function RequestServicePage() {
  const { currentUser, addOrder } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType>('wash_dry_iron');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('09:00');
  const [roomNumber, setRoomNumber] = useState('');
  const [instructions, setInstructions] = useState('');
  const [items, setItems] = useState<ClothingItem[]>([
    { id: '1', name: 'Shirts', quantity: 2 },
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const addItem = () => {
    if (!newItemName.trim()) return;
    setItems(prev => [...prev, { id: Date.now().toString(), name: newItemName.trim(), quantity: newItemQty }]);
    setNewItemName('');
    setNewItemQty(1);
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const updateQty = (id: string, qty: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));

  const handleSubmit = () => {
    if (!currentUser) return;
    navigate('/student/order-summary', {
      state: {
        serviceType,
        deliveryType,
        pickupDate,
        pickupTime,
        roomNumber,
        instructions,
        items,
      },
    });
  };

  if (confirmed) {
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
            Order Placed!
          </h2>
          <p className="slide-up stagger-2" style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 4 }}>
            Your order has been received
          </p>
          <div className="slide-up stagger-3" style={{
            background: 'var(--bg)',
            borderRadius: 12,
            padding: '16px 28px',
            margin: '20px 0',
            border: '1.5px dashed var(--border)',
          }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Order Reference</p>
            <p style={{ fontFamily: 'Sora', fontSize: 22, fontWeight: 700, color: 'var(--blue)', letterSpacing: '0.05em' }}>
              {orderId}
            </p>
          </div>
          <p className="slide-up stagger-4" style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>
            We'll pick up your clothes on {pickupDate} at {pickupTime}. You'll be notified as we update the status.
          </p>
          <div className="slide-up stagger-5" style={{ display: 'flex', gap: 12, width: '100%' }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate('/student/orders')}>
              View Orders
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate(`/student/orders/${orderId}/track`)}>
              Track Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/student')}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700 }}>Request Laundry</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Step {step} of 3</p>
        </div>
        {/* Progress bar */}
        <div style={{ width: 60, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${(step / 3) * 100}%`, height: '100%', background: 'var(--aqua)', borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
      </div>

      <div className="page-content with-bottom-nav">
        {/* Step 1: Service type */}
        {step === 1 && (
          <div className="fade-in">
            <h3 style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
              Select Service Type
            </h3>
            <div className="service-grid" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {services.map(s => (
                <button
                  key={s.value}
                  onClick={() => setServiceType(s.value as ServiceType)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', borderRadius: 'var(--radius)',
                    border: `2px solid ${serviceType === s.value ? 'var(--blue)' : 'var(--border)'}`,
                    background: serviceType === s.value ? '#EFF6FF' : 'var(--bg-card)',
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{s.icon}</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, color: serviceType === s.value ? 'var(--blue)' : 'var(--text)' }}>
                      {s.label}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.desc}</p>
                  </div>
                  {serviceType === s.value && (
                    <div style={{ marginLeft: 'auto' }}>
                      <CheckCircle size={20} color="var(--blue)" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <h3 style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
              Delivery Preference
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {(['delivery', 'pickup'] as DeliveryType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setDeliveryType(type)}
                  style={{
                    padding: '14px', borderRadius: 'var(--radius)',
                    border: `2px solid ${deliveryType === type ? 'var(--blue)' : 'var(--border)'}`,
                    background: deliveryType === type ? '#EFF6FF' : 'var(--bg-card)',
                    cursor: 'pointer', textAlign: 'center',
                    fontWeight: 700, fontSize: 14,
                    color: deliveryType === type ? 'var(--blue)' : 'var(--text)',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{type === 'delivery' ? '🚚' : '🏃'}</div>
                  {type === 'delivery' ? 'Deliver to Room' : 'I\'ll Pick Up'}
                </button>
              ))}
            </div>

            <button className="btn btn-primary btn-full" onClick={() => setStep(2)} style={{ height: 50 }}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Pickup details */}
        {step === 2 && (
          <div className="fade-in">
            <h3 style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
              Pickup Details
            </h3>

            <div className="form-section-grid">
              <div className="form-group">
                <label className="form-label">Pickup Date</label>
                <input
                  className="form-input"
                  type="date"
                  min={today}
                  value={pickupDate}
                  onChange={e => setPickupDate(e.target.value)}
                  required
                />
              </div>

              {deliveryType === 'delivery' && (
                <div className="form-group">
                  <label className="form-label">Room Number</label>
                  <input
                    className="form-input"
                    placeholder="e.g. L-204"
                    value={roomNumber}
                    onChange={e => setRoomNumber(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Pickup Time</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {timeSlots.map(t => (
                    <button
                      key={t}
                      onClick={() => setPickupTime(t)}
                      style={{
                        padding: '8px 14px', borderRadius: 20,
                        border: `1.5px solid ${pickupTime === t ? 'var(--blue)' : 'var(--border)'}`,
                        background: pickupTime === t ? 'var(--blue)' : 'var(--bg-card)',
                        color: pickupTime === t ? '#fff' : 'var(--text)',
                        fontWeight: 600, fontSize: 13, cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Special Instructions (optional)</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="e.g. Gentle cycle for delicate items..."
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={() => setStep(3)}
              disabled={!pickupDate}
              style={{ height: 50 }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 3: Clothing items */}
        {step === 3 && (
          <div className="fade-in">
            <h3 style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              What are you sending?
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
              Add the clothing items for your order
            </p>

            {/* Quick add */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Quick Add
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {commonItems.map(item => (
                  <button
                    key={item}
                    onClick={() => {
                      const existing = items.find(i => i.name === item);
                      if (existing) {
                        updateQty(existing.id, existing.quantity + 1);
                      } else {
                        setItems(prev => [...prev, { id: Date.now().toString(), name: item, quantity: 1 }]);
                      }
                    }}
                    style={{
                      padding: '5px 12px', borderRadius: 20,
                      border: '1.5px solid var(--aqua)', background: '#F0FDFE',
                      color: '#0369A1', fontWeight: 600, fontSize: 12, cursor: 'pointer',
                    }}
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Item list */}
            <div style={{ marginBottom: 16 }}>
              {items.map(item => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', background: 'var(--bg-card)',
                  borderRadius: 10, marginBottom: 8, border: '1px solid var(--border)',
                }}>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{item.name}</span>
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', fontWeight: 700, cursor: 'pointer' }}>-</button>
                  <span style={{ width: 28, textAlign: 'center', fontWeight: 700, fontFamily: 'Sora' }}>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--blue)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>+</button>
                  <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 4 }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Custom item */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <input
                className="form-input"
                placeholder="Other item..."
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                style={{ flex: 1 }}
                onKeyDown={e => e.key === 'Enter' && addItem()}
              />
              <input
                className="form-input"
                type="number"
                min={1}
                value={newItemQty}
                onChange={e => setNewItemQty(Number(e.target.value))}
                style={{ width: 64 }}
              />
              <button className="btn btn-aqua btn-sm" onClick={addItem}>
                <Plus size={18} />
              </button>
            </div>

            {/* Summary */}
            <div className="card" style={{ background: '#EFF6FF', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Order Summary</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 14 }}>Service</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  {services.find(s => s.value === serviceType)?.label}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 14 }}>Pickup</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{pickupDate} at {pickupTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14 }}>Delivery</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  {deliveryType === 'delivery' ? 'To your room' : 'Self pickup'}
                </span>
              </div>
              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14 }}>Total items</span>
                <span style={{ fontWeight: 700, color: 'var(--blue)', fontSize: 16 }}>
                  {items.reduce((s, i) => s + i.quantity, 0)} pieces
                </span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={handleSubmit}
              disabled={items.length === 0}
              style={{ height: 50, fontSize: 16 }}
            >
              Confirm Order 🧺
            </button>
          </div>
        )}
      </div>
      <StudentNav />
    </div>
  );
}
