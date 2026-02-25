import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StudentNav from '../../components/StudentNav';

export default function FeedbackPage() {
  const { currentUser, submitFeedback, feedback, getStudentOrders } = useApp();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [sent, setSent] = useState(false);

  const orders = getStudentOrders().filter(o => o.status === 'delivered');
  const myFeedback = feedback.filter(f => f.studentId === currentUser?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !message.trim()) return;
    submitFeedback({
      studentId: currentUser.id,
      studentName: currentUser.name,
      orderId: orderId || undefined,
      message: message.trim(),
      rating,
    });
    setMessage('');
    setRating(5);
    setOrderId('');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student')}>
          <ChevronLeft size={20} />
        </button>
        <h2 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700 }}>Feedback</h2>
      </div>

      <div className="page-content with-bottom-nav">
        {sent && <div className="alert alert-success">✓ Thanks for your feedback!</div>}

        <div className="desktop-grid-2" style={{ alignItems: 'start' }}>
          {/* Feedback form */}
          <div className="card fade-in" style={{ marginBottom: 24, position: 'sticky', top: 20 }}>
            <h3 style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
              Share Your Experience
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Star rating */}
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div className="stars" style={{ gap: 8 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                    >
                      <Star
                        size={32}
                        fill={n <= rating ? '#F59E0B' : 'none'}
                        color={n <= rating ? '#F59E0B' : 'var(--border)'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {orders.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Related Order (optional)</label>
                  <select className="form-input" value={orderId} onChange={e => setOrderId(e.target.value)}>
                    <option value="">Select an order...</option>
                    {orders.map(o => (
                      <option key={o.id} value={o.id}>{o.id} – {o.pickupDate}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Your Message</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Tell us about your experience..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  style={{ resize: 'none' }}
                  required
                />
              </div>

              <button className="btn btn-primary btn-full" type="submit" style={{ height: 48 }}>
                <Send size={16} /> Submit Feedback
              </button>
            </form>
          </div>

          {/* Previous feedback */}
          <div>
            {myFeedback.length > 0 && (
              <>
                <h3 style={{ fontFamily: 'Sora', fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                  My Previous Feedback
                </h3>
                {myFeedback.map(fb => (
                  <div key={fb.id} className="card" style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} size={14} fill={n <= fb.rating ? '#F59E0B' : 'none'} color={n <= fb.rating ? '#F59E0B' : 'var(--border)'} />
                      ))}
                    </div>
                    <p style={{ fontSize: 14, marginBottom: 8 }}>{fb.message}</p>
                    {fb.orderId && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Order: {fb.orderId}</p>}
                    <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{new Date(fb.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <StudentNav />
    </div>
  );
}
