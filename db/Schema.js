// Import Mongoose
const mongoose = require('mongoose');

// Define schema
const Schema = mongoose.Schema;

// Define URL schema
const urlSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the URL schema
module.exports = mongoose.model('URL', urlSchema);

