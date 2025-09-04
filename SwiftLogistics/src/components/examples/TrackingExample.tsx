import React, { useState, useEffect } from 'react';
import { useOrderTracking } from '../../hooks/useApi';
import { ApiErrorHandler, DateUtils } from '../../utils/api';
import { useWebSocket } from '../../contexts/WebSocketContext';

interface TrackingExampleProps {
  orderId?: string;
}

const TrackingExample: React.FC<TrackingExampleProps> = ({ orderId: propOrderId }) => {
  const [orderId, setOrderId] = useState(propOrderId || '');
  const [isTracking, setIsTracking] = useState(false);
  
  const { 
    trackingData, 
    loading, 
    error, 
    isLiveTracking, 
    startLiveTracking, 
    stopLiveTracking, 
    refetch 
  } = useOrderTracking(orderId);
  
  const { isConnected, connectionState } = useWebSocket();

  useEffect(() => {
    if (orderId && isTracking && !isLiveTracking) {
      startLiveTracking();
    }
    
    return () => {
      if (isLiveTracking) {
        stopLiveTracking();
      }
    };
  }, [orderId, isTracking, isLiveTracking, startLiveTracking, stopLiveTracking]);

  const handleStartTracking = () => {
    if (!orderId.trim()) return;
    
    setIsTracking(true);
    refetch();
    
    if (isConnected) {
      startLiveTracking();
    }
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    stopLiveTracking();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-yellow-100 text-yellow-800';
      case 'at_warehouse':
        return 'bg-blue-100 text-blue-800';
      case 'picked':
        return 'bg-purple-100 text-purple-800';
      case 'in_transit':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
        
        {/* WebSocket Status */}
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Real-time Connection:</span>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm capitalize">{connectionState}</span>
            </div>
          </div>
        </div>
        
        {/* Order ID Input */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="orderIdInput" className="block text-sm font-medium mb-1">
              Order ID
            </label>
            <input
              id="orderIdInput"
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter order ID to track"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTracking}
            />
          </div>
          <div className="flex items-end">
            {!isTracking ? (
              <button
                onClick={handleStartTracking}
                disabled={!orderId.trim() || loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Track Order'}
              </button>
            ) : (
              <button
                onClick={handleStopTracking}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Stop Tracking
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg">
            <h3 className="text-red-800 font-medium">Tracking Error</h3>
            <p className="text-red-600 mt-1">{error.message}</p>
            <button
              onClick={refetch}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Tracking Data */}
        {trackingData && (
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Current Status</h3>
                {isLiveTracking && (
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm">Live Tracking</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  getStatusColor(trackingData.status)
                }`}>
                  {trackingData.status.replace('_', ' ').toUpperCase()}
                </span>
                
                {trackingData.estimatedDelivery && (
                  <span className="text-sm text-gray-600">
                    ETA: {DateUtils.formatApiDate(trackingData.estimatedDelivery)}
                  </span>
                )}
              </div>
              
              {trackingData.currentLocation && (
                <div className="mt-3 p-3 bg-white rounded border">
                  <h4 className="font-medium text-sm mb-1">Current Location</h4>
                  <p className="text-sm text-gray-600">
                    Lat: {trackingData.currentLocation.lat.toFixed(6)}, 
                    Lng: {trackingData.currentLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}
            </div>

            {/* Tracking History */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
              <div className="space-y-3">
                {trackingData.history && trackingData.history.length > 0 ? (
                  trackingData.history.map((event, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        event.status === 'delivered' ? 'bg-green-500' :
                        event.status === 'failed' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}></div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            getStatusColor(event.status)
                          }`}>
                            {event.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {DateUtils.formatRelativeTime(event.timestamp)}
                          </span>
                        </div>
                        
                        {event.location && (
                          <p className="text-sm text-gray-600">{event.location}</p>
                        )}
                        
                        {event.description && (
                          <p className="text-sm text-gray-700 mt-1">{event.description}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No tracking history available</p>
                )}
              </div>
            </div>

            {/* Map Placeholder */}
            {trackingData.currentLocation && (
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Live Map</h3>
                <p className="text-gray-600 mb-4">
                  Current Location: {trackingData.currentLocation.lat.toFixed(4)}, {trackingData.currentLocation.lng.toFixed(4)}
                </p>
                <div className="bg-white rounded-lg p-8 border-2 border-dashed border-gray-300">
                  <div className="text-gray-400">
                    🗺️ Interactive map would be displayed here
                    <br />
                    <small>Integration with Google Maps/OpenStreetMap can be added</small>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* No tracking data message */}
        {!loading && !error && !trackingData && orderId && isTracking && (
          <div className="text-center py-8 text-gray-500">
            <p>No tracking data available for order: {orderId}</p>
            <p className="text-sm mt-1">Please check the order ID and try again.</p>
          </div>
        )}

        {/* Sample Order IDs */}
        {!isTracking && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Sample Order IDs for Testing:</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <button
                onClick={() => setOrderId('1')}
                className="block hover:text-blue-900 underline"
              >
                Order ID: 1
              </button>
              <button
                onClick={() => setOrderId('2')}
                className="block hover:text-blue-900 underline"
              >
                Order ID: 2
              </button>
              <p className="text-blue-600 mt-2 text-xs">
                Click on sample IDs to auto-fill, or create orders in the Order Management section.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingExample;
