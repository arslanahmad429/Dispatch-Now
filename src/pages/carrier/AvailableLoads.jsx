import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMockDb, carrierAcceptLoad } from '../../utils/mockDb';
import DataTable from '../../components/shared/DataTable';
import { MapPin, Navigation, DollarSign, CheckCircle } from 'lucide-react';
import styles from './AvailableLoads.module.css';

export default function AvailableLoads() {
  const navigate = useNavigate();
  const [loads, setLoads] = useState([]);
  const [acceptedId, setAcceptedId] = useState(null);

  useEffect(() => {
    const db = getMockDb();
    setLoads(db.availableLoads);
  }, []);

  const handleAccept = (loadId) => {
    const res = carrierAcceptLoad(loadId, "Marcus Williams");
    if (res.success) {
      setAcceptedId(loadId);
      setTimeout(() => {
        navigate('/carrier/active');
      }, 1500);
    }
  };

  const columns = [
    { key: 'id', label: 'Load ID', sortable: true },
    { key: 'pickup', label: 'Pickup Location', sortable: true },
    { key: 'delivery', label: 'Delivery Location', sortable: true },
    { key: 'equipment', label: 'Equipment' },
    { key: 'distance', label: 'Distance (mi)', sortable: true, render: (val) => `${val} mi` },
    { key: 'rate', label: 'Payout', sortable: true, render: (val) => `$${val.toLocaleString()}` },
    { key: 'rpm', label: 'Rate/Mile', render: (_, row) => `$${(row.rate / row.distance).toFixed(2)}/mi` },
    { key: 'actions', label: 'Select Load', render: (_, row) => (
      acceptedId === row.id ? (
        <span className={styles.acceptedTag}><CheckCircle size={14} /> Accepted</span>
      ) : (
        <button className={styles.acceptBtn} onClick={() => handleAccept(row.id)}>
          Accept Load
        </button>
      )
    )}
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Available Load Board</h2>
        <p>Live freight postings matching your equipment profile. Click Accept to book a load.</p>
      </div>

      <div className={styles.loadBoardCard}>
        <DataTable columns={columns} data={loads} emptyText="No available loads listed at this time." />
      </div>
    </div>
  );
}
