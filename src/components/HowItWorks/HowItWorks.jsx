import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { UserPlus, Truck, DollarSign } from 'lucide-react';
import styles from './HowItWorks.module.css';

const steps = [
  {
    number: '01',
    icon: <UserPlus size={32} />,
    title: 'Register as Driver & Send Documents',
    description:
      'Fill out our quick online form with your MC number, equipment type, and preferred lanes. Upload your Motor Carrier authority, W-9, insurance certificate, and sign our dispatcher agreement. Setup takes less than 24 hours.',
    details: ['MC Authority & DOT Number', 'Certificate of Insurance', 'W-9 Form', 'Dispatcher Agreement & POA'],
  },
  {
    number: '02',
    icon: <Truck size={32} />,
    title: 'We Find Your Loads',
    description:
      'Your dedicated dispatcher goes to work immediately, searching load boards and calling brokers to find you the best loads. We negotiate rates on your behalf and only present loads that meet your requirements.',
    details: ['Search across all major load boards', 'Call 100+ brokers in your lanes', 'Negotiate best rate per mile', 'Review rate confirmations'],
  },
  {
    number: '03',
    icon: <DollarSign size={32} />,
    title: 'You Drive — We Handle Everything',
    description:
      'Accept the load, pick up, and deliver. We handle all check calls, ETA updates, and communication with brokers. After delivery, we send invoices to get you paid fast — often same-day with factoring.',
    details: ['Check calls handled by us', 'Real-time ETA updates to broker', 'Invoice submission after delivery', 'Factoring assistance for fast pay'],
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className={`section ${styles.howItWorks}`} id="how-it-works">
      <div className="container">
        {/* Header */}
        <motion.div
          ref={ref}
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">The Process</span>
          <h2 className="section-title">
            Up & Running in <span className="highlight">24 Hours</span>
          </h2>
          <p className="section-subtitle">
            Getting started with Dispatch Now is fast and simple.
            Most drivers are on the road with their first load within one business day.
          </p>
        </motion.div>

        {/* Steps */}
        <div className={styles.steps}>
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className={styles.step}
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.2 }}
            >
              {/* Connector Line */}
              {i < steps.length - 1 && <div className={styles.connector} />}

              <div className={styles.stepLeft}>
                <div className={styles.stepNumber}>{step.number}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
              </div>

              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
                <ul className={styles.stepDetails}>
                  {step.details.map((d) => (
                    <li key={d} className={styles.stepDetail}>
                      <span className={styles.stepDetailDot} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className={styles.bottomCta}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p>Ready to get started? It takes less than 5 minutes to register as driver.</p>
          <Link
            to="/register/carrier"
            className="btn-primary"
          >
            Get My First Load →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
