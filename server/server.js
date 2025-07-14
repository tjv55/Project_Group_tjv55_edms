const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL // or your manual config
});

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(session({
  secret: 'potatos',
  resave: false,
  saveUninitialized: false
}));
//--------------
//Signup Route
//--------------
app.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;
  if (!['admin', 'employee'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
      [email, hashed, role]
    );
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//--------------
// Signin Route
//--------------
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid email' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    req.session.user = { id: user.id, role: user.role };
    res.json({ 
        message: 'Logged in',
        user:{
            id: user.id,
            email: user.email,
            role: user.role
            }
        });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
