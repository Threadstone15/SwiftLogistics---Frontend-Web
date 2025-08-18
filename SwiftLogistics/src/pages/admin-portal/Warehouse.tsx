import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { orders } from '../../services/api';
import { toast } from 'react-toastify';

interface WarehouseOrder {
  id: string;
  status: string;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    location?: string;
    picked?: boolean;
  }>;
  client: {
    name: string;
  };
  priority: 'normal' | 'high' | 'urgent';
  assignedTo?: string;
}

export const Warehouse = () => {
  const [warehouseOrders, setWarehouseOrders] = useState<WarehouseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchWarehouseOrders();
  }, []);

  const fetchWarehouseOrders = async () => {
    try {
      // TODO: Update API call when backend endpoint is ready
      const response = await orders.getAll();
      const warehouseOrders = response.data.filter(
        (order: any) => order.status === 'in_warehouse'
      );
      setWarehouseOrders(warehouseOrders);
    } catch (error: any) {
      toast.error('Failed to fetch warehouse orders');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssignPicker = async (orderId: string, pickerName: string) => {
    try {
      // API call to assign picker
      toast.success(`Order assigned to ${pickerName}`);
      fetchWarehouseOrders();
    } catch (error: any) {
      toast.error('Failed to assign picker');
    }
  };

  const handleMarkItemPicked = async (
    orderId: string,
    itemIndex: number,
    picked: boolean
  ) => {
    try {
      // API call to update item status
      toast.success(picked ? 'Item marked as picked' : 'Item pick status reset');
      fetchWarehouseOrders();
    } catch (error: any) {
      toast.error('Failed to update item status');
    }
  };

  const filteredOrders = warehouseOrders.filter((order) => {
    if (filter === 'all') return true;
    return order.priority === filter;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            Loading...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Warehouse Management
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('urgent')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'urgent'
                    ? 'bg-red-100 text-red-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Urgent
              </button>
              <button
                onClick={() => setFilter('high')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'high'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                High Priority
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order Details
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Items
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Priority
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Assigned To
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="text-sm font-medium text-blue-600 hover:text-blue-900"
                            >
                              Order #{order.id}
                            </Link>
                            <div className="text-sm text-gray-500">
                              {order.client.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={item.picked}
                                onChange={(e) =>
                                  handleMarkItemPicked(
                                    order.id,
                                    index,
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span
                                className={`text-sm ${
                                  item.picked
                                    ? 'text-gray-400 line-through'
                                    : 'text-gray-900'
                                }`}
                              >
                                {item.quantity}x {item.name}
                              </span>
                              {item.location && (
                                <span className="text-sm text-gray-500">
                                  ({item.location})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                            order.priority
                          )}`}
                        >
                          {order.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.assignedTo || (
                          <select
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            onChange={(e) =>
                              handleAssignPicker(order.id, e.target.value)
                            }
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Assign picker
                            </option>
                            <option value="John">John</option>
                            <option value="Sarah">Sarah</option>
                            <option value="Mike">Mike</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => {
                            // Handle complete picking
                          }}
                        >
                          Complete Picking
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No orders found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
