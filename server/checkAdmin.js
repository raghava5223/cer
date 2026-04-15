const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Database...');

        const admin = await User.findOne({ email: 'admin@gmail.com' });
        if (admin) {
            console.log('Admin user found:');
            console.log('Name:', admin.name);
            console.log('Email:', admin.email);
            console.log('Role:', admin.role);
            console.log('Password Hash exists:', !!admin.password);
        } else {
            console.log('Admin user NOT found in database.');
        }

        process.exit();
    } catch (error) {
        console.error(`Check failed: ${error.message}`);
        process.exit(1);
    }
};

checkAdmin();
