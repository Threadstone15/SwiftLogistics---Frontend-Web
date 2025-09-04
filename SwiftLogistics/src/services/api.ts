import axios, { AxiosResponse, AxiosError } from 'axios';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  CreateOrderRequest, 
  Order, 
  OrdersResponse, 
  OrderFilters, 
  TrackingData, 
  Driver, 
  DriverFilters, 
  DriverPerformance, 
  LocationUpdate, 
  WarehouseLocation, 
  InventoryItem, 
  DashboardData, 
  SystemHealth, 
  ApiError,
  OrderStatus,
  User
} from '../types/api';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_VERSION = '/api/v1';
const FULL_API_URL = `${API_BASE_URL}${API_VERSION}`;

// Create axios instance with default configuration
const api = axios.create({
  baseURL: FULL_API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Rate limiting and retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const rateLimitMap = new Map<string, number>();

// Utility function for exponential backoff
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Utility function to check rate limits
const checkRateLimit = (endpoint: string): boolean => {
  const now = Date.now();
  const lastRequest = rateLimitMap.get(endpoint);
  
  if (lastRequest && now - lastRequest < 600) { // 600ms between requests
    return false;
  }
  
  rateLimitMap.set(endpoint, now);
  return true;
};

// Request interceptor for adding auth token and rate limiting
api.interceptors.request.use(
  (config) => {
    // Add authorization header
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Rate limiting check
    const endpoint = `${config.method?.toUpperCase()} ${config.url}`;
    if (!checkRateLimit(endpoint)) {
      return Promise.reject(new Error('Rate limit exceeded'));
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as any;

    // Handle 401 (Unauthorized) - Token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${FULL_API_URL}/auth/refresh`, {
          refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 429 (Too Many Requests) - Retry with exponential backoff
    if (error.response?.status === 429 && originalRequest._retryCount < MAX_RETRIES) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      const retryDelay = RETRY_DELAY * Math.pow(2, originalRequest._retryCount - 1);
      
      await delay(retryDelay);
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Enhanced error handling wrapper
const handleApiCall = async <T>(apiCall: () => Promise<AxiosResponse<T>>): Promise<T> => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message,
        error: error.response?.data?.error || 'Unknown error',
        details: error.response?.data?.details
      };
      throw apiError;
    }
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    handleApiCall(() => api.post('/auth/login', data)),
    
  driverLogin: (data: LoginRequest): Promise<AuthResponse> =>
    handleApiCall(() => api.post('/auth/driver/login', data)),
    
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    handleApiCall(() => api.post('/auth/register', data)),
    
  refresh: (refreshToken: string): Promise<AuthResponse> =>
    handleApiCall(() => api.post('/auth/refresh', { refreshToken })),
    
  logout: (): Promise<void> =>
    handleApiCall(() => api.post('/auth/logout')),
    
  getProfile: (): Promise<User> =>
    handleApiCall(() => api.get('/auth/profile')),
    
  changePassword: (data: { currentPassword: string; newPassword: string }): Promise<void> =>
    handleApiCall(() => api.post('/auth/change-password', data)),
};

// Orders API
export const ordersAPI = {
  getAll: (filters?: OrderFilters): Promise<OrdersResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    return handleApiCall(() => api.get(`/orders?${params.toString()}`));
  },
  
  getById: (id: string): Promise<Order> =>
    handleApiCall(() => api.get(`/orders/${id}`)),
    
  create: (data: CreateOrderRequest): Promise<Order> =>
    handleApiCall(() => api.post('/orders', data)),
    
  update: (id: string, data: Partial<Order>): Promise<Order> =>
    handleApiCall(() => api.put(`/orders/${id}`, data)),
    
  cancel: (id: string): Promise<void> =>
    handleApiCall(() => api.delete(`/orders/${id}`)),
    
  assignDriver: (id: string, driverId: string): Promise<Order> =>
    handleApiCall(() => api.post(`/orders/${id}/assign-driver`, { driverId })),
    
  updateStatus: (id: string, status: OrderStatus): Promise<Order> =>
    handleApiCall(() => api.put(`/orders/${id}/status`, { status })),
    
  getTracking: (id: string): Promise<TrackingData> =>
    handleApiCall(() => api.get(`/orders/${id}/tracking`)),
    
  rateOrder: (id: string, rating: number, comment?: string): Promise<void> =>
    handleApiCall(() => api.post(`/orders/${id}/rating`, { rating, comment })),
};

// Drivers API
export const driversAPI = {
  getAll: (filters?: DriverFilters): Promise<{ drivers: Driver[]; total: number; page: number; limit: number }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    return handleApiCall(() => api.get(`/drivers?${params.toString()}`));
  },
  
  getProfile: (): Promise<Driver> =>
    handleApiCall(() => api.get('/drivers/profile')),
    
  updateProfile: (data: Partial<Driver>): Promise<Driver> =>
    handleApiCall(() => api.put('/drivers/profile', data)),
    
  getCurrentOrders: (): Promise<Order[]> =>
    handleApiCall(() => api.get('/drivers/current-orders')),
    
  updateLocation: (location: LocationUpdate): Promise<void> =>
    handleApiCall(() => api.post('/drivers/location', location)),
    
  updateAvailability: (available: boolean): Promise<void> =>
    handleApiCall(() => api.put('/drivers/availability', { available })),
    
  getById: (id: string): Promise<Driver> =>
    handleApiCall(() => api.get(`/drivers/${id}`)),
    
  getPerformance: (id: string): Promise<DriverPerformance> =>
    handleApiCall(() => api.get(`/drivers/${id}/performance`)),
};

// Warehouse API
export const warehouseAPI = {
  getInventory: (): Promise<InventoryItem[]> =>
    handleApiCall(() => api.get('/warehouse/inventory')),
    
  getLocations: (): Promise<WarehouseLocation[]> =>
    handleApiCall(() => api.get('/warehouse/locations')),
    
  getLocationOrders: (location: string): Promise<Order[]> =>
    handleApiCall(() => api.get(`/warehouse/${location}/orders`)),
    
  processOrder: (location: string, orderId: string): Promise<void> =>
    handleApiCall(() => api.post(`/warehouse/${location}/process-order`, { orderId })),
    
  getAnalytics: (): Promise<any> =>
    handleApiCall(() => api.get('/warehouse/analytics')),
    
  updateCapacity: (location: string, capacity: number): Promise<void> =>
    handleApiCall(() => api.put(`/warehouse/${location}/capacity`, { capacity })),
};

// Tracking API
export const trackingAPI = {
  trackOrder: (orderId: string): Promise<TrackingData> =>
    handleApiCall(() => api.get(`/tracking/${orderId}`)),
};

// Admin API
export const adminAPI = {
  getDashboard: (): Promise<DashboardData> =>
    handleApiCall(() => api.get('/admin/dashboard')),
    
  getSystemHealth: (): Promise<SystemHealth> =>
    handleApiCall(() => api.get('/admin/system-health')),
};

// Health Check
export const healthAPI = {
  check: (): Promise<{ status: string; timestamp: string }> =>
    handleApiCall(() => axios.get(`${API_BASE_URL}/health`)),
};

// Legacy compatibility exports
export const auth = authAPI;
export const orders = ordersAPI;
export const warehouse = warehouseAPI;
export const admin = adminAPI;

export default api;
