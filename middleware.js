const { placeSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utilities/ExpressError');
const flash = require('connect-flash');
const Place = require('./models/place');
const Review = require('./models/review');

module.exports.validatePlace = function(req, res, next) {
    const { error } = placeSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details[0].message, 400); // Pass error to custom handler
    } else {
        next();
    }
}

module.exports.validateReview = function(req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details[0].message, 400); // Pass error to custom handler
    } else {
        next();
    }
}


//Store variables in "res.locals" object that can be accessed in every template
module.exports.flashMessages = function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
}

module.exports.isLoggedIn = function(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // Store the originalUrl before login in the "returnTo" property of session
        req.flash('error', 'You Must Be Signed In!');
        return res.redirect('/login');
    }
    next();
}

//Store the value of req.session.returnTo inside a local variable because the session clears up after login
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthorized = async function(req, res, next) {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place.author.equals(req.user.id)) {
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/places/${id}`);
    }
    next();
}

//Check if the author is authorized to post/delete a review
module.exports.isReviewAuthorized = async function(req, res, next) {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user.id)) {
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/places/${id}`);
    }
    next();
}