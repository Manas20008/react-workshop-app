import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MentorAssignment.module.css';

function MentorAssignment({ token }) {
  const [workshops, setWorkshops] = useState([]);
  const [mentorInputs, setMentorInputs] = useState({});
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/workshops', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWorkshops(res.data);
      } catch {
        setError('Failed to load workshops');
      }
    };
    fetchWorkshops();
  }, [token]);

  const handleInputChange = (e, workshopId) => {
    setMentorInputs(prev => ({ ...prev, [workshopId]: e.target.value }));
  };

  const assignMentor = async (workshopId) => {
    const mentorId = mentorInputs[workshopId];
    if (!mentorId) {
      setMsg('Please enter a mentor ID');
      return;
    }

    setMsg('');
    setError('');
    try {
      await axios.post(
        `http://localhost:5000/api/workshops/${workshopId}/assign-mentor`,
        { mentorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('Mentor assigned successfully');

      // Refresh workshops list
      const res = await axios.get('http://localhost:5000/api/workshops', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkshops(res.data);

      // Clear input for this workshop
      setMentorInputs(prev => ({ ...prev, [workshopId]: '' }));
    } catch {
      setError('Failed to assign mentor');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Mentor Assignment</h2>
      {msg && <p className={styles.success}>{msg}</p>}
      {error && <p className={styles.error}>{error}</p>}
      {workshops.map(workshop => (
        <div key={workshop._id} className={styles.workshop}>
          <h3>{workshop.title}</h3>
          <p>Mentors: {workshop.mentors.length > 0 ? workshop.mentors.map(m => m.name).join(', ') : 'None assigned'}</p>
          <input
            type="text"
            placeholder="Mentor User ID"
            value={mentorInputs[workshop._id] || ''}
            onChange={(e) => handleInputChange(e, workshop._id)}
            className={styles.input}
          />
          <button onClick={() => assignMentor(workshop._id)} className={styles.button}>
            Assign Mentor
          </button>
        </div>
      ))}
    </div>
  );
}

export default MentorAssignment;
