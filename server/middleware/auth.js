
// Check if the user is logged in
function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).json({ message: 'Not logged in' });
  }
}

// Check if the user is an admin
function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
}

module.exports = {
  isLoggedIn,
  isAdmin
};
