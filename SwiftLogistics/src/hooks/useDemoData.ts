// Custom hook for demo user functionality
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isDemoUser, getCurrentDemoUser } from '../services/mockAPI';
import { 
  Order, 
  Driver, 
  DashboardData,
  WarehouseLocation,
  InventoryItem 
} from '../types/api';
import { 
  mockOrdersAPI, 
  mockDriversAPI, 
  mockAdminAPI,
  mockTrackingAPI 
} from '../services/mockAPI';

export const useDemoData = () => {
  const { user, isAdmin, isClient, isDriver } = useAuth();
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    setIsDemo(isDemoUser());
  }, [user]);

  // Get orders for current user based on their role
  const getDemoOrders = async (): Promise<Order[]> => {
    if (!isDemo) return [];
    
    if (isClient && user) {
      const response = await mockOrdersAPI.getOrders();
      return response.orders.filter(order => order.userId === user.id);
    } else if (isDriver && user) {
      const response = await mockOrdersAPI.getOrders();
      return response.orders.filter(order => order.assignedDriverId === user.id.replace('driver-', 'driver-'));
    } else if (isAdmin) {
      const response = await mockOrdersAPI.getOrders();
      return response.orders;
    }
    
    return [];
  };

  // Get demo dashboard data
  const getDemoDashboard = async (): Promise<DashboardData | null> => {
    if (!isDemo || !isAdmin) return null;
    return await mockAdminAPI.getDashboardData();
  };

  // Get demo drivers
  const getDemoDrivers = async (): Promise<Driver[]> => {
    if (!isDemo || !isAdmin) return [];
    const response = await mockDriversAPI.getDrivers();
    return response.drivers;
  };

  // Get demo warehouses
  const getDemoWarehouses = async (): Promise<WarehouseLocation[]> => {
    if (!isDemo || !isAdmin) return [];
    const response = await mockAdminAPI.getWarehouses();
    return response.warehouses;
  };

  // Get demo inventory
  const getDemoInventory = async (): Promise<InventoryItem[]> => {
    if (!isDemo || !isAdmin) return [];
    const response = await mockAdminAPI.getInventory();
    return response.items;
  };

  // Get demo user profile with extended information
  const getDemoUserProfile = () => {
    if (!isDemo || !user) return null;
    
    return {
      ...user,
      // Add additional demo-specific information that might not be in the standard user object
      lastLogin: new Date().toISOString(),
      accountStatus: 'Active',
      memberSince: user.createdAt,
      preferences: {
        notifications: true,
        emailAlerts: true,
        smsUpdates: true
      }
    };
  };

  return {
    isDemo,
    getDemoOrders,
    getDemoDashboard,
    getDemoDrivers,
    getDemoWarehouses,
    getDemoInventory,
    getDemoUserProfile,
    currentDemoUser: getCurrentDemoUser()
  };
};