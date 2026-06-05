import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../../context/AuthContext';
import { 
  LayoutDashboard, PlusCircle, ClipboardList, CreditCard, User, 
  Search, Navigation, History, UploadCloud, FileText, 
  UserPlus, DollarSign, Users, BarChart3, Truck, LogOut, Menu, X, Bell 
} from 'lucide-react';
import styles from './DashboardLayout.module.css';

const ROLE_NAVIGATION = {
  customer: [
    { label: 'Overview', path: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'Book Shipment', path: '/customer/book', icon: PlusCircle },
    { label: 'My Orders', path: '/customer/orders', icon: ClipboardList },
    { label: 'Payments & Invoices', path: '/customer/payments', icon: CreditCard },
    { label: 'Profile Settings', path: '/customer/profile', icon: User },
  ],
  carrier: [
    { label: 'Overview', path: '/carrier/dashboard', icon: LayoutDashboard },
    { label: 'Available Loads', path: '/carrier/loads', icon: Search },
    { label: 'Active Load', path: '/carrier/active', icon: Navigation },
    { label: 'Load History', path: '/carrier/history', icon: History },
    { label: 'Upload BOL / Proof', path: '/carrier/upload', icon: UploadCloud },
    { label: 'My Documents', path: '/carrier/documents', icon: FileText },
    { label: 'Carrier Profile', path: '/carrier/profile', icon: User },
  ],
  dispatcher: [
    { label: 'Overview', path: '/dispatcher/dashboard', icon: LayoutDashboard },
    { label: 'Assign Loads', path: '/dispatcher/assign', icon: UserPlus },
    { label: 'Rate Negotiation Log', path: '/dispatcher/rates', icon: DollarSign },
  ],
  admin: [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'All Orders', path: '/admin/orders', icon: ClipboardList },
    { label: 'Carriers', path: '/admin/carriers', icon: Truck },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
  ],
};

export default function DashboardLayout() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const links = ROLE_NAVIGATION[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePortalSwitch = (role) => {
    const emailMap = {
      customer: 'customer@dispatchnow.com',
      carrier: 'carrier@dispatchnow.com',
      dispatcher: 'dispatcher@dispatchnow.com',
      admin: 'admin@dispatchnow.com',
    };
    const res = login(emailMap[role], 'demo123');
    if (res.success) {
      navigate(getDashboardPath(role));
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Truck size={18} strokeWidth={2.5} />
            </div>
            DISPATCH<span className={styles.logoDot}>NOW</span>
          </Link>
          <button className={styles.closeSidebar} onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.roleBadge}>
          <div className={styles.roleDot} />
          <span className={styles.roleName}>{user.role.toUpperCase()} PORTAL</span>
        </div>

        <nav className={styles.sidebarNav}>
          <ul className={styles.navList}>
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user.name.charAt(0)}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user.name}</p>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className={styles.pageTitle}>
              {links.find(l => l.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className={styles.topbarRight}>
            {/* Quick Portal Switcher (Demo Sandbox feature) */}
            <div className={styles.portalSwitcher}>
              <select 
                value={user.role} 
                onChange={(e) => handlePortalSwitch(e.target.value)}
                className={styles.switcherSelect}
                title="Bypass login & switch portal view"
              >
                <option value="customer">Shipper Portal</option>
                <option value="carrier">Carrier Portal</option>
                <option value="dispatcher">Dispatcher Portal</option>
                <option value="admin">Admin Portal</option>
              </select>
            </div>

            <div className={styles.notifications}>
              <button className={styles.iconBtn}>
                <Bell size={20} />
                <span className={styles.badge} />
              </button>
            </div>
            <div className={styles.profileIndicator}>
              <span>Welcome, <strong>{user.name.split(' ')[0]}</strong></span>
              <div className={styles.avatar}>
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className={styles.contentBody}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
