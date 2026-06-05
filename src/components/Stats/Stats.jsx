import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import styles from './Stats.module.css';

const stats = [
  { number: 500, suffix: '+', label: 'Trucks Dispatched', desc: 'Active carriers on our network' },
  { number: 2, prefix: '$', suffix: 'M+', label: 'Revenue Generated', desc: 'For our carrier partners' },
  { number: 98, suffix: '%', label: 'Satisfaction Rate', desc: 'From owner-operators we serve' },
  { number: 24, suffix: '/7', label: 'Dispatcher Support', desc: 'Always available for you' },
];

function CounterItem({ stat, index }) {
  const ref = useRef(null);
  const numRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView && numRef.current) {
      gsap.fromTo(
        numRef.current,
        { innerText: 0 },
        {
          innerText: stat.number,
          duration: 2,
          delay: index * 0.15,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate() {
            numRef.current.innerText =
              (stat.prefix || '') + Math.ceil(this.targets()[0].innerText) + (stat.suffix || '');
          },
        }
      );
    }
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      className={styles.statItem}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.statNumber} ref={numRef}>
        {stat.prefix || ''}{stat.number}{stat.suffix || ''}
      </div>
      <div className={styles.statLabel}>{stat.label}</div>
      <div className={styles.statDesc}>{stat.desc}</div>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section className={styles.stats}>
      <div className={styles.statsBg} />
      <div className="container">
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <CounterItem key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
