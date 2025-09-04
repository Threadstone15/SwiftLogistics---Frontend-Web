# SwiftTrack Frontend API Integration

A comprehensive, production-ready frontend integration for the SwiftTrack Logistics Backend API built with React, TypeScript, and modern web technologies.

## 🚀 Quick Start

1. **Install Dependencies**

   ```bash
   cd SwiftLogistics
   npm install
   ```

2. **Configure Environment**

   ```bash
   cp .env.example .env
   # Edit .env with your backend URL (default: http://localhost:3000)
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Access the Application**
   - **API Demo**: http://localhost:3001/ (default route)
   - **Client Portal**: http://localhost:3001/client/login
   - **Admin Portal**: http://localhost:3001/admin/login

## 📋 Features

### 🔐 Authentication & Authorization

- **JWT Token Management**: Automatic token storage, refresh, and expiration handling
- **Role-based Access**: Support for CLIENT, DRIVER, and ADMIN user types
- **Secure Storage**: Encrypted token storage with automatic cleanup
- **Multi-portal Login**: Separate login flows for clients and drivers

### 📦 Order Management

- **Full CRUD Operations**: Create, read, update, and delete orders
- **Real-time Updates**: Live status updates via WebSocket
- **Advanced Filtering**: Filter orders by status, priority, date range, etc.
- **Status Tracking**: Complete order lifecycle management
- **File Uploads**: Proof of delivery and document management

### 🔍 Live Tracking

- **Real-time Location**: GPS tracking with WebSocket updates
- **Status History**: Complete tracking timeline with timestamps
- **Interactive Maps**: Integration-ready map components
- **Estimated Delivery**: Dynamic ETA calculations
- **Notifications**: Push notifications for status changes

### 🌐 WebSocket Integration

- **Auto-reconnection**: Intelligent reconnection with exponential backoff
- **Connection Management**: Connection status monitoring and error handling
- **Event Subscriptions**: Granular event listening and management
- **Performance Optimized**: Efficient message handling and memory management

### 👥 Driver Management

- **Profile Management**: Driver profile CRUD operations
- **Location Updates**: Real-time driver location tracking
- **Availability Status**: Driver availability management
- **Performance Metrics**: Delivery statistics and ratings
- **Route Optimization**: Integration-ready route planning

### 🏭 Warehouse Operations

- **Inventory Management**: Stock tracking and management
- **Location Management**: Multi-warehouse support
- **Order Processing**: Warehouse workflow management
- **Analytics Dashboard**: Performance metrics and insights
- **Capacity Management**: Dynamic capacity planning

### 🛡️ Error Handling & Performance

- **Comprehensive Error Handling**: User-friendly error messages and recovery
- **Rate Limiting**: Built-in rate limiting with retry logic
- **Request Caching**: Intelligent caching for improved performance
- **Offline Support**: Offline-first architecture (future enhancement)
- **Performance Monitoring**: Built-in performance tracking

## 🏗️ Architecture

### Core Components

#### API Client (`src/services/api.ts`)

- Axios-based HTTP client with interceptors
- Automatic token refresh and error handling
- Rate limiting and retry logic
- TypeScript-first API definitions

#### WebSocket Service (`src/services/websocket.ts`)

- Socket.io client with reconnection logic
- Typed event system
- Connection state management
- Error recovery and fallback

#### React Hooks (`src/hooks/useApi.ts`)

- Custom hooks for API operations
- Loading and error state management
- Real-time data synchronization
- Performance optimizations

#### Context Providers

- **AuthContext**: Authentication state and operations
- **WebSocketContext**: WebSocket connection and events

### Type System (`src/types/api.ts`)

Complete TypeScript definitions matching the backend API:

- User and authentication types
- Order and tracking types
- Driver and warehouse types
- WebSocket event types

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000

# Development settings
VITE_ENV=development
VITE_DEBUG=true

# Timeouts (milliseconds)
VITE_API_TIMEOUT=30000
VITE_WEBSOCKET_TIMEOUT=10000

# Rate limiting
VITE_RATE_LIMIT_REQUESTS_PER_MINUTE=100

# Feature flags
VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_GEOLOCATION=true
VITE_ENABLE_NOTIFICATIONS=true
```

### API Configuration (`src/config/api.ts`)

Centralized configuration for:

- API endpoints and URLs
- Timeout and retry settings
- Cache configuration
- Feature flags
- Error messages

## 🧪 Testing

### API Test Suite (`src/utils/apiTest.ts`)

Comprehensive testing suite for all API integrations:

```javascript
// Run all tests
await quickApiTest();

// Run specific tests
await testAuth();
await testOrders();
await testWebSocket();

// Access from browser console
window.swiftTrackApiTest.runAll();
```

### Test Coverage

- ✅ Authentication flows
- ✅ Order CRUD operations
- ✅ WebSocket connections
- ✅ Error handling
- ✅ Performance metrics
- ✅ Rate limiting

## 📱 Usage Examples

### Authentication

```typescript
import { useAuth } from "./contexts/AuthContext";

const LoginComponent = () => {
  const { login, user, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login("email@example.com", "password", false); // isDriver
      // Redirect or update UI
    } catch (error) {
      // Handle error
    }
  };
};
```

### Order Management

```typescript
import { useOrders } from "./hooks/useApi";

const OrdersComponent = () => {
  const { orders, loading, createOrder, updateOrderStatus } = useOrders();

  const handleCreateOrder = async (orderData) => {
    try {
      const newOrder = await createOrder(orderData);
      // Success handling
    } catch (error) {
      // Error handling
    }
  };
};
```

### Real-time Tracking

```typescript
import { useOrderTracking } from "./hooks/useApi";

const TrackingComponent = ({ orderId }) => {
  const { trackingData, isLiveTracking, startLiveTracking } =
    useOrderTracking(orderId);

  useEffect(() => {
    startLiveTracking();
  }, [orderId]);
};
```

### WebSocket Events

```typescript
import { useWebSocket } from "./contexts/WebSocketContext";

const Component = () => {
  const { addEventListener, subscribeToOrder } = useWebSocket();

  useEffect(() => {
    const handleLocationUpdate = (data) => {
      console.log("Location update:", data);
    };

    addEventListener("location-update", handleLocationUpdate);
    subscribeToOrder("order-123");

    return () => {
      removeEventListener("location-update", handleLocationUpdate);
    };
  }, []);
};
```

## 📊 API Endpoints

### Authentication

- `POST /api/v1/auth/login` - Client login
- `POST /api/v1/auth/driver/login` - Driver login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Token refresh
- `GET /api/v1/auth/profile` - Get user profile
- `POST /api/v1/auth/change-password` - Change password

### Orders

- `GET /api/v1/orders` - List orders (with filtering)
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/:id` - Get order details
- `PUT /api/v1/orders/:id` - Update order
- `DELETE /api/v1/orders/:id` - Cancel order
- `PUT /api/v1/orders/:id/status` - Update status
- `GET /api/v1/orders/:id/tracking` - Get tracking data

### Drivers

- `GET /api/v1/drivers` - List drivers (admin)
- `GET /api/v1/drivers/profile` - Driver profile
- `PUT /api/v1/drivers/profile` - Update profile
- `POST /api/v1/drivers/location` - Update location
- `PUT /api/v1/drivers/availability` - Set availability

### Warehouse

- `GET /api/v1/warehouse/inventory` - Get inventory
- `GET /api/v1/warehouse/locations` - Get locations
- `GET /api/v1/warehouse/analytics` - Get analytics

### Admin

- `GET /api/v1/admin/dashboard` - Dashboard data
- `GET /api/v1/admin/system-health` - System health

## 🔗 WebSocket Events

### Client Events (Emit)

- `join-tracking` - Subscribe to order tracking
- `leave-tracking` - Unsubscribe from order tracking
- `join-driver-updates` - Subscribe to driver updates
- `leave-driver-updates` - Unsubscribe from driver updates

### Server Events (Listen)

- `location-update` - Real-time location updates
- `status-update` - Order status changes
- `driver-location` - Driver location updates

## 🛠️ Development

### Project Structure

```
src/
├── components/
│   ├── examples/          # API integration examples
│   └── layouts/           # Layout components
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── pages/                 # Page components
├── services/              # API and WebSocket services
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── config/                # Configuration files
```

### Code Quality

- **TypeScript**: Full type safety with strict mode
- **ESLint**: Code linting and formatting
- **Error Boundaries**: React error handling
- **Performance**: Optimized rendering and API calls

### Integration Checklist

- [ ] Backend API running on http://localhost:3000
- [ ] Environment variables configured
- [ ] Test credentials available
- [ ] WebSocket server enabled
- [ ] CORS configured properly

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment-specific Builds

```bash
# Staging
VITE_API_URL=https://staging-api.swifttrack.com npm run build

# Production
VITE_API_URL=https://api.swifttrack.com npm run build
```

## 🤝 Integration with Backend

This frontend is designed to work seamlessly with the SwiftTrack Backend API. Ensure your backend is configured with:

1. **CORS Settings**: Allow frontend domain
2. **WebSocket Support**: Socket.io server enabled
3. **Rate Limiting**: Configured rate limits
4. **Test Data**: Sample orders and users for testing

## 📞 Support

For issues and questions:

1. Check the API test results in browser console
2. Verify backend connectivity
3. Review error logs in Network tab
4. Test WebSocket connection status

## 🎯 Next Steps

1. **Map Integration**: Add Google Maps or OpenStreetMap
2. **Push Notifications**: Browser notification API
3. **Offline Support**: Service worker implementation
4. **Mobile App**: React Native adaptation
5. **Advanced Analytics**: Real-time dashboard enhancements

---

**Built with ❤️ for SwiftTrack Logistics Platform**
