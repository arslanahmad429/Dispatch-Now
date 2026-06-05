import { useState } from 'react';
import { FileText, CheckCircle, AlertTriangle, UploadCloud } from 'lucide-react';
import styles from './CarrierDocuments.module.css';

export default function CarrierDocuments() {
  const [docs, setDocs] = useState([
    { name: "Motor Carrier Authority", filename: "MC_Authority_Certificate.pdf", expiry: "2027-12-31", status: "active" },
    { name: "Certificate of Insurance", filename: "Liability_Insurance_COI.pdf", expiry: "2026-10-15", status: "active" },
    { name: "W-9 Tax Form", filename: "W9_Form_2026.pdf", expiry: "N/A", status: "active" },
  ]);

  const handleMockUpload = (index) => {
    alert(`Upload new file placeholder for document: ${docs[index].name}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Compliance Documents</h2>
        <p>Manage and track expiry dates for your MC Authority, Liability Insurance, and W-9 tax forms.</p>
      </div>

      <div className={styles.grid}>
        {docs.map((doc, i) => (
          <div key={doc.name} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap}>
                <FileText size={24} color="var(--accent)" />
              </div>
              <div className={styles.statusBadge} style={{
                background: doc.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: doc.status === 'active' ? '#22c55e' : '#ef4444'
              }}>
                {doc.status === 'active' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                <span>{doc.status.toUpperCase()}</span>
              </div>
            </div>

            <div className={styles.docDetails}>
              <h3>{doc.name}</h3>
              <p className={styles.filename}>{doc.filename}</p>
              <p className={styles.expiry}>Expires: <strong>{doc.expiry}</strong></p>
            </div>

            <button className={styles.uploadBtn} onClick={() => handleMockUpload(i)}>
              <UploadCloud size={16} /> Update Document
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
