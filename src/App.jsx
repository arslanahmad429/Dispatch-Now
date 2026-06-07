import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import ScrollToTop from './components/shared/ScrollToTop';
import FloatingThemeToggle from './components/shared/FloatingThemeToggle';

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
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';

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
import AdminSettings from './pages/admin/AdminSettings';

import './styles/global.css';

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('clear_db') === 'true') {
      localStorage.removeItem('dn_orders');
      localStorage.removeItem('dn_carriers');
      localStorage.removeItem('dn_admin_credentials');
      localStorage.removeItem('dn_user');
      localStorage.removeItem('dn_login_lockout');
      localStorage.removeItem('dn_login_fails');
      
      // Sync DB reset to Node.js backend
      fetch('http://localhost:5000/api/reset', { method: 'POST' }).catch(() => {});
      
      alert('Mock database wiped successfully! Ready for clean testing.');
      window.location.href = window.location.origin + window.location.pathname;
    } else {
      // Fetch latest orders & carriers from Node.js backend if active on bootup
      const syncDatabaseWithBackend = async () => {
        try {
          const [ordersRes, carriersRes, adminRes] = await Promise.all([
            fetch('http://localhost:5000/api/orders'),
            fetch('http://localhost:5000/api/carriers'),
            fetch('http://localhost:5000/api/admin/credentials')
          ]);
          if (ordersRes.ok && carriersRes.ok) {
            const orders = await ordersRes.json();
            const carriers = await carriersRes.json();
            localStorage.setItem('dn_orders', JSON.stringify(orders));
            localStorage.setItem('dn_carriers', JSON.stringify(carriers));
          }
          if (adminRes.ok) {
            const admin = await adminRes.json();
            // Sync admin email locally
            const saved = localStorage.getItem('dn_admin_credentials');
            if (saved) {
              const parsed = JSON.parse(saved);
              parsed.email = admin.email;
              localStorage.setItem('dn_admin_credentials', JSON.stringify(parsed));
            }
          }
        } catch (err) {
          console.warn('[SYNC] Backend server offline. Defaulting to local storage mode.');
        }
      };
      syncDatabaseWithBackend();
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <FloatingThemeToggle />
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
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
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
              <Route path="settings" element={<AdminSettings />} />
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
