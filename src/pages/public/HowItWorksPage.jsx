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
              <h2>For Owner-Operators & Fleets</h2>
              <p>Keep your wheels rolling and earnings growing. You deal directly with the dedicated dispatcher assigned to your equipment. You define your lanes and we negotiate to secure the best rates per mile.</p>
            </div>
            <div className={styles.column}>
              <h2>For Shippers & Brokers</h2>
              <p>Ensure reliable capacity and timely updates. We verify our carriers' safety ratings, insurance coverage, and compliance records before assigning them to any load. You get real-time tracking updates.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
