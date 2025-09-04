// API Types and Interfaces for SwiftTrack Backend Integration

export type UserType = 'CLIENT' | 'DRIVER' | 'ADMIN';

export type OrderStatus =
  | 'placed'
  | 'at_warehouse'
  | 'picked'
  | 'in_transit'
  | 'delivered'
  | 'confirmed'
  | 'failed';

export type OrderSize = 'small' | 'medium' | 'large';
export type OrderWeight = 'light' | 'medium' | 'heavy';

export interface User {
  id: string;
  email: string;
  userType: UserType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  driverId: string;
  email: string;
  nic: string;
  vehicleReg: string;
  mobile: string;
  address: string;
  isActive: boolean;
  currentLocation?: {
    lng: number;
    lat: number;
  };
  availability?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  orderId: string;
  userId: string;
  orderSize: OrderSize;
  orderWeight: OrderWeight;
  orderType: string;
  status: OrderStatus;
  priority: boolean;
  amount: string;
  address: string;
  locationOriginLng: string;
  locationOriginLat: string;
  locationDestinationLng: string;
  locationDestinationLat: string;
  specialInstructions?: string;
  proofOfDeliveryUrl?: string;
  assignedDriverId?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  orderSize: OrderSize;
  orderWeight: OrderWeight;
  orderType: string;
  priority: boolean;
  amount: number;
  address: string;
  locationOriginLng: number;
  locationOriginLat: number;
  locationDestinationLng: number;
  locationDestinationLat: number;
  specialInstructions?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  userType?: UserType;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface TrackingData {
  orderId: string;
  status: OrderStatus;
  currentLocation?: {
    lng: number;
    lat: number;
  };
  estimatedDelivery?: string;
  history: TrackingEvent[];
}

export interface TrackingEvent {
  status: OrderStatus;
  timestamp: string;
  location?: string;
  description?: string;
}

export interface LocationUpdate {
  lng: number;
  lat: number;
}

export interface DriverPerformance {
  driverId: string;
  totalDeliveries: number;
  averageRating: number;
  onTimeDeliveries: number;
  completionRate: number;
}

export interface WarehouseLocation {
  id: string;
  name: string;
  address: string;
  lng: number;
  lat: number;
  capacity: number;
  currentOrders: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  location: string;
  lastUpdated: string;
}

export interface DashboardData {
  totalOrders: number;
  activeOrders: number;
  totalDrivers: number;
  activeDrivers: number;
  pendingOrders: number;
  completedToday: number;
  revenue: number;
  averageDeliveryTime: number;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  database: boolean;
  redis: boolean;
  websocket: boolean;
  uptime: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  details?: Record<string, any>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrderFilters extends PaginationParams {
  status?: OrderStatus;
  priority?: boolean;
  userId?: string;
  driverId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface DriverFilters extends PaginationParams {
  isActive?: boolean;
  available?: boolean;
}

// WebSocket Events
export interface WebSocketEvents {
  'location-update': {
    orderId: string;
    location: {
      lng: number;
      lat: number;
    };
    timestamp: string;
  };
  'status-update': {
    orderId: string;
    status: OrderStatus;
    timestamp: string;
  };
  'driver-location': {
    driverId: string;
    location: {
      lng: number;
      lat: number;
    };
    timestamp: string;
  };
}

export interface WebSocketEmitEvents {
  'join-tracking': { orderId: string };
  'leave-tracking': { orderId: string };
  'join-driver-updates': { driverId: string };
  'leave-driver-updates': { driverId: string };
}
