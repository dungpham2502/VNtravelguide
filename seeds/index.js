const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const Place = require('../models/place')


main().catch(err => console.log(err));

const sample = array => array[Math.floor(Math.random() * array.length)];

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/firstapp');

    const seedDb = async() => {
        await Place.deleteMany({});
        for (let i = 0; i < 50; i++) {
            const random1000 = Math.floor(Math.random() * 1000);
            const place = new Place({
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                description: "Natural landscapes aside, cultural beauty is certainly another key selling point for Sapa. The town is mainly occupied by the Hmong people, one of the regions’ largest ethnic groups. Tourists can choose to stay in ecolodges run by the Hmongs themselves and get immersed in their culture – you know, enjoying local dishes and trying local costumes.",
                images: [{
                        url: 'https://res.cloudinary.com/db7q5pap6/image/upload/v1686022324/firstapp/z19jioeoacdf4ffl1grs.jpg',
                        filename: 'firstapp/z19jioeoacdf4ffl1grs',
                    },
                    {
                        url: 'https://res.cloudinary.com/db7q5pap6/image/upload/v1686022325/firstapp/uqbufquh5dfctyhq7r1s.jpg',
                        filename: 'firstapp/uqbufquh5dfctyhq7r1s',
                    }
                ],
                cost: `${random1000}`,
                author: '647c40cf854139f526855750',
                geometry: {
                    type: "Point",
                    coordinates: [
                        cities[random1000].longitude,
                        cities[random1000].latitude
                    ]
                }
            })
            await place.save();
        }
    }

    seedDb().then(() => {
        mongoose.connection.close();
    })
}