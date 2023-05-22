const { model, Schema } = require('mongoose')



const comment Schema(

    {
        comment: String,
        author: { type: Schema.Types.ObjectId, ref: "User" }
    },

    {

        timestamps: true,
        timeseries: true

    }

)



module.exports = model("Comment", commentSchema)