import React, { useState } from 'react';
import axios from 'axios';

export default function EditEmployeeForm({ employee, onDone }) {
  const [formData, setFormData] = useState({ ...employee });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/employee/${employee.id}`, formData, { withCredentials: true });
      onDone();
    } catch (err) {
      console.error('Error updating employee:', err);
    }
  };

  return (
    <div>
      <h3>Edit Employee</h3>
      <form onSubmit={handleSubmit} className="mb-3">
        {['first_name','last_name', 'position', 'email'].map((field) => (
          <div className="form-group" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              className="form-control"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required={field !== 'phone'}
            />
          </div>
        ))}
        <button className="btn btn-success mt-2" type="submit">Save</button>
        <button className="btn btn-secondary mt-2 ms-2" onClick={onDone}>Cancel</button>
      </form>
    </div>
  );
}
