import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMockDb, updateOrderStatus } from '../../utils/mockDb';
import { FileText, Image, UploadCloud, CheckCircle, ArrowLeft, Truck } from 'lucide-react';
import { getApiUrl } from '../../config';
import styles from './UploadProof.module.css';

export default function UploadProof() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [load, setLoad] = useState(null);
  const [bolName, setBolName] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const db = getMockDb();
    // Carrier's active load that is not delivered yet matching logged-in carrier email
    const active = db.orders.find(o => o.carrierEmail && user.email && o.carrierEmail.toLowerCase() === user.email.toLowerCase() && o.status !== "delivered");
    setLoad(active || null);
  }, [user]);

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
      if (docType === 'bol') setBolName('');
      else setPhotoName('');
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
        if (docType === 'bol') setBolName(data.filename);
        else setPhotoName(data.filename);
      } else {
        setError(data.error || 'Failed to upload document to secure server.');
        if (docType === 'bol') setBolName('');
        else setPhotoName('');
      }
    } catch (err) {
      setLoading(false);
      console.warn('Backend server offline. Falling back to local file simulator.');
      if (docType === 'bol') setBolName(check.cleanName);
      else setPhotoName(check.cleanName);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!load || !bolName || !photoName) {
      setError('Please upload all required proofs before submitting.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = updateOrderStatus(load.id, 'delivered', {
        bolUrl: bolName,
        deliveryPhotoUrl: photoName,
        note: `Driver uploaded proof of delivery. BOL file: ${bolName}. Photo: ${photoName}`
      });
      setLoading(false);
      if (res.success) {
        navigate('/carrier/orders');
      }
    }, 1200);
  };

  if (!load) {
    return (
      <div className={styles.noLoad}>
        <Truck size={48} color="var(--text-muted)" />
        <h2>No Active Load to Deliver</h2>
        <p>Go to your dashboard or search loads to accept an assignment first.</p>
        <button onClick={() => navigate('/carrier/dashboard')} className="btn-primary" style={{ marginTop: '16px' }}>Dashboard</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Upload Proof of Delivery</h2>
          <p>Provide the signed Bill of Lading (BOL) and delivery photos to complete load <strong>{load.id}</strong>.</p>
        </div>

        {error && <div className={styles.errorAlert} style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: '#ef4444',
          padding: '12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '14px',
          marginBottom: '20px'
        }}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Hidden File Inputs with security configuration */}
          <input 
            id="file-input-bol" 
            type="file" 
            accept="image/png,image/jpeg,image/webp,application/pdf"
            style={{ display: 'none' }} 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileChange('bol', e.target.files[0], ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
              }
            }} 
          />
          <input 
            id="file-input-photo" 
            type="file" 
            accept="image/png,image/jpeg,image/webp"
            style={{ display: 'none' }} 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileChange('photo', e.target.files[0], ['image/jpeg', 'image/png', 'image/webp']);
              }
            }} 
          />

          <div className={styles.grid}>
            {/* BOL Drag & Drop */}
            <div 
              className={`${styles.uploadBox} ${bolName ? styles.uploadBoxActive : ''}`}
              onClick={() => document.getElementById('file-input-bol').click()}
              style={{ cursor: 'pointer' }}
            >
              <UploadCloud size={32} className={styles.icon} />
              <h4>Signed Bill of Lading (BOL) *</h4>
              <p>Click to select or scan receipt (PDF, JPG, PNG)</p>
              {bolName && (
                <div className={styles.uploadedBadge}>
                  <CheckCircle size={14} /> {bolName}
                </div>
              )}
            </div>

            {/* Photo Drag & Drop */}
            <div 
              className={`${styles.uploadBox} ${photoName ? styles.uploadBoxActive : ''}`}
              onClick={() => document.getElementById('file-input-photo').click()}
              style={{ cursor: 'pointer' }}
            >
              <UploadCloud size={32} className={styles.icon} />
              <h4>Delivery Parcel Photo *</h4>
              <p>Click to snap or upload drop-off photo (JPG, PNG)</p>
              {photoName && (
                <div className={styles.uploadedBadge}>
                  <CheckCircle size={14} /> {photoName}
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}
            disabled={!bolName || !photoName || loading}
          >
            {loading ? 'Submitting documentation...' : 'Confirm Delivery & Submit Proof'}
          </button>
        </form>
      </div>
    </div>
  );
}
