import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Info } from 'lucide-react';
import heroStyles from '../../styles/PageHero.module.css';
import styles from './PricingPage.module.css';

export default function PricingPage() {
  const [revenue, setRevenue] = useState(7500);

  const dispatchFee = Math.round(revenue * 0.08);
  const netEarnings = revenue - dispatchFee;

  return (
    <div className={styles.pricingPage}>

      {/* ── Hero Banner ── */}
      <div className={heroStyles.pageHero}>
        <div className={heroStyles.pageHeroBg}>
          <video src="/media/carrier_transit.mp4" autoPlay loop muted playsInline />
        </div>
        <div className={heroStyles.pageHeroOverlay} />
        <div className={heroStyles.pageHeroContent}>
          <span className={heroStyles.pageHeroLabel}>Transparent Pricing</span>
          <h1 className={heroStyles.pageHeroTitle}>
            Flat Rate Dispatch. <span>No Load, No Fee.</span>
          </h1>
          <p className={heroStyles.pageHeroSub}>
            We only earn when you haul. One flat 8% fee per load —
            no sign-up deposits, no locked contracts, cancel any time.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <span className="section-label">Transparent Rates</span>
            <h2 className="section-title">Flat Rate Dispatch. <span className="highlight">No Load, No Fee</span></h2>
            <p className="section-subtitle">We only earn when you haul. No sign-up deposits, no locked contracts, cancel our service at any time.</p>
          </div>

          <div className={styles.pricingSectionGrid}>
            
            {/* 8% Pricing Card */}
            <div className={`${styles.pricingCard} ${styles.featuredCard}`}>
              <div className={styles.featuredBadge}>Flat Fee</div>
              <div className={styles.cardHeader}>
                <h3>Professional Dispatch</h3>
                <div className={styles.price}>8%</div>
                <p>Gross per load booked</p>
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                padding: '16px', 
                background: 'var(--accent-dim)', 
                border: '1px solid var(--border-accent)', 
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.5',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                <Info size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Individual Registry Policy:</strong> Fleet accounts are not supported. There is no concept of bulk fleet registration. Every driver must register himself along with his specific truck or vehicle. If a carrier has multiple trucks, each vehicle must be registered under its own unique driver profile to maintain DOT plate uniqueness integrity.
                </div>
              </div>

              <ul className={styles.features}>
                <li><Check size={16} color="var(--accent)" /> Dedicated manual dispatcher negotiator</li>
                <li><Check size={16} color="var(--accent)" /> Unlimited spot loads scoured per week</li>
                <li><Check size={16} color="var(--accent)" /> 5-Document compliance filing checks</li>
                <li><Check size={16} color="var(--accent)" /> Real-time broker credit score auditing</li>
                <li><Check size={16} color="var(--accent)" /> Instant factoring paperwork setups</li>
                <li><Check size={16} color="var(--accent)" /> 24/7 WhatsApp emergency dispatcher updates</li>
              </ul>
              
              <Link 
                to="/register/carrier" 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '20px', background: 'var(--accent)', color: '#fff' }}
              >
                Apply as Driver <ArrowRight size={16} />
              </Link>
            </div>

            {/* Compliance Requirements Info */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '12px' }}>Compliance Onboarding Checks</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
                To safeguard the integrity of our dispatch network and ensure eligibility with top US freight brokers, every driver must upload the following <strong>5 compliance documents</strong> during registration. We enforce strict uniqueness checks on license plates.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px' }}>
                {[
                  { label: "Driver License", desc: "Valid CDL card" },
                  { label: "Truck Registration", desc: "Active plate paper" },
                  { label: "Truck Photo", desc: "Clear profile view" },
                  { label: "Driver Photo", desc: "Current headshot" },
                  { label: "National ID Card", desc: "Government issued" }
                ].map((doc, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--accent-dim)',
                      color: 'var(--accent)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px'
                    }}>{idx + 1}</span>
                    <h5 style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{doc.label}</h5>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{doc.desc}</p>
                  </div>
                ))}
              </div>
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
                  <strong style={{ color: 'var(--accent)', fontSize: '1.15rem' }}>${revenue.toLocaleString()}</strong>
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
