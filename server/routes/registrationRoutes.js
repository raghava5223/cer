const express = require('express');
const router = express.Router();
const {
    registerForEvent,
    bulkPayment,
    getMyRegistrations,
    getEventRegistrations,
    markAttendance,
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), registerForEvent);
router.post('/bulk-pay', protect, authorize('student'), bulkPayment);
router.get('/my', protect, authorize('student'), getMyRegistrations);
router.get(
    '/event/:eventId',
    protect,
    authorize('admin', 'organizer'),
    getEventRegistrations
);
router.patch(
    '/:id/attendance',
    protect,
    authorize('admin', 'organizer'),
    markAttendance
);

module.exports = router;
