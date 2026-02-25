import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AdminNav from '../../components/AdminNav';

export default function AdminTimeSlotsPage() {
  const { timeSlots, addTimeSlot, deleteTimeSlot } = useApp();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [max, setMax] = useState(5);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleAdd = () => {
    setError('');
    if (!date) { setError('Please select a date'); return; }
    const exists = timeSlots.find(s => s.date === date && s.time === time);
    if (exists) { setError('This time slot already exists'); return; }
    addTimeSlot({ date, time, maxBookings: max });
    setDate('');
  };

  const grouped = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, typeof timeSlots>);

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin')}>
          <ChevronLeft size={20} />
        </button>
        <h2 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700 }}>Pickup Time Slots</h2>
      </div>

      <div className="page-content with-bottom-nav">
        <div className="desktop-grid-2" style={{ alignItems: 'start' }}>
          {/* Add slot form */}
          <div className="card fade-in" style={{ marginBottom: 24, position: 'sticky', top: 20 }}>
            <h4 style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
              <Plus size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Add New Time Slot
            </h4>

            {error && <div className="alert alert-error">{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Date</label>
                <input
                  className="form-input"
                  type="date"
                  min={today}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Time</label>
                <input
                  className="form-input"
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Max Bookings</label>
              <input
                className="form-input"
                type="number"
                min={1}
                max={20}
                value={max}
                onChange={e => setMax(Number(e.target.value))}
              />
            </div>

            <button className="btn btn-primary btn-full" onClick={handleAdd} style={{ height: 46 }}>
              <Plus size={16} /> Add Time Slot
            </button>
          </div>

          {/* Existing slots */}
          <div>
            {sortedDates.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Clock size={28} /></div>
                <p style={{ fontWeight: 600 }}>No time slots</p>
                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Add slots for students to book</p>
              </div>
            ) : (
              sortedDates.map(dateKey => (
            <div key={dateKey} style={{ marginBottom: 20 }}>
              <h4 style={{
                fontSize: 13, fontWeight: 700, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                marginBottom: 10,
              }}>
                {new Date(dateKey + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </h4>
              {grouped[dateKey].sort((a, b) => a.time.localeCompare(b.time)).map(slot => {
                const pct = slot.currentBookings / slot.maxBookings;
                const isFull = slot.currentBookings >= slot.maxBookings;
                return (
                  <div key={slot.id} className="card" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 12,
                      background: isFull ? '#FEE2E2' : '#EFF6FF',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Clock size={16} color={isFull ? 'var(--danger)' : 'var(--blue)'} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: isFull ? 'var(--danger)' : 'var(--blue)', marginTop: 2 }}>
                        {slot.time}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{slot.time} pickup</span>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          color: isFull ? 'var(--danger)' : 'var(--success)',
                        }}>
                          {isFull ? 'Full' : `${slot.maxBookings - slot.currentBookings} left`}
                        </span>
                      </div>
                      <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct * 100}%`,
                          background: isFull ? 'var(--danger)' : pct > 0.7 ? 'var(--warning)' : 'var(--success)',
                          borderRadius: 2, transition: 'width 0.3s',
                        }} />
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        {slot.currentBookings}/{slot.maxBookings} booked
                      </p>
                    </div>
                    <button
                      onClick={() => deleteTimeSlot(slot.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 6 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          ))
        )}
          </div>
        </div>
      </div>
      <AdminNav />
    </div>
  );
}
