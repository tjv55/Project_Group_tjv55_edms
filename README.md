
# ------------------ #
# ================== #
### Employee Database Management System (EDMS) ###
# ------------------ #
# ================== #
A full-stack web application that allows administrators to manage employee records and roles, and provides a personalized dashboard for employees. Built using the PERN stack (PostgreSQL, Express, React, Node.js), the EDMS includes secure authentication, role-based access control, and real-time CRUD functionality.

### Features ###
# ------------------ #
# ================== #
### General ###
# ------------------ #
# ================== #
- Full authentication (Sign Up / Sign In / Sessions)
- Role-based access control (Admin vs. Employee)
- Secure session handling using `express-session`

# ------------------ #
# ================== #
### Admin Dashboard ###
# ------------------ #
# ================== #
- View all employees
- Add new users (via modal signup form)
- Edit employee details (excluding email)
- Delete employee records
- Search employees by name or position
- Sort table by Name, Position, or Join Date

# ------------------ #
# ================== #
### Employee Dashboard ###
# ------------------ #
# ================== #
- View personal profile information
- Update editable fields (first name, last name, position)
- Email is read-only for security and integrity
- Secure logout

# ------------------ #
# ================== #
###  Technologies Used ###
# ------------------ #
# ================== #
# Frontend: #
- React
- Bootstrap 5 / React-Bootstrap

# Backend: #
- Node.js
- Express.js

# Database: #
- PostgreSQL
- `pg` (Node.js PostgreSQL client)

# Authentication & Sessions: #
- express-session
- bcrypt 
- cookie-parser
- cors

**Development Tools:**
- Git & GitHub
- Postman 
- Nodemon 

# ------------------ #
# ================== #
### Project Setup Instructions ###
# ------------------ #
# ================== #
### 🔧 Prerequisites
- Node.js v16+ and npm
- PostgreSQL
- Git
- (there may be more)

# ------------------ #
# ================== #
### Backend Setup ###
# ------------------ #
# ================== #

# 1. Clone the repo #
git clone https://github.com/your-username/Project_Group_tjv55_edms.git
cd Project_Group_tjv55_edms/server

# 2. Install dependencies #
npm install

# 3. Configure database connection in db.js or via .env #

# 4. Start the backend server #
npx nodemon server.js

Backend server runs at `http://localhost:3001`

# ------------------ #
# ================== #
### Frontend Setup ###
# ------------------ #
# ================== #

cd ../client

# 1. Install dependencies #
npm install

# 2. Start the React development server #
npm start

Frontend app runs at `http://localhost:3000`

# ------------------ #
# ================== #
### Usage Instructions ###
# ------------------ #
# ================== #
1. Open your browser at `http://localhost:3000`
2. Sign in as an Admin to manage all users
3. Employees sign in to view and update their own profile


# ------------------ #
# ================== #
### PostgreSQL Schema Setup ###
# ------------------ #
# ================== #

You’ll need two tables: `users` and `employees`.

```sql
-- Users table (for authentication)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'employee'))
);

-- Employees table (linked to users)
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  position VARCHAR(100),
  join_date DATE DEFAULT CURRENT_DATE
);
```
# ------------------ #
# ================== #
### Security Considerations ###
# ------------------ #
# ================== #
- Passwords are hashed with bcrypt
- Sessions managed securely using express-session
- Emails are treated as immutable for account integrity
- Backend CORS enabled for cross-origin requests

### Contributors ###

- Tyler Vander Mooren – Developer
