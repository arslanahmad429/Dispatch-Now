import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Phone, Mail, MapPin, Globe, Link2, MessageCircle, AtSign, ArrowRight } from 'lucide-react';
import Drawer from '../shared/Drawer';
import styles from './Footer.module.css';

const quickLinks = [
  { label: 'Services', path: '/services' },
  { label: 'Equipment Types', path: '/equipment' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
];

const services = [
  'Load Finding',
  'Rate Negotiation',
  'Paperwork & Admin',
  'Route Planning',
  'Broker Communication',
  '24/7 Dispatcher Support',
];

const socials = [
  { icon: <Globe size={18} />, href: '/', label: 'Website' },
  { icon: <MessageCircle size={18} />, href: 'https://wa.me/18005550199', label: 'WhatsApp' },
  { icon: <AtSign size={18} />, href: 'mailto:dispatch@dispatchnow.com', label: 'Email' },
  { icon: <Link2 size={18} />, href: 'https://www.linkedin.com', label: 'LinkedIn' },
];

export default function Footer() {
  const [activePolicy, setActivePolicy] = useState(null); // 'privacy' | 'terms' | 'disclaimer' | null

  const handlePolicyClick = (e, policyType) => {
    e.preventDefault();
    setActivePolicy(policyType);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className="container">
          {/* CTA Banner */}
          <div className={styles.ctaBanner}>
            <div className={styles.ctaText}>
              <h3>Ready to Maximize Your Truck's Earnings?</h3>
              <p>Join hundreds of owner-operators who trust Dispatch Now to keep their trucks loaded.</p>
            </div>
            <Link
              to="/register/carrier"
              className="btn-primary"
            >
              Start Dispatching <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.footerMain}>
        <div className="container">
          <div className={styles.footerGrid}>
            {/* Brand Column */}
            <div className={styles.brandCol}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}>
                  <Truck size={20} strokeWidth={2.5} />
                </div>
                DISPATCH<span>NOW</span>
              </div>
              <p className={styles.brandDesc}>
                Professional truck dispatching services for owner-operators and fleets
                across the United States. We find loads, negotiate rates, and handle all the
                paperwork — so you can focus on the road.
              </p>
              <div className={styles.socials}>
                {socials.map((s) => (
                  <a key={s.label} href={s.href} className={styles.socialBtn} aria-label={s.label} target={s.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Quick Links</h4>
              <ul className={styles.colLinks}>
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Our Services</h4>
              <ul className={styles.colLinks}>
                {services.map((s) => (
                  <li key={s}>
                    <Link to="/services">{s}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Contact Us</h4>
              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <Phone size={16} />
                  <a href="tel:+18005555555">+1 (800) 555-5555</a>
                </div>
                <div className={styles.contactItem}>
                  <Mail size={16} />
                  <a href="mailto:dispatch@dispatchnow.com">dispatch@dispatchnow.com</a>
                </div>
                <div className={styles.contactItem}>
                  <MapPin size={16} />
                  <span>United States — All 48 States</span>
                </div>
              </div>
              <div className={styles.available}>
                <span className={styles.availableDot} />
                Dispatchers available 24/7
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p>© {new Date().getFullYear()} Dispatch Now. All rights reserved.</p>
            <div className={styles.bottomLinks}>
              <a href="#" onClick={(e) => handlePolicyClick(e, 'privacy')}>Privacy Policy</a>
              <a href="#" onClick={(e) => handlePolicyClick(e, 'terms')}>Terms of Service</a>
              <a href="#" onClick={(e) => handlePolicyClick(e, 'disclaimer')}>Disclaimer</a>
            </div>
          </div>
          <p className={styles.legal}>
            <strong>Disclaimer:</strong> Dispatch Now is an independent dispatch service and is NOT a licensed freight broker.
            We act as the authorized agent of the carrier (you) under your MC authority.
            We do not take possession of freight, arrange transportation as a principal, or collect freight charges on your behalf.
            All freight brokerage activities are conducted by licensed freight brokers.
          </p>
        </div>
      </div>

      {/* ===== DRAWERS FOR POLICIES ===== */}
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

      <Drawer isOpen={activePolicy === 'disclaimer'} onClose={() => setActivePolicy(null)} title="Legal Disclaimer">
        <div style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>1. Broker/Carrier Relationship</h4>
          <p>Dispatch Now acts as an independent carrier dispatch coordinator. We are authorized agent representatives of the registered carrier under their specific FMCSA Motor Carrier authority. We are <strong>NOT a licensed freight broker or freight forwarder</strong>.</p>

          <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>2. Freight Liabilities</h4>
          <p>We do not take physical possession of cargo, negotiate insurance claims directly, or assume principal carrier liability. All transport contracts, cargo safety risks, and freight liabilities exist exclusively between the broker and the carrier.</p>
        </div>
      </Drawer>
    </footer>
  );
}
