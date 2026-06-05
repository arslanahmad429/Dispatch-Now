import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Building, Save } from 'lucide-react';
import styles from './CustomerProfile.module.css';

export default function CustomerProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(555) 123-4567',
    company: 'ACME Industrial Ltd',
    notifications: true
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
        <h2>Profile Settings</h2>
        <p>Manage your account configurations, profile details, and notifications.</p>
      </div>

      <div className={styles.card}>
        {success && <div className={styles.success}>Profile settings updated successfully!</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Full Name</label>
            <div className={styles.inputWrapper}>
              <User size={16} />
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
          </div>

          <div className={styles.field}>
            <label>Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail size={16} />
              <input type="email" value={form.email} readOnly style={{ opacity: 0.7 }} />
            </div>
          </div>

          <div className={styles.field}>
            <label>Phone Number</label>
            <div className={styles.inputWrapper}>
              <Phone size={16} />
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
          </div>

          <div className={styles.field}>
            <label>Company Name</label>
            <div className={styles.inputWrapper}>
              <Building size={16} />
              <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
            </div>
          </div>

          <div className={styles.checkboxField}>
            <input 
              type="checkbox" 
              checked={form.notifications} 
              onChange={e => setForm({...form, notifications: e.target.checked})} 
            />
            <span>Receive real-time tracking email notifications for my shipments</span>
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Save size={16} /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
