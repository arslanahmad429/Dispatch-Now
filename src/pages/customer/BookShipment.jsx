import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOrder } from '../../utils/mockDb';
import { Truck, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import styles from './BookShipment.module.css';

const equipmentOptions = [
  { value: "Dry Van", label: "Dry Van (53ft)" },
  { value: "Flatbed", label: "Flatbed" },
  { value: "Reefer", label: "Reefer" },
  { value: "Box Truck", label: "Box Truck (26ft)" },
  { value: "Hotshot", label: "Hotshot" }
];

export default function BookShipment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    pickup: '',
    delivery: '',
    date: '',
    equipment: 'Dry Van',
    weight: '',
    commodity: '',
    rate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.pickup || !form.delivery || !form.rate) return;
    setLoading(true);

    setTimeout(() => {
      addOrder({
        pickup: form.pickup,
        delivery: form.delivery,
        date: form.date,
        equipment: form.equipment,
        weight: form.weight ? `${form.weight} lbs` : "40,000 lbs",
        commodity: form.commodity || "General Freight",
        rate: Number(form.rate)
      });
      setLoading(false);
      navigate('/customer/orders');
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Book a New Shipment</h2>
          <p>Fill out pickup, delivery, cargo details and rate to list the load on the load boards.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className={styles.field}>
              <label>Pickup Location *</label>
              <input 
                name="pickup"
                type="text" 
                placeholder="City, ST (e.g. Houston, TX)" 
                value={form.pickup}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Delivery Location *</label>
              <input 
                name="delivery"
                type="text" 
                placeholder="City, ST (e.g. Denver, CO)" 
                value={form.delivery}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className={styles.field}>
              <label>Shipment Date *</label>
              <input 
                name="date"
                type="date" 
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Equipment Type Required *</label>
              <select name="equipment" value={form.equipment} onChange={handleChange}>
                {equipmentOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className={styles.field}>
              <label>Cargo Weight (lbs)</label>
              <input 
                name="weight"
                type="number" 
                placeholder="e.g. 42000" 
                value={form.weight}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>Commodity Type</label>
              <input 
                name="commodity"
                type="text" 
                placeholder="e.g. Steel Pipes, Paper Rolls" 
                value={form.commodity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Offered Broker Rate ($) *</label>
            <input 
              name="rate"
              type="number" 
              placeholder="e.g. 3500" 
              value={form.rate}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Posting shipment...' : 'Submit & Post Shipment'} <Save size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
