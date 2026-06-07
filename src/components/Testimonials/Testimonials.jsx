import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    name: 'Marcus Williams',
    role: 'Owner-Operator | Dry Van',
    state: 'Texas',
    avatar: 'MW',
    rating: 5,
    text:
      "Before Dispatch Now, I was spending 4-5 hours a day looking for loads and dealing with brokers. Now I just drive. My rate per mile went from $2.10 to $3.40 in the first month. Best business decision I've ever made.",
    stats: '+$4,200/month increase',
  },
  {
    name: 'Darius Jackson',
    role: 'Fleet Owner | 3 Trucks',
    state: 'Georgia',
    avatar: 'DJ',
    rating: 5,
    text:
      "I was skeptical at first about paying a dispatch fee. But within 2 weeks, my three trucks were all running over $3/mile consistently. The team is professional and always reachable. They literally work 24/7.",
    stats: 'All 3 trucks fully loaded',
  },
  {
    name: 'Sandra Reyes',
    role: 'Owner-Operator | Reefer',
    state: 'California',
    avatar: 'SR',
    rating: 5,
    text:
      "As a female owner-operator, I was worried about being taken advantage of by brokers. Dispatch Now changed everything. They negotiate hard on my behalf and I've never felt more confident in my business.",
    stats: '$4.20/mi average rate',
  },
  {
    name: 'Tony Kowalski',
    role: 'Owner-Operator | Flatbed',
    state: 'Ohio',
    avatar: 'TK',
    rating: 5,
    text:
      "The paperwork alone was killing me. Rate cons, broker packets, invoicing — I hated all of it. Dispatch Now took all of that away. Now I spend my time on the road, which is where the money is made.",
    stats: 'Zero paperwork stress',
  },
  {
    name: 'Kevin Thompson',
    role: 'Owner-Operator | Box Truck',
    state: 'Florida',
    avatar: 'KT',
    rating: 5,
    text:
      "Started with my box truck doing Amazon Relay on my own. Switched to Dispatch Now and they found me dedicated lanes that pay $2.60/mi. My weekly earnings went up 40%. Worth every penny of their 8% fee.",
    stats: '+40% weekly earnings',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  };

  const next = () => {
    setDirection(1);
    setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  };

  const t = testimonials[current];

  return (
    <section className={`section ${styles.testimonials}`} id="testimonials">
      <div className={styles.bg} />
      <div className="container">
        <motion.div
          ref={ref}
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Testimonials</span>
          <h2 className="section-title">
            Drivers <span className="highlight">Love Us</span>
          </h2>
          <p className="section-subtitle">
            Don't take our word for it. Here's what real owner-operators say about working with Dispatch Now.
          </p>
        </motion.div>

        <motion.div
          className={styles.carouselWrapper}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.carousel}>
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                className={styles.card}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className={styles.quoteIcon}>
                  <Quote size={32} />
                </div>
                <div className={styles.stars}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={18} fill="var(--accent)" color="var(--accent)" />
                  ))}
                </div>
                <p className={styles.text}>{t.text}</p>
                <div className={styles.statBadge}>{t.stats}</div>
                <div className={styles.author}>
                  <div className={styles.avatar}>{t.avatar}</div>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorName}>{t.name}</div>
                    <div className={styles.authorRole}>{t.role} • {t.state}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <button className={styles.btn} onClick={prev} aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
            <div className={styles.dots}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button className={styles.btn} onClick={next} aria-label="Next">
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
