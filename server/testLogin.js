const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Database...');

        const email = 'admin@gmail.com';
        const password = 'password123';

        const user = await User.findOne({ email });

        if (user) {
            console.log('User found. Comparing passwords...');
            const isMatch = await user.matchPassword(password);
            console.log('Password match result:', isMatch);
        } else {
            console.log('User not found.');
        }

        process.exit();
    } catch (error) {
        console.error(`Test failed: ${error.message}`);
        process.exit(1);
    }
};

testLogin();
