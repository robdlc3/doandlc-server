const { model, Schema } = require('mongoose');

const restaurantSchema = new Schema(
    {
        restaurantName: String,
        country: String,
        city: String,
        address: String,
        review: String,
        description: String,
        image: String,
    },
    {
        timestamps: true,
        timeseries: true,
    }
);


module.exports = model("Restaurant", restaurantSchema);
