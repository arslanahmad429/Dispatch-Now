import { useState, useEffect } from 'react';
import { getMockDb } from '../../utils/mockDb';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie } from 'recharts';
import styles from './AdminReports.module.css';

const MONTHLY_DATA = [
  { month: 'Jan', revenue: 42000, fee: 3360 },
  { month: 'Feb', revenue: 58000, fee: 4640 },
  { month: 'Mar', revenue: 64000, fee: 5120 },
  { month: 'Apr', revenue: 78000, fee: 6240 },
  { month: 'May', revenue: 92000, fee: 7360 },
  { month: 'Jun', revenue: 105000, fee: 8400 }
];

const EQUIP_DATA = [
  { name: 'Flatbed', value: 45, color: '#FF8C00' },
  { name: 'Dry Van', value: 35, color: '#FFD700' },
  { name: 'Reefer', value: 15, color: '#00BFFF' },
  { name: 'Hotshot', value: 5, color: '#E74C3C' }
];

export default function AdminReports() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const db = getMockDb();
    setOrders(db.orders);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Performance Reports & Analytics</h2>
        <p>Analyze revenue growth charts, load equipment profiles, and broker volume distributions.</p>
      </div>

      <div className={styles.grid}>
        {/* Monthly Gross & Fees Bar Chart */}
        <div className={styles.card}>
          <h3>Monthly Volume Gross vs Dispatch Revenue</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="revenue" fill="var(--border-accent)" name="Gross Volume ($)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fee" fill="var(--accent)" name="Dispatch Fees ($)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Equipment Distribution Pie Chart */}
        <div className={styles.card}>
          <h3>Loads Dispatched by Equipment Type (%)</h3>
          <div className={styles.pieGrid}>
            <div className={styles.chartWrapper} style={{ flex: 1, minWidth: '200px' }}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={EQUIP_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {EQUIP_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid var(--border)', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className={styles.legend}>
              {EQUIP_DATA.map((entry) => (
                <div key={entry.name} className={styles.legendItem}>
                  <div className={styles.colorDot} style={{ background: entry.color }} />
                  <span>{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
