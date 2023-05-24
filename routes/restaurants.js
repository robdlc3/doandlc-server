var express = require('express');
var router = express.Router();
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated');

router.post("/create", isAuthenticated, (req, res, next) => {
    console.log("req body", req.body);

    Restaurant.findOne({ restaurantName: req.body.restaurantName })
        .then((foundRestaurant) => {
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
                    console.log(createdRestaurant, "RESTAURANT!")
                    User.findByIdAndUpdate(
                        req.user._id,
                        {
                            $push: { visitedRestaurants: createdRestaurant._id },
                        },
                        { new: true }
                    )
                        .populate('visitedRestaurants')
                        .then((updatedUser) => {
                            res.json({ updatedUser, createdRestaurant });
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

router.get('/detail/:id', (req, res, next) => {
    console.log(req.params.id, "hi!")
    Restaurant.find({ _id: req.params.id })
        .then((foundRestaurant) => {
            console.log(foundRestaurant, "found restaurant!")
            res.json(foundRestaurant)
        })
        .catch((err) => {
            console.log(err)
        })
})

router.delete('/:id', isAuthenticated, (req, res, next) => {
    Restaurant.findByIdAndDelete(req.params.id)
        .then(() => {
            // Delete the reference of the restaurant from users' visitedRestaurants array
            User.updateMany(
                { visitedRestaurants: req.params.id },
                { $pull: { visitedRestaurants: req.params.id } }
            )
                .then(() => {
                    res.json({ message: 'Restaurant deleted' });
                })
                .catch((err) => {
                    console.log(err);
                    next(err);
                });
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
});

module.exports = router;