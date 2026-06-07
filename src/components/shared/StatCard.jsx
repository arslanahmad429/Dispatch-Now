import styles from './StatCard.module.css';

export default function StatCard({ icon, label, value, change, changeType = 'up', color = '#0f5bbf' }) {
  return (
    <div className={styles.card} style={{ '--card-color': color }}>
      <div className={styles.top}>
        <div className={styles.icon} style={{ background: color + '20', color }}>{icon}</div>
        {change && (
          <span className={`${styles.change} ${changeType === 'up' ? styles.up : styles.down}`}>
            {changeType === 'up' ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
