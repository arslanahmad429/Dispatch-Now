import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMockDb } from '../../utils/mockDb';
import { ArrowLeft, Truck, Calendar, MapPin, User, FileText, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../../components/shared/StatusBadge';
import styles from './TrackOrder.jsx.module.css';

export default function TrackOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const db = getMockDb();
    const found = db.orders.find(o => o.id === id);
    setOrder(found || null);
  }, [id]);

  if (!order) {
    return (
      <div className={styles.notFound}>
        <h3>Order Not Found</h3>
        <p>The shipment ID you requested could not be resolved in the database.</p>
        <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Order Booked' },
    { key: 'assigned', label: 'Dispatcher Assigned' },
    { key: 'dispatched', label: 'Carrier Assigned' },
    { key: 'in-transit', label: 'In Transit' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status);

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <ArrowLeft size={16} /> Back to Shipments
      </button>

      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h2>Tracking: {order.id}</h2>
            <StatusBadge status={order.status} />
          </div>
          <p className={styles.routeHeader}>{order.pickup} <span style={{ color: 'var(--accent)' }}>→</span> {order.delivery}</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left Side: Map & Timeline */}
        <div className={styles.left}>
          {/* Mock Interactive Map */}
          <div className={styles.mapCard}>
            <div className={styles.mapGridLines} />
            <div className={styles.routeLine} />
            <div className={`${styles.marker} ${styles.pickupMarker}`}>
              <div className={styles.markerGlow} />
              <span>A</span>
              <p>{order.pickup.split(',')[0]}</p>
            </div>
            <div className={`${styles.marker} ${styles.deliveryMarker}`}>
              <div className={styles.markerGlow} />
              <span>B</span>
              <p>{order.delivery.split(',')[0]}</p>
            </div>
            {order.status !== 'delivered' && order.status !== 'pending' && (
              <div className={styles.truckMarker}>
                <Truck size={16} />
                <div className={styles.truckGlow} />
              </div>
            )}
            <div className={styles.mapOverlayText}>
              <p>GPS TRACKING ACTIVE</p>
              <span>{order.status === 'in-transit' ? 'Speed: 64 MPH | Heading East' : 'Location State: Dormant'}</span>
            </div>
          </div>

          {/* Timeline Section */}
          <div className={styles.timelineCard}>
            <h3>Shipment Progress Log</h3>
            <div className={styles.timeline}>
              {order.history.map((hist, index) => (
                <div key={index} className={styles.timelineItem}>
                  <div className={styles.timelineDot}>
                    <CheckCircle2 size={16} color="var(--accent)" />
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <span className={styles.timelineStatus}>{hist.status.toUpperCase()}</span>
                      <span className={styles.timelineTime}>{hist.time}</span>
                    </div>
                    <p className={styles.timelineNote}>{hist.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Order Info Card */}
        <div className={styles.right}>
          <div className={styles.infoCard}>
            <h3>Shipment Details</h3>
            <div className={styles.infoRow}>
              <Calendar size={18} />
              <div>
                <p className={styles.label}>Ship Date</p>
                <p className={styles.val}>{order.date}</p>
              </div>
            </div>
            <div className={styles.infoRow}>
              <FileText size={18} />
              <div>
                <p className={styles.label}>Cargo / Commodity</p>
                <p className={styles.val}>{order.commodity} ({order.weight})</p>
              </div>
            </div>
            <div className={styles.infoRow}>
              <Truck size={18} />
              <div>
                <p className={styles.label}>Equipment Type</p>
                <p className={styles.val}>{order.equipment}</p>
              </div>
            </div>
            <div className={styles.infoRow}>
              <User size={18} />
              <div>
                <p className={styles.label}>Carrier / Driver</p>
                <p className={styles.val}>{order.carrier || "Awaiting Dispatcher Assignment"}</p>
              </div>
            </div>
          </div>

          {order.bolUrl && (
            <div className={styles.docsCard}>
              <h3>Attached Documents</h3>
              <div className={styles.docItem}>
                <FileText size={16} />
                <div>
                  <p className={styles.docLabel}>Bill of Lading (BOL)</p>
                  <a href="#" className={styles.docLink} onClick={e => e.preventDefault()}>View uploaded BOL</a>
                </div>
              </div>
              {order.deliveryPhotoUrl && (
                <div className={styles.docItem}>
                  <FileText size={16} />
                  <div>
                    <p className={styles.docLabel}>Delivery Confirmation Image</p>
                    <a href="#" className={styles.docLink} onClick={e => e.preventDefault()}>View delivery photo</a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
