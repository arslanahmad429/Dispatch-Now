import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../../context/AuthContext';
import Hero from '../../components/Hero/Hero';
import Drawer from '../../components/shared/Drawer';
import ContactForm from '../../components/ContactForm/ContactForm';
import { ArrowRight, CheckCircle, ShieldCheck, DollarSign, Calculator, HelpCircle, Truck, Users } from 'lucide-react';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  // Calculator State
  const [revenue, setRevenue] = useState(7500);
  const dispatchFee = Math.round(revenue * 0.08);
  const netEarnings = revenue - dispatchFee;

  return (
    <div className={styles.home}>
      {/* 1. Cinematic Hero Background */}
      <Hero onCtaClick={() => setIsQuoteOpen(true)} onCalcClick={() => setIsCalcOpen(true)} />

      {/* 2. Platform Value Proposition */}
      <section className={styles.valueSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.badge}>Premium Dispatch Service</span>
            <h2>Outsource Your Back-Office. Drive with Peace of Mind.</h2>
            <p>We handle broker negotiations, compliance checks, and billing documentation manually, letting you focus on driving.</p>
          </div>

          <div className={styles.platformCards} style={{ display: 'grid', gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
            {/* Carriers Side */}
            <div className={styles.platformCard}>
              <div className={styles.cardMedia} style={{ height: '260px' }}>
                <img src="/media/highway_truck.png" alt="Fleet Carrier Owner Operator" className={styles.cardImage} />
                <div className={styles.mediaOverlay} />
                <Truck className={styles.cardIcon} size={28} />
              </div>
              <div className={styles.cardContent}>
                <h3>For Owner-Operators & Drivers</h3>
                <p>Register your truck and authority documents today. Our dispatch compliance team will coordinate loads manually on premium US freight routes, negotiate rates directly on your behalf, and send bank settlement receipts within hours of BOL upload.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px', marginBottom: '25px' }}>
                  <ul className={styles.bulletList} style={{ margin: 0 }}>
                    <li><CheckCircle size={14} color="var(--accent-gold)" /> Flat 8% dispatch fee</li>
                    <li><CheckCircle size={14} color="var(--accent-gold)" /> 24/7 WhatsApp updates</li>
                    <li><CheckCircle size={14} color="var(--accent-gold)" /> Unique plate checking</li>
                  </ul>
                  <ul className={styles.bulletList} style={{ margin: 0 }}>
                    <li><CheckCircle size={14} color="var(--accent-gold)" /> Rapid factoring release</li>
                    <li><CheckCircle size={14} color="var(--accent-gold)" /> Manual rate negotiations</li>
                    <li><CheckCircle size={14} color="var(--accent-gold)" /> Direct broker paperwork</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <button onClick={() => navigate('/register/carrier')} className="btn-primary">
                    Apply as Driver <ArrowRight size={16} />
                  </button>
                  <button onClick={() => setIsQuoteOpen(true)} className="btn-outline">
                    Ask a Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pricing CTA Bar */}
      <section className={styles.pitchCta}>
        <div className="container">
          <div className={styles.pitchInner}>
            <h2>Ready to Maximize Your Truck's Yield?</h2>
            <p>Outsource your load search and rate negotiations. Transparent 8% fee, direct payouts, zero hidden charges.</p>
            <div className={styles.ctaButtons}>
              <button onClick={() => navigate('/register/carrier')} className="btn-primary">
                Register Now <ArrowRight size={16} />
              </button>
              <button onClick={() => setIsCalcOpen(true)} className="btn-outline">
                <Calculator size={16} /> Calculate Net Earnings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DRAWERS ===== */}
      
      {/* Drawer 1: Quote / Sign-up request */}
      <Drawer isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} title="Contact Dispatch Now">
        <ContactForm />
      </Drawer>

      {/* Drawer 2: Savings Calculator */}
      <Drawer isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} title="Driver Earning Calculator">
        <div className={styles.calcDrawerBody}>
          <p className={styles.calcIntro}>Slide the bar to estimate your weekly gross freight billings and calculate your net earnings after our flat 8% dispatch fee.</p>
          
          <div className={styles.inputGroup} style={{ marginBottom: '30px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: '600', marginBottom: '10px' }}>
              <span>Weekly Gross Billings:</span>
              <strong style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}>${revenue.toLocaleString()}</strong>
            </label>
            <input 
              type="range"
              min="3000"
              max="15000"
              step="500"
              value={revenue}
              onChange={e => setRevenue(Number(e.target.value))}
              className={styles.slider}
              style={{
                width: '100%',
                height: '6px',
                background: 'var(--border)',
                borderRadius: '3px',
                outline: 'none',
              }}
            />
          </div>

          <div className={styles.results} style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <div className={styles.statRow} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dispatch Fee Cut (8%):</span>
              <strong style={{ color: '#ef4444' }}>-${dispatchFee.toLocaleString()}</strong>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }} />
            <div className={styles.statRow} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 'bold' }}>
              <span>Your Net Payout:</span>
              <span style={{ color: '#10B981', fontSize: '1.25rem' }}>${netEarnings.toLocaleString()}</span>
            </div>
          </div>

          <button onClick={() => { setIsCalcOpen(false); navigate('/register/carrier'); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '25px' }}>
            Apply and Start Hauling <ArrowRight size={16} />
          </button>
        </div>
      </Drawer>
    </div>
  );
}
