// Demo Info Component - Shows available demo accounts
import React, { useState } from 'react';

export const DemoInfo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const demoAccounts = [
    {
      type: 'Admin',
      email: 'admin@swifttrack.com',
      password: 'Admin123!',
      description: 'Full system access - manage orders, drivers, and analytics',
      color: 'red'
    },
    {
      type: 'Client',
      email: 'client1@example.com', 
      password: 'Client123!',
      description: 'Customer portal - create orders and track deliveries',
      color: 'blue'
    },
    {
      type: 'Driver',
      email: 'driver1@swifttrack.com',
      password: 'Driver123!',
      description: 'Driver portal - manage deliveries and update status',
      color: 'green'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50"
      >
        🎭 Demo Accounts
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-80">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🎭 Demo Accounts</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-3">
          {demoAccounts.map((account) => (
            <div
              key={account.type}
              className={`p-3 border border-${account.color}-200 bg-${account.color}-50 rounded-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium text-${account.color}-700`}>
                  {account.type}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => copyToClipboard(account.email)}
                    className="text-xs bg-white px-2 py-1 rounded border hover:bg-gray-50"
                    title="Copy email"
                  >
                    📧
                  </button>
                  <button
                    onClick={() => copyToClipboard(account.password)}
                    className="text-xs bg-white px-2 py-1 rounded border hover:bg-gray-50"
                    title="Copy password"
                  >
                    🔑
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                <div className="font-mono text-xs bg-white px-2 py-1 rounded border">
                  {account.email}
                </div>
                <div className="font-mono text-xs bg-white px-2 py-1 rounded border mt-1">
                  {account.password}
                </div>
              </div>
              
              <p className="text-xs text-gray-500">
                {account.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-700">
            ⚠️ Demo mode uses simulated data. No real API calls are made for these accounts.
          </p>
        </div>
      </div>
    </div>
  );
};