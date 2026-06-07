import { Outlet, Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.videoBackground}>
        <video
          className={styles.bgVideo}
          src="/media/carrier_transit.mp4"
          poster="/media/highway_truck.png"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className={styles.videoOverlay} />
      </div>
      <div className={styles.authCard}>
        <div className={styles.logoWrapper}>
          <Link to="/" className={styles.logoLink}>
            <img src="/media/logo.png" alt="Dispatch Now" className={styles.logoImg} />
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

