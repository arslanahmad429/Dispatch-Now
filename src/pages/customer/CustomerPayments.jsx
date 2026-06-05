import { useState, useEffect } from 'react';
import { getMockDb } from '../../utils/mockDb';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { CreditCard, Download, DollarSign, Wallet } from 'lucide-react';
import styles from './CustomerPayments.module.css';

export default function CustomerPayments() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const db = getMockDb();
    setOrders(db.orders);
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + o.rate, 0);
  const paidCount = orders.filter(o => o.status === 'delivered').length;
  const unpaidCount = orders.filter(o => o.status !== 'delivered').length;
  const totalOutstanding = orders.filter(o => o.status !== 'delivered').reduce((sum, o) => sum + o.rate, 0);

  const columns = [
    { key: 'id', label: 'Invoice #', sortable: true, render: (val) => `INV-${val.split('-')[1]}` },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'pickup', label: 'Lanes', render: (_, row) => `${row.pickup.split(',')[0]} → ${row.delivery.split(',')[0]}` },
    { key: 'rate', label: 'Amount', sortable: true, render: (val) => `$${val.toLocaleString()}` },
    { key: 'status', label: 'Payment Status', render: (_, row) => (
      <StatusBadge status={row.status === 'delivered' ? 'paid' : 'pending'} />
    )},
    { key: 'actions', label: 'Invoice', render: () => (
      <button className={styles.downloadBtn} onClick={() => alert("Invoice PDF download placeholder.")}>
        <Download size={14} /> PDF
      </button>
    )}
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Payments & Invoices</h2>
        <p>Manage statements, download rate confirmations, and view invoices.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.iconWrap} style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)' }}>
            <DollarSign size={20} />
          </div>
          <div className={styles.statContent}>
            <span>Total Logistics Spend</span>
            <h3>${totalSpent.toLocaleString()}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrap} style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)' }}>
            <Wallet size={20} />
          </div>
          <div className={styles.statContent}>
            <span>Outstanding Invoices</span>
            <h3>${totalOutstanding.toLocaleString()}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrap} style={{ color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)' }}>
            <CreditCard size={20} />
          </div>
          <div className={styles.statContent}>
            <span>Billing Status</span>
            <h3>{paidCount} Paid / {unpaidCount} Pending</h3>
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <h3>Billing Transactions</h3>
        <DataTable columns={columns} data={orders} />
      </div>
    </div>
  );
}
