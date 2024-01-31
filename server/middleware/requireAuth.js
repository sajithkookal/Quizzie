// Middleware for Authorization
const jwt = require('jsonwebtoken');
// Load environment variables from .env file
require('dotenv').config(); 

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const {userId} = jwt.verify(token, process.env.JWT_KEY);
    console.log(userId);
    req.userId = userId;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = requireAuth;