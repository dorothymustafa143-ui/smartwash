import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut, User, Mail, Phone, Hash, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StudentNav from '../../components/StudentNav';

export default function StudentProfilePage() {
  const { currentUser, logout, getStudentOrders } = useApp();
  const navigate = useNavigate();
  const orders = getStudentOrders();

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'delivered').length,
    active: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
  };

  const fields = [
    { icon: User, label: 'Full Name', value: currentUser?.name },
    { icon: Mail, label: 'Email', value: currentUser?.email },
    { icon: Phone, label: 'Phone', value: currentUser?.phone },
    { icon: Hash, label: 'Student ID', value: currentUser?.studentId || 'Not set' },
    { icon: Home, label: 'Hostel', value: currentUser?.hostel || 'Not set' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student')}>
          <ChevronLeft size={20} />
        </button>
        <h2 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700 }}>My Profile</h2>
      </div>

      <div className="page-content with-bottom-nav">
        {/* Avatar */}
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{
            width: 84, height: 84, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--blue), var(--aqua))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, marginBottom: 12, boxShadow: '0 8px 24px rgba(30,58,138,0.2)',
          }}>
            {currentUser?.name.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ fontFamily: 'Sora', fontSize: 20, fontWeight: 700 }}>{currentUser?.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{currentUser?.email}</p>
        </div>

        {/* Desktop: Two column layout for stats and profile */}
        <div className="desktop-grid-2" style={{ alignItems: 'start' }}>
          {/* Stats */}
          <div>
            <h4 style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Order Statistics
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }} className="mobile-full-width">
              {[
                { label: 'Total', value: stats.total, color: 'var(--blue)' },
                { label: 'Active', value: stats.active, color: 'var(--aqua)' },
                { label: 'Done', value: stats.completed, color: 'var(--success)' },
              ].map(({ label, value, color }) => (
                <div key={label} className="card" style={{ textAlign: 'center', padding: '16px 8px' }}>
                  <p style={{ fontFamily: 'Sora', fontSize: 28, fontWeight: 700, color }}>{value}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Profile info */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h4 style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Account Details</h4>
            {fields.map(({ icon: Icon, label, value }, idx) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0', 
                borderBottom: idx < fields.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} color="var(--text-muted)" />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                  <p style={{ fontSize: 15, fontWeight: 500 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-danger btn-full"
          style={{ height: 50, marginTop: 'auto' }}
          onClick={() => { logout(); navigate('/login'); }}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
      <StudentNav />
    </div>
  );
}
