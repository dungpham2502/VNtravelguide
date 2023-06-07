const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthorized } = require('../middleware');
const reviewController = require('../controllers/reviewController')


router.post('/', validateReview, isLoggedIn, catchAsync(reviewController.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthorized, validateReview, catchAsync(reviewController.deleteReview))

module.exports = router;