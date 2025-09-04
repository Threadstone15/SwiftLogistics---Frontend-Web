import { io, Socket } from 'socket.io-client';
import { WebSocketEvents, WebSocketEmitEvents } from '../types/api';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private isConnecting = false;
  private eventListeners = new Map<string, Set<Function>>();

  constructor() {
    this.connect();
  }

  private connect(): void {
    if (this.isConnecting || this.socket?.connected) {
      return;
    }

    this.isConnecting = true;
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
    const token = localStorage.getItem('accessToken');

    this.socket = io(wsUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnecting = false;
      
      // Only attempt reconnection for recoverable disconnections
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect
        return;
      }
      
      this.attemptReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    });

    // Set up typed event listeners
    this.socket.on('location-update', (data: WebSocketEvents['location-update']) => {
      this.notifyListeners('location-update', data);
    });

    this.socket.on('status-update', (data: WebSocketEvents['status-update']) => {
      this.notifyListeners('status-update', data);
    });

    this.socket.on('driver-location', (data: WebSocketEvents['driver-location']) => {
      this.notifyListeners('driver-location', data);
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, this.reconnectDelay);

    // Exponential backoff
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000); // Max 30 seconds
  }

  private notifyListeners<T extends keyof WebSocketEvents>(event: T, data: WebSocketEvents[T]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }

  // Public methods for event management
  public on<T extends keyof WebSocketEvents>(
    event: T, 
    listener: (data: WebSocketEvents[T]) => void
  ): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(listener);
  }

  public off<T extends keyof WebSocketEvents>(
    event: T, 
    listener: (data: WebSocketEvents[T]) => void
  ): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  public emit<T extends keyof WebSocketEmitEvents>(
    event: T, 
    data: WebSocketEmitEvents[T]
  ): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`Cannot emit ${event}: WebSocket not connected`);
    }
  }

  // Order tracking methods
  public joinOrderTracking(orderId: string): void {
    this.emit('join-tracking', { orderId });
  }

  public leaveOrderTracking(orderId: string): void {
    this.emit('leave-tracking', { orderId });
  }

  // Driver tracking methods
  public joinDriverTracking(driverId: string): void {
    this.emit('join-driver-updates', { driverId });
  }

  public leaveDriverTracking(driverId: string): void {
    this.emit('leave-driver-updates', { driverId });
  }

  // Connection management
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.eventListeners.clear();
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
  }

  public reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }

  public updateToken(token: string): void {
    if (this.socket) {
      this.socket.auth = { token };
      this.reconnect();
    }
  }

  public get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  public get connectionState(): string {
    if (!this.socket) return 'disconnected';
    if (this.isConnecting) return 'connecting';
    return this.socket.connected ? 'connected' : 'disconnected';
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();

// Export the class for testing purposes
export { WebSocketService };

export default webSocketService;
