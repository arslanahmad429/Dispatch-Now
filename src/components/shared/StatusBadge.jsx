import styles from './StatusBadge.module.css';

const variants = {
  pending:    { label: 'Pending',    color: '#F59E0B' },
  dispatched: { label: 'Dispatched', color: '#3B82F6' },
  'in-transit': { label: 'In Transit', color: '#8B5CF6' },
  delivered:  { label: 'Delivered',  color: '#10B981' },
  cancelled:  { label: 'Cancelled',  color: '#EF4444' },
  active:     { label: 'Active',     color: '#10B981' },
  inactive:   { label: 'Inactive',   color: '#6B7280' },
  approved:   { label: 'Approved',   color: '#10B981' },
  review:     { label: 'Under Review', color: '#F59E0B' },
  paid:       { label: 'Paid',       color: '#10B981' },
  unpaid:     { label: 'Unpaid',     color: '#EF4444' },
  processing: { label: 'Processing', color: '#3B82F6' },
};

export default function StatusBadge({ status }) {
  const v = variants[status] || { label: status, color: '#6B7280' };
  return (
    <span
      className={styles.badge}
      style={{ '--badge-color': v.color, '--badge-bg': v.color + '20' }}
    >
      <span className={styles.dot} />
      {v.label}
    </span>
  );
}
