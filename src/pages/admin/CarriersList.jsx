import { useState, useEffect } from 'react';
import { getCarriers, updateCarrierStatus, getMockDb } from '../../utils/mockDb';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { Check, X, Mail, Phone, Calendar, Search, RefreshCw, Eye } from 'lucide-react';
import styles from './CarriersList.module.css';

export default function CarriersList() {
  const [carriers, setCarriers] = useState([]);
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    truckNo: '',
    licenseNo: '',
    status: ''
  });

  useEffect(() => {
    // Load registered carriers from database
    setCarriers(getCarriers());
  }, []);

  const toggleApproval = (email) => {
    const db = getMockDb();
    const carrier = db.carriers.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (carrier) {
      const nextStatus = carrier.status === 'approved' ? 'suspended' : 'approved';
      updateCarrierStatus(email, nextStatus);
      // Refresh local state list
      setCarriers(getCarriers());
      // Sync modal if active
      if (selectedCarrier && selectedCarrier.email.toLowerCase() === email.toLowerCase()) {
        setSelectedCarrier({ ...carrier, status: nextStatus });
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      phone: '',
      truckNo: '',
      licenseNo: '',
      status: ''
    });
  };

  // Filter carriers in-memory
  const filteredCarriers = carriers.filter(c => {
    const matchesName = !filters.name || (c.name && c.name.toLowerCase().includes(filters.name.toLowerCase()));
    const matchesPhone = !filters.phone || (c.phone && c.phone.includes(filters.phone));
    const matchesTruck = !filters.truckNo || (c.truckNumber && c.truckNumber.toLowerCase().includes(filters.truckNo.toLowerCase()));
    const matchesLicense = !filters.licenseNo || (c.licenseNumber && c.licenseNumber.toLowerCase().includes(filters.licenseNo.toLowerCase()));
    const matchesStatus = !filters.status || c.status === filters.status;
    return matchesName && matchesPhone && matchesTruck && matchesLicense && matchesStatus;
  });

  const columns = [
    { key: 'joinedDate', label: 'Registration Date', sortable: true, render: (val) => (
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <Calendar size={12} /> {val}
      </span>
    )},
    { key: 'name', label: 'Owner / Operator', sortable: true, render: (val, row) => (
      <div>
        <div style={{ fontWeight: '600' }}>{val}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={10} /> {row.email}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={10} /> {row.phone}</span>
        </div>
      </div>
    )},

    { key: 'truckNumber', label: 'Truck / License', render: (_, row) => (
      <div style={{ fontSize: '0.9rem' }}>
        <div>Truck: <strong>{row.truckNumber}</strong></div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CDL: {row.licenseNumber}</div>
      </div>
    )},
    { key: 'equipment', label: 'Trailer Profile', render: (val) => (
      <span style={{ textTransform: 'capitalize' }}>{val.replace('-', ' ')}</span>
    )},

    { key: 'status', label: 'Compliance', render: (val) => <StatusBadge status={val} /> },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          className={row.status === 'approved' ? styles.suspendBtn : styles.approveBtn}
          onClick={() => toggleApproval(row.email)}
        >
          {row.status === 'approved' ? <X size={12} /> : <Check size={12} />}
          {row.status === 'approved' ? "Suspend" : "Approve"}
        </button>
        <button 
          className={styles.viewDocsBtn}
          onClick={() => { setSelectedCarrier(row); setModalOpen(true); }}
        >
          <Eye size={12} /> View Docs
        </button>
      </div>
    )}
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Carriers Compliance Panel</h2>
        <p>Approve new owner-operator registrations, review safety details, and filter driver rosters.</p>
      </div>

      {/* Real-time Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <div className={styles.filterInputWrapper}>
            <Search size={14} className={styles.searchIcon} />
            <input 
              name="name"
              type="text" 
              placeholder="Search Name..." 
              value={filters.name}
              onChange={handleFilterChange}
            />
          </div>
          <input 
            name="phone"
            type="text" 
            placeholder="Search Phone..." 
            value={filters.phone}
            onChange={handleFilterChange}
          />
          <input 
            name="truckNo"
            type="text" 
            placeholder="Search Truck Plate..." 
            value={filters.truckNo}
            onChange={handleFilterChange}
          />
          <input 
            name="licenseNo"
            type="text" 
            placeholder="Search CDL No..." 
            value={filters.licenseNo}
            onChange={handleFilterChange}
          />
          <select 
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <button className="btn-outline" onClick={resetFilters} style={{ gap: '6px' }}>
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      <div className={styles.card}>
        <DataTable columns={columns} data={filteredCarriers} emptyText="No carriers match the specified filters." />
      </div>

      {modalOpen && selectedCarrier && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Carrier Compliance Documents</h3>
              <button className={styles.closeBtn} onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Driver: {selectedCarrier.name}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Truck Number: {selectedCarrier.truckNumber} | CDL: {selectedCarrier.licenseNumber}
              </div>
            </div>
            <div className={styles.docList}>
              {[
                { label: 'Driver License', key: 'license' },
                { label: 'Vehicle Registration', key: 'registration' },
                { label: 'Truck Photo', key: 'truckPhoto' },
                { label: 'Driver Photo', key: 'driverPhoto' },
                { label: 'National ID Card', key: 'nationalId' }
              ].map((doc) => {
                const filename = selectedCarrier.docs?.[doc.key];
                return (
                  <div key={doc.key} className={styles.docItem}>
                    <div className={styles.docInfo}>
                      <h5>{doc.label}</h5>
                      <p>{filename || 'No document uploaded'}</p>
                    </div>
                    {filename ? (
                      <a 
                        href={`http://localhost:5000/api/documents/${filename}`}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.docLink}
                      >
                        <Eye size={12} /> View File
                      </a>
                    ) : (
                      <span className={styles.noDoc}>Not Uploaded</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
