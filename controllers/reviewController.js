const Place = require('../models/place');
const Review = require('../models/review');

module.exports.createReview = async(req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user.id;
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash('success', 'Successfully Posted a Review')
    res.redirect(`/places/${place.id}`);
}

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/places/${id}`);
}