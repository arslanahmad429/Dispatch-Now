import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdminCredentials, updateAdminCredentials } from '../../utils/mockDb';
import { User, Lock, Save, ShieldAlert, CheckCircle } from 'lucide-react';
import styles from './AdminSettings.module.css';

export default function AdminSettings() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const creds = getAdminCredentials();
    setEmail(creds.email);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedEmail = email.trim();
    
    // Strict verification check: must end with @dispatchnow or @dispatchnow.us
    if (!trimmedEmail.endsWith('@dispatchnow.us') && !trimmedEmail.endsWith('@dispatchnow')) {
      setError('Strict security rejection: Admin User ID must end with @dispatchnow.us or @dispatchnow');
      return;
    }

    if (!password) {
      setError('Please enter a new password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('For security, password should be at least 6 characters.');
      return;
    }

    const res = updateAdminCredentials(trimmedEmail, password);
    if (res.success) {
      setSuccess('Admin credentials updated successfully! Changes saved to database.');
      setPassword('');
      setConfirmPassword('');
      
      // Update context state dynamically
      setUser(prev => {
        if (prev && prev.role === 'admin') {
          return { ...prev, email: trimmedEmail };
        }
        return prev;
      });
    } else {
      setError('Failed to update credentials.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Administrator Security Settings</h2>
        <p>Manage admin dashboard access credentials. Hardcoded default settings should be changed immediately for security compliance.</p>
      </div>

      <div className={styles.card}>
        {error && (
          <div className={styles.errorAlert}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className={styles.successAlert}>
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Admin User ID (Email Address)</label>
            <p className={styles.fieldHelp}>Must end with @dispatchnow.us or @dispatchnow</p>
            <div className={styles.inputWrapper}>
              <User size={16} />
              <input 
                type="text" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="admin@dispatchnow.us" 
                required 
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>New Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={16} />
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter new admin password" 
                required 
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Confirm New Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={16} />
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="Re-enter new password" 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
            <Save size={16} /> Save Security Changes
          </button>
        </form>
      </div>
    </div>
  );
}
