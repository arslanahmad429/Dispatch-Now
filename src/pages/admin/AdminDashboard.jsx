import { useState, useEffect } from 'react';
import { getMockDb } from '../../utils/mockDb';
import StatCard from '../../components/shared/StatCard';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { Users, Truck, DollarSign, Wallet, UserCheck } from 'lucide-react';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [carriersCount, setCarriersCount] = useState(0);

  useEffect(() => {
    const db = getMockDb();
    setOrders(db.orders);
    setCarriersCount(db.carriers.length);
  }, []);

  const totalLogisticsSpend = orders.reduce((sum, o) => sum + o.rate, 0);
  // Platform fee is roughly 8% on average
  const platformRevenue = Math.round(totalLogisticsSpend * 0.08);

  const uniqueShippers = new Set(orders.map(o => o.customer).filter(Boolean));
  const shippersAndCarriers = carriersCount + uniqueShippers.size;

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'customer', label: 'Shipper' },
    { key: 'pickup', label: 'Lanes', render: (_, row) => `${row.pickup ? row.pickup.split(',')[0] : 'N/A'} → ${row.delivery ? row.delivery.split(',')[0] : 'N/A'}` },
    { key: 'carrier', label: 'Carrier Assigned', render: (val) => val || <span style={{ color: 'var(--text-muted)' }}>Unassigned</span> },
    { key: 'dispatcher', label: 'Dispatcher Assigned', render: (val) => val || <span style={{ color: 'var(--text-muted)' }}>Unassigned</span> },
    { key: 'rate', label: 'Gross Rate', render: (val) => `$${(val || 0).toLocaleString()}` },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>System Administration</h2>
        <p>Monitor platform-wide dispatches, review driver compliance, track margins, and analyze earnings.</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard icon={<Users size={20} />} label="Registered Shippers" value={uniqueShippers.size.toString()} color="#8B5CF6" />
        <StatCard icon={<UserCheck size={20} />} label="Registered Carriers" value={carriersCount.toString()} color="#EC4899" />
        <StatCard icon={<Truck size={20} />} label="Active Fleet Loads" value={orders.filter(o => o.status !== 'delivered').length.toString()} color="#3B82F6" />
        <StatCard icon={<DollarSign size={20} />} label="Total Logistics Volume" value={`$${totalLogisticsSpend.toLocaleString()}`} color="#0f5bbf" />
        <StatCard icon={<Wallet size={20} />} label="Dispatch Fee Revenues" value={`$${platformRevenue.toLocaleString()}`} color="#10B981" />
      </div>

      <div className={styles.tableCard}>
        <h3>System Dispatches Audit</h3>
        <DataTable columns={columns} data={orders} />
      </div>
    </div>
  );
}
