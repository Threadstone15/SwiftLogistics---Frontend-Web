import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User, UserType, AuthResponse, ApiError } from '../types/api';
import { authAPI } from '../services/api';
import webSocketService from '../services/websocket';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: UserType | null;
  isAdmin: boolean;
  isDriver: boolean;
  isClient: boolean;
  login: (email: string, password: string, isDriver?: boolean) => Promise<AuthResponse>;
  register: (email: string, password: string, name: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface DecodedToken {
  sub: string;
  email: string;
  userType: UserType;
  exp: number;
  iat: number;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');

      if (accessToken && userData) {
        try {
          // Verify token is still valid
          const decoded = jwtDecode<DecodedToken>(accessToken);
          const currentTime = Date.now() / 1000;

          if (decoded.exp > currentTime) {
            // Token is valid
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsAuthenticated(true);
            webSocketService.updateToken(accessToken);
          } else {
            // Token expired, try to refresh
            await refreshToken();
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          await clearAuth();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await authAPI.refresh(refreshTokenValue);
      
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      webSocketService.updateToken(response.tokens.accessToken);
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await clearAuth();
      return false;
    }
  };

  const clearAuth = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    webSocketService.disconnect();
  };

  const login = async (email: string, password: string, isDriver = false): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
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
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await authAPI.register({ email, password, name });
      
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      webSocketService.updateToken(response.tokens.accessToken);
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      await clearAuth();
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  };

  // Computed properties
  const userType = user?.userType || null;
  const isAdmin = userType === 'ADMIN';
  const isDriver = userType === 'DRIVER';
  const isClient = userType === 'CLIENT';

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    userType,
    isAdmin,
    isDriver,
    isClient,
    login,
    register,
    logout,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
