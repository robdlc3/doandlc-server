var express = require('express');
var router = express.Router();
const Restaurant = require('../models/Restaurant');

/* GET home page. */
router.post('/create', (req, res, next) => {
    Restaurant.findOne({ restaurantName: req.body.restaurantName })
        .then((foundRestaurant) => {
            if (!foundRestaurant) {
                Restaurant.create(req.body)
                    .then((createdRestaurant) => {
                        res.json(createdRestaurant);
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({ error: 'Failed to create restaurant.' });
                    });
            } else {
                res.status(409).json({ error: 'Restaurant already exists.' });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Failed to find restaurant.' });
        });
});

router.get('/detail/:name', (req, res, next) => {
    Restaurant.find({ restaurantName: req.params.restaurantName })
        .then((foundRestaurant) => {
            res.json(foundRestaurant)
        })
        .catch((err) => {
            console.log(err)
        })

})
module.exports = router;
