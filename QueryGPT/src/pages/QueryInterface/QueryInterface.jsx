import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Terminal, Table as TableIcon } from 'lucide-react';
import InputBox from '../../components/InputBox/InputBox';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import styles from './QueryInterface.module.css';

const QueryInterface = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recentQueries = [
    "Show me the top 5 users by revenue this month",
    "What is the average session duration by device type?",
    "Count the number of active users in the last 7 days",
    "List all failed transactions from yesterday"
  ];

  const handleQuerySubmit = (query) => {
    setIsProcessing(true);
    // Simulate API call and redirect
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/results', { state: { query } });
    }, 1500);
  };

  return (
    <div className={styles.page}>
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.header}>
          <h1 className={styles.title}>What would you like to know?</h1>
          <p className={styles.subtitle}>Ask questions in plain English, and we'll generate the SQL.</p>
        </div>

        <div className={styles.inputSection}>
          <InputBox 
            onSubmit={handleQuerySubmit} 
            placeholder="e.g. Show me the top 5 users by revenue this month..." 
          />
          
          <AnimatePresence>
            {isProcessing && (
              <motion.div 
                className={styles.processingIndicator}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className={styles.spinner} />
                <span>Generating SQL and executing query...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.suggestionsSection}>
          <h2 className={styles.sectionTitle}>
            <Clock size={18} className={styles.icon} />
            Recent Queries
          </h2>
          <div className={styles.grid}>
            {recentQueries.map((query, index) => (
              <Card key={index} delay={index * 0.1} className={styles.suggestionCard}>
                <button 
                  className={styles.suggestionBtn}
                  onClick={() => handleQuerySubmit(query)}
                >
                  {query}
                </button>
              </Card>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default QueryInterface;
