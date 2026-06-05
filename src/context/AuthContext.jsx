import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Demo users for frontend-only simulation
const DEMO_USERS = {
  'customer@dispatchnow.com':   { role: 'customer',   name: 'Alex Johnson',   password: 'demo123' },
  'carrier@dispatchnow.com':    { role: 'carrier',    name: 'Marcus Williams', password: 'demo123' },
  'admin@dispatchnow.com':      { role: 'admin',      name: 'Sarah Mitchell',  password: 'demo123' },
  'dispatcher@dispatchnow.com': { role: 'dispatcher', name: 'Tom Richards',    password: 'demo123' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('dn_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = (email, password) => {
    const found = DEMO_USERS[email.toLowerCase()];
    if (found && found.password === password) {
      const userData = { email: email.toLowerCase(), role: found.role, name: found.name };
      setUser(userData);
      localStorage.setItem('dn_user', JSON.stringify(userData));
      return { success: true, role: found.role };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const registerCustomer = (data) => {
    // PLACEHOLDER — wire to backend later
    const userData = { email: data.email, role: 'customer', name: data.firstName + ' ' + data.lastName };
    setUser(userData);
    localStorage.setItem('dn_user', JSON.stringify(userData));
    return { success: true };
  };

  const registerCarrier = (data) => {
    // PLACEHOLDER — wire to backend later
    const userData = { email: data.email, role: 'carrier', name: data.firstName + ' ' + data.lastName };
    setUser(userData);
    localStorage.setItem('dn_user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dn_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registerCustomer, registerCarrier }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function getDashboardPath(role) {
  const map = {
    customer: '/customer/dashboard',
    carrier: '/carrier/dashboard',
    admin: '/admin/dashboard',
    dispatcher: '/dispatcher/dashboard',
  };
  return map[role] || '/login';
}
