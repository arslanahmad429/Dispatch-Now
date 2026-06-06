import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMockDb } from '../../utils/mockDb';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { Clock, MapPin, Truck } from 'lucide-react';
import styles from './MyOrders.module.css';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    const db = getMockDb();
    // Filter orders matching logged-in carrier email
    const myOrders = db.orders.filter(
      o => o.carrierEmail.toLowerCase() === user.email.toLowerCase()
    );
    setOrders(myOrders);
  }, [user]);

  const columns = [
    { key: 'id', label: 'Load ID', sortable: true },
    { key: 'customer', label: 'Shipper' },
    { key: 'pickup', label: 'Pickup Location', render: (val) => (
      <span className={styles.location}><MapPin size={12} /> {val}</span>
    )},
    { key: 'delivery', label: 'Delivery Location', render: (val) => (
      <span className={styles.location}><MapPin size={12} /> {val}</span>
    )},
    { key: 'equipment', label: 'Trailer Profile' },
    { key: 'rate', label: 'Gross Rate', render: (val) => `$${(val || 0).toLocaleString()}` },
    { key: 'dispatchFee', label: 'Company Fee', render: (val, row) => `-$${(val !== undefined ? val : Math.round(row.rate * 0.08)).toLocaleString()}` },
    { key: 'driverPayout', label: 'My Net Payout', render: (val, row) => (
      <span className={styles.payout} style={{ color: 'var(--accent-gold)' }}>
        ${(val !== undefined ? val : (row.rate - Math.round(row.rate * 0.08))).toLocaleString()}
      </span>
    )},
    { key: 'status', label: 'Dispatch Status', render: (val) => <StatusBadge status={val} /> }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>My Dispatches & Orders</h2>
        <p>Review current active freight dispatches, pickup/drop times, and completed load sheets.</p>
      </div>

      <div className={styles.card}>
        <DataTable 
          columns={columns} 
          data={orders} 
          emptyText="You have no manual freight orders assigned to your profile yet." 
        />
      </div>
    </div>
  );
}
