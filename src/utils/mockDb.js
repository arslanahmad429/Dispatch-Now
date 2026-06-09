import { getApiUrl } from '../config';

const INITIAL_CARRIERS = [];

const INITIAL_ORDERS = [];


export function getMockDb() {
  const orders = localStorage.getItem("dn_orders");
  const carriers = localStorage.getItem("dn_carriers");

  if (!orders) {
    localStorage.setItem("dn_orders", JSON.stringify(INITIAL_ORDERS));
  }
  if (!carriers) {
    localStorage.setItem("dn_carriers", JSON.stringify(INITIAL_CARRIERS));
  }

  return {
    orders: orders ? JSON.parse(orders) : INITIAL_ORDERS,
    carriers: carriers ? JSON.parse(carriers) : INITIAL_CARRIERS
  };
}

export function getAdminCredentials() {
  const creds = localStorage.getItem("dn_admin_credentials");
  if (!creds) {
    const initial = {
      email: "admin@dispatchnow.us",
      password: "123@2607",
      name: "Sarah Mitchell"
    };
    localStorage.setItem("dn_admin_credentials", JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(creds);
}

export function updateAdminCredentials(email, password) {
  const creds = getAdminCredentials();
  creds.email = email;
  creds.password = password;
  localStorage.setItem("dn_admin_credentials", JSON.stringify(creds));
  
  // Background API Sync
  fetch(getApiUrl('/api/admin/credentials'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).catch(() => {});

  // Also sync the active user session if they are logged in as admin
  const user = localStorage.getItem("dn_user");
  if (user) {
    const userData = JSON.parse(user);
    if (userData.role === 'admin') {
      userData.email = email;
      localStorage.setItem("dn_user", JSON.stringify(userData));
    }
  }
  
  return { success: true };
}

export function saveMockDb(db) {
  localStorage.setItem("dn_orders", JSON.stringify(db.orders));
  localStorage.setItem("dn_carriers", JSON.stringify(db.carriers));
}

// Get all carriers
export function getCarriers() {
  const db = getMockDb();
  return db.carriers;
}

// Add a registered carrier
export function addCarrier(carrierData) {
  const db = getMockDb();
  const emailLower = carrierData.email.toLowerCase();
  
  // 1. Validate Email Uniqueness
  if (db.carriers.some(c => c.email.toLowerCase() === emailLower)) {
    return { success: false, error: "Email address is already registered." };
  }

  // 2. Validate Truck Plate Uniqueness
  const cleanTruck = carrierData.truckNumber.trim().toUpperCase();
  if (db.carriers.some(c => c.truckNumber.toUpperCase() === cleanTruck)) {
    return { success: false, error: `Truck plate number "${cleanTruck}" is already registered by another driver.` };
  }

  const newCarrier = {
    id: `CAR-${Math.floor(1000 + Math.random() * 9000)}`,
    firstName: carrierData.firstName,
    lastName: carrierData.lastName,
    name: `${carrierData.firstName} ${carrierData.lastName}`,
    email: emailLower,
    phone: carrierData.phone,
    truckNumber: cleanTruck,
    licenseNumber: carrierData.licenseNumber,
    equipment: carrierData.equipment,
    password: carrierData.password, // Storing password for universal mock login
    status: "pending", // Default to pending until approved by admin
    docs: carrierData.docs || {}, // Persistent document references
    joinedDate: new Date().toISOString().substring(0, 10)
  };

  db.carriers.push(newCarrier);
  saveMockDb(db);

  // Background API Sync
  fetch(getApiUrl('/api/carriers/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carrierData)
  }).catch(() => {});

  return { success: true, carrier: newCarrier };
}

// Approve or suspend a carrier
export function updateCarrierStatus(email, status) {
  const db = getMockDb();
  const carrier = db.carriers.find(c => c.email.toLowerCase() === email.toLowerCase());
  if (!carrier) return { success: false, error: "Carrier not found" };

  carrier.status = status;
  saveMockDb(db);

  // Background API Sync
  fetch(getApiUrl(`/api/carriers/${email}/status`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).catch(() => {});

  return { success: true, carrier };
}

// Add an order manually (Admin feature)
export function addOrder(orderData) {
  const db = getMockDb();
  
  const carrier = db.carriers.find(c => c.email.toLowerCase() === orderData.carrierEmail.toLowerCase());
  const rate = Number(orderData.rate);
  const feePercent = 0.08; // Flat 8% dispatch fee for all drivers
  const dispatchFee = Math.round(rate * feePercent);
  const driverPayout = rate - dispatchFee;

  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customer: orderData.customer,
    equipment: orderData.equipment,
    pickup: orderData.pickup,
    delivery: orderData.delivery,
    date: orderData.date,
    rate: rate,
    status: "dispatched",
    carrier: carrier ? (carrier.name || `${carrier.firstName || ''} ${carrier.lastName || ''}`.trim()) : orderData.carrierName || "Unknown",
    carrierEmail: orderData.carrierEmail.toLowerCase(),
    truckNumber: carrier ? carrier.truckNumber : "N/A",
    dispatcher: "Sarah Mitchell", // Default admin dispatcher
    weight: orderData.weight || "N/A",
    commodity: orderData.commodity || "General Freight",
    eta: "Calculating ETA",
    paymentStatus: "unpaid",
    dispatchFee: dispatchFee,
    driverPayout: driverPayout,
    history: [
      { 
        status: "pending", 
        time: new Date().toISOString().replace("T", " ").substring(0, 16), 
        note: "Order created manually by admin" 
      },
      { 
        status: "dispatched", 
        time: new Date().toISOString().replace("T", " ").substring(0, 16), 
        note: `Assigned and dispatched to carrier ${carrier ? carrier.name : orderData.carrierEmail} driving truck ${carrier ? carrier.truckNumber : 'N/A'}` 
      }
    ]
  };

  db.orders.unshift(newOrder);
  saveMockDb(db);

  // Background API Sync
  fetch(getApiUrl('/api/orders'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  }).catch(() => {});

  return { success: true, order: newOrder };
}

// Update order status manually
export function updateOrderStatus(orderId, status, details = {}) {
  const db = getMockDb();
  const order = db.orders.find(o => o.id === orderId);
  if (!order) return { success: false, error: "Order not found" };

  order.status = status;
  if (details.bolUrl) order.bolUrl = details.bolUrl;
  if (details.deliveryPhotoUrl) order.deliveryPhotoUrl = details.deliveryPhotoUrl;
  
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
  order.history.push({
    status: status,
    time: timestamp,
    note: details.note || `Status updated to ${status} by ${details.by || 'admin'}`
  });

  saveMockDb(db);

  // Background API Sync
  fetch(getApiUrl(`/api/orders/${orderId}/status`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, details })
  }).catch(() => {});

  return { success: true, order };
}

// Release payment manually (Admin feature)
export function updatePaymentStatus(orderId, paymentStatus) {
  const db = getMockDb();
  const order = db.orders.find(o => o.id === orderId);
  if (!order) return { success: false, error: "Order not found" };

  order.paymentStatus = paymentStatus;
  
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
  order.history.push({
    status: order.status,
    time: timestamp,
    note: `Factoring payment marked as ${paymentStatus} by administrator`
  });

  saveMockDb(db);

  // Background API Sync
  fetch(getApiUrl(`/api/orders/${orderId}/payment`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentStatus })
  }).catch(() => {});

  return { success: true, order };
}

// Reset a carrier's password by truckNumber
export function resetCarrierPassword(truckNumber, newPassword) {
  const db = getMockDb();
  const carrier = db.carriers.find(c => c.truckNumber && c.truckNumber.toLowerCase() === truckNumber.toLowerCase());
  if (!carrier) return { success: false, error: "Carrier not found" };

  carrier.password = newPassword;
  saveMockDb(db);

  // Background API Sync
  fetch(getApiUrl('/api/auth/reset-password'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ truckNumber, newPassword })
  }).catch(() => {});

  return { success: true, carrier };
}
