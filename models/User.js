const { model, Schema } = require('mongoose');

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        fullName: String,
        profilePic: {
            type: String,
            default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR86ibcPPy-oWwnthhBJowpoG7UvaS_Cfysy0MGRDWsZA&s'
        },
        visitedRestaurants: [{ type: Schema.Types.ObjectId, ref: "Restaurant" }]
    },
    {
        timestamps: true,
        timeseries: true
    }
);

module.exports = model("User", userSchema);
