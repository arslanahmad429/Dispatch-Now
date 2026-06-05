import { useState, useEffect } from 'react';
import { getMockDb, updateOrderStatus, saveMockDb } from '../../utils/mockDb';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { Edit2, ShieldAlert } from 'lucide-react';
import styles from './AllOrders.module.css';

export default function AllOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const db = getMockDb();
    setOrders(db.orders);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    const res = updateOrderStatus(orderId, newStatus, { note: `Admin updated status to ${newStatus}` });
    if (res.success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'customer', label: 'Shipper', sortable: true },
    { key: 'pickup', label: 'Pickup' },
    { key: 'delivery', label: 'Delivery' },
    { key: 'equipment', label: 'Equipment' },
    { key: 'rate', label: 'Amount', sortable: true, render: (val) => `$${val.toLocaleString()}` },
    { key: 'dispatcher', label: 'Dispatcher', render: (val) => val || "None" },
    { key: 'carrier', label: 'Carrier', render: (val) => val || "None" },
    { key: 'status', label: 'Manage Status', render: (val, row) => (
      <select 
        value={val} 
        onChange={(e) => handleStatusChange(row.id, e.target.value)}
        className={styles.statusSelect}
      >
        <option value="pending">Pending</option>
        <option value="dispatched">Dispatched</option>
        <option value="in-transit">In Transit</option>
        <option value="delivered">Delivered</option>
      </select>
    )}
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Universal Freight Orders</h2>
        <p>Overview of all logistics orders placed across the system. Override statuses or view documents.</p>
      </div>

      <div className={styles.card}>
        <DataTable columns={columns} data={orders} />
      </div>
    </div>
  );
}
