import React from 'react';
import { useAuthStore } from '../store/authStore';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>tasks.</div>
      <div className={styles.userSection}>
        <span className={styles.email}>{user?.email}</span>
        <button onClick={logout} className={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
