import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// API Integration Example
import ExampleApp from './components/examples/ExampleApp';

// Client Portal Pages
import { Login as ClientLogin } from './pages/client-portal/Login';
import { Register } from './pages/client-portal/Register';
import { Dashboard as ClientDashboard } from './pages/client-portal/Dashboard';
import { Orders } from './pages/client-portal/Orders';
import { OrderDetail } from './pages/client-portal/OrderDetail';
import { NewOrder } from './pages/client-portal/NewOrder';
import { Profile } from './pages/client-portal/Profile';

// Admin Portal Pages
import { Login as AdminLogin } from './pages/admin-portal/Login';
import { Dashboard as AdminDashboard } from './pages/admin-portal/Dashboard';
import { Orders as AdminOrders } from './pages/admin-portal/Orders';
import { OrderDetail as AdminOrderDetail } from './pages/admin-portal/OrderDetail';
import { Drivers } from './pages/admin-portal/Drivers';
import { Warehouse } from './pages/admin-portal/Warehouse';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WebSocketProvider>
          <Routes>
            {/* API Integration Example - Default Route */}
            <Route path="/" element={<ExampleApp />} />
            <Route path="/api-demo" element={<ExampleApp />} />
            
            {/* Client Portal Routes */}
            <Route path="/client/login" element={<ClientLogin />} />
            <Route path="/client/register" element={<Register />} />
            <Route
              path="/client/dashboard"
              element={
                <ProtectedRoute>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/new-order"
              element={
                <ProtectedRoute>
                  <NewOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Legacy client routes (for backward compatibility) */}
            <Route path="/login" element={<Navigate to="/client/login" replace />} />
            <Route path="/register" element={<Navigate to="/client/register" replace />} />
            <Route path="/dashboard" element={<Navigate to="/client/dashboard" replace />} />
            <Route path="/orders" element={<Navigate to="/client/orders" replace />} />
            <Route path="/new-order" element={<Navigate to="/client/new-order" replace />} />
            <Route path="/profile" element={<Navigate to="/client/profile" replace />} />

            {/* Admin Portal Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders/:id"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminOrderDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/drivers"
              element={
                <ProtectedRoute requireAdmin>
                  <Drivers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/warehouse"
              element={
                <ProtectedRoute requireAdmin>
                  <Warehouse />
                </ProtectedRoute>
              }
            />

            {/* Default Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </WebSocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
