import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, Truck, Lock, ArrowRight, FileText, UploadCloud } from 'lucide-react';
import styles from './Login.module.css'; // Reusing form classes

export default function CarrierRegister() {
  const { registerCarrier } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mcNumber: '',
    dotNumber: '',
    equipment: 'dry-van',
    password: '',
  });
  const [docs, setDocs] = useState({
    authority: false,
    insurance: false,
    w9: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = (docType) => {
    setDocs({ ...docs, [docType]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.mcNumber || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = registerCarrier(formData);
      setLoading(false);
      if (res.success) {
        navigate('/carrier/dashboard');
      } else {
        setError(res.error || 'Registration failed');
      }
    }, 1000);
  };

  return (
    <div className={styles.loginWrapper} style={{ maxWidth: '600px' }}>
      <h2>Carrier Registration</h2>
      <p className={styles.subtitle}>Sign up as an owner-operator or fleet to start receiving premium loads.</p>

      {error && <div className={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className={styles.inputGroup}>
            <label>First Name *</label>
            <div className={styles.inputWrapper}>
              <input 
                name="firstName"
                type="text" 
                placeholder="John" 
                value={formData.firstName}
                onChange={handleChange}
                required
                style={{ paddingLeft: '16px' }}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Last Name *</label>
            <div className={styles.inputWrapper}>
              <input 
                name="lastName"
                type="text" 
                placeholder="Smith" 
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{ paddingLeft: '16px' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className={styles.inputGroup}>
            <label>Email Address *</label>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input 
                name="email"
                type="email" 
                placeholder="john@company.com" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Phone Number *</label>
            <div className={styles.inputWrapper}>
              <Phone size={16} className={styles.inputIcon} />
              <input 
                name="phone"
                type="tel" 
                placeholder="(555) 000-0000" 
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className={styles.inputGroup}>
            <label>MC Number *</label>
            <div className={styles.inputWrapper}>
              <input 
                name="mcNumber"
                type="text" 
                placeholder="MC-XXXXXXX" 
                value={formData.mcNumber}
                onChange={handleChange}
                required
                style={{ paddingLeft: '16px' }}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>USDOT Number</label>
            <div className={styles.inputWrapper}>
              <input 
                name="dotNumber"
                type="text" 
                placeholder="DOT-XXXXXXX" 
                value={formData.dotNumber}
                onChange={handleChange}
                style={{ paddingLeft: '16px' }}
              />
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Primary Equipment *</label>
          <div className={styles.inputWrapper}>
            <Truck size={16} className={styles.inputIcon} style={{ pointerEvents: 'none', zIndex: 5 }} />
            <select 
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font)',
                outline: 'none',
                appearance: 'none',
              }}
            >
              <option value="dry-van">Dry Van (53ft)</option>
              <option value="flatbed">Flatbed / Stepdeck</option>
              <option value="reefer">Reefer / Temp-Controlled</option>
              <option value="box-truck">Box Truck (26ft)</option>
              <option value="hotshot">Hotshot</option>
            </select>
          </div>
        </div>

        {/* Mock Upload Section */}
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>Upload Documents (Required for activation)</label>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div 
              onClick={() => handleUpload('authority')}
              style={{
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                padding: '12px 6px',
                textAlign: 'center',
                cursor: 'pointer',
                background: docs.authority ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                borderColor: docs.authority ? '#22c55e' : 'var(--border)'
              }}
            >
              <UploadCloud size={20} style={{ color: docs.authority ? '#22c55e' : 'var(--text-muted)', marginBottom: '4px' }} />
              <p style={{ fontSize: '11px', fontWeight: '600', color: docs.authority ? '#22c55e' : 'var(--text-secondary)' }}>MC Authority</p>
            </div>

            <div 
              onClick={() => handleUpload('insurance')}
              style={{
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                padding: '12px 6px',
                textAlign: 'center',
                cursor: 'pointer',
                background: docs.insurance ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                borderColor: docs.insurance ? '#22c55e' : 'var(--border)'
              }}
            >
              <UploadCloud size={20} style={{ color: docs.insurance ? '#22c55e' : 'var(--text-muted)', marginBottom: '4px' }} />
              <p style={{ fontSize: '11px', fontWeight: '600', color: docs.insurance ? '#22c55e' : 'var(--text-secondary)' }}>Insurance Cert</p>
            </div>

            <div 
              onClick={() => handleUpload('w9')}
              style={{
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                padding: '12px 6px',
                textAlign: 'center',
                cursor: 'pointer',
                background: docs.w9 ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                borderColor: docs.w9 ? '#22c55e' : 'var(--border)'
              }}
            >
              <UploadCloud size={20} style={{ color: docs.w9 ? '#22c55e' : 'var(--text-muted)', marginBottom: '4px' }} />
              <p style={{ fontSize: '11px', fontWeight: '600', color: docs.w9 ? '#22c55e' : 'var(--text-secondary)' }}>W-9 Tax Form</p>
            </div>
          </div>
        </div>

        <div className={styles.inputGroup} style={{ marginTop: '10px' }}>
          <label>Password *</label>
          <div className={styles.inputWrapper}>
            <Lock size={16} className={styles.inputIcon} />
            <input 
              name="password"
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Submitting Application...' : 'Submit Application'} <ArrowRight size={16} />
        </button>
      </form>

      <div className={styles.registerPrompt}>
        <p>Already have an account? <Link to="/login" className={styles.regLink}>Sign In</Link></p>
      </div>
    </div>
  );
}
