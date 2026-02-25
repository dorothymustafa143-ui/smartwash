import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import ToastContainer from './components/ToastContainer';

// Auth
import SplashScreen from './pages/SplashScreen';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Student
import StudentDashboard from './pages/student/Dashboard';
import RequestServicePage from './pages/student/RequestService';
import MyOrdersPage from './pages/student/MyOrders';
import TrackOrderPage from './pages/student/TrackOrder';
import FeedbackPage from './pages/student/Feedback';
import StudentProfilePage from './pages/student/Profile';
import OrderSummaryPage from './pages/student/OrderSummary';
import PaymentPage from './pages/student/Payment';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrdersPage from './pages/admin/Orders';
import AdminOrderDetailPage from './pages/admin/OrderDetail';
import AdminTimeSlotsPage from './pages/admin/TimeSlots';
import AdminFeedbackPage from './pages/admin/FeedbackView';

// Owner
import OwnerDashboard from './pages/owner/Dashboard';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function RootRedirect() {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/splash" replace />;
  if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
  if (currentUser.role === 'owner') return <Navigate to="/owner" replace />;
  return <Navigate to="/student" replace />;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student routes */}
          <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/request" element={<ProtectedRoute role="student"><RequestServicePage /></ProtectedRoute>} />
          <Route path="/student/order-summary" element={<ProtectedRoute role="student"><OrderSummaryPage /></ProtectedRoute>} />
          <Route path="/student/payment" element={<ProtectedRoute role="student"><PaymentPage /></ProtectedRoute>} />
          <Route path="/student/orders" element={<ProtectedRoute role="student"><MyOrdersPage /></ProtectedRoute>} />
          <Route path="/student/orders/:id/track" element={<ProtectedRoute role="student"><TrackOrderPage /></ProtectedRoute>} />
          <Route path="/student/feedback" element={<ProtectedRoute role="student"><FeedbackPage /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfilePage /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrdersPage /></ProtectedRoute>} />
          <Route path="/admin/orders/:id" element={<ProtectedRoute role="admin"><AdminOrderDetailPage /></ProtectedRoute>} />
          <Route path="/admin/timeslots" element={<ProtectedRoute role="admin"><AdminTimeSlotsPage /></ProtectedRoute>} />
          <Route path="/admin/feedback" element={<ProtectedRoute role="admin"><AdminFeedbackPage /></ProtectedRoute>} />

          {/* Owner routes */}
          <Route path="/owner" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
