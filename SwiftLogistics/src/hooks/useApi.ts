import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Order, 
  OrdersResponse, 
  OrderFilters, 
  CreateOrderRequest,
  Driver,
  DriverFilters,
  TrackingData,
  User,
  DashboardData,
  ApiError,
  OrderStatus
} from '../types/api';
import { 
  ordersAPI, 
  driversAPI, 
  trackingAPI, 
  authAPI, 
  adminAPI,
  warehouseAPI
} from '../services/api';
import webSocketService from '../services/websocket';

// Generic hook for API calls with loading and error states
export function useAsyncOperation<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async (operation: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      setData(result);
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// Authentication hooks
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string, isDriver = false) => {
    try {
      const loginMethod = isDriver ? authAPI.driverLogin : authAPI.login;
      const response = await loginMethod({ email, password });
      
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      webSocketService.updateToken(response.tokens.accessToken);
      
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      webSocketService.disconnect();
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const response = await authAPI.register({ email, password, name });
    
    localStorage.setItem('accessToken', response.tokens.accessToken);
    localStorage.setItem('refreshToken', response.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    setUser(response.user);
    setIsAuthenticated(true);
    webSocketService.updateToken(response.tokens.accessToken);
    
    return response;
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register
  };
}

// Orders hooks
export function useOrders(filters?: OrderFilters) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchOrders = useCallback(async (newFilters?: OrderFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersAPI.getAll(newFilters || filters);
      setOrders(response.orders);
      setTotal(response.total);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(async (orderData: CreateOrderRequest) => {
    const newOrder = await ordersAPI.create(orderData);
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    const updatedOrder = await ordersAPI.updateStatus(orderId, status);
    setOrders(prev => prev.map(order => 
      order.orderId === orderId ? updatedOrder : order
    ));
    return updatedOrder;
  }, []);

  const cancelOrder = useCallback(async (orderId: string) => {
    await ordersAPI.cancel(orderId);
    setOrders(prev => prev.filter(order => order.orderId !== orderId));
  }, []);

  return {
    orders,
    total,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    refetch: fetchOrders
  };
}

// Single order hook
export function useOrder(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      setError(null);
      const orderData = await ordersAPI.getById(orderId);
      setOrder(orderData);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, loading, error, refetch: fetchOrder };
}

// Order tracking hook with WebSocket
export function useOrderTracking(orderId: string) {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLiveTracking, setIsLiveTracking] = useState(false);

  const fetchTrackingData = useCallback(async () => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await trackingAPI.trackOrder(orderId);
      setTrackingData(data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const startLiveTracking = useCallback(() => {
    if (!orderId || isLiveTracking) return;
    
    webSocketService.joinOrderTracking(orderId);
    setIsLiveTracking(true);

    const handleLocationUpdate = (data: any) => {
      if (data.orderId === orderId) {
        setTrackingData(prev => prev ? {
          ...prev,
          currentLocation: data.location
        } : null);
      }
    };

    const handleStatusUpdate = (data: any) => {
      if (data.orderId === orderId) {
        setTrackingData(prev => prev ? {
          ...prev,
          status: data.status,
          history: [...prev.history, {
            status: data.status,
            timestamp: data.timestamp,
            location: 'Real-time update'
          }]
        } : null);
      }
    };

    webSocketService.on('location-update', handleLocationUpdate);
    webSocketService.on('status-update', handleStatusUpdate);

    return () => {
      webSocketService.off('location-update', handleLocationUpdate);
      webSocketService.off('status-update', handleStatusUpdate);
    };
  }, [orderId, isLiveTracking]);

  const stopLiveTracking = useCallback(() => {
    if (!orderId || !isLiveTracking) return;
    
    webSocketService.leaveOrderTracking(orderId);
    setIsLiveTracking(false);
  }, [orderId, isLiveTracking]);

  useEffect(() => {
    fetchTrackingData();
  }, [fetchTrackingData]);

  useEffect(() => {
    return () => {
      if (isLiveTracking && orderId) {
        webSocketService.leaveOrderTracking(orderId);
      }
    };
  }, [orderId, isLiveTracking]);

  return {
    trackingData,
    loading,
    error,
    isLiveTracking,
    startLiveTracking,
    stopLiveTracking,
    refetch: fetchTrackingData
  };
}

// Drivers hook
export function useDrivers(filters?: DriverFilters) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchDrivers = useCallback(async (newFilters?: DriverFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await driversAPI.getAll(newFilters || filters);
      setDrivers(response.drivers);
      setTotal(response.total);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return {
    drivers,
    total,
    loading,
    error,
    fetchDrivers,
    refetch: fetchDrivers
  };
}

// Driver profile hook (for driver users)
export function useDriverProfile() {
  const { data: profile, loading, error, execute } = useAsyncOperation<Driver>();
  const { execute: executeVoid } = useAsyncOperation<void>();

  const fetchProfile = useCallback(() => {
    return execute(() => driversAPI.getProfile());
  }, [execute]);

  const updateProfile = useCallback((profileData: Partial<Driver>) => {
    return execute(() => driversAPI.updateProfile(profileData));
  }, [execute]);

  const updateLocation = useCallback((lng: number, lat: number) => {
    return executeVoid(() => driversAPI.updateLocation({ lng, lat }));
  }, [executeVoid]);

  const updateAvailability = useCallback((available: boolean) => {
    return executeVoid(() => driversAPI.updateAvailability(available));
  }, [executeVoid]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateLocation,
    updateAvailability
  };
}

// Admin dashboard hook
export function useAdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminAPI.getDashboard();
      setDashboardData(data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboard
  };
}

// Warehouse management hook
export function useWarehouse() {
  const { data: inventory, loading: inventoryLoading, execute: fetchInventory } = useAsyncOperation();
  const { data: locations, loading: locationsLoading, execute: fetchLocations } = useAsyncOperation();
  const { data: analytics, loading: analyticsLoading, execute: fetchAnalytics } = useAsyncOperation();

  const getInventory = useCallback(() => {
    return fetchInventory(() => warehouseAPI.getInventory());
  }, [fetchInventory]);

  const getLocations = useCallback(() => {
    return fetchLocations(() => warehouseAPI.getLocations());
  }, [fetchLocations]);

  const getAnalytics = useCallback(() => {
    return fetchAnalytics(() => warehouseAPI.getAnalytics());
  }, [fetchAnalytics]);

  useEffect(() => {
    getInventory();
    getLocations();
    getAnalytics();
  }, [getInventory, getLocations, getAnalytics]);

  return {
    inventory,
    locations,
    analytics,
    loading: inventoryLoading || locationsLoading || analyticsLoading,
    refetch: {
      inventory: getInventory,
      locations: getLocations,
      analytics: getAnalytics
    }
  };
}

// WebSocket connection hook
export function useWebSocketConnection() {
  const [isConnected, setIsConnected] = useState(webSocketService.isConnected);
  const [connectionState, setConnectionState] = useState(webSocketService.connectionState);

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(webSocketService.isConnected);
      setConnectionState(webSocketService.connectionState);
    };

    // Check connection status periodically
    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, []);

  const reconnect = useCallback(() => {
    webSocketService.reconnect();
  }, []);

  return {
    isConnected,
    connectionState,
    reconnect
  };
}
