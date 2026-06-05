import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Truck, DollarSign, Save } from 'lucide-react';
import styles from './CarrierProfile.module.css';

export default function CarrierProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '(555) 987-6543',
    truckModel: 'Freightliner Cascadia (2022)',
    maxWeight: '45000',
    factoringCompany: 'Apex Capital Corp',
    bankAccount: '•••• •••• •••• 9281',
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Carrier & Truck Profile</h2>
        <p>Edit your vehicle dimensions, factoring details, and dispatch settings.</p>
      </div>

      <div className={styles.card}>
        {success && <div className={styles.success}>Carrier profile saved successfully!</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Driver / Owner Name</label>
            <div className={styles.inputWrapper}>
              <User size={16} />
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
          </div>

          <div className={styles.field}>
            <label>Truck Make & Model</label>
            <div className={styles.inputWrapper}>
              <Truck size={16} />
              <input type="text" value={form.truckModel} onChange={e => setForm({...form, truckModel: e.target.value})} />
            </div>
          </div>

          <div className={styles.field}>
            <label>Max Freight Capacity (lbs)</label>
            <div className={styles.inputWrapper}>
              <input type="number" value={form.maxWeight} onChange={e => setForm({...form, maxWeight: e.target.value})} style={{ paddingLeft: '16px' }} />
            </div>
          </div>

          <div className={styles.field}>
            <label>Factoring Company (For same-day payouts)</label>
            <div className={styles.inputWrapper}>
              <DollarSign size={16} />
              <input type="text" value={form.factoringCompany} onChange={e => setForm({...form, factoringCompany: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Save size={16} /> Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
