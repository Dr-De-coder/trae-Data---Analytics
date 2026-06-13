import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, Play, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import styles from './HistoryPage.module.css';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const historyData = [
    { id: 1, query: "Show me the top 5 users by revenue this month", date: "2 hours ago", status: "success", rows: 5 },
    { id: 2, query: "What is the average session duration by device type?", date: "Yesterday", status: "success", rows: 3 },
    { id: 3, query: "Count the number of active users in the last 7 days", date: "Yesterday", status: "success", rows: 1 },
    { id: 4, query: "List all failed transactions from yesterday", date: "3 days ago", status: "success", rows: 42 },
    { id: 5, query: "Get user churn rate for Q1", date: "Last week", status: "error", rows: 0 },
    { id: 6, query: "Compare sales between region A and B", date: "Last week", status: "success", rows: 12 }
  ];

  const filteredHistory = historyData.filter(item => 
    item.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRunAgain = (query) => {
    navigate('/results', { state: { query } });
  };

  return (
    <div className={styles.page}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={styles.title}>Query History</h1>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={18} />
          <input 
            type="text" 
            className={styles.searchInput}
            placeholder="Search past queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      <div className={styles.historyList}>
        {filteredHistory.map((item, index) => (
          <Card 
            key={item.id} 
            delay={index * 0.05} 
            className={styles.historyCard}
            hover={false}
          >
            <div className={styles.cardMain}>
              <div className={styles.cardHeader}>
                <span className={styles.timeInfo}>
                  <Clock size={14} /> {item.date}
                </span>
                <div className={styles.statusBadge} data-status={item.status}>
                  {item.status === 'success' ? `${item.rows} rows` : 'Failed'}
                </div>
              </div>
              <h3 className={styles.queryText}>{item.query}</h3>
            </div>
            
            <div className={styles.cardActions}>
              <Button 
                variant="secondary" 
                icon={Play}
                onClick={() => handleRunAgain(item.query)}
              >
                Run Again
              </Button>
              <button className={styles.iconBtn}>
                <MoreVertical size={18} />
              </button>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredHistory.length === 0 && (
        <div className={styles.emptyState}>
          <p>No queries found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
