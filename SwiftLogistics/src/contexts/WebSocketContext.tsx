import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { WebSocketEvents } from '../types/api';
import webSocketService from '../services/websocket';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
  isConnected: boolean;
  connectionState: string;
  subscribeToOrder: (orderId: string) => void;
  unsubscribeFromOrder: (orderId: string) => void;
  subscribeToDriver: (driverId: string) => void;
  unsubscribeFromDriver: (driverId: string) => void;
  addEventListener: <T extends keyof WebSocketEvents>(
    event: T,
    listener: (data: WebSocketEvents[T]) => void
  ) => void;
  removeEventListener: <T extends keyof WebSocketEvents>(
    event: T,
    listener: (data: WebSocketEvents[T]) => void
  ) => void;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(webSocketService.isConnected);
  const [connectionState, setConnectionState] = useState(webSocketService.connectionState);
  const { isAuthenticated } = useAuth();

  // Update connection state
  useEffect(() => {
    const updateConnectionState = () => {
      setIsConnected(webSocketService.isConnected);
      setConnectionState(webSocketService.connectionState);
    };

    // Check connection status periodically
    const interval = setInterval(updateConnectionState, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        webSocketService.updateToken(token);
      }
    } else {
      webSocketService.disconnect();
    }
  }, [isAuthenticated]);

  // Order tracking methods
  const subscribeToOrder = useCallback((orderId: string) => {
    webSocketService.joinOrderTracking(orderId);
  }, []);

  const unsubscribeFromOrder = useCallback((orderId: string) => {
    webSocketService.leaveOrderTracking(orderId);
  }, []);

  // Driver tracking methods
  const subscribeToDriver = useCallback((driverId: string) => {
    webSocketService.joinDriverTracking(driverId);
  }, []);

  const unsubscribeFromDriver = useCallback((driverId: string) => {
    webSocketService.leaveDriverTracking(driverId);
  }, []);

  // Event management
  const addEventListener = useCallback(<T extends keyof WebSocketEvents>(
    event: T,
    listener: (data: WebSocketEvents[T]) => void
  ) => {
    webSocketService.on(event, listener);
  }, []);

  const removeEventListener = useCallback(<T extends keyof WebSocketEvents>(
    event: T,
    listener: (data: WebSocketEvents[T]) => void
  ) => {
    webSocketService.off(event, listener);
  }, []);

  // Reconnection
  const reconnect = useCallback(() => {
    webSocketService.reconnect();
  }, []);

  const value: WebSocketContextType = {
    isConnected,
    connectionState,
    subscribeToOrder,
    unsubscribeFromOrder,
    subscribeToDriver,
    unsubscribeFromDriver,
    addEventListener,
    removeEventListener,
    reconnect,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
