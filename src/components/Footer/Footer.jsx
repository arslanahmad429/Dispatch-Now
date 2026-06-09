import { Link } from 'react-router-dom';
import { Truck, Phone, Mail, MapPin, Globe, Link2, MessageCircle, AtSign, ArrowRight } from 'lucide-react';
import { CONTACT_INFO } from '../../config';
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
  { icon: <MessageCircle size={18} />, href: CONTACT_INFO.whatsappUrl, label: 'WhatsApp' },
  { icon: <AtSign size={18} />, href: `mailto:${CONTACT_INFO.email}`, label: 'Email' },
  { icon: <Link2 size={18} />, href: 'https://www.linkedin.com', label: 'LinkedIn' },
];

export default function Footer() {
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
            <Link to="/register/carrier" className="btn-primary">
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
              <div className={styles.logoLink}>
                <img src="/media/logo.png" alt="Dispatch Now" className={styles.logoImg} />
              </div>
              <p className={styles.brandDesc}>
                Professional truck dispatching services for owner-operators and fleets
                across the United States. We find loads, negotiate rates, and handle all the
                paperwork — so you can focus on the road.
              </p>
              <div className={styles.socials}>
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className={styles.socialBtn}
                    aria-label={s.label}
                    target={s.href.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                  >
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
                    <Link to={link.path}>{link.label}</Link>
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
                  <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer">{CONTACT_INFO.formattedPhone}</a>
                </div>
                <div className={styles.contactItem}>
                  <Mail size={16} />
                  <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
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
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-service">Terms of Service</Link>
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
    </footer>
  );
}
