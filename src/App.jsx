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
import BlogPage from './pages/public/BlogPage';
import BlogPostPage from './pages/public/BlogPostPage';

// Auth Pages
import Login from './pages/auth/Login';
import CarrierRegister from './pages/auth/CarrierRegister';
import ThankYou from './pages/auth/ThankYou';
import ForgotPassword from './pages/auth/ForgotPassword';

// Carrier Portal
import CarrierDashboard from './pages/carrier/CarrierDashboard';
import MyOrders from './pages/carrier/MyOrders';
import MyIncome from './pages/carrier/MyIncome';
import UploadProof from './pages/carrier/UploadProof';
import CarrierProfile from './pages/carrier/CarrierProfile';

// Admin Portal
import AdminDashboard from './pages/admin/AdminDashboard';
import AddOrder from './pages/admin/AddOrder';
import AllOrders from './pages/admin/AllOrders';
import CarriersList from './pages/admin/CarriersList';
import AdminPayments from './pages/admin/AdminPayments';

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
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register/carrier" element={<CarrierRegister />} />
              <Route path="/register/thank-you" element={<ThankYou />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Carrier Portal (Driver) */}
            <Route path="/carrier" element={
              <ProtectedRoute allowedRoles={['carrier']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CarrierDashboard />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="income" element={<MyIncome />} />
              <Route path="upload" element={<UploadProof />} />
              <Route path="profile" element={<CarrierProfile />} />
            </Route>

            {/* Admin Portal */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="add-order" element={<AddOrder />} />
              <Route path="orders" element={<AllOrders />} />
              <Route path="carriers" element={<CarriersList />} />
              <Route path="payments" element={<AdminPayments />} />
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
