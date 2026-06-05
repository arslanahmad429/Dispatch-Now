import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import styles from './PricingPage.module.css';

export default function PricingPage() {
  const [revenue, setRevenue] = useState(6000);
  const [trucks, setTrucks] = useState(1);

  const getPercentage = () => {
    if (trucks >= 3) return 6; // Fleet
    return 8; // Solo
  };

  const dispatchFee = Math.round(revenue * (getPercentage() / 100));
  const netEarnings = revenue - dispatchFee;

  return (
    <div className={styles.pricingPage}>
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <span className="section-label">Transparent Rates</span>
            <h2 className="section-title">No Load, <span className="highlight">No Dispatch Fee</span></h2>
            <p className="section-subtitle">We only get paid when you do. No sign-up fees, no contracts, cancel at any time.</p>
          </div>

          <div className={styles.pricingCards}>
            <div className={styles.pricingCard}>
              <div className={styles.cardHeader}>
                <h3>Solo Operator</h3>
                <div className={styles.price}>8%</div>
                <p>Gross per load</p>
              </div>
              <ul className={styles.features}>
                <li><Check size={16} /> Dedicated dispatcher</li>
                <li><Check size={16} /> Unlimited loads per week</li>
                <li><Check size={16} /> All rate confirmations & setup</li>
                <li><Check size={16} /> Credit checks on brokers</li>
                <li><Check size={16} /> Invoice & factoring setups</li>
              </ul>
              <a href="/register/carrier" className="btn-primary">Get Started <ArrowRight size={16} /></a>
            </div>

            <div className={`${styles.pricingCard} ${styles.featuredCard}`}>
              <div className={styles.featuredBadge}>Best Value</div>
              <div className={styles.cardHeader}>
                <h3>Fleet Plan (3+ Trucks)</h3>
                <div className={styles.price}>6%</div>
                <p>Gross per load</p>
              </div>
              <ul className={styles.features}>
                <li><Check size={16} /> Fleet dedicated dispatcher team</li>
                <li><Check size={16} /> Unified invoice management</li>
                <li><Check size={16} /> Priority lane planning</li>
                <li><Check size={16} /> Direct safety & compliance portal</li>
                <li><Check size={16} /> Weekly analytics reporting</li>
              </ul>
              <a href="/register/carrier" className="btn-primary" style={{ background: '#FFF', color: '#000' }}>Get Started <ArrowRight size={16} /></a>
            </div>

            <div className={styles.pricingCard}>
              <div className={styles.cardHeader}>
                <h3>Dedicated Dispatch</h3>
                <div className={styles.price}>$320</div>
                <p>Flat weekly fee per truck</p>
              </div>
              <ul className={styles.features}>
                <li><Check size={16} /> Fix cost budget control</li>
                <li><Check size={16} /> Dedicated lane scheduling</li>
                <li><Check size={16} /> 24/7 dispatcher availability</li>
                <li><Check size={16} /> Multi-stop and local drops</li>
                <li><Check size={16} /> Cancel at any time</li>
              </ul>
              <a href="/register/carrier" className="btn-primary">Get Started <ArrowRight size={16} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Calculator Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className={styles.calcWrapper}>
            <div className={styles.calcLeft}>
              <h2>Calculate Your Earnings</h2>
              <p>Drag the slider below to select your estimated weekly gross revenue. See how much Dispatch Now will save you.</p>

              <div className={styles.inputGroup}>
                <label>Weekly Gross Revenue: <strong>${revenue.toLocaleString()}</strong></label>
                <input 
                  type="range" 
                  min="2000" 
                  max="15000" 
                  step="500" 
                  value={revenue} 
                  onChange={(e) => setRevenue(Number(e.target.value))} 
                  className={styles.rangeInput}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Number of Trucks:</label>
                <div className={styles.btnGroup}>
                  <button className={trucks === 1 ? styles.btnActive : ''} onClick={() => setTrucks(1)}>1 Truck</button>
                  <button className={trucks === 3 ? styles.btnActive : ''} onClick={() => setTrucks(3)}>3+ Trucks (Fleet)</button>
                </div>
              </div>
            </div>

            <div className={styles.calcRight}>
              <div className={styles.calcStat}>
                <span>Dispatch Fee ({getPercentage()}%)</span>
                <h3>${dispatchFee.toLocaleString()}</h3>
              </div>
              <div className={styles.calcStat}>
                <span>Your Net Weekly Revenue</span>
                <h2 className="gradient-text">${netEarnings.toLocaleString()}</h2>
              </div>
              <div className={styles.calcFoot}>
                <p>Based on estimated broker rates. Actual revenue may vary by equipment type and lanes selected.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
