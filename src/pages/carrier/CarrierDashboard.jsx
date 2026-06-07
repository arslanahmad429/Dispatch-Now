import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMockDb } from '../../utils/mockDb';
import StatCard from '../../components/shared/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Truck, DollarSign, Navigation, Calendar, MapPin, Clock } from 'lucide-react';
import styles from './CarrierDashboard.module.css';

export default function CarrierDashboard() {
  const { user } = useAuth();
  const [activeLoad, setActiveLoad] = useState(null);
  const [completedLoads, setCompletedLoads] = useState([]);
  const [pendingPayout, setPendingPayout] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!user) return;
    const db = getMockDb();
    
    // Find loads assigned to this logged in carrier email
    const myOrders = db.orders.filter(o => o.carrierEmail && user.email && o.carrierEmail.toLowerCase() === user.email.toLowerCase());
    
    // Active loads are those not marked 'delivered'
    const active = myOrders.find(o => o.status !== 'delivered');
    // Completed loads are those marked 'delivered'
    const completed = myOrders.filter(o => o.status === 'delivered');
    
    // Calculate pending payout (delivered but unpaid factoring)
    const pending = completed
      .filter(o => o.paymentStatus === 'unpaid')
      .reduce((sum, o) => sum + o.driverPayout, 0);

    setActiveLoad(active || null);
    setCompletedLoads(completed);
    setPendingPayout(pending);

    // Dynamic Chart Data Generation (Flattened by default, updates gradually)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().substring(0, 10);
      const dayName = daysOfWeek[d.getDay()];
      last7Days.push({
        dateStr,
        name: dayName,
        earnings: 0
      });
    }

    if (completed.length === 0) {
      setChartData(last7Days.map(day => ({ name: day.name, earnings: 0 })));
    } else {
      const groups = {};
      completed.forEach(order => {
        const d = order.date || 'N/A';
        groups[d] = (groups[d] || 0) + order.driverPayout;
      });
      const sortedDates = Object.keys(groups).sort();
      const mapped = sortedDates.map(dateStr => {
        const parts = dateStr.split('-');
        const label = parts.length === 3 ? `${parts[1]}/${parts[2]}` : dateStr;
        return {
          name: label,
          earnings: groups[dateStr]
        };
      });
      setChartData(mapped);
    }
  }, [user]);

  const totalNetEarnings = completedLoads.reduce((sum, o) => sum + o.driverPayout, 0);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2>Driver Portal Overview</h2>
        <p>Welcome back, <strong>{user?.name}</strong>. Monitor your manual dispatch sheets, check rates, and track settlement payouts.</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard 
          icon={<DollarSign size={20} />} 
          label="Total Net Income" 
          value={`$${totalNetEarnings.toLocaleString()}`} 
          color="#0f5bbf" 
        />
        <StatCard 
          icon={<Truck size={20} />} 
          label="Loads Completed" 
          value={completedLoads.length.toString()} 
          color="#10B981" 
        />
        <StatCard 
          icon={<Clock size={20} />} 
          label="Pending Payouts" 
          value={`$${pendingPayout.toLocaleString()}`} 
          color="#F59E0B" 
        />
        <StatCard 
          icon={<Navigation size={20} />} 
          label="Active Dispatches" 
          value={activeLoad ? "1 Active" : "0 Active"} 
          color="#3B82F6" 
        />
      </div>

      <div className={styles.grid}>
        {/* Earnings History Chart */}
        <div className={styles.chartCard}>
          <h3>Completed Freight Analytics</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Line type="monotone" dataKey="earnings" stroke="var(--accent)" strokeWidth={3} dot={{ fill: 'var(--accent)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Load Status */}
        <div className={styles.activeLoadCard}>
          <h3>Current Assignment Details</h3>
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
                  <span className={styles.metaLabel}>Equipment Req</span>
                  <span className={styles.metaVal}>{activeLoad.equipment}</span>
                </div>
                <div>
                  <span className={styles.metaLabel}>Gross Rate</span>
                  <span className={styles.metaVal}>${activeLoad.rate.toLocaleString()}</span>
                </div>
                <div>
                  <span className={styles.metaLabel}>My Payout (Net)</span>
                  <span className={styles.metaVal} style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
                    ${activeLoad.driverPayout.toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <Link to="/carrier/orders" className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                  My Orders
                </Link>
                <Link to="/carrier/upload" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Upload BOL
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.noLoad}>
              <Truck size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
              <p style={{ color: 'var(--text-secondary)' }}>You have no active load assigned right now.</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Admin will coordinate loads manually on load boards and list assignments here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
