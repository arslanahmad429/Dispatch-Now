/**
 * Dynamic Configuration Utility
 * 
 * Automatically resolves the backend API URL based on the current environment.
 * - On Localhost: Resolves to http://localhost:5000 to interact with the backend server.
 * - On Production (e.g. Namecheap Hosting): Resolves to the site's origin (same domain and port).
 */
export const getApiUrl = (path = '') => {
  const hostname = window.location.hostname;
  
  // Detect if running locally on development computer
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
  
  const base = isLocal ? 'http://localhost:5000' : window.location.origin;
  
  const cleanBase = base.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  
  return `${cleanBase}/${cleanPath}`;
};
