import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { token } = response.data;

        localStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: (data: { email: string; password: string }) => 
    api.post('/auth/login', data),
  register: (data: { email: string; password: string; name: string }) => 
    api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

// Orders endpoints
export const orders = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  updateStatus: (id: string, status: string) => 
    api.patch(`/orders/${id}/status`, { status }),
  confirm: (id: string) => api.post(`/orders/${id}/confirm`),
  fail: (id: string) => api.post(`/orders/${id}/fail`),
};

// Warehouse endpoints
export const warehouse = {
  getOrderStatus: (orderId: string) => api.get(`/warehouse/${orderId}`),
};

// Admin specific endpoints
export const admin = {
  getReports: () => api.get('/admin/reports/throughput'),
  getAudit: () => api.get('/admin/audit'),
  getDrivers: () => api.get('/drivers'),
  getDriverRoute: (id: string) => api.get(`/drivers/${id}/route`),
  getDriverManifest: (id: string) => api.get(`/drivers/${id}/manifest`),
  assignDriver: (orderId: string, driverId: string) => 
    api.post(`/orders/${orderId}/assign-driver`, { driverId }),
  addOrderNote: (orderId: string, note: string) =>
    api.post(`/orders/${orderId}/notes`, { note }),
  removeOrderNote: (orderId: string, noteId: string) =>
    api.delete(`/orders/${orderId}/notes/${noteId}`),
};

export default api;
