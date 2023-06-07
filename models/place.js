const mongoose = require('mongoose');
const opts = { toJSON: { virtuals: true } };

const imageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

const placeSchema = new mongoose.Schema({
    title: String,
    cost: Number,
    description: String,
    location: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: mongoose.Types.ObjectId,
        ref: 'Review'
    }]

}, opts);

placeSchema.virtual('properties.popMarkUp').get(function() {
    return `<a href="/places/${this.id}">${this.title}</a>`
})

module.exports = mongoose.model('Place', placeSchema)