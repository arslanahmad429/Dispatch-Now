import { createContext, useContext, useState, useEffect } from 'react';
import { getMockDb, addCarrier, getAdminCredentials } from '../utils/mockDb';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Read session from localStorage on mount (Proper Session Management)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dn_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Keep track of auth updates across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'dn_user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (identifier, password) => {
    const cleanId = identifier.trim().toLowerCase();
    
    // 1. Universal routing check: If user ID/plate number ends with @dispatchnow or @dispatchnow.us
    if (cleanId.endsWith('@dispatchnow') || cleanId.endsWith('@dispatchnow.us')) {
      const adminCreds = getAdminCredentials();
      if (cleanId === adminCreds.email.toLowerCase()) {
        if (password === adminCreds.password) {
          const userData = { email: adminCreds.email, role: 'admin', name: adminCreds.name };
          setUser(userData);
          localStorage.setItem('dn_user', JSON.stringify(userData));
          return { success: true, role: 'admin' };
        } else {
          return { success: false, error: 'Password incorrect.' };
        }
      }
      return { success: false, error: 'Administrator ID is not registered.' };
    }

    // 2. Otherwise, check Carrier/Driver database by Truck Plate Number
    const db = getMockDb();
    const carrier = db.carriers.find(c => c.truckNumber && c.truckNumber.toLowerCase() === cleanId);
    
    if (carrier) {
      if (carrier.password !== password) {
        return { success: false, error: 'Password incorrect.' };
      }
      
      if (carrier.status !== 'approved') {
        if (carrier.status === 'suspended') {
          return { 
            success: false, 
            error: 'You are banned by admin. Contact admin.' 
          };
        }
        return { 
          success: false, 
          error: 'Your application is under review. You can access your portal after approval of your application.' 
        };
      }

      const displayName = carrier.name || `${carrier.firstName || ''} ${carrier.lastName || ''}`.trim() || 'Driver';
      const userData = { email: carrier.email, role: 'carrier', name: displayName, truckNumber: carrier.truckNumber };
      setUser(userData);
      localStorage.setItem('dn_user', JSON.stringify(userData));
      return { success: true, role: 'carrier' };
    }

    return { success: false, error: 'Truck Plate Number is not registered.' };
  };

  const registerCarrier = (data) => {
    const res = addCarrier(data);
    if (!res.success) {
      return { success: false, error: res.error };
    }
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dn_user');
    // Session hardening: clear state history entry and force page redirect
    window.location.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registerCarrier, setUser }}>
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
