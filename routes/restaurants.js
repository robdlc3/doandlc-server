var express = require('express');
var router = express.Router();
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated');

router.post("/create", isAuthenticated, (req, res, next) => {
    console.log("req body", req.body);

    Restaurant.findOne({ restaurant_id: req.body.restaurant_id })
        .then((foundRestaurant) => {
            console.log("line 17");
            console.log("found RESTAURANT", foundRestaurant);

            if (foundRestaurant) {
                User.findByIdAndUpdate(
                    req.user._id,
                    {
                        $addToSet: { visitedRestaurants: foundRestaurant._id },
                    },
                    { new: true }
                )
                    .populate('visitedRestaurants')
                    .then((updatedUser) => {
                        res.json(updatedUser);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                return;
            }

            console.log("Can't find restaunt");

            Restaurant.create(req.body)
                .then((createdRestaurant) => {
                    User.findByIdAndUpdate(
                        req.user._id,
                        {
                            $push: { visitedRestaurants: createdRestaurant._id },
                        },
                        { new: true }
                    )
                        .populate('visitedRestaurants')
                        .then((updatedUser) => {
                            res.json(updatedUser);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

router.get('/', (req, res, next) => {
    Restaurant.find()
        .then((foundRestaurant) => {
            res.json(foundRestaurant)
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/detail/:name', (req, res, next) => {
    Restaurant.find({ commonName: req.params.name })
        .then((foundRestaurant) => {
            res.json(foundRestaurant)
        })
        .catch((err) => {
            console.log(err)
        })
})


module.exports = router;