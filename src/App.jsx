import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import ScrollToTop from './components/shared/ScrollToTop';
// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import ServicesPage from './pages/public/ServicesPage';
import EquipmentPage from './pages/public/EquipmentPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import PricingPage from './pages/public/PricingPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Auth Pages
import Login from './pages/auth/Login';
import CustomerRegister from './pages/auth/CustomerRegister';
import CarrierRegister from './pages/auth/CarrierRegister';
import ForgotPassword from './pages/auth/ForgotPassword';

// Customer Portal
import CustomerDashboard from './pages/customer/CustomerDashboard';
import BookShipment from './pages/customer/BookShipment';
import MyOrders from './pages/customer/MyOrders';
import TrackOrder from './pages/customer/TrackOrder';
import CustomerPayments from './pages/customer/CustomerPayments';
import CustomerProfile from './pages/customer/CustomerProfile';

// Carrier Portal
import CarrierDashboard from './pages/carrier/CarrierDashboard';
import AvailableLoads from './pages/carrier/AvailableLoads';
import ActiveLoad from './pages/carrier/ActiveLoad';
import LoadHistory from './pages/carrier/LoadHistory';
import UploadProof from './pages/carrier/UploadProof';
import CarrierDocuments from './pages/carrier/CarrierDocuments';
import CarrierProfile from './pages/carrier/CarrierProfile';

// Dispatcher Portal
import DispatcherDashboard from './pages/dispatcher/DispatcherDashboard';
import AssignLoads from './pages/dispatcher/AssignLoads';
import RateLog from './pages/dispatcher/RateLog';

// Admin Portal
import AdminDashboard from './pages/admin/AdminDashboard';
import AllOrders from './pages/admin/AllOrders';
import CarriersList from './pages/admin/CarriersList';
import CustomersList from './pages/admin/CustomersList';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReports from './pages/admin/AdminReports';

import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register/customer" element={<CustomerRegister />} />
            <Route path="/register/carrier" element={<CarrierRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Customer Portal */}
          <Route path="/customer" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="book" element={<BookShipment />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="track/:id" element={<TrackOrder />} />
            <Route path="payments" element={<CustomerPayments />} />
            <Route path="profile" element={<CustomerProfile />} />
          </Route>

          {/* Carrier Portal */}
          <Route path="/carrier" element={
            <ProtectedRoute allowedRoles={['carrier']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CarrierDashboard />} />
            <Route path="loads" element={<AvailableLoads />} />
            <Route path="active" element={<ActiveLoad />} />
            <Route path="history" element={<LoadHistory />} />
            <Route path="upload" element={<UploadProof />} />
            <Route path="documents" element={<CarrierDocuments />} />
            <Route path="profile" element={<CarrierProfile />} />
          </Route>

          {/* Dispatcher Portal */}
          <Route path="/dispatcher" element={
            <ProtectedRoute allowedRoles={['dispatcher']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DispatcherDashboard />} />
            <Route path="assign" element={<AssignLoads />} />
            <Route path="rates" element={<RateLog />} />
          </Route>

          {/* Admin Portal */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AllOrders />} />
            <Route path="carriers" element={<CarriersList />} />
            <Route path="customers" element={<CustomersList />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
