import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../../context/AuthContext';
import { getMockDb, resetCarrierPassword } from '../../utils/mockDb';
import { Truck, Mail, Phone, FileText, Lock, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import styles from './Login.module.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Verification Form State
  const [truckNumber, setTruckNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Password Reset Form State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Flow State
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [success, setSuccess] = useState(false);
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

  const handleVerify = (e) => {
    e.preventDefault();

    const sanitizedTruck = sanitizeInput(truckNumber);
    const sanitizedLicense = sanitizeInput(licenseNumber);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = sanitizeInput(phone);

    if (!sanitizedTruck || !sanitizedLicense || !sanitizedEmail || !sanitizedPhone) {
      setError('Invalid characters detected in form inputs.');
      return;
    }

    // Check brute-force verification lockout status
    const lockout = Number(localStorage.getItem('dn_verify_lockout') || 0);
    if (lockout && Date.now() < lockout) {
      const waitSecs = Math.ceil((lockout - Date.now()) / 1000);
      setError(`Verification locked due to too many failed attempts. Try again in ${waitSecs} seconds.`);
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      const db = getMockDb();
      const cleanTruck = sanitizedTruck.toUpperCase();
      const cleanLicense = sanitizedLicense.toUpperCase();
      const cleanEmail = sanitizedEmail.toLowerCase();
      
      const cleanInputPhone = sanitizedPhone.replace(/\D/g, '');

      // Find carrier matching the primary key (truckNumber)
      const carrier = db.carriers.find(
        c => c.truckNumber && c.truckNumber.toUpperCase() === cleanTruck
      );

      if (!carrier) {
        setLoading(false);
        recordFailedAttempt();
        setError(`No registered driver profile found for Truck Plate "${cleanTruck}".`);
        return;
      }

      const cleanCarrierPhone = carrier.phone.replace(/\D/g, '');

      // Authenticate all details
      const isLicenseValid = carrier.licenseNumber && carrier.licenseNumber.toUpperCase() === cleanLicense;
      const isEmailValid = carrier.email && carrier.email.toLowerCase() === cleanEmail;
      const isPhoneValid = cleanCarrierPhone === cleanInputPhone;

      setLoading(false);

      if (!isLicenseValid || !isEmailValid || !isPhoneValid) {
        recordFailedAttempt();
        setError('Verification failed. Driver license, email, or phone number does not match this Truck Plate.');
        return;
      }

      // Success: Reset brute-force counter and advance
      localStorage.removeItem('dn_verify_fails');
      localStorage.removeItem('dn_verify_lockout');
      setVerified(true);
    }, 800);
  };

  const recordFailedAttempt = () => {
    const fails = Number(localStorage.getItem('dn_verify_fails') || 0) + 1;
    localStorage.setItem('dn_verify_fails', fails.toString());
    if (fails >= 5) {
      const lockUntil = Date.now() + 60 * 1000;
      localStorage.setItem('dn_verify_lockout', lockUntil.toString());
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');

    const sanitizedNewPassword = sanitizeInput(newPassword);
    const sanitizedConfirmPassword = sanitizeInput(confirmPassword);

    if (!sanitizedNewPassword || !sanitizedConfirmPassword) {
      setError('Invalid characters detected in password inputs.');
      return;
    }

    // Enforce strong password complexity policy
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.])[A-Za-z\d@$!%*?&#.]{8,}$/;
    if (!strongPasswordRegex.test(sanitizedNewPassword)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#.).');
      return;
    }

    if (sanitizedNewPassword !== sanitizedConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // 1. Update the password in database
      const res = resetCarrierPassword(truckNumber, sanitizedNewPassword);
      
      if (!res.success) {
        setLoading(false);
        setError(res.error || 'Failed to reset password.');
        return;
      }

      // 2. Log in instantly
      const loginRes = login(truckNumber, sanitizedNewPassword);
      setLoading(false);

      if (loginRes.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(getDashboardPath(loginRes.role));
        }, 1500);
      } else {
        setError('Password reset successfully, but failed to log in automatically. Please log in manually.');
      }
    }, 1000);
  };

  return (
    <div className={styles.loginWrapper} style={{ maxWidth: '500px' }}>
      {success ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', marginBottom: '16px' }}>
            <CheckCircle size={36} />
          </div>
          <h3>Password Reset Successful!</h3>
          <p className={styles.subtitle} style={{ marginTop: '8px' }}>Logging you in and redirecting to your portal...</p>
        </div>
      ) : verified ? (
        <>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', background: 'rgba(15, 91, 191, 0.1)', color: 'var(--accent)', marginBottom: '12px' }}>
              <ShieldCheck size={36} />
            </div>
            <h2>Set New Password</h2>
            <p className={styles.subtitle}>Enter a secure new password for Truck <strong>{truckNumber.toUpperCase()}</strong>.</p>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <form onSubmit={handleResetPassword} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>New Password *</label>
              <div className={styles.inputWrapper}>
                <Lock size={16} className={styles.inputIcon} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Confirm New Password *</label>
              <div className={styles.inputWrapper}>
                <Lock size={16} className={styles.inputIcon} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Saving Password...' : 'Reset & Log In'} <ArrowRight size={16} />
            </button>
          </form>
        </>
      ) : (
        <>
          <h2>Account Verification</h2>
          <p className={styles.subtitle}>Enter your vehicle credentials to authenticate and reset your password.</p>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <form onSubmit={handleVerify} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Registered Truck Plate No *</label>
              <div className={styles.inputWrapper}>
                <Truck size={16} className={styles.inputIcon} />
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
              <label>Driver License Number *</label>
              <div className={styles.inputWrapper}>
                <FileText size={16} className={styles.inputIcon} />
                <input 
                  type="text" 
                  placeholder="DL-CA928103" 
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Registered Email Address *</label>
              <div className={styles.inputWrapper}>
                <Mail size={16} className={styles.inputIcon} />
                <input 
                  type="email" 
                  placeholder="john@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Registered Phone Number *</label>
              <div className={styles.inputWrapper}>
                <Phone size={16} className={styles.inputIcon} />
                <input 
                  type="tel" 
                  placeholder="(555) 000-0000" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Verifying Details...' : 'Verify & Continue'} <ArrowRight size={16} />
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
