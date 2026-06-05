import { useState } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import styles from './DataTable.module.css';

export default function DataTable({ columns, data, searchable = true, emptyText = 'No records found' }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  let rows = [...data];

  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(q))
    );
  }

  if (sortKey) {
    rows.sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const total = rows.length;
  const pages = Math.ceil(total / perPage);
  const paginated = rows.slice((page - 1) * perPage, page * perPage);

  return (
    <div className={styles.wrapper}>
      {searchable && (
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={16} />
            <input
              className={styles.search}
              placeholder="Search..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <span className={styles.count}>{total} record{total !== 1 ? 's' : ''}</span>
        </div>
      )}

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`${styles.th} ${col.sortable ? styles.sortable : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  {col.label}
                  {col.sortable && (
                    <span className={styles.sortIcons}>
                      <ChevronUp size={12} className={sortKey === col.key && sortDir === 'asc' ? styles.active : ''} />
                      <ChevronDown size={12} className={sortKey === col.key && sortDir === 'desc' ? styles.active : ''} />
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={columns.length} className={styles.empty}>{emptyText}</td></tr>
            ) : (
              paginated.map((row, i) => (
                <tr key={i} className={styles.tr}>
                  {columns.map(col => (
                    <td key={col.key} className={styles.td}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className={styles.pagination}>
          <button className={styles.pgBtn} onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Previous</button>
          <span className={styles.pgInfo}>Page {page} of {pages}</span>
          <button className={styles.pgBtn} onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages}>Next</button>
        </div>
      )}
    </div>
  );
}
