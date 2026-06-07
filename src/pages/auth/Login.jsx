import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../../context/AuthContext';
import { Shield, Truck, Lock, ArrowRight } from 'lucide-react';
import styles from './Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [truckNumber, setTruckNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sanitize input helper to mitigate XSS / Script Injection
  const sanitizeInput = (val) => {
    if (typeof val !== 'string') return '';
    return val
      .replace(/[&<>"'/]/g, (match) => {
        const entityMap = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '/': '&#x2F;'
        };
        return entityMap[match];
      })
      .trim();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const sanitizedTruck = sanitizeInput(truckNumber);
    const sanitizedPassword = sanitizeInput(password);

    if (!sanitizedTruck || !sanitizedPassword) {
      setError('Invalid characters detected in form inputs.');
      return;
    }

    // Check brute-force lockout status
    const lockout = Number(localStorage.getItem('dn_login_lockout') || 0);
    if (lockout && Date.now() < lockout) {
      const waitSecs = Math.ceil((lockout - Date.now()) / 1000);
      setError(`Too many failed attempts. Login locked. Please try again in ${waitSecs} seconds.`);
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = login(sanitizedTruck, sanitizedPassword);
      setLoading(false);
      
      if (res.success) {
        // Reset brute-force counter on success
        localStorage.removeItem('dn_login_fails');
        localStorage.removeItem('dn_login_lockout');
        navigate(getDashboardPath(res.role));
      } else {
        // Increment brute-force fails
        const fails = Number(localStorage.getItem('dn_login_fails') || 0) + 1;
        localStorage.setItem('dn_login_fails', fails.toString());
        
        if (fails >= 5) {
          const lockUntil = Date.now() + 60 * 1000; // 60s lockout
          localStorage.setItem('dn_login_lockout', lockUntil.toString());
          setError('Too many failed login attempts. Your login is locked for 60 seconds.');
        } else {
          const cleanErr = (res.error || 'Login failed').replace(/\.$/, '');
          setError(`${cleanErr}. (${5 - fails} attempts remaining)`);
        }
      }
    }, 1000);
  };



  return (
    <div className={styles.loginWrapper}>
      <h2>Log In</h2>
      <p className={styles.subtitle}>Enter your registered Truck Plate No and password to access your dashboard.</p>

      {error && <div className={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Truck Plate No</label>
          <div className={styles.inputWrapper}>
            <Truck size={18} className={styles.inputIcon} />
            <input 
              type="text" 
              placeholder="TRK-9821" 
              value={truckNumber}
              onChange={(e) => setTruckNumber(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.labelRow}>
            <label>Password</label>
            <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
          </div>
          <div className={styles.inputWrapper}>
            <Lock size={18} className={styles.inputIcon} />
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Authenticating...' : 'Log In'} <ArrowRight size={16} />
        </button>
      </form>



      <div className={styles.registerPrompt}>
        <p>Don't have an account? <Link to="/register/carrier" className={styles.regLink}>Register as Driver</Link></p>
      </div>
    </div>
  );
}
