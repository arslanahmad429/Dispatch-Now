import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Info } from 'lucide-react';
import styles from './PricingPage.module.css';

export default function PricingPage() {
  const [revenue, setRevenue] = useState(7500);

  const dispatchFee = Math.round(revenue * 0.08);
  const netEarnings = revenue - dispatchFee;

  return (
    <div className={styles.pricingPage}>
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <span className="section-label">Transparent Rates</span>
            <h2 className="section-title">Flat Rate Dispatch. <span className="highlight">No Load, No Fee</span></h2>
            <p className="section-subtitle">We only earn when you haul. No sign-up deposits, no locked contracts, cancel our service at any time.</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            <div className={`${styles.pricingCard} ${styles.featuredCard}`} style={{ maxWidth: '450px', width: '100%' }}>
              <div className={styles.featuredBadge}>Flat Fee</div>
              <div className={styles.cardHeader}>
                <h3>Professional Dispatch</h3>
                <div className={styles.price}>8%</div>
                <p>Gross per load booked</p>
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                padding: '12px', 
                background: 'rgba(255, 215, 0, 0.05)', 
                border: '1px solid rgba(255, 215, 0, 0.1)', 
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.4',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                <Info size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                <span>
                  <strong>Individual Registry Policy:</strong> Each driver profile must register a single vehicle. Fleet accounts are not supported; separate truck plate profiles must be created for safety compliance integrity.
                </span>
              </div>

              <ul className={styles.features}>
                <li><Check size={16} color="var(--accent-gold)" /> Dedicated manual dispatcher negotiator</li>
                <li><Check size={16} color="var(--accent-gold)" /> Unlimited spot loads scoured per week</li>
                <li><Check size={16} color="var(--accent-gold)" /> 5-Document compliance filing checks</li>
                <li><Check size={16} color="var(--accent-gold)" /> Real-time broker credit score auditing</li>
                <li><Check size={16} color="var(--accent-gold)" /> Instant factoring paperwork setups</li>
                <li><Check size={16} color="var(--accent-gold)" /> 24/7 WhatsApp emergency dispatcher updates</li>
              </ul>
              
              <Link 
                to="/register/carrier" 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '20px', background: 'var(--accent-gold)', color: '#000' }}
              >
                Apply as Driver <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Calculator Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className={styles.calcWrapper}>
            <div className={styles.calcLeft}>
              <h2>Calculate Your Settlement Yield</h2>
              <p>Drag the slider below to select your estimated weekly gross freight billings and see your net payouts after the 8% fee.</p>

              <div className={styles.inputGroup} style={{ marginTop: '30px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                  <span>Weekly Gross Billings:</span>
                  <strong style={{ color: 'var(--accent-gold)', fontSize: '1.15rem' }}>${revenue.toLocaleString()}</strong>
                </label>
                <input 
                  type="range" 
                  min="3000" 
                  max="15000" 
                  step="500" 
                  value={revenue} 
                  onChange={(e) => setRevenue(Number(e.target.value))} 
                  className={styles.rangeInput}
                  style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', outline: 'none', marginTop: '10px' }}
                />
              </div>
            </div>

            <div className={styles.calcRight}>
              <div className={styles.calcStat}>
                <span>Dispatch Fee (8% Flat Cut)</span>
                <h3 style={{ color: '#ef4444' }}>-${dispatchFee.toLocaleString()}</h3>
              </div>
              <div className={styles.calcStat}>
                <span>Your Net Weekly Settlement</span>
                <h2 className="gradient-text" style={{ color: '#10B981', fontSize: '2.5rem', fontWeight: 'bold' }}>
                  ${netEarnings.toLocaleString()}
                </h2>
              </div>
              <div className={styles.calcFoot}>
                <p>Actual revenue yields fluctuate depending on carrier equipment profile (flatbed vs dry-van) and selected highway lanes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
