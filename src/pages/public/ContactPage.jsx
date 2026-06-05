import ContactForm from '../../components/ContactForm/ContactForm';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  return (
    <div className={styles.contactPage}>
      <ContactForm />
    </div>
  );
}
