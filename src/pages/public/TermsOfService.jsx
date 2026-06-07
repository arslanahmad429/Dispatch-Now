import styles from './LegalPages.module.css';

export default function TermsOfService() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.legalPage}>
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <span className="section-label">Legal Information</span>
            <h2 className="section-title">Terms of <span className="highlight">Service</span></h2>
            <p className={styles.meta}>Last Updated: June 6, 2026 — Effective Immediately</p>
          </div>

          <div className={styles.contentWrapper}>
            {/* Sidebar Navigation */}
            <aside className={styles.sidebar}>
              <h4 className={styles.sidebarTitle}>Navigation</h4>
              <span onClick={() => scrollToSection('acceptance')} className={styles.sidebarLink}>1. Acceptance of Terms</span>
              <span onClick={() => scrollToSection('registration')} className={styles.sidebarLink}>2. Carrier Registration Model</span>
              <span onClick={() => scrollToSection('fees')} className={styles.sidebarLink}>3. Service Fees & Dispatch Cut</span>
              <span onClick={() => scrollToSection('compliance')} className={styles.sidebarLink}>4. DOT Compliance Requirements</span>
              <span onClick={() => scrollToSection('billing')} className={styles.sidebarLink}>5. Billing & Proof of Delivery</span>
              <span onClick={() => scrollToSection('relationship')} className={styles.sidebarLink}>6. Broker / Non-Broker Status</span>
              <span onClick={() => scrollToSection('conduct')} className={styles.sidebarLink}>7. Code of Conduct</span>
              <span onClick={() => scrollToSection('termination')} className={styles.sidebarLink}>8. Termination & Suspension</span>
            </aside>

            {/* Main Document */}
            <div className={styles.documentCard}>
              <div id="acceptance" className={styles.docSection}>
                <h3>
                  <span className={styles.sectionNumber}>1.</span> Acceptance of Terms
                </h3>
                <p>
                  By registering your vehicle and driver credentials with Dispatch Now, you confirm that you have read, understood, and agreed to be legally bound by these Terms of Service. These terms govern your use of the Dispatch Now driver portal, dispatch coordination services, and all related operational features.
                </p>
                <p>
                  If you do not agree to these terms, you may not create a driver account or use any Dispatch Now services. These terms may be updated periodically and will always reflect the effective date noted above.
                </p>
              </div>

              <div id="registration" className={styles.docSection}>
                <h3>
                  <span className={styles.sectionNumber}>2.</span> Carrier Registration Model
                </h3>
                <p>
                  Dispatch Now operates on an <strong>individual driver-to-vehicle</strong> registration architecture. This means:
                </p>
                <ul>
                  <li>Every driver must register themselves individually with their specific truck or vehicle.</li>
                  <li>Fleet-level bulk registrations or shared-account creations are not supported.</li>
                  <li>Each driver account is strictly tied to one truck plate number and one MC authority credential.</li>
                  <li>Duplicate plate numbers or duplicate MC codes that already exist in the system will be blocked upon sign-up to prevent double-dispatching conflicts.</li>
                </ul>
                <div className={styles.highlightBox}>
                  <p>If you own multiple trucks, each vehicle and driver combination must be registered separately under its own account with its own unique plate number and CDL credentials.</p>
                </div>
              </div>

              <div id="fees" className={styles.docSection}>
                <h3>
                  <span className={styles.sectionNumber}>3.</span> Service Fees & Dispatch Cut
                </h3>
                <p>
                  Dispatch Now charges a <strong>flat 8% dispatch service fee</strong> calculated against the gross rate of each successfully delivered and confirmed load.
                </p>
                <ul>
                  <li>The 8% deduction is applied uniformly across all load types, equipment categories, and lane distances.</li>
                  <li>There are no hidden fees, no per-mile charges, no sign-up fees, and no monthly retainer charges.</li>
                  <li>Invoices reflecting the gross load billing and net payout (after 8% deduction) are generated automatically within your financial ledger after each confirmed delivery.</li>
                  <li>Factoring companies — if selected by the driver — may impose their own additional processing fees separate from the Dispatch Now service fee.</li>
                </ul>
              </div>

              <div id="compliance" className={styles.docSection}>
                <h3>
                  <span className={styles.sectionNumber}>4.</span> DOT Compliance Requirements
                </h3>
                <p>
                  All drivers registering with Dispatch Now must satisfy the following mandatory FMCSA and DOT compliance documentation requirements before dispatch activation:
                </p>
                <ul>
                  <li><strong>Active Commercial Driver License (CDL)</strong> — must be current and not suspended.</li>
                  <li><strong>Vehicle Registration Papers</strong> — valid truck or trailer registration documents issued by a state DMV.</li>
                  <li><strong>Truck Photograph</strong> — clear, unobstructed front-side photograph of the physical vehicle.</li>
                  <li><strong>Driver Headshot Photograph</strong> — professional-quality photo of the registered driver.</li>
                  <li><strong>National Identification Card</strong> — government-issued ID to verify driver identity.</li>
                </ul>
                <p>
                  Dispatch Now reserves the right to delay or permanently suspend dispatch access for any driver whose documents fail DOT safety screening, show signs of falsification, or appear expired.
                </p>
              </div>

              <div id="billing" className={styles.docSection}>
                <h3>
                  <span className={styles.sectionNumber}>5.</span> Billing & Proof of Delivery
                </h3>
                <p>
                  Carriers are required to upload proof of delivery for each completed load to initiate the factoring release and payment settlement process. Acceptable proof includes:
                </p>
                <ul>
                  <li>A signed Bill of Lading (BOL) bearing the consignee's signature.</li>
                  <li>A clear parcel drop-off photograph at the delivery facility.</li>
                </ul>
                <p>
                  Logistics administrators review each submission and authorize payment releases manually. Incomplete or fraudulent delivery submissions may result in payment delay, withheld earnings, and possible account suspension.
                </p>
              </div>

              <div id="relationship" className={styles.docSection}>
                <h3>
                  <span className={styles.sectionNumber}>6.</span> Broker / Non-Broker Status
                </h3>
                <p>
                  Dispatch Now is an <strong>independent truck dispatch coordination service</strong>. We are NOT a licensed freight broker, freight forwarder, or 3PL logistics provider.
                </p>
                <p>
                  We act as your administrative agent representative under your FMCSA-issued Motor Carrier authority. This means:
                </p>
                <ul>
                  <li>All freight transport contracts exist strictly between you (the carrier) and the licensed freight broker.</li>
                  <li>Dispatch Now does not take physical possession of cargo at any point.</li>
                  <li>We do not assume principal carrier liability for freight damage or shortage claims.</li>
                  <li>All insurance, cargo liability, and FMCSA regulations remain your sole responsibility as the operating carrier.</li>
                </ul>
              </div>

              <div id="conduct" className={styles.docSection}>
                <h3>
                  <span className={styles.sectionNumber}>7.</span> Code of Conduct
                </h3>
                <p>
                  By using the Dispatch Now platform, you agree to uphold professional dispatch standards. Prohibited conduct includes:
                </p>
                <ul>
                  <li>Double-brokering assigned loads to unauthorized third parties without written consent.</li>
                  <li>Providing falsified MC numbers, DOT codes, insurance certificates, or CDL credentials.</li>
                  <li>Abandoning loads mid-transit without immediate dispatcher notification.</li>
                  <li>Attempting to circumvent the 8% dispatch fee through private broker agreements initiated through Dispatch Now introductions.</li>
                </ul>
                <div className={styles.highlightBox}>
                  <p>Violation of conduct policies may result in immediate account suspension, forfeiture of pending earnings, and reporting to FMCSA authorities where applicable.</p>
                </div>
              </div>

              <div id="termination" className={styles.docSection}>
                <h3>
                  <span className={styles.sectionNumber}>8.</span> Termination & Suspension
                </h3>
                <p>
                  Either party may terminate this service relationship at any time. Dispatch Now reserves the right to suspend or permanently deactivate any driver account that:
                </p>
                <ul>
                  <li>Fails to maintain active MC authority or operating insurance coverage.</li>
                  <li>Accumulates repeated no-show or load abandonment incidents.</li>
                  <li>Submits fraudulent delivery documentation or compliance papers.</li>
                  <li>Engages in conduct deemed harmful to broker or shipper relationships managed by Dispatch Now.</li>
                </ul>
                <p>
                  For termination requests, account appeals, or questions about these terms, contact us at <a href="mailto:dispatch@dispatchnow.com" className="highlight">dispatch@dispatchnow.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
