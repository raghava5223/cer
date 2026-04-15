const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        isConnected = !!conn.connections[0].readyState;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
    }
};

module.exports = connectDB;
