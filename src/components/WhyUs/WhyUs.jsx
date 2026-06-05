import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, X } from 'lucide-react';
import styles from './WhyUs.module.css';

const comparisons = [
  { feature: 'Finding loads on load boards', us: true, self: false },
  { feature: 'Negotiating best rate per mile', us: true, self: false },
  { feature: '24/7 dispatcher availability', us: true, self: false },
  { feature: 'Handling all broker paperwork', us: true, self: false },
  { feature: 'Established broker relationships', us: true, self: false },
  { feature: 'Route optimization to cut deadhead', us: true, self: false },
  { feature: 'Check calls & ETA communication', us: true, self: false },
  { feature: 'Invoicing & factoring support', us: true, self: false },
  { feature: 'Legal contract review', us: true, self: false },
  { feature: 'Focus on just driving', us: true, self: true },
];

const perks = [
  { label: 'No long-term contracts', sub: 'Month-to-month, cancel anytime' },
  { label: 'No upfront fees', sub: 'We only earn when you earn' },
  { label: 'Dedicated dispatcher', sub: 'Not a pool — your own person' },
  { label: 'Transparent pricing', sub: 'Flat 8% per load, no hidden fees' },
];

export default function WhyUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className={`section ${styles.whyUs}`} id="why-us">
      <div className="container">
        <div className={styles.grid}>
          {/* LEFT: Header + Perks */}
          <motion.div
            ref={ref}
            className={styles.left}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">Why Choose Us</span>
            <h2 className="section-title">
              Stop Leaving <span className="highlight">Money on the Table</span>
            </h2>
            <p className="section-subtitle">
              Managing your own dispatch means you're doing two full-time jobs at once.
              Our dispatchers do this exclusively — and they're better at it.
            </p>

            <div className={styles.perks}>
              {perks.map((perk, i) => (
                <motion.div
                  key={perk.label}
                  className={styles.perk}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className={styles.perkIcon}>✓</div>
                  <div>
                    <div className={styles.perkLabel}>{perk.label}</div>
                    <div className={styles.perkSub}>{perk.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Comparison Table */}
          <motion.div
            className={styles.right}
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className={styles.tableWrapper}>
              <div className={styles.tableHeader}>
                <div className={styles.tableFeatureCol}>Feature</div>
                <div className={`${styles.tableCol} ${styles.tableColUs}`}>Dispatch Now</div>
                <div className={styles.tableCol}>On Your Own</div>
              </div>
              <div className={styles.tableBody}>
                {comparisons.map((row, i) => (
                  <motion.div
                    key={row.feature}
                    className={styles.tableRow}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <div className={styles.tableFeature}>{row.feature}</div>
                    <div className={`${styles.tableCell} ${styles.tableCellUs}`}>
                      {row.us ? (
                        <span className={styles.checkYes}><Check size={16} /></span>
                      ) : (
                        <span className={styles.checkNo}><X size={16} /></span>
                      )}
                    </div>
                    <div className={styles.tableCell}>
                      {row.self ? (
                        <span className={styles.checkYes}><Check size={16} /></span>
                      ) : (
                        <span className={styles.checkNo}><X size={16} /></span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
