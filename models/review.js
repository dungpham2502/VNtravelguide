const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: Number,
    text: String,
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Review', reviewSchema)