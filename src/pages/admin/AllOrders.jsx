import { useState, useEffect } from 'react';
import { getMockDb, updateOrderStatus } from '../../utils/mockDb';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { Edit2, ShieldAlert, Search, RefreshCw, Calendar, Truck } from 'lucide-react';
import styles from './AllOrders.module.css';

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    shipper: '',
    driver: '',
    truckNo: '',
    date: '',
    source: '',
    destination: '',
    maxPrice: '',
    status: ''
  });

  useEffect(() => {
    const db = getMockDb();
    setOrders(db.orders);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    const res = updateOrderStatus(orderId, newStatus, { note: `Admin updated status to ${newStatus}` });
    if (res.success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      shipper: '',
      driver: '',
      truckNo: '',
      date: '',
      source: '',
      destination: '',
      maxPrice: '',
      status: ''
    });
  };

  // Filter orders in-memory
  const filteredOrders = orders.filter(o => {
    const matchesShipper = !filters.shipper || o.customer.toLowerCase().includes(filters.shipper.toLowerCase());
    const matchesDriver = !filters.driver || (o.carrier && o.carrier.toLowerCase().includes(filters.driver.toLowerCase()));
    const matchesTruck = !filters.truckNo || (o.truckNumber && o.truckNumber.toLowerCase().includes(filters.truckNo.toLowerCase()));
    const matchesSource = !filters.source || o.pickup.toLowerCase().includes(filters.source.toLowerCase());
    const matchesDest = !filters.destination || o.delivery.toLowerCase().includes(filters.destination.toLowerCase());
    const matchesDate = !filters.date || o.date === filters.date;
    const matchesPrice = !filters.maxPrice || o.rate <= Number(filters.maxPrice);
    const matchesStatus = !filters.status || o.status === filters.status;

    return matchesShipper && matchesDriver && matchesTruck && matchesSource && matchesDest && matchesDate && matchesPrice && matchesStatus;
  });

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'date', label: 'Date', sortable: true, render: (val) => (
      <span style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <Calendar size={12} color="var(--text-muted)" /> {val}
      </span>
    )},
    { key: 'customer', label: 'Shipper', sortable: true },
    { key: 'pickup', label: 'Pickup (Source)', sortable: true },
    { key: 'delivery', label: 'Delivery (Dest)', sortable: true },
    { key: 'carrier', label: 'Carrier (Driver)', render: (val, row) => (
      <div>
        <div style={{ fontWeight: '600' }}>{val || "Unassigned"}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
          <Truck size={10} /> Truck: {row.truckNumber || "N/A"}
        </div>
      </div>
    )},
    { key: 'equipment', label: 'Equipment' },
    { key: 'rate', label: 'Price (Gross)', sortable: true, render: (val) => `$${(val || 0).toLocaleString()}` },
    { key: 'status', label: 'Manage Status', render: (val, row) => (
      <select 
        value={val} 
        onChange={(e) => handleStatusChange(row.id, e.target.value)}
        className={styles.statusSelect}
      >
        <option value="pending">Pending</option>
        <option value="dispatched">Dispatched</option>
        <option value="in-transit">In Transit</option>
        <option value="delivered">Delivered</option>
      </select>
    )}
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Universal Freight Orders</h2>
        <p>Review orders processed or in process. Apply precise filters to filter out specific load dispatches.</p>
      </div>

      {/* Grid Filter Panel */}
      <div className={styles.filterBar}>
        <div className={styles.filterGrid}>
          <div className={styles.filterInputWrapper}>
            <Search size={14} className={styles.searchIcon} />
            <input 
              name="shipper"
              type="text" 
              placeholder="Search Shipper..." 
              value={filters.shipper}
              onChange={handleFilterChange}
            />
          </div>
          <input 
            name="driver"
            type="text" 
            placeholder="Search Driver..." 
            value={filters.driver}
            onChange={handleFilterChange}
          />
          <input 
            name="truckNo"
            type="text" 
            placeholder="Search Truck No..." 
            value={filters.truckNo}
            onChange={handleFilterChange}
          />
          <input 
            name="source"
            type="text" 
            placeholder="Search Pickup..." 
            value={filters.source}
            onChange={handleFilterChange}
          />
          <input 
            name="destination"
            type="text" 
            placeholder="Search Delivery..." 
            value={filters.destination}
            onChange={handleFilterChange}
          />
          <input 
            name="date"
            type="date" 
            value={filters.date}
            onChange={handleFilterChange}
          />
          <input 
            name="maxPrice"
            type="number" 
            placeholder="Max Price..." 
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
          <select 
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="dispatched">Dispatched</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        <button className="btn-outline" onClick={resetFilters} style={{ gap: '6px', alignSelf: 'flex-end' }}>
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      <div className={styles.card}>
        <DataTable columns={columns} data={filteredOrders} emptyText="No orders match the specified filters." />
      </div>
    </div>
  );
}
