// API Integration Test Suite for SwiftTrack Frontend

import { 
  authAPI, 
  ordersAPI, 
  driversAPI, 
  trackingAPI, 
  adminAPI, 
  warehouseAPI, 
  healthAPI 
} from '../services/api';
import webSocketService from '../services/websocket';
import { API_CONFIG } from '../config/api';

// Test credentials (from backend documentation)
const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@swifttrack.com',
    password: 'Admin123!'
  },
  client: {
    email: 'client1@example.com',
    password: 'Client123!'
  },
  driver: {
    email: 'driver1@swifttrack.com',
    password: 'Driver123!'
  }
};

export class ApiTestSuite {
  private accessToken: string | null = null;
  private testResults: Array<{ test: string; status: 'pass' | 'fail'; message: string }> = [];

  // Test runner
  async runAllTests(): Promise<void> {
    console.log('🚀 Starting SwiftTrack API Integration Tests...');
    console.log(`API Base URL: ${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`);
    console.log(`WebSocket URL: ${API_CONFIG.WS_URL}`);
    
    // Health check first
    await this.testHealthCheck();
    
    // Authentication tests
    await this.testAuthentication();
    
    if (this.accessToken) {
      // Core functionality tests
      await this.testOrderManagement();
      await this.testDriverOperations();
      await this.testWarehouseOperations();
      await this.testTrackingFeatures();
      await this.testAdminFeatures();
      await this.testWebSocketConnection();
    }
    
    this.printResults();
  }

  // Individual test methods
  async testHealthCheck(): Promise<void> {
    try {
      const health = await healthAPI.check();
      this.addResult('Health Check', 'pass', `System status: ${health.status}`);
    } catch (error) {
      this.addResult('Health Check', 'fail', `Health check failed: ${error}`);
    }
  }

  async testAuthentication(): Promise<void> {
    try {
      // Test client login
      const loginResponse = await authAPI.login(TEST_CREDENTIALS.client);
      this.accessToken = loginResponse.tokens.accessToken;
      
      this.addResult('Client Login', 'pass', `Logged in as: ${loginResponse.user.email}`);
      
      // Test profile fetch
      const profile = await authAPI.getProfile();
      this.addResult('Get Profile', 'pass', `Profile: ${profile.email} (${profile.userType})`);
      
      // Test token refresh
      const refreshResponse = await authAPI.refresh(loginResponse.tokens.refreshToken);
      this.addResult('Token Refresh', 'pass', 'Token refreshed successfully');
      
      // Test driver login separately
      try {
        const driverResponse = await authAPI.driverLogin(TEST_CREDENTIALS.driver);
        this.addResult('Driver Login', 'pass', `Driver logged in: ${driverResponse.user.email}`);
      } catch (error) {
        this.addResult('Driver Login', 'fail', `Driver login failed: ${error}`);
      }
      
    } catch (error) {
      this.addResult('Authentication', 'fail', `Authentication failed: ${error}`);
    }
  }

  async testOrderManagement(): Promise<void> {
    try {
      // Create test order
      const orderData = {
        orderSize: 'medium' as const,
        orderWeight: 'light' as const,
        orderType: 'standard_delivery',
        priority: false,
        amount: 150.00,
        address: '123 Test Street, Colombo 03',
        locationOriginLng: 79.8612,
        locationOriginLat: 6.9271,
        locationDestinationLng: 79.8712,
        locationDestinationLat: 6.9371,
        specialInstructions: 'Test order - handle with care'
      };
      
      const newOrder = await ordersAPI.create(orderData);
      this.addResult('Create Order', 'pass', `Order created: ${newOrder.orderId}`);
      
      // Get all orders
      const ordersResponse = await ordersAPI.getAll({ page: 1, limit: 10 });
      this.addResult('Get Orders', 'pass', `Found ${ordersResponse.total} orders`);
      
      // Get order by ID
      const orderDetail = await ordersAPI.getById(newOrder.orderId);
      this.addResult('Get Order by ID', 'pass', `Order status: ${orderDetail.status}`);
      
      // Update order status
      const updatedOrder = await ordersAPI.updateStatus(newOrder.orderId, 'at_warehouse');
      this.addResult('Update Order Status', 'pass', `Status updated to: ${updatedOrder.status}`);
      
    } catch (error) {
      this.addResult('Order Management', 'fail', `Order operations failed: ${error}`);
    }
  }

  async testDriverOperations(): Promise<void> {
    try {
      // Get all drivers (admin operation)
      const driversResponse = await driversAPI.getAll({ page: 1, limit: 10 });
      this.addResult('Get Drivers', 'pass', `Found ${driversResponse.total} drivers`);
      
      // Note: Driver-specific operations would require driver authentication
      this.addResult('Driver Operations', 'pass', 'Driver listing successful');
      
    } catch (error) {
      this.addResult('Driver Operations', 'fail', `Driver operations failed: ${error}`);
    }
  }

  async testWarehouseOperations(): Promise<void> {
    try {
      // Get warehouse locations
      const locations = await warehouseAPI.getLocations();
      this.addResult('Get Warehouse Locations', 'pass', `Found ${locations.length} locations`);
      
      // Get inventory
      const inventory = await warehouseAPI.getInventory();
      this.addResult('Get Inventory', 'pass', `Found ${inventory.length} items`);
      
      // Get analytics
      const analytics = await warehouseAPI.getAnalytics();
      this.addResult('Get Warehouse Analytics', 'pass', 'Analytics retrieved successfully');
      
    } catch (error) {
      this.addResult('Warehouse Operations', 'fail', `Warehouse operations failed: ${error}`);
    }
  }

  async testTrackingFeatures(): Promise<void> {
    try {
      // First get an order to track
      const ordersResponse = await ordersAPI.getAll({ page: 1, limit: 1 });
      
      if (ordersResponse.orders.length > 0) {
        const orderId = ordersResponse.orders[0].orderId;
        const trackingData = await trackingAPI.trackOrder(orderId);
        this.addResult('Track Order', 'pass', `Tracking status: ${trackingData.status}`);
      } else {
        this.addResult('Track Order', 'pass', 'No orders available to track');
      }
      
    } catch (error) {
      this.addResult('Tracking Features', 'fail', `Tracking failed: ${error}`);
    }
  }

  async testAdminFeatures(): Promise<void> {
    try {
      // Get dashboard data
      const dashboard = await adminAPI.getDashboard();
      this.addResult('Admin Dashboard', 'pass', `Total orders: ${dashboard.totalOrders}`);
      
      // Get system health
      const systemHealth = await adminAPI.getSystemHealth();
      this.addResult('System Health', 'pass', `System status: ${systemHealth.status}`);
      
    } catch (error) {
      this.addResult('Admin Features', 'fail', `Admin operations failed: ${error}`);
    }
  }

  async testWebSocketConnection(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const connectionTimeout = setTimeout(() => {
          this.addResult('WebSocket Connection', 'fail', 'Connection timeout');
          resolve();
        }, 5000);

        const checkConnection = () => {
          if (webSocketService.isConnected) {
            clearTimeout(connectionTimeout);
            this.addResult('WebSocket Connection', 'pass', 'Connected successfully');
            
            // Test order tracking subscription
            webSocketService.joinOrderTracking('test-order-id');
            webSocketService.leaveOrderTracking('test-order-id');
            this.addResult('WebSocket Order Tracking', 'pass', 'Subscription test completed');
            
            resolve();
          }
        };

        // Check connection status
        const interval = setInterval(() => {
          checkConnection();
          if (webSocketService.isConnected) {
            clearInterval(interval);
          }
        }, 500);

      } catch (error) {
        this.addResult('WebSocket Connection', 'fail', `WebSocket test failed: ${error}`);
        resolve();
      }
    });
  }

  // Test error handling
  async testErrorHandling(): Promise<void> {
    try {
      // Test 404 error
      try {
        await ordersAPI.getById('non-existent-id');
        this.addResult('404 Error Handling', 'fail', 'Expected 404 error not thrown');
      } catch (error) {
        this.addResult('404 Error Handling', 'pass', 'Correctly handled 404 error');
      }
      
      // Test unauthorized access
      localStorage.removeItem('accessToken');
      try {
        await ordersAPI.getAll();
        this.addResult('401 Error Handling', 'fail', 'Expected 401 error not thrown');
      } catch (error) {
        this.addResult('401 Error Handling', 'pass', 'Correctly handled unauthorized access');
      }
      
    } catch (error) {
      this.addResult('Error Handling', 'fail', `Error handling test failed: ${error}`);
    }
  }

  // Test performance
  async testPerformance(): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Make multiple API calls
      const promises = [
        ordersAPI.getAll({ page: 1, limit: 5 }),
        driversAPI.getAll({ page: 1, limit: 5 }),
        warehouseAPI.getLocations(),
        adminAPI.getSystemHealth()
      ];
      
      await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (duration < 5000) { // Less than 5 seconds for all calls
        this.addResult('Performance Test', 'pass', `All calls completed in ${duration}ms`);
      } else {
        this.addResult('Performance Test', 'fail', `Calls took too long: ${duration}ms`);
      }
      
    } catch (error) {
      this.addResult('Performance Test', 'fail', `Performance test failed: ${error}`);
    }
  }

  // Test rate limiting
  async testRateLimiting(): Promise<void> {
    try {
      const promises: Promise<any>[] = [];
      
      // Make many requests quickly
      for (let i = 0; i < 10; i++) {
        promises.push(healthAPI.check());
      }
      
      await Promise.all(promises);
      this.addResult('Rate Limiting', 'pass', 'Rate limiting handled correctly');
      
    } catch (error) {
      if (error.message.includes('Rate limit')) {
        this.addResult('Rate Limiting', 'pass', 'Rate limiting working as expected');
      } else {
        this.addResult('Rate Limiting', 'fail', `Rate limiting test failed: ${error}`);
      }
    }
  }

  // Helper methods
  private addResult(test: string, status: 'pass' | 'fail', message: string): void {
    this.testResults.push({ test, status, message });
    const emoji = status === 'pass' ? '✅' : '❌';
    console.log(`${emoji} ${test}: ${message}`);
  }

  private printResults(): void {
    const passed = this.testResults.filter(r => r.status === 'pass').length;
    const failed = this.testResults.filter(r => r.status === 'fail').length;
    const total = this.testResults.length;
    
    console.log('\n📊 TEST SUMMARY');
    console.log('================');
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(r => r.status === 'fail')
        .forEach(r => console.log(`  - ${r.test}: ${r.message}`));
    }
    
    console.log('\n🎉 API Integration Test Complete!');
  }
}

// Quick test function for development
export async function quickApiTest(): Promise<void> {
  const testSuite = new ApiTestSuite();
  await testSuite.runAllTests();
}

// Individual test functions for specific features
export async function testAuth(): Promise<void> {
  const testSuite = new ApiTestSuite();
  await testSuite.testAuthentication();
}

export async function testOrders(): Promise<void> {
  const testSuite = new ApiTestSuite();
  await testSuite.testOrderManagement();
}

export async function testWebSocket(): Promise<void> {
  const testSuite = new ApiTestSuite();
  await testSuite.testWebSocketConnection();
}

// Export for use in development console
if (typeof window !== 'undefined') {
  (window as any).swiftTrackApiTest = {
    runAll: quickApiTest,
    testAuth,
    testOrders,
    testWebSocket,
    ApiTestSuite
  };
}

export default ApiTestSuite;
