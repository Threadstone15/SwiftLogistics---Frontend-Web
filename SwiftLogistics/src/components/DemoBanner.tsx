// Demo Banner Component
import React from 'react';
import { useDemoData } from '../hooks/useDemoData';

export const DemoBanner: React.FC = () => {
  const { isDemo, currentDemoUser } = useDemoData();

  if (!isDemo || !currentDemoUser) return null;

  const getBannerColor = () => {
    switch (currentDemoUser.userType) {
      case 'ADMIN': return 'bg-red-100 border-red-400 text-red-700';
      case 'CLIENT': return 'bg-blue-100 border-blue-400 text-blue-700';
      case 'DRIVER': return 'bg-green-100 border-green-400 text-green-700';
      default: return 'bg-gray-100 border-gray-400 text-gray-700';
    }
  };

  const getRoleDescription = () => {
    switch (currentDemoUser.userType) {
      case 'ADMIN': return 'Administrator Portal - Manage orders, drivers, and system operations';
      case 'CLIENT': return 'Client Portal - Create orders, track shipments, and manage deliveries';
      case 'DRIVER': return 'Driver Portal - View assignments, update locations, and manage deliveries';
      default: return 'Demo Mode Active';
    }
  };

  return (
    <div className={`border-l-4 p-4 mb-4 ${getBannerColor()}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">
            🎭 Demo Mode - {currentDemoUser.name} ({currentDemoUser.userType})
          </h3>
          <div className="mt-1 text-sm">
            <p>{getRoleDescription()}</p>
            <p className="mt-1 text-xs opacity-75">
              Email: {currentDemoUser.email} | All data is simulated for demonstration purposes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};