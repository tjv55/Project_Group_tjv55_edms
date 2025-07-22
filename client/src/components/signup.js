import React, { useState } from 'react';
import axios from 'axios';

export default function SignUp({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    position: '',
    role: 'employee',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:3001/signup', formData, { withCredentials: true });
      if (onSignupSuccess) onSignupSuccess();
      alert('User created successfully!');
      setFormData({
        first_name: '',
        last_name: '',
        position: '',
        role: 'employee',
        email: '',
        password: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '400px' }}>
      <h3>Sign Up</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            className="form-control"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            className="form-control"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="position" className="form-label">Position</label>
          <input
            type="text"
            id="position"
            name="position"
            className="form-control"
            value={formData.position}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            name="role"
            className="form-select"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
      </form>
    </div>
  );
}
