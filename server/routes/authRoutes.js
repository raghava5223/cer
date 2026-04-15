const express = require('express');
const { registerAdmin, loginUser, registerStudent, registerOrganizer, getOrganizers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/admin/register', registerAdmin);
router.post('/login', loginUser);
router.post('/student/register', registerStudent);
router.post('/organizer/register', registerOrganizer);
router.get('/organizers', protect, authorize('admin'), getOrganizers);

module.exports = router;
