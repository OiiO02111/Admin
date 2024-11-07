const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { adminRole , userRole } = require('../controllers/authController');
// Define routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/admin', authenticateToken, authorizeRole(['ADMIN']) , adminRole);

router.get('/user', authenticateToken, userRole );

router.get('/guest', authenticateToken, (req, res) => {
  res.send('Welcome Guest');
});

module.exports = router;  // Ensure you export the router instance
