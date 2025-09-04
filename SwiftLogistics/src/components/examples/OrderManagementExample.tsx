import React, { useState } from 'react';
import { useOrders } from '../../hooks/useApi';
import { CreateOrderRequest, OrderSize, OrderWeight } from '../../types/api';
import { ApiErrorHandler } from '../../utils/api';
import { toast } from 'react-toastify';

const OrderManagementExample: React.FC = () => {
  const { orders, loading, error, createOrder, updateOrderStatus, refetch } = useOrders();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Create order form state
  const [orderForm, setOrderForm] = useState<CreateOrderRequest>({
    orderSize: 'medium' as OrderSize,
    orderWeight: 'light' as OrderWeight,
    orderType: 'standard_delivery',
    priority: false,
    amount: 150.00,
    address: '',
    locationOriginLng: 79.8612,
    locationOriginLat: 6.9271,
    locationDestinationLng: 79.8712,
    locationDestinationLat: 6.9371,
    specialInstructions: ''
  });

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setCreateLoading(true);
      await createOrder(orderForm);
      toast.success('Order created successfully!');
      setShowCreateForm(false);
      // Reset form
      setOrderForm({
        ...orderForm,
        address: '',
        specialInstructions: ''
      });
    } catch (error) {
      ApiErrorHandler.handleError(error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus as any);
      toast.success('Order status updated!');
    } catch (error) {
      ApiErrorHandler.handleError(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h3 className="text-red-800 font-medium">Error loading orders</h3>
        <p className="text-red-600 mt-1">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showCreateForm ? 'Cancel' : 'Create Order'}
        </button>
      </div>

      {/* Create Order Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Create New Order</h3>
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="orderSize" className="block text-sm font-medium mb-1">Order Size</label>
                <select
                  id="orderSize"
                  value={orderForm.orderSize}
                  onChange={(e) => setOrderForm({ ...orderForm, orderSize: e.target.value as OrderSize })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="orderWeight" className="block text-sm font-medium mb-1">Order Weight</label>
                <select
                  id="orderWeight"
                  value={orderForm.orderWeight}
                  onChange={(e) => setOrderForm({ ...orderForm, orderWeight: e.target.value as OrderWeight })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={orderForm.amount}
                  onChange={(e) => setOrderForm({ ...orderForm, amount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="priority"
                  checked={orderForm.priority}
                  onChange={(e) => setOrderForm({ ...orderForm, priority: e.target.checked })}
                  className="mr-2"
                  aria-label="Priority Order"
                />
                <label htmlFor="priority" className="text-sm">Priority Order</label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Address</label>
              <input
                type="text"
                value={orderForm.address}
                onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter delivery address"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Special Instructions</label>
              <textarea
                value={orderForm.specialInstructions}
                onChange={(e) => setOrderForm({ ...orderForm, specialInstructions: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Any special delivery instructions..."
              />
            </div>
            
            <button
              type="submit"
              disabled={createLoading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {createLoading ? 'Creating...' : 'Create Order'}
            </button>
          </form>
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Orders ({orders.length})</h3>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No orders found. Create your first order above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size/Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.orderSize} / {order.orderWeight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {order.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {order.status === 'placed' && (
                        <button
                          onClick={() => handleStatusUpdate(order.orderId, 'at_warehouse')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Move to Warehouse
                        </button>
                      )}
                      {order.status === 'at_warehouse' && (
                        <button
                          onClick={() => handleStatusUpdate(order.orderId, 'picked')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Mark Picked
                        </button>
                      )}
                      {order.status === 'picked' && (
                        <button
                          onClick={() => handleStatusUpdate(order.orderId, 'in_transit')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Start Transit
                        </button>
                      )}
                      {order.status === 'in_transit' && (
                        <button
                          onClick={() => handleStatusUpdate(order.orderId, 'delivered')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagementExample;
