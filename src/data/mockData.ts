import { User, Order, Feedback, TimeSlot } from '../types';

// Service pricing in Malawi Kwacha (MK)
export const SERVICE_PRICES: Record<string, number> = {
  wash_only: 800,
  wash_dry: 1200,
  wash_dry_iron: 1800,
  dry_clean: 2500,
};

export const DELIVERY_CHARGE = 200; // MK for delivery
export const PLATFORM_FEE_PERCENTAGE = 0.02; // 2% fee to platform per order

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'John Mwamba',
    email: 'john@student.edu',
    studentId: 'STU2024001',
    phone: '+265 991 234 567',
    hostel: 'Livingstone Hall',
    role: 'student',
  },
  {
    id: 'u2',
    name: 'Grace Phiri',
    email: 'grace@student.edu',
    studentId: 'STU2024002',
    phone: '+265 991 876 543',
    hostel: 'Blantyre Hall',
    role: 'student',
  },
  {
    id: 'admin1',
    name: 'Manager Banda',
    email: 'admin@smartwash.com',
    phone: '+265 999 000 111',
    role: 'admin',
  },
  {
    id: 'owner1',
    name: 'SmartWash Owner',
    email: 'admin@admin',
    phone: '+265 999 111 222',
    role: 'owner',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-1001',
    studentId: 'u1',
    studentName: 'John Mwamba',
    studentPhone: '+265 991 234 567',
    hostel: 'Livingstone Hall',
    roomNumber: 'L-204',
    serviceType: 'wash_dry_iron',
    deliveryType: 'delivery',
    pickupDate: '2026-02-20',
    pickupTime: '09:00',
    specialInstructions: 'Please be careful with the white shirts',
    status: 'ironing',
    createdAt: '2026-02-20T08:00:00Z',
    updatedAt: '2026-02-21T10:00:00Z',
    estimatedDelivery: '2026-02-22',
    items: [
      { id: 'i1', name: 'Shirts', quantity: 3 },
      { id: 'i2', name: 'Trousers', quantity: 2 },
      { id: 'i3', name: 'Underwear', quantity: 5 },
    ],
    totalPrice: 1800 + 200,
    payment: { method: 'mobile_money', status: 'completed', amount: 2000, platformFee: 40, adminEarnings: 1960, processedAt: '2026-02-20T08:30:00Z' },
  },
  {
    id: 'ORD-1002',
    studentId: 'u1',
    studentName: 'John Mwamba',
    studentPhone: '+265 991 234 567',
    hostel: 'Livingstone Hall',
    roomNumber: 'L-204',
    serviceType: 'wash_only',
    deliveryType: 'pickup',
    pickupDate: '2026-02-15',
    pickupTime: '11:00',
    specialInstructions: '',
    status: 'delivered',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-17T14:00:00Z',
    estimatedDelivery: '2026-02-17',
    items: [
      { id: 'i4', name: 'T-shirts', quantity: 4 },
      { id: 'i5', name: 'Shorts', quantity: 3 },
    ],
    totalPrice: 800,
    payment: { method: 'card', status: 'completed', amount: 800, platformFee: 16, adminEarnings: 784, processedAt: '2026-02-15T10:30:00Z' },
  },
  {
    id: 'ORD-1003',
    studentId: 'u2',
    studentName: 'Grace Phiri',
    studentPhone: '+265 991 876 543',
    hostel: 'Blantyre Hall',
    roomNumber: 'B-112',
    serviceType: 'wash_dry_iron',
    deliveryType: 'delivery',
    pickupDate: '2026-02-22',
    pickupTime: '10:00',
    specialInstructions: 'Gentle cycle for delicate fabrics',
    status: 'pending',
    createdAt: '2026-02-21T20:00:00Z',
    updatedAt: '2026-02-21T20:00:00Z',
    estimatedDelivery: '2026-02-24',
    items: [
      { id: 'i6', name: 'Dresses', quantity: 2 },
      { id: 'i7', name: 'Blouses', quantity: 3 },
    ],
    totalPrice: 1800 + 200,
    payment: { method: 'mobile_money', status: 'pending', amount: 2000, platformFee: 40, adminEarnings: 1960 },
  },
];

export const mockFeedback: Feedback[] = [
  {
    id: 'fb1',
    studentId: 'u1',
    studentName: 'John Mwamba',
    orderId: 'ORD-1002',
    message: 'Great service! Clothes were clean and neatly folded.',
    rating: 5,
    createdAt: '2026-02-17T16:00:00Z',
  },
];

export const mockTimeSlots: TimeSlot[] = [
  { id: 'ts1', date: '2026-02-23', time: '08:00', maxBookings: 5, currentBookings: 2 },
  { id: 'ts2', date: '2026-02-23', time: '10:00', maxBookings: 5, currentBookings: 5 },
  { id: 'ts3', date: '2026-02-23', time: '14:00', maxBookings: 5, currentBookings: 1 },
  { id: 'ts4', date: '2026-02-24', time: '09:00', maxBookings: 5, currentBookings: 0 },
  { id: 'ts5', date: '2026-02-24', time: '13:00', maxBookings: 5, currentBookings: 3 },
];
