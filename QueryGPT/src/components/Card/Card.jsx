import React from 'react';
import { motion } from 'framer-motion';
import styles from './Card.module.css';

const Card = ({ children, className = '', hover = true, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={`${styles.card} ${hover ? styles.hoverable : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
