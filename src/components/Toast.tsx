import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'notification';
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({ id, message, type = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    notification: Bell,
  };

  const styles = {
    success: { bg: '#D1FAE5', border: '#10B981', icon: '#065F46', text: '#065F46' },
    error: { bg: '#FEE2E2', border: '#EF4444', icon: '#991B1B', text: '#991B1B' },
    info: { bg: '#DBEAFE', border: '#3B82F6', icon: '#1E3A8A', text: '#1E3A8A' },
    notification: { bg: '#E0F2FE', border: '#06B6D4', icon: '#0369A1', text: '#0369A1' },
  };

  const Icon = icons[type];
  const style = styles[type];

  return (
    <div
      className="toast"
      style={{
        background: style.bg,
        border: `1.5px solid ${style.border}`,
        borderRadius: 12,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        minWidth: 280,
        maxWidth: 400,
        animation: 'slideInRight 0.3s ease',
      }}
    >
      <Icon size={20} color={style.icon} style={{ flexShrink: 0 }} />
      <p style={{ flex: 1, fontSize: 14, fontWeight: 500, color: style.text, lineHeight: 1.4 }}>
        {message}
      </p>
      <button
        onClick={() => onClose(id)}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 4,
          cursor: 'pointer',
          opacity: 0.6,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <X size={16} color={style.icon} />
      </button>
    </div>
  );
}
