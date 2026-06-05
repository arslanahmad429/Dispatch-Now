import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import styles from './Equipment.module.css';

const equipment = [
  {
    id: 'dry-van',
    label: 'Dry Van',
    emoji: '🚛',
    tagline: 'Most Popular. Most Loads.',
    description:
      'Dry vans are the most common trailer type in the US, making them the easiest to find high-paying freight for. Perfect for general commodities, retail goods, and consumer products.',
    benefits: [
      'Highest load volume on load boards',
      'Consistent lanes and repeat freight',
      'Average $2.80–$3.50 per mile',
      'Year-round demand, no seasonal dips',
      'Best for new owner-operators starting out',
    ],
    color: '#FFD700',
    laneExample: 'Chicago → Los Angeles | $3.20/mi | 2,016 miles',
  },
  {
    id: 'flatbed',
    label: 'Flatbed',
    emoji: '🚚',
    tagline: 'Higher Rates. Specialized Freight.',
    description:
      'Flatbed trucking commands premium rates because it requires specialized skills and equipment. We dispatch steel, lumber, heavy machinery, and construction materials.',
    benefits: [
      'Premium rates vs. dry van ($3.00–$4.20/mi)',
      'Less competition from other drivers',
      'Strong demand in construction sectors',
      'Oversize and over-dimensional loads available',
      'Strong broker relationships for project freight',
    ],
    color: '#FF8C00',
    laneExample: 'Houston → Denver | $3.80/mi | 1,029 miles',
  },
  {
    id: 'reefer',
    label: 'Reefer',
    emoji: '❄️',
    tagline: 'Temperature-Controlled Freight.',
    description:
      'Refrigerated (reefer) trailers carry temperature-sensitive cargo like food, pharmaceuticals, and chemicals. They command some of the highest rates per mile in the industry.',
    benefits: [
      'Top-tier rates ($3.20–$4.50/mi)',
      'Consistent food & pharma supply chains',
      'Multi-stop options for extra pay',
      'Amazon Fresh, Sysco, and more',
      'Strong demand year-round, especially produce',
    ],
    color: '#00BFFF',
    laneExample: 'Miami → New York | $4.10/mi | 1,281 miles',
  },
  {
    id: 'box-truck',
    label: 'Box Truck',
    emoji: '📦',
    tagline: 'Last Mile & Local. Fast Money.',
    description:
      'Box trucks (26ft) are great for local, regional, and last-mile delivery. Lower startup cost than semis with solid earning potential. Perfect for Amazon Relay and Uber Freight.',
    benefits: [
      'Lower cost to operate vs. semi',
      'Amazon Relay, Uber Freight, GoShip loads',
      'No CDL required for under 26k lbs',
      'Great for regional lanes',
      'Quick turnarounds and daily settlements',
    ],
    color: '#9B59B6',
    laneExample: 'Atlanta → Charlotte | $2.40/mi | 246 miles',
  },
  {
    id: 'hotshot',
    label: 'Hotshot',
    emoji: '⚡',
    tagline: 'Fast. Flexible. High Rates.',
    description:
      'Hotshot trucking uses pickup trucks and gooseneck trailers to deliver time-sensitive, expedited freight. Small loads but often extremely high rates per mile.',
    benefits: [
      'Rates can reach $4–$6+ per mile',
      'Expedited and same-day delivery loads',
      'Great for solo operators',
      'Oil field equipment, urgent parts, machinery',
      'Flexible — work when you want',
    ],
    color: '#E74C3C',
    laneExample: 'Dallas → Oklahoma City | $5.20/mi | 204 miles',
  },
];

export default function Equipment() {
  const [active, setActive] = useState('dry-van');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const activeEq = equipment.find((e) => e.id === active);

  return (
    <section className={`section ${styles.equipment}`} id="equipment">
      <div className="container">
        {/* Header */}
        <motion.div
          ref={ref}
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Equipment Types</span>
          <h2 className="section-title">
            We Dispatch <span className="highlight">All Equipment</span>
          </h2>
          <p className="section-subtitle">
            Whether you run a dry van or a hotshot, we have the lanes and the broker
            relationships to keep your truck moving profitably.
          </p>
        </motion.div>

        {/* Tab Buttons */}
        <motion.div
          className={styles.tabs}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {equipment.map((eq) => (
            <button
              key={eq.id}
              className={`${styles.tab} ${active === eq.id ? styles.tabActive : ''}`}
              onClick={() => setActive(eq.id)}
              style={active === eq.id ? { borderColor: eq.color, color: eq.color } : {}}
            >
              <span>{eq.emoji}</span>
              {eq.label}
            </button>
          ))}
        </motion.div>

        {/* Content Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className={styles.panel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            style={{ '--eq-color': activeEq.color }}
          >
            <div className={styles.panelLeft}>
              <div className={styles.panelEmoji}>{activeEq.emoji}</div>
              <div className={styles.panelTag}>{activeEq.tagline}</div>
              <h3 className={styles.panelTitle}>{activeEq.label} Dispatching</h3>
              <p className={styles.panelDesc}>{activeEq.description}</p>
              <div className={styles.laneExample}>
                <span className={styles.laneLabel}>Example Lane</span>
                <span className={styles.laneValue}>{activeEq.laneExample}</span>
              </div>
              <Link
                to="/contact"
                className="btn-primary"
                style={{ background: activeEq.color }}
              >
                Start with {activeEq.label}
              </Link>
            </div>

            <div className={styles.panelRight}>
              <h4 className={styles.benefitsTitle}>Why it works for you</h4>
              <ul className={styles.benefits}>
                {activeEq.benefits.map((b, i) => (
                  <motion.li
                    key={b}
                    className={styles.benefitItem}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <CheckCircle size={18} color={activeEq.color} />
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
