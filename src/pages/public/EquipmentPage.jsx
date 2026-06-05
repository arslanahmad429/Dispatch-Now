import Equipment from '../../components/Equipment/Equipment';
import styles from './EquipmentPage.module.css';

export default function EquipmentPage() {
  return (
    <div className={styles.equipmentPage}>
      <Equipment />

      {/* Detail Specs */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className={styles.specsHeader}>
            <span className="section-label">Technical Reference</span>
            <h2 className="section-title">Equipment Dimensions & Limits</h2>
            <p className="section-subtitle">Ensure your truck fits within standard DOT and carrier limits. We handle bookings based on these specifications.</p>
          </div>

          <div className={styles.specsGrid}>
            <div className={styles.specCard}>
              <h3>Dry Van (53')</h3>
              <ul>
                <li><strong>Max Weight:</strong> 45,000 lbs</li>
                <li><strong>Internal Width:</strong> 101"</li>
                <li><strong>Internal Height:</strong> 110"</li>
                <li><strong>Pallet Capacity:</strong> 26 Standard</li>
              </ul>
            </div>

            <div className={styles.specCard}>
              <h3>Flatbed (48' - 53')</h3>
              <ul>
                <li><strong>Max Weight:</strong> 48,000 lbs</li>
                <li><strong>Max Width:</strong> 102"</li>
                <li><strong>Max Height (cargo):</strong> 8' 6"</li>
                <li><strong>Special Equip:</strong> Straps, Chains, Tarps</li>
              </ul>
            </div>

            <div className={styles.specCard}>
              <h3>Reefer (53')</h3>
              <ul>
                <li><strong>Max Weight:</strong> 44,000 lbs</li>
                <li><strong>Temp Range:</strong> -20°F to 80°F</li>
                <li><strong>Internal Width:</strong> 98"</li>
                <li><strong>Pallet Capacity:</strong> 26 Standard</li>
              </ul>
            </div>

            <div className={styles.specCard}>
              <h3>Box Truck (26')</h3>
              <ul>
                <li><strong>Max Weight:</strong> 10,000 lbs</li>
                <li><strong>Door Height:</strong> 96"</li>
                <li><strong>Liftgate:</strong> Required for most loads</li>
                <li><strong>Pallet Capacity:</strong> 12 Standard</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
