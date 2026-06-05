import { useState, useEffect } from 'react';
import { getMockDb } from '../../utils/mockDb';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { Check, Clock, ShieldAlert } from 'lucide-react';
import styles from './AdminPayments.module.css';

export default function AdminPayments() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const db = getMockDb();
    setOrders(db.orders);
  }, []);

  const columns = [
    { key: 'id', label: 'Billing INV', sortable: true, render: (val) => `INV-${val.split('-')[1]}` },
    { key: 'customer', label: 'Shipper' },
    { key: 'carrier', label: 'Paid To Carrier', render: (val) => val || "None" },
    { key: 'rate', label: 'Gross Freight Pay', sortable: true, render: (val) => `$${val.toLocaleString()}` },
    { key: 'fee', label: 'Dispatch Fee (8%)', render: (_, row) => `$${Math.round(row.rate * 0.08).toLocaleString()}` },
    { key: 'status', label: 'Payout status', render: (val, row) => (
      <StatusBadge status={row.status === 'delivered' ? 'paid' : 'pending'} />
    )},
    { key: 'actions', label: 'Settlement Payout', render: (_, row) => (
      row.status === 'delivered' ? (
        <span className={styles.verified}><Check size={12} /> Disbursed</span>
      ) : (
        <button className={styles.releaseBtn} onClick={() => alert("Release factoring payment placeholder.")}>
          Release Funds
        </button>
      )
    )}
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Billing & Financial Settlements</h2>
        <p>Audit system dispatch fees collected, monitor factoring disbursements, and release funds.</p>
      </div>

      <div className={styles.card}>
        <DataTable columns={columns} data={orders} />
      </div>
    </div>
  );
}
