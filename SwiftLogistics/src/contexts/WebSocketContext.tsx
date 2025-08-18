import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io as socketIO } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
  socket: ReturnType<typeof socketIO> | null;
  connected: boolean;
  subscribeToOrder: (orderId: string) => void;
  unsubscribeFromOrder: (orderId: string) => void;
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
  const [socket, setSocket] = useState<ReturnType<typeof socketIO> | null>(null);
  const [connected, setConnected] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
      const newSocket = socketIO(wsUrl, {
        auth: { token },
      });

      newSocket.on('connect', () => {
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [token]);

  const subscribeToOrder = (orderId: string) => {
    if (socket) {
      socket.emit('subscribe', `orders/${orderId}`);
    }
  };

  const unsubscribeFromOrder = (orderId: string) => {
    if (socket) {
      socket.emit('unsubscribe', `orders/${orderId}`);
    }
  };

  return (
    <WebSocketContext.Provider 
      value={{ 
        socket, 
        connected, 
        subscribeToOrder, 
        unsubscribeFromOrder 
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
