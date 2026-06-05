import Services from '../../components/Services/Services';
import { Check, X, ShieldAlert, BadgeDollarSign, Truck, Calendar } from 'lucide-react';
import styles from './ServicesPage.module.css';

export default function ServicesPage() {
  return (
    <div className={styles.servicesPage}>
      <Services />

      {/* Comparison Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">Why Choose Professional Dispatching</span>
            <h2 className="section-title">In-House vs. Dispatch Now</h2>
            <p className="section-subtitle">See how outsourcing your dispatch operations compares to hiring in-house staff or doing it yourself.</p>
          </div>

          <div className={styles.comparisonWrapper}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th>Feature / Benefit</th>
                  <th>DIY Dispatching</th>
                  <th>In-house Dispatcher</th>
                  <th className={styles.activeCol}>Dispatch Now</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cost Structure</td>
                  <td>Free (Your time lost)</td>
                  <td>Salary + Benefits ($45k-$60k/yr)</td>
                  <td className={styles.activeCol}>Flat % of load value (No load, no pay)</td>
                </tr>
                <tr>
                  <td>Experience & Networks</td>
                  <td>Limited to your knowledge</td>
                  <td>Single dispatcher limits</td>
                  <td className={styles.activeCol}>Nationwide broker relationship team</td>
                </tr>
                <tr>
                  <td>Broker Negotiations</td>
                  <td>Hard while driving</td>
                  <td>Standard business hours</td>
                  <td className={styles.activeCol}>Agreed 24/7 coverage & top negotiations</td>
                </tr>
                <tr>
                  <td>Admin Support</td>
                  <td>Do it at truck stops</td>
                  <td>Varies by person</td>
                  <td className={styles.activeCol}>Fully handled setups, packets & invoice follow-up</td>
                </tr>
                <tr>
                  <td>Regulatory / Safety</td>
                  <td>Self-managed</td>
                  <td>Extra safety coordinator cost</td>
                  <td className={styles.activeCol}>DOT compliance checks & advisory included</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Value Add Section */}
      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.card}>
              <ShieldAlert size={40} className={styles.icon} />
              <h3>Credit Checks on Brokers</h3>
              <p>We check credit ratings with multiple factoring companies before you book, preventing payment disputes and dead days.</p>
            </div>
            <div className={styles.card}>
              <BadgeDollarSign size={40} className={styles.icon} />
              <h3>Factoring Setup</h3>
              <p>Get paid within 24 hours of delivery. We set up your invoices with your factoring company of choice automatically.</p>
            </div>
            <div className={styles.card}>
              <Calendar size={40} className={styles.icon} />
              <h3>Weekly Schedule Booking</h3>
              <p>No more day-to-day stress. We pre-plan your entire weekly lane loops so you always know where your next load is.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
