import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Database, Zap, Shield, Search, ArrowRight } from 'lucide-react';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import styles from './LandingPage.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
};

const LandingPage = () => {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className={styles.pill}>
            <span className={styles.pillText}>Introducing QueryGPT 2.0</span>
          </motion.div>
          <motion.h1 variants={itemVariants} className={styles.title}>
            Chat with your database. <br />
            <span className={styles.textGradient}>No SQL required.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className={styles.subtitle}>
            QueryGPT converts natural language into complex SQL queries, executes them instantly, and visualizes the results. Built for modern data teams.
          </motion.p>
          <motion.div variants={itemVariants} className={styles.ctaGroup}>
            <Link to="/query">
              <Button variant="primary" icon={ArrowRight}>Start Querying</Button>
            </Link>
            <Button variant="secondary">View Documentation</Button>
          </motion.div>
        </motion.div>

        {/* Simple Abstract Illustration Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={styles.illustration}
        >
          <div className={styles.mockup}>
            <div className={styles.mockupHeader}>
              <div className={styles.dot} />
              <div className={styles.dot} />
              <div className={styles.dot} />
            </div>
            <div className={styles.mockupBody}>
              <div className={styles.mockupChat}>Show me top 5 users by revenue this month</div>
              <div className={styles.mockupSql}>SELECT * FROM users ORDER BY revenue DESC LIMIT 5</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2>Enterprise-grade Analytics</h2>
          <p>Everything you need to understand your data instantly.</p>
        </div>
        
        <div className={styles.grid}>
          <Card delay={0.1}>
            <Zap className={styles.featureIcon} size={24} />
            <h3>Lightning Fast</h3>
            <p>Answers delivered in milliseconds, no matter the size of your dataset.</p>
          </Card>
          <Card delay={0.2}>
            <Shield className={styles.featureIcon} size={24} />
            <h3>Secure by Design</h3>
            <p>Your data never leaves your infrastructure. Enterprise-grade compliance built-in.</p>
          </Card>
          <Card delay={0.3}>
            <Search className={styles.featureIcon} size={24} />
            <h3>Deep Insights</h3>
            <p>Discover patterns and anomalies that traditional BI tools miss.</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <Database size={20} />
            <span>QueryGPT</span>
          </div>
          <p className={styles.copyright}>© 2026 QueryGPT Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
