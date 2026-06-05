import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Search, DollarSign, FileText, Map, Handshake,
  PhoneCall, Clock, Shield, TrendingUp, Zap
} from 'lucide-react';
import styles from './Services.module.css';

const services = [
  {
    icon: <Search size={28} />,
    title: "Load Finding",
    description: "We search all major load boards — DAT, Truckstop, 123Loadboard — to find the best freight matching your equipment and preferred lanes.",
    tag: "Core Service",
  },
  {
    icon: <DollarSign size={28} />,
    title: "Rate Negotiation",
    description: "Our experienced dispatchers negotiate aggressively with brokers to maximize your rate per mile. We consistently beat average market rates by 10-20%.",
    tag: "Top Feature",
  },
  {
    icon: <FileText size={28} />,
    title: "Paperwork & Admin",
    description: "We handle all rate confirmations, broker setup packets, and load documentation. You sign nothing until we have reviewed everything for you.",
    tag: "Time Saver",
  },
  {
    icon: <Map size={28} />,
    title: "Route Planning",
    description: "We plan your weekly routes to minimize deadhead miles (empty driving) and maximize your total weekly revenue per truck.",
    tag: "Smart Routing",
  },
  {
    icon: <Handshake size={28} />,
    title: "Broker Relationships",
    description: "We have established relationships with hundreds of top freight brokers nationwide, giving you access to premium loads that others do not see.",
    tag: "Network",
  },
  {
    icon: <PhoneCall size={28} />,
    title: "24/7 Dispatcher Support",
    description: "Our dispatchers are always on call. Whether you break down at 2am or need a reload found quickly, we are here for you around the clock.",
    tag: "24/7",
  },
  {
    icon: <Clock size={28} />,
    title: "Quick Check Calls",
    description: "We handle all check calls with brokers so you never have to pull over. We update shippers and receivers with your ETA in real time.",
    tag: "Communication",
  },
  {
    icon: <Shield size={28} />,
    title: "Contract Protection",
    description: "We review all broker agreements to ensure your interests are protected. No hidden clauses, no surprises. We guard your MC authority.",
    tag: "Legal",
  },
  {
    icon: <TrendingUp size={28} />,
    title: "Performance Analytics",
    description: "Get weekly reports on miles driven, revenue earned, and rate per mile. We track your performance so you always know how profitable you are.",
    tag: "Analytics",
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section" id="services">
      <div className="container">
        {/* Header */}
        <motion.div
          ref={ref}
          className={styles.servicesHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">What We Do</span>
          <h2 className="section-title">
            Everything You Need to <span className="highlight">Run Your Truck</span>
          </h2>
          <p className="section-subtitle">
            From finding loads to handling every piece of paperwork — Dispatch Now is your full-service
            dispatching partner. We handle the office, you handle the road.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className={styles.servicesGrid}>
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              className={styles.serviceCard}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className={styles.serviceTag}>{service.tag}</div>
              <div className={styles.serviceIcon}>{service.icon}</div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDesc}>{service.description}</p>
              <div className={styles.serviceArrow}>
                <Zap size={14} /> Learn more
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
