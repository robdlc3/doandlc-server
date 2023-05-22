const { model, Schema } = require('mongoose');

const restaurantSchema = new Schema(
    {
        restaurantName: String,
        country: String,
        city: String,
        address: String,
        cuisine: String,
    },
    {
        timestamps: true,
        timeseries: true,
    }
);

module.exports = model("Restaurant", restaurantSchema);
