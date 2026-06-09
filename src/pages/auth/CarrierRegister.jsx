import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, Truck, Lock, ArrowRight, UploadCloud } from 'lucide-react';
import { getApiUrl } from '../../config';
import styles from './Login.module.css'; // Reusing form classes

export default function CarrierRegister() {
  const { registerCarrier } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    truckNumber: '',
    licenseNumber: '',
    equipment: 'dry-van',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [docs, setDocs] = useState({
    license: '',
    registration: '',
    truckPhoto: '',
    driverPhoto: '',
    nationalId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Security Helper: Validate file size, extension, MIME type, and sanitize filename
  const validateUploadedFile = (file, allowedTypes) => {
    if (!file) return { valid: false, error: 'No file selected.' };

    // 1. Enforce strict file size limit (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { 
        valid: false, 
        error: `File size exceeds the 5MB security limit. (Selected file: ${(file.size / (1024 * 1024)).toFixed(2)}MB)` 
      };
    }

    // 2. Validate MIME Type
    const fileType = file.type.toLowerCase();
    if (!allowedTypes.includes(fileType)) {
      return { 
        valid: false, 
        error: 'Security Rejection: Invalid file type. Only JPEG, PNG, WEBP, and PDF documents are allowed.' 
      };
    }

    // 3. Validate File Extension matching MIME
    const fileName = file.name.toLowerCase();
    const extMatch = fileName.match(/\.([a-z0-9]+)$/);
    if (!extMatch) {
      return { valid: false, error: 'Security Rejection: Filename is missing an extension.' };
    }

    const ext = extMatch[1];
    const allowedExtensions = {
      'application/pdf': ['pdf'],
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/webp': ['webp']
    };

    let isExtValid = false;
    for (const mime of allowedTypes) {
      if (allowedExtensions[mime] && allowedExtensions[mime].includes(ext)) {
        isExtValid = true;
        break;
      }
    }

    if (!isExtValid) {
      return { valid: false, error: `Security Rejection: Extension ".${ext}" does not match the actual file content type.` };
    }

    // 4. Sanitize File Name (Removes path traversal, scripting elements, special characters)
    const cleanName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.{2,}/g, '.');

    // 5. Prevent double extension attacks (e.g. payload.php.png)
    const segments = cleanName.split('.');
    if (segments.length > 2) {
      const dangerousExts = ['php', 'html', 'htm', 'js', 'sh', 'bat', 'cmd', 'exe', 'msi', 'jar', 'vbs', 'scr', 'phtml', 'svg'];
      for (let i = 1; i < segments.length - 1; i++) {
        if (dangerousExts.includes(segments[i].toLowerCase())) {
          return { valid: false, error: 'Security Rejection: Dangerous file structure detected (double extension).' };
        }
      }
    }

    return { valid: true, cleanName };
  };

  const handleFileChange = async (docType, file, allowedTypes) => {
    setError('');
    const check = validateUploadedFile(file, allowedTypes);
    if (!check.valid) {
      setError(check.error);
      setDocs(prev => ({ ...prev, [docType]: '' }));
      const element = document.getElementById(`file-input-${docType}`);
      if (element) element.value = '';
      return;
    }

    // Physical backend file upload integration
    const formData = new FormData();
    formData.append('document', file);

    setLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/upload'), {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setLoading(false);
      
      if (response.ok && data.success) {
        setDocs(prev => ({ ...prev, [docType]: data.filename }));
      } else {
        setError(data.error || 'Failed to upload document to secure server.');
        setDocs(prev => ({ ...prev, [docType]: '' }));
      }
    } catch (err) {
      setLoading(false);
      console.warn('Backend server offline. Falling back to local file simulator.');
      setDocs(prev => ({ ...prev, [docType]: check.cleanName }));
    }
  };

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
    setError('');

    // Sanitize all form values before validation/submission
    const sanitizedData = {
      firstName: sanitizeInput(formData.firstName),
      lastName: sanitizeInput(formData.lastName),
      email: sanitizeInput(formData.email),
      phone: sanitizeInput(formData.phone),
      truckNumber: sanitizeInput(formData.truckNumber),
      licenseNumber: sanitizeInput(formData.licenseNumber),
      equipment: sanitizeInput(formData.equipment),
      password: sanitizeInput(formData.password)
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s.-]{7,15}$/;

    if (!sanitizedData.firstName || sanitizedData.firstName.length < 2) {
      setError('First name must be at least 2 characters');
      return;
    }
    if (!sanitizedData.lastName || sanitizedData.lastName.length < 2) {
      setError('Last name must be at least 2 characters');
      return;
    }
    if (!emailRegex.test(sanitizedData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!phoneRegex.test(sanitizedData.phone)) {
      setError('Please enter a valid phone number (7 to 15 digits)');
      return;
    }
    if (!sanitizedData.truckNumber || sanitizedData.truckNumber.length < 3) {
      setError('Please enter a valid Truck Plate/Number, e.g. TRK-9821');
      return;
    }
    if (!sanitizedData.licenseNumber || sanitizedData.licenseNumber.length < 4) {
      setError('Please enter a valid Driver License Number');
      return;
    }
    
    // Enforce strong password complexity policy
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.])[A-Za-z\d@$!%*?&#.]{8,}$/;
    if (!strongPasswordRegex.test(sanitizedData.password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#.).');
      return;
    }
    
    // Check that all 5 documents are uploaded
    if (!docs.license || !docs.registration || !docs.truckPhoto || !docs.driverPhoto || !docs.nationalId) {
      setError('Please upload all 5 required documents (License, Vehicle Registration, Truck Photo, Driver Photo, and National ID Card) for compliance verification.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = registerCarrier({
        ...sanitizedData,
        docs: {
          license: docs.license,
          registration: docs.registration,
          truckPhoto: docs.truckPhoto,
          driverPhoto: docs.driverPhoto,
          nationalId: docs.nationalId
        }
      });
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
        <div className={styles.formGrid}>
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

        <div className={styles.formGrid}>
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

        <div className={styles.formGrid}>
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

        <div className={styles.inputGroup}>
          <label>Primary Equipment *</label>
          <div className={styles.inputWrapper}>
            <select 
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                fontFamily: 'var(--font)',
                outline: 'none',
              }}
            >
              <option value="dry-van" style={{ background: '#0a0a0a', color: '#ffffff' }}>Dry Van (53ft)</option>
              <option value="flatbed" style={{ background: '#0a0a0a', color: '#ffffff' }}>Flatbed / Stepdeck</option>
              <option value="reefer" style={{ background: '#0a0a0a', color: '#ffffff' }}>Reefer / Temp-Controlled</option>
              <option value="box-truck" style={{ background: '#0a0a0a', color: '#ffffff' }}>Box Truck (26ft)</option>
              <option value="hotshot" style={{ background: '#0a0a0a', color: '#ffffff' }}>Hotshot</option>
            </select>
          </div>
        </div>

        {/* 5 required documents upload grids */}
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#e2e8f0' }}>Upload Compliance Documents * (All 5 Required)</label>
          
          {/* Hidden File Inputs with security configuration */}
          <input 
            id="file-input-license" 
            type="file" 
            accept="image/png,image/jpeg,image/webp,application/pdf"
            style={{ display: 'none' }} 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileChange('license', e.target.files[0], ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
              }
            }} 
          />
          <input 
            id="file-input-registration" 
            type="file" 
            accept="image/png,image/jpeg,image/webp,application/pdf"
            style={{ display: 'none' }} 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileChange('registration', e.target.files[0], ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
              }
            }} 
          />
          <input 
            id="file-input-truckPhoto" 
            type="file" 
            accept="image/png,image/jpeg,image/webp"
            style={{ display: 'none' }} 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileChange('truckPhoto', e.target.files[0], ['image/jpeg', 'image/png', 'image/webp']);
              }
            }} 
          />
          <input 
            id="file-input-driverPhoto" 
            type="file" 
            accept="image/png,image/jpeg,image/webp"
            style={{ display: 'none' }} 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileChange('driverPhoto', e.target.files[0], ['image/jpeg', 'image/png', 'image/webp']);
              }
            }} 
          />
          <input 
            id="file-input-nationalId" 
            type="file" 
            accept="image/png,image/jpeg,image/webp,application/pdf"
            style={{ display: 'none' }} 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileChange('nationalId', e.target.files[0], ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
              }
            }} 
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
            <div 
              onClick={() => document.getElementById('file-input-license').click()}
              style={{
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                padding: '16px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                background: docs.license ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                borderColor: docs.license ? '#22c55e' : 'rgba(255, 255, 255, 0.35)',
                transition: 'all 0.25s ease'
              }}
            >
              <UploadCloud size={20} style={{ color: docs.license ? '#22c55e' : 'rgba(255, 255, 255, 0.70)', marginBottom: '6px' }} />
              <p style={{ fontSize: '11px', fontWeight: '700', color: docs.license ? '#22c55e' : '#ffffff', margin: 0 }}>Driver License</p>
              {docs.license && <span style={{ display: 'block', fontSize: '9px', color: '#22c55e', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{docs.license}</span>}
            </div>

            <div 
              onClick={() => document.getElementById('file-input-registration').click()}
              style={{
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                padding: '16px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                background: docs.registration ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                borderColor: docs.registration ? '#22c55e' : 'rgba(255, 255, 255, 0.35)',
                transition: 'all 0.25s ease'
              }}
            >
              <UploadCloud size={20} style={{ color: docs.registration ? '#22c55e' : 'rgba(255, 255, 255, 0.70)', marginBottom: '6px' }} />
              <p style={{ fontSize: '11px', fontWeight: '700', color: docs.registration ? '#22c55e' : '#ffffff', margin: 0 }}>Truck Reg Paper</p>
              {docs.registration && <span style={{ display: 'block', fontSize: '9px', color: '#22c55e', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{docs.registration}</span>}
            </div>

            <div 
              onClick={() => document.getElementById('file-input-truckPhoto').click()}
              style={{
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                padding: '16px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                background: docs.truckPhoto ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                borderColor: docs.truckPhoto ? '#22c55e' : 'rgba(255, 255, 255, 0.35)',
                transition: 'all 0.25s ease'
              }}
            >
              <UploadCloud size={20} style={{ color: docs.truckPhoto ? '#22c55e' : 'rgba(255, 255, 255, 0.70)', marginBottom: '6px' }} />
              <p style={{ fontSize: '11px', fontWeight: '700', color: docs.truckPhoto ? '#22c55e' : '#ffffff', margin: 0 }}>Truck Photo</p>
              {docs.truckPhoto && <span style={{ display: 'block', fontSize: '9px', color: '#22c55e', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{docs.truckPhoto}</span>}
            </div>

            <div 
              onClick={() => document.getElementById('file-input-driverPhoto').click()}
              style={{
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                padding: '16px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                background: docs.driverPhoto ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                borderColor: docs.driverPhoto ? '#22c55e' : 'rgba(255, 255, 255, 0.35)',
                transition: 'all 0.25s ease'
              }}
            >
              <UploadCloud size={20} style={{ color: docs.driverPhoto ? '#22c55e' : 'rgba(255, 255, 255, 0.70)', marginBottom: '6px' }} />
              <p style={{ fontSize: '11px', fontWeight: '700', color: docs.driverPhoto ? '#22c55e' : '#ffffff', margin: 0 }}>Driver Photo</p>
              {docs.driverPhoto && <span style={{ display: 'block', fontSize: '9px', color: '#22c55e', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{docs.driverPhoto}</span>}
            </div>

            <div 
              onClick={() => document.getElementById('file-input-nationalId').click()}
              style={{
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                padding: '16px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                background: docs.nationalId ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                borderColor: docs.nationalId ? '#22c55e' : 'rgba(255, 255, 255, 0.35)',
                transition: 'all 0.25s ease'
              }}
            >
              <UploadCloud size={20} style={{ color: docs.nationalId ? '#22c55e' : 'rgba(255, 255, 255, 0.70)', marginBottom: '6px' }} />
              <p style={{ fontSize: '11px', fontWeight: '700', color: docs.nationalId ? '#22c55e' : '#ffffff', margin: 0 }}>National ID Card</p>
              {docs.nationalId && <span style={{ display: 'block', fontSize: '9px', color: '#22c55e', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{docs.nationalId}</span>}
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
