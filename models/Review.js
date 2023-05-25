const { model, Schema } = require('mongoose')

const reviewSchema = new Schema(
    {
        title: String,
        story: String,
        image: String,
        restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant" },
        author: { type: Schema.Types.ObjectId, ref: "User" },
        reviews: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }]
    },
    {
        timestamps: true,
        timeseries: true
    }
)

module.exports = model("Review", reviewSchema)