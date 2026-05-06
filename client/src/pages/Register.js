import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';
import { FaLeaf, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await registerUser({ name, email, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <FaLeaf style={styles.bigIcon} />
          <h1 style={styles.leftTitle}>Join GreenHabits</h1>
          <p style={styles.leftText}>Start your sustainable journey today. Every small action counts towards a greener planet.</p>
          <div style={styles.impactBox}>
            <h3>🌍 Did you know?</h3>
            <p>If everyone reduced shower time by 2 minutes, we'd save 5 billion gallons of water daily!</p>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Create Account 🌿</h2>
          <p style={styles.subtitle}>Join thousands making a difference</p>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.inputGroup}>
            <FaUser style={styles.inputIcon} />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <FaEnvelope style={styles.inputIcon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <FaLock style={styles.inputIcon} />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              minLength={6}
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating Account...' : 'Start Green Journey 🌱'}
          </button>

          <p style={styles.switchText}>
            Already have an account? <Link to="/login" style={styles.switchLink}>Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #0d3b1e, #1a6b35, #27a84b)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px'
  },
  leftContent: {
    color: 'white',
    textAlign: 'center',
    maxWidth: '400px'
  },
  bigIcon: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  leftTitle: {
    fontSize: '2.2rem',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  leftText: {
    fontSize: '1.05rem',
    opacity: 0.9,
    lineHeight: '1.6',
    marginBottom: '30px'
  },
  impactBox: {
    background: 'rgba(255,255,255,0.12)',
    padding: '20px',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    textAlign: 'left',
    lineHeight: '1.5'
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    background: '#f8fdf5'
  },
  form: {
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    fontSize: '2rem',
    color: '#1a5c2e',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#666',
    marginBottom: '30px',
    fontSize: '0.95rem'
  },
  error: {
    background: '#ffe8e8',
    color: '#d32f2f',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '0.9rem',
    border: '1px solid #ffcdd2'
  },
  inputGroup: {
    position: 'relative',
    marginBottom: '18px'
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#2d8f4e',
    fontSize: '1rem'
  },
  input: {
    width: '100%',
    padding: '14px 14px 14px 42px',
    border: '2px solid #e0e8d8',
    borderRadius: '10px',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'white'
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #1a5c2e, #2d8f4e)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.05rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 15px rgba(45,143,78,0.3)'
  },
  switchText: {
    textAlign: 'center',
    marginTop: '25px',
    color: '#666',
    fontSize: '0.9rem'
  },
  switchLink: {
    color: '#2d8f4e',
    fontWeight: 'bold',
    textDecoration: 'none'
  }
};

export default Register;