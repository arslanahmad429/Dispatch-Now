import { useState } from 'react';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { DollarSign, Percent } from 'lucide-react';
import styles from './RateLog.module.css';

const MOCK_NEGOTIATIONS = [
  { broker: "C.H. Robinson", lane: "Houston, TX → Denver, CO", initial: 3400, final: 3800, dispatcher: "Tom Richards", date: "2026-06-03" },
  { broker: "TQL (Total Quality Logistics)", lane: "Chicago, IL → Los Angeles, CA", initial: 5800, final: 6200, dispatcher: "Tom Richards", date: "2026-06-02" },
  { broker: "Landstar Systems", lane: "Miami, FL → New York, NY", initial: 4600, final: 5100, dispatcher: "Tom Richards", date: "2026-06-03" },
  { broker: "Echo Global Logistics", lane: "Dallas, TX → Oklahoma City, OK", initial: 950, final: 1050, dispatcher: "Tom Richards", date: "2026-06-01" },
  { broker: "Coyote Logistics", lane: "Atlanta, GA → Charlotte, NC", initial: 720, final: 800, dispatcher: "Tom Richards", date: "2026-06-03" }
];

export default function RateLog() {
  const [logs, setLogs] = useState(MOCK_NEGOTIATIONS);

  const columns = [
    { key: 'broker', label: 'Broker Company', sortable: true },
    { key: 'lane', label: 'Lane (Route)' },
    { key: 'initial', label: 'Broker Initial Offer', sortable: true, render: (val) => `$${val.toLocaleString()}` },
    { key: 'final', label: 'Negotiated Final', sortable: true, render: (val) => `$${val.toLocaleString()}` },
    { key: 'increase', label: 'Negotiation Gain', render: (_, row) => {
      const diff = row.final - row.initial;
      return <span style={{ color: '#22c55e', fontWeight: 600 }}>+${diff.toLocaleString()} (+{((diff / row.initial)*100).toFixed(0)}%)</span>
    }},
    { key: 'dispatcher', label: 'Negotiated By' },
    { key: 'date', label: 'Negotiation Date', sortable: true }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Rate Negotiation Log</h2>
        <p>Audit trail of dispatcher performance: tracking starting broker offers vs negotiated final payout rates.</p>
      </div>

      <div className={styles.card}>
        <DataTable columns={columns} data={logs} />
      </div>
    </div>
  );
}
