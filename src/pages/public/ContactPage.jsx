import ContactForm from '../../components/ContactForm/ContactForm';
import heroStyles from '../../styles/PageHero.module.css';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  return (
    <div className={styles.contactPage}>

      {/* ── Hero Banner ── */}
      <div className={heroStyles.pageHero} style={{ minHeight: '340px' }}>
        <div className={heroStyles.pageHeroBg}>
          <video
            src="/media/carrier_transit.mp4"
            poster="/media/highway_truck.png"
            autoPlay
            loop
            muted
            playsInline
            style={{ filter: 'brightness(0.42) contrast(1.08) saturate(0.9)' }}
          />
        </div>
        <div 
          className={heroStyles.pageHeroOverlay} 
          style={{ background: 'linear-gradient(135deg, rgba(3, 12, 30, 0.52) 0%, rgba(10, 25, 60, 0.48) 100%)' }} 
        />
        <div className={heroStyles.pageHeroContent}>
          <span className={heroStyles.pageHeroLabel}>Get In Touch</span>
          <h1 className={heroStyles.pageHeroTitle}>
            Let's Get Your <span>Truck Moving</span>
          </h1>
          <p className={heroStyles.pageHeroSub}>
            Fill out the form below and a dedicated dispatcher will reach out within 24 hours.
          </p>
        </div>
      </div>

      <ContactForm />
    </div>
  );
}
