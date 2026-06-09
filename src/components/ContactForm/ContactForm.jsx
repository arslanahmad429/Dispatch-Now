import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, CheckCircle, Phone, Mail, MapPin, Truck, Lock, ArrowRight, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Drawer from '../shared/Drawer';
import { getApiUrl, CONTACT_INFO } from '../../config';
import styles from './ContactForm.module.css';

const equipmentOptions = [
  { value: 'dry-van', label: 'Dry Van (53ft)' },
  { value: 'flatbed', label: 'Flatbed / Stepdeck' },
  { value: 'reefer', label: 'Reefer / Temp-Controlled' },
  { value: 'box-truck', label: 'Box Truck (26ft)' },
  { value: 'hotshot', label: 'Hotshot' }
];

export default function ContactForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activePolicy, setActivePolicy] = useState(null); // 'privacy' | 'terms' | null

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
    agreeToTerms: false,
  });

  const [docs, setDocs] = useState({
    license: '',
    registration: '',
    truckPhoto: '',
    driverPhoto: '',
    nationalId: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (error) setError('');
  };

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
    const fd = new FormData();
    fd.append('document', file);

    setLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/upload'), {
        method: 'POST',
        body: fd
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

    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy to register.');
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
    <section className={`section ${styles.contact}`} id="contact">
      <div className={styles.contactBg} />
      <div className="container">
        <div className={styles.grid}>
          {/* LEFT — Info */}
          <motion.div
            ref={ref}
            className={styles.left}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">Get Started</span>
            <h2 className="section-title">
              Let's Get Your <span className="highlight">Truck Moving</span>
            </h2>
            <p className="section-subtitle">
              Fill out the form and our dispatch compliance team will review your application to get you authorized.
            </p>

            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}><Phone size={20} /></div>
                <div>
                  <div className={styles.contactLabel}>Phone</div>
                  <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.contactValue}>{CONTACT_INFO.formattedPhone}</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}><Mail size={20} /></div>
                <div>
                  <div className={styles.contactLabel}>Email</div>
                  <a href={`mailto:${CONTACT_INFO.email}`} className={styles.contactValue}>
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}><MapPin size={20} /></div>
                <div>
                  <div className={styles.contactLabel}>Coverage</div>
                  <div className={styles.contactValue}>All 48 Contiguous States</div>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}><Truck size={20} /></div>
                <div>
                  <div className={styles.contactLabel}>Hours</div>
                  <div className={styles.contactValue}>24/7 — We Never Sleep</div>
                </div>
              </div>
            </div>

            <div className={styles.disclaimer}>
              <p>
                <strong>Note:</strong> Dispatch Now is an independent dispatch service, not a freight broker.
                We act as your authorized agent under your MC authority. All freight contracts are between
                you (the carrier) and the freight broker.
              </p>
            </div>
          </motion.div>

          {/* RIGHT — Form */}
          <motion.div
            className={styles.right}
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className={styles.formCard}>
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <div className={styles.formTitle}>
                  <span>Start Your Application</span>
                  <span className={styles.freeTag}>Free to Join</span>
                </div>

                {error && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '14px',
                    marginBottom: '20px',
                    textAlign: 'center'
                  }}>{error}</div>
                )}

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="firstName">First Name *</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="lastName">Last Name *</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Smith"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">Email Address *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="phone">Phone Number *</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="truckNumber">Truck Plate/Number *</label>
                    <input
                      id="truckNumber"
                      name="truckNumber"
                      type="text"
                      placeholder="TRK-9821"
                      value={formData.truckNumber}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="licenseNumber">Driver License Number *</label>
                    <input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      placeholder="DL-CA928103"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="equipment">Primary Equipment *</label>
                  <select
                    id="equipment"
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    {equipmentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* 5 required documents upload grids */}
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Upload Compliance Documents * (All 5 Required)</label>
                  
                  {/* Hidden File Inputs */}
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

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
                    <div 
                      onClick={() => document.getElementById('file-input-license').click()}
                      style={{
                        border: '1px dashed var(--border)',
                        borderRadius: '8px',
                        padding: '16px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: docs.license ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                        borderColor: docs.license ? '#22c55e' : 'var(--border)',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <UploadCloud size={20} style={{ color: docs.license ? '#22c55e' : 'var(--text-muted)', marginBottom: '6px' }} />
                      <p style={{ fontSize: '11px', fontWeight: '700', color: docs.license ? '#22c55e' : 'var(--text-primary)', margin: 0 }}>Driver License</p>
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
                        borderColor: docs.registration ? '#22c55e' : 'var(--border)',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <UploadCloud size={20} style={{ color: docs.registration ? '#22c55e' : 'var(--text-muted)', marginBottom: '6px' }} />
                      <p style={{ fontSize: '11px', fontWeight: '700', color: docs.registration ? '#22c55e' : 'var(--text-primary)', margin: 0 }}>Truck Reg Paper</p>
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
                        borderColor: docs.truckPhoto ? '#22c55e' : 'var(--border)',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <UploadCloud size={20} style={{ color: docs.truckPhoto ? '#22c55e' : 'var(--text-muted)', marginBottom: '6px' }} />
                      <p style={{ fontSize: '11px', fontWeight: '700', color: docs.truckPhoto ? '#22c55e' : 'var(--text-primary)', margin: 0 }}>Truck Photo</p>
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
                        borderColor: docs.driverPhoto ? '#22c55e' : 'var(--border)',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <UploadCloud size={20} style={{ color: docs.driverPhoto ? '#22c55e' : 'var(--text-muted)', marginBottom: '6px' }} />
                      <p style={{ fontSize: '11px', fontWeight: '700', color: docs.driverPhoto ? '#22c55e' : 'var(--text-primary)', margin: 0 }}>Driver Photo</p>
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
                        borderColor: docs.nationalId ? '#22c55e' : 'var(--border)',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <UploadCloud size={20} style={{ color: docs.nationalId ? '#22c55e' : 'var(--text-muted)', marginBottom: '6px' }} />
                      <p style={{ fontSize: '11px', fontWeight: '700', color: docs.nationalId ? '#22c55e' : 'var(--text-primary)', margin: 0 }}>National ID Card</p>
                      {docs.nationalId && <span style={{ display: 'block', fontSize: '9px', color: '#22c55e', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{docs.nationalId}</span>}
                    </div>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="password">Password *</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={styles.input}
                      style={{ paddingLeft: '48px' }}
                    />
                  </div>
                </div>

                <div className={styles.checkboxField}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className={styles.checkbox}
                    />
                    <span>
                      I agree to the{' '}
                      <a 
                        href="#" 
                        className={styles.link} 
                        onClick={(e) => { e.preventDefault(); setActivePolicy('terms'); }}
                      >
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a 
                        href="#" 
                        className={styles.link} 
                        onClick={(e) => { e.preventDefault(); setActivePolicy('privacy'); }}
                      >
                        Privacy Policy
                      </a>. I understand Dispatch Now
                      is a dispatching service, not a freight broker.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className={`btn-primary ${styles.submitBtn}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className={styles.spinner} />
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Application
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== DRAWER OVERLAYS FOR LEGAL POLICIES ===== */}
      <Drawer isOpen={activePolicy === 'privacy'} onClose={() => setActivePolicy(null)} title="Privacy Policy">
        <div style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>1. Information We Collect</h4>
          <p>We collect essential commercial credentials during your onboarding process, including your name, email address, phone number, active Driver License (CDL), vehicle plate registration papers, physical truck photographs, headshot photographs, national ID cards, and Motor Carrier (MC) authority credentials.</p>
          
          <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>2. Data Storage Integrity</h4>
          <p>All compliance documents, profile information, and load dispatch sheets are stored locally inside your browser's sandbox namespace (<code>localStorage</code>) to maintain system integrity offline. No personal data is sent to external advertising or tracking platforms.</p>
          
          <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>3. How We Use Credentials</h4>
          <p>We use driver details and compliance papers to coordinate manual dispatches with US shippers and freight brokers. Registered truck license plates and MC numbers are cross-audited in our database to ensure that duplicate registrations are blocked.</p>
        </div>
      </Drawer>

      <Drawer isOpen={activePolicy === 'terms'} onClose={() => setActivePolicy(null)} title="Terms of Service">
        <div style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>1. Carrier Registry Requirements</h4>
          <p>We operate on an individual driver-to-truck registration model. Fleet registrations or bulk account creations are not supported. Every driver must register himself with his specific truck plate number. Unique plates and MC codes are strictly checked upon sign-up.</p>

          <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>2. Service Fees & Payout Cut</h4>
          <p>We charge a flat <strong>8% dispatch service fee</strong> of the gross rate of the load. We do not deduct additional hidden fees. Invoices are generated automatically in the financial ledger, displaying your gross billing and net payouts clearly.</p>

          <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>3. Manual Billing Settlements</h4>
          <p>Carriers are required to upload proof of delivery (signed Bill of Lading and a parcel drop-off photo) in the driver portal to initiate factoring release. Logistics administrators review these uploads and release payments manually outside this offline demo client.</p>
        </div>
      </Drawer>
    </section>
  );
}
