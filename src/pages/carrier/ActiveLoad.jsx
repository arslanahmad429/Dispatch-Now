import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMockDb, updateOrderStatus } from '../../utils/mockDb';
import StatusBadge from '../../components/shared/StatusBadge';
import { MapPin, Truck, Phone, MessageSquare, UploadCloud, CheckCircle, Navigation } from 'lucide-react';
import styles from './ActiveLoad.module.css';

export default function ActiveLoad() {
  const navigate = useNavigate();
  const [load, setLoad] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const db = getMockDb();
    // Carrier's active load (carrier: Marcus Williams, status is dispatched or in-transit)
    const active = db.orders.find(o => o.carrier === "Marcus Williams" && o.status !== "delivered");
    setLoad(active || null);
  }, []);

  const handleStatusChange = (newStatus, note) => {
    if (!load) return;
    setLoading(true);
    setTimeout(() => {
      const res = updateOrderStatus(load.id, newStatus, { note });
      setLoading(false);
      if (res.success) {
        setLoad({ ...load, status: newStatus });
      }
    }, 1000);
  };

  if (!load) {
    return (
      <div className={styles.noLoad}>
        <Truck size={48} color="var(--text-muted)" />
        <h2>No Active Load Assignment</h2>
        <p>You are currently off-duty or awaiting your next dispatch assignment.</p>
        <Link to="/carrier/loads" className="btn-primary" style={{ marginTop: '16px' }}>
          Find Available Loads
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h2>Active Load: {load.id}</h2>
            <StatusBadge status={load.status} />
          </div>
          <p className={styles.routeHeader}>{load.pickup} <span style={{ color: 'var(--accent)' }}>→</span> {load.delivery}</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Load Actions & Pickup/Delivery Card */}
        <div className={styles.left}>
          <div className={styles.card}>
            <h3>Routing details</h3>
            <div className={styles.points}>
              <div className={styles.point}>
                <div className={styles.marker} style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>A</div>
                <div className={styles.pointText}>
                  <p className={styles.pointLabel}>Pickup Location</p>
                  <p className={styles.pointVal}>{load.pickup}</p>
                </div>
              </div>

              <div className={styles.point}>
                <div className={styles.marker} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>B</div>
                <div className={styles.pointText}>
                  <p className={styles.pointLabel}>Delivery Location</p>
                  <p className={styles.pointVal}>{load.delivery}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger Card */}
          <div className={styles.card}>
            <h3>Driver Dispatch Status Action</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              Update your dispatcher and customer in real-time by clicking the checkpoint statuses.
            </p>

            <div className={styles.actions}>
              {load.status === 'dispatched' && (
                <button 
                  className="btn-primary" 
                  onClick={() => handleStatusChange('in-transit', 'Driver checked in at shipper and is loaded')}
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Navigation size={18} /> {loading ? 'Updating...' : 'Arrived at Shipper / Mark Loaded'}
                </button>
              )}

              {load.status === 'in-transit' && (
                <button 
                  className="btn-primary" 
                  onClick={() => navigate('/carrier/upload')}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <UploadCloud size={18} /> Deliver & Upload Documents
                </button>
              )}

              {load.status === 'delivered' && (
                <span className={styles.completeText}><CheckCircle size={18} /> Load Fully Completed & Uploaded</span>
              )}
            </div>
          </div>
        </div>

        {/* Contact Dispatcher Info */}
        <div className={styles.right}>
          <div className={styles.card}>
            <h3>Your Assigned Dispatcher</h3>
            <div className={styles.dispatcherInfo}>
              <div className={styles.avatar}>T</div>
              <div>
                <p className={styles.dispName}>Tom Richards</p>
                <p className={styles.dispTitle}>Senior Dry Van Dispatcher</p>
              </div>
            </div>
            <div className={styles.contactActions}>
              <a href="tel:+18005555555" className={styles.contactBtn}>
                <Phone size={16} /> Call Dispatcher
              </a>
              <button className={styles.contactBtn} onClick={() => alert("Message chat mockup placeholder.")}>
                <MessageSquare size={16} /> Live Chat
              </button>
            </div>
          </div>

          <div className={styles.card} style={{ marginTop: '24px' }}>
            <h3>Broker Rate Details</h3>
            <div className={styles.metaRow}>
              <span>Gross Payout:</span>
              <strong className={styles.rateText}>${load.rate.toLocaleString()}</strong>
            </div>
            <div className={styles.metaRow}>
              <span>Commodity:</span>
              <span>{load.commodity}</span>
            </div>
            <div className={styles.metaRow}>
              <span>Cargo Weight:</span>
              <span>{load.weight}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
