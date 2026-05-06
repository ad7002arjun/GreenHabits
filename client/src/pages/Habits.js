import React, { useState, useEffect, useCallback } from 'react';
import { getHabits, createHabit, deleteHabit } from '../services/api';
import { FaPlus, FaTrash, FaWater, FaBolt, FaBus, FaRecycle, FaUtensils, FaTrashAlt, FaFire, FaTimes } from 'react-icons/fa';

const categories = [
  { value: 'water', label: 'Water Conservation', icon: <FaWater /> },
  { value: 'energy', label: 'Energy Saving', icon: <FaBolt /> },
  { value: 'transport', label: 'Green Transport', icon: <FaBus /> },
  { value: 'plastic', label: 'Plastic Reduction', icon: <FaTrashAlt /> },
  { value: 'food', label: 'Sustainable Food', icon: <FaUtensils /> },
  { value: 'recycling', label: 'Recycling', icon: <FaRecycle /> }
];

const presetHabits = [
  { name: 'Short Shower (< 5 min)', category: 'water', impactPerAction: 30, impactUnit: 'liters saved', description: 'Take shorter showers to conserve water' },
  { name: 'Turn Off Lights', category: 'energy', impactPerAction: 0.5, impactUnit: 'kWh saved', description: 'Turn off lights when leaving a room' },
  { name: 'Use Public Transport', category: 'transport', impactPerAction: 2.5, impactUnit: 'kg CO2 reduced', description: 'Use bus or train instead of car' },
  { name: 'Refuse Plastic Bag', category: 'plastic', impactPerAction: 1, impactUnit: 'bags avoided', description: 'Bring your own bag when shopping' },
  { name: 'Eat Vegetarian Meal', category: 'food', impactPerAction: 1.5, impactUnit: 'kg CO2 reduced', description: 'Choose plant-based meals' },
  { name: 'Recycle Paper/Plastic', category: 'recycling', impactPerAction: 0.5, impactUnit: 'kg recycled', description: 'Properly sort and recycle waste' },
  { name: 'Use Reusable Bottle', category: 'plastic', impactPerAction: 1, impactUnit: 'bottles avoided', description: 'Carry a reusable water bottle' },
  { name: 'Bike to Work', category: 'transport', impactPerAction: 3, impactUnit: 'kg CO2 reduced', description: 'Cycle instead of driving' },
  { name: 'Cold Water Wash', category: 'energy', impactPerAction: 0.8, impactUnit: 'kWh saved', description: 'Wash clothes in cold water' },
  { name: 'Compost Food Waste', category: 'food', impactPerAction: 0.3, impactUnit: 'kg waste diverted', description: 'Compost organic kitchen waste' }
];

const categoryColors = {
  water: '#2196F3',
  energy: '#FF9800',
  transport: '#9C27B0',
  plastic: '#F44336',
  food: '#4CAF50',
  recycling: '#00BCD4'
};

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customHabit, setCustomHabit] = useState({
    name: '', category: 'water', description: '', impactPerAction: 1, impactUnit: 'units'
  });
  const [filterCategory, setFilterCategory] = useState('all');

  const fetchHabits = useCallback(async () => {
    try {
      const res = await getHabits();
      setHabits(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleAddPreset = async (preset) => {
    try {
      await createHabit(preset);
      fetchHabits();
      setShowModal(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding habit');
    }
  };

  const handleAddCustom = async (e) => {
    e.preventDefault();
    try {
      await createHabit(customHabit);
      fetchHabits();
      setShowModal(false);
      setShowCustom(false);
      setCustomHabit({ name: '', category: 'water', description: '', impactPerAction: 1, impactUnit: 'units' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding habit');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this habit?')) {
      try {
        await deleteHabit(id);
        fetchHabits();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const filteredHabits = filterCategory === 'all'
    ? habits
    : habits.filter(h => h.category === filterCategory);

  if (loading) return <div style={styles.loading}>Loading habits...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Eco Habits</h1>
          <p style={styles.subtitle}>Manage your sustainable daily routines</p>
        </div>
        <button onClick={() => setShowModal(true)} style={styles.addButton}>
          <FaPlus /> Add Habit
        </button>
      </div>

      <div style={styles.filterBar}>
        <button
          onClick={() => setFilterCategory('all')}
          style={filterCategory === 'all' ? styles.filterActive : styles.filterBtn}
        >All</button>
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setFilterCategory(cat.value)}
            style={filterCategory === cat.value
              ? { ...styles.filterActive, background: categoryColors[cat.value] }
              : styles.filterBtn
            }
          >{cat.icon} {cat.value}</button>
        ))}
      </div>

      {filteredHabits.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={{ fontSize: '4rem' }}>🌱</span>
          <h3>No habits yet!</h3>
          <p>Click "Add Habit" to start your green journey</p>
        </div>
      ) : (
        <div style={styles.habitsGrid}>
          {filteredHabits.map(habit => (
            <div key={habit._id} style={styles.habitCard}>
              <div style={{
                ...styles.cardHeader,
                background: `linear-gradient(135deg, ${categoryColors[habit.category]}, ${categoryColors[habit.category]}dd)`
              }}>
                <span style={styles.cardCategory}>{habit.category}</span>
                <button onClick={() => handleDelete(habit._id)} style={styles.deleteBtn}>
                  <FaTrash />
                </button>
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.habitName}>{habit.name}</h3>
                <p style={styles.habitDesc}>{habit.description}</p>
                <div style={styles.cardFooter}>
                  <div style={styles.impact}>
                    <span style={styles.impactValue}>{habit.impactPerAction}</span>
                    <span style={styles.impactUnit}>{habit.impactUnit}</span>
                  </div>
                  <div style={styles.streak}>
                    <FaFire style={{ color: '#FF5722' }} />
                    <span>{habit.streak} streak</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD HABIT MODAL */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => { setShowModal(false); setShowCustom(false); }}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {showCustom ? 'Create Custom Habit' : 'Add a Green Habit'}
              </h2>
              <button onClick={() => { setShowModal(false); setShowCustom(false); }} style={styles.closeBtn}>
                <FaTimes />
              </button>
            </div>

            {!showCustom ? (
              <div>
                <div style={styles.presetGrid}>
                  {presetHabits.map((preset, index) => (
                    <div
                      key={index}
                      style={styles.presetCard}
                      onClick={() => handleAddPreset(preset)}
                    >
                      <div style={{
                        ...styles.presetIcon,
                        background: categoryColors[preset.category]
                      }}>
                        {categories.find(c => c.value === preset.category)?.icon}
                      </div>
                      <div>
                        <div style={styles.presetName}>{preset.name}</div>
                        <div style={styles.presetImpact}>
                          {preset.impactPerAction} {preset.impactUnit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowCustom(true)} style={styles.customBtn}>
                  <FaPlus /> Create Custom Habit
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddCustom} style={styles.customForm}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Habit Name</label>
                  <input
                    type="text"
                    value={customHabit.name}
                    onChange={(e) => setCustomHabit({ ...customHabit, name: e.target.value })}
                    style={styles.formInput}
                    placeholder="e.g., Walk to school"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    value={customHabit.category}
                    onChange={(e) => setCustomHabit({ ...customHabit, category: e.target.value })}
                    style={styles.formInput}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <input
                    type="text"
                    value={customHabit.description}
                    onChange={(e) => setCustomHabit({ ...customHabit, description: e.target.value })}
                    style={styles.formInput}
                    placeholder="Short description"
                  />
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Impact Per Action</label>
                    <input
                      type="number"
                      step="0.1"
                      value={customHabit.impactPerAction}
                      onChange={(e) => setCustomHabit({ ...customHabit, impactPerAction: parseFloat(e.target.value) })}
                      style={styles.formInput}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Impact Unit</label>
                    <input
                      type="text"
                      value={customHabit.impactUnit}
                      onChange={(e) => setCustomHabit({ ...customHabit, impactUnit: e.target.value })}
                      style={styles.formInput}
                      placeholder="e.g., liters saved"
                      required
                    />
                  </div>
                </div>
                <div style={styles.formActions}>
                  <button type="button" onClick={() => setShowCustom(false)} style={styles.cancelBtn}>
                    Back
                  </button>
                  <button type="submit" style={styles.submitBtn}>
                    Create Habit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #1a5c2e, #2d8f4e)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(45,143,78,0.3)'
  },
  filterBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '25px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '8px 16px',
    background: 'white',
    border: '2px solid #e0e8d8',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    textTransform: 'capitalize',
    color: '#555'
  },
  filterActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '8px 16px',
    background: '#2d8f4e',
    border: '2px solid transparent',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    textTransform: 'capitalize',
    color: 'white',
    fontWeight: 'bold'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    color: '#888'
  },
  habitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  habitCard: {
    background: 'white',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 3px 15px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
    color: 'white'
  },
  cardCategory: {
    textTransform: 'uppercase',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  deleteBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: '6px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  cardBody: {
    padding: '18px'
  },
  habitName: {
    fontSize: '1.1rem',
    color: '#333',
    marginBottom: '6px'
  },
  habitDesc: {
    fontSize: '0.85rem',
    color: '#888',
    marginBottom: '15px',
    lineHeight: '1.4'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  impact: {
    display: 'flex',
    flexDirection: 'column'
  },
  impactValue: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1a5c2e'
  },
  impactUnit: {
    fontSize: '0.75rem',
    color: '#888'
  },
  streak: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.9rem',
    color: '#555',
    fontWeight: '500'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px'
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
    padding: '25px'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  modalTitle: {
    fontSize: '1.4rem',
    color: '#1a5c2e'
  },
  closeBtn: {
    background: '#f5f5f5',
    border: 'none',
    padding: '8px 10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#666'
  },
  presetGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '20px'
  },
  presetCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    border: '2px solid #e8f5e9',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#fafff8'
  },
  presetIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '0.9rem',
    flexShrink: 0
  },
  presetName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#333'
  },
  presetImpact: {
    fontSize: '0.7rem',
    color: '#888'
  },
  customBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '12px',
    background: '#f0f7f0',
    border: '2px dashed #2d8f4e',
    borderRadius: '10px',
    color: '#2d8f4e',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  customForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    flex: 1
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#444'
  },
  formInput: {
    padding: '10px 14px',
    border: '2px solid #e0e8d8',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  formRow: {
    display: 'flex',
    gap: '15px'
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '5px'
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    background: '#f5f5f5',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: '#666'
  },
  submitBtn: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #1a5c2e, #2d8f4e)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: 'white',
    fontWeight: 'bold'
  }
};

export default Habits;