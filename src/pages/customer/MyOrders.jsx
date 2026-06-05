import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMockDb } from '../../utils/mockDb';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { MapPin, Plus } from 'lucide-react';
import styles from './MyOrders.module.css';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const db = getMockDb();
    setOrders(db.orders);
  }, []);

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'date', label: 'Ship Date', sortable: true },
    { key: 'pickup', label: 'Pickup Location', sortable: true },
    { key: 'delivery', label: 'Delivery Location', sortable: true },
    { key: 'equipment', label: 'Equipment Type' },
    { key: 'commodity', label: 'Commodity' },
    { key: 'rate', label: 'Amount', sortable: true, render: (val) => `$${val.toLocaleString()}` },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'actions', label: 'Action', render: (_, row) => (
      <Link to={`/customer/track/${row.id}`} className={styles.trackLink}>
        <MapPin size={14} /> Track Load
      </Link>
    )}
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>My Shipments</h2>
          <p>View, track, and manage all your historical and active freight shipments.</p>
        </div>
        <Link to="/customer/book" className="btn-primary">
          <Plus size={16} /> Book Shipment
        </Link>
      </div>

      <div className={styles.tableCard}>
        <DataTable columns={columns} data={orders} emptyText="No shipments booked yet." />
      </div>
    </div>
  );
}
