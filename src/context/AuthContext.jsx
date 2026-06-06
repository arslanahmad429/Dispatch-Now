import { createContext, useContext, useState, useEffect } from 'react';
import { getMockDb, addCarrier } from '../utils/mockDb';

const AuthContext = createContext(null);

// Static administrator accounts
const ADMIN_USER = {
  email: 'admin@dispatchnow.com',
  role: 'admin',
  name: 'Sarah Mitchell',
  password: 'demo123'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('dn_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = (email, password) => {
    const emailLower = email.toLowerCase();
    
    // 1. Check Administrator credentials
    if (emailLower === ADMIN_USER.email && password === ADMIN_USER.password) {
      const userData = { email: ADMIN_USER.email, role: 'admin', name: ADMIN_USER.name };
      setUser(userData);
      localStorage.setItem('dn_user', JSON.stringify(userData));
      return { success: true, role: 'admin' };
    }

    // 2. Check Carrier/Driver database
    const db = getMockDb();
    const carrier = db.carriers.find(c => c.email.toLowerCase() === emailLower);
    
    if (carrier) {
      if (carrier.password !== password) {
        return { success: false, error: 'Invalid email or password' };
      }
      
      if (carrier.status !== 'approved') {
        return { 
          success: false, 
          error: 'Your account is pending verification. Our team will contact you via WhatsApp.' 
        };
      }

      const userData = { email: carrier.email, role: 'carrier', name: carrier.name };
      setUser(userData);
      localStorage.setItem('dn_user', JSON.stringify(userData));
      return { success: true, role: 'carrier' };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const registerCarrier = (data) => {
    const res = addCarrier(data);
    if (!res.success) {
      return { success: false, error: res.error };
    }
    // We do NOT log them in automatically because they are pending approval
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dn_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registerCarrier }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function getDashboardPath(role) {
  const map = {
    carrier: '/carrier/dashboard',
    admin: '/admin/dashboard',
  };
  return map[role] || '/login';
}
