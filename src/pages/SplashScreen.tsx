import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function SplashScreen() {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentUser) {
        navigate(currentUser.role === 'admin' ? '/admin' : '/student');
      } else {
        navigate('/login');
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [currentUser, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1E3A8A 0%, #0E1F5A 50%, #06B6D4 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: -80,
        right: -80,
        width: 280,
        height: 280,
        borderRadius: '50%',
        background: 'rgba(6,182,212,0.15)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: -60,
        left: -60,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
      }} />

      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        {/* Logo */}
        <div style={{
          width: 96,
          height: 96,
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 24,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
        }}>
          🧺
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 36,
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.02em',
          }}>
            SmartWash
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 15,
            marginTop: 6,
            fontWeight: 300,
            letterSpacing: '0.08em',
          }}>
            CAMPUS LAUNDRY MADE EASY
          </p>
        </div>

        {/* Loader */}
        <div className="stagger-3 fade-in" style={{
          marginTop: 32,
          width: 48,
          height: 4,
          background: 'rgba(255,255,255,0.2)',
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            background: '#06B6D4',
            borderRadius: 2,
            animation: 'loadBar 2s ease-in-out both',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes loadBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
