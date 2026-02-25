import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AdminNav from '../../components/AdminNav';

export default function AdminFeedbackPage() {
  const { feedback } = useApp();
  const navigate = useNavigate();

  const avgRating = feedback.length
    ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
    : '0';

  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: feedback.filter(f => f.rating === r).length,
    pct: feedback.length ? (feedback.filter(f => f.rating === r).length / feedback.length) * 100 : 0,
  }));

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin')}>
          <ChevronLeft size={20} />
        </button>
        <h2 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700 }}>Customer Feedback</h2>
      </div>

      <div className="page-content with-bottom-nav">
        {/* Summary */}
        <div className="card fade-in" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Sora', fontSize: 48, fontWeight: 800, color: '#F59E0B', lineHeight: 1 }}>
                {avgRating}
              </p>
              <div className="stars" style={{ justifyContent: 'center', gap: 3, margin: '6px 0' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <Star key={n} size={14} fill={n <= Math.round(Number(avgRating)) ? '#F59E0B' : 'none'} color={n <= Math.round(Number(avgRating)) ? '#F59E0B' : 'var(--border)'} />
                ))}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{feedback.length} reviews</p>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ratingCounts.map(({ rating, count, pct }) => (
                <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 14 }}>{rating}</span>
                  <Star size={12} fill="#F59E0B" color="#F59E0B" />
                  <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#F59E0B', borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 16 }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {feedback.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><MessageSquare size={28} /></div>
            <p style={{ fontWeight: 600 }}>No feedback yet</p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Feedback from students will appear here</p>
          </div>
        ) : (
          <div className="desktop-grid-2">
            {feedback.map(fb => (
              <div key={fb.id} className="card" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--blue), var(--aqua))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 15,
                    }}>
                      {fb.studentName.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{fb.studentName}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="stars" style={{ gap: 2 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} size={14} fill={n <= fb.rating ? '#F59E0B' : 'none'} color={n <= fb.rating ? '#F59E0B' : 'var(--border)'} />
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.5 }}>{fb.message}</p>
                {fb.orderId && (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                    Related: {fb.orderId}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <AdminNav />
    </div>
  );
}
