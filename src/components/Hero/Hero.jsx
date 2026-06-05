import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Volume2, VolumeX, Calculator } from 'lucide-react';
import styles from './Hero.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stats = [
  { number: '500+', label: 'Trucks Dispatched' },
  { number: '$2M+', label: 'Revenue Haul' },
  { number: '98%', label: 'Retention Rate' },
  { number: '24/7', label: 'Support Coverage' },
  { number: '48', label: 'States Serviced' },
];

const trustItems = [
  { icon: <CheckCircle size={15} />, text: 'No Long-Term Contracts' },
  { icon: <CheckCircle size={15} />, text: 'Flat 8% Solo Fee' },
  { icon: <CheckCircle size={15} />, text: 'Dedicated Dispatcher' },
  { icon: <CheckCircle size={15} />, text: '24/7 Broker Matching' },
];

export default function Hero({ onCtaClick, onCalcClick }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <section className={styles.hero}>
      {/* ===== CINEMATIC VIDEO BACKGROUND ===== */}
      <div className={styles.videoBg}>
        <motion.video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlayThrough={() => setVideoLoaded(true)}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={videoLoaded ? { scale: 1, opacity: 1 } : { scale: 1.08, opacity: 0 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        >
          <source src="/Video.mp4" type="video/mp4" />
        </motion.video>
      </div>

      {/* Layered overlays for cinematic depth */}
      <div className={styles.videoOverlay} />

      {/* ===== MAIN CONTENT ===== */}
      <div className={styles.heroContent}>
        <div className="container">
          <div className={styles.heroInner}>

            {/* Badge */}
            <motion.div
              className={styles.heroBadge}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <span className={styles.badgeDot} />
              Outsourced Dispatch Solutions — Enterprise Logistics
            </motion.div>

            {/* Title */}
            <motion.h1
              className={styles.heroTitle}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <span className={styles.block}>Drive More.</span>
              <span className={styles.block}>Earn More.</span>
              <span className={styles.accentLine}>We Manage the Yield.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className={styles.heroSubtitle}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              Scale your hauling operations with professional dispatchers who negotiate aggressively. Complete paperwork setup, credit verification, and factoring support.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className={styles.heroActions}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              <button
                id="hero-start-btn"
                className={styles.btnPrimary}
                onClick={onCtaClick}
              >
                Inquire Dispatch Now <ArrowRight size={20} />
              </button>
              <button
                className={styles.btnOutline}
                onClick={onCalcClick}
              >
                <Calculator size={16} /> Calculate Earnings Cut
              </button>
            </motion.div>

            {/* Trust Bar */}
            <motion.div
              className={styles.trustBar}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
            >
              {trustItems.map((item, i) => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: i < trustItems.length - 1 ? '28px' : 0 }}>
                  <div className={styles.trustItem}>
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                  {i < trustItems.length - 1 && <div className={styles.trustDivider} />}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM STATS BAR ===== */}
      <motion.div
        className={styles.statsBar}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="container">
          <div className={styles.statsBarInner}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ===== MUTE BUTTON ===== */}
      <motion.button
        className={styles.muteBtn}
        onClick={toggleMute}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 0.4 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </motion.button>

      {/* ===== SCROLL INDICATOR ===== */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <span className={styles.scrollText}>Scroll</span>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
      </motion.div>
    </section>
  );
}
