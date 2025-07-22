import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ isAuthenticated, isAdmin, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">EDMS</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isAuthenticated && isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Dashboard</Link>
              </li>
            )}
            {isAuthenticated && !isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/profile">My Profile</Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signin">Sign In</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm" onClick={onLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
