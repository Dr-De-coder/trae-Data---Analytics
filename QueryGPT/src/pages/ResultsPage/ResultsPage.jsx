import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Download, Share2, BarChart2, ArrowLeft } from 'lucide-react';
import Card from '../../components/Card/Card';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import styles from './ResultsPage.module.css';

const ResultsPage = () => {
  const location = useLocation();
  const query = location.state?.query || "Show me the top 5 users by revenue this month";

  // Mock data
  const generatedSql = `SELECT 
  u.id, 
  u.name, 
  u.email, 
  SUM(t.amount) as total_revenue
FROM users u
JOIN transactions t ON u.id = t.user_id
WHERE t.created_at >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY u.id, u.name, u.email
ORDER BY total_revenue DESC
LIMIT 5;`;

  const headers = ['ID', 'Name', 'Email', 'Total Revenue'];
  const data = [
    { id: 'usr_101', name: 'Alice Smith', email: 'alice@example.com', 'total revenue': '$12,450.00' },
    { id: 'usr_245', name: 'Bob Jones', email: 'bob@example.com', 'total revenue': '$9,820.00' },
    { id: 'usr_892', name: 'Charlie Davis', email: 'charlie@example.com', 'total revenue': '$8,100.50' },
    { id: 'usr_034', name: 'Diana Evans', email: 'diana@example.com', 'total revenue': '$7,640.00' },
    { id: 'usr_567', name: 'Ethan White', email: 'ethan@example.com', 'total revenue': '$6,200.00' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/query" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Query
        </Link>
        <div className={styles.headerActions}>
          <Button variant="secondary" icon={Share2}>Share</Button>
          <Button variant="primary" icon={Download}>Export CSV</Button>
        </div>
      </div>

      <motion.div 
        className={styles.content}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.querySummary}>
          <h1 className={styles.queryText}>"{query}"</h1>
        </div>

        <div className={styles.grid}>
          <div className={styles.mainColumn}>
            <Card delay={0.1} className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <TableIcon size={18} />
                <h2>Results ({data.length} rows)</h2>
              </div>
              <Table headers={headers} data={data} />
            </Card>

            <Card delay={0.2} className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <BarChart2 size={18} />
                <h2>Visualization</h2>
              </div>
              <div className={styles.chartPlaceholder}>
                <div className={styles.bars}>
                  <div className={styles.bar} style={{ height: '100%' }}></div>
                  <div className={styles.bar} style={{ height: '80%' }}></div>
                  <div className={styles.bar} style={{ height: '65%' }}></div>
                  <div className={styles.bar} style={{ height: '60%' }}></div>
                  <div className={styles.bar} style={{ height: '50%' }}></div>
                </div>
              </div>
            </Card>
          </div>

          <div className={styles.sideColumn}>
            <Card delay={0.3} className={styles.sqlCard}>
              <div className={styles.sectionHeader}>
                <Terminal size={18} />
                <h2>Generated SQL</h2>
              </div>
              <pre className={styles.codeBlock}>
                <code>{generatedSql}</code>
              </pre>
              <div className={styles.sqlActions}>
                <Button variant="secondary" className={styles.fullWidthBtn}>Copy SQL</Button>
              </div>
            </Card>

            <Card delay={0.4} className={styles.infoCard}>
              <h3>Execution Details</h3>
              <ul className={styles.detailsList}>
                <li>
                  <span className={styles.label}>Time</span>
                  <span className={styles.value}>142ms</span>
                </li>
                <li>
                  <span className={styles.label}>Rows scanned</span>
                  <span className={styles.value}>1.2M</span>
                </li>
                <li>
                  <span className={styles.label}>Database</span>
                  <span className={styles.value}>Production_DB</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsPage;
