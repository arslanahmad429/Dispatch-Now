import styles from './AboutPage.module.css';
import { Target, Users, Award, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <span className="section-label">Our Story</span>
            <h2 className="section-title">We Keep the <span className="highlight">Nation Moving</span></h2>
            <p className="section-subtitle">Founded with a single mission: to empower owner-operators and fleets with premium, stress-free dispatching and logistics management.</p>
          </div>

          <div className={styles.missionWrapper}>
            <div className={styles.missionText}>
              <h2>Our Mission</h2>
              <p>At Dispatch Now, we believe that truck drivers are the backbone of the economy. We exist to simplify your backend operations, negotiate the highest possible load rates, and provide top-tier support so you can focus on the road. We operate with complete transparency, and we measure our success solely by your profitability.</p>
            </div>
            <div className={styles.missionStats}>
              <div className={styles.statBox}>
                <h3>5M+</h3>
                <span>Miles Dispatched</span>
              </div>
              <div className={styles.statBox}>
                <h3>$12M+</h3>
                <span>Driver Earnings Secured</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className={styles.valuesHeader}>
            <span className="section-label">Core Values</span>
            <h2 className="section-title">What We Stand For</h2>
          </div>

          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <Target size={32} className={styles.valueIcon} />
              <h3>Aggressive Negotiations</h3>
              <p>We do not settle for average. Our team works tirelessly to pull premium load rates, ensuring maximum pay for every single mile you drive.</p>
            </div>

            <div className={styles.valueCard}>
              <Users size={32} className={styles.valueIcon} />
              <h3>Partnership Focus</h3>
              <p>We treat your business as our own. You are never just a truck number to us — you have a dedicated dispatcher who knows your preferences.</p>
            </div>

            <div className={styles.valueCard}>
              <Award size={32} className={styles.valueIcon} />
              <h3>Absolute Transparency</h3>
              <p>No hidden percentages, no broker setups done behind your back, and no sign-up fees. What you see is exactly what you get.</p>
            </div>

            <div className={styles.valueCard}>
              <ShieldCheck size={32} className={styles.valueIcon} />
              <h3>Compliance First</h3>
              <p>We strictly audit brokers and loads to make sure you stay FMCSA compliant, keep your authority safe, and avoid credit risks.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
