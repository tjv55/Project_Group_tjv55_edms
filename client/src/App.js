import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Signup from './components/signup';
import Signin from './components/signin';
import Dashboard from './components/dashboard';

function App() {
  const [user, setUser] = useState(null);

  // Fetch user session on first load
  useEffect(() => {
    axios.get('http://localhost:3001/me', { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null)); // Not logged in
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
        <Route path="/" element={<h1>Welcome to EDMS</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
