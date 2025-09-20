// Mock Data Service for Demo Users
import { 
  User, 
  Driver, 
  Order, 
  OrderStatus, 
  TrackingData, 
  TrackingEvent,
  DashboardData,
  WarehouseLocation,
  InventoryItem,
  DriverPerformance
} from '../types/api';

export interface MockUser extends User {
  name: string;
  phone?: string;
  address?: string;
  company?: string;
}

export interface MockAuthResponse {
  user: MockUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// Demo Users
export const DEMO_USERS: Record<string, { password: string; user: MockUser }> = {
  'admin@swifttrack.com': {
    password: 'Admin123!',
    user: {
      id: 'admin-001',
      email: 'admin@swifttrack.com',
      name: 'Sarah Johnson',
      userType: 'ADMIN',
      phone: '+94771234567',
      address: '123 Admin Street, Colombo 03',
      company: 'SwiftTrack Logistics',
      isActive: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-12-20T10:30:00Z'
    }
  },
  'client1@example.com': {
    password: 'Client123!',
    user: {
      id: 'client-001',
      email: 'client1@example.com',
      name: 'Michael Chen',
      userType: 'CLIENT',
      phone: '+94777654321',
      address: '456 Business Avenue, Kandy',
      company: 'TechCorp Solutions',
      isActive: true,
      createdAt: '2024-02-10T09:15:00Z',
      updatedAt: '2024-12-19T14:45:00Z'
    }
  },
  'driver1@swifttrack.com': {
    password: 'Driver123!',
    user: {
      id: 'driver-001',
      email: 'driver1@swifttrack.com',
      name: 'Ravi Perera',
      userType: 'DRIVER',
      phone: '+94712345678',
      address: '789 Delivery Lane, Galle',
      isActive: true,
      createdAt: '2024-01-20T07:30:00Z',
      updatedAt: '2024-12-20T08:15:00Z'
    }
  }
};

// Driver Profiles
export const DEMO_DRIVERS: Driver[] = [
  {
    driverId: 'driver-001',
    email: 'driver1@swifttrack.com',
    nic: '199012345678',
    vehicleReg: 'CAB-1234',
    mobile: '+94712345678',
    address: '789 Delivery Lane, Galle',
    isActive: true,
    currentLocation: {
      lng: 79.8612,
      lat: 6.9271
    },
    availability: true,
    createdAt: '2024-01-20T07:30:00Z',
    updatedAt: '2024-12-20T08:15:00Z'
  },
  {
    driverId: 'driver-002',
    email: 'driver2@swifttrack.com',
    nic: '198511223344',
    vehicleReg: 'CAB-5678',
    mobile: '+94723456789',
    address: '321 Transport Road, Matara',
    isActive: true,
    currentLocation: {
      lng: 79.8774,
      lat: 6.9319
    },
    availability: false,
    createdAt: '2024-03-05T10:00:00Z',
    updatedAt: '2024-12-20T09:30:00Z'
  },
  {
    driverId: 'driver-003',
    email: 'driver3@swifttrack.com',
    nic: '199203456789',
    vehicleReg: 'CAB-9012',
    mobile: '+94734567890',
    address: '654 Highway View, Negombo',
    isActive: true,
    currentLocation: {
      lng: 79.8388,
      lat: 7.2083
    },
    availability: true,
    createdAt: '2024-04-12T11:45:00Z',
    updatedAt: '2024-12-20T07:00:00Z'
  }
];

// Demo Orders with various statuses
export const DEMO_ORDERS: Order[] = [
  // Client's orders
  {
    orderId: 'ORD-2024-001',
    userId: 'client-001',
    orderSize: 'medium',
    orderWeight: 'medium',
    orderType: 'Electronics',
    status: 'delivered',
    priority: false,
    amount: '2500.00',
    address: '123 Tech Park, Colombo 07',
    locationOriginLng: '79.8612',
    locationOriginLat: '6.9271',
    locationDestinationLng: '79.8774',
    locationDestinationLat: '6.9319',
    specialInstructions: 'Handle with care - fragile electronics',
    assignedDriverId: 'driver-001',
    rating: 5,
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-16T16:45:00Z'
  },
  {
    orderId: 'ORD-2024-002',
    userId: 'client-001',
    orderSize: 'large',
    orderWeight: 'heavy',
    orderType: 'Furniture',
    status: 'in_transit',
    priority: true,
    amount: '8750.00',
    address: '456 Home Street, Kandy',
    locationOriginLng: '79.8612',
    locationOriginLat: '6.9271',
    locationDestinationLng: '80.6337',
    locationDestinationLat: '7.2906',
    specialInstructions: 'Assembly required - contact customer before delivery',
    assignedDriverId: 'driver-002',
    createdAt: '2024-12-18T14:20:00Z',
    updatedAt: '2024-12-20T09:15:00Z'
  },
  {
    orderId: 'ORD-2024-003',
    userId: 'client-001',
    orderSize: 'small',
    orderWeight: 'light',
    orderType: 'Documents',
    status: 'picked',
    priority: false,
    amount: '750.00',
    address: '789 Office Complex, Nugegoda',
    locationOriginLng: '79.8612',
    locationOriginLat: '6.9271',
    locationDestinationLng: '79.8900',
    locationDestinationLat: '6.8649',
    specialInstructions: 'Confidential documents - require ID verification',
    assignedDriverId: 'driver-003',
    createdAt: '2024-12-20T08:00:00Z',
    updatedAt: '2024-12-20T10:30:00Z'
  },
  // Additional orders for other clients
  {
    orderId: 'ORD-2024-004',
    userId: 'client-002',
    orderSize: 'medium',
    orderWeight: 'medium',
    orderType: 'Medical Supplies',
    status: 'at_warehouse',
    priority: true,
    amount: '4200.00',
    address: '321 Hospital Road, Galle',
    locationOriginLng: '79.8612',
    locationOriginLat: '6.9271',
    locationDestinationLng: '80.2170',
    locationDestinationLat: '6.0535',
    specialInstructions: 'Temperature sensitive - keep refrigerated',
    createdAt: '2024-12-19T16:45:00Z',
    updatedAt: '2024-12-20T07:30:00Z'
  },
  {
    orderId: 'ORD-2024-005',
    userId: 'client-003',
    orderSize: 'large',
    orderWeight: 'heavy',
    orderType: 'Industrial Equipment',
    status: 'placed',
    priority: false,
    amount: '15000.00',
    address: '654 Factory Lane, Kalutara',
    locationOriginLng: '79.8612',
    locationOriginLat: '6.9271',
    locationDestinationLng: '79.9553',
    locationDestinationLat: '6.5844',
    specialInstructions: 'Requires crane for unloading - coordinate with site manager',
    createdAt: '2024-12-20T11:15:00Z',
    updatedAt: '2024-12-20T11:15:00Z'
  }
];

// Tracking Data
export const DEMO_TRACKING_DATA: Record<string, TrackingData> = {
  'ORD-2024-001': {
    orderId: 'ORD-2024-001',
    status: 'delivered',
    history: [
      {
        status: 'placed',
        timestamp: '2024-12-15T10:30:00Z',
        location: 'Customer Location',
        description: 'Order placed by customer'
      },
      {
        status: 'at_warehouse',
        timestamp: '2024-12-15T14:20:00Z',
        location: 'Main Warehouse, Colombo',
        description: 'Package received at warehouse'
      },
      {
        status: 'picked',
        timestamp: '2024-12-16T08:15:00Z',
        location: 'Main Warehouse, Colombo',
        description: 'Package picked up by driver Ravi Perera'
      },
      {
        status: 'in_transit',
        timestamp: '2024-12-16T09:30:00Z',
        location: 'En route to destination',
        description: 'Package in transit to delivery location'
      },
      {
        status: 'delivered',
        timestamp: '2024-12-16T16:45:00Z',
        location: '123 Tech Park, Colombo 07',
        description: 'Package delivered successfully'
      },
      {
        status: 'confirmed',
        timestamp: '2024-12-16T17:00:00Z',
        location: '123 Tech Park, Colombo 07',
        description: 'Delivery confirmed by customer'
      }
    ]
  },
  'ORD-2024-002': {
    orderId: 'ORD-2024-002',
    status: 'in_transit',
    currentLocation: {
      lng: 80.1234,
      lat: 7.0456
    },
    estimatedDelivery: '2024-12-20T18:00:00Z',
    history: [
      {
        status: 'placed',
        timestamp: '2024-12-18T14:20:00Z',
        location: 'Customer Location',
        description: 'Priority order placed by customer'
      },
      {
        status: 'at_warehouse',
        timestamp: '2024-12-19T09:00:00Z',
        location: 'Main Warehouse, Colombo',
        description: 'Large furniture package processed'
      },
      {
        status: 'picked',
        timestamp: '2024-12-20T07:30:00Z',
        location: 'Main Warehouse, Colombo',
        description: 'Package picked up by driver (Large Vehicle)'
      },
      {
        status: 'in_transit',
        timestamp: '2024-12-20T09:15:00Z',
        location: 'Highway A1 - Kadawatha',
        description: 'En route to Kandy - ETA 6:00 PM'
      }
    ]
  },
  'ORD-2024-003': {
    orderId: 'ORD-2024-003',
    status: 'picked',
    currentLocation: {
      lng: 79.8612,
      lat: 6.9271
    },
    estimatedDelivery: '2024-12-20T15:30:00Z',
    history: [
      {
        status: 'placed',
        timestamp: '2024-12-20T08:00:00Z',
        location: 'Customer Location',
        description: 'Document delivery order placed'
      },
      {
        status: 'at_warehouse',
        timestamp: '2024-12-20T09:30:00Z',
        location: 'Main Warehouse, Colombo',
        description: 'Documents secured for delivery'
      },
      {
        status: 'picked',
        timestamp: '2024-12-20T10:30:00Z',
        location: 'Main Warehouse, Colombo',
        description: 'Documents picked up by driver'
      }
    ]
  }
};

// Warehouse Locations
export const DEMO_WAREHOUSES: WarehouseLocation[] = [
  {
    id: 'warehouse-001',
    name: 'Main Distribution Center',
    address: '123 Industrial Estate, Colombo 15',
    lng: 79.8612,
    lat: 6.9271,
    capacity: 10000,
    currentOrders: 245
  },
  {
    id: 'warehouse-002',
    name: 'Southern Hub',
    address: '456 Port Access Road, Galle',
    lng: 80.2170,
    lat: 6.0535,
    capacity: 5000,
    currentOrders: 89
  },
  {
    id: 'warehouse-003',
    name: 'Central Depot',
    address: '789 Railway Junction, Kandy',
    lng: 80.6337,
    lat: 7.2906,
    capacity: 7500,
    currentOrders: 156
  }
];

// Inventory Items
export const DEMO_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-001',
    name: 'Standard Packaging Boxes',
    quantity: 2500,
    location: 'Warehouse A-1',
    lastUpdated: '2024-12-20T09:00:00Z'
  },
  {
    id: 'inv-002',
    name: 'Fragile Item Padding',
    quantity: 850,
    location: 'Warehouse B-3',
    lastUpdated: '2024-12-20T10:15:00Z'
  },
  {
    id: 'inv-003',
    name: 'Temperature Control Units',
    quantity: 45,
    location: 'Cold Storage C-1',
    lastUpdated: '2024-12-19T16:30:00Z'
  },
  {
    id: 'inv-004',
    name: 'Heavy Duty Straps',
    quantity: 320,
    location: 'Equipment Bay D-2',
    lastUpdated: '2024-12-20T08:45:00Z'
  }
];

// Dashboard Data
export const DEMO_DASHBOARD_DATA: DashboardData = {
  totalOrders: 1247,
  activeOrders: 89,
  totalDrivers: 156,
  activeDrivers: 23,
  pendingOrders: 34,
  completedToday: 67,
  revenue: 2450000,
  averageDeliveryTime: 4.2
};

// Driver Performance Data
export const DEMO_DRIVER_PERFORMANCE: DriverPerformance[] = [
  {
    driverId: 'driver-001',
    totalDeliveries: 342,
    averageRating: 4.8,
    onTimeDeliveries: 327,
    completionRate: 98.5
  },
  {
    driverId: 'driver-002',
    totalDeliveries: 289,
    averageRating: 4.6,
    onTimeDeliveries: 271,
    completionRate: 96.2
  },
  {
    driverId: 'driver-003',
    totalDeliveries: 198,
    averageRating: 4.9,
    onTimeDeliveries: 195,
    completionRate: 99.1
  }
];

// Mock Authentication Service
export class MockAuthService {
  static authenticate(email: string, password: string): MockAuthResponse | null {
    const userEntry = DEMO_USERS[email];
    if (!userEntry || userEntry.password !== password) {
      return null;
    }

    // Generate mock JWT tokens
    const accessToken = this.generateMockToken(userEntry.user);
    const refreshToken = this.generateMockRefreshToken(userEntry.user.id);

    return {
      user: userEntry.user,
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  private static generateMockToken(user: MockUser): string {
    // In a real app, this would be a proper JWT
    return btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      userType: user.userType,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
      iat: Math.floor(Date.now() / 1000)
    }));
  }

  private static generateMockRefreshToken(userId: string): string {
    return btoa(JSON.stringify({
      sub: userId,
      type: 'refresh',
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
    }));
  }
}

// Mock Data Service
export class MockDataService {
  // Get orders for a specific user
  static getOrdersForUser(userId: string): Order[] {
    return DEMO_ORDERS.filter(order => order.userId === userId);
  }

  // Get all orders (for admin)
  static getAllOrders(): Order[] {
    return DEMO_ORDERS;
  }

  // Get tracking data for an order
  static getTrackingData(orderId: string): TrackingData | null {
    return DEMO_TRACKING_DATA[orderId] || null;
  }

  // Get driver data
  static getDrivers(): Driver[] {
    return DEMO_DRIVERS;
  }

  // Get driver by ID
  static getDriverById(driverId: string): Driver | null {
    return DEMO_DRIVERS.find(driver => driver.driverId === driverId) || null;
  }

  // Get orders assigned to a driver
  static getOrdersForDriver(driverId: string): Order[] {
    return DEMO_ORDERS.filter(order => order.assignedDriverId === driverId);
  }

  // Get dashboard data
  static getDashboardData(): DashboardData {
    return DEMO_DASHBOARD_DATA;
  }

  // Get warehouse locations
  static getWarehouses(): WarehouseLocation[] {
    return DEMO_WAREHOUSES;
  }

  // Get inventory
  static getInventory(): InventoryItem[] {
    return DEMO_INVENTORY;
  }

  // Get driver performance
  static getDriverPerformance(): DriverPerformance[] {
    return DEMO_DRIVER_PERFORMANCE;
  }
}