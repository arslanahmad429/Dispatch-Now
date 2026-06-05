import { useState, useEffect } from 'react';
import { getMockDb, updateOrderStatus, saveMockDb } from '../../utils/mockDb';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { Check, Edit2 } from 'lucide-react';
import styles from './AssignLoads.module.css';

const DRIVER_OPTIONS = [
  "Marcus Williams",
  "Roadrunner Logistics",
  "Titan Freight",
  "Golden State Express",
  "Super Carrier Corp"
];

export default function AssignLoads() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState({});
  const [assignedId, setAssignedId] = useState(null);

  useEffect(() => {
    const db = getMockDb();
    // Orders waiting for dispatch (status: pending)
    const pending = db.orders.filter(o => o.status === 'pending');
    setPendingOrders(pending);
  }, []);

  const handleAssign = (orderId) => {
    const driver = selectedDriver[orderId];
    if (!driver) {
      alert("Please select a carrier first!");
      return;
    }

    const db = getMockDb();
    const order = db.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'dispatched';
      order.carrier = driver;
      order.dispatcher = 'Tom Richards';
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
      order.history.push({
        status: 'dispatched',
        time: timestamp,
        note: `Dispatcher Tom Richards assigned the load to carrier ${driver}`
      });
      saveMockDb(db);
      
      setAssignedId(orderId);
      setTimeout(() => {
        setPendingOrders(pendingOrders.filter(o => o.id !== orderId));
        setAssignedId(null);
      }, 1200);
    }
  };

  const handleDriverChange = (orderId, driverName) => {
    setSelectedDriver({ ...selectedDriver, [orderId]: driverName });
  };

  const columns = [
    { key: 'id', label: 'Load ID', sortable: true },
    { key: 'customer', label: 'Shipper' },
    { key: 'pickup', label: 'Pickup Location' },
    { key: 'delivery', label: 'Delivery Location' },
    { key: 'equipment', label: 'Equipment Req' },
    { key: 'rate', label: 'Rate Offered', render: (val) => `$${val.toLocaleString()}` },
    { key: 'driver', label: 'Assign Carrier', render: (_, row) => (
      <select 
        value={selectedDriver[row.id] || ""} 
        onChange={(e) => handleDriverChange(row.id, e.target.value)}
        className={styles.driverSelect}
      >
        <option value="">Choose a carrier...</option>
        {DRIVER_OPTIONS.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    )},
    { key: 'actions', label: 'Action', render: (_, row) => (
      assignedId === row.id ? (
        <span className={styles.assignedTag}><Check size={14} /> Dispatched</span>
      ) : (
        <button className={styles.assignBtn} onClick={() => handleAssign(row.id)}>
          Dispatch Truck
        </button>
      )
    )}
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Load Assignment Center</h2>
        <p>Match available carrier trucks with pending shipper freight bookings below.</p>
      </div>

      <div className={styles.card}>
        <DataTable columns={columns} data={pendingOrders} emptyText="No pending shipments awaiting dispatch." />
      </div>
    </div>
  );
}
