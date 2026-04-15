const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            bufferCommands: false, // Stop the 10-second wait
            serverSelectionTimeoutMS: 5000, // Fail after 5 seconds if no DB found
        });
        isConnected = !!conn.connections[0].readyState;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Ensure isConnected is false so it tries again next time
        isConnected = false;
        throw error; // Throw so the middleware catches it
    }
};

module.exports = connectDB;
