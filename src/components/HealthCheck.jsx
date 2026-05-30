import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import styles from './Navbar.module.css';

const HealthCheck = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'live', 'waking'

  const checkHealth = async () => {
    try {
      const start = Date.now();
      await api.get('/health');
      const duration = Date.now() - start;
      
      // If it takes more than 3 seconds, it was likely a cold start waking up
      if (duration > 3000) {
        setStatus('live');
      } else {
        setStatus('live');
      }
    } catch (err) {
      setStatus('waking');
      // Retry every 5 seconds if down
      setTimeout(checkHealth, 5000);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className={styles.healthStatus}>
      <span className={`${styles.indicator} ${styles[status]}`}></span>
      <span className={styles.healthText}>
        {status === 'checking' && 'Checking...'}
        {status === 'live' && 'Backend Live'}
        {status === 'waking' && 'Waking Server...'}
      </span>
    </div>
  );
};

export default HealthCheck;
