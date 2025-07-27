import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeProfile = () => {
  const [profile, setProfile] = useState({ first_name: '', last_name: '', email: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/profile', { withCredentials: true })
      .then(res => setProfile(res.data))
      .catch(err => setMessage('Failed to fetch profile'));
  }, []);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.put('http://localhost:3001/profile', profile, { withCredentials: true })
      .then(res => setMessage('Profile updated'))
      .catch(err => setMessage('Update failed'));
  };

  return (
    <div className="container mt-4">
      <h2>My Profile</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>First Name</label>
          <input type="text" name="first_name" className="form-control" value={profile.first_name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Last Name</label>
          <input type="text" name="last_name" className="form-control" value={profile.last_name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={profile.email} readOnly disabled />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
};

export default EmployeeProfile;
