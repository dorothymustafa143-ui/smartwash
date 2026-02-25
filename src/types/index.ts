export type UserRole = 'student' | 'admin' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  phone: string;
  hostel?: string;
  role: UserRole;
}

export type ServiceType = 'wash_only' | 'wash_dry' | 'wash_dry_iron' | 'dry_clean';

export type OrderStatus =
  | 'pending'
  | 'picked_up'
  | 'washing'
  | 'drying'
  | 'ironing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type DeliveryType = 'pickup' | 'delivery';
export type PaymentMethod = 'mobile_money' | 'card';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface Payment {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  platformFee: number;
  adminEarnings: number;
  processedAt?: string;
}

export interface Order {
  id: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  hostel: string;
  roomNumber: string;
  serviceType: ServiceType;
  deliveryType: DeliveryType;
  pickupDate: string;
  pickupTime: string;
  specialInstructions: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  items: ClothingItem[];
  payment?: Payment;
  totalPrice: number;
}

export interface ClothingItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Feedback {
  id: string;
  studentId: string;
  studentName: string;
  orderId?: string;
  message: string;
  rating: number;
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  maxBookings: number;
  currentBookings: number;
}
