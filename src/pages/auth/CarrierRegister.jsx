import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, Truck, Lock, ArrowRight, UploadCloud } from 'lucide-react';
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
    truckNumber: '',
    licenseNumber: '',
    equipment: 'dry-van',
    password: '',
  });
  const [docs, setDocs] = useState({
    license: false,
    registration: false,
    truckPhoto: false,
    driverPhoto: false,
    nationalId: false
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
    setError('');

    // Form data integrity checks
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const mcRegex = /^(MC-)?[0-9]{6,7}$/i;
    const dotRegex = /^(DOT-)?[0-9]{7,8}$/i;

    if (!formData.firstName || formData.firstName.trim().length < 2) {
      setError('First name must be at least 2 characters');
      return;
    }
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      setError('Last name must be at least 2 characters');
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit US phone number, e.g. (555) 123-4567');
      return;
    }
    if (!formData.truckNumber || formData.truckNumber.trim().length < 3) {
      setError('Please enter a valid Truck Plate/Number, e.g. TRK-9821');
      return;
    }
    if (!formData.licenseNumber || formData.licenseNumber.trim().length < 4) {
      setError('Please enter a valid Driver License Number');
      return;
    }
    if (!mcRegex.test(formData.mcNumber)) {
      setError('Please enter a valid MC number, e.g. MC-123456 (6-7 digits)');
      return;
    }
    if (formData.dotNumber && !dotRegex.test(formData.dotNumber)) {
      setError('Please enter a valid USDOT number, e.g. DOT-1234567 (7-8 digits)');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Check that all 5 documents are uploaded
    if (!docs.license || !docs.registration || !docs.truckPhoto || !docs.driverPhoto || !docs.nationalId) {
      setError('Please upload all 5 required documents (License, Vehicle Registration, Truck Photo, Driver Photo, and National ID Card) for compliance verification.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = registerCarrier(formData);
      setLoading(false);
      if (res.success) {
        navigate('/register/thank-you');
      } else {
        setError(res.error || 'Registration failed');
      }
    }, 1000);
  };

  return (
    <div className={styles.loginWrapper} style={{ maxWidth: '600px' }}>
      <h2>Register as Driver</h2>
      <p className={styles.subtitle}>Register with your vehicle credentials to start receiving manual freight dispatches.</p>

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
            <label>Truck Plate/Number *</label>
            <div className={styles.inputWrapper}>
              <input 
                name="truckNumber"
                type="text" 
                placeholder="TRK-9821" 
                value={formData.truckNumber}
                onChange={handleChange}
                required
                style={{ paddingLeft: '16px' }}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Driver License Number *</label>
            <div className={styles.inputWrapper}>
              <input 
                name="licenseNumber"
                type="text" 
                placeholder="DL-CA928103" 
                value={formData.licenseNumber}
                onChange={handleChange}
                required
                style={{ paddingLeft: '16px' }}
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
            <select 
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '14px 16px 14px 16px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font)',
                outline: 'none',
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

        {/* 5 required documents upload grids */}
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>Upload Compliance Documents * (All 5 Required)</label>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
            <div 
              onClick={() => handleUpload('license')}
              style={{
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                padding: '12px 6px',
                textAlign: 'center',
                cursor: 'pointer',
                background: docs.license ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                borderColor: docs.license ? '#22c55e' : 'var(--border)'
              }}
            >
              <UploadCloud size={18} style={{ color: docs.license ? '#22c55e' : 'var(--text-muted)', marginBottom: '4px' }} />
              <p style={{ fontSize: '10px', fontWeight: '600', color: docs.license ? '#22c55e' : 'var(--text-secondary)' }}>Driver License</p>
            </div>

            <div 
              onClick={() => handleUpload('registration')}
              style={{
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                padding: '12px 6px',
                textAlign: 'center',
                cursor: 'pointer',
                background: docs.registration ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                borderColor: docs.registration ? '#22c55e' : 'var(--border)'
              }}
            >
              <UploadCloud size={18} style={{ color: docs.registration ? '#22c55e' : 'var(--text-muted)', marginBottom: '4px' }} />
              <p style={{ fontSize: '10px', fontWeight: '600', color: docs.registration ? '#22c55e' : 'var(--text-secondary)' }}>Truck Reg Paper</p>
            </div>

            <div 
              onClick={() => handleUpload('truckPhoto')}
              style={{
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                padding: '12px 6px',
                textAlign: 'center',
                cursor: 'pointer',
                background: docs.truckPhoto ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                borderColor: docs.truckPhoto ? '#22c55e' : 'var(--border)'
              }}
            >
              <UploadCloud size={18} style={{ color: docs.truckPhoto ? '#22c55e' : 'var(--text-muted)', marginBottom: '4px' }} />
              <p style={{ fontSize: '10px', fontWeight: '600', color: docs.truckPhoto ? '#22c55e' : 'var(--text-secondary)' }}>Truck Photo</p>
            </div>

            <div 
              onClick={() => handleUpload('driverPhoto')}
              style={{
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                padding: '12px 6px',
                textAlign: 'center',
                cursor: 'pointer',
                background: docs.driverPhoto ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                borderColor: docs.driverPhoto ? '#22c55e' : 'var(--border)'
              }}
            >
              <UploadCloud size={18} style={{ color: docs.driverPhoto ? '#22c55e' : 'var(--text-muted)', marginBottom: '4px' }} />
              <p style={{ fontSize: '10px', fontWeight: '600', color: docs.driverPhoto ? '#22c55e' : 'var(--text-secondary)' }}>Driver Photo</p>
            </div>

            <div 
              onClick={() => handleUpload('nationalId')}
              style={{
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                padding: '12px 6px',
                textAlign: 'center',
                cursor: 'pointer',
                background: docs.nationalId ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                borderColor: docs.nationalId ? '#22c55e' : 'var(--border)'
              }}
            >
              <UploadCloud size={18} style={{ color: docs.nationalId ? '#22c55e' : 'var(--text-muted)', marginBottom: '4px' }} />
              <p style={{ fontSize: '10px', fontWeight: '600', color: docs.nationalId ? '#22c55e' : 'var(--text-secondary)' }}>National ID Card</p>
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
        <p>Already have an account? <Link to="/login" className={styles.regLink}>Log In</Link></p>
      </div>
    </div>
  );
}
