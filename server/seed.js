const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected to seed data...');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Event.deleteMany();

        console.log('Existing data cleared.');

        // Create Users
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@gmail.com',
            password: 'password123',
            role: 'admin',
        });

        const organizer = await User.create({
            name: 'Event Coordinator',
            email: 'organizer@gmail.com',
            password: 'password123',
            role: 'organizer',
        });

        const student = await User.create({
            name: 'John Student',
            email: 'student@gmail.com',
            password: 'password123',
            role: 'student',
        });

        console.log('Users seeded: admin@gmail.com, organizer@gmail.com, student@gmail.com (pwd: password123)');

        // Create events
        await Event.create([
            {
                eventName: 'Tech Symposium 2026',
                description: 'Annual technical symposium with workshops and hackathons.',
                image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
                venue: 'Main Auditorium',
                date: new Date('2026-03-15'),
                time: '10:00 AM',
                fees: 500,
                studentEnrollmentLimit: 200,
                organizerId: organizer._id,
                conductedBy: 'Engineering Department',
            },
            {
                eventName: 'Cultural Fest',
                description: 'Celebrating diversity through music, dance, and art.',
                image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
                venue: 'Open Air Theater',
                date: new Date('2026-04-20'),
                time: '5:00 PM',
                fees: 200,
                studentEnrollmentLimit: 500,
                organizerId: organizer._id,
                conductedBy: 'Cultural Committee',
            },
            {
                eventName: 'Sports Meet',
                description: 'Inter-college sports competition.',
                image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800',
                venue: 'College Grounds',
                date: new Date('2026-05-10'),
                time: '8:00 AM',
                fees: 100,
                studentEnrollmentLimit: 1000,
                organizerId: organizer._id,
                conductedBy: 'Sports Department',
            }
        ]);

        console.log('Sample events seeded.');
        process.exit();
    } catch (error) {
        console.error(`Seeding failed: ${error.message}`);
        process.exit(1);
    }
};

seedData();
