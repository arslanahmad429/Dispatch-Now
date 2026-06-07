import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../../context/AuthContext';
import { 
  LayoutDashboard, PlusCircle, ClipboardList, CreditCard, User, 
  UploadCloud, Truck, LogOut, Menu, X, Bell, DollarSign
} from 'lucide-react';
import styles from './DashboardLayout.module.css';

const ROLE_NAVIGATION = {
  carrier: [
    { label: 'Overview', path: '/carrier/dashboard', icon: LayoutDashboard },
    { label: 'My Orders', path: '/carrier/orders', icon: ClipboardList },
    { label: 'My Income', path: '/carrier/income', icon: DollarSign },
    { label: 'Upload Proof', path: '/carrier/upload', icon: UploadCloud },
    { label: 'Carrier Profile', path: '/carrier/profile', icon: User },
  ],
  admin: [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Add Order', path: '/admin/add-order', icon: PlusCircle },
    { label: 'All Orders', path: '/admin/orders', icon: ClipboardList },
    { label: 'Carriers', path: '/admin/carriers', icon: Truck },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Change Credentials', path: '/admin/settings', icon: User },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const links = ROLE_NAVIGATION[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logoLink}>
            <img src="/media/logo.png" alt="Dispatch Now" className={styles.logoImg} />
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
              {(user.name || 'D').charAt(0)}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user.name || 'Driver'}</p>
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
            <div className={styles.notifications}>
              <button className={styles.iconBtn}>
                <Bell size={20} />
                <span className={styles.badge} />
              </button>
            </div>
            <div className={styles.profileIndicator}>
              <span>Welcome, <strong>{(user.name || 'Driver').split(' ')[0]}</strong></span>
              <div className={styles.avatar}>
                {(user.name || 'D').charAt(0)}
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
