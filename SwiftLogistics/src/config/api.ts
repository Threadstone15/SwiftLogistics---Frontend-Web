// API Configuration for SwiftTrack Frontend

export const API_CONFIG = {
  // Base URLs
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  WS_URL: import.meta.env.VITE_WS_URL || 'http://localhost:3000',
  API_VERSION: '/api/v1',

  // Timeouts (in milliseconds)
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  WEBSOCKET_TIMEOUT: parseInt(import.meta.env.VITE_WEBSOCKET_TIMEOUT || '10000'),

  // Rate limiting
  RATE_LIMIT_REQUESTS_PER_MINUTE: parseInt(import.meta.env.VITE_RATE_LIMIT_REQUESTS_PER_MINUTE || '100'),
  
  // Retry configuration
  MAX_RETRIES: parseInt(import.meta.env.VITE_MAX_RETRIES || '3'),
  RETRY_DELAY: parseInt(import.meta.env.VITE_RETRY_DELAY || '1000'),

  // Cache settings (in minutes)
  CACHE_TTL: {
    DEFAULT: parseInt(import.meta.env.VITE_CACHE_TTL_DEFAULT || '5'),
    STATIC: parseInt(import.meta.env.VITE_CACHE_TTL_STATIC || '60'),
    USER_PROFILE: 30,
    DRIVERS: 10,
    ORDERS: 2,
    TRACKING: 1,
  },

  // Feature flags
  FEATURES: {
    WEBSOCKET: import.meta.env.VITE_ENABLE_WEBSOCKET !== 'false',
    GEOLOCATION: import.meta.env.VITE_ENABLE_GEOLOCATION !== 'false',
    NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
    AUTO_REFRESH: true,
    OFFLINE_MODE: false,
  },

  // Request headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  // Status codes for special handling
  STATUS_CODES: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    RATE_LIMITED: 429,
    SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },

  // WebSocket events
  WS_EVENTS: {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',
    LOCATION_UPDATE: 'location-update',
    STATUS_UPDATE: 'status-update',
    DRIVER_LOCATION: 'driver-location',
    JOIN_TRACKING: 'join-tracking',
    LEAVE_TRACKING: 'leave-tracking',
    JOIN_DRIVER_UPDATES: 'join-driver-updates',
    LEAVE_DRIVER_UPDATES: 'leave-driver-updates',
  },

  // Storage keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language',
    LAST_LOCATION: 'lastLocation',
    CACHE_PREFIX: 'swifttrack_cache_',
  },

  // API endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      DRIVER_LOGIN: '/auth/driver/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile',
      CHANGE_PASSWORD: '/auth/change-password',
    },

    // Orders
    ORDERS: {
      BASE: '/orders',
      BY_ID: (id: string) => `/orders/${id}`,
      ASSIGN_DRIVER: (id: string) => `/orders/${id}/assign-driver`,
      UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
      TRACKING: (id: string) => `/orders/${id}/tracking`,
      RATING: (id: string) => `/orders/${id}/rating`,
    },

    // Drivers
    DRIVERS: {
      BASE: '/drivers',
      PROFILE: '/drivers/profile',
      CURRENT_ORDERS: '/drivers/current-orders',
      LOCATION: '/drivers/location',
      AVAILABILITY: '/drivers/availability',
      BY_ID: (id: string) => `/drivers/${id}`,
      PERFORMANCE: (id: string) => `/drivers/${id}/performance`,
    },

    // Warehouse
    WAREHOUSE: {
      INVENTORY: '/warehouse/inventory',
      LOCATIONS: '/warehouse/locations',
      LOCATION_ORDERS: (location: string) => `/warehouse/${location}/orders`,
      PROCESS_ORDER: (location: string) => `/warehouse/${location}/process-order`,
      ANALYTICS: '/warehouse/analytics',
      UPDATE_CAPACITY: (location: string) => `/warehouse/${location}/capacity`,
    },

    // Tracking
    TRACKING: {
      BY_ORDER: (orderId: string) => `/tracking/${orderId}`,
    },

    // Admin
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      SYSTEM_HEALTH: '/admin/system-health',
    },

    // Health
    HEALTH: '/health',
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // Order defaults
  ORDER_DEFAULTS: {
    SIZE: 'medium' as const,
    WEIGHT: 'light' as const,
    TYPE: 'standard_delivery',
    PRIORITY: false,
  },

  // Map configuration
  MAP: {
    API_KEY: import.meta.env.VITE_MAP_API_KEY,
    DEFAULT_CENTER: {
      LAT: parseFloat(import.meta.env.VITE_DEFAULT_MAP_CENTER_LAT || '6.9271'),
      LNG: parseFloat(import.meta.env.VITE_DEFAULT_MAP_CENTER_LNG || '79.8612'),
    },
    DEFAULT_ZOOM: 13,
    MAX_ZOOM: 18,
    MIN_ZOOM: 8,
  },

  // Validation rules
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 8,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_MIN_LENGTH: 10,
    COORDINATES: {
      LAT_MIN: -90,
      LAT_MAX: 90,
      LNG_MIN: -180,
      LNG_MAX: 180,
    },
  },

  // Date/Time formats
  DATE_FORMATS: {
    API: 'YYYY-MM-DDTHH:mm:ssZ',
    DISPLAY: 'MMM DD, YYYY HH:mm',
    SHORT: 'MMM DD',
    TIME_ONLY: 'HH:mm',
  },

  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized. Please log in again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    RATE_LIMITED: 'Too many requests. Please wait and try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    WEBSOCKET_ERROR: 'Real-time connection failed. Some features may be limited.',
  },

  // Success messages
  SUCCESS_MESSAGES: {
    LOGIN: 'Successfully logged in!',
    LOGOUT: 'Successfully logged out!',
    ORDER_CREATED: 'Order created successfully!',
    ORDER_UPDATED: 'Order updated successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    PASSWORD_CHANGED: 'Password changed successfully!',
  },

  // Auto-refresh intervals (in milliseconds)
  REFRESH_INTERVALS: {
    DASHBOARD: 30000, // 30 seconds
    ORDERS: 60000,    // 1 minute
    TRACKING: 5000,   // 5 seconds
    DRIVERS: 30000,   // 30 seconds
    SYSTEM_HEALTH: 60000, // 1 minute
  },
};

// Environment-specific configurations
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
export const isDebugMode = import.meta.env.VITE_DEBUG === 'true';

// Get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
};

// Get WebSocket URL
export const getWebSocketUrl = (): string => {
  return API_CONFIG.WS_URL;
};

// Cache key generator
export const getCacheKey = (prefix: string, ...parts: string[]): string => {
  return `${API_CONFIG.STORAGE_KEYS.CACHE_PREFIX}${prefix}_${parts.join('_')}`;
};

export default API_CONFIG;
