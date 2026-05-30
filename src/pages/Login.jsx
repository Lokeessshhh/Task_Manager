import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/board');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>tasks.</h1>
        <p className={styles.quote}>"The secret of getting ahead is getting started."</p>
      </div>
      
      <div className={styles.formSection}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.title}>Login</h2>
          
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input 
              type="email" 
              className={styles.input} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                className={styles.input} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button 
                type="button" 
                className={styles.toggleBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className={styles.switch}>
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
