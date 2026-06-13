import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import styles from './InputBox.module.css';

const InputBox = ({ onSubmit, placeholder = "Ask anything about your data..." }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
      setQuery('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`${styles.container} ${isFocused ? styles.focused : ''}`}
    >
      <div className={styles.inputWrapper}>
        <Sparkles className={styles.icon} size={20} />
        <input
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <AnimatePresence>
          {query.trim() && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              type="submit"
              className={styles.submitBtn}
            >
              <ArrowRight size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
};

export default InputBox;
