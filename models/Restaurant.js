const { model, Schema } = require('mongoose')



const restaurant Schema(

    {



    },

    {

        timestamps: true,

        timeseries: true

    }

)



module.exports = model("Restaurant", restaurantSchema)