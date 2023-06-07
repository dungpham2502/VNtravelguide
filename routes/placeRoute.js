const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { validatePlace, isLoggedIn, isAuthorized } = require('../middleware');
const placeController = require('../controllers/placeController');
const multer = require('multer');
const { storage } = require('../cloudinaryConfig');
const upload = multer({ storage });

const flash = require('connect-flash');

router.route('/')
    .get(catchAsync(placeController.readPlaces))
    .post(isLoggedIn, upload.array('image'), validatePlace, catchAsync(placeController.createNewPlace))


router.get('/new', isLoggedIn, placeController.readNewForm)

router.route('/:id')
    .get(catchAsync(placeController.readIndividualPlace))
    .put(isLoggedIn, isAuthorized, upload.array('image'), validatePlace, catchAsync(placeController.updatePlace))
    .delete(isLoggedIn, isAuthorized, catchAsync(placeController.destroyPlace))


router.get('/:id/edit', isLoggedIn, isAuthorized, catchAsync(placeController.readEditForm))


module.exports = router;