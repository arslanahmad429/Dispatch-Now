import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, MessageSquare, ArrowRight, PhoneCall } from 'lucide-react';
import styles from './Login.module.css'; // Reusing wrapper styles

export default function ThankYou() {
  const handleWhatsAppChat = () => {
    // Open a mock/direct WhatsApp chat link
    window.open('https://wa.me/18005550199?text=Hello,%20I%20just%20registered%20as%20a%20driver%20on%20DispatchNow!%20Please%20verify%20my%20MC%20authority.', '_blank');
  };

  return (
    <div className={styles.loginWrapper} style={{ maxWidth: '500px', textAlign: 'center', padding: '40px 30px' }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        style={{ display: 'inline-block', marginBottom: '20px', color: 'var(--accent-gold)' }}
      >
        <CheckCircle size={64} strokeWidth={1.5} />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ marginBottom: '15px' }}
      >
        Registration Received!
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '30px' }}
      >
        Thank you for registering with Dispatch Now. Our compliance team has received your documents and is currently reviewing your MC/USDOT safety rating.
        <br /><br />
        <strong>We will contact you directly through WhatsApp</strong> to confirm your equipment profile, negotiate rates, and assign your first freight loads.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        <button 
          onClick={handleWhatsAppChat} 
          className="btn-primary" 
          style={{ 
            width: '100%', 
            justifyContent: 'center', 
            background: '#25d366', 
            borderColor: '#25d366',
            color: '#fff',
            fontSize: '1rem',
            padding: '12px'
          }}
        >
          <MessageSquare size={18} /> Chat with Dispatch on WhatsApp
        </button>

        <a 
          href="tel:+1-800-DISPATCH" 
          className="btn-outline" 
          style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
        >
          <PhoneCall size={16} /> Call Hotline: +1 (800) DISPATCH
        </a>

        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <Link to="/" className={styles.regLink} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            Go Back to Homepage <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
