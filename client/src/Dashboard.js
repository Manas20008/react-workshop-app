import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';

function Dashboard({ token, setToken }) {
  const [workshops, setWorkshops] = useState([]);
  const [error, setError] = useState('');

  // Filter states
  const [titleFilter, setTitleFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mentorFilter, setMentorFilter] = useState('');

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/workshops', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWorkshops(res.data);
      } catch (err) {
        setError('Failed to fetch workshops');
      }
    };
    fetchWorkshops();
  }, [token]);

  const handleLogout = () => {
    setToken('');
  };

  const registerForWorkshop = async (workshopId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/workshops/${workshopId}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Registered successfully!');

      // Refresh list
      const res = await axios.get('http://localhost:5000/api/workshops', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkshops(res.data);
    } catch (err) {
      alert('Registration failed or already registered');
    }
  };

  // Filter workshops based on search/filter criteria
  const filteredWorkshops = workshops.filter((w) => {
    const titleMatch = w.title.toLowerCase().includes(titleFilter.toLowerCase());
    const mentorMatch =
      mentorFilter === '' ||
      w.mentors.some((m) => m.name.toLowerCase().includes(mentorFilter.toLowerCase()));

    const date = new Date(w.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const startMatch = start ? date >= start : true;
    const endMatch = end ? date <= end : true;

    return titleMatch && mentorMatch && startMatch && endMatch;
  });

  return (
    <div className={styles.container}>
      <h2>Welcome to your dashboard!</h2>
      <button onClick={handleLogout}>Logout</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Search & Filters</h3>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          style={{ marginRight: 10, padding: 5 }}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: 10, padding: 5 }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ marginRight: 10, padding: 5 }}
        />
        <input
          type="text"
          placeholder="Mentor name..."
          value={mentorFilter}
          onChange={(e) => setMentorFilter(e.target.value)}
          style={{ padding: 5 }}
        />
      </div>

      <h3>Available Workshops</h3>
      {filteredWorkshops.length === 0 ? (
        <p>No workshops found matching criteria.</p>
      ) : (
        <ul>
          {filteredWorkshops.map((workshop) => (
            <li key={workshop._id} style={{ marginBottom: 15, background: 'white', padding: 15, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <strong>{workshop.title}</strong>
              <br />
              {workshop.description && <p>{workshop.description}</p>}
              Date: {new Date(workshop.date).toLocaleDateString()}
              <br />
              Mentors: {workshop.mentors.map((m) => m.name).join(', ') || 'None assigned'}
              <br />
              <button onClick={() => registerForWorkshop(workshop._id)} style={{ marginTop: 10, backgroundColor: '#4f46e5', color: 'white', padding: '8px 14px', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>
                Register
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
