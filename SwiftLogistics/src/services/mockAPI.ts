// Mock API Service - Overrides for Demo Data
import { 
  Order, 
  OrdersResponse, 
  TrackingData, 
  Driver, 
  DashboardData, 
  WarehouseLocation,
  InventoryItem,
  DriverPerformance,
  CreateOrderRequest,
  OrderFilters,
  DriverFilters
} from '../types/api';
import { 
  MockDataService,
  DEMO_USERS,
  DEMO_ORDERS,
  DEMO_DRIVERS,
  DEMO_TRACKING_DATA,
  DEMO_DASHBOARD_DATA,
  DEMO_WAREHOUSES,
  DEMO_INVENTORY,
  DEMO_DRIVER_PERFORMANCE
} from './mockData';

// Check if current user is a demo user
export const isDemoUser = (email?: string): boolean => {
  if (!email) {
    const userData = localStorage.getItem('user');
    if (!userData) return false;
    try {
      const user = JSON.parse(userData);
      email = user.email;
    } catch {
      return false;
    }
  }
  return email ? email in DEMO_USERS : false;
};

// Mock API responses for demo users
export const mockOrdersAPI = {
  async getOrders(filters?: OrderFilters): Promise<OrdersResponse> {
    const userData = localStorage.getItem('user');
    if (!userData || !isDemoUser()) {
      throw new Error('Not a demo user');
    }

    const user = JSON.parse(userData);
    let orders = DEMO_ORDERS;

    // Filter orders based on user type
    if (user.userType === 'CLIENT') {
      orders = orders.filter(order => order.userId === user.id);
    } else if (user.userType === 'DRIVER') {
      orders = orders.filter(order => order.assignedDriverId === user.id.replace('driver-', 'driver-'));
    }
    // Admin gets all orders

    // Apply filters
    if (filters?.status) {
      orders = orders.filter(order => order.status === filters.status);
    }
    if (filters?.priority !== undefined) {
      orders = orders.filter(order => order.priority === filters.priority);
    }
    if (filters?.userId) {
      orders = orders.filter(order => order.userId === filters.userId);
    }
    if (filters?.driverId) {
      orders = orders.filter(order => order.assignedDriverId === filters.driverId);
    }

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = orders.slice(startIndex, endIndex);

    return {
      orders: paginatedOrders,
      total: orders.length,
      page,
      limit
    };
  },

  async getOrderById(orderId: string): Promise<Order> {
    const order = DEMO_ORDERS.find(o => o.orderId === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  },

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const userData = localStorage.getItem('user');
    if (!userData || !isDemoUser()) {
      throw new Error('Not a demo user');
    }

    const user = JSON.parse(userData);
    const newOrderId = `ORD-2024-${String(DEMO_ORDERS.length + 1).padStart(3, '0')}`;
    
    const newOrder: Order = {
      orderId: newOrderId,
      userId: user.id,
      orderSize: orderData.orderSize,
      orderWeight: orderData.orderWeight,
      orderType: orderData.orderType,
      status: 'placed',
      priority: orderData.priority,
      amount: orderData.amount.toString(),
      address: orderData.address,
      locationOriginLng: orderData.locationOriginLng.toString(),
      locationOriginLat: orderData.locationOriginLat.toString(),
      locationDestinationLng: orderData.locationDestinationLng.toString(),
      locationDestinationLat: orderData.locationDestinationLat.toString(),
      specialInstructions: orderData.specialInstructions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to mock data (in real app, this would be sent to API)
    DEMO_ORDERS.push(newOrder);
    
    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const orderIndex = DEMO_ORDERS.findIndex(o => o.orderId === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    DEMO_ORDERS[orderIndex] = {
      ...DEMO_ORDERS[orderIndex],
      status: status as any,
      updatedAt: new Date().toISOString()
    };

    return DEMO_ORDERS[orderIndex];
  }
};

export const mockTrackingAPI = {
  async getTrackingData(orderId: string): Promise<TrackingData> {
    const trackingData = DEMO_TRACKING_DATA[orderId];
    if (!trackingData) {
      // Create basic tracking data for orders without specific tracking
      const order = DEMO_ORDERS.find(o => o.orderId === orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      return {
        orderId,
        status: order.status,
        history: [
          {
            status: order.status,
            timestamp: order.updatedAt,
            location: 'Processing',
            description: `Order is currently ${order.status.replace('_', ' ')}`
          }
        ]
      };
    }
    return trackingData;
  }
};

export const mockDriversAPI = {
  async getDrivers(filters?: DriverFilters): Promise<{ drivers: Driver[] }> {
    let drivers = [...DEMO_DRIVERS];

    // Apply filters
    if (filters?.isActive !== undefined) {
      drivers = drivers.filter(driver => driver.isActive === filters.isActive);
    }
    if (filters?.available !== undefined) {
      drivers = drivers.filter(driver => driver.availability === filters.available);
    }

    return { drivers };
  },

  async getDriverById(driverId: string): Promise<Driver> {
    const driver = DEMO_DRIVERS.find(d => d.driverId === driverId);
    if (!driver) {
      throw new Error('Driver not found');
    }
    return driver;
  },

  async updateDriverLocation(driverId: string, location: { lng: number; lat: number }): Promise<void> {
    const driverIndex = DEMO_DRIVERS.findIndex(d => d.driverId === driverId);
    if (driverIndex !== -1) {
      DEMO_DRIVERS[driverIndex] = {
        ...DEMO_DRIVERS[driverIndex],
        currentLocation: location,
        updatedAt: new Date().toISOString()
      };
    }
  },

  async updateDriverAvailability(driverId: string, available: boolean): Promise<void> {
    const driverIndex = DEMO_DRIVERS.findIndex(d => d.driverId === driverId);
    if (driverIndex !== -1) {
      DEMO_DRIVERS[driverIndex] = {
        ...DEMO_DRIVERS[driverIndex],
        availability: available,
        updatedAt: new Date().toISOString()
      };
    }
  }
};

export const mockAdminAPI = {
  async getDashboardData(): Promise<DashboardData> {
    return DEMO_DASHBOARD_DATA;
  },

  async getWarehouses(): Promise<{ warehouses: WarehouseLocation[] }> {
    return { warehouses: DEMO_WAREHOUSES };
  },

  async getInventory(): Promise<{ items: InventoryItem[] }> {
    return { items: DEMO_INVENTORY };
  },

  async getDriverPerformance(): Promise<{ performance: DriverPerformance[] }> {
    return { performance: DEMO_DRIVER_PERFORMANCE };
  },

  async getAudit(): Promise<{ data: Array<{ id: string; type: string; description: string; timestamp: string }> }> {
    return {
      data: [
        {
          id: 'audit-001',
          type: 'order',
          description: 'Order ORD-2024-003 picked up by Ravi Perera',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString() // 30 minutes ago
        },
        {
          id: 'audit-002',
          type: 'driver',
          description: 'Driver availability updated - 2 drivers now available',
          timestamp: new Date(Date.now() - 60 * 60000).toISOString() // 1 hour ago
        },
        {
          id: 'audit-003',
          type: 'order',
          description: 'New priority order ORD-2024-002 created',
          timestamp: new Date(Date.now() - 90 * 60000).toISOString() // 1.5 hours ago
        },
        {
          id: 'audit-004',
          type: 'delivery',
          description: 'Order ORD-2024-001 delivered successfully',
          timestamp: new Date(Date.now() - 120 * 60000).toISOString() // 2 hours ago
        },
        {
          id: 'audit-005',
          type: 'warehouse',
          description: 'Inventory updated - Medical supplies restocked',
          timestamp: new Date(Date.now() - 180 * 60000).toISOString() // 3 hours ago
        }
      ]
    };
  },

  async getReports(): Promise<{ data: { labels: string[]; values: number[] } }> {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = [45, 52, 38, 67, 73, 41, 58]; // Sample weekly throughput data
    
    return {
      data: {
        labels,
        values
      }
    };
  },

  async assignOrderToDriver(orderId: string, driverId: string): Promise<Order> {
    const orderIndex = DEMO_ORDERS.findIndex(o => o.orderId === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    DEMO_ORDERS[orderIndex] = {
      ...DEMO_ORDERS[orderIndex],
      assignedDriverId: driverId,
      status: 'picked',
      updatedAt: new Date().toISOString()
    };

    return DEMO_ORDERS[orderIndex];
  },

  async updateInventoryItem(itemId: string, quantity: number): Promise<InventoryItem> {
    const itemIndex = DEMO_INVENTORY.findIndex(i => i.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Inventory item not found');
    }

    DEMO_INVENTORY[itemIndex] = {
      ...DEMO_INVENTORY[itemIndex],
      quantity,
      lastUpdated: new Date().toISOString()
    };

    return DEMO_INVENTORY[itemIndex];
  }
};

// Utility function to get current demo user
export const getCurrentDemoUser = () => {
  const userData = localStorage.getItem('user');
  if (!userData || !isDemoUser()) {
    return null;
  }
  return JSON.parse(userData);
};