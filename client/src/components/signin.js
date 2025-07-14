import { useState } from 'react';
import axios from 'axios';

export default function Signin({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/signin',
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data.user);  // Set user info (passed from App)
      setMessage('Signed in!');
    } catch (err) {
      const error = err.response?.data?.message || 'Signin failed';
      setMessage(error);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
