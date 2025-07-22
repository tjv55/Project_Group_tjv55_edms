import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Homepage from './components/homepage';
import SignUp from './components/signup';
import SignIn from './components/signin';
import AdminDashboard from './components/admindashboard';
import Profile from './components/employeeprofile';
import axios from 'axios';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('http://localhost:3001/me', { withCredentials: true });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar
        isAuthenticated={!!user}
        isAdmin={user?.role === 'admin'}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/signin"
          element={!user ? <SignIn setUser={setUser} /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={user?.role === 'employee' ? <Profile /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}
