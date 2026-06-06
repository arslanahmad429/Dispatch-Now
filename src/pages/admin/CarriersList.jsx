import { useState, useEffect } from 'react';
import { getCarriers, updateCarrierStatus, getMockDb } from '../../utils/mockDb';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { Check, X, Mail, Phone, Calendar } from 'lucide-react';
import styles from './CarriersList.module.css';

export default function CarriersList() {
  const [carriers, setCarriers] = useState([]);

  useEffect(() => {
    // Load registered carriers from database
    setCarriers(getCarriers());
  }, []);

  const toggleApproval = (mcNumber) => {
    const db = getMockDb();
    const carrier = db.carriers.find(c => c.mcNumber === mcNumber);
    if (carrier) {
      const nextStatus = carrier.status === 'approved' ? 'pending' : 'approved';
      updateCarrierStatus(mcNumber, nextStatus);
      // Refresh local state list
      setCarriers(getCarriers());
    }
  };

  const columns = [
    { key: 'joinedDate', label: 'Registration Date', sortable: true, render: (val) => (
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <Calendar size={12} /> {val}
      </span>
    )},
    { key: 'name', label: 'Owner / Operator', sortable: true, render: (val, row) => (
      <div>
        <div style={{ fontWeight: '600' }}>{val}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={10} /> {row.email}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={10} /> {row.phone}</span>
        </div>
      </div>
    )},
    { key: 'mcNumber', label: 'Authority Codes', render: (_, row) => (
      <div style={{ fontSize: '0.9rem' }}>
        <div>MC: <strong>{row.mcNumber}</strong></div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>USDOT: {row.dotNumber}</div>
      </div>
    )},
    { key: 'equipment', label: 'Trailer Profile', render: (val) => (
      <span style={{ textTransform: 'capitalize' }}>{val.replace('-', ' ')}</span>
    )},
    { key: 'carrierType', label: 'Carrier Scale', sortable: true, render: (val) => (
      <span style={{ 
        fontSize: '0.8rem', 
        fontWeight: 'bold', 
        padding: '2px 8px', 
        borderRadius: '12px', 
        background: val === 'fleet' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
        color: val === 'fleet' ? '#3b82f6' : '#8b5cf6',
        textTransform: 'uppercase'
      }}>
        {val === 'fleet' ? 'Fleet (6% fee)' : 'Solo (8% fee)'}
      </span>
    )},
    { key: 'status', label: 'Compliance', render: (val) => <StatusBadge status={val} /> },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <button 
        className={row.status === 'approved' ? styles.suspendBtn : styles.approveBtn}
        onClick={() => toggleApproval(row.mcNumber)}
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
        <p>Approve new owner-operator registrations, review insurance files, and monitor compliance status.</p>
      </div>

      <div className={styles.card}>
        <DataTable columns={columns} data={carriers} emptyText="No carriers registered in the database yet." />
      </div>
    </div>
  );
}
