import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCarriers, addOrder } from '../../utils/mockDb';
import { Truck, PlusCircle, ArrowRight, DollarSign } from 'lucide-react';
import styles from './AddOrder.module.css';

export default function AddOrder() {
  const navigate = useNavigate();
  const [approvedCarriers, setApprovedCarriers] = useState([]);
  const [formData, setFormData] = useState({
    carrierEmail: '',
    customer: '',
    pickup: '',
    delivery: '',
    equipment: 'dry-van',
    rate: '',
    weight: '',
    commodity: '',
    date: new Date().toISOString().substring(0, 10)
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load approved carriers to populate dropdown
    const list = getCarriers();
    const approved = list.filter(c => c.status === 'approved');
    setApprovedCarriers(approved);
    
    if (approved.length > 0) {
      setFormData(prev => ({ ...prev, carrierEmail: approved[0].email }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Data validations
    if (!formData.carrierEmail) {
      setError('Please select an approved driver first.');
      return;
    }
    if (!formData.customer || formData.customer.trim().length < 2) {
      setError('Please enter a valid Shipper/Customer name.');
      return;
    }
    if (!formData.pickup || formData.pickup.trim().length < 3) {
      setError('Please enter a valid Pickup location.');
      return;
    }
    if (!formData.delivery || formData.delivery.trim().length < 3) {
      setError('Please enter a valid Delivery location.');
      return;
    }
    const parsedRate = Number(formData.rate);
    if (isNaN(parsedRate) || parsedRate <= 0) {
      setError('Gross Freight Rate must be a positive number.');
      return;
    }

    // Call database to create order manually
    const res = addOrder(formData);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/admin/orders');
      }, 1500);
    } else {
      setError(res.error || 'Failed to dispatch manual load.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Manually Add Dispatch Order</h2>
        <p>Record shipment listings negotiated with shippers and assign them directly to your registered carriers.</p>
      </div>

      <div className={styles.card}>
        {error && <div className={styles.errorAlert}>{error}</div>}
        {success && <div className={styles.successAlert}>Order created and dispatched successfully! Redirecting...</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            {/* Carrier select dropdown */}
            <div className={styles.field}>
              <label>Assign Approved Driver *</label>
              <select 
                name="carrierEmail"
                value={formData.carrierEmail}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Approved Carrier --</option>
                {approvedCarriers.map(c => (
                  <option key={c.id} value={c.email}>
                    {c.name} ({c.mcNumber} - {c.carrierType.toUpperCase()})
                  </option>
                ))}
              </select>
              {approvedCarriers.length === 0 && (
                <span className={styles.helpText} style={{ color: '#ef4444' }}>
                  No approved carriers found. Go to the Carriers tab to approve a carrier first.
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label>Shipper / Customer Name *</label>
              <input 
                name="customer"
                type="text"
                placeholder="e.g. ACME Chemicals"
                value={formData.customer}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Pickup Location *</label>
              <input 
                name="pickup"
                type="text"
                placeholder="e.g. Houston, TX"
                value={formData.pickup}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Delivery Location *</label>
              <input 
                name="delivery"
                type="text"
                placeholder="e.g. Denver, CO"
                value={formData.delivery}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Trailer Equipment Required *</label>
              <select 
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                required
              >
                <option value="dry-van">Dry Van (53ft)</option>
                <option value="flatbed">Flatbed / Stepdeck</option>
                <option value="reefer">Reefer / Temp-Controlled</option>
                <option value="box-truck">Box Truck (26ft)</option>
                <option value="hotshot">Hotshot</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Gross Freight Rate ($) *</label>
              <div className={styles.rateInputWrapper}>
                <DollarSign size={16} className={styles.inputIcon} />
                <input 
                  name="rate"
                  type="number"
                  placeholder="e.g. 3500"
                  value={formData.rate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Weight (lbs)</label>
              <input 
                name="weight"
                type="text"
                placeholder="e.g. 42,000 lbs"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label>Commodity Description</label>
              <input 
                name="commodity"
                type="text"
                placeholder="e.g. Steel Tubes / Pallets"
                value={formData.commodity}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label>Shipment Date *</label>
              <input 
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
            <PlusCircle size={18} /> Dispatch Manual Load <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
