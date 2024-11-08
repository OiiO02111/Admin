const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
//    const token = req.headers['authorization'];
console.log('MIddleware')
  if (!token) return res.status(403).json({ message: 'You must enter token info' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log('role==>', req.user)
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

exports.authorizeRole = (roles) => (req, res, next) => {
  console.log(roles)
  if (!roles.includes(req.user.role)) 
    {
      return res.status(403).json({ message: 'You cannot do this, you are a normal user.' });
    }
  next();
};
