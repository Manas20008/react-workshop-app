import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import MentorAssignment from './MentorAssignment';
import Profile from './Profile';  // new profile page
import ProtectedRoute from './ProtectedRoute';  // role-based route protection

function App() {
  const [token, setToken] = useState('');
  const [userRole, setUserRole] = useState('');

  return (
    <Router>
      {token ? (
        <>
          <nav>
            <Link to="/dashboard">Dashboard</Link> |{' '}
            <Link to="/profile">Profile</Link> |{' '}
            {userRole === 'admin' && <Link to="/mentor-assignment">Mentor Assignment</Link>} |{' '}
            <button onClick={() => { setToken(''); setUserRole(''); }}>Logout</button>
          </nav>
          <Routes>
            <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken} />} />
            <Route path="/profile" element={<Profile token={token} />} />
            <Route
              path="/mentor-assignment"
              element={
                <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                  <MentorAssignment token={token} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Dashboard token={token} setToken={setToken} />} />
          </Routes>
        </>
      ) : (
        <Login setToken={setToken} setUserRole={setUserRole} />
      )}
    </Router>
  );
}

export default App;


