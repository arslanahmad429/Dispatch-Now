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
    dispatcher: "Tom Richards",
    weight: "42,000 lbs",
    commodity: "Steel Pipes",
    eta: "2026-06-06 14:00",
    history: [
      { status: "pending", time: "2026-06-03 09:00", note: "Order placed by shipper" },
      { status: "assigned", time: "2026-06-03 11:30", note: "Assigned to dispatcher Tom Richards" },
      { status: "dispatched", time: "2026-06-03 14:00", note: "Carrier Marcus Williams accepted the load" }
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
    carrier: "Roadrunner Logistics",
    dispatcher: "Tom Richards",
    weight: "38,500 lbs",
    commodity: "General Merchandise",
    eta: "2026-06-08 18:30",
    history: [
      { status: "pending", time: "2026-06-02 08:00", note: "Order placed by shipper" },
      { status: "assigned", time: "2026-06-02 10:00", note: "Assigned to dispatcher Tom Richards" },
      { status: "dispatched", time: "2026-06-02 12:00", note: "Carrier Roadrunner Logistics accepted the load" },
      { status: "in-transit", time: "2026-06-03 06:00", note: "Driver checked in at pickup location, loaded" }
    ]
  },
  {
    id: "ORD-3012",
    customer: "Fresh Foods Inc",
    equipment: "Reefer",
    pickup: "Miami, FL",
    delivery: "New York, NY",
    date: "2026-06-08",
    rate: 5100,
    status: "pending",
    carrier: "",
    dispatcher: "",
    weight: "44,000 lbs",
    commodity: "Frozen Seafood",
    eta: "TBD",
    history: [
      { status: "pending", time: "2026-06-03 16:30", note: "Order placed by shipper" }
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
    dispatcher: "Tom Richards",
    weight: "8,000 lbs",
    commodity: "Drill Pipes",
    eta: "Delivered",
    bolUrl: "mock_bol.jpg",
    deliveryPhotoUrl: "mock_delivered.jpg",
    history: [
      { status: "pending", time: "2026-06-01 10:00", note: "Order placed" },
      { status: "assigned", time: "2026-06-01 11:00", note: "Assigned to dispatcher" },
      { status: "dispatched", time: "2026-06-01 12:00", note: "Carrier accepted" },
      { status: "in-transit", time: "2026-06-02 08:00", note: "Loaded and in transit" },
      { status: "delivered", time: "2026-06-02 15:30", note: "Unloaded, proof of delivery uploaded" }
    ]
  }
];

const INITIAL_AVAILABLE_LOADS = [
  { id: "LOD-101", pickup: "Houston, TX", delivery: "New Orleans, LA", rate: 1200, equipment: "Flatbed", distance: 348, date: "2026-06-05", weight: "40,000 lbs" },
  { id: "LOD-102", pickup: "Chicago, IL", delivery: "Detroit, MI", rate: 950, equipment: "Dry Van", distance: 280, date: "2026-06-06", weight: "32,000 lbs" },
  { id: "LOD-103", pickup: "Atlanta, GA", delivery: "Charlotte, NC", rate: 800, equipment: "Box Truck", distance: 245, date: "2026-06-05", weight: "9,000 lbs" },
  { id: "LOD-104", pickup: "Houston, TX", delivery: "Dallas, TX", rate: 750, equipment: "Flatbed", distance: 240, date: "2026-06-06", weight: "22,000 lbs" },
  { id: "LOD-105", pickup: "Seattle, WA", delivery: "Portland, OR", rate: 850, equipment: "Reefer", distance: 174, date: "2026-06-06", weight: "39,000 lbs" }
];

export function getMockDb() {
  const orders = localStorage.getItem("dn_orders");
  const availableLoads = localStorage.getItem("dn_available_loads");

  if (!orders) {
    localStorage.setItem("dn_orders", JSON.stringify(INITIAL_ORDERS));
  }
  if (!availableLoads) {
    localStorage.setItem("dn_available_loads", JSON.stringify(INITIAL_AVAILABLE_LOADS));
  }

  return {
    orders: orders ? JSON.parse(orders) : INITIAL_ORDERS,
    availableLoads: availableLoads ? JSON.parse(availableLoads) : INITIAL_AVAILABLE_LOADS
  };
}

export function saveMockDb(db) {
  localStorage.setItem("dn_orders", JSON.stringify(db.orders));
  localStorage.setItem("dn_available_loads", JSON.stringify(db.availableLoads));
}

export function addOrder(orderData) {
  const db = getMockDb();
  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "pending",
    carrier: "",
    dispatcher: "",
    eta: "TBD",
    history: [
      { status: "pending", time: new Date().toISOString().replace('T', ' ').substring(0, 16), note: "Order placed by shipper" }
    ],
    ...orderData
  };
  db.orders.unshift(newOrder);
  
  // Also push to available loads for carriers to see
  const newLoad = {
    id: `LOD-${Math.floor(100 + Math.random() * 900)}`,
    pickup: orderData.pickup,
    delivery: orderData.delivery,
    rate: orderData.rate,
    equipment: orderData.equipment,
    distance: Math.floor(100 + Math.random() * 1000),
    date: orderData.date,
    weight: orderData.weight
  };
  db.availableLoads.unshift(newLoad);
  
  saveMockDb(db);
  return newOrder;
}

export function carrierAcceptLoad(loadId, carrierName) {
  const db = getMockDb();
  const loadIndex = db.availableLoads.findIndex(l => l.id === loadId);
  if (loadIndex === -1) return { success: false };

  const load = db.availableLoads[loadIndex];
  db.availableLoads.splice(loadIndex, 1);

  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customer: "ACME Corp",
    equipment: load.equipment,
    pickup: load.pickup,
    delivery: load.delivery,
    date: load.date,
    rate: load.rate,
    status: "dispatched",
    carrier: carrierName,
    dispatcher: "Tom Richards",
    weight: load.weight,
    commodity: "General Freight",
    eta: "Calculating ETA",
    history: [
      { status: "pending", time: new Date().toISOString().replace('T', ' ').substring(0, 16), note: "Order matched from load board" },
      { status: "assigned", time: new Date().toISOString().replace('T', ' ').substring(0, 16), note: "Assigned to dispatcher Tom Richards" },
      { status: "dispatched", time: new Date().toISOString().replace('T', ' ').substring(0, 16), note: `Carrier ${carrierName} accepted the load` }
    ]
  };

  db.orders.unshift(newOrder);
  saveMockDb(db);
  return { success: true, order: newOrder };
}

export function updateOrderStatus(orderId, status, details = {}) {
  const db = getMockDb();
  const order = db.orders.find(o => o.id === orderId);
  if (!order) return { success: false };

  order.status = status;
  if (details.bolUrl) order.bolUrl = details.bolUrl;
  if (details.deliveryPhotoUrl) order.deliveryPhotoUrl = details.deliveryPhotoUrl;
  
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
  order.history.push({
    status: status,
    time: timestamp,
    note: details.note || `Status updated to ${status}`
  });

  saveMockDb(db);
  return { success: true, order };
}
