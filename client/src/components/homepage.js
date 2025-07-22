import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mt-5 text-center">
      <h1 className="display-4 mb-4">Welcome to the EDMS Portal</h1>
      <p className="lead">Employee Database Management System developed by Tyler Vander Mooren</p>

      <div className="card mx-auto mt-4" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h5 className="card-title">Sign In</h5>
          <p className="card-text">Access your dashboard securely</p>

          <Link to="/signin" className="btn btn-primary btn-block mb-2">
            Employee Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
