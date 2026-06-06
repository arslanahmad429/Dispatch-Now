import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Truck, ArrowRight, User, Sun, Moon } from 'lucide-react';
import { useAuth, getDashboardPath } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Equipment', path: '/equipment' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Blog', path: '/blog' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className={`container ${styles.navbarInner}`}>
          {/* Logo */}
          <Link to="/" className={styles.navbarLogo} onClick={() => setMobileOpen(false)}>
            <div className={styles.logoIcon}>
              <Truck size={20} strokeWidth={2.5} />
            </div>
            DISPATCH<span className={styles.logoDot}>NOW</span>
          </Link>

          {/* Desktop Links */}
          <ul className={styles.navbarLinks}>
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.path}
                  className={location.pathname === link.path ? styles.active : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className={styles.navbarCta}>
            <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme" title="Toggle color mode">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <a href="tel:+1-800-DISPATCH" className={styles.navbarPhone}>
              <Phone size={15} />
              +1 (800) DISPATCH
            </a>
            
            {user ? (
              <Link to={getDashboardPath(user.role)} className="btn-outline" style={{ padding: '10px 20px', fontSize: '13px' }}>
                <User size={14} /> Portal
              </Link>
            ) : (
              <Link to="/login" className={styles.loginLink}>
                Log In
              </Link>
            )}

            <Link to="/register/carrier" className="btn-primary">
              Register as Driver <ArrowRight size={16} />
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.open : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <nav className={styles.mobileMenuLinks}>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              {user ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + navLinks.length * 0.05 }}
                >
                  <Link to={getDashboardPath(user.role)} onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + navLinks.length * 0.05 }}
                >
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    Log In
                  </Link>
                </motion.div>
              )}
            </nav>
            <div className={styles.mobileMenuFooter}>
              <Link
                to="/register/carrier"
                className="btn-primary"
                onClick={() => setMobileOpen(false)}
              >
                Register as Driver <ArrowRight size={16} />
              </Link>
              <a href="tel:+1-800-DISPATCH" className={styles.navbarPhone}>
                <Phone size={15} />
                +1 (800) DISPATCH
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Theme:</span>
                <button className={styles.themeToggle} onClick={() => { toggleTheme(); }} aria-label="Toggle theme">
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
