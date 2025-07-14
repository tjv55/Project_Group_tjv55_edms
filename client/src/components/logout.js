import axios from 'axios';

export default function Logout({ setUser }) {
  const handleLogout = async () => {
    await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return <button onClick={handleLogout}>Logout</button>;
}
