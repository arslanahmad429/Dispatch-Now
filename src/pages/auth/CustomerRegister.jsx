import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Building, Lock, ArrowRight } from 'lucide-react';
import styles from './Login.module.css'; // Reusing form classes

export default function CustomerRegister() {
  const { registerCustomer } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = registerCustomer(formData);
      setLoading(false);
      if (res.success) {
        navigate('/customer/dashboard');
      } else {
        setError(res.error || 'Registration failed');
      }
    }, 1000);
  };

  return (
    <div className={styles.loginWrapper}>
      <h2>Customer Registration</h2>
      <p className={styles.subtitle}>Sign up as a shipper to book and track freight loads seamlessly.</p>

      {error && <div className={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className={styles.inputGroup}>
            <label>First Name *</label>
            <div className={styles.inputWrapper}>
              <input 
                name="firstName"
                type="text" 
                placeholder="John" 
                value={formData.firstName}
                onChange={handleChange}
                required
                style={{ paddingLeft: '16px' }}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Last Name *</label>
            <div className={styles.inputWrapper}>
              <input 
                name="lastName"
                type="text" 
                placeholder="Smith" 
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{ paddingLeft: '16px' }}
              />
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Email Address *</label>
          <div className={styles.inputWrapper}>
            <Mail size={18} className={styles.inputIcon} />
            <input 
              name="email"
              type="email" 
              placeholder="john@company.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Phone Number</label>
          <div className={styles.inputWrapper}>
            <Phone size={18} className={styles.inputIcon} />
            <input 
              name="phone"
              type="tel" 
              placeholder="(555) 000-0000" 
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Company Name</label>
          <div className={styles.inputWrapper}>
            <Building size={18} className={styles.inputIcon} />
            <input 
              name="company"
              type="text" 
              placeholder="ACME Logistics" 
              value={formData.company}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Password *</label>
          <div className={styles.inputWrapper}>
            <Lock size={18} className={styles.inputIcon} />
            <input 
              name="password"
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'} <ArrowRight size={16} />
        </button>
      </form>

      <div className={styles.registerPrompt}>
        <p>Already have an account? <Link to="/login" className={styles.regLink}>Sign In</Link></p>
      </div>
    </div>
  );
}
