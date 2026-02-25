import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const success = login(email, password);
    setLoading(false);
    if (success) {
      const stored = localStorage.getItem('smartwash_user');
      const user = stored ? JSON.parse(stored) : null;
      if (user?.role === 'admin') navigate('/admin');
      else if (user?.role === 'owner') navigate('/owner');
      else navigate('/student');
    } else {
      setError('Invalid credentials. Use admin@admin for owner, or demo accounts.');
    }
  };

  const fillDemo = (type: 'student' | 'admin') => {
    setEmail(type === 'student' ? 'john@student.edu' : 'admin@smartwash.com');
    setPassword('password');
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A, #0E1F5A)',
        padding: '48px 24px 40px',
        borderRadius: '0 0 32px 32px',
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🧺</div>
        <h1 style={{ fontFamily: 'Sora', fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
          Welcome back
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15 }}>
          Sign in to your SmartWash account
        </p>
      </div>

      <div style={{ padding: '32px 24px', flex: 1, maxWidth: '100%' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {/* Demo buttons */}
        <div className="fade-in" style={{ marginBottom: 24, display: 'flex', gap: 10 }}>
          <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => fillDemo('student')}>
            Demo Student
          </button>
          <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => fillDemo('admin')}>
            Demo Admin
          </button>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 16 }}>
          Owner: Use email <strong>admin@admin</strong> and password <strong>admin</strong>
        </p>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="slide-up">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingRight: 44 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  cursor: 'pointer',
                }}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
            style={{ marginTop: 8, height: 50, fontSize: 16 }}
          >
            {loading ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: 15 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--blue)', fontWeight: 600 }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
