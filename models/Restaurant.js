const { model, Schema } = require('mongoose')
const restaurant Schema(

    {
        restaurantName: String,
        country: String,
        city: String,
        address: String,
        cuisine: String,
    },

    {
        timestamps: true,
        timeseries: true
    }
)

module.exports = model("Restaurant", restaurantSchema)

