import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, CheckCircle, Phone, Mail, MapPin, Truck } from 'lucide-react';
import Drawer from '../shared/Drawer';
import styles from './ContactForm.module.css';

const equipmentOptions = [
  'Dry Van (53ft)',
  'Flatbed',
  'Reefer / Refrigerated',
  'Box Truck (26ft)',
  'Hotshot',
  'Step Deck',
  'RGN / Lowboy',
  'Power Only',
  'Other',
];

export default function ContactForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activePolicy, setActivePolicy] = useState(null); // 'privacy' | 'terms' | null

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    equipment: '',
    mcNumber: '',
    trucks: '',
    message: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid phone number required';
    if (!form.equipment) e.equipment = 'Please select your equipment type';
    if (!form.agreeToTerms) e.agreeToTerms = 'Please agree to our terms';
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    // Placeholder: Replace with actual API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section className={`section ${styles.contact}`} id="contact">
      <div className={styles.contactBg} />
      <div className="container">
        <div className={styles.grid}>
          {/* LEFT — Info */}
          <motion.div
            ref={ref}
            className={styles.left}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">Get Started</span>
            <h2 className="section-title">
              Let's Get Your <span className="highlight">Truck Moving</span>
            </h2>
            <p className="section-subtitle">
              Fill out the form and a dedicated dispatcher will reach out to you
              within 24 hours to get you set up.
            </p>

            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}><Phone size={20} /></div>
                <div>
                  <div className={styles.contactLabel}>Phone</div>
                  {/* PLACEHOLDER — Replace with real number */}
                  <a href="tel:+18005555555" className={styles.contactValue}>+1 (800) 555-5555</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}><Mail size={20} /></div>
                <div>
                  <div className={styles.contactLabel}>Email</div>
                  {/* PLACEHOLDER — Replace with real email */}
                  <a href="mailto:dispatch@dispatchnow.com" className={styles.contactValue}>
                    dispatch@dispatchnow.com
                  </a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}><MapPin size={20} /></div>
                <div>
                  <div className={styles.contactLabel}>Coverage</div>
                  <div className={styles.contactValue}>All 48 Contiguous States</div>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}><Truck size={20} /></div>
                <div>
                  <div className={styles.contactLabel}>Hours</div>
                  <div className={styles.contactValue}>24/7 — We Never Sleep</div>
                </div>
              </div>
            </div>

            <div className={styles.disclaimer}>
              <p>
                <strong>Note:</strong> Dispatch Now is an independent dispatch service, not a freight broker.
                We act as your authorized agent under your MC authority. All freight contracts are between
                you (the carrier) and the freight broker.
              </p>
            </div>
          </motion.div>

          {/* RIGHT — Form */}
          <motion.div
            className={styles.right}
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className={styles.formCard}>
              {submitted ? (
                <motion.div
                  className={styles.success}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={styles.successIcon}>
                    <CheckCircle size={48} color="#22c55e" />
                  </div>
                  <h3>You're All Set! 🚛</h3>
                  <p>
                    Thank you, <strong>{form.name}</strong>! A dispatcher will contact you
                    at <strong>{form.phone}</strong> within 24 hours to get your first load lined up.
                  </p>
                  <button className="btn-primary" onClick={() => setSubmitted(false)}>
                    Submit Another Request
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                  <div className={styles.formTitle}>
                    <span>Start Your Application</span>
                    <span className={styles.freeTag}>Free to Join</span>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="name">Full Name *</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Smith"
                        value={form.name}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                      />
                      {errors.name && <span className={styles.error}>{errors.name}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="email">Email Address *</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      />
                      {errors.email && <span className={styles.error}>{errors.email}</span>}
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="phone">Phone Number *</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                      />
                      {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="mcNumber">MC Number</label>
                      <input
                        id="mcNumber"
                        name="mcNumber"
                        type="text"
                        placeholder="MC-XXXXXXX"
                        value={form.mcNumber}
                        onChange={handleChange}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.field} style={{ flex: '1 1 100%' }}>
                      <label className={styles.label} htmlFor="equipment">Equipment Type *</label>
                      <select
                        id="equipment"
                        name="equipment"
                        value={form.equipment}
                        onChange={handleChange}
                        className={`${styles.select} ${errors.equipment ? styles.inputError : ''}`}
                      >
                        <option value="">Select equipment...</option>
                        {equipmentOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {errors.equipment && <span className={styles.error}>{errors.equipment}</span>}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="message">Preferred Lanes / Additional Info</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      placeholder="Tell us your preferred states, lanes, or any special requirements..."
                      value={form.message}
                      onChange={handleChange}
                      className={styles.textarea}
                    />
                  </div>

                  <div className={styles.checkboxField}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={form.agreeToTerms}
                        onChange={handleChange}
                        className={styles.checkbox}
                      />
                      <span>
                        I agree to the{' '}
                        <a 
                          href="#" 
                          className={styles.link} 
                          onClick={(e) => { e.preventDefault(); setActivePolicy('terms'); }}
                        >
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a 
                          href="#" 
                          className={styles.link} 
                          onClick={(e) => { e.preventDefault(); setActivePolicy('privacy'); }}
                        >
                          Privacy Policy
                        </a>. I understand Dispatch Now
                        is a dispatching service, not a freight broker.
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <span className={styles.error}>{errors.agreeToTerms}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={`btn-primary ${styles.submitBtn}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className={styles.spinner} />
                    ) : (
                      <>
                        <Send size={18} />
                        Get My First Load
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== DRAWER OVERLAYS FOR LEGAL POLICIES ===== */}
      <Drawer isOpen={activePolicy === 'privacy'} onClose={() => setActivePolicy(null)} title="Privacy Policy">
        <div style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>1. Information We Collect</h4>
          <p>We collect essential commercial credentials during your onboarding process, including your name, email address, phone number, active Driver License (CDL), vehicle plate registration papers, physical truck photographs, headshot photographs, national ID cards, and Motor Carrier (MC) authority credentials.</p>
          
          <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>2. Data Storage Integrity</h4>
          <p>All compliance documents, profile information, and load dispatch sheets are stored locally inside your browser's sandbox namespace (<code>localStorage</code>) to maintain system integrity offline. No personal data is sent to external advertising or tracking platforms.</p>
          
          <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>3. How We Use Credentials</h4>
          <p>We use driver details and compliance papers to coordinate manual dispatches with US shippers and freight brokers. Registered truck license plates and MC numbers are cross-audited in our database to ensure that duplicate registrations are blocked.</p>
        </div>
      </Drawer>

      <Drawer isOpen={activePolicy === 'terms'} onClose={() => setActivePolicy(null)} title="Terms of Service">
        <div style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>1. Carrier Registry Requirements</h4>
          <p>We operate on an individual driver-to-truck registration model. Fleet registrations or bulk account creations are not supported. Every driver must register himself with his specific truck plate number. Unique plates and MC codes are strictly checked upon sign-up.</p>

          <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>2. Service Fees & Payout Cut</h4>
          <p>We charge a flat <strong>8% dispatch service fee</strong> of the gross rate of the load. We do not deduct additional hidden fees. Invoices are generated automatically in the financial ledger, displaying your gross billing and net payouts clearly.</p>

          <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>3. Manual Billing Settlements</h4>
          <p>Carriers are required to upload proof of delivery (signed Bill of Lading and a parcel drop-off photo) in the driver portal to initiate factoring release. Logistics administrators review these uploads and release payments manually outside this offline demo client.</p>
        </div>
      </Drawer>
    </section>
  );
}
