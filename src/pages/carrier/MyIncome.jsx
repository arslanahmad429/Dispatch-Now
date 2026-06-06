import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMockDb } from '../../utils/mockDb';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import styles from './MyIncome.module.css';

export default function MyIncome() {
  const { user } = useAuth();
  const [completedOrders, setCompletedOrders] = useState([]);
  const [stats, setStats] = useState({
    gross: 0,
    fees: 0,
    paid: 0,
    pending: 0
  });

  useEffect(() => {
    if (!user) return;
    const db = getMockDb();
    
    // Find delivered loads assigned to this logged-in carrier email
    const myCompleted = db.orders.filter(
      o => o.carrierEmail.toLowerCase() === user.email.toLowerCase() && o.status === 'delivered'
    );
    setCompletedOrders(myCompleted);

    let gross = 0;
    let fees = 0;
    let paid = 0;
    let pending = 0;

    myCompleted.forEach(o => {
      gross += o.rate;
      fees += o.dispatchFee;
      if (o.paymentStatus === 'paid') {
        paid += o.driverPayout;
      } else {
        pending += o.driverPayout;
      }
    });

    setStats({ gross, fees, paid, pending });
  }, [user]);

  const columns = [
    { key: 'id', label: 'Invoice Ref', render: (val) => `INV-${val.split('-')[1]}` },
    { key: 'date', label: 'Delivery Date' },
    { key: 'customer', label: 'Shipper' },
    { key: 'rate', label: 'Gross Freight', render: (val) => `$${val.toLocaleString()}` },
    { key: 'dispatchFee', label: 'Dispatch Cut', render: (val) => `-$${val.toLocaleString()}` },
    { key: 'driverPayout', label: 'My Net Payout', render: (val) => (
      <span className={styles.payout}>${val.toLocaleString()}</span>
    )},
    { key: 'paymentStatus', label: 'Payout status', render: (val) => (
      <StatusBadge status={val === 'paid' ? 'paid' : 'pending'} />
    )},
    { key: 'settlement', label: 'Settlement Method', render: (_, row) => (
      row.paymentStatus === 'paid' ? (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bank Direct Transfer</span>
      ) : (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Factoring Pending</span>
      )
    )}
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>My Income & Financial Ledger</h2>
        <p>Monitor your weekly factoring invoices, company dispatch fees, and manual bank payouts.</p>
      </div>

      {/* Financial Ledger Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.iconBg} ${styles.blue}`}>
            <DollarSign size={20} />
          </div>
          <div>
            <p className={styles.label}>Gross Billings</p>
            <h3>${stats.gross.toLocaleString()}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconBg} ${styles.red}`}>
            <AlertCircle size={20} />
          </div>
          <div>
            <p className={styles.label}>Dispatch Fees (Cut)</p>
            <h3>${stats.fees.toLocaleString()}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconBg} ${styles.green}`}>
            <CheckCircle size={20} />
          </div>
          <div>
            <p className={styles.label}>Settled & Disbursed</p>
            <h3 style={{ color: '#10B981' }}>${stats.paid.toLocaleString()}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconBg} ${styles.orange}`}>
            <Clock size={20} />
          </div>
          <div>
            <p className={styles.label}>Pending Release</p>
            <h3 style={{ color: '#F59E0B' }}>${stats.pending.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h3>Transaction History</h3>
        <DataTable 
          columns={columns} 
          data={completedOrders} 
          emptyText="You have no settled orders in your financial ledger yet." 
        />
      </div>
    </div>
  );
}
