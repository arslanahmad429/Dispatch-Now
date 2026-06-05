import { useState } from 'react';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { Check, X, ShieldAlert } from 'lucide-react';
import styles from './CarriersList.module.css';

const MOCK_CARRIERS = [
  { name: "Marcus Williams", company: "Williams Trucking", mc: "MC-928103", equipment: "Flatbed", status: "approved" },
  { name: "John Doe", company: "JD Express Logistics", mc: "MC-719329", equipment: "Dry Van", status: "pending" },
  { name: "Robert Taylor", company: "Titan Heavy Haul", mc: "MC-301284", equipment: "Reefer", status: "approved" },
  { name: "Sara Connor", company: "Cyberdyne Shipping", mc: "MC-449102", equipment: "Hotshot", status: "suspended" }
];

export default function CarriersList() {
  const [carriers, setCarriers] = useState(MOCK_CARRIERS);

  const toggleApproval = (mcNumber) => {
    setCarriers(carriers.map(c => {
      if (c.mc === mcNumber) {
        const nextStatus = c.status === 'approved' ? 'pending' : 'approved';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const columns = [
    { key: 'name', label: 'Owner / Operator', sortable: true },
    { key: 'company', label: 'Company', sortable: true },
    { key: 'mc', label: 'MC Number' },
    { key: 'equipment', label: 'Equipment Profile' },
    { key: 'status', label: 'Compliance Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'actions', label: 'Verify Authority', render: (_, row) => (
      <button 
        className={row.status === 'approved' ? styles.suspendBtn : styles.approveBtn}
        onClick={() => toggleApproval(row.mc)}
      >
        {row.status === 'approved' ? <X size={12} /> : <Check size={12} />}
        {row.status === 'approved' ? "Suspend" : "Approve"}
      </button>
    )}
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Carriers Compliance Panel</h2>
        <p>Approve new owner-operator registrations, review insurance files, and monitor safety alerts.</p>
      </div>

      <div className={styles.card}>
        <DataTable columns={columns} data={carriers} />
      </div>
    </div>
  );
}
