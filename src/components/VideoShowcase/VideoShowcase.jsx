import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import styles from './VideoShowcase.module.css';

export default function VideoShowcase() {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <section className={styles.showcase} ref={ref}>
      <motion.div
        className={styles.wrapper}
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Video Container */}
        <div className={styles.videoContainer} onClick={togglePlay}>
          <video
            ref={videoRef}
            className={styles.video}
            src="/Video.mp4"
            loop
            playsInline
            muted
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />

          {/* Overlay when paused */}
          <div className={`${styles.playOverlay} ${playing ? styles.hidden : ''}`}>
            <motion.button
              className={styles.playBtn}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Play video"
            >
              <Play size={32} fill="#000" color="#000" />
            </motion.button>
            <p className={styles.playLabel}>Watch How We Work</p>
          </div>

          {/* Pause Button (when playing) */}
          {playing && (
            <motion.button
              className={styles.pauseBtn}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ opacity: 1 }}
              aria-label="Pause video"
            >
              <Pause size={20} />
            </motion.button>
          )}

          {/* Gold corner accents */}
          <div className={styles.cornerTL} />
          <div className={styles.cornerBR} />
        </div>

        {/* Side Quote */}
        <div className={styles.sideContent}>
          <div className={styles.quoteBlock}>
            <div className={styles.quoteMark}>"</div>
            <blockquote className={styles.quote}>
              While you drive, we make every mile count. That is the
              Dispatch Now promise.
            </blockquote>
            <div className={styles.quoteAuthor}>
              <div className={styles.authorAvatar}>DN</div>
              <div>
                <div className={styles.authorName}>Dispatch Now Team</div>
                <div className={styles.authorRole}>Professional Truck Dispatchers</div>
              </div>
            </div>
          </div>

          <div className={styles.highlights}>
            {[
              { icon: '🏆', text: '500+ carriers dispatched successfully' },
              { icon: '📍', text: 'Active across all 48 contiguous states' },
              { icon: '⚡', text: 'Average 2-hour load turnaround time' },
            ].map((h) => (
              <motion.div
                key={h.text}
                className={styles.highlight}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
              >
                <span className={styles.highlightIcon}>{h.icon}</span>
                <span className={styles.highlightText}>{h.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
