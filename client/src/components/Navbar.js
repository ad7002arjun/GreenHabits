import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLeaf, FaSignOutAlt, FaChartBar, FaListUl, FaHistory, FaHome } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>
        <FaLeaf style={styles.brandIcon} />
        <span>GreenHabits</span>
      </Link>

      {user && (
        <div style={styles.links}>
          <Link to="/dashboard" style={styles.link}>
            <FaHome /> <span>Dashboard</span>
          </Link>
          <Link to="/habits" style={styles.link}>
            <FaListUl /> <span>Habits</span>
          </Link>
          <Link to="/log" style={styles.link}>
            <FaHistory /> <span>Log</span>
          </Link>
          <Link to="/impact" style={styles.link}>
            <FaChartBar /> <span>Impact</span>
          </Link>
          <div style={styles.userSection}>
            <span style={styles.userName}>🌱 {user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    background: 'linear-gradient(135deg, #1a5c2e, #2d8f4e)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  brandIcon: {
    fontSize: '1.8rem'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  link: {
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '8px 14px',
    borderRadius: '8px',
    transition: 'all 0.3s',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginLeft: '15px',
    paddingLeft: '15px',
    borderLeft: '1px solid rgba(255,255,255,0.3)'
  },
  userName: {
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '8px 14px',
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.3s'
  }
};

export default Navbar;