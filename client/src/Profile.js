import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Profile.module.css';

function Profile({ token }) {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile({ name: res.data.name, email: res.data.email });
      } catch {
        setError('Failed to load profile');
      }
    };
    fetchProfile();
  }, [token]);

  const handleProfileChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateProfile = async () => {
    setMessage('');
    setError('');
    try {
      await axios.put(
        'http://localhost:5000/api/users/profile',
        { name: profile.name, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Profile updated successfully');
    } catch {
      setError('Failed to update profile');
    }
  };

  const changePassword = async () => {
    setMessage('');
    setError('');
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      await axios.put(
        'http://localhost:5000/api/users/change-password',
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Password changed successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      setError('Failed to change password');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Your Profile</h2>

      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div>
        <label>Name:</label>
        <input
          className={styles.input}
          type="text"
          name="name"
          value={profile.name}
          onChange={handleProfileChange}
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          className={styles.input}
          type="email"
          name="email"
          value={profile.email}
          onChange={handleProfileChange}
        />
      </div>

      <button className={styles.button} onClick={updateProfile}>Update Profile</button>

      <h3>Change Password</h3>
      <div>
        <label>Current Password:</label>
        <input
          className={styles.input}
          type="password"
          name="currentPassword"
          value={passwords.currentPassword}
          onChange={handlePasswordChange}
        />
      </div>
      <div>
        <label>New Password:</label>
        <input
          className={styles.input}
          type="password"
          name="newPassword"
          value={passwords.newPassword}
          onChange={handlePasswordChange}
        />
      </div>
      <div>
        <label>Confirm New Password:</label>
        <input
          className={styles.input}
          type="password"
          name="confirmPassword"
          value={passwords.confirmPassword}
          onChange={handlePasswordChange}
        />
      </div>

      <button className={styles.button} onClick={changePassword}>Change Password</button>
    </div>
  );
}

export default Profile;
