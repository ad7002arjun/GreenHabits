import React, { useState, useEffect } from 'react';
import { getStats, getHabits } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaWater, FaBolt, FaBus, FaRecycle, FaUtensils, FaTrashAlt, FaTrophy, FaGlobeAmericas } from 'react-icons/fa';

const categoryColors = {
  water: '#2196F3',
  energy: '#FF9800',
  transport: '#9C27B0',
  plastic: '#F44336',
  food: '#4CAF50',
  recycling: '#00BCD4'
};

const categoryIcons = {
  water: <FaWater />,
  energy: <FaBolt />,
  transport: <FaBus />,
  plastic: <FaTrashAlt />,
  food: <FaUtensils />,
  recycling: <FaRecycle />
};

const ecoFacts = [
  "🌊 Saving 1 liter of water can keep a small plant alive for a week!",
  "⚡ Turning off one light bulb for 8 hours saves enough energy to charge a phone 5 times.",
  "🚲 Cycling 10km instead of driving saves about 2.5kg of CO₂ emissions.",
  "♻️ Recycling one aluminum can saves enough energy to run a TV for 3 hours.",
  "🌱 Going meatless for one day saves approximately 1,100 gallons of water.",
  "🛍️ A single reusable bag can replace 700 disposable plastic bags.",
  "🌍 If everyone composted, we could reduce landfill waste by 30%."
];

const Impact = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomFact, setRandomFact] = useState('');

  useEffect(() => {
    fetchData();
    setRandomFact(ecoFacts[Math.floor(Math.random() * ecoFacts.length)]);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, habitsRes] = await Promise.all([getStats(), getHabits()]);
      setStats(statsRes.data);
      setHabits(habitsRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevel = (impact) => {
    if (impact >= 500) return { name: 'Eco Champion', emoji: '🏆', color: '#FFD700' };
    if (impact >= 200) return { name: 'Green Warrior', emoji: '⚔️', color: '#4CAF50' };
    if (impact >= 100) return { name: 'Nature Friend', emoji: '🌿', color: '#8BC34A' };
    if (impact >= 50) return { name: 'Eco Starter', emoji: '🌱', color: '#CDDC39' };
    return { name: 'Beginner', emoji: '🌰', color: '#FF9800' };
  };

  const getNextLevel = (impact) => {
    if (impact >= 500) return null;
    if (impact >= 200) return { target: 500, name: 'Eco Champion' };
    if (impact >= 100) return { target: 200, name: 'Green Warrior' };
    if (impact >= 50) return { target: 100, name: 'Nature Friend' };
    return { target: 50, name: 'Eco Starter' };
  };

  if (loading) return <div style={styles.loading}>Loading impact data...</div>;

  const totalImpact = stats?.totalImpact || 0;
  const level = getLevel(totalImpact);
  const nextLevel = getNextLevel(totalImpact);
  const progressPercent = nextLevel
    ? Math.min((totalImpact / nextLevel.target) * 100, 100)
    : 100;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🌍 Environmental Impact</h1>
        <p style={styles.subtitle}>See how your habits are making a difference</p>
      </div>

      {/* Hero Impact Card */}
      <div style={styles.heroCard}>
        <div style={styles.heroLeft}>
          <div style={styles.levelBadge}>
            <span style={{ fontSize: '3rem' }}>{level.emoji}</span>
            <div>
              <div style={styles.levelName}>{level.name}</div>
              <div style={styles.levelUser}>{user?.name}</div>
            </div>
          </div>
          <div style={styles.impactNumber}>{totalImpact.toFixed(1)}</div>
          <div style={styles.impactLabel}>Total Impact Points</div>

          {nextLevel && (
            <div style={styles.progressSection}>
              <div style={styles.progressInfo}>
                <span>Progress to {nextLevel.name}</span>
                <span>{totalImpact.toFixed(0)} / {nextLevel.target}</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: `${progressPercent}%`
                }} />
              </div>
            </div>
          )}
        </div>
        <div style={styles.heroRight}>
          <FaGlobeAmericas style={styles.globeIcon} />
          <div style={styles.heroStats}>
            <div style={styles.heroStat}>
              <div style={styles.heroStatNum}>{stats?.totalLogs || 0}</div>
              <div style={styles.heroStatLabel}>Actions Taken</div>
            </div>
            <div style={styles.heroStat}>
              <div style={styles.heroStatNum}>{habits.length}</div>
              <div style={styles.heroStatLabel}>Active Habits</div>
            </div>
            <div style={styles.heroStat}>
              <div style={styles.heroStatNum}>
                {habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0}
              </div>
              <div style={styles.heroStatLabel}>Best Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Eco Fact */}
      <div style={styles.factCard}>
        <FaTrophy style={{ color: '#FFD700', fontSize: '1.3rem' }} />
        <span style={styles.factText}>{randomFact}</span>
      </div>

      {/* Category Impact Breakdown */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📊 Impact by Category</h2>
        {stats?.categoryStats && Object.keys(stats.categoryStats).length > 0 ? (
          <div style={styles.categoryGrid}>
            {Object.entries(stats.categoryStats).map(([cat, data]) => {
              const maxImpact = Math.max(...Object.values(stats.categoryStats).map(d => d.totalImpact));
              const barWidth = maxImpact > 0 ? (data.totalImpact / maxImpact) * 100 : 0;

              return (
                <div key={cat} style={styles.categoryRow}>
                  <div style={styles.categoryInfo}>
                    <div style={{
                      ...styles.catIcon,
                      background: categoryColors[cat]
                    }}>
                      {categoryIcons[cat]}
                    </div>
                    <div>
                      <div style={styles.catName}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </div>
                      <div style={styles.catMeta}>{data.count} actions logged</div>
                    </div>
                  </div>
                  <div style={styles.catBarContainer}>
                    <div style={{
                      ...styles.catBar,
                      width: `${barWidth}%`,
                      background: `linear-gradient(to right, ${categoryColors[cat]}88, ${categoryColors[cat]})`
                    }} />
                  </div>
                  <div style={styles.catImpact}>{data.totalImpact.toFixed(1)}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p>No impact data yet. Start logging your habits!</p>
          </div>
        )}
      </div>

      {/* Weekly Trend */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📈 Weekly Trend</h2>
        <div style={styles.weekGrid}>
          {stats?.last7Days?.map((day, index) => (
            <div key={index} style={styles.dayCard}>
              <div style={styles.dayName}>
                {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
              </div>
              <div style={styles.dayDate}>
                {new Date(day.date).getDate()}
              </div>
              <div style={{
                ...styles.dayCircle,
                background: day.count > 0
                  ? `linear-gradient(135deg, #1a5c2e, #4CAF50)`
                  : '#f0f0f0',
                color: day.count > 0 ? 'white' : '#ccc'
              }}>
                {day.count > 0 ? '✓' : '—'}
              </div>
              <div style={styles.dayCount}>{day.count} logs</div>
              <div style={styles.dayImpact}>{day.impact.toFixed(1)} pts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Real World Equivalents */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🌱 Your Impact In Real Terms</h2>
        <div style={styles.realWorldGrid}>
          <div style={styles.rwCard}>
            <span style={{ fontSize: '2.5rem' }}>🌳</span>
            <div style={styles.rwNumber}>{(totalImpact / 20).toFixed(1)}</div>
            <div style={styles.rwLabel}>Trees worth of CO₂ saved</div>
          </div>
          <div style={styles.rwCard}>
            <span style={{ fontSize: '2.5rem' }}>🚿</span>
            <div style={styles.rwNumber}>{(totalImpact * 5).toFixed(0)}</div>
            <div style={styles.rwLabel}>Liters of water conserved</div>
          </div>
          <div style={styles.rwCard}>
            <span style={{ fontSize: '2.5rem' }}>🛍️</span>
            <div style={styles.rwNumber}>{(totalImpact * 2).toFixed(0)}</div>
            <div style={styles.rwLabel}>Plastic items avoided</div>
          </div>
          <div style={styles.rwCard}>
            <span style={{ fontSize: '2.5rem' }}>🚗</span>
            <div style={styles.rwNumber}>{(totalImpact * 1.5).toFixed(1)}</div>
            <div style={styles.rwLabel}>km of driving offset</div>
          </div>
        </div>
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
  header: {
    marginBottom: '25px'
  },
  title: {
    fontSize: '1.8rem',
    color: '#1a5c2e',
    marginBottom: '5px'
  },
  subtitle: {
    color: '#666',
    fontSize: '0.95rem'
  },
  heroCard: {
    background: 'linear-gradient(135deg, #0d3b1e, #1a5c2e, #2d8f4e)',
    color: 'white',
    padding: '35px',
    borderRadius: '16px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 8px 30px rgba(45,143,78,0.3)',
    gap: '30px'
  },
  heroLeft: {
    flex: 1
  },
  levelBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px'
  },
  levelName: {
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  levelUser: {
    opacity: 0.8,
    fontSize: '0.9rem'
  },
  impactNumber: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    lineHeight: 1
  },
  impactLabel: {
    opacity: 0.8,
    marginTop: '5px',
    fontSize: '1rem'
  },
  progressSection: {
    marginTop: '20px'
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    opacity: 0.8,
    marginBottom: '6px'
  },
  progressBar: {
    height: '8px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(to right, #FFD700, #FFA000)',
    borderRadius: '4px',
    transition: 'width 0.5s'
  },
  heroRight: {
    textAlign: 'center'
  },
  globeIcon: {
    fontSize: '4rem',
    opacity: 0.3,
    marginBottom: '15px'
  },
  heroStats: {
    display: 'flex',
    gap: '20px'
  },
  heroStat: {
    textAlign: 'center'
  },
  heroStatNum: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  heroStatLabel: {
    fontSize: '0.7rem',
    opacity: 0.7,
    marginTop: '2px'
  },
  factCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    background: '#fffde7',
    padding: '18px 22px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid #fff9c4'
  },
  factText: {
    fontSize: '0.95rem',
    color: '#555'
  },
  section: {
    background: 'white',
    padding: '25px',
    borderRadius: '14px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    color: '#1a5c2e',
    marginBottom: '20px'
  },
  categoryGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  categoryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  categoryInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: '160px'
  },
  catIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '0.9rem'
  },
  catName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333'
  },
  catMeta: {
    fontSize: '0.75rem',
    color: '#888'
  },
  catBarContainer: {
    flex: 1,
    height: '12px',
    background: '#f0f0f0',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  catBar: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 0.5s'
  },
  catImpact: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#1a5c2e',
    minWidth: '50px',
    textAlign: 'right'
  },
  emptyState: {
    textAlign: 'center',
    padding: '30px',
    color: '#888'
  },
  weekGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '10px'
  },
  dayCard: {
    textAlign: 'center',
    padding: '15px 8px',
    background: '#f8fdf5',
    borderRadius: '10px'
  },
  dayName: {
    fontSize: '0.8rem',
    color: '#888',
    marginBottom: '4px',
    fontWeight: '500'
  },
  dayDate: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px'
  },
  dayCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 8px',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  dayCount: {
    fontSize: '0.75rem',
    color: '#666'
  },
  dayImpact: {
    fontSize: '0.7rem',
    color: '#2d8f4e',
    fontWeight: '600',
    marginTop: '2px'
  },
  realWorldGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px'
  },
  rwCard: {
    textAlign: 'center',
    padding: '25px 15px',
    background: 'linear-gradient(135deg, #f8fdf5, #e8f5e9)',
    borderRadius: '12px',
    border: '1px solid #c8e6c9'
  },
  rwNumber: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1a5c2e',
    margin: '8px 0 4px'
  },
  rwLabel: {
    fontSize: '0.8rem',
    color: '#666'
  }
};

export default Impact;