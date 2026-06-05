import { useState, useEffect } from 'react';
import { getMockDb } from '../../utils/mockDb';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { FileText, Download } from 'lucide-react';
import styles from './LoadHistory.module.css';

export default function LoadHistory() {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    const db = getMockDb();
    // Carrier completed loads (Marcus Williams)
    const filtered = db.orders.filter(o => o.carrier === "Marcus Williams" && o.status === "delivered");
    setCompleted(filtered);
  }, []);

  const totalEarnings = completed.reduce((sum, o) => sum + o.rate, 0);

  const columns = [
    { key: 'id', label: 'Load ID', sortable: true },
    { key: 'date', label: 'Delivery Date', sortable: true },
    { key: 'pickup', label: 'Pickup Location' },
    { key: 'delivery', label: 'Delivery Location' },
    { key: 'commodity', label: 'Commodity' },
    { key: 'rate', label: 'Earnings', sortable: true, render: (val) => `$${val.toLocaleString()}` },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'actions', label: 'Statement', render: () => (
      <button className={styles.downloadBtn} onClick={() => alert("Statement download placeholder.")}>
        <Download size={14} /> PDF
      </button>
    )}
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Load History & Earnings</h2>
          <p>Review your historical dispatches, gross earnings, and download tax statements.</p>
        </div>
        <div className={styles.earningsSummary}>
          <span>Gross Earnings (Filtered)</span>
          <h3>${totalEarnings.toLocaleString()}</h3>
        </div>
      </div>

      <div className={styles.tableCard}>
        <DataTable columns={columns} data={completed} emptyText="No historical shipments completed." />
      </div>
    </div>
  );
}
