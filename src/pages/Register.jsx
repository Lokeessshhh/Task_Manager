import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import styles from './Register.module.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      toast.success('Account created!');
      navigate('/board');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>tasks.</h1>
        <p className={styles.quote}>"Productivity is never an accident. It is always the result of a commitment to excellence."</p>
      </div>
      
      <div className={styles.formSection}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.title}>Register</h2>
          
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
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className={styles.switch}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
