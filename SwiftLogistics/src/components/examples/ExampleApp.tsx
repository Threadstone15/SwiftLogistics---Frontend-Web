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
              <span className="ml-3 text-sm text-gray-500">Frontend API Integration</span>
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
              {tab.requiresAuth && !isAuthenticated && ' 🔒'}
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

      {/* API Documentation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">🚀 API Integration Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">🔐 Authentication</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✅ JWT Token Management</li>
                <li>✅ Automatic Token Refresh</li>
                <li>✅ Role-based Access (Client/Driver/Admin)</li>
                <li>✅ Secure Storage</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">📦 Order Management</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✅ Create Orders</li>
                <li>✅ Update Status</li>
                <li>✅ List with Filtering</li>
                <li>✅ Real-time Updates</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">🔍 Tracking</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>✅ Real-time Location</li>
                <li>✅ Status History</li>
                <li>✅ WebSocket Updates</li>
                <li>✅ Live Tracking</li>
              </ul>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">🌐 WebSocket</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>✅ Auto-reconnection</li>
                <li>✅ Connection Status</li>
                <li>✅ Event Subscriptions</li>
                <li>✅ Error Handling</li>
              </ul>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">⚡ Performance</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>✅ Request Caching</li>
                <li>✅ Rate Limiting</li>
                <li>✅ Retry Logic</li>
                <li>✅ Error Recovery</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">🔧 Developer Tools</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ TypeScript Support</li>
                <li>✅ API Testing Suite</li>
                <li>✅ React Hooks</li>
                <li>✅ Error Boundaries</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">🧪 Testing</h3>
            <p className="text-sm text-yellow-700 mb-3">
              Use the "Run API Test" button above to test all API endpoints and integrations.
              Check the browser console for detailed test results.
            </p>
            <div className="text-xs text-yellow-600">
              <strong>Backend Requirements:</strong> Make sure the SwiftTrack backend is running on http://localhost:3000
            </div>
          </div>
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
