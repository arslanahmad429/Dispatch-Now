const INITIAL_CARRIERS = [
  {
    id: "CAR-9281",
    firstName: "Marcus",
    lastName: "Williams",
    name: "Marcus Williams",
    email: "carrier@dispatchnow.com",
    phone: "(555) 987-6543",
    mcNumber: "MC-928103",
    dotNumber: "DOT-817293",
    equipment: "flatbed",
    carrierType: "solo",
    status: "approved",
    joinedDate: "2026-06-01"
  },
  {
    id: "CAR-7193",
    firstName: "John",
    lastName: "Doe",
    name: "John Doe",
    email: "john@jdexpress.com",
    phone: "(555) 456-7890",
    mcNumber: "MC-719329",
    dotNumber: "DOT-192837",
    equipment: "dry-van",
    carrierType: "fleet",
    status: "pending",
    joinedDate: "2026-06-03"
  },
  {
    id: "CAR-3012",
    firstName: "Robert",
    lastName: "Taylor",
    name: "Robert Taylor",
    email: "robert@titanheavy.com",
    phone: "(555) 123-4567",
    mcNumber: "MC-301284",
    dotNumber: "DOT-382910",
    equipment: "reefer",
    carrierType: "solo",
    status: "approved",
    joinedDate: "2026-06-04"
  }
];

const INITIAL_ORDERS = [
  {
    id: "ORD-9281",
    customer: "ACME Industrial",
    equipment: "Flatbed",
    pickup: "Houston, TX",
    delivery: "Denver, CO",
    date: "2026-06-05",
    rate: 3800,
    status: "dispatched",
    carrier: "Marcus Williams",
    carrierEmail: "carrier@dispatchnow.com",
    dispatcher: "Sarah Mitchell",
    weight: "42,000 lbs",
    commodity: "Steel Pipes",
    eta: "2026-06-06 14:00",
    paymentStatus: "unpaid",
    dispatchFee: 304, // 8% of 3800
    driverPayout: 3496,
    history: [
      { status: "pending", time: "2026-06-03 09:00", note: "Order placed manually by admin" },
      { status: "dispatched", time: "2026-06-03 14:00", note: "Carrier Marcus Williams accepted the dispatch" }
    ]
  },
  {
    id: "ORD-7193",
    customer: "Apex Retail",
    equipment: "Dry Van",
    pickup: "Chicago, IL",
    delivery: "Los Angeles, CA",
    date: "2026-06-06",
    rate: 6200,
    status: "in-transit",
    carrier: "John Doe",
    carrierEmail: "john@jdexpress.com",
    dispatcher: "Sarah Mitchell",
    weight: "38,500 lbs",
    commodity: "General Merchandise",
    eta: "2026-06-08 18:30",
    paymentStatus: "unpaid",
    dispatchFee: 372, // 6% of 6200 (fleet)
    driverPayout: 5828,
    history: [
      { status: "pending", time: "2026-06-02 08:00", note: "Order placed manually by admin" },
      { status: "dispatched", time: "2026-06-02 12:00", note: "Carrier John Doe accepted the dispatch" },
      { status: "in-transit", time: "2026-06-03 06:00", note: "Driver loaded, in transit" }
    ]
  },
  {
    id: "ORD-4491",
    customer: "Texaco Parts",
    equipment: "Hotshot",
    pickup: "Dallas, TX",
    delivery: "Oklahoma City, OK",
    date: "2026-06-04",
    rate: 1050,
    status: "delivered",
    carrier: "Marcus Williams",
    carrierEmail: "carrier@dispatchnow.com",
    dispatcher: "Sarah Mitchell",
    weight: "8,000 lbs",
    commodity: "Drill Pipes",
    eta: "Delivered",
    paymentStatus: "paid",
    dispatchFee: 84, // 8% of 1050
    driverPayout: 966,
    bolUrl: "mock_bol.jpg",
    deliveryPhotoUrl: "mock_delivered.jpg",
    history: [
      { status: "pending", time: "2026-06-01 10:00", note: "Order placed" },
      { status: "dispatched", time: "2026-06-01 12:00", note: "Carrier accepted" },
      { status: "in-transit", time: "2026-06-02 08:00", note: "In transit" },
      { status: "delivered", time: "2026-06-02 15:30", note: "Unloaded, proof of delivery uploaded" }
    ]
  }
];

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
  
  if (db.carriers.some(c => c.email.toLowerCase() === emailLower)) {
    return { success: false, error: "Email already registered" };
  }

  const newCarrier = {
    id: `CAR-${Math.floor(1000 + Math.random() * 9000)}`,
    firstName: carrierData.firstName,
    lastName: carrierData.lastName,
    name: `${carrierData.firstName} ${carrierData.lastName}`,
    email: emailLower,
    phone: carrierData.phone,
    mcNumber: carrierData.mcNumber.startsWith("MC-") ? carrierData.mcNumber : `MC-${carrierData.mcNumber}`,
    dotNumber: carrierData.dotNumber ? (carrierData.dotNumber.startsWith("DOT-") ? carrierData.dotNumber : `DOT-${carrierData.dotNumber}`) : "N/A",
    equipment: carrierData.equipment,
    carrierType: carrierData.carrierType || "solo",
    password: carrierData.password, // Storing password for universal mock login
    status: "pending", // Default to pending until approved by admin
    joinedDate: new Date().toISOString().substring(0, 10)
  };

  db.carriers.push(newCarrier);
  saveMockDb(db);
  return { success: true, carrier: newCarrier };
}

// Approve or suspend a carrier
export function updateCarrierStatus(mcNumber, status) {
  const db = getMockDb();
  const carrier = db.carriers.find(c => c.mcNumber === mcNumber);
  if (!carrier) return { success: false, error: "Carrier not found" };

  carrier.status = status;
  saveMockDb(db);
  return { success: true, carrier };
}

// Add an order manually (Admin feature)
export function addOrder(orderData) {
  const db = getMockDb();
  
  // Find carrier to calculate service charge
  const carrier = db.carriers.find(c => c.email.toLowerCase() === orderData.carrierEmail.toLowerCase());
  const carrierType = carrier ? carrier.carrierType : "solo";
  const rate = Number(orderData.rate);
  const feePercent = carrierType === "fleet" ? 0.06 : 0.08;
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
    carrier: carrier ? carrier.name : orderData.carrierName || "Unknown",
    carrierEmail: orderData.carrierEmail.toLowerCase(),
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
        note: `Assigned and dispatched to carrier ${carrier ? carrier.name : orderData.carrierEmail}` 
      }
    ]
  };

  db.orders.unshift(newOrder);
  saveMockDb(db);
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
  return { success: true, order };
}
