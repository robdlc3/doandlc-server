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

            Restaurant.create({ ...req.body, owner: req.user._id })
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

router.post('/:id', isAuthenticated, (req, res, next) => {

    Restaurant.findById(req.params.id)
        .then((restaurant) => {
            console.log("restaurante",restaurant.owner, "user", req.user._id)
            if (String(restaurant.owner) === req.user._id) {
                Restaurant.findByIdAndUpdate(restaurant._id, req.body, { new: true }).then((updatedRestaurant) => {
                    res.status(200).json(updatedRestaurant)
                })
            } else { res.status(401).json({ msg: "You are not authorized" }) }
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