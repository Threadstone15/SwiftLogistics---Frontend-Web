import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { admin } from '../../services/api';
import { toast } from 'react-toastify';

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  status: 'available' | 'busy' | 'offline';
  currentLocation?: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
  activeDeliveries: number;
}

interface DriverRoute {
  orderId: string;
  destination: string;
  estimatedDelivery: string;
}

export const Drivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [driverRoute, setDriverRoute] = useState<DriverRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    if (selectedDriver) {
      fetchDriverRoute(selectedDriver);
    }
  }, [selectedDriver]);

  const fetchDrivers = async () => {
    try {
      const response = await admin.getDrivers();
      setDrivers(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverRoute = async (driverId: string) => {
    try {
      const response = await admin.getDriverRoute(driverId);
      setDriverRoute(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch driver route');
      setDriverRoute([]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
            <h1 className="text-2xl font-semibold text-gray-900">Drivers</h1>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              Add New Driver
            </button>
          </div>

          <div className="mt-8 flex flex-col lg:flex-row gap-8">
            {/* Drivers List */}
            <div className="lg:w-2/3">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Driver
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Vehicle
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Active Deliveries
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {drivers.map((driver) => (
                      <tr
                        key={driver.id}
                        onClick={() => setSelectedDriver(driver.id)}
                        className={`cursor-pointer hover:bg-gray-50 ${
                          selectedDriver === driver.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {driver.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {driver.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {driver.vehicleNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              driver.status
                            )}`}
                          >
                            {driver.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {driver.activeDeliveries}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {driver.currentLocation
                            ? new Date(
                                driver.currentLocation.updatedAt
                              ).toLocaleString()
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Driver Route */}
            <div className="lg:w-1/3">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Current Route
                  </h3>
                  {selectedDriver && (
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {
                        drivers.find((d) => d.id === selectedDriver)?.name ||
                          'Selected Driver'
                      }
                    </p>
                  )}
                </div>
                <div className="border-t border-gray-200">
                  {selectedDriver ? (
                    driverRoute.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {driverRoute.map((stop) => (
                          <li
                            key={stop.orderId}
                            className="px-4 py-4 sm:px-6 hover:bg-gray-50"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-blue-600 truncate">
                                  Order #{stop.orderId}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  {stop.destination}
                                </p>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <p className="text-sm text-gray-500">
                                  {new Date(
                                    stop.estimatedDelivery
                                  ).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-5 sm:px-6 text-sm text-gray-500">
                        No active deliveries
                      </div>
                    )
                  ) : (
                    <div className="px-4 py-5 sm:px-6 text-sm text-gray-500">
                      Select a driver to view their route
                    </div>
                  )}
                </div>
              </div>

              {selectedDriver && drivers.find((d) => d.id === selectedDriver)?.currentLocation && (
                <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Current Location
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Last updated:{' '}
                      {new Date(
                        drivers.find((d) => d.id === selectedDriver)?.currentLocation?.updatedAt || ''
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="h-64 bg-gray-100">
                      {/* Here you would integrate a map component to show the driver's location */}
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Map view will be integrated here
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
