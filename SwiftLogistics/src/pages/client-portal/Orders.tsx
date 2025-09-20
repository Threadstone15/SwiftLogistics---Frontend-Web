import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orders } from '../../services/api';
import { toast } from 'react-toastify';
import { ClientLayout } from '../../components/layouts/ClientLayout';

interface Order {
  id: string;
  status: string;
  createdAt: string;
  destination: string;
  estimatedDelivery: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

export const Orders = () => {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orders.getAll();
      const ordersData = response.orders || [];
      // Transform to match expected interface
      const transformedOrders = ordersData.map((order: any) => ({
        id: order.orderId,
        status: order.status,
        createdAt: order.createdAt,
        destination: order.address,
        estimatedDelivery: order.estimatedDelivery || 'TBD',
        items: [{
          name: order.orderType,
          quantity: 1
        }]
      }));
      setOrderList(transformedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orderList.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter;
  });

  return (
    <ClientLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
            <Link
              to="/new-order"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              New Order
            </Link>
          </div>

          {/* Filters */}
          <div className="mt-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  filter === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('in_progress')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  filter === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter('delivered')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  filter === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Delivered
              </button>
              <button
                onClick={() => setFilter('failed')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  filter === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Failed
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="mt-6">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <li key={order.id}>
                      <Link
                        to={`/orders/${order.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-blue-600 truncate">
                                  Order #{order.id}
                                </p>
                                <div className="ml-2">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                      order.status
                                    )}`}
                                  >
                                    {order.status.replace('_', ' ')}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                  Destination: {order.destination}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Items:{' '}
                                  {order.items
                                    .map((item) => `${item.quantity}x ${item.name}`)
                                    .join(', ')}
                                </p>
                              </div>
                            </div>
                            <div className="ml-6 flex-shrink-0">
                              <div className="flex flex-col items-end">
                                <p className="text-sm text-gray-500">
                                  Created:{' '}
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                                {order.estimatedDelivery && (
                                  <p className="text-sm text-gray-500">
                                    Est. Delivery:{' '}
                                    {new Date(
                                      order.estimatedDelivery
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No orders found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};
