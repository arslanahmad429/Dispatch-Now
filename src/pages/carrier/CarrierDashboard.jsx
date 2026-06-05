import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMockDb } from '../../utils/mockDb';
import StatCard from '../../components/shared/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Truck, Navigation, DollarSign, Award, Calendar, MapPin } from 'lucide-react';
import styles from './CarrierDashboard.module.css';

const CHART_DATA = [
  { name: 'Mon', earnings: 1200 },
  { name: 'Tue', earnings: 2100 },
  { name: 'Wed', earnings: 1800 },
  { name: 'Thu', earnings: 2800 },
  { name: 'Fri', earnings: 3400 },
  { name: 'Sat', earnings: 1500 },
  { name: 'Sun', earnings: 800 }
];

export default function CarrierDashboard() {
  const [activeLoad, setActiveLoad] = useState(null);
  const [completedLoads, setCompletedLoads] = useState([]);

  useEffect(() => {
    const db = getMockDb();
    // Carrier's active load (status is dispatched or in-transit, carrier matched Marcus Williams)
    const active = db.orders.find(o => o.carrier === "Marcus Williams" && o.status !== "delivered");
    const completed = db.orders.filter(o => o.carrier === "Marcus Williams" && o.status === "delivered");
    setActiveLoad(active || null);
    setCompletedLoads(completed);
  }, []);

  const totalEarnings = completedLoads.reduce((sum, o) => sum + o.rate, 0);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2>Driver Overview</h2>
        <p>Track your earnings, active assignments, and search available loads.</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard icon={<DollarSign size={20} />} label="Total Week Earnings" value={`$${(totalEarnings + 13600).toLocaleString()}`} color="#FFD700" />
        <StatCard icon={<Truck size={20} />} label="Loads Completed" value={completedLoads.length + 8} color="#10B981" />
        <StatCard icon={<Navigation size={20} />} label="Miles Logged (Week)" value="3,420 mi" color="#3B82F6" />
        <StatCard icon={<Award size={20} />} label="Driver Safety Score" value="98%" color="#8B5CF6" />
      </div>

      <div className={styles.grid}>
        {/* Weekly Earnings Chart */}
        <div className={styles.chartCard}>
          <h3>Earnings History (Weekly)</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: '#111', border: '1px solid var(--border)', borderRadius: '8px' }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Line type="monotone" dataKey="earnings" stroke="var(--accent)" strokeWidth={3} dot={{ fill: 'var(--accent)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Load Status */}
        <div className={styles.activeLoadCard}>
          <h3>Current Assignment</h3>
          {activeLoad ? (
            <div className={styles.loadDetails}>
              <div className={styles.routeHeader}>
                <div className={styles.point}>
                  <MapPin size={16} color="var(--accent)" />
                  <div>
                    <p className={styles.pointLabel}>Pickup</p>
                    <p className={styles.pointVal}>{activeLoad.pickup}</p>
                  </div>
                </div>
                <div className={styles.point}>
                  <MapPin size={16} color="#3B82F6" />
                  <div>
                    <p className={styles.pointLabel}>Delivery</p>
                    <p className={styles.pointVal}>{activeLoad.delivery}</p>
                  </div>
                </div>
              </div>

              <div className={styles.metaGrid}>
                <div>
                  <span className={styles.metaLabel}>Commodity</span>
                  <span className={styles.metaVal}>{activeLoad.commodity}</span>
                </div>
                <div>
                  <span className={styles.metaLabel}>Rate Pay</span>
                  <span className={styles.metaVal} style={{ color: 'var(--accent)' }}>${activeLoad.rate.toLocaleString()}</span>
                </div>
              </div>

              <Link to="/carrier/active" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Manage Load Activity
              </Link>
            </div>
          ) : (
            <div className={styles.noLoad}>
              <Truck size={36} color="var(--text-muted)" />
              <p>You have no active load assigned right now.</p>
              <Link to="/carrier/loads" className="btn-primary" style={{ marginTop: '12px' }}>Search Load Board</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
