const Registration = require('../models/Registration');
const Event = require('../models/Event');
const QRCode = require('qrcode');
const { sendPaymentConfirmation, sendRegistrationEmail } = require('../services/emailService');
// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private/Student
const registerForEvent = async (req, res) => {
    const { eventId, paymentStatus, transactionId } = req.body;
    const studentId = req.user._id;

    // 1. Check if event exists and is open
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }
    if (event.status === 'closed') {
        return res.status(400).json({ message: 'Registration for this event is closed' });
    }

    // 2. Check enrollment limit
    if (event.currentEnrollmentCount >= event.studentEnrollmentLimit) {
        return res.status(400).json({ message: 'Event is full' });
    }

    // 3. Check for duplicate registration
    const existingRegistration = await Registration.findOne({
        studentId,
        eventId,
    });
    if (existingRegistration) {
        return res.status(400).json({ message: 'Already registered for this event' });
    }

    // 4. Create Registration
    const isPending = paymentStatus === 'pending';
    const registration = new Registration({
        studentId,
        eventId,
        paymentStatus: paymentStatus || 'paid',
        transactionId: isPending ? null : (transactionId || `TXN${Date.now()}`),
    });

    // 5. Generate QR Code with Registration ID (only if paid)
    if (!isPending) {
        const qrData = registration._id.toString();
        const qrCodeUrl = await QRCode.toDataURL(qrData);
        registration.qrCode = qrCodeUrl;

        // 6. Update event enrollment count only if paid
        event.currentEnrollmentCount += 1;
        await event.save();
    } else {
        // For pending, we don't have a valid QR yet or we can use a placeholder
        registration.qrCode = 'pending_payment';
    }

    await registration.save();

    // 7. Send initial registration received email (NEW)
    sendRegistrationEmail(req.user.email, req.user.name, event, isPending);

    // 8. Send payment confirmation email if already paid
    if (!isPending) {
        // Populate event details for the email
        const populatedRegistration = await Registration.findById(registration._id).populate('eventId');
        sendPaymentConfirmation(req.user.email, req.user.name, [populatedRegistration]);
    }

    res.status(201).json(registration);
};

// @desc    Bulk pay for pending registrations
// @route   POST /api/registrations/bulk-pay
// @access  Private/Student
const bulkPayment = async (req, res) => {
    const { registrationIds, transactionId } = req.body;
    const studentId = req.user._id;

    try {
        const registrations = await Registration.find({
            _id: { $in: registrationIds },
            studentId,
            paymentStatus: 'pending'
        }).populate('eventId');

        if (registrations.length === 0) {
            return res.status(400).json({ message: 'No pending registrations found' });
        }

        const updatedRegistrations = [];

        for (let registration of registrations) {
            const event = registration.eventId;

            // Check if event still has capacity
            if (event.currentEnrollmentCount >= event.studentEnrollmentLimit) {
                // Skip if full (maybe inform user later which ones failed)
                continue;
            }

            registration.paymentStatus = 'paid';
            registration.transactionId = transactionId || `BTXN${Date.now()}`;

            // Generate QR Code
            const qrData = registration._id.toString();
            const qrCodeUrl = await QRCode.toDataURL(qrData);
            registration.qrCode = qrCodeUrl;

            await registration.save();

            // Increment event count
            event.currentEnrollmentCount += 1;
            await event.save();

            updatedRegistrations.push(registration);
        }

        if (updatedRegistrations.length > 0) {
            sendPaymentConfirmation(req.user.email, req.user.name, updatedRegistrations);
        }

        res.json({
            message: `Successfully processed ${updatedRegistrations.length} registrations`,
            registrations: updatedRegistrations
        });
    } catch (error) {
        console.error('Bulk payment error:', error);
        res.status(500).json({ message: 'Internal server error during bulk payment' });
    }
};

// @desc    Get my registrations
// @route   GET /api/registrations/my
// @access  Private/Student
const getMyRegistrations = async (req, res) => {
    const registrations = await Registration.find({ studentId: req.user._id })
        .populate('eventId', 'eventName date time venue image fees')
        .sort({ registeredAt: -1 });
    res.json(registrations);
};

// @desc    Get registrations for an event
// @route   GET /api/registrations/event/:eventId
// @access  Private/Admin/Organizer
const getEventRegistrations = async (req, res) => {
    const registrations = await Registration.find({ eventId: req.params.eventId })
        .populate('studentId', 'name email phoneNumber department')
        .sort({ registeredAt: -1 });
    res.json(registrations);
};

// @desc    Mark attendance
// @route   PATCH /api/registrations/:id/attendance
// @access  Private/Admin/Organizer
const markAttendance = async (req, res) => {
    const { id } = req.params;
    const { eventId } = req.query; // Get eventId from query params for verification
    let registration;

    // Support both full MongoDB IDs and short 8-char simulation IDs
    if (id.length === 24) {
        registration = await Registration.findById(id);
    } else {
        // Find registration where ID ends with the provided short ID (case insensitive)
        const cleanId = id.startsWith('#') ? id.slice(1) : id;
        registration = await Registration.findOne({
            $expr: {
                $eq: [
                    { $toUpper: { $substr: [{ $toString: "$_id" }, 16, 8] } },
                    cleanId.toUpperCase()
                ]
            }
        });
    }

    if (registration) {
        // VERIFY: Does this registration belong to the event the organizer is currently scanning for?
        if (eventId && registration.eventId.toString() !== eventId) {
            return res.status(400).json({
                message: 'Invalid Ticket: This ticket belongs to a different event.'
            });
        }

        if (registration.paymentStatus !== 'paid') {
            return res.status(400).json({ message: 'Payment pending for this ticket' });
        }

        if (registration.status === 'attended') {
            return res.status(400).json({ message: 'Attendance already marked for this ticket' });
        }
        registration.status = 'attended';
        const updatedRegistration = await registration.save();
        res.json(updatedRegistration);
    } else {
        res.status(404).json({ message: 'Registration not found or Invalid ID' });
    }
};

module.exports = {
    registerForEvent,
    bulkPayment,
    getMyRegistrations,
    getEventRegistrations,
    markAttendance,
};
