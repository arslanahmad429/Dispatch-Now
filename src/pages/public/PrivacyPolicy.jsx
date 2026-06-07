import styles from './LegalPages.module.css';

export default function PrivacyPolicy() {
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
            <h2 className="section-title">Privacy <span className="highlight">Policy</span></h2>
            <p className={styles.meta}>Last Updated: June 6, 2026</p>
          </div>

          <div className={styles.contentWrapper}>
            {/* Sidebar Navigation */}
            <aside className={styles.sidebar}>
              <h4 className={styles.sidebarTitle}>Navigation</h4>
              <span onClick={() => scrollToSection('intro')} className={styles.sidebarLink}>1. Scope & Agency</span>
              <span onClick={() => scrollToSection('collect')} className={styles.sidebarLink}>2. Credentials Collected</span>
              <span onClick={() => scrollToSection('storage')} className={styles.sidebarLink}>3. Sandbox Storage</span>
              <span onClick={() => scrollToSection('sharing')} className={styles.sidebarLink}>4. Broker & Carrier Coordination</span>
              <span onClick={() => scrollToSection('security')} className={styles.sidebarLink}>5. Data Retention & Security</span>
              <span onClick={() => scrollToSection('rights')} className={styles.sidebarLink}>6. Owner-Operator Rights</span>
            </aside>

            {/* Main Document Content */}
            <div className={styles.documentCard}>
              <div id="intro" className={styles.docSection}>
                <h3>
                  <span className={styles.sectionNumber}>1.</span> Scope & Agent Representation
                </h3>
                <p>
                  Dispatch Now operates as an independent truck dispatch service coordinator, acting as the authorized administrative agent of the carrier (you) under your specific FMCSA Motor Carrier (MC) authority.
                </p>
                <p>
                  This Privacy Policy details how we collect, handle, store, and secure commercial credentials and driver profile details. By registering with Dispatch Now, you authorize us to manage your operational and compliance documents to coordinate loads with shippers and brokers on your behalf.
                </p>
              </div>

              <div id="collect" className={styles.docSection}>
                <h3>
                  <span className={styles.sectionNumber}>2.</span> Commercial Credentials Collected
                </h3>
                <p>
                  To secure freight bookings and verify DOT compliance, we collect essential transport credentials during registration and onboarding. This includes:
                </p>
                <ul>
                  <li><strong>Driver Identification:</strong> Legal name, phone number, email address, physical mailing address, and headshot photograph.</li>
                  <li><strong>Compliance Documents:</strong> Active Commercial Driver License (CDL), National Identification Card, and physical truck/fleet vehicle photographs.</li>
                  <li><strong>Regulatory Authority:</strong> Motor Carrier (MC) number, USDOT registration code, active certificate of liability insurance, and vehicle license plate/registration records.</li>
                </ul>
                <div className={styles.highlightBox}>
                  <p>IMPORTANT: All uploaded documents are subjected to DOT safety compliance audits. Failing to provide any of the 5 required assets will delay account dispatch activation.</p>
                </div>
              </div>

              <div id="storage" className={styles.docSection}>
                <h3>
                  <span className={styles.sectionNumber}>3.</span> Sandbox Storage & Offline Integrity
                </h3>
                <p>
                  As part of our commitment to system privacy and developer trial transparency, all uploaded documents, driver certificates, and active load sheets are processed and stored locally inside your browser's secure sandbox namespace (via <code>localStorage</code>).
                </p>
                <p>
                  No sensitive commercial files are transmitted to external marketing platforms or advertising networks. This ensures that your private business credentials, broker negotiations, and dispatch history remain exclusively under your control.
                </p>
              </div>

              <div id="sharing" className={styles.docSection}>
                <h3>
                  <span className={styles.sectionNumber}>4.</span> Broker & Carrier Coordination
                </h3>
                <p>
                  To fulfill our role as your dispatch coordinator, we communicate carrier information to licensed freight brokers, shippers, and receiver facilities. This data sharing is strictly limited to:
                </p>
                <ul>
                  <li>Submitting carrier profiles for quick setup with brokerages.</li>
                  <li>Sending signed broker-carrier agreements and rate confirmations.</li>
                  <li>Providing vehicle details, trailer type information, and dispatch status updates during active transit.</li>
                  <li>Uploading Proof of Delivery (signed Bill of Lading and cargo photos) to factoring companies or brokers to unlock factoring release.</li>
                </ul>
              </div>

              <div id="security" className={styles.docSection}>
                <h3>
                  <span className={styles.sectionNumber}>5.</span> Data Retention & Security
                </h3>
                <p>
                  We utilize commercial encryption standards to protect your dashboard data. In our full platform, database backups are encrypted at rest and in transit.
                </p>
                <p>
                  In this evaluation client, document attachments are saved as binary base64 references directly inside the sandbox container. Security limits access to authenticated sessions, meaning your profile remains invisible unless logged in via the platform.
                </p>
              </div>

              <div id="rights" className={styles.docSection}>
                <h3>
                  <span className={styles.sectionNumber}>6.</span> Owner-Operator Rights
                </h3>
                <p>
                  As an independent owner-operator, you maintain full control over your operational profile. You have the right to:
                </p>
                <ul>
                  <li>Review, edit, or update your registered vehicle plates and CDL details at any time via the Carrier Profile portal.</li>
                  <li>Request immediate deletion of your active driver record and storage clean-up.</li>
                  <li>Download your dispatch log histories containing gross load values, factoring sheets, and broker contacts.</li>
                </ul>
                <p>
                  If you have questions about document security or would like to completely reset your local credentials, please reach out to our support staff at <a href="mailto:dispatch@dispatchnow.com" className="highlight">dispatch@dispatchnow.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
