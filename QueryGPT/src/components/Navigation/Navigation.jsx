import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import Button from '../Button/Button';
import styles from './Navigation.module.css';

const Navigation = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/query', label: 'Query' },
    { path: '/history', label: 'History' }
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <Database className={styles.logoIcon} />
          <span className={styles.logoText}>QueryGPT</span>
        </Link>
        
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className={`${styles.navLink} ${location.pathname === link.path ? styles.active : ''}`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className={styles.activeIndicator}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Link to="/query">
            <Button variant="primary">New Query</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
