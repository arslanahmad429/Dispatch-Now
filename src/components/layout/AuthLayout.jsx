import { Outlet, Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.backgroundGlow} />
      <div className={styles.authCard}>
        <div className={styles.logoWrapper}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Truck size={22} strokeWidth={2.5} />
            </div>
            DISPATCH<span className={styles.logoDot}>NOW</span>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
