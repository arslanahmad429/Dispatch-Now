import { useState } from 'react';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { Mail, Phone } from 'lucide-react';
import styles from './CustomersList.module.css';

const MOCK_CUSTOMERS = [
  { name: "Alex Johnson", company: "ACME Industrial", email: "alex.johnson@acme.com", phone: "(555) 123-4567", orders: 12, spend: 38400, status: "active" },
  { name: "Sarah Mitchell", company: "Fresh Foods Inc", email: "sarah.mitchell@freshfoods.com", phone: "(555) 987-6543", orders: 4, spend: 20400, status: "active" },
  { name: "David Miller", company: "Apex Retail Group", email: "david.miller@apexretail.com", phone: "(555) 444-2222", orders: 8, spend: 29800, status: "active" },
  { name: "Lisa Thompson", company: "Texaco Equipment Parts", email: "lisa.thompson@texacoparts.com", phone: "(555) 888-0909", orders: 1, spend: 1050, status: "active" }
];

export default function CustomersList() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);

  const columns = [
    { key: 'company', label: 'Company / Shipper', sortable: true },
    { key: 'name', label: 'Primary Contact', sortable: true },
    { key: 'email', label: 'Email', render: (val) => (
      <a href={`mailto:${val}`} className={styles.contactLink}><Mail size={14} /> {val}</a>
    )},
    { key: 'phone', label: 'Phone' },
    { key: 'orders', label: 'Loads Booked', sortable: true },
    { key: 'spend', label: 'Total Logistics Spend', sortable: true, render: (val) => `$${val.toLocaleString()}` },
    { key: 'status', label: 'Account Status', render: (val) => <StatusBadge status={val} /> }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Registered Shippers</h2>
        <p>Monitor customer accounts, review booking metrics, and track billing limits.</p>
      </div>

      <div className={styles.card}>
        <DataTable columns={columns} data={customers} />
      </div>
    </div>
  );
}
