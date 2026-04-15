const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    qrCode: {
        type: String,
    },
    status: {
        type: String,
        enum: ['registered', 'attended'],
        default: 'registered',
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
    },
    transactionId: {
        type: String,
    }
});

registrationSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);
module.exports = Registration;
