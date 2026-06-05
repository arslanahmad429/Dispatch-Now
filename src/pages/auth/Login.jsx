import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../../context/AuthContext';
import { Shield, Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';
import styles from './Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (res.success) {
        navigate(getDashboardPath(res.role));
      } else {
        setError(res.error || 'Login failed');
      }
    }, 1000);
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className={styles.loginWrapper}>
      <h2>Sign In to Platform</h2>
      <p className={styles.subtitle}>Enter your credentials or select a demo role below to explore our multi-portal logistics system.</p>

      {error && <div className={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Email Address</label>
          <div className={styles.inputWrapper}>
            <Mail size={18} className={styles.inputIcon} />
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
        </button>
      </form>

      {/* Demo Users Section */}
      <div className={styles.demoSection}>
        <div className={styles.demoTitle}>
          <UserCheck size={14} />
          <span>Quick Demo Access (Click to auto-fill)</span>
        </div>
        <div className={styles.demoChips}>
          <button onClick={() => fillDemo('customer@dispatchnow.com')} className={styles.demoChip}>
            <span>Shipper / Customer</span>
          </button>
          <button onClick={() => fillDemo('carrier@dispatchnow.com')} className={styles.demoChip}>
            <span>Carrier / Driver</span>
          </button>
          <button onClick={() => fillDemo('dispatcher@dispatchnow.com')} className={styles.demoChip}>
            <span>Dispatcher</span>
          </button>
          <button onClick={() => fillDemo('admin@dispatchnow.com')} className={styles.demoChip}>
            <span>Administrator</span>
          </button>
        </div>
      </div>

      <div className={styles.registerPrompt}>
        <p>Don't have an account?</p>
        <div className={styles.registerLinks}>
          <Link to="/register/customer" className={styles.regLink}>Register as Customer</Link>
          <span className={styles.divider}>•</span>
          <Link to="/register/carrier" className={styles.regLink}>Register as Carrier</Link>
        </div>
      </div>
    </div>
  );
}
