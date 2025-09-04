import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ApiErrorHandler } from '../../utils/api';
import { toast } from 'react-toastify';

const LoginExample: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDriver, setIsDriver] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await login(email, password, isDriver);
      toast.success('Login successful!');
    } catch (error) {
      ApiErrorHandler.handleError(error);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="p-6 bg-green-50 rounded-lg">
        <h2 className="text-xl font-bold text-green-800 mb-2">Welcome!</h2>
        <p className="text-green-700">
          Logged in as: {user.email} ({user.userType})
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login to SwiftTrack</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDriver"
            checked={isDriver}
            onChange={(e) => setIsDriver(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isDriver" className="text-sm text-gray-700">
            Login as Driver
          </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium text-gray-800 mb-2">Test Credentials:</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Admin:</strong> admin@swifttrack.com / Admin123!</p>
          <p><strong>Client:</strong> client1@example.com / Client123!</p>
          <p><strong>Driver:</strong> driver1@swifttrack.com / Driver123!</p>
        </div>
      </div>
    </div>
  );
};

export default LoginExample;
