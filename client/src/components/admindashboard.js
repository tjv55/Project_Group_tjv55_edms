import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditEmployeeForm from './editemployee';
import SignUp from './signup';  // Import your signup form
import { Modal, Button, InputGroup, FormControl } from 'react-bootstrap';

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:3001/employees', { withCredentials: true });
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:3001/employee/${id}`, { withCredentials: true });
        fetchEmployees();
      } catch (err) {
        console.error('Error deleting employee:', err);
      }
    }
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
  };

  const handleEditDone = () => {
    setEditingEmployee(null);
    fetchEmployees();
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp =>
    emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Dashboard - Employee Management</h2>

      <div className="d-flex justify-content-between mb-3">
        <InputGroup style={{ maxWidth: '300px' }}>
          <FormControl
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Button variant="success" onClick={() => setShowSignup(true)}>
          Add User
        </Button>
      </div>

      {editingEmployee ? (
        <EditEmployeeForm employee={editingEmployee} onDone={handleEditDone} />
      ) : (
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.first_name} {emp.last_name}</td>
                <td>{emp.position}</td>
                <td>{emp.email}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditClick(emp)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Signup modal  */}
      <Modal show={showSignup} onHide={() => setShowSignup(false)} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SignUp onSignupSuccess={() => {
            setShowSignup(false);
            fetchEmployees();
          }} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
