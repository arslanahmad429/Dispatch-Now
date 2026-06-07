import { useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import styles from './FloatingThemeToggle.module.css';

export default function FloatingThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Paths where the public Navbar is NOT visible
  const nonNavbarPaths = [
    '/login',
    '/register',
    '/forgot-password',
    '/carrier',
    '/admin'
  ];

  const isNavbarHidden = nonNavbarPaths.some(path => 
    location.pathname.startsWith(path)
  );

  if (!isNavbarHidden) {
    return null; // Public pages already have the toggle inside the Navbar
  }

  return (
    <button 
      className={styles.floatingToggle} 
      onClick={toggleTheme} 
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}
