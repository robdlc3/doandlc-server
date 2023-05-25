var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors')

var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var restaurantsRouter = require('./routes/restaurants');
var reviewsRouter = require('./routes/reviews');
var photoRouter = require('./routes/photo')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);
app.enable('trust proxy');

app.use(
    cors({
        origin: ['https://doandlc.netlify.app']  // <== URL of our future React app
    })
);

// app.use(
//     cors({
//         origin: ['http://localhost:3000']  // <== URL of our future React app
//     })
// );


app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/reviews', reviewsRouter);
app.use('/photo', photoRouter);

mongoose
    .connect(process.env.MONGODB_URI)
    .then((x) => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
    })
    .catch((err) => {
        console.error("Error connecting to mongo: ", err);
    });

module.exports = app;
