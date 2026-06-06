import { useState, useEffect } from 'react';
import { getMockDb, updatePaymentStatus } from '../../utils/mockDb';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { Check, Clock, ShieldAlert, DollarSign } from 'lucide-react';
import styles from './AdminPayments.module.css';

export default function AdminPayments() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const db = getMockDb();
    setOrders(db.orders);
  }, []);

  const handleRelease = (orderId) => {
    const res = updatePaymentStatus(orderId, 'paid');
    if (res.success) {
      // Reload orders from database
      const db = getMockDb();
      setOrders(db.orders);
    } else {
      alert("Error: Payout release failed.");
    }
  };

  const columns = [
    { key: 'id', label: 'Billing INV', sortable: true, render: (val) => `INV-${val.split('-')[1]}` },
    { key: 'customer', label: 'Shipper' },
    { key: 'carrier', label: 'Assigned Driver', render: (val) => val || "None" },
    { key: 'rate', label: 'Gross Freight', sortable: true, render: (val) => `$${(val || 0).toLocaleString()}` },
    { key: 'dispatchFee', label: 'Dispatch Cut', render: (val, row) => `-$${(val !== undefined ? val : Math.round(row.rate * 0.08)).toLocaleString()}` },
    { key: 'driverPayout', label: 'Driver Payout', render: (val, row) => (
      <span style={{ fontWeight: '600' }}>${(val !== undefined ? val : (row.rate - Math.round(row.rate * 0.08))).toLocaleString()}</span>
    )},
    { key: 'status', label: 'Delivery Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'paymentStatus', label: 'Payout status', render: (val) => (
      <StatusBadge status={val === 'paid' ? 'paid' : 'pending'} />
    )},
    { key: 'actions', label: 'Manual Settlement', render: (_, row) => {
      if (row.paymentStatus === 'paid') {
        return <span className={styles.verified}><Check size={14} /> Disbursed</span>;
      }
      
      if (row.status === 'delivered') {
        return (
          <button className={styles.releaseBtn} onClick={() => handleRelease(row.id)}>
            Release Payout
          </button>
        );
      }
      
      return (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} /> Awaiting Delivery
        </span>
      );
    }}
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Billing & Financial Settlements</h2>
        <p>Record manual factoring payouts, audit company service cuts, and disburse driver settlement receipts.</p>
      </div>

      <div className={styles.card}>
        <DataTable columns={columns} data={orders} emptyText="No invoices found in ledger." />
      </div>
    </div>
  );
}
