const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    rules: {
        type: String,
    },
    fees: {
        type: Number,
        required: true,
    },
    studentEnrollmentLimit: {
        type: Number,
        required: true,
    },
    currentEnrollmentCount: {
        type: Number,
        default: 0,
    },
    conductedBy: {
        type: String,
    },
    prizes: {
        type: String,
    },
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
