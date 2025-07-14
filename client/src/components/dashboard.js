import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './logout';

export default function Dashboard({ user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div>
      <h2>{user.role === 'admin' ? 'Admin' : 'Employee'} Dashboard</h2>
      <p>Welcome, {user.role}!</p>

      {/* Logout Button */}
      <Logout setUser={setUser} />

      {user.role === 'admin' ? (
        <div>
          <p>You can view and manage all employee records.</p>
        </div>
      ) : (
        <div>
          <p>You can view and update your own profile.</p>
        </div>
      )}
    </div>
  );
}
