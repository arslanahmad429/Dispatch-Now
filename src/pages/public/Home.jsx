import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../../context/AuthContext';
import Hero from '../../components/Hero/Hero';
import Drawer from '../../components/shared/Drawer';
import ContactForm from '../../components/ContactForm/ContactForm';
import { ArrowRight, CheckCircle, ShieldCheck, DollarSign, Calculator, HelpCircle, Truck, Building, Users, BarChart3 } from 'lucide-react';
import styles from './Home.module.css';

export default function Home() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [simStep, setSimStep] = useState('shipper');

  // Calculator State
  const [revenue, setRevenue] = useState(7500);
  const [trucks, setTrucks] = useState(1);
  const getPercentage = () => (trucks >= 3 ? 6 : 8);
  const dispatchFee = Math.round(revenue * (getPercentage() / 100));
  const netEarnings = revenue - dispatchFee;

  const handleBypassLogin = (email) => {
    const res = login(email, 'demo123');
    if (res.success) {
      navigate(getDashboardPath(res.role));
    }
  };

  return (
    <div className={styles.home}>
      {/* 1. Cinematic Hero Background */}
      <Hero onCtaClick={() => setIsQuoteOpen(true)} onCalcClick={() => setIsCalcOpen(true)} />

      {/* 2. Platform Value Proposition */}
      <section className={styles.valueSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.badge}>Unified Logistics Ecosystem</span>
            <h2>Two Portals. One Seamless Flow.</h2>
            <p>We connect shippers directly with qualified carriers, backed by professional dispatch negotiators.</p>
          </div>

          <div className={styles.platformCards}>
            {/* Shippers Side */}
            <div className={styles.platformCard}>
              <div className={styles.cardMedia}>
                <img src="/media/warehouse_logistics.png" alt="Shipper Hub Logistics Operations" className={styles.cardImage} />
                <div className={styles.mediaOverlay} />
                <Building className={styles.cardIcon} size={28} />
              </div>
              <div className={styles.cardContent}>
                <h3>For Shippers & Manufacturers</h3>
                <p>Post freight lanes, track ETAs with live GPS placeholders, and audit factoring statements directly.</p>
                <ul className={styles.bulletList}>
                  <li><CheckCircle size={14} /> Real-time ETA timelines</li>
                  <li><CheckCircle size={14} /> Integrated credit vetting</li>
                  <li><CheckCircle size={14} /> Digital BOL document cabinet</li>
                </ul>
                <button onClick={() => setIsQuoteOpen(true)} className="btn-outline">
                  Inquire Cargo Booking <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Carriers Side */}
            <div className={styles.platformCard}>
              <div className={styles.cardMedia}>
                <img src="/media/highway_truck.png" alt="Fleet Carrier Owner Operator" className={styles.cardImage} />
                <div className={styles.mediaOverlay} />
                <Truck className={styles.cardIcon} size={28} />
              </div>
              <div className={styles.cardContent}>
                <h3>For Carriers & Fleet Owners</h3>
                <p>Access high-paying broker loads, log active trips, and submit delivery receipts for same-day payments.</p>
                <ul className={styles.bulletList}>
                  <li><CheckCircle size={14} /> High-paying loads board</li>
                  <li><CheckCircle size={14} /> Instant factoring payouts</li>
                  <li><CheckCircle size={14} /> Fuel card optimization metrics</li>
                </ul>
                <button onClick={() => setIsQuoteOpen(true)} className="btn-outline">
                  Apply as Fleet Carrier <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Platform Simulator (For Investors Pitch) */}
      <section className={styles.simulatorSection}>
        <div className="container">
          <div className={styles.simulatorHeader}>
            <span className={styles.badge}>Live Platform Simulation</span>
            <h2>Interactive Dispatcher Operations</h2>
            <p>Click the buttons below to see how our platform matches, tracks, and payouts logistics lanes.</p>
          </div>

          <div className={styles.simulatorContainer}>
            {/* Step Selection Toggles */}
            <div className={styles.simToggles}>
              <button className={simStep === 'shipper' ? styles.simActive : ''} onClick={() => setSimStep('shipper')}>
                <span>01</span> Shippers Booking
              </button>
              <button className={simStep === 'dispatcher' ? styles.simActive : ''} onClick={() => setSimStep('dispatcher')}>
                <span>02</span> Dispatch Match
              </button>
              <button className={simStep === 'carrier' ? styles.simActive : ''} onClick={() => setSimStep('carrier')}>
                <span>03</span> Driver Transit & GPS
              </button>
              <button className={simStep === 'payout' ? styles.simActive : ''} onClick={() => setSimStep('payout')}>
                <span>04</span> Factoring Disbursement
              </button>
            </div>

            {/* Simulation Media & Mockup Screen */}
            <div className={styles.simPanel}>
              <div className={styles.simMockup}>
                {simStep === 'shipper' && (
                  <div className={styles.mockInner}>
                    <img src="/media/shipper_mockup.png" alt="Shipper booking dashboard" className={styles.mockImg} />
                    <div className={styles.mockDetails}>
                      <h4>Shipper Posts Freight Load</h4>
                      <p>Shipper logs into the console, sets the pickup (Houston, TX) and delivery (Denver, CO), selects flatbed equipment, and posts the load at a rate of $3,800.</p>
                    </div>
                  </div>
                )}
                {simStep === 'dispatcher' && (
                  <div className={styles.mockInner}>
                    <div className={styles.mockVideoContainer}>
                      <video src="/media/dispatcher_matching.mp4" autoPlay loop muted playsInline className={styles.mockVid} />
                    </div>
                    <div className={styles.mockDetails}>
                      <h4>Dispatcher Matching Pipeline</h4>
                      <p>Our backend matches the load. A professional dispatcher reviews driver logs, negotiates rate increases with brokers, and dispatches the carrier Williams Trucking.</p>
                    </div>
                  </div>
                )}
                {simStep === 'carrier' && (
                  <div className={styles.mockInner}>
                    <div className={styles.mockVideoContainer}>
                      <video src="/media/carrier_transit.mp4" autoPlay loop muted playsInline className={styles.mockVid} />
                    </div>
                    <div className={styles.mockDetails}>
                      <h4>Driver Transit and GPS Timeline</h4>
                      <p>The carrier driver accepts the dispatch on their mobile phone, check-ins at shipper coordinates, and drives. Shippers view live GPS timeline checkpoints.</p>
                    </div>
                  </div>
                )}
                {simStep === 'payout' && (
                  <div className={styles.mockInner}>
                    <img src="/media/payout_mockup.png" alt="Payout verification dashboard" className={styles.mockImg} />
                    <div className={styles.mockDetails}>
                      <h4>Delivery Photo Upload & Factoring Cut</h4>
                      <p>Driver uploads drop-off photo and signed BOL. Our admin verifies documents, cuts factoring release, disbursing funds to carrier within hours.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sandbox Bypass Section */}
      <section className={styles.sandboxSection}>
        <div className="container">
          <div className={styles.sandboxHeader}>
            <span className={styles.sandboxBadge}>Instant Demo Access</span>
            <h2>Investor & Client Sandbox Portals</h2>
            <p>Click any portal below to bypass the login screen and explore the fully functional dashboards, map trackers, and invoice tools.</p>
          </div>

          <div className={styles.sandboxGrid}>
            {/* Shipper */}
            <div className={styles.sandboxCard}>
              <div className={styles.sandboxCardHeader}>
                <div className={`${styles.sandboxIconWrapper} ${styles.shipperIcon}`}>
                  <Building size={24} />
                </div>
                <h3>Shipper Portal</h3>
              </div>
              <p>Experience the manufacturer console: post cargo, track delivery timelines, audit logistics invoices, and download proof-of-delivery receipts.</p>
              <div className={styles.sandboxMeta}>
                <span>Demo User: <code>customer@dispatchnow.com</code></span>
              </div>
              <button onClick={() => handleBypassLogin('customer@dispatchnow.com')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Enter Shipper Sandbox <ArrowRight size={16} />
              </button>
            </div>

            {/* Carrier */}
            <div className={styles.sandboxCard}>
              <div className={styles.sandboxCardHeader}>
                <div className={`${styles.sandboxIconWrapper} ${styles.carrierIcon}`}>
                  <Truck size={24} />
                </div>
                <h3>Carrier Terminal</h3>
              </div>
              <p>Experience the driver and fleet owner dashboard: accept assigned loads, view maps, upload proof images, and request 2-hour factoring payouts.</p>
              <div className={styles.sandboxMeta}>
                <span>Demo User: <code>carrier@dispatchnow.com</code></span>
              </div>
              <button onClick={() => handleBypassLogin('carrier@dispatchnow.com')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Enter Carrier Sandbox <ArrowRight size={16} />
              </button>
            </div>

            {/* Dispatcher */}
            <div className={styles.sandboxCard}>
              <div className={styles.sandboxCardHeader}>
                <div className={`${styles.sandboxIconWrapper} ${styles.dispatcherIcon}`}>
                  <Users size={24} />
                </div>
                <h3>Dispatcher Deck</h3>
              </div>
              <p>Co-ordinate routes, check carrier status, negotiate carrier rate adjustments, log dispatcher cuts, and assign loads to available equipment.</p>
              <div className={styles.sandboxMeta}>
                <span>Demo User: <code>dispatcher@dispatchnow.com</code></span>
              </div>
              <button onClick={() => handleBypassLogin('dispatcher@dispatchnow.com')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Enter Dispatcher Sandbox <ArrowRight size={16} />
              </button>
            </div>

            {/* Admin */}
            <div className={styles.sandboxCard}>
              <div className={styles.sandboxCardHeader}>
                <div className={`${styles.sandboxIconWrapper} ${styles.adminIcon}`}>
                  <BarChart3 size={24} />
                </div>
                <h3>Admin Control</h3>
              </div>
              <p>Oversee the entire dispatch ecosystem: inspect uploaded PODs, approve same-day factoring payouts, manage clients, and run financial audits.</p>
              <div className={styles.sandboxMeta}>
                <span>Demo User: <code>admin@dispatchnow.com</code></span>
              </div>
              <button onClick={() => handleBypassLogin('admin@dispatchnow.com')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Enter Admin Sandbox <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Action Pitch CTA Bar */}
      <section className={styles.pitchCta}>
        <div className="container">
          <div className={styles.pitchInner}>
            <h2>Ready to Optimize Your Logistics Yield?</h2>
            <p>Outsource your backend office workload to our dedicated dispatch team. Transparent fees, complete legal vetting.</p>
            <div className={styles.ctaButtons}>
              <button onClick={() => setIsQuoteOpen(true)} className="btn-primary">
                Get Started Now <ArrowRight size={16} />
              </button>
              <button onClick={() => setIsCalcOpen(true)} className="btn-outline">
                <Calculator size={16} /> Calculate Savings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DRAWERS ===== */}
      
      {/* Drawer 1: Quote / Sign-up request */}
      <Drawer isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} title="Get a Professional Quote">
        <ContactForm />
      </Drawer>

      {/* Drawer 2: Savings Calculator */}
      <Drawer isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} title="Earning Savings Calculator">
        <div className={styles.calcDrawerBody}>
          <p className={styles.calcIntro}>Slide the slider to calculate how much gross revenue you plan to haul per week. See our low dispatcher fee cut details.</p>
          
          <div className={styles.inputGroup}>
            <label>Weekly Gross Hauls: <strong>${revenue.toLocaleString()}</strong></label>
            <input 
              type="range"
              min="3000"
              max="15000"
              step="500"
              value={revenue}
              onChange={e => setRevenue(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Fleet Size Option:</label>
            <div className={styles.btnGroup}>
              <button className={trucks === 1 ? styles.btnActive : ''} onClick={() => setTrucks(1)}>1 Truck (8% Fee)</button>
              <button className={trucks === 3 ? styles.btnActive : ''} onClick={() => setTrucks(3)}>3+ Trucks (6% Fee)</button>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.statRow}>
              <span>Platform Fee Cut:</span>
              <strong>${dispatchFee.toLocaleString()} ({getPercentage()}%)</strong>
            </div>
            <div className={styles.statRow}>
              <span>Your Net Take-Home:</span>
              <span className={styles.takeHome}>${netEarnings.toLocaleString()}</span>
            </div>
          </div>

          <button onClick={() => { setIsCalcOpen(false); setIsQuoteOpen(true); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}>
            Book Setup Consultation <ArrowRight size={16} />
          </button>
        </div>
      </Drawer>
    </div>
  );
}
