import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMockDb, updateOrderStatus } from '../../utils/mockDb';
import { FileText, Image, UploadCloud, CheckCircle, ArrowLeft, Truck } from 'lucide-react';
import styles from './UploadProof.module.css';

export default function UploadProof() {
  const navigate = useNavigate();
  const [load, setLoad] = useState(null);
  const [bolUploaded, setBolUploaded] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const db = getMockDb();
    // Carrier's active load that is not delivered yet
    const active = db.orders.find(o => o.carrier === "Marcus Williams" && o.status !== "delivered");
    setLoad(active || null);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!load || !bolUploaded || !photoUploaded) return;

    setLoading(true);
    setTimeout(() => {
      const res = updateOrderStatus(load.id, 'delivered', {
        bolUrl: 'bol_proof.png',
        deliveryPhotoUrl: 'delivery_proof.png',
        note: 'Driver uploaded proof of delivery (BOL & Photo). Unloading verified.'
      });
      setLoading(false);
      if (res.success) {
        navigate('/carrier/history');
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

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            {/* BOL Drag & Drop Mock */}
            <div 
              className={`${styles.uploadBox} ${bolUploaded ? styles.uploadBoxActive : ''}`}
              onClick={() => setBolUploaded(true)}
            >
              <UploadCloud size={32} className={styles.icon} />
              <h4>Signed Bill of Lading (BOL) *</h4>
              <p>Click to select or scan receipt</p>
              {bolUploaded && (
                <div className={styles.uploadedBadge}>
                  <CheckCircle size={14} /> bol_receipt_signed.pdf
                </div>
              )}
            </div>

            {/* Photo Drag & Drop Mock */}
            <div 
              className={`${styles.uploadBox} ${photoUploaded ? styles.uploadBoxActive : ''}`}
              onClick={() => setPhotoUploaded(true)}
            >
              <UploadCloud size={32} className={styles.icon} />
              <h4>Delivery Parcel Photo *</h4>
              <p>Click to snap or upload drop-off photo</p>
              {photoUploaded && (
                <div className={styles.uploadedBadge}>
                  <CheckCircle size={14} /> cargo_dropoff_verified.jpg
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}
            disabled={!bolUploaded || !photoUploaded || loading}
          >
            {loading ? 'Submitting documentation...' : 'Confirm Delivery & Submit Proof'}
          </button>
        </form>
      </div>
    </div>
  );
}
