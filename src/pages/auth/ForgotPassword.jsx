import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import styles from './Login.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className={styles.loginWrapper}>
      <h2>Reset Password</h2>
      {sent ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', marginBottom: '16px' }}>
            <CheckCircle size={32} />
          </div>
          <h3>Check your email</h3>
          <p className={styles.subtitle} style={{ marginTop: '8px' }}>We have sent a password reset link to <strong>{email}</strong>.</p>
          <Link to="/login" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}>Back to Log In</Link>
        </div>
      ) : (
        <>
          <p className={styles.subtitle}>Enter the email address associated with your account, and we will email you a password reset link.</p>
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
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Send Reset Link <ArrowRight size={16} />
            </button>
          </form>
          <div className={styles.registerPrompt}>
            <p><Link to="/login" className={styles.regLink}>Back to Log In</Link></p>
          </div>
        </>
      )}
    </div>
  );
}
