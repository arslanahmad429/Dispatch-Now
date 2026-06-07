import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure database directory and file exist
const initDb = () => {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const defaultDb = {
      carriers: [],
      orders: [],
      admin: {
        email: "admin@dispatchnow.us",
        password: "123@2607",
        name: "Sarah Mitchell"
      },
      documents: {} // Keyed by filename: { data: base64String, mimeType: string }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf8');
  }
};

const readDb = () => {
  initDb();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file:", err.message);
    return { carriers: [], orders: [], admin: {}, documents: {} };
  }
};

const writeDb = (data) => {
  initDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Error writing database file:", err.message);
    return false;
  }
};

export const saveDocument = (filename, fileBuffer, mimeType) => {
  const db = readDb();
  db.documents = db.documents || {};
  db.documents[filename] = {
    data: fileBuffer.toString('base64'),
    mimeType: mimeType
  };
  return writeDb(db);
};

export const getDocument = (filename) => {
  const db = readDb();
  db.documents = db.documents || {};
  return db.documents[filename] || null;
};

export const getAdmin = () => {
  return readDb().admin;
};

export const updateAdmin = (email, password) => {
  const db = readDb();
  db.admin.email = email;
  db.admin.password = password;
  writeDb(db);
  return { success: true };
};

export const getCarriers = () => {
  return readDb().carriers;
};

export const addCarrier = (carrier) => {
  const db = readDb();
  
  // Validate duplicate email
  if (db.carriers.some(c => c.email.toLowerCase() === carrier.email.toLowerCase())) {
    return { success: false, error: "Email address is already registered." };
  }
  
  // Validate duplicate truck plate
  if (db.carriers.some(c => c.truckNumber.toUpperCase() === carrier.truckNumber.toUpperCase())) {
    return { success: false, error: `Truck plate number "${carrier.truckNumber.toUpperCase()}" is already registered.` };
  }

  const newCarrier = {
    id: `CAR-${Math.floor(1000 + Math.random() * 9000)}`,
    ...carrier,
    truckNumber: carrier.truckNumber.toUpperCase(),
    status: "pending",
    joinedDate: new Date().toISOString().substring(0, 10)
  };
  
  db.carriers.push(newCarrier);
  writeDb(db);
  return { success: true, carrier: newCarrier };
};

export const updateCarrierStatus = (email, status) => {
  const db = readDb();
  const carrier = db.carriers.find(c => c.email.toLowerCase() === email.toLowerCase());
  if (!carrier) return { success: false, error: "Carrier not found" };
  
  carrier.status = status;
  writeDb(db);
  return { success: true, carrier };
};

export const getOrders = () => {
  return readDb().orders;
};

export const addOrder = (order) => {
  const db = readDb();
  const rate = Number(order.rate);
  const feePercent = 0.08;
  const dispatchFee = Math.round(rate * feePercent);
  const driverPayout = rate - dispatchFee;

  const carrier = db.carriers.find(c => c.email.toLowerCase() === order.carrierEmail.toLowerCase());

  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    ...order,
    rate,
    dispatchFee,
    driverPayout,
    status: "dispatched",
    carrier: carrier ? (carrier.name || `${carrier.firstName || ''} ${carrier.lastName || ''}`.trim()) : order.carrierName || "Unknown",
    truckNumber: carrier ? carrier.truckNumber : "N/A",
    dispatcher: "Sarah Mitchell",
    eta: "Calculating ETA",
    paymentStatus: "unpaid",
    history: [
      {
        status: "pending",
        time: new Date().toISOString().replace("T", " ").substring(0, 16),
        note: "Order created manually by admin"
      },
      {
        status: "dispatched",
        time: new Date().toISOString().replace("T", " ").substring(0, 16),
        note: `Assigned and dispatched to carrier ${carrier ? carrier.name : order.carrierEmail}`
      }
    ]
  };

  db.orders.unshift(newOrder);
  writeDb(db);
  return { success: true, order: newOrder };
};

export const updateOrderStatus = (orderId, status, details = {}) => {
  const db = readDb();
  const order = db.orders.find(o => o.id === orderId);
  if (!order) return { success: false, error: "Order not found" };

  order.status = status;
  if (details.bolUrl) order.bolUrl = details.bolUrl;
  if (details.deliveryPhotoUrl) order.deliveryPhotoUrl = details.deliveryPhotoUrl;
  
  order.history.push({
    status: status,
    time: new Date().toISOString().replace("T", " ").substring(0, 16),
    note: details.note || `Status updated to ${status} by admin`
  });

  writeDb(db);
  return { success: true, order };
};

export const updatePaymentStatus = (orderId, paymentStatus) => {
  const db = readDb();
  const order = db.orders.find(o => o.id === orderId);
  if (!order) return { success: false, error: "Order not found" };

  order.paymentStatus = paymentStatus;
  order.history.push({
    status: order.status,
    time: new Date().toISOString().replace("T", " ").substring(0, 16),
    note: `Factoring payment marked as ${paymentStatus} by administrator`
  });

  writeDb(db);
  return { success: true, order };
};

export const resetCarrierPassword = (truckNumber, newPassword) => {
  const db = readDb();
  const carrier = db.carriers.find(c => c.truckNumber.toLowerCase() === truckNumber.toLowerCase());
  if (!carrier) return { success: false, error: "Carrier not found" };

  carrier.password = newPassword;
  writeDb(db);
  return { success: true, carrier };
};

export const clearDatabase = () => {
  const cleanDb = {
    carriers: [],
    orders: [],
    admin: {
      email: "admin@dispatchnow.us",
      password: "123@2607",
      name: "Sarah Mitchell"
    },
    documents: {}
  };
  writeDb(cleanDb);
  return { success: true };
};
