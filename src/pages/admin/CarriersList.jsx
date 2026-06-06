import { useState, useEffect } from 'react';
import { getCarriers, updateCarrierStatus, getMockDb } from '../../utils/mockDb';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { Check, X, Mail, Phone, Calendar, Search, RefreshCw } from 'lucide-react';
import styles from './CarriersList.module.css';

export default function CarriersList() {
  const [carriers, setCarriers] = useState([]);
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

  const toggleApproval = (mcNumber) => {
    const db = getMockDb();
    const carrier = db.carriers.find(c => c.mcNumber === mcNumber);
    if (carrier) {
      const nextStatus = carrier.status === 'approved' ? 'pending' : 'approved';
      updateCarrierStatus(mcNumber, nextStatus);
      // Refresh local state list
      setCarriers(getCarriers());
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
    const matchesName = !filters.name || c.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesPhone = !filters.phone || c.phone.includes(filters.phone);
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
    { key: 'mcNumber', label: 'Authority Codes', render: (_, row) => (
      <div style={{ fontSize: '0.9rem' }}>
        <div>MC: <strong>{row.mcNumber}</strong></div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>USDOT: {row.dotNumber}</div>
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
    { key: 'carrierType', label: 'Carrier Scale', sortable: true, render: (val) => (
      <span style={{ 
        fontSize: '0.8rem', 
        fontWeight: 'bold', 
        padding: '2px 8px', 
        borderRadius: '12px', 
        background: val === 'fleet' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
        color: val === 'fleet' ? '#3b82f6' : '#8b5cf6',
        textTransform: 'uppercase'
      }}>
        {val === 'fleet' ? 'Fleet' : 'Solo'}
      </span>
    )},
    { key: 'status', label: 'Compliance', render: (val) => <StatusBadge status={val} /> },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <button 
        className={row.status === 'approved' ? styles.suspendBtn : styles.approveBtn}
        onClick={() => toggleApproval(row.mcNumber)}
      >
        {row.status === 'approved' ? <X size={12} /> : <Check size={12} />}
        {row.status === 'approved' ? "Suspend" : "Approve"}
      </button>
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
    </div>
  );
}
