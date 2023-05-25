var express = require('express');
var router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated')
const Review = require('../models/Review')
const Comment = require('../models/Comment')

router.get('/', (req, res, next) => {
    Review.find()
        .populate("restaurant author reviews") // Added "reviews" field to populate
        .populate({
            path: "comments",
            populate: { path: "author" },
        })
        .sort({ createdAt: -1 })
        .then((foundReviews) => {
            res.json(foundReviews);
        })
        .catch((err) => {
            console.log(err);
        });
})

router.get('/detail/:id', (req, res, next) => {

    Review.findById(req.params.id)
        .populate('restaurant')
        .populate('author')
        .populate({
            path: 'comments',
            populate: { path: 'author' }
        })
        .populate('likes')
        .then((foundReview) => {
            res.json(foundReview)
        })
        .catch((err) => {
            console.log(err)
        })

})

router.post('/create', isAuthenticated, (req, res, next) => {
    const { title, story, image } = req.body;
    Review.create({
        title,
        story,
        image,
        author: req.user._id,
    })
        .then((createdReview) => {
            return createdReview.populate("author").execPopulate();
        })
        .then((populated) => {
            res.json(populated)
        })
        .catch((err) => {
            console.log(err);
        });
})

router.post('/:id', (req, res, next) => {

    Review.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true
        })
        .then((updatedReview) => {
            res.json(updatedReview)
        })
        .catch((err) => {
            console.log(err)
        })

})

router.get('/delete/:id', (req, res, next) => {

    Review.findByIdAndDelete(req.params.id)
        .then((deletedResult) => {
            res.json(deletedResult)
        })
        .catch((err) => {
            console.log(err)
        })

})


router.post('/add-review/:id', isAuthenticated, (req, res, next) => {
    const { review } = req.body;
    const { id } = req.params;
    console.log(req.body, "yoooo!")
    Review.create({
        ...req.body,
        author: req.user._id
    })
        .then((createdReview) => {
            console.log(createdReview, "hello!")
            return Review.findByIdAndUpdate(
                createdReview._id,
                req.body,
                { new: true }
            )
                .populate('reviews')
                .populate({
                    path: 'reviews',
                    populate: { path: 'author' }
                }).then((updatedReview) => {
                    res.json(updatedReview)
                })
        })
        .then((updatedReview) => {
            console.log({ updatedReview })
            res.json(updatedReview);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'No comment' });
        });
});

module.exports = router;