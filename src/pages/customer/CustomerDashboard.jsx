import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMockDb } from '../../utils/mockDb';
import StatCard from '../../components/shared/StatCard';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { Truck, Clock, ShieldCheck, DollarSign, Plus, MapPin } from 'lucide-react';
import styles from './CustomerDashboard.module.css';

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    const db = getMockDb();
    setOrders(db.orders);
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + o.rate, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const transitCount = orders.filter(o => o.status === 'in-transit' || o.status === 'dispatched').length;
  const completedCount = orders.filter(o => o.status === 'delivered').length;

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'route', label: 'Route', render: (_, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{row.pickup}</span>
        <span style={{ color: 'var(--text-muted)' }}>→</span>
        <span>{row.delivery}</span>
      </div>
    )},
    { key: 'equipment', label: 'Equipment' },
    { key: 'rate', label: 'Rate', sortable: true, render: (val) => `$${val.toLocaleString()}` },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'actions', label: 'Tracking', render: (_, row) => (
      <Link to={`/customer/track/${row.id}`} className={styles.trackLink}>
        <MapPin size={14} /> Track Load
      </Link>
    )}
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeRow}>
        <div>
          <h2>Shipper Dashboard</h2>
          <p>Manage your outbound logistics, track active lanes, and view financial statements.</p>
        </div>
        <Link to="/customer/book" className="btn-primary">
          <Plus size={16} /> Book Shipment
        </Link>
      </div>

      <div className={styles.statsGrid}>
        <StatCard icon={<Truck size={20} />} label="Active Shipments" value={transitCount} color="#3B82F6" />
        <StatCard icon={<Clock size={20} />} label="Pending Dispatch" value={pendingCount} color="#F59E0B" />
        <StatCard icon={<ShieldCheck size={20} />} label="Completed Deliveries" value={completedCount} color="#10B981" />
        <StatCard icon={<DollarSign size={20} />} label="Total Logistics Spend" value={`$${totalSpent.toLocaleString()}`} color="#FFD700" />
      </div>

      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h3>Recent Freight Orders</h3>
          <Link to="/customer/orders" className={styles.viewAll}>View all shipments</Link>
        </div>
        <DataTable columns={columns} data={orders.slice(0, 5)} searchable={false} />
      </div>
    </div>
  );
}
