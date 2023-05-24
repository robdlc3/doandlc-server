const { model, Schema, Types } = require('mongoose');

const restaurantSchema = new Schema(
    {
        restaurantName: String,
        owner: { type: Types.ObjectId, ref: "User" },
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
