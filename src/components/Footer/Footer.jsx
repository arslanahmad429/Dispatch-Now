import { Link } from 'react-router-dom';
import { Truck, Phone, Mail, MapPin, Globe, Link2, MessageCircle, AtSign, ArrowRight } from 'lucide-react';
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
  { icon: <Globe size={18} />, href: '#', label: 'Website' },
  { icon: <MessageCircle size={18} />, href: '#', label: 'WhatsApp' },
  { icon: <AtSign size={18} />, href: '#', label: 'Email' },
  { icon: <Link2 size={18} />, href: '#', label: 'LinkedIn' },
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
            <Link
              to="/contact"
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
                Professional truck dispatching services for owner-operators and fleet owners
                across the United States. We find loads, negotiate rates, and handle all the
                paperwork — so you can focus on the road.
              </p>
              <div className={styles.socials}>
                {socials.map((s) => (
                  <a key={s.label} href={s.href} className={styles.socialBtn} aria-label={s.label}>
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
                  {/* PLACEHOLDER — Replace with real number */}
                  <a href="tel:+18005555555">+1 (800) 555-5555</a>
                </div>
                <div className={styles.contactItem}>
                  <Mail size={16} />
                  {/* PLACEHOLDER — Replace with real email */}
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
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Disclaimer</a>
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
