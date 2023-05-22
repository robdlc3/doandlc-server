const { model, Schema } = require('mongoose')

const postSchema = new Schema(
    {
        title: String,
        story: String,
        image: String,
        restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant" },
        author: { type: Schema.Types.ObjectId, ref: "User" },
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }]
    },
    {
        timestamps: true,
        timeseries: true
    }
)

module.exports = model("Post", postSchema)