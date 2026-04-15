const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');

dotenv.config();

const updateImage = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Database...');

        const result = await Event.updateOne(
            { eventName: 'Tech Symposium 2026' },
            { $set: { image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200' } }
        );

        if (result.matchedCount > 0) {
            console.log('Successfully updated Tech Symposium image.');
        } else {
            console.log('Event not found.');
        }

        process.exit();
    } catch (error) {
        console.error(`Update failed: ${error.message}`);
        process.exit(1);
    }
};

updateImage();
