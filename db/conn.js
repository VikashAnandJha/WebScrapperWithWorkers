// Import Mongoose
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async (mongoURI) => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Connection to MongoDB failed:', error.message);
        process.exit(1); // Exit process with failure
    }
};

// Export the connectDB function
module.exports = connectDB;
