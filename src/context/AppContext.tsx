import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Order, Feedback, TimeSlot } from '../types';
import { mockOrders, mockUsers, mockFeedback, mockTimeSlots, SERVICE_PRICES, DELIVERY_CHARGE, PLATFORM_FEE_PERCENTAGE } from '../data/mockData';

export interface ToastType {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'notification';
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  orders: Order[];
  feedback: Feedback[];
  timeSlots: TimeSlot[];
  toasts: ToastType[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (data: Partial<User> & { password: string }) => boolean;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'totalPrice'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  cancelOrder: (orderId: string) => void;
  submitFeedback: (fb: Omit<Feedback, 'id' | 'createdAt'>) => void;
  getStudentOrders: () => Order[];
  addTimeSlot: (slot: Omit<TimeSlot, 'id' | 'currentBookings'>) => void;
  deleteTimeSlot: (id: string) => void;
  showToast: (message: string, type?: ToastType['type']) => void;
  removeToast: (id: string) => void;
  calculateOrderPrice: (serviceType: string, deliveryType: string) => number;
  processPayment: (orderId: string, method: Order['payment']['method']) => boolean;
  getTotalPlatformRevenue: () => number;
  getTotalOrders: () => number;
  getTotalAdminEarnings: () => number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('smartwash_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(mockTimeSlots);
  const [toasts, setToasts] = useState<ToastType[]>([]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('smartwash_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('smartwash_user');
    }
  }, [currentUser]);

  const login = (email: string, _password: string): boolean => {
    // Regular email-based login
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const register = (data: Partial<User> & { password: string }): boolean => {
    if (users.find(u => u.email === data.email)) return false;
    const newUser: User = {
      id: `u${Date.now()}`,
      name: data.name || '',
      email: data.email || '',
      studentId: data.studentId,
      phone: data.phone || '',
      hostel: data.hostel,
      role: 'student',
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'totalPrice'>): Order => {
    const totalPrice = calculateOrderPrice(orderData.serviceType, orderData.deliveryType);
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      status: 'pending',
      totalPrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o)
    );
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: 'cancelled', updatedAt: new Date().toISOString() } : o)
    );
  };

  const submitFeedback = (fb: Omit<Feedback, 'id' | 'createdAt'>) => {
    setFeedback(prev => [{
      ...fb,
      id: `fb${Date.now()}`,
      createdAt: new Date().toISOString(),
    }, ...prev]);
  };

  const getStudentOrders = (): Order[] => {
    if (!currentUser) return [];
    return orders.filter(o => o.studentId === currentUser.id);
  };

  const addTimeSlot = (slot: Omit<TimeSlot, 'id' | 'currentBookings'>) => {
    setTimeSlots(prev => [...prev, { ...slot, id: `ts${Date.now()}`, currentBookings: 0 }]);
  };

  const deleteTimeSlot = (id: string) => {
    setTimeSlots(prev => prev.filter(s => s.id !== id));
  };

  const showToast = (message: string, type: ToastType['type'] = 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const calculateOrderPrice = (serviceType: string, deliveryType: string): number => {
    const servicePrice = SERVICE_PRICES[serviceType] || 0;
    const deliveryPrice = deliveryType === 'delivery' ? DELIVERY_CHARGE : 0;
    return servicePrice + deliveryPrice;
  };

  const processPayment = (orderId: string, method: 'mobile_money' | 'card'): boolean => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? {
        ...o,
        payment: {
          method,
          status: 'completed',
          amount: o.totalPrice,
          platformFee: Math.round(o.totalPrice * PLATFORM_FEE_PERCENTAGE),
          adminEarnings: Math.round(o.totalPrice * (1 - PLATFORM_FEE_PERCENTAGE)),
          processedAt: new Date().toISOString(),
        },
      } : o)
    );
    return true;
  };

  const getTotalPlatformRevenue = (): number => {
    return orders
      .filter(o => o.payment?.status === 'completed')
      .reduce((sum, o) => sum + (o.payment?.platformFee || 0), 0);
  };

  const getTotalOrders = (): number => {
    return orders.filter(o => o.payment?.status === 'completed').length;
  };

  const getTotalAdminEarnings = (): number => {
    return orders
      .filter(o => o.payment?.status === 'completed')
      .reduce((sum, o) => sum + (o.payment?.adminEarnings || 0), 0);
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, orders, feedback, timeSlots, toasts,
      login, logout, register, addOrder, updateOrderStatus, cancelOrder,
      submitFeedback, getStudentOrders, addTimeSlot, deleteTimeSlot,
      showToast, removeToast, calculateOrderPrice, processPayment,
      getTotalPlatformRevenue, getTotalOrders, getTotalAdminEarnings,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
