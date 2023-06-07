const Place = require('../models/place');
const { cloudinary } = require("../cloudinaryConfig");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.readPlaces = async(req, res) => {
    const places = await Place.find({});
    res.render('places/index', { places })
};

module.exports.readNewForm = (req, res) => {
    res.render('places/new');
}

module.exports.createNewPlace = async(req, res) => {
    const place = new Place(req.body.place);
    const geoData = await geocoder.forwardGeocode({
        query: place.location,
        limit: 1
    }).send()
    place.author = req.user.id;
    place.geometry = geoData.body.features[0].geometry;
    //Map the value of propeties path and filename of the requsted file to the place's image property
    const images = req.files.map(function(file) {
        return { url: file.path, filename: file.filename }
    });
    place.images = images;
    await place.save();
    console.log(place);
    req.flash('success', 'Successfully Create A Travel Spot!');
    res.redirect(`/places/${place.id}`);
}

module.exports.readIndividualPlace = async(req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            } // Nested populate author of individual review
        })
        .populate('author');
    if (!place) {
        req.flash('error', 'Cannot Find This Travel Spot!');
        return res.redirect('/places');
    }
    res.render('places/show', { place });
}

module.exports.readEditForm = async(req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
        req.flash('error', 'Cannot Find This Place!');
        return res.redirect('/places');
    }
    res.render('places/edit', { place });
}

module.exports.updatePlace = async(req, res) => {
    const { id } = req.params;
    const place = await Place.findByIdAndUpdate(id, {...req.body.place });
    const imgs = req.files.map(function(file) {
        return { url: file.path, filename: file.filename }
    });
    place.images.push(...imgs);
    await place.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await place.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully Update This Place')
    res.redirect(`/places/${id}`)
}

module.exports.destroyPlace = async(req, res) => {
    const { id } = req.params;
    const place = await Place.findByIdAndDelete(id);
    req.flash('success', 'Successfully Delete This Place')
    res.redirect('/places');
}