const mongoose = require("mongoose");
// const Review=require("./reviews.js");
const schema = mongoose.Schema;

const listingSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: { type: String },
        url: { type: String}
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:"Review",
        }
    ]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;