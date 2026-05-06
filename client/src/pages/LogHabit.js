import React, { useState, useEffect, useCallback } from 'react';
import { getHabits, logHabit, getLogs, deleteLog } from '../services/api';
import { FaCheck, FaCalendarAlt, FaTrash, FaStickyNote, FaWater, FaBolt, FaBus, FaRecycle, FaUtensils, FaTrashAlt } from 'react-icons/fa';

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

const LogHabit = () => {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedHabit, setSelectedHabit] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // ✅ NEW CODE - Replace with this
  const fetchLogs = useCallback(async () => {
    try {
      const logsRes = await getLogs({ date: selectedDate });
      setLogs(logsRes.data);
    } catch (err) {
      console.error('Error:', err);
    }
  }, [selectedDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const habitsRes = await getHabits();
        setHabits(habitsRes.data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleLog = async (e) => {
    e.preventDefault();
    if (!selectedHabit) {
      setError('Please select a habit');
      return;
    }
    setLogLoading(true);
    setError('');
    setSuccess('');

    try {
      await logHabit({
        habitId: selectedHabit,
        date: selectedDate,
        quantity,
        note
      });
      setSuccess('Habit logged successfully! Great job! 🌱');
      setSelectedHabit('');
      setQuantity(1);
      setNote('');
      fetchLogs();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error logging habit');
    } finally {
      setLogLoading(false);
    }
  };

  const handleDeleteLog = async (id) => {
    if (window.confirm('Remove this log?')) {
      try {
        await deleteLog(id);
        fetchLogs();
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const loggedHabitIds = logs.map(l => l.habitId?._id || l.habitId);

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📝 Log Your Habits</h1>
        <p style={styles.subtitle}>Record your eco-friendly actions for the day</p>
      </div>

      <div style={styles.mainGrid}>
        {/* LEFT - Log Form */}
        <div style={styles.formSection}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <FaCalendarAlt style={{ color: '#2d8f4e' }} /> Log an Action
            </h2>

            {success && <div style={styles.success}>{success}</div>}
            {error && <div style={styles.errorMsg}>{error}</div>}

            <form onSubmit={handleLog}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={styles.input}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Select Habit</label>
                {habits.length === 0 ? (
                  <p style={styles.noHabits}>No habits created yet. Go to Habits page first!</p>
                ) : (
                  <div style={styles.habitSelect}>
                    {habits.map(habit => {
                      const isLogged = loggedHabitIds.includes(habit._id);
                      return (
                        <div
                          key={habit._id}
                          onClick={() => !isLogged && setSelectedHabit(habit._id)}
                          style={{
                            ...styles.habitOption,
                            borderColor: selectedHabit === habit._id
                              ? categoryColors[habit.category]
                              : isLogged ? '#c8e6c9' : '#e0e8d8',
                            background: isLogged
                              ? '#e8f5e9'
                              : selectedHabit === habit._id
                                ? `${categoryColors[habit.category]}15`
                                : 'white',
                            opacity: isLogged ? 0.7 : 1,
                            cursor: isLogged ? 'default' : 'pointer'
                          }}
                        >
                          <div style={{
                            ...styles.habitOptionIcon,
                            background: categoryColors[habit.category]
                          }}>
                            {isLogged ? <FaCheck /> : categoryIcons[habit.category]}
                          </div>
                          <div>
                            <div style={styles.habitOptionName}>{habit.name}</div>
                            <div style={styles.habitOptionImpact}>
                              {habit.impactPerAction} {habit.impactUnit}
                            </div>
                          </div>
                          {isLogged && <span style={styles.loggedBadge}>Done!</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FaStickyNote style={{ color: '#2d8f4e' }} /> Note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={styles.textarea}
                  placeholder="How did it go? Any thoughts..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                style={styles.logButton}
                disabled={logLoading || !selectedHabit}
              >
                {logLoading ? 'Logging...' : 'Log Habit ✅'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT - Today's Logs */}
        <div style={styles.logsSection}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              📋 Logs for {new Date(selectedDate).toLocaleDateString('en', {
                weekday: 'long', month: 'long', day: 'numeric'
              })}
            </h2>

            {logs.length === 0 ? (
              <div style={styles.emptyLogs}>
                <span style={{ fontSize: '3rem' }}>📭</span>
                <p>No logs for this date yet</p>
              </div>
            ) : (
              <div style={styles.logsList}>
                {logs.map(log => (
                  <div key={log._id} style={styles.logItem}>
                    <div style={{
                      ...styles.logIcon,
                      background: categoryColors[log.habitId?.category] || '#4CAF50'
                    }}>
                      {categoryIcons[log.habitId?.category] || '🌱'}
                    </div>
                    <div style={styles.logInfo}>
                      <div style={styles.logName}>{log.habitId?.name || 'Habit'}</div>
                      <div style={styles.logMeta}>
                        Impact: <strong>{log.impactValue}</strong> {log.habitId?.impactUnit}
                        {log.quantity > 1 && ` (x${log.quantity})`}
                      </div>
                      {log.note && <div style={styles.logNote}>"{log.note}"</div>}
                    </div>
                    <button onClick={() => handleDeleteLog(log._id)} style={styles.logDelete}>
                      <FaTrash />
                    </button>
                  </div>
                ))}

                <div style={styles.totalImpact}>
                  Total Impact Today: <strong>
                    {logs.reduce((sum, l) => sum + l.impactValue, 0).toFixed(1)}
                  </strong> points
                </div>
              </div>
            )}
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
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '25px'
  },
  formSection: {},
  logsSection: {},
  card: {
    background: 'white',
    padding: '25px',
    borderRadius: '14px',
    boxShadow: '0 3px 15px rgba(0,0,0,0.08)'
  },
  cardTitle: {
    fontSize: '1.2rem',
    color: '#1a5c2e',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  success: {
    background: '#e8f5e9',
    color: '#2e7d32',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #c8e6c9',
    fontSize: '0.9rem'
  },
  errorMsg: {
    background: '#ffe8e8',
    color: '#d32f2f',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #ffcdd2',
    fontSize: '0.9rem'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#444',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '2px solid #e0e8d8',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    border: '2px solid #e0e8d8',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  formRow: {
    display: 'flex',
    gap: '15px'
  },
  noHabits: {
    color: '#888',
    fontStyle: 'italic',
    padding: '10px',
    textAlign: 'center'
  },
  habitSelect: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '250px',
    overflowY: 'auto'
  },
  habitOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    border: '2px solid #e0e8d8',
    borderRadius: '10px',
    transition: 'all 0.2s',
    position: 'relative'
  },
  habitOptionIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '0.85rem',
    flexShrink: 0
  },
  habitOptionName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333'
  },
  habitOptionImpact: {
    fontSize: '0.75rem',
    color: '#888'
  },
  loggedBadge: {
    marginLeft: 'auto',
    background: '#4CAF50',
    color: 'white',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 'bold'
  },
  logButton: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #1a5c2e, #2d8f4e)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.05rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '5px',
    boxShadow: '0 4px 15px rgba(45,143,78,0.3)'
  },
  emptyLogs: {
    textAlign: 'center',
    padding: '40px',
    color: '#888'
  },
  logsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  logItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    background: '#f8fdf5',
    borderRadius: '10px'
  },
  logIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '0.9rem',
    flexShrink: 0
  },
  logInfo: {
    flex: 1
  },
  logName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#333'
  },
  logMeta: {
    fontSize: '0.8rem',
    color: '#666',
    marginTop: '2px'
  },
  logNote: {
    fontSize: '0.75rem',
    color: '#888',
    fontStyle: 'italic',
    marginTop: '4px'
  },
  logDelete: {
    background: '#ffebee',
    border: 'none',
    color: '#f44336',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  totalImpact: {
    marginTop: '15px',
    padding: '14px',
    background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#1a5c2e',
    fontSize: '0.95rem'
  }
};

export default LogHabit;