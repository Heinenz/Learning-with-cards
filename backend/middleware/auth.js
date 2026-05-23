const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  // No token? Reject
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Extract token from header: "Bearer TOKEN"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    // Verify token and extract user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to req so routes can use it
    req.user = decoded; // { userId: ... }

    next(); // Continue to the route
  }
  catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
