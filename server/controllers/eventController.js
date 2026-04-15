const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Fetch all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        let events = await Event.find({});

        // If user is authenticated, check registration status for each event
        if (req.user && req.user.role === 'student') {
            const registrations = await Registration.find({ studentId: req.user._id });
            const registeredEventIds = registrations.map(reg => reg.eventId.toString());

            const eventsWithStatus = events.map(event => {
                const eventObj = event.toObject();
                return {
                    ...eventObj,
                    isRegistered: registeredEventIds.includes(event._id.toString())
                };
            });
            return res.json(eventsWithStatus);
        }

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        res.json(event);
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
    const {
        eventName,
        description,
        image,
        venue,
        date,
        time,
        rules,
        fees,
        studentEnrollmentLimit,
        conductedBy,
        prizes,
        organizerId, // Can be provided by admin
    } = req.body;

    const event = new Event({
        eventName,
        description,
        image,
        venue,
        date,
        time,
        rules,
        fees,
        studentEnrollmentLimit,
        conductedBy,
        prizes,
        organizerId: req.user.role === 'admin' ? (organizerId || req.user._id) : req.user._id,
    });

    const createdEvent = await event.save();
    res.status(212).json(createdEvent);
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
    // ... (rest of destructuring or req.body usage)
    const event = await Event.findById(req.params.id);

    if (event) {
        // Only allow update if Admin or the Assigned Organizer
        if (req.user.role !== 'admin' && event.organizerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        const {
            eventName,
            description,
            image,
            venue,
            date,
            time,
            rules,
            fees,
            studentEnrollmentLimit,
            conductedBy,
            prizes,
            organizerId,
            status,
        } = req.body;

        event.eventName = eventName || event.eventName;
        event.description = description || event.description;
        event.image = image || event.image;
        event.venue = venue || event.venue;
        event.date = date || event.date;
        event.time = time || event.time;
        event.rules = rules || event.rules;
        event.fees = fees || event.fees;
        event.studentEnrollmentLimit = studentEnrollmentLimit || event.studentEnrollmentLimit;
        event.conductedBy = conductedBy || event.conductedBy;
        event.prizes = prizes || event.prizes;
        event.organizerId = req.user.role === 'admin' ? (organizerId || event.organizerId) : event.organizerId;
        event.status = status || event.status;

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        // Only allow delete if Admin or the Assigned Organizer
        if (req.user.role !== 'admin' && event.organizerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }
        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
};
