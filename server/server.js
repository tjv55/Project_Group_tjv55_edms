require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');
const { Pool } = require('pg');

const { isLoggedIn, isAdmin } = require('./middleware/auth');

const app = express();
const port = 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test DB connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('DB connected at:', res.rows[0].now);
  }
});

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // change to true if using HTTPS
}));

// Test current session user
app.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Admin-only Signup Route - create users
app.post('/signup', isLoggedIn, isAdmin, async (req, res) => {
  const {
    email,
    password,
    role,
    first_name,
    last_name,
    position,
  } = req.body;

  if (!['admin', 'employee'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    await pool.query('BEGIN');

    // Insert into users table
    const userResult = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id',
      [email, hashed, role]
    );

    const userId = userResult.rows[0].id;

    // Insert employee details if role is employee
    if (role === 'employee') {
      await pool.query(
        `INSERT INTO employees
          (id, first_name, last_name, email, position, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [userId, first_name, last_name, email, position]
      );
    }

    await pool.query('COMMIT');
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// Signin Route - public
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid email' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    req.session.user = { id: user.id, email: user.email, role: user.role };
    res.json({ message: 'Logged in', user: req.session.user });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ message: 'Signin failed' });
  }
});

// Logout Route - logged-in users only
app.post('/logout', isLoggedIn, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// Get all employees - admin only
app.get('/employees', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, e.first_name, e.last_name, u.email, u.role, e.position
       FROM users u
       JOIN employees e ON u.id = e.id
       WHERE u.role = 'employee'`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single employee by ID - logged-in users
app.get('/employee/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update employee by ID - admin only
app.put('/employee/:id', isLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, position, email } = req.body;
  try {
    const result = await pool.query(
      `UPDATE employees
       SET first_name = $1, last_name = $2, position = $3, email = $4, updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [first_name, last_name, position, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete employee by ID - admin only
app.delete('/employee/:id', isLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted', employee: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get logged-in employee's profile - employee only
app.get('/profile', isLoggedIn, async (req, res) => {
  if (req.session.user.role !== 'employee') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const result = await pool.query(
      'SELECT first_name, last_name, email, position FROM employees WHERE id = $1',
      [req.session.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update logged-in employee's profile - employee only
app.put('/profile', isLoggedIn, async (req, res) => {
  if (req.session.user.role !== 'employee') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { first_name, last_name, email, position } = req.body;

  try {
    await pool.query(
      `UPDATE employees
       SET first_name = $1, last_name = $2, email = $3, position = $4, updated_at = NOW()
       WHERE id = $5`,
      [first_name, last_name, email, position, req.session.user.id]
    );
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Protected route - Any logged-in user
app.get('/dashboard', isLoggedIn, (req, res) => {
  res.json({ message: `Welcome ${req.session.user.email}!`, role: req.session.user.role });
});

// Admin-only route
app.get('/admin', isLoggedIn, isAdmin, (req, res) => {
  res.json({ message: 'Welcome Admin!', user: req.session.user });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
