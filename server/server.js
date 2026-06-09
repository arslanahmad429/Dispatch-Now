import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Import local database layer
import {
  getAdmin, updateAdmin, getCarriers, addCarrier, 
  updateCarrierStatus, getOrders, addOrder, 
  updateOrderStatus, updatePaymentStatus, resetCarrierPassword,
  clearDatabase, saveDocument, getDocument
} from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable security headers using Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enable CORS so the React frontend (running on e.g. port 3000 or 5173) can talk to this server
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Serve static files from React build directory if it exists
const DIST_DIR = path.join(__dirname, 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// 1. Safe Uploads Setup
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
try {
  fs.chmodSync(UPLOADS_DIR, 0o666);
} catch (err) {
  console.warn('Directory chmodSync skipped:', err.message);
}

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const secureName = `${crypto.randomUUID()}${ext}`;
    cb(null, secureName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error('Security Block: Invalid file extension. Only PNG, JPG, JPEG, WEBP, and PDF files are allowed.'));
    }
    cb(null, true);
  }
});

const verifyMagicBytes = (filePath) => {
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(12);
  fs.readSync(fd, buffer, 0, 12, 0);
  fs.closeSync(fd);

  const hex = buffer.toString('hex').toUpperCase();

  if (hex.startsWith('89504E47')) return 'image/png';
  if (hex.startsWith('FFD8FF')) return 'image/jpeg';
  if (hex.startsWith('25504446')) return 'application/pdf';
  if (hex.startsWith('52494646') && hex.slice(16, 24) === '57454250') return 'image/webp';

  return null;
};

// --- API Endpoints ---

// Check server status
app.get('/api/status', (req, res) => {
  res.json({ online: true, message: 'Secure Backend Server is active.' });
});

// Admin credentials routes
app.get('/api/admin/credentials', (req, res) => {
  const admin = getAdmin();
  res.json({ email: admin.email, name: admin.name });
});

app.post('/api/admin/credentials', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }
  if (!email.endsWith('@dispatchnow.us') && !email.endsWith('@dispatchnow')) {
    return res.status(400).json({ success: false, error: 'Strict Security Rejection: Admin ID must end with @dispatchnow.us or @dispatchnow' });
  }
  updateAdmin(email, password);
  res.json({ success: true, message: 'Admin credentials updated successfully.' });
});

// Login check
app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, error: 'User ID and password are required.' });
  }

  const cleanId = identifier.trim().toLowerCase();

  // 1. Admin login check
  if (cleanId.endsWith('@dispatchnow') || cleanId.endsWith('@dispatchnow.us')) {
    const admin = getAdmin();
    if (cleanId === admin.email.toLowerCase()) {
      if (password === admin.password) {
        return res.json({ 
          success: true, 
          role: 'admin', 
          user: { email: admin.email, role: 'admin', name: admin.name } 
        });
      } else {
        return res.status(401).json({ success: false, error: 'Password incorrect.' });
      }
    }
    return res.status(401).json({ success: false, error: 'Administrator ID is not registered.' });
  }

  // 2. Carrier login check
  const carriers = getCarriers();
  const carrier = carriers.find(c => c.truckNumber && c.truckNumber.toLowerCase() === cleanId);
  
  if (carrier) {
    if (carrier.password !== password) {
      return res.status(401).json({ success: false, error: 'Password incorrect.' });
    }
    if (carrier.status !== 'approved') {
      if (carrier.status === 'suspended') {
        return res.status(403).json({ success: false, error: 'You are banned by admin. Contact admin.' });
      }
      return res.status(403).json({ success: false, error: 'Your application is under review. You can access your portal after approval of your application.' });
    }
    return res.json({
      success: true,
      role: 'carrier',
      user: { email: carrier.email, role: 'carrier', name: carrier.name, truckNumber: carrier.truckNumber }
    });
  }

  res.status(401).json({ success: false, error: 'Truck Plate Number is not registered.' });
});

// Reset password route
app.post('/api/auth/reset-password', (req, res) => {
  const { truckNumber, newPassword } = req.body;
  if (!truckNumber || !newPassword) {
    return res.status(400).json({ success: false, error: 'Truck plate and password are required.' });
  }
  const result = resetCarrierPassword(truckNumber, newPassword);
  res.json(result);
});

// Carriers routes
app.get('/api/carriers', (req, res) => {
  res.json(getCarriers());
});

app.post('/api/carriers/register', (req, res) => {
  const result = addCarrier(req.body);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.put('/api/carriers/:email/status', (req, res) => {
  const { status } = req.body;
  const result = updateCarrierStatus(req.params.email, status);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// Orders routes
app.get('/api/orders', (req, res) => {
  res.json(getOrders());
});

app.post('/api/orders', (req, res) => {
  const result = addOrder(req.body);
  res.json(result);
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status, details } = req.body;
  const result = updateOrderStatus(req.params.id, status, details);
  res.json(result);
});

app.put('/api/orders/:id/payment', (req, res) => {
  const { paymentStatus } = req.body;
  const result = updatePaymentStatus(req.params.id, paymentStatus);
  res.json(result);
});

// Secure Document upload route (Encodes to Base64 and writes directly to local database.json)
app.post('/api/upload', upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded.' });
    }

    const filePath = req.file.path;
    const detectedMime = verifyMagicBytes(filePath);

    if (!detectedMime) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ success: false, error: 'Security Rejection: File signature check failed. Executables masked as files are prohibited.' });
    }

    // Read temp file data, convert to base64, and save directly in local JSON database
    const fileBuffer = fs.readFileSync(filePath);
    saveDocument(req.file.filename, fileBuffer, detectedMime);

    // Hardened safety step: delete the temp file from disk immediately
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      filename: req.file.filename,
      mimeType: detectedMime
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve documents dynamically from the local JSON database (Decodes Base64 buffer)
app.get('/api/documents/:filename', (req, res) => {
  try {
    const doc = getDocument(req.params.filename);
    if (!doc) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    // Decode Base64 back to binary buffer
    const buffer = Buffer.from(doc.data, 'base64');

    // Secure serving headers (prevents script execution)
    res.setHeader('Content-Type', doc.mimeType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox;");

    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// System database wipe route
app.post('/api/reset', (req, res) => {
  const result = clearDatabase();
  res.json(result);
});

// Serve static uploads safely
app.use('/uploads', (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox;");
  next();
}, express.static(UPLOADS_DIR));

// Fallback for React routing (Single Page Application)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexFile = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.send(`
      <div style="font-family: sans-serif; text-align: center; background: #0a0a0a; color: #ffffff; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 0; box-sizing: border-box; border-top: 4px solid #0f5bbf;">
        <h1 style="color: #0f5bbf; font-size: 32px; font-weight: 800; margin: 0 0 12px 0; letter-spacing: -0.5px;">DISPATCH NOW</h1>
        <p style="color: #888888; font-size: 16px; margin: 0 0 24px 0; max-width: 480px; line-height: 1.5;">The secure API and database server is active and running successfully in integration mode.</p>
        <div style="padding: 12px 24px; background: #111111; border: 1px solid #222222; border-radius: 8px; font-family: monospace; font-size: 14px; color: #22c55e;">
          ● API Status: ONLINE (Port ${PORT})
        </div>
        <p style="color: #555555; font-size: 12px; margin-top: 32px;">Please access your driver/admin dashboard via the React port (3000 or 5173).</p>
      </div>
    `);
  }
});

// Error handler
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`[SECURE API SERVER] Running on http://localhost:${PORT}`);
});
