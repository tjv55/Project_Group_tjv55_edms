import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditEmployeeForm from './editemployee';
import SignUp from './signup';
import { Modal, Button, InputGroup, FormControl, Dropdown } from 'react-bootstrap';

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // asc or desc

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

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Sort + filter combined
  const processedEmployees = [...employees]
    .filter(emp =>
      emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField]?.toString().toLowerCase();
      const valB = b[sortField]?.toString().toLowerCase();
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Dashboard - Employee Management</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ maxWidth: '300px' }}>
          <FormControl
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Dropdown className="me-2">
          <Dropdown.Toggle variant="info" id="dropdown-sort">
            Sort By
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSort('first_name')}>
              Name {sortField === 'first_name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSort('position')}>
              Position {sortField === 'position' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSort('id')}>
              ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSort('email')}>
              Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

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
              <th>ID</th>
              <th>Role</th>
             
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {processedEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.first_name} {emp.last_name}</td>
                <td>{emp.position}</td>
                <td>{emp.email}</td>
                <td>{emp.id}</td>
                <td>{emp.role}</td>
                
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
