import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from '../../contexts/AuthContext';
import { WebSocketProvider } from '../../contexts/WebSocketContext';
import LoginExample from './LoginExample';
import OrderManagementExample from './OrderManagementExample';
import TrackingExample from './TrackingExample';
import { useAuth } from '../../contexts/AuthContext';
import { quickApiTest } from '../../utils/apiTest';

// Tab navigation component
const TabButton: React.FC<{ 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ active, onClick, children, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
      active 
        ? 'bg-blue-600 text-white' 
        : disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    {children}
  </button>
);

// Main app component (needs to be inside providers)
const ExampleAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { isAuthenticated, user, logout } = useAuth();
  const [apiTestRunning, setApiTestRunning] = useState(false);

  const runApiTest = async () => {
    setApiTestRunning(true);
    try {
      await quickApiTest();
    } catch (error) {
      console.error('API Test failed:', error);
    } finally {
      setApiTestRunning(false);
    }
  };

  const tabs = [
    { id: 'login', label: 'Authentication', requiresAuth: false },
    { id: 'orders', label: 'Order Management', requiresAuth: true },
    { id: 'tracking', label: 'Order Tracking', requiresAuth: true },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SwiftTrack Demo</h1>
              {/* <span className="ml-3 text-sm text-gray-500">Frontend API Integration</span> */}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* API Test Button */}
              <button
                onClick={runApiTest}
                disabled={apiTestRunning}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {apiTestRunning ? 'Testing...' : 'Run API Test'}
              </button>
              
              {/* User Info */}
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <span className="font-medium">{user.email}</span>
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {user.userType}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-500">Not authenticated</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex space-x-1 mb-6">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={tab.requiresAuth && !isAuthenticated}
            >
              {tab.label}
              {tab.requiresAuth && !isAuthenticated}
            </TabButton>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'login' && <LoginExample />}
          {activeTab === 'orders' && isAuthenticated && <OrderManagementExample />}
          {activeTab === 'tracking' && isAuthenticated && <TrackingExample />}
          
          {/* Require auth message */}
          {!isAuthenticated && activeTab !== 'login' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
              <p className="text-gray-600 mb-4">
                Please log in to access {tabs.find(t => t.id === activeTab)?.label}
              </p>
              <button
                onClick={() => setActiveTab('login')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>

     
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

// Main app with providers
const ExampleApp: React.FC = () => {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <ExampleAppContent />
      </WebSocketProvider>
    </AuthProvider>
  );
};

export default ExampleApp;
