import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHabits, getStats } from '../services/api';
import { FaWater, FaBolt, FaBus, FaRecycle, FaUtensils, FaTrash, FaFire, FaLeaf } from 'react-icons/fa';

const categoryIcons = {
  water: <FaWater />,
  energy: <FaBolt />,
  transport: <FaBus />,
  plastic: <FaTrash />,
  food: <FaUtensils />,
  recycling: <FaRecycle />
};

const categoryColors = {
  water: '#2196F3',
  energy: '#FF9800',
  transport: '#9C27B0',
  plastic: '#F44336',
  food: '#4CAF50',
  recycling: '#00BCD4'
};

const Dashboard = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [habitsRes, statsRes] = await Promise.all([getHabits(), getStats()]);
      setHabits(habitsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>🌱 Loading your green data...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Welcome Section */}
      <div style={styles.welcomeCard}>
        <div>
          <h1 style={styles.welcomeTitle}>Welcome back, {user?.name}! 🌿</h1>
          <p style={styles.welcomeText}>Keep up the great work in building sustainable habits</p>
        </div>
        <div style={styles.welcomeScore}>
          <FaLeaf style={{ fontSize: '2rem' }} />
          <div>
            <div style={styles.scoreNumber}>{stats?.totalImpact?.toFixed(1) || 0}</div>
            <div style={styles.scoreLabel}>Impact Score</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #4CAF50' }}>
          <div style={styles.statIcon}>🌱</div>
          <div style={styles.statNumber}>{habits.length}</div>
          <div style={styles.statLabel}>Active Habits</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #2196F3' }}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statNumber}>{stats?.totalLogs || 0}</div>
          <div style={styles.statLabel}>Total Logs</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #FF9800' }}>
          <div style={styles.statIcon}>🔥</div>
          <div style={styles.statNumber}>
            {habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0}
          </div>
          <div style={styles.statLabel}>Best Streak</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #9C27B0' }}>
          <div style={styles.statIcon}>🏆</div>
          <div style={styles.statNumber}>
            {stats?.categoryStats ? Object.keys(stats.categoryStats).length : 0}
          </div>
          <div style={styles.statLabel}>Categories</div>
        </div>
      </div>

      {/* 7-Day Activity */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📅 Last 7 Days Activity</h2>
        <div style={styles.chartContainer}>
          {stats?.last7Days?.map((day, index) => (
            <div key={index} style={styles.barWrapper}>
              <div style={styles.barValue}>{day.count}</div>
              <div style={{
                ...styles.bar,
                height: `${Math.max(day.count * 30, 8)}px`,
                background: day.count > 0
                  ? 'linear-gradient(to top, #1a5c2e, #4CAF50)'
                  : '#e0e0e0'
              }} />
              <div style={styles.barLabel}>
                {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      {stats?.categoryStats && Object.keys(stats.categoryStats).length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📊 Category Breakdown</h2>
          <div style={styles.categoryGrid}>
            {Object.entries(stats.categoryStats).map(([cat, data]) => (
              <div key={cat} style={{
                ...styles.categoryCard,
                borderTop: `4px solid ${categoryColors[cat] || '#4CAF50'}`
              }}>
                <div style={{ ...styles.categoryIcon, color: categoryColors[cat] || '#4CAF50' }}>
                  {categoryIcons[cat]}
                </div>
                <h3 style={styles.categoryName}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
                <div style={styles.categoryCount}>{data.count} logs</div>
                <div style={styles.categoryImpact}>Impact: {data.totalImpact.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Habits Overview */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🌿 Your Habits</h2>
        {habits.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ fontSize: '3rem' }}>🌱</span>
            <p>No habits yet! Go to the Habits page to add your first eco-friendly habit.</p>
          </div>
        ) : (
          <div style={styles.habitsGrid}>
            {habits.map(habit => (
              <div key={habit._id} style={styles.habitCard}>
                <div style={{
                  ...styles.habitIcon,
                  background: categoryColors[habit.category] || '#4CAF50'
                }}>
                  {categoryIcons[habit.category]}
                </div>
                <div style={styles.habitInfo}>
                  <h3 style={styles.habitName}>{habit.name}</h3>
                  <p style={styles.habitCategory}>{habit.category}</p>
                </div>
                <div style={styles.habitStreak}>
                  <FaFire style={{ color: '#FF5722' }} />
                  <span>{habit.streak}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
    fontSize: '1.3rem',
    color: '#2d8f4e'
  },
  welcomeCard: {
    background: 'linear-gradient(135deg, #1a5c2e, #2d8f4e, #4CAF50)',
    color: 'white',
    padding: '35px',
    borderRadius: '16px',
    marginBottom: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 8px 25px rgba(45,143,78,0.3)'
  },
  welcomeTitle: {
    fontSize: '1.8rem',
    marginBottom: '8px'
  },
  welcomeText: {
    opacity: 0.9,
    fontSize: '1rem'
  },
  welcomeScore: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    background: 'rgba(255,255,255,0.15)',
    padding: '20px 25px',
    borderRadius: '12px'
  },
  scoreNumber: {
    fontSize: '1.8rem',
    fontWeight: 'bold'
  },
  scoreLabel: {
    opacity: 0.8,
    fontSize: '0.85rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '18px',
    marginBottom: '25px'
  },
  statCard: {
    background: 'white',
    padding: '22px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    textAlign: 'center'
  },
  statIcon: {
    fontSize: '1.8rem',
    marginBottom: '8px'
  },
  statNumber: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1a5c2e'
  },
  statLabel: {
    color: '#888',
    fontSize: '0.85rem',
    marginTop: '4px'
  },
  section: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    color: '#1a5c2e',
    marginBottom: '20px'
  },
  chartContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '200px',
    padding: '20px 0'
  },
  barWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  barValue: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#333'
  },
  bar: {
    width: '40px',
    borderRadius: '6px 6px 0 0',
    transition: 'height 0.3s'
  },
  barLabel: {
    fontSize: '0.8rem',
    color: '#666'
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '15px'
  },
  categoryCard: {
    background: '#f8fdf5',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center'
  },
  categoryIcon: {
    fontSize: '2rem',
    marginBottom: '8px'
  },
  categoryName: {
    fontSize: '1rem',
    color: '#333',
    marginBottom: '5px'
  },
  categoryCount: {
    fontSize: '0.85rem',
    color: '#666'
  },
  categoryImpact: {
    fontSize: '0.8rem',
    color: '#2d8f4e',
    fontWeight: 'bold',
    marginTop: '4px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#888'
  },
  habitsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  habitCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: '#f8fdf5',
    borderRadius: '10px',
    transition: 'transform 0.2s'
  },
  habitIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.1rem'
  },
  habitInfo: {
    flex: 1
  },
  habitName: {
    fontSize: '1rem',
    color: '#333',
    marginBottom: '2px'
  },
  habitCategory: {
    fontSize: '0.8rem',
    color: '#888',
    textTransform: 'capitalize'
  },
  habitStreak: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#333'
  }
};

export default Dashboard;