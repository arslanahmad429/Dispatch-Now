import { useState, useEffect } from 'react';
import { getMockDb } from '../../utils/mockDb';
import StatCard from '../../components/shared/StatCard';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { Truck, Landmark, Clock, CheckSquare } from 'lucide-react';
import styles from './DispatcherDashboard.module.css';

export default function DispatcherDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const db = getMockDb();
    setOrders(db.orders);
  }, []);

  const dispatchedCount = orders.filter(o => o.status === 'dispatched').length;
  const transitCount = orders.filter(o => o.status === 'in-transit').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'customer', label: 'Shipper' },
    { key: 'pickup', label: 'Route', render: (_, row) => `${row.pickup.split(',')[0]} → ${row.delivery.split(',')[0]}` },
    { key: 'carrier', label: 'Carrier Assigned', render: (val) => val || "Awaiting Carrier" },
    { key: 'rate', label: 'Pay Rate', render: (val) => `$${val.toLocaleString()}` },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Dispatcher Console</h2>
        <p>Assign owner-operators to shipper loads, review rate negotiations, and track driver ETAs.</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard icon={<Clock size={20} />} label="Unassigned Loads" value={pendingCount} color="#F59E0B" />
        <StatCard icon={<Truck size={20} />} label="Active Dispatches" value={dispatchedCount} color="#3B82F6" />
        <StatCard icon={<Landmark size={20} />} label="In Transit" value={transitCount} color="#8B5CF6" />
        <StatCard icon={<CheckSquare size={20} />} label="Delivered Today" value={deliveredCount} color="#10B981" />
      </div>

      <div className={styles.tableCard}>
        <h3>Recent Operations Pipeline</h3>
        <DataTable columns={columns} data={orders} />
      </div>
    </div>
  );
}
