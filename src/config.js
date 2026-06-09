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

/**
 * Centralized Contact Information
 * Modifying any value here updates it automatically across the entire website.
 */
export const CONTACT_INFO = {
  // Raw phone number (numeric)
  phone: '03036405094',
  
  // Formatted phone number for visual display
  formattedPhone: '0303-6405094',
  
  // Primary email address
  email: 'dispatch@dispatchnow.com',
  
  // WhatsApp Link (International format: Pakistan country code 92 + 3036405094)
  whatsappUrl: 'https://wa.me/923036405094'
};
