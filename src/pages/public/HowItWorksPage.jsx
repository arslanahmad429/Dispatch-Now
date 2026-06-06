import HowItWorks from '../../components/HowItWorks/HowItWorks';
import styles from './HowItWorksPage.module.css';

export default function HowItWorksPage() {
  return (
    <div className={styles.howItWorksPage}>
      <HowItWorks />

      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.column}>
              <h2>For Individual Owner-Operators</h2>
              <p>Keep your wheels rolling and earnings growing. You deal directly with the dedicated dispatcher assigned to your equipment. You define your preferred highway lanes, and we negotiate aggressively to secure the best rates per mile.</p>
            </div>
            <div className={styles.column}>
              <h2>Manual Compliance Audits</h2>
              <p>We verify each driver's credentials manually. By checking the CDL, plate registration, and authority status, we ensure full compliance with DOT regulations. Brokers trust our carriers, unlocking premium, off-market freight routes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
