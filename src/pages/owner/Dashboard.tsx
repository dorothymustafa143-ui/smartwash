import { LogOut, TrendingUp, ShoppingCart, DollarSign, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { currentUser, logout, getTotalPlatformRevenue, getTotalOrders, getTotalAdminEarnings, orders } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalRevenue = getTotalPlatformRevenue();
  const totalOrders = getTotalOrders();
  const totalAdminEarnings = getTotalAdminEarnings();
  const completedOrders = orders.filter(o => o.payment?.status === 'completed');
  const pendingOrders = orders.filter(o => o.payment?.status === 'pending');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A, #0E1F5A)',
        padding: '24px',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <h1 style={{ fontFamily: 'Sora', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
            SmartWash Platform Admin
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
            Welcome, {currentUser?.name}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontWeight: 600,
            fontSize: 14,
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Stats Grid - Desktop & Mobile Responsive */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}>
          {/* Total Revenue Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 12, opacity: 0.9, marginBottom: 4 }}>Platform Revenue (2% Fee)</p>
                <p style={{ fontFamily: 'Sora', fontSize: 32, fontWeight: 700 }}>MK {totalRevenue.toLocaleString()}</p>
              </div>
              <div style={{
                width: 48,
                height: 48,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <DollarSign size={24} />
              </div>
            </div>
            <p style={{ fontSize: 12, opacity: 0.85 }}>From completed orders</p>
          </div>

          {/* Total Orders Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 12, opacity: 0.9, marginBottom: 4 }}>Total Orders Processed</p>
                <p style={{ fontFamily: 'Sora', fontSize: 32, fontWeight: 700 }}>{totalOrders}</p>
              </div>
              <div style={{
                width: 48,
                height: 48,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ShoppingCart size={24} />
              </div>
            </div>
            <p style={{ fontSize: 12, opacity: 0.85 }}>Completed payments</p>
          </div>

          {/* Shop Earnings Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 12, opacity: 0.9, marginBottom: 4 }}>Shop Total Earnings</p>
                <p style={{ fontFamily: 'Sora', fontSize: 32, fontWeight: 700 }}>MK {totalAdminEarnings.toLocaleString()}</p>
              </div>
              <div style={{
                width: 48,
                height: 48,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <TrendingUp size={24} />
              </div>
            </div>
            <p style={{ fontSize: 12, opacity: 0.85 }}>After platform fees</p>
          </div>

          {/* Pending Orders Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #EC4899, #DB2777)', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 12, opacity: 0.9, marginBottom: 4 }}>Pending Payments</p>
                <p style={{ fontFamily: 'Sora', fontSize: 32, fontWeight: 700 }}>{pendingOrders.length}</p>
              </div>
              <div style={{
                width: 48,
                height: 48,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Users size={24} />
              </div>
            </div>
            <p style={{ fontSize: 12, opacity: 0.85 }}>Orders awaiting payment</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h2 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Recent Transactions</h2>
          
          {/* Desktop Table View */}
          <div className="transaction-table-container">
            <div style={{
              overflowX: 'auto',
              marginBottom: 16,
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 14,
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 700, color: 'var(--text-muted)' }}>Order ID</th>
                    <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 700, color: 'var(--text-muted)' }}>Student</th>
                    <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 700, color: 'var(--text-muted)' }}>Amount</th>
                    <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 700, color: 'var(--text-muted)' }}>Platform Fee</th>
                    <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 700, color: 'var(--text-muted)' }}>Shop Earning</th>
                    <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 700, color: 'var(--text-muted)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrders.slice(-10).reverse().map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 0', fontWeight: 600, color: 'var(--blue)' }}>{order.id}</td>
                      <td style={{ padding: '16px 0' }}>{order.studentName}</td>
                      <td style={{ padding: '16px 0', fontWeight: 600 }}>MK {order.totalPrice}</td>
                      <td style={{ padding: '16px 0', color: '#10B981', fontWeight: 600 }}>
                        MK {order.payment?.platformFee || 0}
                      </td>
                      <td style={{ padding: '16px 0', color: '#F59E0B', fontWeight: 600 }}>
                        MK {order.payment?.adminEarnings || 0}
                      </td>
                      <td style={{ padding: '16px 0' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          background: '#D1FAE5',
                          color: '#065F46',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                        }}>
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="transaction-cards-container" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {completedOrders.slice(-10).reverse().map(order => (
              <div key={order.id} style={{
                background: 'var(--bg)',
                borderRadius: 12,
                padding: 14,
                border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Order ID</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--blue)' }}>{order.id}</p>
                  </div>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    background: '#D1FAE5',
                    color: '#065F46',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    Paid
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Student</p>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{order.studentName}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Amount</p>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>MK {order.totalPrice}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Platform Fee</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#10B981' }}>MK {order.payment?.platformFee || 0}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Shop Earning</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#F59E0B' }}>MK {order.payment?.adminEarnings || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {completedOrders.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
              No completed transactions yet
            </p>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
          <p>SmartWash Platform © 2026 - Revenue Dashboard</p>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        .transaction-table-container {
          display: none;
        }

        @media (min-width: 1024px) {
          .transaction-table-container {
            display: block;
          }
          
          .transaction-cards-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
