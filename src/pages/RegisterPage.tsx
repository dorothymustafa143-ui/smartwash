import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const hostels = [
  'Mpingwe', 'Ndirande A', 'Nyika A', 'Nyika B',
  'Kapeni A', 'Kapeni B', 'Ndirande B', 'Hyrid',
  'Off-Campus',
];

export default function RegisterPage() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', studentId: '', email: '', phone: '', hostel: '', password: '', confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const ok = register({ ...form });
    setLoading(false);
    if (ok) navigate('/student');
    else setError('Email already registered');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A, #0E1F5A)',
        padding: '24px 24px 32px',
        borderRadius: '0 0 32px 32px',
      }}>
        <Link to="/login" style={{ color: 'rgba(255,255,255,0.7)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 20, fontSize: 14 }}>
          <ChevronLeft size={16} /> Back to Login
        </Link>
        <h1 style={{ fontFamily: 'Sora', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
          Create Account
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
          Join SmartWash for hassle-free laundry
        </p>
      </div>

      <div style={{ padding: '24px', flex: 1, maxWidth: '100%' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="John Mwamba" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Student ID</label>
              <input className="form-input" placeholder="STU2024001" value={form.studentId} onChange={e => set('studentId', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" placeholder="+265 9XX XXX XXX" value={form.phone} onChange={e => set('phone', e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@student.edu" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Hostel / Residence</label>
            <select className="form-input" value={form.hostel} onChange={e => set('hostel', e.target.value)} required>
              <option value="">Select hostel...</option>
              {hostels.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min. 6 chars" value={form.password} onChange={e => set('password', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm</label>
              <input className="form-input" type="password" placeholder="Repeat" value={form.confirm} onChange={e => set('confirm', e.target.value)} required />
            </div>
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ height: 50, fontSize: 16, marginTop: 8 }}>
            {loading ? 'Creating account...' : <><UserPlus size={18} /> Create Account</>}
          </button>
        </form>

          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-muted)', fontSize: 15 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
