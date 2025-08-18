import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orders } from '../../services/api';
import { toast } from 'react-toastify';
import { ClientLayout } from '../../components/layouts/ClientLayout';
import { useWebSocket } from '../../contexts/WebSocketContext';

interface OrderDetail {
  id: string;
  status: string;
  createdAt: string;
  destination: string;
  estimatedDelivery: string;
  currentLocation?: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  trackingEvents: Array<{
    id: string;
    status: string;
    location: string;
    timestamp: string;
    notes?: string;
  }>;
}

export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { socket, subscribeToOrder, unsubscribeFromOrder } = useWebSocket();

  useEffect(() => {
    fetchOrderDetails();

    if (id) {
      subscribeToOrder(id);
      
      // Listen for real-time updates
      socket?.on(`orders/${id}`, handleOrderUpdate);
    }

    return () => {
      if (id) {
        unsubscribeFromOrder(id);
        socket?.off(`orders/${id}`);
      }
    };
  }, [id, socket]);

  const fetchOrderDetails = async () => {
    if (!id) return;

    try {
      const response = await orders.getById(id);
      setOrder(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderUpdate = (update: any) => {
    setOrder((prevOrder) => {
      if (!prevOrder) return null;

      return {
        ...prevOrder,
        ...update,
        trackingEvents: [...prevOrder.trackingEvents, update.latestEvent].filter(Boolean),
      };
    });
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

  if (loading) {
    return (
      <ClientLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            Loading...
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (!order) {
    return (
      <ClientLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            Order not found
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Order Header */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Order #{order.id}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Created on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Destination
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {order.destination}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Estimated Delivery
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </dd>
                </div>
                {order.currentLocation && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Current Location
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      Last updated:{' '}
                      {new Date(order.currentLocation.updatedAt).toLocaleString()}
                    </dd>
                    {/* Here you could add a map component to show the location */}
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order Items
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Item
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right"
                    >
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      $
                      {order.items
                        .reduce(
                          (sum, item) => sum + item.quantity * item.price,
                          0
                        )
                        .toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Tracking Events
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {order.trackingEvents
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime()
                  )
                  .map((event) => (
                    <li key={event.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {event.status.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-500">{event.location}</p>
                          {event.notes && (
                            <p className="mt-1 text-sm text-gray-500">
                              {event.notes}
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};
